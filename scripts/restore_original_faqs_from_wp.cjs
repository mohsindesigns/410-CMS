const fs = require('fs');
const path = require('path');
const mongoose = require(path.resolve('./node_modules/mongoose'));
require(path.resolve('./node_modules/dotenv')).config({ path: '.env.local' });

async function restoreOriginalFaqs() {
  // Load the original WordPress blog data
  const rawData = fs.readFileSync(path.resolve('./blogfaq.json'), 'utf8');
  const wpPosts = JSON.parse(rawData);
  console.log(`Loaded ${wpPosts.length} posts from blogfaq.json\n`);

  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  let updatedCount = 0;
  let noFaqCount = 0;
  let notFoundInDb = 0;

  for (const wpPost of wpPosts) {
    const wpSlug = wpPost.post_name || '';
    const wpContent = wpPost.post_content || '';

    // Find the FAQ section: starts with <h2>..Frequently Asked Questions..</h2>
    // The heading may contain nested <b> tags like <h2><b>Frequently Asked Questions</b></h2>
    const faqHeadingMatch = wpContent.match(/<h2[^>]*>[\s\S]*?(?:Frequently Asked Questions|FAQs?)[\s\S]*?<\/h2>/i);
    
    if (!faqHeadingMatch) {
      noFaqCount++;
      continue;
    }

    const faqStartIdx = faqHeadingMatch.index + faqHeadingMatch[0].length;
    
    // Extract everything after the FAQ heading until the next [/et_pb_ or <h2> that's not a question
    let faqSection = wpContent.substring(faqStartIdx);
    
    // Cut at Divi shortcode or next non-FAQ h2
    const diviCutoff = faqSection.indexOf('[/et_pb_');
    if (diviCutoff !== -1) {
      faqSection = faqSection.substring(0, diviCutoff);
    }

    // Extract Q&A pairs: <h3>Question</h3> followed by <p>Answer</p>
    const qaPairs = [];
    const h3Regex = /<h3[^>]*>([\s\S]*?)<\/h3>/gi;
    let h3Match;
    const h3Matches = [];
    
    while ((h3Match = h3Regex.exec(faqSection)) !== null) {
      h3Matches.push({
        fullMatch: h3Match[0],
        innerHtml: h3Match[1],
        index: h3Match.index,
        endIndex: h3Match.index + h3Match[0].length
      });
    }

    for (let i = 0; i < h3Matches.length; i++) {
      const questionHtml = h3Matches[i].innerHtml;
      const questionText = questionHtml.replace(/<[^>]*>/g, '').replace(/\\u00a0/g, ' ').trim();
      
      if (!questionText || questionText.length < 5) continue;

      // Get the answer: everything between this h3's end and the next h3's start (or end of section)
      const answerStart = h3Matches[i].endIndex;
      const answerEnd = (i + 1 < h3Matches.length) ? h3Matches[i + 1].index : faqSection.length;
      const answerHtml = faqSection.substring(answerStart, answerEnd).trim();
      
      // Clean the answer HTML - remove Divi shortcodes but keep the readable HTML
      let cleanAnswer = answerHtml
        .replace(/\[et_pb_[^\]]*\]/g, '')
        .replace(/\[\/et_pb_[^\]]*\]/g, '')
        .replace(/<!--.*?-->/g, '')
        .trim();

      if (cleanAnswer.length < 5) continue;

      qaPairs.push({
        question: questionText,
        answer: cleanAnswer
      });
    }

    if (qaPairs.length === 0) {
      noFaqCount++;
      continue;
    }

    // Find the matching post in MongoDB by slug
    const dbPost = await db.collection('posts').findOne({ slug: wpSlug });
    if (!dbPost) {
      notFoundInDb++;
      console.log(`⊘ [${wpSlug}] Not found in MongoDB, skipping`);
      continue;
    }

    // Update the post.faq field with the original FAQs
    await db.collection('posts').updateOne(
      { _id: dbPost._id },
      { $set: { faq: qaPairs } }
    );
    updatedCount++;
    console.log(`✓ [${wpSlug}] Restored ${qaPairs.length} original FAQs`);
    qaPairs.forEach((qa, idx) => {
      console.log(`    Q${idx + 1}: ${qa.question}`);
    });
  }

  console.log(`\n========================================`);
  console.log(`Posts restored with original FAQs: ${updatedCount}`);
  console.log(`Posts with no FAQ section in WP data: ${noFaqCount}`);
  console.log(`Posts not found in MongoDB: ${notFoundInDb}`);
  console.log(`========================================\n`);

  await mongoose.disconnect();
}

restoreOriginalFaqs();
