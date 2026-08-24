const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

async function seedHomepageWithoutServices() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('eagle_revolution');

    // 1. Fetch current database state to preserve services and blog untouched
    const currentSiteDoc = await db.collection('site_contents').findOne({ key: 'complete_data' });
    const existing = currentSiteDoc?.data || {};

    // 2. Construct updated fields ONLY for Hero, Leadership, Process, CTA Banner, and FAQs
    // LEAVING services and blogSection COMPLETELY UNTOUCHED for the user to manage on their own!
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
            a: "What should I do before my first appointment?",
            a: "Arrive early and fill out the intake. Choosing the performance recovery specialist near me is a plus. Wear workout gear, but skip the heavy lifting or intense workouts. No big meals immediately prior to your appointment. Bring notes on your injury, your medications, and what you want to achieve. Talk about any issues you have with the treatment."
          }
        ]
      }
    };

    // 3. Update site_contents.complete_data
    await db.collection('site_contents').updateOne(
      { key: 'complete_data' },
      { $set: { data: updatedData, lastUpdated: new Date() } },
      { upsert: true }
    );

    // 4. Update canonical home page in pages collection
    await db.collection('pages').updateOne(
      { slug: 'home' },
      { $set: { content: updatedData, updatedAt: new Date() } },
      { upsert: true }
    );

    console.log('✓ Successfully seeded Homepage content (Hero, Specialist Profile, 4-Step Process, CTA Banner, 5 FAQs) with Services and Blog completely untouched for your manual management!');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await client.close();
  }
}

seedHomepageWithoutServices();
