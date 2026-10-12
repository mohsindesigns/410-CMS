import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Page from '@/models/Page';
import { hasPermission, getSessionUser } from '@/lib/rbac';
import { recordActivity } from '@/lib/logger';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await hasPermission(req, 'pages', 'read'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  try {
    const { id } = await params;
    await connectToDatabase();
    const page = await Page.findById(id);
    if (!page) return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    return NextResponse.json(page);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionUser(req);
  if (!(await hasPermission(req, 'pages', 'update'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { slug, title, template, status, seo, content, isTrashed } = body;

    await connectToDatabase();
    const oldPage = await Page.findById(id);
    if (!oldPage) return NextResponse.json({ error: 'Page not found' }, { status: 404 });

    // Snapshot the old data before update
    const beforeState: any = { 
      title: oldPage.title, 
      status: oldPage.status, 
      slug: oldPage.slug,
      template: oldPage.template,
      seo: oldPage.seo,
      content: oldPage.content,
      isTrashed: oldPage.isTrashed
    };

    const updateData = { ...body };
    if (body.isTrashed !== undefined) {
      updateData.isTrashed = body.isTrashed;
      updateData.trashedAt = body.isTrashed ? new Date() : null;
    }

    const updatedPage = await Page.findByIdAndUpdate(id, updateData, { new: true });

    await recordActivity({
      user: (session as any).userId,
      userName: (session as any).username,
      action: 'UPDATE_PAGE',
      entity: 'Page',
      entityId: id,
      details: { before: oldPage?.title || 'Unknown', after: updatedPage?.title || 'Unknown' },
      ip: req.headers.get('x-forwarded-for') || (req as any).ip || 'unknown'
    });

    if (updatedPage && (updatedPage.template === 'home' || updatedPage.slug === '/' || updatedPage.slug === 'home') && content) {
      try {
        const SiteContent = (await import('@/models/Content')).default;
        const currentSiteDoc = await SiteContent.findOne({ key: 'complete_data' });
        const liveData = currentSiteDoc?.data || {};
        const mergedData: any = { ...liveData, ...content };
        // The services list is owned by /admin/services. The home editor holds a snapshot loaded
        // earlier, so writing its copy back would silently revert every service edit made since.
        if (Array.isArray(liveData?.services?.services)) {
          mergedData.services = { ...(content?.services || {}), services: liveData.services.services };
        }
        await SiteContent.updateOne(
          { key: 'complete_data' },
          { $set: { data: mergedData, lastUpdated: new Date() } },
          { upsert: true }
        );
      } catch (err) {
        console.error('Failed to sync page content to complete_data:', err);
      }
    }

    if (updatedPage && updatedPage.slug) {
      try {
        const { revalidatePath } = await import('next/cache');
        // Whole tree: navbar/footer/layout data are baked into every cached route, and
        // trailingSlash is on, so also hit the explicit URLs (new and previous slug).
        revalidatePath('/', 'layout');
        for (const s of [updatedPage.slug, oldPage.slug]) {
          if (!s) continue;
          const p = s.startsWith('/') ? s : `/${s}`;
          revalidatePath(p);
          revalidatePath(p.endsWith('/') ? p : `${p}/`);
        }
      } catch (err) {
        console.error('Failed to revalidate path:', err);
      }
    }

    return NextResponse.json(updatedPage);
  } catch (error: any) {
    console.error('Page update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionUser(req);
  if (!(await hasPermission(req, 'pages', 'delete'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { id } = await params;
    await connectToDatabase();
    const deletedPage = await Page.findByIdAndDelete(id);
    if (!deletedPage) return NextResponse.json({ error: 'Page not found' }, { status: 404 });

    try {
      const { revalidatePath } = await import('next/cache');
      revalidatePath('/', 'layout');
    } catch (err) {
      console.error('Failed to revalidate after delete:', err);
    }

    await recordActivity({
      user: (session as any).userId,
      userName: (session as any).username,
      action: 'DELETE_PAGE',
      entity: 'Page',
      entityId: id,
      details: { message: `Deleted page: ${deletedPage?.title || 'Unknown'}` },
      ip: req.headers.get('x-forwarded-for') || (req as any).ip || 'unknown'
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Page delete error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
