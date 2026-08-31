const path = require('path');
const mongoose = require(path.resolve('./node_modules/mongoose'));
require(path.resolve('./node_modules/dotenv')).config({ path: '.env.local' });

async function removeFaqsFromBlogContent() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const posts = await db.collection('posts').find({ status: 'published' }).toArray();
  console.log('Inspecting and cleaning', posts.length, 'posts...\n');

  let updatedCount = 0;

  for (const post of posts) {
    let content = post.content || '';
    const initialLength = content.length;

    // Pattern 1: Heading matching FAQ or Frequently Asked Questions
    // Matches from <h[1-6]>...(FAQ|Frequently Asked)...</h[1-6]> until the next <h[1-6]> (if it's not another FAQ heading) or until end of content
    const faqHeadingRegex = /<h[1-6][^>]*>[^<]*(?:FAQ|Frequently Asked|Common Questions)[^<]*<\/h[1-6]>/i;
    
    if (faqHeadingRegex.test(content)) {
      console.log(`\nFound FAQ heading in [${post.slug}]`);
      
      // Let's see what comes after the FAQ heading
      const match = content.match(faqHeadingRegex);
      const startIdx = content.indexOf(match[0]);
      
      // Look for a subsequent heading that is NOT part of FAQ
      const afterFaq = content.substring(startIdx + match[0].length);
      const nextNonFaqHeadingMatch = afterFaq.match(/<h[1-6][^>]*>(?!\s*(?:Q\d|Question|\d+\.))[^<]+<\/h[1-6]>/i);
      
      let newContent = '';
      if (nextNonFaqHeadingMatch) {
        // If there's a subsequent section like "Conclusion" or "Book Now", preserve it
        const nextHeadingPos = startIdx + match[0].length + afterFaq.indexOf(nextNonFaqHeadingMatch[0]);
        console.log(`  - Cutting FAQ section between pos ${startIdx} and ${nextHeadingPos}`);
        newContent = content.substring(0, startIdx).trim() + '\n' + content.substring(nextHeadingPos).trim();
      } else {
        // FAQ is at the end of the post content
        console.log(`  - Cutting FAQ section from pos ${startIdx} to end of post`);
        newContent = content.substring(0, startIdx).trim();
      }

      if (newContent !== content) {
        await db.collection('posts').updateOne(
          { _id: post._id },
          { $set: { content: newContent, updatedAt: new Date() } }
        );
        console.log(`  ✓ Updated [${post.slug}] (length: ${initialLength} -> ${newContent.length})`);
        updatedCount++;
      }
    }
  }

  console.log(`\n========================================`);
  console.log(`Total posts cleaned in MongoDB: ${updatedCount}`);
  console.log(`========================================\n`);

  await mongoose.disconnect();
}

removeFaqsFromBlogContent();
