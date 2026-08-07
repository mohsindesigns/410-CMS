const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const uri = process.env.MONGODB_URI;
const dbName = '410_muscle_therapy';

const blogItems = [
  {
    "id": 1,
    "slug": "5-signs-you-need-deep-tissue-therapy",
    "tag": "DEEP TISSUE",
    "title": "5 Signs You Need Deep Tissue Therapy",
    "excerpt": "Know when it's time to get professional help for chronic muscle tension.",
    "image": "/images/blog-1.webp",
    "date": "October 12, 2023",
    "author": "Dr. James Vance",
    "content": [
      {
        "type": "paragraph",
        "text": "Deep tissue therapy isn't just a luxury—it's a critical component of maintaining a healthy, highly functional musculoskeletal system. Often, we ignore the early signs of chronic tension until it develops into a debilitating injury."
      },
      {
        "type": "paragraph",
        "text": "Many individuals assume that muscle tightness is just a normal part of getting older or a natural consequence of working out. However, chronic tightness is actually a sign that your body is compensating for weaknesses elsewhere, leading to a cascade of biomechanical imbalances."
      },
      {
        "type": "heading",
        "text": "1. Persistent Lower Back Pain"
      },
      {
        "type": "paragraph",
        "text": "If you sit at a desk all day or drive long distances, your hip flexors and hamstrings can become chronically tight, pulling on your lower back. Deep tissue work releases these restrictions, alleviating the structural pull on your lumbar spine."
      },
      {
        "type": "paragraph",
        "text": "This constant pulling creates an anterior pelvic tilt, which compresses the discs in your lower back. By addressing the tight hip flexors (like the psoas) rather than just rubbing the lower back, a skilled manual therapist can fix the root cause of the pain."
      },
      {
        "type": "heading",
        "text": "2. Limited Range of Motion"
      },
      {
        "type": "paragraph",
        "text": "Struggling to tie your shoes or reach overhead? This indicates that your fascial layers have become adhered. Focused deep pressure helps break down these adhesions, restoring your full dynamic mobility."
      },
      {
        "type": "paragraph",
        "text": "Fascia is the connective tissue that surrounds every muscle fiber. When we are sedentary or injured, this fascia becomes sticky and dehydrated, binding muscle layers together. Deep tissue therapy literally unglues these layers."
      },
      {
        "type": "heading",
        "text": "3. Tension Headaches and Neck Stiffness"
      },
      {
        "type": "paragraph",
        "text": "A forward head posture, commonly referred to as 'tech neck', places immense strain on the suboccipital muscles at the base of the skull. This constant strain frequently triggers tension headaches and migraines."
      },
      {
        "type": "paragraph",
        "text": "By applying sustained, deep pressure to the upper traps, levator scapulae, and suboccipitals, a therapist can deactivate trigger points that refer pain directly into the head and behind the eyes."
      },
      {
        "type": "heading",
        "text": "4. Lingering Sports Injuries"
      },
      {
        "type": "paragraph",
        "text": "Old injuries that never quite healed right often leave behind scar tissue. This scar tissue is less flexible than normal muscle tissue, making it a prime candidate for re-injury."
      },
      {
        "type": "paragraph",
        "text": "Deep cross-fiber friction is a specific technique used in deep tissue therapy to break down scar tissue and encourage the realignment of collagen fibers, essentially remodeling the injured area for better performance."
      },
      {
        "type": "heading",
        "text": "5. Poor Posture You Can't seem to Fix"
      },
      {
        "type": "paragraph",
        "text": "No matter how hard you try to sit up straight, if your chest muscles (pecs) are chronically tight and your upper back muscles are weak, you will inevitably slouch. Deep tissue therapy can release the tight anterior muscles, making it physically easier to maintain an upright posture."
      }
    ]
  },
  {
    "id": 2,
    "slug": "best-stretches-for-athletes",
    "tag": "ATHLETES",
    "title": "Best Stretches for Athletes",
    "excerpt": "Improve flexibility and prevent injuries with these proven routines.",
    "image": "/images/blog-2.webp",
    "date": "November 05, 2023",
    "author": "Sarah Jenkins",
    "content": [
      {
        "type": "paragraph",
        "text": "Stretching is often the most neglected part of an athlete's routine. However, incorporating dynamic stretches before a workout and static stretches afterward can drastically reduce the risk of injury and improve explosive power."
      },
      {
        "type": "paragraph",
        "text": "There is a massive misconception that stretching simply makes you 'more flexible'. In reality, targeted stretching actually improves your nervous system's tolerance to extreme ranges of motion, allowing you to access more strength safely."
      },
      {
        "type": "heading",
        "text": "The World's Greatest Stretch"
      },
      {
        "type": "paragraph",
        "text": "This movement targets the ankles, hamstrings, hips, and thoracic spine all at once. It's the perfect full-body warm-up before any intense physical activity, especially sprinting or heavy lifting."
      },
      {
        "type": "paragraph",
        "text": "To perform it, step into a deep lunge. Place your opposite hand on the ground and reach the other hand towards the ceiling, rotating your upper back. This combination of hip extension and thoracic rotation is unparalleled."
      },
      {
        "type": "heading",
        "text": "PNF Stretching Techniques"
      },
      {
        "type": "paragraph",
        "text": "Proprioceptive Neuromuscular Facilitation (PNF) involves contracting and relaxing the muscle during a stretch. This actively tricks the nervous system into allowing a deeper stretch, leading to dynamic mobility gains."
      },
      {
        "type": "paragraph",
        "text": "For example, in a hamstring PNF stretch, you would stretch the muscle for 10 seconds, actively contract the hamstring by pushing against resistance for 5 seconds, and then immediately relax into a much deeper stretch for 20 seconds."
      },
      {
        "type": "heading",
        "text": "Couch Stretch for Hip Flexors"
      },
      {
        "type": "paragraph",
        "text": "The couch stretch is notoriously uncomfortable but highly effective. It targets the rectus femoris and psoas, which become notoriously tight from both sitting and heavy squatting or sprinting."
      },
      {
        "type": "paragraph",
        "text": "By placing your knee against a wall or couch and maintaining a tall, braced torso, you force the anterior hip to open up, immediately alleviating tightness that often causes lower back pain during athletic movements."
      }
    ]
  },
  {
    "id": 3,
    "slug": "how-to-speed-up-muscle-recovery",
    "tag": "RECOVERY",
    "title": "How to Speed Up Muscle Recovery",
    "excerpt": "Simple, actionable tips to recover faster and perform better tomorrow.",
    "image": "/images/blog-3.webp",
    "date": "December 20, 2023",
    "author": "Marcus Vance",
    "content": [
      {
        "type": "paragraph",
        "text": "Recovery is when the actual physiological adaptations happen. If you train hard but recover poorly, you will eventually hit a plateau or suffer an overtraining injury."
      },
      {
        "type": "paragraph",
        "text": "Many athletes focus 90% of their energy on training and only 10% on recovery. The world's best athletes flip this ratio. They treat their recovery protocols with the exact same intensity and focus as their workout regimens."
      },
      {
        "type": "heading",
        "text": "Prioritize Sleep and Hydration"
      },
      {
        "type": "paragraph",
        "text": "During deep sleep, your body releases human growth hormone (HGH), which is essential for tissue repair. Additionally, muscles are 70% water—dehydration severely limits nutrient transport to damaged muscle fibers."
      },
      {
        "type": "paragraph",
        "text": "Aim for 8-9 hours of quality sleep per night in a pitch-black, cool room. Drink half your body weight in ounces of water daily, adding electrolytes if you are sweating heavily during training sessions."
      },
      {
        "type": "heading",
        "text": "Active Recovery Days"
      },
      {
        "type": "paragraph",
        "text": "Instead of sitting on the couch all day, engage in light blood-flow activities like walking, easy cycling, or mobility flows. This helps flush out metabolic waste products without adding additional strain to the muscles."
      },
      {
        "type": "paragraph",
        "text": "The goal of an active recovery day is not to get a workout in; it is to stimulate circulation. Circulation brings oxygen and nutrients to the repairing tissues and removes lactic acid and other byproducts of heavy training."
      },
      {
        "type": "heading",
        "text": "Contrast Therapy (Hot/Cold)"
      },
      {
        "type": "paragraph",
        "text": "Alternating between heat (sauna or hot tub) and cold (ice bath or cold plunge) forces your blood vessels to rapidly dilate and constrict. This acts as a 'pump' for your circulatory system."
      },
      {
        "type": "paragraph",
        "text": "This dramatic flushing effect can drastically reduce acute inflammation and Delayed Onset Muscle Soreness (DOMS), allowing you to get back to heavy training much faster than passive rest alone."
      },
      {
        "type": "heading",
        "text": "Proper Post-Workout Nutrition"
      },
      {
        "type": "paragraph",
        "text": "Consuming a balanced ratio of carbohydrates and high-quality protein within 60 minutes of finishing a tough workout is crucial. The carbohydrates replenish depleted glycogen stores, while the protein begins the muscle-protein synthesis process."
      }
    ]
  }
];

async function seed() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db(dbName);
        
        const usersCollection = db.collection('users');
        let authorUser = await usersCollection.findOne({ username: 'admin' });
        if (!authorUser) {
            authorUser = await usersCollection.findOne();
        }
        const authorId = authorUser ? authorUser._id : null;
        
        const categoriesCollection = db.collection('categories');
        const postsCollection = db.collection('posts');

        for (const item of blogItems) {
            let htmlContent = item.content.map(block => {
                if (block.type === 'heading') {
                    return `<h2>${block.text}</h2>`;
                } else {
                    return `<p>${block.text}</p>`;
                }
            }).join('\n');

            let categoryDoc = await categoriesCollection.findOne({ slug: item.tag.toLowerCase().replace(/[^a-z0-9]+/g, '-') });
            if (!categoryDoc) {
                const res = await categoriesCollection.insertOne({
                    name: item.tag,
                    slug: item.tag.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    description: '',
                    count: 0,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                categoryDoc = { _id: res.insertedId };
            }

            const postDoc = {
                title: item.title,
                slug: item.slug,
                content: htmlContent,
                excerpt: item.excerpt,
                featuredImage: item.image,
                author: authorId,
                categories: [categoryDoc._id],
                tags: [],
                status: 'published',
                publishedAt: new Date(item.date),
                updatedAt: new Date(),
                createdAt: new Date(),
                isTrashed: false,
                seo: {
                    metaTitle: item.title,
                    metaDescription: item.excerpt,
                    metaRobotsIndex: 'index',
                    metaRobotsFollow: 'follow'
                }
            };

            await postsCollection.updateOne(
                { slug: item.slug },
                { $set: postDoc },
                { upsert: true }
            );
            console.log("Seeded blog post:", item.slug);
        }
        console.log("Blog posts seeding completed successfully.");
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}
seed();
