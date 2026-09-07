const path = require('path');
const mongoose = require(path.resolve('./node_modules/mongoose'));
require(path.resolve('./node_modules/dotenv')).config({ path: '.env.local' });

const itemsToSeed = [
  {
    name: 'Home Page',
    pageSlugs: ['home', '/', ''],
    serviceSlug: null,
    metaTitle: 'Performance Recovery Specialist Timonium | Targeted Relief!',
    metaDescription: 'Find a movement and recovery expert in Timonium for deep knots, back stiffness, sciatica, and sports recovery. Call 410 Muscle Therapy today for lasting relief.',
    focusKeyword: 'Performance Recovery Specialist Timonium'
  },
  {
    name: 'Corrective Movement Therapy',
    pageSlugs: ['corrective-movement-maryland', 'corrective-movement-therapy-maryland'],
    serviceSlug: 'corrective-movement-maryland',
    metaTitle: 'Corrective Movement Therapy Maryland | Timonium Pain Relief',
    metaDescription: 'Find lasting relief with corrective movement therapy in Maryland for chronic pain, stiffness, sciatica, and poor movement at 410 Muscle Therapy in Timonium.',
    focusKeyword: 'Corrective Movement Therapy Maryland'
  },
  {
    name: 'Infrared Therapy',
    pageSlugs: ['infrared-therapy-in-maryland', 'infrared-therapy-maryland'],
    serviceSlug: 'infrared-therapy-in-maryland',
    metaTitle: 'Infrared Therapy Maryland | Muscle Pain Relief in Timonium!',
    metaDescription: 'Choose infrared therapy in Maryland for targeted pain relief, easier movement, and muscle recovery at 410 Muscle Therapy in Timonium. Book your therapy today.',
    focusKeyword: 'Infrared Therapy Maryland'
  },
  {
    name: 'Maryland Sports Massage Therapist',
    pageSlugs: ['maryland-sports-massage-therapist', 'maryland-sports-massage'],
    serviceSlug: 'maryland-sports-massage-therapist',
    metaTitle: 'Maryland Sports Massage Therapist | 410 Muscle Therapy Care',
    metaDescription: 'Ease stubborn knots, muscle soreness, and restricted movement with Maryland sports massage in Timonium. Get focused relief at 410 Muscle Therapy today.',
    focusKeyword: 'Maryland Sports Massage Therapist'
  },
  {
    name: 'Hot Towel Massage',
    pageSlugs: ['hot-towel-massage-maryland'],
    serviceSlug: 'hot-towel-massage-maryland',
    metaTitle: 'Hot Towel Massage Maryland | Targeted Relief in Timonium MD',
    metaDescription: 'Tired of tight, stubborn muscles? Hot towel massage in Maryland combines soothing warmth with focused muscle work. Book your Timonium session today with ease!',
    focusKeyword: 'Hot Towel Massage Maryland'
  },
  {
    name: 'Acupressure Massage',
    pageSlugs: ['acupressure-maryland', 'acupressure-massage-maryland'],
    serviceSlug: 'acupressure-maryland',
    metaTitle: 'Acupressure Massage Maryland | 410 Muscle Therapy Timonium!',
    metaDescription: 'Choose acupressure in Maryland for focused relief from muscle knots, tight fascia, stiffness, and sore movement at 410 Muscle Therapy in Timonium. Book today!',
    focusKeyword: 'Acupressure Massage Maryland'
  },
  {
    name: 'Cupping Therapy',
    pageSlugs: ['cupping-therapy-maryland', 'maryland-cupping-therapy'],
    serviceSlug: 'cupping-therapy-maryland',
    metaTitle: 'Cupping Therapy Maryland | Targeted Pain Relief in Timonium',
    metaDescription: 'Start cupping therapy in Maryland for stubborn muscle pain, tight fascia, and limited motion. Get focused relief at 410 Muscle Therapy in Timonium. Book today.',
    focusKeyword: 'Cupping Therapy Maryland'
  },
  {
    name: 'Maryland Stretch Therapy',
    pageSlugs: ['maryland-stretch-therapy', 'maryland-fascial-stretch-therapy'],
    serviceSlug: 'maryland-stretch-therapy',
    metaTitle: 'Maryland Fascial Stretch Therapy | Timonium Pain & Mobility',
    metaDescription: 'Choose assisted stretch therapy Maryland locals trust for tight hips, stiff joints, and limited movement. Call 410 Muscle Therapy in Timonium, and book today.',
    focusKeyword: 'Maryland Fascial Stretch Therapy'
  },
  {
    name: 'Hot Stone Massage',
    pageSlugs: ['hot-stone-massage-maryland'],
    serviceSlug: 'hot-stone-massage-maryland',
    metaTitle: 'Hot Stone Massage Maryland | Muscle Pain Relief in Timonium',
    metaDescription: 'Get targeted hot stone massage in Maryland for tight muscles, stiff joints, and deep tension at 410 Muscle Therapy in Timonium. Book your session online today.',
    focusKeyword: 'Hot Stone Massage Maryland'
  },
  {
    name: 'Myofascial Release Therapy',
    pageSlugs: ['myofascial-release-maryland', 'myofascial-release-therapy-maryland'],
    serviceSlug: 'myofascial-release-maryland',
    metaTitle: 'Myofascial Release Therapy Maryland | Timonium Pain Relief!',
    metaDescription: 'Choose myofascial release Maryland for tight fascia, muscle knots, stiffness, and limited motion. Call 410 Muscle Therapy in Timonium today to book your visit.',
    focusKeyword: 'Myofascial Release Therapy Maryland'
  },
  {
    name: 'Deep Tissue Massage',
    pageSlugs: ['deep-tissue-massage-maryland', 'maryland-deep-tissue-massage'],
    serviceSlug: 'deep-tissue-massage-maryland',
    metaTitle: 'Deep Tissue Massage Maryland | 410 Muscle Therapy Timonium!',
    metaDescription: 'Get targeted deep tissue massage in Maryland for stubborn knots, back pain, and tight muscles at 410 Muscle Therapy in Timonium. Call now to book your relief!',
    focusKeyword: 'Deep Tissue Massage Maryland'
  }
];

async function seedSeo() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI not found in .env.local');
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  console.log('Connected! Seeding SEO metadata...\n');

  // 1. Update documents in `pages` collection
  for (const item of itemsToSeed) {
    for (const slug of item.pageSlugs) {
      const updateResult = await db.collection('pages').updateMany(
        { slug: slug },
        {
          $set: {
            'seo.metaTitle': item.metaTitle,
            'seo.metaDescription': item.metaDescription,
            'seo.focusKeyword': item.focusKeyword,
            'seo.ogTitle': item.metaTitle,
            'seo.ogDescription': item.metaDescription,
            'seo.twitterTitle': item.metaTitle,
            'seo.twitterDescription': item.metaDescription
          }
        }
      );
      if (updateResult.matchedCount > 0) {
        console.log(`[pages collection] Updated slug "${slug}" -> Matched: ${updateResult.matchedCount}`);
      }
    }
  }

  // 2. Update `site_contents` collection (key: 'complete_data')
  const siteContentDoc = await db.collection('site_contents').findOne({ key: 'complete_data' });
  if (siteContentDoc && siteContentDoc.data) {
    const data = siteContentDoc.data;

    // Update Home page SEO in site_contents
    const homeItem = itemsToSeed.find(i => i.pageSlugs.includes('home'));
    if (homeItem) {
      data.home = data.home || {};
      data.home.seo = data.home.seo || {};
      data.home.seo.metaTitle = homeItem.metaTitle;
      data.home.seo.metaDescription = homeItem.metaDescription;
      data.home.seo.focusKeyword = homeItem.focusKeyword;
      data.home.seo.ogTitle = homeItem.metaTitle;
      data.home.seo.ogDescription = homeItem.metaDescription;
      data.home.seo.twitterTitle = homeItem.metaTitle;
      data.home.seo.twitterDescription = homeItem.metaDescription;
      console.log(`[site_contents] Updated data.home.seo`);
    }

    // Update individual services in data.services.services
    if (data.services && Array.isArray(data.services.services)) {
      for (const service of data.services.services) {
        const matched = itemsToSeed.find(i => 
          i.serviceSlug === service.slug || i.pageSlugs.includes(service.slug)
        );
        if (matched) {
          service.seo = service.seo || {};
          service.seo.metaTitle = matched.metaTitle;
          service.seo.metaDescription = matched.metaDescription;
          service.seo.focusKeyword = matched.focusKeyword;
          service.seo.ogTitle = matched.metaTitle;
          service.seo.ogDescription = matched.metaDescription;
          service.seo.twitterTitle = matched.metaTitle;
          service.seo.twitterDescription = matched.metaDescription;
          console.log(`[site_contents services] Updated service "${service.slug}" (${matched.name})`);
        }
      }
    }

    await db.collection('site_contents').updateOne(
      { key: 'complete_data' },
      { $set: { data: data, lastUpdated: new Date() } }
    );
    console.log(`[site_contents] Successfully saved updated complete_data!`);
  }

  // 3. Update `services` page content in `pages` collection
  const servicesPage = await db.collection('pages').findOne({ slug: 'services' });
  if (servicesPage && servicesPage.content && servicesPage.content.services && Array.isArray(servicesPage.content.services.services)) {
    for (const service of servicesPage.content.services.services) {
      const matched = itemsToSeed.find(i => 
        i.serviceSlug === service.slug || i.pageSlugs.includes(service.slug)
      );
      if (matched) {
        service.seo = service.seo || {};
        service.seo.metaTitle = matched.metaTitle;
        service.seo.metaDescription = matched.metaDescription;
        service.seo.focusKeyword = matched.focusKeyword;
        service.seo.ogTitle = matched.metaTitle;
        service.seo.ogDescription = matched.metaDescription;
        service.seo.twitterTitle = matched.metaTitle;
        service.seo.twitterDescription = matched.metaDescription;
        console.log(`[pages 'services' document] Updated embedded service "${service.slug}" (${matched.name})`);
      }
    }

    await db.collection('pages').updateOne(
      { slug: 'services' },
      { $set: { 'content.services.services': servicesPage.content.services.services } }
    );
    console.log(`[pages 'services' document] Successfully updated!`);
  }

  console.log('\nAll SEO metadata has been successfully seeded!');
  await mongoose.disconnect();
}

seedSeo().catch((err) => {
  console.error('Error seeding SEO metadata:', err);
  process.exit(1);
});
