const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || '410_muscle_therapy';
const blogUploadsDir = path.resolve(__dirname, '../public/uploads/blog');

// Ensure the directory exists
if (!fs.existsSync(blogUploadsDir)) {
  fs.mkdirSync(blogUploadsDir, { recursive: true });
}

// Download image helper supporting redirects
function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (response) => {
      // Handle redirects
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        downloadImage(response.headers.location, destPath).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (Status Code: ${response.statusCode})`));
        return;
      }

      const fileStream = fs.createWriteStream(destPath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve(destPath);
      });

      fileStream.on('error', (err) => {
        fs.unlink(destPath, () => {}); // Delete the file async if error occurs
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

function getSafeFilename(url) {
  const urlParts = url.split('/');
  let filename = urlParts[urlParts.length - 1];
  // Remove query parameters
  filename = filename.split('?')[0];
  // Sanitize filename
  filename = filename.replace(/[^a-zA-Z0-9.\-_]/g, '_');
  return filename;
}

async function run() {
  if (!uri) {
    console.error("MONGODB_URI not found in .env.local");
    return;
  }

  console.log(`Connecting to database: ${dbName}`);
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const postsCollection = db.collection('posts');

    const posts = await postsCollection.find({ isTrashed: false }).toArray();
    console.log(`Scanning ${posts.length} posts for remote images...`);

    let downloadCount = 0;
    let postUpdateCount = 0;

    for (const post of posts) {
      let updatedPost = false;
      const updates = {};

      // 1. Process featuredImage
      if (post.featuredImage && post.featuredImage.startsWith('http')) {
        const filename = getSafeFilename(post.featuredImage);
        const destPath = path.join(blogUploadsDir, filename);
        const localPath = `/uploads/blog/${filename}`;

        console.log(`Downloading featured image for post "${post.title}": ${post.featuredImage} -> ${localPath}`);
        try {
          await downloadImage(post.featuredImage, destPath);
          updates.featuredImage = localPath;
          if (post.seo) {
            updates.seo = {
              ...post.seo,
              ogImage: localPath,
              featuredImage: localPath
            };
          }
          downloadCount++;
          updatedPost = true;
        } catch (err) {
          console.error(`Error downloading featured image for "${post.title}": ${err.message}`);
        }
      }

      // 2. Process inline images inside HTML content
      if (post.content && post.content.includes('http')) {
        let contentHtml = post.content;
        // Regex to find image source attributes in the HTML
        const imgRegex = /src="((https?:\/\/[^"\s>]+))"/gi;
        let match;
        const imageUrls = [];

        while ((match = imgRegex.exec(post.content)) !== null) {
          const imgUrl = match[1];
          // Check if it's a remote URL from WordPress or elsewhere
          if (imgUrl.startsWith('http') && (imgUrl.includes('410-muscletherapy.com') || imgUrl.includes('wp-content'))) {
            imageUrls.push(imgUrl);
          }
        }

        // Remove duplicates
        const uniqueUrls = [...new Set(imageUrls)];

        for (const remoteUrl of uniqueUrls) {
          const filename = getSafeFilename(remoteUrl);
          const destPath = path.join(blogUploadsDir, filename);
          const localPath = `/uploads/blog/${filename}`;

          console.log(`Downloading inline image: ${remoteUrl} -> ${localPath}`);
          try {
            await downloadImage(remoteUrl, destPath);
            // Replace all occurrences in HTML content
            contentHtml = contentHtml.split(remoteUrl).join(localPath);
            downloadCount++;
            updatedPost = true;
          } catch (err) {
            console.error(`Error downloading inline image '${remoteUrl}': ${err.message}`);
          }
        }

        if (updatedPost) {
          updates.content = contentHtml;
        }
      }

      // If updates exist, save them to database
      if (updatedPost) {
        await postsCollection.updateOne({ _id: post._id }, { $set: updates });
        postUpdateCount++;
        console.log(`Saved updates to DB for post "${post.title}"`);
      }
    }

    console.log(`\nCOMPLETED IMAGE DOWNLOAD & RE-LINKING:`);
    console.log(`- Downloaded ${downloadCount} images to public/uploads/blog/`);
    console.log(`- Re-linked and updated ${postUpdateCount} posts in the database`);

  } catch (err) {
    console.error("Error running script:", err);
  } finally {
    await client.close();
  }
}

run();
