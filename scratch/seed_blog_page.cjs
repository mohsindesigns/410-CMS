const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI not found");
    return;
  }
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('eagle_revolution');
    
    const pagesCol = db.collection('pages');
    
    // Check if the blog page exists
    const existing = await pagesCol.findOne({ slug: 'blog' });
    if (existing) {
      console.log("Blog page document already exists. Ensuring correct template...");
      const result = await pagesCol.updateOne(
        { slug: 'blog' },
        { 
          $set: { 
            template: 'blog',
            status: 'published'
          } 
        }
      );
      console.log(`Updated existing blog page. matchedCount: ${result.matchedCount}, modifiedCount: ${result.modifiedCount}`);
    } else {
      console.log("Blog page document does not exist. Seeding it...");
      
      // Load initial content from site_contents complete_data if possible
      const siteContentsCol = db.collection('site_contents');
      const completeData = await siteContentsCol.findOne({ key: 'complete_data' });
      const initialBlogsData = completeData?.data?.blogsPage || completeData?.data?.blogPage || {};
      
      const newPage = {
        title: "Our Blog",
        slug: "blog",
        template: "blog",
        status: "published",
        content: {
          label: initialBlogsData.label || "Recovery Insights",
          titleLine1: initialBlogsData.titleLine1 || "Our",
          titleLine2: initialBlogsData.titleLine2 || "Journal.",
          description: initialBlogsData.description || "Explore our latest articles, insights, and clinical tips on deep tissue therapy, mobility, and athletic recovery.",
          ctaReadMore: initialBlogsData.ctaReadMore || "Read More"
        },
        seo: {
          metaTitle: "Our Blog | 410 Muscle Therapy",
          metaDescription: "Explore our latest articles, insights, and clinical recovery tips.",
          canonicalUrl: "https://eaglerevolution.com/blog"
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const insertResult = await pagesCol.insertOne(newPage);
      console.log(`Successfully seeded blog page with ID: ${insertResult.insertedId}`);
    }
  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    await client.close();
  }
}

run();
