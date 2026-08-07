const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const uri = process.env.MONGODB_URI;
const dbName = '410_muscle_therapy';

async function migrate() {
    if (!uri) {
        console.error("MONGODB_URI is not set in environment.");
        return;
    }
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('site_contents');

        const doc = await collection.findOne({ key: "complete_data" });
        if (!doc) {
            console.error("No complete_data document found in database.");
            return;
        }

        const therapist = doc.data?.therapist || {};
        
        // Prepare the correct leadership object using the seeded therapist values
        const newLeadership = {
            section: {
                badge: therapist.label || "The Specialist",
                headline: therapist.title || "Meet Antoine Lyles",
                description: therapist.desc1 || ""
            },
            ceo: {
                name: therapist.signatureName || "Antoine Lyles",
                title: therapist.signatureTitle || "Performance Recovery Specialist",
                image: {
                    src: therapist.image || "/images/theraphist.jpeg",
                    alt: therapist.imageAlt || "Antoine Lyles — Performance Recovery Specialist"
                },
                badges: {
                    top: therapist.photoBadge || "PERFORMANCE RECOVERY SPECIALIST",
                    bottom: ""
                },
                quotes: [therapist.tagline || "Performance Recovery Specialist"],
                description: `<p>${therapist.desc1 || ""}</p><p>${therapist.desc2 || ""}</p>`,
                socials: []
            }
        };

        // Update the database document - inside data.leadership!
        const result = await collection.updateOne(
            { key: "complete_data" },
            { $set: { "data.leadership": newLeadership } }
        );

        console.log("Successfully migrated therapist data to data.leadership in DB. Matched: " + result.matchedCount + ", Modified: " + result.modifiedCount);
    } catch (err) {
        console.error("Migration error:", err);
    } finally {
        await client.close();
    }
}

migrate();
