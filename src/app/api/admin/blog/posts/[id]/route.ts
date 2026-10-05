import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Post from '@/models/Post';
import { hasPermission, getSessionUser } from '@/lib/rbac';
import { recordActivity } from '@/lib/logger';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await hasPermission(req, 'blog', 'read'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { id } = await params;
    await connectToDatabase();
    const post = await Post.findById(id)
      .populate('categories tags')
      .populate('author', 'username email name');
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    return NextResponse.json(post);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionUser(req);
  if (!(await hasPermission(req, 'blog', 'update'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    await connectToDatabase();

    const oldPost = await Post.findById(id);
    if (!oldPost) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    const updateData = { ...body };
    if (body.isTrashed !== undefined) {
      updateData.isTrashed = body.isTrashed;
      updateData.trashedAt = body.isTrashed ? new Date() : null;
    }

    if (body.author !== undefined) {
      if (body.author && mongoose.Types.ObjectId.isValid(body.author)) {
        updateData.author = body.author;
      } else if (!body.author) {
        updateData.author = null;
      }
    }

    if (body.authorName !== undefined) {
      updateData.authorName = typeof body.authorName === 'string' ? body.authorName.trim() : '';
    }

    const post = await Post.findByIdAndUpdate(id, updateData, { new: true });

    await recordActivity({
      user: (session as any).userId,
      userName: (session as any).username,
      action: 'UPDATE_POST',
      entity: 'Post',
      entityId: id,
      details: { before: oldPost.title, after: post.title },
      ip: req.headers.get('x-forwarded-for') || (req as any).ip || 'unknown'
    });

    try {
      revalidatePath('/blogs');
      revalidatePath('/blog');
      if (post?.slug) {
        revalidatePath(`/blogs/${post.slug}`);
        revalidatePath(`/blog/${post.slug}`);
      }
      if (oldPost?.slug && oldPost.slug !== post?.slug) {
        revalidatePath(`/blogs/${oldPost.slug}`);
        revalidatePath(`/blog/${oldPost.slug}`);
      }
    } catch {}

    return NextResponse.json(post);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionUser(req);
  if (!(await hasPermission(req, 'blog', 'delete'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { id } = await params;
    await connectToDatabase();
    const post = await Post.findByIdAndDelete(id);

    await recordActivity({
      user: (session as any).userId,
      userName: (session as any).username,
      action: 'DELETE_POST',
      entity: 'Post',
      entityId: id,
      details: { title: post?.title },
      ip: req.headers.get('x-forwarded-for') || (req as any).ip || 'unknown'
    });

    try {
      revalidatePath('/blogs');
      revalidatePath('/blog');
      if (post?.slug) {
        revalidatePath(`/blogs/${post.slug}`);
        revalidatePath(`/blog/${post.slug}`);
      }
    } catch {}

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
