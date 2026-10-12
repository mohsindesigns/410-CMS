import { redirect } from "next/navigation";

// The old editor here wrote services.hero / statsSection / gridSection / cta / faqs ... keys that
// no public page reads, so edits saved fine but never appeared. Services are managed in one place.
export default function ServicesPageEditorRedirect() {
  redirect("/admin/services");
}
