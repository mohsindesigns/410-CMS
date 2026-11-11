"use client";

import { useContent } from "../../hooks/useContent";
import { resolveTerms } from "../../lib/terms";
import LegalPage from "../../components/LegalPage";

export default function TermsPage() {
  const content = useContent() as any;
  return <LegalPage cfg={resolveTerms(content?.termsPage)} breadcrumbKey="breadcrumbTerms" icon="FileText" />;
}
