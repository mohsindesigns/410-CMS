import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Post from '@/models/Post';

export const revalidate = 60; // Cache for 1 minute, updated via revalidatePath in admin panel

export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch only published posts
    const posts = await Post.find({ status: 'published' })
      .select('-content')
      .populate('categories', 'name')
      .populate('author', 'username name email')
      .sort({ publishedAt: -1 })
      .lean();
    
    return NextResponse.json(posts);
  } catch (error: any) {
    console.error('Public Blog API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
