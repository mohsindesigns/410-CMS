import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Post from '@/models/Post';
import { hasPermission, getSessionUser } from '@/lib/rbac';
import { recordActivity } from '@/lib/logger';

export async function GET(req: NextRequest) {
  if (!(await hasPermission(req, 'blog', 'read'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let query: any = {};
    const getAll = searchParams.get('all') === 'true';

    if (getAll) {
      // Return all posts for client-side filtering and counts
    } else if (status === 'trash') {
      query.isTrashed = true;
    } else {
      query.isTrashed = { $ne: true };
      if (status) query.status = status;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const posts = await Post.find(query)
      .populate('categories', 'name')
      .populate('tags', 'name')
      .populate('author', 'username email name')
      .sort({ createdAt: -1 });

    return NextResponse.json(posts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!(await hasPermission(req, 'blog', 'create'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await req.json();
    await connectToDatabase();

    let authorId = (session as any).userId;
    if (body.author && mongoose.Types.ObjectId.isValid(body.author)) {
      authorId = body.author;
    }

    const post = await Post.create({
      ...body,
      author: authorId,
      authorName: typeof body.authorName === 'string' ? body.authorName.trim() : ''
    });

    await recordActivity({
      user: (session as any).userId,
      userName: (session as any).username,
      action: 'CREATE_POST',
      entity: 'Post',
      entityId: post._id.toString(),
      details: { title: post.title },
      ip: req.headers.get('x-forwarded-for') || (req as any).ip || 'unknown'
    });

    try {
      revalidatePath('/blogs');
      revalidatePath('/blog');
      if (post.slug) {
        revalidatePath(`/blogs/${post.slug}`);
        revalidatePath(`/blog/${post.slug}`);
      }
    } catch {}

    return NextResponse.json(post);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
