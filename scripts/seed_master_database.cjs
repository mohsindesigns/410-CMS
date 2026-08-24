const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'eagle_revolution';

const { services: all10Services } = require('./seed_all_10_services.cjs');

const masterCompleteData = {
  settings: {
    siteTitle: "410 Muscle Therapy | Performance Recovery Specialist",
    siteTemplate: "%s | 410 Muscle Therapy",
    siteDescription: "Specialized performance bodywork, mobility restoration, and injury prevention designed for athletes and active adults in Maryland since 2020.",
    favicon: "/eagle-logo.png"
  },
  company: {
    name: "410 Muscle Therapy",
    tagline: "Performance Recovery Specialist",
    email: "info@410muscletherapy.com",
    phone: "(410) 555-0199",
    address: "Maryland, USA",
    hours: "Mon–Sat: 8:00 AM – 7:00 PM"
  },
  navbar: {
    logoText1: "MUSCLE",
    logoText2: "THERAPY",
    bookBtn: "BOOK SESSION",
    logoAlt: "410 Muscle Therapy Logo",
    links: [
      { label: "Home", href: "/" },
      { label: "Services", href: "/services" },
      { label: "Gallery", href: "/gallery" },
      { label: "Blogs", href: "/blog" },
      { label: "Contact", href: "/#contact" }
    ]
  },
  hero: {
    label: "Performance Recovery Specialist • Est. 2020",
    title1: "Recover Faster.",
    title2: "Perform Higher.",
    description: "Specialized performance bodywork, mobility restoration, and injury prevention designed for athletes and active adults since 2020.",
    ctaBook: "BOOK RECOVERY SESSION",
    ctaServices: "EXPLORE SERVICES",
    socialProofText: "Trusted by 500+ athletes & active adults",
    image: "/images/hero-bg.webp",
    imageAlt: "Expert muscle therapy session"
  },
  stats: {
    label: "Our Achievements",
    titleLine1: "Proven Results.",
    titleLine2: "Professional",
    titleItalicWord: "Standards.",
    description: "At 410 Muscle Therapy, we believe that true recovery is built on specialized bodywork and precision movement science. Since our founding in 2020, we have dedicated ourselves to helping competitive athletes and active individuals overcome chronic pain, restore joint mobility, and achieve peak physical performance.",
    image: "/images/blog-3.webp",
    imageAlt: "Clinical sports massage session",
    items: [
      { value: "8+", label: "Years of Experience" },
      { value: "5,000+", label: "Clients Treated" },
      { value: "15,000+", label: "Sessions Completed" },
      { value: "100%", label: "Satisfaction Rate" }
    ]
  },
  services: {
    label: "Our Services",
    titleLine1: "Therapies",
    titleLine2: "Designed",
    titleLine3: "Around",
    titleItalicWord: "You",
    description: "Our specialized manual therapies are tailored to target the root causes of chronic pain, release muscle tightness, and improve joint alignment.",
    ctaAll: "VIEW ALL SERVICES",
    ctaLearnMore: "LEARN MORE",
    services: all10Services,
    items: all10Services.slice(0, 6)
  },
  leadership: {
    label: "The Specialist",
    title: "Meet Antoine Lyles",
    tagline: "Performance Recovery Specialist",
    desc1: "<p>Antoine Lyles is a certified massage therapist specializing in clinical sports massage, myofascial release, and neuromuscular therapy.</p>",
    desc2: "<p>With years of experience working with competitive athletes and active individuals, he delivers targeted protocols designed to restore functional movement and eliminate pain.</p>",
    photoBadge: "PERFORMANCE RECOVERY SPECIALIST",
    image: "/images/theraphist.jpeg",
    imageAlt: "Antoine Lyles — Performance Recovery Specialist",
    ctaMore: "LEARN MORE ABOUT ANTOINE",
    ctaLink: "https://www.styleseat.com/m/v/410muscletherapy",
    signatureName: "Antoine Lyles",
    signatureTitle: "Performance Recovery Specialist"
  },
  process: {
    label: "THE CLINICAL PROCESS",
    title: "Your Recovery Journey.",
    description: "A structured, evidence-based manual therapy protocol designed to systematically eliminate chronic pain, restore joint alignment, and optimize physical movement.",
    phaseLabel: "PHASE",
    items: [
      {
        id: "01",
        title: "Comprehensive Clinical Assessment",
        description: "We perform a thorough biomechanical evaluation, mapping postural compensations, joint restrictions, and active muscle trigger points to locate the root cause of your discomfort.",
        image: "/images/blog-1.webp",
        actions: [
          "Full spinal & joint alignment evaluation",
          "Myofascial trigger point & knot mapping",
          "Comprehensive pain & injury history review",
          "Active & passive range-of-motion testing"
        ]
      },
      {
        id: "02",
        title: "Targeted Treatment Blueprint",
        description: "Based on your clinical findings, we design a customized therapeutic plan integrating deep tissue pressure, myofascial release, and targeted PNF stretching tailored to your lifestyle.",
        image: "/images/blog-2.webp",
        actions: [
          "Selection of specific manual bodywork techniques",
          "Customized session frequency & duration schedule",
          "Establishment of measurable mobility benchmarks",
          "Personalized home stretching guidance"
        ]
      },
      {
        id: "03",
        title: "Hands-On Manual Therapy",
        description: "Focused, deep tissue sessions to decompress restricted muscle layers, flush metabolic waste, release stubborn adhesions, and restore optimal neurological signaling.",
        image: "/images/blog-3.webp",
        actions: [
          "Targeted deep tissue & myofascial decompression",
          "Cross-fiber friction for scar tissue breakdown",
          "Assisted PNF stretching for muscle lengthening",
          "Continuous comfort & pressure threshold monitoring"
        ]
      },
      {
        id: "04",
        title: "Long-Term Mobility & Peak Output",
        description: "We re-test your range of motion, verify pain reduction, and equip you with preventative maintenance strategies so you can stay active, strong, and injury-free.",
        image: "/images/testimonial-1.webp",
        actions: [
          "Post-session range of motion verification",
          "Custom home stretch & mobility routine",
          "Injury prevention & postural maintenance guidance",
          "Follow-up check-ins & maintenance scheduling"
        ]
      }
    ]
  },
  testimonials: {
    label: "Clients Love Us",
    title1: "Real People.",
    title2: "Real Results.",
    quoteIcon: "\"",
    dash: "—",
    items: [
      {
        quote: "Antoine helped me recover from a shoulder injury faster than I expected. I feel stronger, move better, and have zero pain now!",
        name: "Competition Athlete",
        stars: 5
      },
      {
        quote: "The deep tissue work was intense but exactly what my lower back needed. The range of motion is completely back to normal.",
        name: "Sarah Jenkins, Marathon Runner",
        stars: 5
      },
      {
        quote: "Professional, knowledgeable, and highly effective. I highly recommend Antoine for anyone looking to optimize recovery.",
        name: "Marcus Vance, Fitness Coach",
        stars: 5
      },
      {
        quote: "After weeks of chronic neck stiffness, a single targeted session here unlocked my mobility. Simply outstanding work.",
        name: "David Choi, Software Engineer",
        stars: 5
      }
    ],
    testimonials: [
      {
        text: "Antoine helped me recover from a shoulder injury faster than I expected. I feel stronger, move better, and have zero pain now!",
        name: "Competition Athlete",
        rating: 5
      },
      {
        text: "The deep tissue work was intense but exactly what my lower back needed. The range of motion is completely back to normal.",
        name: "Sarah Jenkins, Marathon Runner",
        rating: 5
      },
      {
        text: "Professional, knowledgeable, and highly effective. I highly recommend Antoine for anyone looking to optimize recovery.",
        name: "Marcus Vance, Fitness Coach",
        rating: 5
      }
    ],
    results: [
      { label: "Shoulder Range Restoration", image: "/images/testimonial-1.webp" },
      { label: "Lower Back Lumbar Decompression", image: "/images/testimonial-2.webp" },
      { label: "Hip Capsule & Glute Mobility", image: "/images/testimonial-3.webp" },
      { label: "Neck & Thoracic Realignment", image: "/images/testimonial-4.webp" }
    ]
  },
  ctaBanner: {
    tagline: "Take the First Step",
    title: "Ready to Feel Your Best?",
    description: "Book your appointment today and start your journey to a pain-free, stronger you.",
    button: "BOOK APPOINTMENT",
    buttonUrl: "https://www.styleseat.com/m/v/410muscletherapy"
  },
  quote: {
    section: { badge: "GET IN TOUCH", headline: "Have Questions? Let's Connect." },
    formClinicPortal: "INSTANT ONLINE BOOKING",
    formClinicPortalSub: "Book directly on StyleSeat portal",
    formStyleSeatBtn: "BOOK ON STYLESEAT",
    formBtnSubmit: "SEND MESSAGE",
    formSuccessToast: "Thank you! Your inquiry has been sent. We will reply within 24 hours.",
    trustHipa: "HIPAA Compliant & Secure",
    trustResponse: "Avg Response: 2 Hours",
    services: [
      { label: "Corrective Movement Therapy", value: "corrective-movement" },
      { label: "Maryland Sports Massage", value: "sports-massage" },
      { label: "Fascial Stretch Therapy", value: "stretch-therapy" },
      { label: "Deep Tissue Massage", value: "deep-tissue" },
      { label: "Cupping Therapy", value: "cupping" },
      { label: "Myofascial Release", value: "myofascial" }
    ]
  },
  faq: {
    section: { badge: "FAQ", headline: "Frequently Asked Questions" },
    items: [
      {
        question: "What should I wear to my first session?",
        answer: "Please wear comfortable, loose-fitting athletic clothing such as shorts and a t-shirt or tank top. This allows us to perform range-of-motion assessments and movement retraining comfortably."
      },
      {
        question: "How is performance bodywork different from traditional massage?",
        answer: "Performance bodywork goes beyond relaxation. We focus on diagnosing movement restrictions, releasing tight fascial layers, deactivating trigger points, and re-educating movement patterns so pain doesn't return."
      },
      {
        question: "How many sessions will I need to see results?",
        answer: "Most clients experience significant pain relief and mobility gains in their very first session. For chronic issues or athletic performance goals, a series of 3 to 6 sessions is typically recommended."
      },
      {
        question: "How do I book an appointment?",
        answer: "You can book directly 24/7 through our official StyleSeat booking portal by clicking any 'Book Recovery Session' button on our website."
      }
    ]
  },
  blogSection: {
    subtitle: "FROM THE BLOG",
    title: "Insights & Recovery Tips",
    ctaAll: "View All Articles",
    ctaReadMore: "Read Article",
    description: "Explore the latest clinical insights, recovery methods, and athletic performance tips from our certified specialists.",
    selectedPosts: []
  },
  footer: {
    company: {
      name: "410 Muscle Therapy",
      tagline: "Performance Recovery Specialist",
      description: "Specialized performance bodywork, mobility restoration, and injury prevention designed for athletes and active adults since 2020."
    },
    contact: {
      email: "info@410muscletherapy.com",
      phone: "(410) 555-0199",
      address: "Maryland, USA",
      hours: "Mon–Sat: 8:00 AM – 7:00 PM"
    },
    bottom: {
      copyright: "© 2026 410 Muscle Therapy",
      rights: "All Rights Reserved."
    }
  }
};

async function seedMaster() {
  if (!uri) {
    console.error("MONGODB_URI not found in .env.local");
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log(`Connected to MongoDB. Target DB: ${dbName}`);

    const db = client.db(dbName);
    const siteContentsCol = db.collection('site_contents');
    const pagesCol = db.collection('pages');

    // 1. Update site_contents.complete_data
    const contentResult = await siteContentsCol.updateOne(
      { key: 'complete_data' },
      {
        $set: {
          data: masterCompleteData,
          lastUpdated: new Date()
        }
      },
      { upsert: true }
    );
    console.log(`✓ site_contents complete_data updated (Matched: ${contentResult.matchedCount}, Modified/Upserted: ${contentResult.modifiedCount || contentResult.upsertedCount})`);

    // 2. Update Home page in pages collection
    const homePageDoc = {
      slug: "/",
      title: "Home",
      template: "home",
      status: "published",
      seo: {
        metaTitle: "410 Muscle Therapy | Performance Recovery Specialist",
        metaDescription: "Elite performance recovery bodywork, mobility restoration, and injury prevention for athletes & active adults in Maryland.",
        canonicalUrl: "https://eaglerevolution.com/",
        metaRobotsIndex: "index",
        metaRobotsFollow: "follow",
        ogTitle: "410 Muscle Therapy | Performance Recovery Specialist",
        ogDescription: "Elite performance recovery bodywork, mobility restoration, and injury prevention for athletes & active adults in Maryland.",
        ogImage: "/images/hero-bg.webp",
        twitterCard: "summary_large_image",
        twitterTitle: "410 Muscle Therapy | Performance Recovery Specialist",
        twitterDescription: "Elite performance recovery bodywork, mobility restoration, and injury prevention for athletes & active adults in Maryland.",
        twitterImage: "/images/hero-bg.webp",
        featuredImage: "/images/hero-bg.webp"
      },
      content: masterCompleteData,
      isTrashed: false,
      trashedAt: null,
      updatedAt: new Date()
    };

    await pagesCol.updateOne(
      { slug: "/" },
      {
        $set: homePageDoc,
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true }
    );
    console.log(`✓ Seeded homepage in pages collection (/ and home)`);

    // 3. Seed all 10 services in pages collection
    for (const service of all10Services) {
      const pageDoc = {
        slug: service.slug,
        title: service.title,
        template: 'service-detail',
        status: service.status || 'published',
        seo: {
          metaTitle: service.title,
          metaDescription: service.description,
          focusKeyword: service.title,
          canonicalUrl: `https://eaglerevolution.com/${service.slug}/`,
          metaRobotsIndex: 'index',
          metaRobotsFollow: 'follow',
          ogTitle: service.title,
          ogDescription: service.description,
          ogImage: service.image || '/images/service-massage.webp',
          twitterCard: 'summary_large_image',
          twitterTitle: service.title,
          twitterDescription: service.description,
          twitterImage: service.image || '/images/service-massage.webp',
          featuredImage: service.image || '/images/service-massage.webp',
          breadcrumbTitle: service.title
        },
        content: {
          ...service
        },
        isTrashed: false,
        trashedAt: null,
        updatedAt: new Date()
      };

      await pagesCol.updateOne(
        { slug: service.slug },
        { 
          $set: pageDoc,
          $setOnInsert: { createdAt: new Date() }
        },
        { upsert: true }
      );
      console.log(`✓ Seeded service page: /${service.slug}`);
    }

    console.log(`\n🎉 MASTER SEED COMPLETED SUCCESSFULLY!`);
  } catch (err) {
    console.error("Master seed error:", err);
  } finally {
    await client.close();
  }
}

seedMaster();
