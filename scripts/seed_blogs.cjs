const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || '410_muscle_therapy';
const blogsPath = path.resolve(__dirname, '../seedblogs.json');

function cleanContent(rawContent) {
  if (!rawContent) return "";
  
  // If it's not a Divi builder post, return as-is
  if (!rawContent.includes('[et_pb_section')) {
    return rawContent;
  }
  
  // Extract all et_pb_text blocks
  const textBlocks = [];
  const textRegex = /\[et_pb_text[^\]]*\]([\s\S]*?)\[\/et_pb_text\]/gi;
  let match;
  while ((match = textRegex.exec(rawContent)) !== null) {
    textBlocks.push(match[1].trim());
  }
  
  if (textBlocks.length > 0) {
    return textBlocks.join('\n');
  }
  
  // Fallback: strip shortcode tags but keep inner content
  return rawContent.replace(/\[\/?et_pb_[^\]]*\]/g, "");
}

function extractSchema(rawContent) {
  if (!rawContent) return "";
  const codeRegex = /\[et_pb_code[^\]]*\]([\s\S]*?)\[\/et_pb_code\]/gi;
  let match;
  const schemas = [];
  while ((match = codeRegex.exec(rawContent)) !== null) {
    const code = match[1].trim();
    if (code.includes('{') && code.includes('}')) {
      const cleanedCode = code.replace(/<!--[\s\S]*?-->/g, "").trim();
      schemas.push(cleanedCode);
    }
  }
  return schemas.join('\n\n');
}

function parseFaqsFromSchema(schemaText) {
  const faqs = [];
  if (!schemaText) return faqs;
  
  // Try to find FAQPage schema blocks
  const blocks = schemaText.split(/\n\n+/);
  for (const block of blocks) {
    try {
      if (!block.trim()) continue;
      const parsed = JSON.parse(block.trim());
      // Handle array or single object
      const items = Array.isArray(parsed) ? parsed : [parsed];
      for (const item of items) {
        if (item['@type'] === 'FAQPage' && Array.isArray(item.mainEntity)) {
          for (const entity of item.mainEntity) {
            if (entity['@type'] === 'Question' && entity.name && entity.acceptedAnswer && entity.acceptedAnswer.text) {
              faqs.push({
                question: entity.name,
                answer: entity.acceptedAnswer.text
              });
            }
          }
        }
      }
    } catch (e) {
      // Ignore block parsing error
    }
  }
  return faqs;
}

function decodeHtmlEntities(str) {
  if (!str) return "";
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

async function run() {
  if (!uri) {
    console.error("MONGODB_URI not found in .env.local");
    return;
  }

  if (!fs.existsSync(blogsPath)) {
    console.error(`seedblogs.json not found at: ${blogsPath}`);
    return;
  }

  console.log(`Connecting to MongoDB... target database: ${dbName}`);
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);

    // 1. Get or create a default user to assign as author
    let authorId = null;
    const existingUser = await db.collection('users').findOne({});
    if (existingUser) {
      authorId = existingUser._id;
      console.log(`Using existing user "${existingUser.username}" (${authorId}) as author.`);
    } else {
      // Create a default administrator role & user if none exists
      let roleDoc = await db.collection('roles').findOne({ name: 'administrator' });
      if (!roleDoc) {
        const roleResult = await db.collection('roles').insertOne({
          name: 'administrator',
          permissions: { all: true },
          createdAt: new Date(),
          updatedAt: new Date()
        });
        roleDoc = { _id: roleResult.insertedId };
      }
      const userResult = await db.collection('users').insertOne({
        username: 'admin',
        email: 'info@410muscletherapy.com',
        password: '$2a$10$U27fV3Ld/P3z9r04r535feMef2wR1z6N3aV1Y42v.R7v2h.aP8rF2', // password: admin
        role: roleDoc._id,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      authorId = userResult.insertedId;
      console.log(`Created default user "admin" (${authorId}) as author.`);
    }

    // Load and filter JSON posts
    const rawData = fs.readFileSync(blogsPath, 'utf8');
    const allItems = JSON.parse(rawData);
    const rawPosts = allItems.filter(item => item.post_type === 'post' && item.post_status === 'publish');
    console.log(`Found ${rawPosts.length} published posts in seedblogs.json to process.`);

    let insertedCount = 0;
    let updatedCount = 0;

    for (const rp of rawPosts) {
      const slug = rp.post_name || rp.post_title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const title = decodeHtmlEntities(rp.post_title);
      const cleanedHtml = cleanContent(rp.post_content);
      const schemaMarkup = extractSchema(rp.post_content);
      const faqs = parseFaqsFromSchema(schemaMarkup);

      // Process categories
      const categoryIds = [];
      if (Array.isArray(rp.categories)) {
        for (const cat of rp.categories) {
          const catSlug = cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          const catName = decodeHtmlEntities(cat.name);
          let dbCat = await db.collection('categories').findOne({ slug: catSlug });
          if (!dbCat) {
            const catRes = await db.collection('categories').insertOne({
              name: catName,
              slug: catSlug,
              description: cat.description || '',
              count: 0,
              createdAt: new Date(),
              updatedAt: new Date()
            });
            categoryIds.push(catRes.insertedId);
          } else {
            categoryIds.push(dbCat._id);
          }
        }
      }

      // Process tags
      const tagIds = [];
      if (Array.isArray(rp.tags)) {
        for (const tag of rp.tags) {
          const tagSlug = tag.slug || tag.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          const tagName = decodeHtmlEntities(tag.name);
          let dbTag = await db.collection('tags').findOne({ slug: tagSlug });
          if (!dbTag) {
            const tagRes = await db.collection('tags').insertOne({
              name: tagName,
              slug: tagSlug,
              description: tag.description || '',
              count: 0,
              createdAt: new Date(),
              updatedAt: new Date()
            });
            tagIds.push(tagRes.insertedId);
          } else {
            tagIds.push(dbTag._id);
          }
        }
      }

      // Map WordPress fields to schema
      const featuredImageUrl = rp.featured_image ? rp.featured_image.url : null;
      const excerpt = rp.post_excerpt || (cleanedHtml ? cleanedHtml.replace(/<[^>]*>/g, "").substring(0, 160) : "");

      const postDoc = {
        title: title,
        slug: slug,
        content: cleanedHtml,
        excerpt: excerpt,
        featuredImage: featuredImageUrl,
        author: authorId,
        categories: categoryIds,
        tags: tagIds,
        location: rp.location || '',
        status: 'published',
        publishedAt: rp.post_date ? new Date(rp.post_date) : new Date(),
        seo: {
          metaTitle: title,
          metaDescription: excerpt,
          focusKeyword: '',
          canonicalUrl: `https://410-muscletherapy.com/blog/${slug}`,
          metaRobotsIndex: 'index',
          metaRobotsFollow: 'follow',
          ogTitle: title,
          ogDescription: excerpt,
          ogImage: featuredImageUrl || '',
          twitterCard: 'summary_large_image',
          featuredImage: featuredImageUrl || '',
          featuredImageAlt: rp.featured_image ? rp.featured_image.alt || title : title
        },
        faq: faqs,
        faqSchemaMarkup: schemaMarkup,
        faqBadge: faqs.length > 0 ? 'FAQ' : '',
        faqTitle: faqs.length > 0 ? 'Frequently Asked Questions' : '',
        faqDescription: faqs.length > 0 ? 'Common questions about this topic.' : '',
        isTrashed: false,
        trashedAt: null,
        createdAt: rp.post_date ? new Date(rp.post_date) : new Date(),
        updatedAt: rp.post_modified ? new Date(rp.post_modified) : new Date()
      };

      const matchRes = await db.collection('posts').updateOne(
        { slug: slug },
        { $set: postDoc },
        { upsert: true }
      );

      if (matchRes.upsertedCount > 0) {
        insertedCount++;
      } else {
        updatedCount++;
      }
    }

    console.log(`\nSEED COMPLETE:`);
    console.log(`- Upserted/Inserted: ${insertedCount}`);
    console.log(`- Updated: ${updatedCount}`);
    console.log(`- Total Posts processed: ${rawPosts.length}`);

    // Update categories/tags counts
    const cats = await db.collection('categories').find({}).toArray();
    for (const cat of cats) {
      const count = await db.collection('posts').countDocuments({ categories: cat._id, status: 'published', isTrashed: false });
      await db.collection('categories').updateOne({ _id: cat._id }, { $set: { count } });
    }

    const tags = await db.collection('tags').find({}).toArray();
    for (const tag of tags) {
      const count = await db.collection('posts').countDocuments({ tags: tag._id, status: 'published', isTrashed: false });
      await db.collection('tags').updateOne({ _id: tag._id }, { $set: { count } });
    }
    console.log(`Updated categories and tags item count indicators.`);

    // Clear selectedPosts on the 'blog' page configuration to automatically show all blogs on the frontend
    const pageRes = await db.collection('pages').updateOne(
      { slug: 'blog' },
      { $set: { "content.selectedPosts": [] } }
    );
    if (pageRes.matchedCount > 0) {
      console.log("Successfully cleared 'selectedPosts' on the blog page config so all seeded blogs display dynamically.");
    }

  } catch (err) {
    console.error("Error during blog seeding:", err);
  } finally {
    await client.close();
  }
}

run();
