import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Redirect from '@/models/Redirect';
import SiteContent from '@/models/Content';
import Page from '@/models/Page';
import Post from '@/models/Post';
import { hasPermission, getSessionUser } from '@/lib/rbac';
import { recordActivity } from '@/lib/logger';

// Helper to normalize path for loop checking
function normalizePathForLoopCheck(urlStr: string) {
  if (!urlStr) return '';
  let path = urlStr;
  try {
    if (urlStr.startsWith('http://') || urlStr.startsWith('https://')) {
      const u = new URL(urlStr);
      path = u.pathname + u.search;
    }
  } catch {}
  
  let p = path.trim().toLowerCase();
  if (p !== '/' && p.endsWith('/')) {
    p = p.slice(0, -1);
  }
  if (!p.startsWith('/')) {
    p = '/' + p;
  }
  return p;
}


// Rules that would break the site: invalid or over-broad regex, redirecting core pages, or hiding a live page.
async function validateRedirectRule(sourceUrl: string, isRegex: boolean, active: boolean): Promise<string | null> {
  const CORE = ['/', '/services', '/blogs', '/privacy', '/terms', '/gallery'];
  const samples = ['/', '/services/', '/blogs/', '/privacy/', '/terms/', '/gallery/', '/reviews/', '/faq/'];
  if (isRegex) {
    let re: RegExp;
    try { re = new RegExp(sourceUrl, 'i'); } catch { return 'The regular expression is not valid.'; }
    if (re.test('')) return 'This pattern matches an empty path - it would redirect every URL.';
    const hit = samples.find((p) => re.test(p));
    if (hit) return `This pattern is too broad: it matches ${hit}, an important page of your site. Anchor it (start with ^ and end with $).`;
    return null;
  }
  const norm = normalizePathForLoopCheck(sourceUrl);
  if (CORE.includes(norm)) return `${norm} is a core page - it cannot be redirected.`;
  if (!active) return null;
  // do not allow a redirect to hide a page that is live (the redirect would win and the page become unreachable)
  const slug = norm.replace(/^\//, '');
  const [content, page, post] = await Promise.all([
    SiteContent.findOne({ key: 'complete_data' }, { 'data.services.services.slug': 1, 'data.services.services.status': 1, 'data.services.services.isTrashed': 1 }).lean() as any,
    Page.findOne({ slug, status: 'published', isTrashed: { $ne: true } }, { _id: 1 }).lean(),
    slug.startsWith('blogs/') ? Post.findOne({ slug: slug.replace(/^blogs\//, ''), status: 'published', isTrashed: { $ne: true } }, { _id: 1 }).lean() : Promise.resolve(null),
  ]);
  const svc = (content?.data?.services?.services || []).find((s: any) => s?.slug === slug && s.status !== 'draft' && !s.isTrashed);
  if (svc || page || post) return `A live page already exists at ${norm}. Unpublish or delete it first, otherwise the redirect would make it unreachable.`;
  return null;
}

// Loop checker algorithm
async function isRedirectLoop(sourceUrl: string, targetUrl: string, excludeId?: string): Promise<boolean> {
  const normSource = normalizePathForLoopCheck(sourceUrl);
  const normTarget = normalizePathForLoopCheck(targetUrl);

  if (normSource === normTarget) {
    return true; // Direct self-redirect
  }

  // Fetch all active redirects
  const redirects = await Redirect.find({ status: 'active' }).lean();

  // Build the redirect map: source -> target
  const redirectMap = new Map<string, string>();
  for (const r of redirects) {
    if (excludeId && r._id.toString() === excludeId) continue;
    redirectMap.set(normalizePathForLoopCheck(r.sourceUrl), normalizePathForLoopCheck(r.targetUrl));
  }

  // Add the proposed redirect
  redirectMap.set(normSource, normTarget);

  // Traverse redirect path starting from normTarget to see if it reaches normSource
  let current = normTarget;
  const visited = new Set<string>([normSource]);

  while (current) {
    if (visited.has(current)) {
      return true; // Cycle detected!
    }
    visited.add(current);
    const next = redirectMap.get(current);
    if (!next) break;
    current = next;
  }

  return false;
}

export async function GET(req: NextRequest) {
  if (!(await hasPermission(req, 'settings', 'read'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    await connectToDatabase();
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const type = searchParams.get('type') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const skip = (page - 1) * limit;

    const query: any = {};

    if (search) {
      query.$or = [
        { sourceUrl: { $regex: search, $options: 'i' } },
        { targetUrl: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      query.status = status;
    }

    if (type) {
      query.statusCode = parseInt(type, 10);
    }

    const total = await Redirect.countDocuments(query);
    const items = await Redirect.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error: any) {
    console.error('Redirect CRUD list error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!(await hasPermission(req, 'settings', 'update'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    await connectToDatabase();
    const body = await req.json();
    const { sourceUrl, targetUrl, statusCode, queryParamMode, ignoreCase, ignoreSlash, isRegex, status, notes } = body;

    if (!sourceUrl || !targetUrl) {
      return NextResponse.json({ error: 'Source URL and Target URL are required' }, { status: 400 });
    }

    // Loop checks
    if (normalizePathForLoopCheck(sourceUrl) === normalizePathForLoopCheck(targetUrl)) {
      return NextResponse.json({ error: 'A URL cannot redirect to itself.' }, { status: 400 });
    }

    const ruleError = await validateRedirectRule(sourceUrl, !!isRegex, (status || 'active') === 'active');
    if (ruleError) {
      return NextResponse.json({ error: ruleError }, { status: 400 });
    }

    const hasLoop = await isRedirectLoop(sourceUrl, targetUrl);
    if (hasLoop) {
      return NextResponse.json({ error: 'Redirect loop detected. This redirection would create a circular loop.' }, { status: 400 });
    }

    const newRedirect = await Redirect.create({
      sourceUrl,
      targetUrl,
      statusCode: statusCode ? parseInt(statusCode, 10) : 301,
      queryParamMode: queryParamMode || 'ignore',
      ignoreCase: ignoreCase !== undefined ? !!ignoreCase : true,
      ignoreSlash: ignoreSlash !== undefined ? !!ignoreSlash : true,
      isRegex: !!isRegex,
      status: status || 'active',
      notes: notes || ''
    });

    await recordActivity({
      user: (session as any).userId,
      userName: (session as any).username,
      action: 'CREATE_REDIRECT',
      entity: 'Redirect',
      entityId: newRedirect._id.toString(),
      details: { after: newRedirect.toObject(), message: `Created redirect from ${sourceUrl} to ${targetUrl}` },
      ip: req.headers.get('x-forwarded-for') || (req as any).ip || 'unknown'
    });

    return NextResponse.json(newRedirect);
  } catch (error: any) {
    console.error('Redirect CRUD create error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
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
    const { _id, sourceUrl, targetUrl, statusCode, queryParamMode, ignoreCase, ignoreSlash, isRegex, status, notes } = body;

    if (!_id) {
      return NextResponse.json({ error: 'Redirect ID is required' }, { status: 400 });
    }

    const existingRedirect = await Redirect.findById(_id);
    if (!existingRedirect) {
      return NextResponse.json({ error: 'Redirect not found' }, { status: 404 });
    }

    // Loop checks
    if (normalizePathForLoopCheck(sourceUrl) === normalizePathForLoopCheck(targetUrl)) {
      return NextResponse.json({ error: 'A URL cannot redirect to itself.' }, { status: 400 });
    }

    const ruleError = await validateRedirectRule(sourceUrl, !!isRegex, (status || 'active') === 'active');
    if (ruleError) {
      return NextResponse.json({ error: ruleError }, { status: 400 });
    }

    const hasLoop = await isRedirectLoop(sourceUrl, targetUrl, _id);
    if (hasLoop) {
      return NextResponse.json({ error: 'Redirect loop detected. This redirection would create a circular loop.' }, { status: 400 });
    }

    const beforeState = existingRedirect.toObject();

    existingRedirect.sourceUrl = sourceUrl;
    existingRedirect.targetUrl = targetUrl;
    existingRedirect.statusCode = statusCode ? parseInt(statusCode, 10) : 301;
    existingRedirect.queryParamMode = queryParamMode || 'ignore';
    existingRedirect.ignoreCase = !!ignoreCase;
    existingRedirect.ignoreSlash = !!ignoreSlash;
    existingRedirect.isRegex = !!isRegex;
    existingRedirect.status = status || 'active';
    existingRedirect.notes = notes || '';

    await existingRedirect.save();

    await recordActivity({
      user: (session as any).userId,
      userName: (session as any).username,
      action: 'UPDATE_REDIRECT',
      entity: 'Redirect',
      entityId: _id,
      details: {
        before: beforeState,
        after: existingRedirect.toObject(),
        message: `Updated redirect ${_id}: from ${sourceUrl} to ${targetUrl}`
      },
      ip: req.headers.get('x-forwarded-for') || (req as any).ip || 'unknown'
    });

    return NextResponse.json(existingRedirect);
  } catch (error: any) {
    console.error('Redirect CRUD update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!(await hasPermission(req, 'settings', 'update'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    await connectToDatabase();
    const { ids } = await req.json();
    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json({ error: 'Invalid IDs' }, { status: 400 });
    }

    const deleted = await Redirect.deleteMany({ _id: { $in: ids } });

    await recordActivity({
      user: (session as any).userId,
      userName: (session as any).username,
      action: 'DELETE_REDIRECTS',
      entity: 'Redirect',
      details: { ids, message: `Deleted ${ids.length} redirect rules` },
      ip: req.headers.get('x-forwarded-for') || (req as any).ip || 'unknown'
    });

    return NextResponse.json({ success: true, count: deleted.deletedCount });
  } catch (error: any) {
    console.error('Redirect CRUD delete error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
