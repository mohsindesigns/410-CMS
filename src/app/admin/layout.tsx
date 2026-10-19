import { getAuthSession } from "@/lib/auth";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";
import type { Metadata } from "next";

// Admin pages must never be indexed or inherit the public site's title/description/canonical
// (/admin/login/ was being served as "index, follow" with the homepage canonical).
export const metadata: Metadata = {
  title: { absolute: "Admin | 410 Muscle Therapy" },
  description: "Administration area.",
  robots: { index: false, follow: false, nocache: true },
  alternates: { canonical: null },
  openGraph: null,
  twitter: null,
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAuthSession();

  return (
    <AdminLayoutClient initialUser={session}>
      {children}
    </AdminLayoutClient>
  );
}
