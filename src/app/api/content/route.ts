import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import SiteContent from '@/models/Content';
import { hasPermission, getSessionUser } from '@/lib/rbac';
import { recordActivity } from '@/lib/logger';
import { sanitizeEncoding } from '@/lib/utils';

// Never cache: every admin editor loads this blob, edits a slice, and PUTs the whole
// thing back. A 60s-cached GET meant a reload (or another admin page) got the OLD blob
// and the next save silently reverted the previous edit.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_STORE = { 'Cache-Control': 'no-store, no-cache, max-age=0, must-revalidate' };

// Every admin editor loads this blob, edits a slice and PUTs the WHOLE blob back. To stop a stale
// editor (another tab / page left open) from reverting edits made elsewhere, GET stamps the blob
// with the revision it was read at (`__rev`) and keeps a snapshot of each revision, so PUT can
// 3-way merge: only top-level sections the editor actually CHANGED overwrite the live data.
const REV_KEY = (rev: number | string) => `complete_data_rev_${rev}`;
const REV_KEEP = 25;

export async function GET() {
  try {
    await connectToDatabase();

    // Target the specific key we seeded
    const content = await SiteContent.findOne({ key: 'complete_data' }).lean() as any;

    if (!content) {
      console.warn('Content not found in MongoDB, key: complete_data');
      return NextResponse.json({ error: 'Content not found' }, { status: 404, headers: NO_STORE });
    }

    const rev = content.lastUpdated ? new Date(content.lastUpdated).getTime() : 0;
    if (rev) {
      try {
        // Ensure the revision this client is about to edit from can be used as a merge base later.
        await SiteContent.updateOne(
          { key: REV_KEY(rev) },
          { $setOnInsert: { data: content.data, lastUpdated: new Date(rev) } },
          { upsert: true }
        );
      } catch (e) {
        console.error('Failed to snapshot content revision:', e);
      }
    }

    return NextResponse.json({ ...content.data, __rev: rev }, { headers: NO_STORE });
  } catch (error: any) {
    console.error('Content fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!(await hasPermission(req, 'settings', 'update'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    await connectToDatabase();
    const body = await req.json();
    const sanitizedBody = sanitizeEncoding(body);

    const oldContent = await SiteContent.findOne({ key: 'complete_data' });
    const liveData: any = oldContent?.data || {};
    const liveRev = oldContent?.lastUpdated ? new Date(oldContent.lastUpdated).getTime() : 0;

    const { __rev: clientRev, ...clientData } = sanitizedBody || {};
    let finalData: any = clientData;

    // Stale client (it loaded revision N but the live doc has moved on): merge instead of clobber.
    if (clientRev && liveRev && Number(clientRev) !== liveRev) {
      const base: any = await SiteContent.findOne({ key: REV_KEY(clientRev) }).lean();
      if (base?.data) {
        finalData = { ...liveData };
        const keys = new Set<string>([...Object.keys(clientData), ...Object.keys(base.data)]);
        const isObj = (v: any) => v && typeof v === 'object' && !Array.isArray(v);
        const differs = (a: any, b: any) => JSON.stringify(a) !== JSON.stringify(b);
        keys.forEach((k) => {
          if (!differs(clientData[k], base.data[k])) return; // untouched by this editor -> keep live value
          if (!(k in clientData)) { delete finalData[k]; return; }
          // Sections shared by several editors (services, testimonials, faq...) hold independent
          // sub-keys, so merge those one level deeper instead of replacing the whole section.
          if (isObj(clientData[k]) && isObj(base.data[k]) && isObj(liveData[k])) {
            const merged: any = { ...liveData[k] };
            new Set([...Object.keys(clientData[k]), ...Object.keys(base.data[k])]).forEach((sk) => {
              if (!differs(clientData[k][sk], base.data[k][sk])) return;
              if (sk in clientData[k]) merged[sk] = clientData[k][sk];
              else delete merged[sk];
            });
            finalData[k] = merged;
          } else {
            finalData[k] = clientData[k];
          }
        });
      }
    }

    // The services list is owned by /admin/services only (it sends X-Content-Scope: services).
    // Never let another editor's copy of `services.services` replace the live list.
    const liveServices = liveData?.services?.services;
    if (req.headers.get('x-content-scope') !== 'services' && Array.isArray(liveServices)) {
      finalData.services = { ...(finalData.services || {}), services: liveServices };
    }

    const now = new Date();
    const result = await SiteContent.updateOne(
      { key: 'complete_data' },
      { $set: { data: finalData, lastUpdated: now } },
      { upsert: true }
    );

    // Keep a snapshot of the new revision (merge base for the next stale writer) and prune old ones.
    try {
      await SiteContent.updateOne(
        { key: REV_KEY(now.getTime()) },
        { $set: { data: finalData, lastUpdated: now } },
        { upsert: true }
      );
      const stale = await SiteContent.find({ key: /^complete_data_rev_/ })
        .sort({ lastUpdated: -1 }).skip(REV_KEEP).select('_id').lean();
      if (stale.length) await SiteContent.deleteMany({ _id: { $in: stale.map((d: any) => d._id) } });
    } catch (e) {
      console.error('Failed to store content revision snapshot:', e);
    }

    await recordActivity({
      user: (session as any).userId,
      userName: (session as any).username,
      action: 'UPDATE_SETTINGS',
      entity: 'Settings',
      details: {
        before: { siteTitle: oldContent?.data?.settings?.siteTitle },
        after: { siteTitle: finalData?.settings?.siteTitle },
        message: 'Updated site settings and global content'
      },
      ip: req.headers.get('x-forwarded-for') || (req as any).ip || 'unknown'
    });

    try {
      const Page = (await import('@/models/Page')).default;
      // updateMany: duplicated / alternate home docs must not keep a frozen snapshot of the blob.
      await Page.updateMany(
        { $or: [{ slug: 'home' }, { slug: '/' }, { template: 'home' }] },
        { $set: { content: finalData, updatedAt: new Date() } }
      );
      // The Reviews page record keeps a full copy of the reviews + summary (visible in the database); the public page
      // always reads the master list, this copy just mirrors it on every save.
      const t = finalData?.testimonials;
      if (t && Array.isArray(t.testimonials)) {
        await Page.updateMany(
          { template: 'reviews' },
          { $set: {
              'content.testimonials.testimonials': t.testimonials,
              'content.testimonials.stats': t.stats || {},
              'content.testimonials.googleRating': t.googleRating,
              'content.testimonials.googleReviewCount': t.googleReviewCount,
              updatedAt: new Date(),
          } }
        );
      }
    } catch (pageErr) {
      console.error('Failed to sync content to home Page doc:', pageErr);
    }

    const { revalidatePath } = await import('next/cache');
    // The global content blob feeds the root layout (navbar/footer/provider) of EVERY route,
    // so purge the whole tree instead of a hand-maintained list of paths that drifts out of
    // date (and missed e.g. the catch-all service pages without a trailing slash).
    revalidatePath('/', 'layout');

    // Belt and braces for the catch-all service URLs (/deep-tissue-massage-maryland/) —
    // revalidate each explicitly, with and without the trailing slash.
    const serviceSlugs: string[] = (finalData?.services?.services || [])
      .map((s: any) => s?.slug)
      .filter(Boolean);
    for (const slug of serviceSlugs) {
      revalidatePath(`/${slug}`);
      revalidatePath(`/${slug}/`);
    }

    return NextResponse.json({ success: true, result, rev: now.getTime() }, { headers: NO_STORE });
  } catch (error: any) {
    console.error('Content update error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
