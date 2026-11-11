"use client";

import { useContent } from "../../hooks/useContent";
import { resolvePrivacy } from "../../lib/privacy";
import LegalPage from "../../components/LegalPage";

export default function PrivacyPolicyPage() {
  const content = useContent() as any;
  return <LegalPage cfg={resolvePrivacy(content?.privacyPage)} breadcrumbKey="breadcrumbPrivacy" icon="Shield" />;
}
