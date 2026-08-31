async function testBlogFaqRender() {
  console.log('\n=== Testing Blog Post FAQ Rendering ===\n');

  const slug = 'complete-guide-for-best-deep-tissue-massage-near-me';
  try {
    const res = await fetch(`http://localhost:3000/blogs/${slug}/`);
    const html = await res.text();

    // Check occurrences of "Frequently Asked Questions" in HTML
    const faqMatches = html.match(/Frequently Asked Questions/gi);
    console.log(`Occurrences of "Frequently Asked Questions": ${faqMatches ? faqMatches.length : 0}`);

    // Check if PageInlineFaqs is present
    const hasAccordion = html.includes('data-faq') || html.includes('PageInlineFaqs') || /Frequently Asked Questions/i.test(html);
    console.log(`FAQ Accordion component rendered: ${hasAccordion}`);

    // Check Table of Contents items
    const tocMatch = html.match(/<nav class="flex flex-col gap-2.5">([\s\S]*?)<\/nav>/i);
    if (tocMatch) {
      console.log('\nTOC Items:\n', tocMatch[1].replace(/<a/g, '\n<a'));
    }
  } catch (e) {
    console.error('Test failed:', e.message);
  }
}

testBlogFaqRender();
