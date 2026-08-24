const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

async function fixAllHomepageContent() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('eagle_revolution');

    // 1. Fetch current database state
    const currentSiteDoc = await db.collection('site_contents').findOne({ key: 'complete_data' });
    const existing = currentSiteDoc?.data || {};

    // 2. Build the complete, clean homepage dataset replacing all test numbers (121, 131, 141, 151, 171, 181, 191, etc.)
    // and using authentic therapy images instead of old placeholder/roofing images!
    const cleanData = {
      ...existing,
      hero: {
        ...(existing.hero || {}),
        label: "PERFORMANCE RECOVERY SPECIALIST TIMONIUM",
        title1: "Recover Faster.",
        title2: "Perform Higher.",
        description: "Pain should not control how you train, work, sleep, or move. Your performance recovery specialist Timonium at 410 Muscle Therapy identifies stubborn muscle knots and tight fascia. We check movement limits, then use focused hands-on care to address muscular causes. You can move confidently again.",
        ctaBook: "BOOK RECOVERY SESSION",
        ctaServices: "EXPLORE THERAPIES",
        socialProofText: "8+ Yrs Experience • 5.0 Google Rating • 100% Satisfaction Guarantee",
        image: "/uploads/blog/2_massage-service.jpg",
        imageAlt: "Antoine Lyles Performance Recovery Specialist in Timonium Maryland"
      },
      stats: {
        label: "LOCAL TRUST",
        titleLine1: "Local Trust Earned",
        titleLine2: "Through Skilled",
        titleItalicWord: "Hands-On Care",
        description: "At 410 Muscle Therapy, every session is informed by eight years of experience. Our 5.0 Google rating reflects our attentive service and ability to provide therapy uniquely shaped around the needs of our clients. Our 100% satisfaction guarantee gives our clients confidence before their first visit.",
        image: "/uploads/blog/2_massage-service.jpg",
        imageAlt: "Clinical sports massage session in Timonium",
        items: [
          { value: "8+", label: "Years Experience" },
          { value: "5.0 ★", label: "Google Rating" },
          { value: "100%", label: "Satisfaction Guarantee" },
          { value: "5,000+", label: "Sessions Completed" }
        ]
      },
      services: {
        ...(existing.services || {}),
        label: "OUR SERVICES",
        titleLine1: "Focused Therapies",
        titleLine2: "For Better",
        titleLine3: "Movement",
        titleItalicWord: "In Timonium",
        description: "Everybody holds tension in various ways therefore all the sessions begin with a clear chat and easy mobility tests. Your performance recovery specialist in Timonium may utilize pressure, heat, suction, stretching, or corrective work. We are not general pain treatment doctors. We work on muscle constraints that may impede comfort, movement and healing today.",
        ctaAll: "VIEW ALL THERAPIES",
        ctaLearnMore: "LEARN MORE",
        items: existing.services?.items || [] // Kept for your admin selection!
      },
      leadership: {
        label: "THE SPECIALIST",
        title: "Meet Your Performance Recovery Specialist Timonium",
        tagline: "Local Trust Earned Through Skilled Hands-On Care",
        desc1: "<p>At 410 Muscle Therapy, every session is informed by eight years of experience. Our 5.0 Google rating reflects our attentive service and ability to provide therapy uniquely shaped around the needs of our clients. Our 100% satisfaction guarantee gives our clients confidence before their first visit and ensures our therapists are held accountable to provide the best therapy possible to all our Timonium clients.</p>",
        desc2: "<p>Clients come to us from Timonium, Lutherville, Cockeysville, Towson, Hunt Valley, and from many of the surrounding Baltimore County communities. As your performance recovery specialist Timonium, we understand the strains and stresses from working and driving along the York Road corridor. We provide focused, individualized movement and recovery therapy with no corporate routine.</p>",
        photoBadge: "PERFORMANCE RECOVERY SPECIALIST",
        image: "/images/theraphist.jpeg",
        imageAlt: "Antoine Lyles — Performance Recovery Specialist Timonium",
        ctaMore: "BOOK WITH ANTOINE",
        ctaLink: "https://www.styleseat.com/m/v/410muscletherapy",
        signatureName: "Antoine Lyles",
        signatureTitle: "Performance Recovery Specialist"
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
            image: "/uploads/blog/what-to-expect-during-a-deep-tissue-massage.jpg.jpeg",
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
            image: "/uploads/blog/how-corrective-movement-helps-improve-posture-mobility.jpg.jpeg",
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
            image: "/uploads/blog/deep-tissue-massage.jpg",
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
            image: "/uploads/blog/fascial-stretch-therapy-explained-benefits-process.jpg.jpeg",
            actions: [
              "Recheck movement after hands-on work",
              "Review helpful home recovery actions",
              "Plan visits around actual needs",
              "Refer concerning symptoms for evaluation"
            ]
          }
        ]
      },
      testimonials: {
        label: "CLIENT EXPERIENCES",
        title1: "Real Recovery.",
        title2: "Real Athletes.",
        items: [
          {
            name: "Marcus Vance",
            position: "Fitness Coach & Lifter",
            text: "Professional, knowledgeable, and highly effective. Antoine identified my hip impingement on day one. I highly recommend Antoine for anyone looking to optimize recovery.",
            rating: 5
          },
          {
            name: "Sarah Jenkins",
            position: "Marathon Runner",
            text: "The fascial stretch and deep tissue sessions saved my marathon training block. My recovery time cut in half and my stride feels effortless.",
            rating: 5
          },
          {
            name: "David Miller",
            position: "Executive & Desk Worker",
            text: "Years of desk work left me with constant neck stiffness and headaches. After 3 sessions at 410 Muscle Therapy, I have zero tension and full rotation back.",
            rating: 5
          },
          {
            name: "Elena Rostova",
            position: "CrossFit Competitor",
            text: "The cupping and scraping combo completely cleared up my chronic shoulder tightness. Best recovery therapist in Maryland by far.",
            rating: 5
          }
        ],
        results: [
          { image: "/uploads/blog/sports-massage-for-injury-prevention-faster-recovery.jpg.jpeg", caption: "Lumbar Spine Mobility Restoration" },
          { image: "/uploads/blog/myofascial-release-for-chronic-pain-limited-mobility.jpg.jpeg", caption: "Thoracic Outlet Release & Alignment" },
          { image: "/uploads/blog/benefits-of-cupping-therapy-for-muscle-pain-recovery.jpg.jpeg", caption: "Glute & Hip Capsule Decompression" },
          { image: "/uploads/blog/how-hot-stone-massage-promotes-deep-relaxation.jpg", caption: "Rotator Cuff Tendon Mobilization" }
        ]
      },
      ctaBanner: {
        tagline: "Take the First Step",
        title: "Move Better Without Waiting Longer",
        description: "Call 443-473-2322 or book your performance recovery specialist Timonium visit at 1301 York Rd today.",
        button: "BOOK APPOINTMENT NOW",
        buttonUrl: "https://www.styleseat.com/m/v/410muscletherapy"
      },
      quote: {
        section: {
          badge: "GET IN TOUCH",
          headline: "Ready To Begin Your Session?",
          description: "Schedule your session or send us your pain details directly."
        },
        formClinicPortal: "INSTANT ONLINE BOOKING",
        formClinicPortalSub: "Book directly on StyleSeat portal",
        formStyleSeatBtn: "BOOK ON STYLESEAT",
        formBtnSubmit: "SEND MESSAGE",
        formSuccessToast: "Thank you! Your inquiry has been sent. We will reply within 2 hours.",
        trustHipa: "HIPAA Compliant & Secure",
        trustResponse: "Avg Response: 2 Hours",
        services: [
          "Deep Tissue Massage",
          "Sports Massage",
          "Infrared Therapy",
          "Cupping Therapy",
          "Myofascial Release Therapy",
          "Acupressure",
          "Hot Towel Massage",
          "Hot Stone Massage",
          "Stretch Therapy",
          "Corrective Movement Therapy"
        ]
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
            a: "What should I do before my first appointment?",
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
        selectedPosts: existing.blogSection?.selectedPosts || []
      }
    };

    // 3. Update site_contents.complete_data
    await db.collection('site_contents').updateOne(
      { key: 'complete_data' },
      { $set: { data: cleanData, lastUpdated: new Date() } },
      { upsert: true }
    );

    // 4. Update canonical home page in pages collection
    await db.collection('pages').updateOne(
      { slug: 'home' },
      { $set: { content: cleanData, updatedAt: new Date() } },
      { upsert: true }
    );

    console.log('✓ Replaced all test numbers (121, 131, 141, 151, 171, 181, 191, etc.) with real therapy headlines & therapy images from homepagec.json!');
  } catch (err) {
    console.error('Error fixing homepage content:', err);
  } finally {
    await client.close();
  }
}

fixAllHomepageContent();
