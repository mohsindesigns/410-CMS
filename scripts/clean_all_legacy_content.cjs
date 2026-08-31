const path = require('path');
const mongoose = require(path.resolve('./node_modules/mongoose'));
require(path.resolve('./node_modules/dotenv')).config({ path: '.env.local' });

async function cleanAllLegacyContent() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  console.log('--- Cleaning MongoDB pages ---');

  // 1. Clean FAQ page
  const massageFaqs = [
    {
      question: "What is sports massage therapy and how does it help?",
      answer: "<p>Sports massage focuses on treating and preventing soft tissue injuries, reducing muscle tension, enhancing flexibility, and accelerating recovery between workouts or competitive events.</p>"
    },
    {
      question: "What should I expect during a deep tissue massage session?",
      answer: "<p>During a deep tissue session, your therapist uses firm, deliberate strokes to target deep layers of muscle and fascia. We continually communicate to ensure pressure remains within your therapeutic comfort zone.</p>"
    },
    {
      question: "How does cupping therapy promote recovery?",
      answer: "<p>Cupping utilizes decompression suction to lift fascial tissue, boost blood circulation, and release stubborn trigger points and metabolic waste from restricted muscles.</p>"
    },
    {
      question: "What is fascial stretch therapy?",
      answer: "<p>Fascial stretch therapy is a table-based, assisted stretching method that decompresses joints and releases restricted connective tissue (fascia) for immediate gains in range of motion.</p>"
    },
    {
      question: "How often should I receive clinical bodywork?",
      answer: "<p>For active athletes and those managing chronic pain, sessions every 2 to 4 weeks provide optimal results. We customize your maintenance schedule based on your activity level and physical goals.</p>"
    },
    {
      question: "Where is 410 Muscle Therapy located?",
      answer: "<p>We are conveniently located at 1301 York Rd., 8th Floor, Ste 48, Timonium, MD 21093.</p>"
    }
  ];

  await db.collection('pages').updateOne(
    { slug: 'faq' },
    {
      $set: {
        title: "Frequently Asked Questions",
        'seo.metaTitle': "Frequently Asked Questions | 410 Muscle Therapy",
        'seo.metaDescription': "Find answers to common questions regarding sports massage, deep tissue therapy, fascial stretch, cupping, and clinical recovery in Timonium, MD.",
        'seo.canonicalUrl': "https://410-muscletherapy.com/faq/",
        content: {
          label: "FAQ",
          titleLine1: "Frequently Asked",
          titleLine2: "Questions.",
          description: "Everything you need to know about our clinical recovery techniques, appointment expectations, and customized bodywork programs.",
          faqs: massageFaqs
        }
      }
    }
  );

  // 2. Clean About Us page
  await db.collection('pages').updateOne(
    { slug: 'about' },
    {
      $set: {
        title: "About 410 Muscle Therapy",
        'seo.metaTitle': "About 410 Muscle Therapy | Performance Bodywork Maryland",
        'seo.metaDescription': "Learn about 410 Muscle Therapy's mission to empower athletes and active individuals through specialized clinical bodywork, mobility, and recovery in Timonium, MD.",
        'seo.canonicalUrl': "https://410-muscletherapy.com/about/",
        'content.label': "Our Story",
        'content.titleLine1': "Specialized Recovery",
        'content.titleLine2': "Bodywork.",
        'content.description': "Founded on the principles of biomechanics, therapeutic precision, and athletic performance, 410 Muscle Therapy provides clinical bodywork, fascial decompression, and customized recovery therapy.",
        'content.story': "At 410 Muscle Therapy in Timonium, Maryland, we combine deep tissue manipulation, myofascial release, and joint decompression to restore full range of motion and eliminate chronic pain.",
        'content.mission': "To empower athletes and active adults to move without restriction, recover faster, and maintain peak physical longevity."
      }
    }
  );

  // 3. Clean Contact Us page
  await db.collection('pages').updateOne(
    { slug: 'contact-us' },
    {
      $set: {
        title: "Contact Us",
        'seo.metaTitle': "Contact Performance Recovery Specialists | 410 Muscle Therapy",
        'seo.metaDescription': "Contact 410 Muscle Therapy for specialized sports massage, mobility restoration, and clinical bodywork in Timonium, MD. Book your session today.",
        'seo.canonicalUrl': "https://410-muscletherapy.com/contact-us/",
        'content.phone': "(410) 555-1234",
        'content.email': "antoine.lyles@yahoo.com",
        'content.address': "1301 York Rd., 8th Floor, Ste 48, Timonium, MD 21093"
      }
    }
  );

  // 4. Clean Gallery page
  await db.collection('pages').updateOne(
    { slug: 'gallery' },
    {
      $set: {
        title: "Clinical Bodywork Gallery",
        'seo.metaTitle': "Clinical Bodywork & Recovery Gallery | 410 Muscle Therapy",
        'seo.metaDescription': "Explore our clinical gallery featuring performance bodywork sessions, mobility restoration, and recovery treatments in Maryland.",
        'seo.canonicalUrl': "https://410-muscletherapy.com/gallery/"
      }
    }
  );

  // 5. Clean Media records containing legacy keywords
  const mediaDocs = await db.collection('media').find({}).toArray();
  for (const m of mediaDocs) {
    const json = JSON.stringify(m);
    if (/roof|shingle|siding|patio|gutter|eagle/i.test(json)) {
      const cleanTitle = (m.title || m.originalName || "Clinical Recovery Media")
        .replace(/roofing|shingle|siding|patio|gutter|eagle/gi, "Therapy");
      await db.collection('media').updateOne(
        { _id: m._id },
        {
          $set: {
            title: cleanTitle,
            category: "Clinical Bodywork",
            tags: ["recovery", "massage-therapy", "timonium-md"]
          }
        }
      );
    }
  }

  // 6. Clean legacy submissions
  await db.collection('submissions').deleteMany({
    $or: [
      { service: { $regex: /roof|siding|gutter|patio/i } },
      { message: { $regex: /roof|siding|gutter|patio|eagle/i } }
    ]
  });

  console.log('✓ Successfully cleaned all legacy content across MongoDB collections!');
  await mongoose.disconnect();
}

cleanAllLegacyContent();
