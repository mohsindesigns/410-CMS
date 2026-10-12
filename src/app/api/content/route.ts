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

export async function GET() {
  try {
    await connectToDatabase();

    // Target the specific key we seeded
    const content = await SiteContent.findOne({ key: 'complete_data' }).lean() as any;

    if (!content) {
      console.warn('Content not found in MongoDB, key: complete_data');
      return NextResponse.json({ error: 'Content not found' }, { status: 404, headers: NO_STORE });
    }

    return NextResponse.json(content.data, { headers: NO_STORE });
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

    const result = await SiteContent.updateOne(
      { key: 'complete_data' },
      { 
        $set: { 
          data: sanitizedBody,
          lastUpdated: new Date()
        } 
      },
      { upsert: true }
    );

    await recordActivity({
      user: (session as any).userId,
      userName: (session as any).username,
      action: 'UPDATE_SETTINGS',
      entity: 'Settings',
      details: {
        before: { siteTitle: oldContent?.data?.settings?.siteTitle },
        after: { siteTitle: body?.settings?.siteTitle },
        message: 'Updated site settings and global content'
      },
      ip: req.headers.get('x-forwarded-for') || (req as any).ip || 'unknown'
    });

    try {
      const Page = (await import('@/models/Page')).default;
      await Page.updateOne(
        { $or: [{ slug: 'home' }, { slug: '/' }, { template: 'home' }] },
        { $set: { content: sanitizedBody, updatedAt: new Date() } }
      );
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
    const serviceSlugs: string[] = (sanitizedBody?.services?.services || [])
      .map((s: any) => s?.slug)
      .filter(Boolean);
    for (const slug of serviceSlugs) {
      revalidatePath(`/${slug}`);
      revalidatePath(`/${slug}/`);
    }

    return NextResponse.json({ success: true, result }, { headers: NO_STORE });
  } catch (error: any) {
    console.error('Content update error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
