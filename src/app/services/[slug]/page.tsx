import { permanentRedirect } from "next/navigation";

export default async function ServiceRedirectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Redirect legacy /services/[slug] to root-level /[slug]/
  permanentRedirect(`/${slug}/`);
}