import { NextRequest } from "next/server";

/**
 * /cdn-images/<cloudinary path>  ->  the same file on Cloudinary, served from our own domain.
 *
 * This replaces the plain next.config.ts rewrite for one reason: Cloudinary marks its automatic-format images
 * `Cache-Control: private`, which makes Cloudflare BYPASS its cache, so every image view would hit this server.
 * Here the bytes are identical but we answer with a long-lived PUBLIC cache header (Cloudinary URLs contain a version
 * number, so a changed image gets a new URL), letting Cloudflare and browsers cache them.
 *
 * Only Cloudinary "image/upload" paths of our own account are ever fetched (the host and account are fixed).
 */
const UPSTREAM = "https://res.cloudinary.com/dytytwyp6/image/upload/f_auto,q_auto/";

const encodeSegment = (s: string) => encodeURIComponent(s).replace(/%2C/gi, ",");

async function handle(req: NextRequest, ctx: { params: Promise<{ path?: string[] }> }, head: boolean) {
  const { path } = await ctx.params;
  if (!Array.isArray(path) || path.length === 0 || path.some((s) => !s || s === "." || s === "..")) {
    return new Response("Not found", { status: 404, headers: { "Cache-Control": "no-store" } });
  }

  let upstream: Response;
  try {
    upstream = await fetch(UPSTREAM + path.map(encodeSegment).join("/"), {
      headers: { Accept: req.headers.get("accept") || "image/*,*/*;q=0.8" },
      signal: AbortSignal.timeout(20000),
      cache: "no-store",
    });
  } catch {
    return new Response("Image unavailable", { status: 502, headers: { "Cache-Control": "no-store" } });
  }

  if (!upstream.ok || !(upstream.headers.get("content-type") || "").startsWith("image/")) {
    const status = upstream.status === 404 ? 404 : 502;
    return new Response(status === 404 ? "Not found" : "Image unavailable", {
      status,
      headers: { "Cache-Control": status === 404 ? "public, max-age=300" : "no-store" },
    });
  }

  const headers = new Headers({
    "Content-Type": upstream.headers.get("content-type") as string,
    "Cache-Control": "public, max-age=31536000, immutable",
    Vary: "Accept",
    "X-Content-Type-Options": "nosniff",
  });
  const len = upstream.headers.get("content-length");
  if (len) headers.set("Content-Length", len);

  return new Response(head ? null : upstream.body, { status: 200, headers });
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ path?: string[] }> }) {
  return handle(req, ctx, false);
}

export async function HEAD(req: NextRequest, ctx: { params: Promise<{ path?: string[] }> }) {
  return handle(req, ctx, true);
}
