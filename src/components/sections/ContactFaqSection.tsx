'use client';
import { useContent } from '@/hooks/useContent';
import PageInlineFaqs from '@/components/PageInlineFaqs';

export default function ContactFaqSection() {
  const { faq } = useContent();
  return (
    <PageInlineFaqs
      faqs={faq?.items || []}
      badge={faq?.section?.badge}
      title={faq?.section?.headline || faq?.section?.title}
      subtitle={faq?.section?.description}
    />
  );
}
