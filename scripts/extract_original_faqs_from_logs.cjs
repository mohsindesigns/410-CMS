const path = require('path');
const mongoose = require(path.resolve('./node_modules/mongoose'));
require(path.resolve('./node_modules/dotenv')).config({ path: '.env.local' });

async function extractOriginalFaqsFromLogs() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  // Get all UPDATE_POST activity logs that have before/after
  const logs = await db.collection('activitylogs').find({
    entity: 'Post',
    action: 'UPDATE_POST',
    'details.before': { $exists: true }
  }).sort({ timestamp: 1 }).toArray();

  console.log(`Total UPDATE_POST logs with before/after: ${logs.length}\n`);

  // For each log, check if the "before" had FAQ content that was removed in "after"
  const faqRegex = /<h[1-6][^>]*>[^<]*(?:FAQ|Frequently Asked|Common Questions)[^<]*<\/h[1-6]>/i;
  
  let recoveredCount = 0;
  const recoveredFaqs = {}; // slug -> extracted FAQ Q&A pairs

  for (const log of logs) {
    const before = log.details.before || {};
    const after = log.details.after || {};
    const slug = before.slug || after.slug || '';
    
    const beforeContent = before.content || '';
    const afterContent = after.content || '';
    
    // If before had FAQ content but after doesn't -> this is where the FAQ was removed
    if (faqRegex.test(beforeContent) && !faqRegex.test(afterContent)) {
      console.log(`\n=== FOUND FAQ removal for [${slug}] (log timestamp: ${log.timestamp}) ===`);
      
      // Extract the FAQ section from the before content
      const headingMatch = beforeContent.match(faqRegex);
      const startIdx = beforeContent.indexOf(headingMatch[0]);
      const faqSection = beforeContent.substring(startIdx);
      
      // Parse Q&A pairs from the FAQ HTML
      // Looking for patterns like <h3>Question?</h3> followed by <p>Answer</p>
      const qaPairs = [];
      
      // Try to match accordion/div-based FAQs
      const questionRegex = /<(?:h[2-6]|strong|b|div[^>]*class="[^"]*question[^"]*")[^>]*>([\s\S]*?)<\/(?:h[2-6]|strong|b|div)>/gi;
      const allMatches = [...faqSection.matchAll(questionRegex)];
      
      // Also try more generic approach: split by headings
      const headingSplit = faqSection.split(/<h[2-6][^>]*>/i).filter(Boolean);
      
      for (let i = 0; i < headingSplit.length; i++) {
        const part = headingSplit[i];
        const closeMatch = part.match(/(.*?)<\/h[2-6]>/i);
        if (closeMatch) {
          const question = closeMatch[1].replace(/<[^>]*>/g, '').trim();
          // The answer is everything after the closing heading tag until the next heading
          const answerHtml = part.substring(closeMatch[0].length);
          const answer = answerHtml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
          
          if (question && answer && question !== 'Frequently Asked Questions' && 
              !question.match(/^FAQ/i) && question.length > 5) {
            qaPairs.push({ question, answer: answer.substring(0, 500) });
          }
        }
      }

      console.log(`  Extracted ${qaPairs.length} Q&A pairs:`);
      qaPairs.forEach((qa, i) => {
        console.log(`    Q${i+1}: ${qa.question}`);
        console.log(`    A${i+1}: ${qa.answer.substring(0, 120)}...`);
      });

      if (qaPairs.length > 0) {
        recoveredFaqs[slug] = qaPairs;
        recoveredCount++;
      }
    }
  }

  console.log(`\n========================================`);
  console.log(`Recovered FAQs from ${recoveredCount} posts via activity logs`);
  console.log(`========================================\n`);

  // Now also check: which posts had FAQ in before.faq that differs from current
  // Look for the OLDEST before.faq for each slug
  const originalFaqFields = {};
  for (const log of logs) {
    const before = log.details.before || {};
    const slug = before.slug || log.details.after?.slug || '';
    if (!slug) continue;
    
    if (before.faq && Array.isArray(before.faq) && before.faq.length > 0) {
      // Only keep the earliest (oldest) version
      if (!originalFaqFields[slug]) {
        originalFaqFields[slug] = before.faq;
      }
    }
  }

  console.log(`\nPosts with original post.faq field in activity logs: ${Object.keys(originalFaqFields).length}`);
  for (const [slug, faqs] of Object.entries(originalFaqFields)) {
    console.log(`  [${slug}] ${faqs.length} FAQs, first Q: ${(faqs[0].question || faqs[0].q || '?').substring(0, 80)}`);
  }

  await mongoose.disconnect();
}

extractOriginalFaqsFromLogs();
