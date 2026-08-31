const path = require('path');
const mongoose = require(path.resolve('./node_modules/mongoose'));
require(path.resolve('./node_modules/dotenv')).config({ path: '.env.local' });

async function extractAndRestoreOriginalFaqs() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const posts = await db.collection('posts').find({ status: 'published' }).toArray();
  console.log(`Processing ${posts.length} published posts...\n`);

  let updatedCount = 0;
  let noFaqFound = [];

  for (const post of posts) {
    const content = post.content || '';
    const slug = post.slug || '';

    // Strategy: Look for Q&A patterns in the content.
    // Blog posts typically have FAQs as <h3><b>Question?</b></h3> <p>Answer</p> blocks,
    // usually near the end of the content.

    // Find all h3 elements that contain a question (ending with ?)
    const h3Regex = /<h3[^>]*>([\s\S]*?)<\/h3>/gi;
    const h3Matches = [...content.matchAll(h3Regex)];

    // Filter to only those that look like questions (contain ?)
    const questionH3s = h3Matches.filter(m => {
      const text = m[1].replace(/<[^>]*>/g, '').trim();
      return text.endsWith('?') && text.length > 10;
    });

    if (questionH3s.length === 0) {
      noFaqFound.push(slug);
      continue;
    }

    // For each question h3, extract the answer (content between this h3 and the next h3 or end)
    const extractedFaqs = [];

    for (let i = 0; i < questionH3s.length; i++) {
      const questionMatch = questionH3s[i];
      const questionText = questionMatch[1].replace(/<[^>]*>/g, '').trim();
      
      // Find the position of this question in the content
      const qStartIdx = questionMatch.index + questionMatch[0].length;

      // Find the next h3 or h2 heading after this question
      let qEndIdx;
      if (i + 1 < questionH3s.length) {
        qEndIdx = questionH3s[i + 1].index;
      } else {
        // Check if there's any other heading after
        const afterContent = content.substring(qStartIdx);
        const nextHeading = afterContent.match(/<h[2-3][^>]*>/i);
        if (nextHeading) {
          qEndIdx = qStartIdx + nextHeading.index;
        } else {
          qEndIdx = content.length;
        }
      }

      const answerHtml = content.substring(qStartIdx, qEndIdx).trim();
      const answerText = answerHtml
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (answerText.length > 5) {
        extractedFaqs.push({
          question: questionText,
          answer: answerHtml  // Keep original HTML for rich rendering
        });
      }
    }

    // Determine if these are actually FAQ questions (usually clustered at the end)
    // Take the last cluster of consecutive questions
    if (extractedFaqs.length > 0) {
      // Check if questions are near the end (last 40% of content)
      const firstQIdx = questionH3s[0].index;
      const contentLength = content.length;
      const positionRatio = firstQIdx / contentLength;

      // If questions start in the last 60% of content, they're likely FAQs
      // Or if there are 3+ consecutive questions, they're likely FAQs
      if (positionRatio > 0.4 || extractedFaqs.length >= 3) {
        await db.collection('posts').updateOne(
          { _id: post._id },
          { $set: { faq: extractedFaqs } }
        );
        updatedCount++;
        console.log(`✓ [${slug}] Restored ${extractedFaqs.length} original FAQs`);
        extractedFaqs.forEach((faq, i) => {
          console.log(`    Q${i+1}: ${faq.question}`);
        });
      } else {
        console.log(`⊘ [${slug}] Found ${extractedFaqs.length} questions but they appear to be article subheadings (pos ratio: ${positionRatio.toFixed(2)}), skipping`);
        noFaqFound.push(slug);
      }
    }
  }

  console.log(`\n========================================`);
  console.log(`Total posts with FAQs restored from content: ${updatedCount}`);
  console.log(`Posts without extractable FAQs: ${noFaqFound.length}`);
  noFaqFound.forEach(s => console.log(`  - ${s}`));
  console.log(`========================================\n`);

  await mongoose.disconnect();
}

extractAndRestoreOriginalFaqs();
