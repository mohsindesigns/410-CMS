const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

async function seedExactHomepageContent() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('eagle_revolution');

    // 1. Fetch current database state to preserve everything already set
    const currentSiteDoc = await db.collection('site_contents').findOne({ key: 'complete_data' });
    const existing = currentSiteDoc?.data || {};

    // 2. The 10 Services with exact content and bullets from homepagec.json
    const services10 = [
      {
        id: "01",
        number: "01",
        title: "Deep Tissue Massage Maryland",
        name: "Deep Tissue Massage",
        slug: "deep-tissue-massage-maryland",
        tag: "Targeted Pressure",
        icon: "Target",
        image: "/images/service-massage.webp",
        featuredImage: "/images/service-massage.webp",
        status: "published",
        heroSectionLabel: "CLINICAL MYOFASCIAL PRESSURE",
        heroDescription: "Deep tissue massage works into deeper layers of connective tissue and tight muscles. Desk workers, lifters, drivers, and active adults may find this massage beneficial for stiffness and daily movement to help relieve chronic tension in the back, neck, hips, and shoulders.",
        description: "Deep tissue massage works into deeper layers of connective tissue and tight muscles. Desk workers, lifters, drivers, and active adults may find this massage beneficial for stiffness and daily movement to help relieve chronic tension in the back, neck, hips, and shoulders.",
        benefits: [
          { title: "Targets deeper muscle tension", description: "" },
          { title: "Addresses stubborn trigger points", description: "" },
          { title: "Supports easier daily movement", description: "" },
          { title: "Fits active adults with tightness", description: "" }
        ],
        actions: [
          "Targets deeper muscle tension",
          "Addresses stubborn trigger points",
          "Supports easier daily movement",
          "Fits active adults with tightness"
        ]
      },
      {
        id: "02",
        number: "02",
        title: "Sports Massage Maryland",
        name: "Sports Massage",
        slug: "maryland-sports-massage-therapist",
        tag: "Performance Recovery",
        icon: "Zap",
        image: "/images/testimonial-1.webp",
        featuredImage: "/images/testimonial-1.webp",
        status: "published",
        heroSectionLabel: "ATHLETIC BODYWORK SPECIALIST",
        heroDescription: "Focused pressure, compression and aided stretching to work muscles that are strained by training and repetitive action. Recovery assistance for the athletes, runners, lifters, dancers & weekend warriors. It may support pain, promote mobility and prepare the body for challenging activities.",
        description: "Focused pressure, compression and aided stretching to work muscles that are strained by training and repetitive action. Recovery assistance for the athletes, runners, lifters, dancers & weekend warriors. It may support pain, promote mobility and prepare the body for challenging activities.",
        benefits: [
          { title: "Matches your training demands", description: "" },
          { title: "Addresses post-workout muscle tightness", description: "" },
          { title: "Supports flexible movement patterns", description: "" },
          { title: "Helps prepare active muscles", description: "" }
        ],
        actions: [
          "Matches your training demands",
          "Addresses post-workout muscle tightness",
          "Supports flexible movement patterns",
          "Helps prepare active muscles"
        ]
      },
      {
        id: "03",
        number: "03",
        title: "Infrared Therapy Maryland",
        name: "Infrared Therapy",
        slug: "infrared-therapy-maryland",
        tag: "Thermal Recovery",
        icon: "Sun",
        image: "/images/testimonial-2.webp",
        featuredImage: "/images/testimonial-2.webp",
        status: "published",
        heroSectionLabel: "TARGETED WARMTH THERAPY",
        heroDescription: "Focused infrared warmth gently heats targeted areas before or after hands-on work. It suits clients who feel stiff or tired after demanding exercise. The calming heat may relax guarded muscles, support circulation, and make movement feel more comfortable without strong pressure.",
        description: "Focused infrared warmth gently heats targeted areas before or after hands-on work. It suits clients who feel stiff or tired after demanding exercise. The calming heat may relax guarded muscles, support circulation, and make movement feel more comfortable without strong pressure.",
        benefits: [
          { title: "Provides focused warming comfort", description: "" },
          { title: "Prepares tight muscle tissue", description: "" },
          { title: "Supports gentle recovery sessions", description: "" },
          { title: "Pairs well with massage", description: "" }
        ],
        actions: [
          "Provides focused warming comfort",
          "Prepares tight muscle tissue",
          "Supports gentle recovery sessions",
          "Pairs well with massage"
        ]
      },
      {
        id: "04",
        number: "04",
        title: "Cupping Therapy Maryland",
        name: "Cupping Therapy",
        slug: "cupping-therapy-maryland",
        tag: "Decompression Therapy",
        icon: "Layers",
        image: "/images/testimonial-3.webp",
        featuredImage: "/images/testimonial-3.webp",
        status: "published",
        heroSectionLabel: "NEGATIVE PRESSURE THERAPY",
        heroDescription: "Controlled suction lifts skin and surface soft tissue instead of pressing downward. Cupping suits active clients with stubborn tightness. This different pressure method may support local mobility, ease guarded areas, and work well beside massage, stretching, or focused post-training recovery care.",
        description: "Controlled suction lifts skin and surface soft tissue instead of pressing downward. Cupping suits active clients with stubborn tightness. This different pressure method may support local mobility, ease guarded areas, and work well beside massage, stretching, or focused post-training recovery care.",
        benefits: [
          { title: "Uses controlled tissue suction", description: "" },
          { title: "Targets stubborn muscle stiffness", description: "" },
          { title: "Supports easier local movement", description: "" },
          { title: "Complements hands-on muscle therapy", description: "" }
        ],
        actions: [
          "Uses controlled tissue suction",
          "Targets stubborn muscle stiffness",
          "Supports easier local movement",
          "Complements hands-on muscle therapy"
        ]
      },
      {
        id: "05",
        number: "05",
        title: "Myofascial Release Therapy Maryland",
        name: "Myofascial Release Therapy",
        slug: "myofascial-release-therapy-maryland",
        tag: "Fascial Alignment",
        icon: "Shield",
        image: "/images/testimonial-4.webp",
        featuredImage: "/images/testimonial-4.webp",
        status: "published",
        heroSectionLabel: "STRUCTURAL FASCIAL BODYWORK",
        heroDescription: "Slow, steady pressure follows fascia that feels tight, sensitive, or restricted. Myofascial release suits people with recurring muscle knots, limited range, or guarded movement. The careful approach follows tissue feedback instead of forcing strong pressure into areas that already feel painful.",
        description: "Slow, steady pressure follows fascia that feels tight, sensitive, or restricted. Myofascial release suits people with recurring muscle knots, limited range, or guarded movement. The careful approach follows tissue feedback instead of forcing strong pressure into areas that already feel painful.",
        benefits: [
          { title: "Addresses restricted fascial tissue", description: "" },
          { title: "Uses slow, sustained pressure", description: "" },
          { title: "Supports more comfortable movement", description: "" },
          { title: "Fits sensitive, tight areas", description: "" }
        ],
        actions: [
          "Addresses restricted fascial tissue",
          "Uses slow, sustained pressure",
          "Supports more comfortable movement",
          "Fits sensitive, tight areas"
        ]
      },
      {
        id: "06",
        number: "06",
        title: "Acupressure Massage Maryland",
        name: "Acupressure",
        slug: "acupressure-massage-maryland",
        tag: "Trigger Point Focus",
        icon: "Crosshair",
        image: "/images/testimonial-5.webp",
        featuredImage: "/images/testimonial-5.webp",
        status: "published",
        heroSectionLabel: "NEUROMUSCULAR ACUPRESSURE",
        heroDescription: "Focused finger or thumb pressure works on selected points within tense soft tissue. Acupressure suits clients who prefer precise, noninvasive care. It may help with muscle discomfort, stress-related tightness, and movement limits while keeping pressure clear and adjustable throughout the session.",
        description: "Focused finger or thumb pressure works on selected points within tense soft tissue. Acupressure suits clients who prefer precise, noninvasive care. It may help with muscle discomfort, stress-related tightness, and movement limits while keeping pressure clear and adjustable throughout the session.",
        benefits: [
          { title: "Applies precise finger pressure", description: "" },
          { title: "Targets selected tension points", description: "" },
          { title: "Supports calm muscle release", description: "" },
          { title: "Keeps pressure fully adjustable", description: "" }
        ],
        actions: [
          "Applies precise finger pressure",
          "Targets selected tension points",
          "Supports calm muscle release",
          "Keeps pressure fully adjustable"
        ]
      },
      {
        id: "07",
        number: "07",
        title: "Hot Towel Massage Maryland",
        name: "Hot Towel Massage",
        slug: "hot-towel-massage-maryland",
        tag: "Moist Heat Therapy",
        icon: "Feather",
        image: "/images/testimonial-6.webp",
        featuredImage: "/images/testimonial-6.webp",
        status: "published",
        heroSectionLabel: "HYDROTHERAPY MUSCLE RELIEF",
        heroDescription: "Warm, moist towels help soften guarded muscles and prepare areas for hands-on work. This option suits clients who feel stiff after work, travel, or exercise. It pairs soothing heat with muscle care, pressure, and a calm session from start to finish.",
        description: "Warm, moist towels help soften guarded muscles and prepare areas for hands-on work. This option suits clients who feel stiff after work, travel, or exercise. It pairs soothing heat with muscle care, pressure, and a calm session from start to finish.",
        benefits: [
          { title: "Uses gentle, moist heat", description: "" },
          { title: "Softens guarded muscle areas", description: "" },
          { title: "Supports comfortable tissue work", description: "" },
          { title: "Fits pressure-sensitive clients well", description: "" }
        ],
        actions: [
          "Uses gentle, moist heat",
          "Softens guarded muscle areas",
          "Supports comfortable tissue work",
          "Fits pressure-sensitive clients well"
        ]
      },
      {
        id: "08",
        number: "08",
        title: "Hot Stone Massage Maryland",
        name: "Hot Stone Massage",
        slug: "hot-stone-massage-maryland",
        tag: "Basalt Heat Therapy",
        icon: "Compass",
        image: "/images/blog-1.webp",
        featuredImage: "/images/blog-1.webp",
        status: "published",
        heroSectionLabel: "VOLCANIC BASALT THERAPY",
        heroDescription: "Smooth heated stones provide steady warmth while strokes work around tense muscles. This option suits clients seeking relaxation, less guarding, and easier movement. It may help when stress, long sitting, or cold weather leaves the back, shoulders, hips, and legs rigid.",
        description: "Smooth heated stones provide steady warmth while strokes work around tense muscles. This option suits clients seeking relaxation, less guarding, and easier movement. It may help when stress, long sitting, or cold weather leaves the back, shoulders, hips, and legs rigid.",
        benefits: [
          { title: "Delivers broad, steady warmth", description: "" },
          { title: "Calms tense, guarded muscles", description: "" },
          { title: "Supports calm, comfortable relaxation", description: "" },
          { title: "Eases cold-weather muscle stiffness", description: "" }
        ],
        actions: [
          "Delivers broad, steady warmth",
          "Calms tense, guarded muscles",
          "Supports calm, comfortable relaxation",
          "Eases cold-weather muscle stiffness"
        ]
      },
      {
        id: "09",
        number: "09",
        title: "Stretch Therapy Maryland",
        name: "Stretch Therapy",
        slug: "maryland-fascial-stretch-therapy",
        tag: "Assisted Mobility",
        icon: "Maximize2",
        image: "/images/blog-2.webp",
        featuredImage: "/images/blog-2.webp",
        status: "published",
        heroSectionLabel: "ASSISTED MOBILITY SPECIALIST",
        heroDescription: "Guided stretches explore comfortable ranges of motion for your muscles and joints while you breathe and provide feedback. Benefits of stretch therapy for desk workers, adults and persons with restricted mobility. It promotes flexibility, enables safe mobility and teaches how to keep moving forward between hands-on consultations.",
        description: "Guided stretches explore comfortable ranges of motion for your muscles and joints while you breathe and provide feedback. Benefits of stretch therapy for desk workers, adults and persons with restricted mobility. It promotes flexibility, enables safe mobility and teaches how to keep moving forward between hands-on consultations.",
        benefits: [
          { title: "Uses guided assisted stretching", description: "" },
          { title: "Improves comfortable movement range", description: "" },
          { title: "Supports practical mobility habits", description: "" },
          { title: "Fits active adults with stiffness", description: "" }
        ],
        actions: [
          "Uses guided assisted stretching",
          "Improves comfortable movement range",
          "Supports practical mobility habits",
          "Fits active adults with stiffness"
        ]
      },
      {
        id: "10",
        number: "10",
        title: "Corrective Movement Therapy Maryland",
        name: "Corrective Movement Therapy",
        slug: "corrective-movement-therapy-maryland",
        tag: "Movement Science",
        icon: "Activity",
        image: "/images/blog-3.webp",
        featuredImage: "/images/blog-3.webp",
        status: "published",
        heroSectionLabel: "CLINICAL RECOVERY PROTOCOL",
        heroDescription: "Simple movement checks show where mobility, control, or balance may break down during daily tasks or training. This service suits clients who need practical drills. The goal is to reinforce patterns, reduce strain, and maintain gains made during hands-on muscle work.",
        description: "Simple movement checks show where mobility, control, or balance may break down during daily tasks or training. This service suits clients who need practical drills. The goal is to reinforce patterns, reduce strain, and maintain gains made during hands-on muscle work.",
        benefits: [
          { title: "Checks common movement patterns", description: "" },
          { title: "Builds practical control drills", description: "" },
          { title: "Supports lasting session gains", description: "" },
          { title: "Addresses repeated movement strain", description: "" }
        ],
        actions: [
          "Checks common movement patterns",
          "Builds practical control drills",
          "Supports lasting session gains",
          "Addresses repeated movement strain"
        ]
      }
    ];

    // 3. Construct updated fields purely from homepagec.json
    const updatedData = {
      ...existing,
      hero: {
        ...(existing.hero || {}),
        label: "PERFORMANCE RECOVERY SPECIALIST TIMONIUM",
        title1: "Recover Faster.",
        title2: "Perform Higher.",
        description: "Pain should not control how you train, work, sleep, or move. Your performance recovery specialist Timonium at 410 Muscle Therapy identifies stubborn muscle knots and tight fascia. We check movement limits, then use focused hands-on care to address muscular causes. You can move confidently again."
      },
      leadership: {
        ...(existing.leadership || {}),
        label: "The Specialist",
        title: "Meet Your Performance Recovery Specialist Timonium",
        tagline: "Local Trust Earned Through Skilled Hands-On Care",
        desc1: "<p>At 410 Muscle Therapy, every session is informed by eight years of experience. Our 5.0 Google rating reflects our attentive service and ability to provide therapy uniquely shaped around the needs of our clients. Our 100% satisfaction guarantee gives our clients confidence before their first visit and ensures our therapists are held accountable to provide the best therapy possible to all our Timonium clients.</p>",
        desc2: "<p>Clients come to us from Timonium, Lutherville, Cockeysville, Towson, Hunt Valley, and from many of the surrounding Baltimore County communities. As your performance recovery specialist Timonium, we understand the strains and stresses from working and driving along the York Road corridor. We provide focused, individualized movement and recovery therapy with no corporate routine.</p>"
      },
      services: {
        ...(existing.services || {}),
        label: "Our Services",
        titleLine1: "Focused",
        titleLine2: "Therapies",
        titleLine3: "For Better",
        titleItalicWord: "Movement",
        description: "Everybody holds tension in various ways therefore all the sessions begin with a clear chat and easy mobility tests. Your performance recovery specialist in Timonium may utilize pressure, heat, suction, stretching, or corrective work. We are not general pain treatment doctors. We work on muscle constraints that may impede comfort, movement and healing today.",
        services: services10,
        items: existing.services?.items || [] // Keep whatever you have selected or empty!
      },
      process: {
        label: "THE CLINICAL PROCESS",
        title: "Your Clear Four-Step Path Toward Easier Movement",
        description: "Good care begins with listening, not guessing. Your performance recovery specialist Timonium follows four steps to understand your concern, check movement, select suitable hands-on methods, and explain next actions. You always know what we are doing, why it matters, and what follows.",
        phaseLabel: "PHASE",
        items: [
          {
            id: "01",
            title: "Share Your Symptoms",
            description: "First, we discuss where discomfort appears, when it started, what makes it better or worse, and what care you have tried. Your movement and recovery expert also asks about work, sleep, training, injuries, medications, and health concerns before hands-on work begins.",
            image: "/images/blog-1.webp",
            actions: [
              "Describe pain location and timing",
              "Review work and training demands",
              "Share injuries and health concerns",
              "Set clear session goals together"
            ]
          },
          {
            id: "02",
            title: "Check Your Movement",
            description: "Next, checks look at comfortable range, posture, muscle guarding, and tender areas without trying to diagnose a medical condition. We explain what we notice, ask how each movement feels, and connect your answers with the soft tissue patterns found during assessment.",
            image: "/images/blog-2.webp",
            actions: [
              "Check comfortable movement and posture",
              "Locate guarded or tender tissue",
              "Compare both sides when useful",
              "Explain findings in plain language"
            ]
          },
          {
            id: "03",
            title: "Start Focused Treatment",
            description: "Then, your session may combine deep tissue work, myofascial release, heat, cupping, acupressure, assisted stretching, or corrective movement. Pressure stays adjustable throughout. Your feedback guides every technique, helping the work remain purposeful, comfortable, and carefully matched to your goals that day.",
            image: "/images/service-massage.webp",
            actions: [
              "Choose methods for current needs",
              "Adjust pressure through constant feedback",
              "Work within your comfort range",
              "Focus on specific movement goals"
            ]
          },
          {
            id: "04",
            title: "Review Your Progress",
            description: "Finally, we recheck movement, discuss what changed, and suggest aftercare. Recovery support for athletes may consider training days, competition schedules, and soreness. Other clients may receive mobility ideas, rest guidance, or a recommended time for their next appointment based on response.",
            image: "/images/testimonial-3.webp",
            actions: [
              "Recheck movement after hands-on work",
              "Review helpful home recovery actions",
              "Plan visits around actual needs",
              "Refer concerning symptoms for evaluation"
            ]
          }
        ]
      },
      ctaBanner: {
        ...(existing.ctaBanner || {}),
        tagline: "Take the First Step",
        title: "Move Better Without Waiting Longer",
        description: "Call 443-473-2322 or book your performance recovery specialist Timonium visit at 1301 York Rd today.",
        button: "BOOK APPOINTMENT NOW",
        buttonUrl: "https://www.styleseat.com/m/v/410muscletherapy"
      },
      faq: {
        section: {
          badge: "FREQUENTLY ASKED QUESTIONS",
          headline: "Frequently Asked Questions",
          title: "Frequently Asked Questions",
          description: "Everything you need to know about our specialized bodywork, pressure levels, and clinical recovery protocols in Timonium, Maryland."
        },
        items: [
          {
            question: "How much pressure should I expect during treatment?",
            answer: "The pressure should feel firm but not sharp or burning. It should not be difficult to breathe through due to the pressure. We start at a level of pressure within your comfort zone and then adjust as the tissue responds. If you do not like something, feel numb, dizzy, or experience any sudden symptoms, unusual symptoms, or pain, tell us. A not inherently better pressure level is deeper and some health conditions will require an extra level of care.",
            q: "How much pressure should I expect during treatment?",
            a: "The pressure should feel firm but not sharp or burning. It should not be difficult to breathe through due to the pressure. We start at a level of pressure within your comfort zone and then adjust as the tissue responds. If you do not like something, feel numb, dizzy, or experience any sudden symptoms, unusual symptoms, or pain, tell us. A not inherently better pressure level is deeper and some health conditions will require an extra level of care."
          },
          {
            question: "How is this different from a relaxation spa massage?",
            answer: "A spa massage usually focuses on relaxation and broad, soothing strokes. A performance recovery specialist Timonium starts with your symptoms, movement limits, activity demands, and pressure preferences. The session targets specific soft tissue restrictions while checking your response. Relaxation may happen, but practical comfort and movement guide the plan.",
            q: "How is this different from a relaxation spa massage?",
            a: "A spa massage usually focuses on relaxation and broad, soothing strokes. A performance recovery specialist Timonium starts with your symptoms, movement limits, activity demands, and pressure preferences. The session targets specific soft tissue restrictions while checking your response. Relaxation may happen, but practical comfort and movement guide the plan."
          },
          {
            question: "How often should I schedule recovery sessions?",
            answer: "The right schedule depends on your symptoms, training load, goals, budget, health history, and response after each visit. Some clients begin weekly during a difficult period, then space appointments farther apart. Others book around demanding workouts or events. We review progress instead of placing everyone on one fixed plan.",
            q: "How often should I schedule recovery sessions?",
            a: "The right schedule depends on your symptoms, training load, goals, budget, health history, and response after each visit. Some clients begin weekly during a difficult period, then space appointments farther apart. Others book around demanding workouts or events. We review progress instead of placing everyone on one fixed plan."
          },
          {
            question: "Is muscle therapy safe around athletic training?",
            answer: "The risk with massage when done correctly is lower. However, your condition will dictate the timing and pressure. You need to fill us in on any recent injuries, swelling, bruising, surgeries, any medications that affect your blood, numbness, and any medical concerns. Massage should not be done on any trauma that is still acute, pain that is severe, weakness, or any other neurological concerns until they have been evaluated by a proper medical professional.",
            q: "Is muscle therapy safe around athletic training?",
            a: "The risk with massage when done correctly is lower. However, your condition will dictate the timing and pressure. You need to fill us in on any recent injuries, swelling, bruising, surgeries, any medications that affect your blood, numbness, and any medical concerns. Massage should not be done on any trauma that is still acute, pain that is severe, weakness, or any other neurological concerns until they have been evaluated by a proper medical professional."
          },
          {
            question: "What should I do before my first appointment?",
            answer: "Arrive early and fill out the intake. Choosing the performance recovery specialist near me is a plus. Wear workout gear, but skip the heavy lifting or intense workouts. No big meals immediately prior to your appointment. Bring notes on your injury, your medications, and what you want to achieve. Talk about any issues you have with the treatment.",
            q: "What should I do before my first appointment?",
            a: "Arrive early and fill out the intake. Choosing the performance recovery specialist near me is a plus. Wear workout gear, but skip the heavy lifting or intense workouts. No big meals immediately prior to your appointment. Bring notes on your injury, your medications, and what you want to achieve. Talk about any issues you have with the treatment."
          }
        ]
      },
      blogSection: {
        ...(existing.blogSection || {}),
        subtitle: "FROM THE BLOG",
        title: "Insights & Recovery Tips",
        description: "Explore the latest clinical insights, recovery methods, and athletic performance tips from our certified specialists.",
        ctaAll: "VIEW ALL ARTICLES",
        ctaReadMore: "READ ARTICLE",
        selectedPosts: existing.blogSection?.selectedPosts || [] // Keep whatever you have selected or empty!
      }
    };

    // 4. Update site_contents.complete_data
    await db.collection('site_contents').updateOne(
      { key: 'complete_data' },
      { $set: { data: updatedData, lastUpdated: new Date() } },
      { upsert: true }
    );
    console.log('✓ Updated site_contents complete_data');

    // 5. Update canonical home page in pages collection
    await db.collection('pages').updateOne(
      { slug: 'home' },
      { $set: { content: updatedData, updatedAt: new Date() } },
      { upsert: true }
    );
    console.log('✓ Updated canonical Home Page document');

    console.log('\n✓ SEEDING COMPLETED WITHOUT OVERWRITING YOUR CUSTOM SELECTIONS!');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await client.close();
  }
}

seedExactHomepageContent();
