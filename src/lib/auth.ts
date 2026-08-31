import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const SECRET = new TextEncoder().encode(process.env.ADMIN_SESSION_SECRET || "410-muscle-therapy-secret-key-change-me-in-env");

export async function signToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  } catch (err) {
    return null;
  }
}

export async function getAuthSession(req?: NextRequest | Request) {
  let token: string | undefined;

  // 1. Try NextRequest req.cookies
  if (req && 'cookies' in req && typeof (req as any).cookies?.get === 'function') {
    token = (req as any).cookies.get("admin_session")?.value;
  }

  // 2. Try raw Cookie header on req
  if (!token && req && typeof req.headers?.get === 'function') {
    const rawCookie = req.headers.get('cookie') || '';
    const match = rawCookie.match(/(?:^|;\s*)admin_session=([^;]+)/);
    if (match) {
      token = decodeURIComponent(match[1]);
    }
  }

  // 3. Try next/headers cookies()
  if (!token) {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get("admin_session")?.value;
    } catch {
      // Ignore if called outside request context
    }
  }

  if (!token) return null;
  return await verifyToken(token);
}


