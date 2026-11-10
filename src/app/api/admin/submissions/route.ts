import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Submission from '@/models/Submission';
import mongoose from 'mongoose';
import { hasPermission, getSessionUser } from '@/lib/rbac';
import { recordActivity } from '@/lib/logger';

export async function GET(req: NextRequest) {
  if (!(await hasPermission(req, 'submissions', 'read'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    await connectDB();
    const submissions = await Submission.find({}).sort({ createdAt: -1 });

    const session = await getSessionUser(req);
    await recordActivity({
      user: (session as any).userId,
      userName: (session as any).username,
      action: 'VIEW_SUBMISSIONS',
      entity: 'Submission',
      details: { count: submissions.length },
      ip: req.headers.get('x-forwarded-for') || (req as any).ip || 'unknown'
    });

    return NextResponse.json(submissions);
  } catch (error: any) {
    console.error('Fetch Submissions Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await hasPermission(req, 'submissions', 'delete'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    // Accept { ids: string[] } in the body, or ?id=<id> (repeatable)
    let ids: unknown[] = req.nextUrl.searchParams.getAll('id');
    if (ids.length === 0) {
      const body = await req.json().catch(() => null);
      if (body && Array.isArray(body.ids)) ids = body.ids;
      else if (body && typeof body.id === 'string') ids = [body.id];
    }

    const validIds = Array.from(new Set(ids.filter((i): i is string => typeof i === 'string' && mongoose.isValidObjectId(i))));
    if (validIds.length === 0 || validIds.length > 500 || validIds.length !== new Set(ids).size) {
      return NextResponse.json({ error: 'Provide between 1 and 500 valid submission ids.' }, { status: 400 });
    }

    await connectDB();
    const result = await Submission.deleteMany({ _id: { $in: validIds } });

    const session = await getSessionUser(req);
    await recordActivity({
      user: (session as any).userId,
      userName: (session as any).username,
      action: 'DELETE_SUBMISSIONS',
      entity: 'Submission',
      details: { message: `Deleted ${result.deletedCount} submission(s)`, ids: validIds, count: result.deletedCount },
      ip: req.headers.get('x-forwarded-for') || (req as any).ip || 'unknown'
    });

    return NextResponse.json({ success: true, deleted: result.deletedCount });
  } catch (error: any) {
    console.error('Delete Submissions Error:', error?.message);
    return NextResponse.json({ error: 'Failed to delete submissions.' }, { status: 500 });
  }
}
