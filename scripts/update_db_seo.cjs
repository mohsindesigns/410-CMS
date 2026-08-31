const path = require('path');
const mongoose = require(path.resolve('./node_modules/mongoose'));
require(path.resolve('./node_modules/dotenv')).config({ path: '.env.local' });

async function updateDbSeo() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  await db.collection('pages').updateOne(
    { slug: 'contact-us' },
    {
      $set: {
        'seo.metaTitle': 'Contact Performance Recovery Specialists | 410 Muscle Therapy',
        'seo.metaDescription': 'Contact 410 Muscle Therapy for specialized sports massage, mobility restoration, and clinical bodywork in Timonium, MD. Book your session today.'
      }
    }
  );

  await db.collection('pages').updateOne(
    { slug: 'gallery' },
    {
      $set: {
        title: 'Recovery & Clinical Gallery',
        'seo.metaTitle': 'Clinical Bodywork & Recovery Gallery | 410 Muscle Therapy',
        'seo.metaDescription': 'Explore our clinical gallery featuring performance bodywork sessions, mobility restoration, and recovery treatments in Maryland.'
      }
    }
  );

  await db.collection('pages').updateOne(
    { slug: 'reviews' },
    {
      $set: {
        title: 'Client Reviews & Testimonials',
        'seo.metaTitle': 'Client Reviews & Testimonials | 410 Muscle Therapy',
        'seo.metaDescription': 'Read reviews and recovery testimonials from athletes and active adults who trust 410 Muscle Therapy for sports massage, fascial stretch, and pain relief in Maryland.'
      }
    }
  );

  await db.collection('pages').updateOne(
    { slug: 'faq' },
    {
      $set: {
        'seo.metaTitle': 'Frequently Asked Questions | 410 Muscle Therapy',
        'seo.metaDescription': 'Get answers to common questions about sports massage, fascial stretch therapy, cupping, appointments, and clinical recovery services from 410 Muscle Therapy.'
      }
    }
  );

  console.log('Database SEO metadata successfully updated!');
  await mongoose.disconnect();
}
updateDbSeo();
