async function verifyBlogPostFaqs() {
  console.log('\n=== Verifying Blog Post Specific FAQs ===\n');

  const testPosts = [
    'how-infrared-light-therapy-works',
    'types-of-cupping-therapy',
    'russian-massage-techniques',
    'complete-guide-for-best-deep-tissue-massage-near-me'
  ];

  for (const slug of testPosts) {
    console.log(`\n--------------------------------------------`);
    console.log(`Testing Blog Post: /blogs/${slug}/`);
    console.log(`--------------------------------------------`);

    try {
      const res = await fetch(`http://localhost:3000/blogs/${slug}/`);
      const html = await res.text();

      // Check if FAQ section title is present
      const hasFaqHeader = html.includes('Frequently Asked Questions');
      console.log(`  FAQ section header present: ${hasFaqHeader}`);

      // Extract Questions rendered in HTML
      const questionMatches = html.match(/<h3[^>]*class="[^"]*"[^>]*>([\s\S]*?)<\/h3>/gi) || [];
      const faqQuestions = questionMatches
        .map(h => h.replace(/<[^>]*>/g, '').trim())
        .filter(t => t.includes('?') || t.toLowerCase().includes('what') || t.toLowerCase().includes('how') || t.toLowerCase().includes('is') || t.toLowerCase().includes('who'));

      console.log(`  Rendered Questions (${faqQuestions.length}):`);
      faqQuestions.forEach(q => console.log(`    - ${q}`));
    } catch (e) {
      console.error(`  Failed to test /blogs/${slug}/:`, e.message);
    }
  }

  console.log('\n=== Blog Post FAQ Verification Complete ===\n');
}

verifyBlogPostFaqs();
