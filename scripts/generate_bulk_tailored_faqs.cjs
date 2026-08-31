const path = require('path');
const mongoose = require(path.resolve('./node_modules/mongoose'));
require(path.resolve('./node_modules/dotenv')).config({ path: '.env.local' });

async function generateBulkTailoredFaqs() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const posts = await db.collection('posts').find({ status: 'published' }).toArray();
  console.log(`Processing ${posts.length} published posts for comprehensive tailored FAQs...\n`);

  let updatedCount = 0;

  for (const post of posts) {
    const title = post.title || '';
    const slug = post.slug || '';
    const slugLower = slug.toLowerCase();
    const titleLower = title.toLowerCase();

    let faqs = [];

    if (slugLower.includes('infrared') || titleLower.includes('infrared')) {
      faqs = [
        {
          question: "How does infrared light therapy work for muscle recovery?",
          answer: "Infrared light penetrates deep into muscle and connective tissues, boosting cellular ATP energy, increasing micro-circulation, and accelerating natural tissue repair."
        },
        {
          question: "Is infrared therapy safe for sensitive skin?",
          answer: "Yes, infrared therapy uses soothing, non-UV thermal light frequencies that provide cellular rejuvenation without damaging the skin or causing sunburn."
        },
        {
          question: "How often should I schedule infrared therapy sessions?",
          answer: "For chronic pain or active training recovery, 2 to 3 sessions per week produce rapid results, followed by weekly maintenance sessions."
        },
        {
          question: "Can infrared therapy be combined with deep tissue massage?",
          answer: "Yes, combining infrared light with manual massage softens tense fascia and warms muscle fibers, allowing deeper releases with less discomfort."
        }
      ];
    } else if (slugLower.includes('cupping') || titleLower.includes('cupping')) {
      faqs = [
        {
          question: "What is cupping therapy and what are its primary benefits?",
          answer: "Cupping therapy creates negative pressure suction on the skin to decompress tight myofascial layers, enhance blood flow, and draw out cellular stagnation."
        },
        {
          question: "Do cupping marks hurt or cause permanent discoloration?",
          answer: "Cupping marks are temporary circular reactions from enhanced blood circulation and waste clearance. They are painless and typically fade within 3 to 7 days."
        },
        {
          question: "What conditions benefit most from cupping therapy?",
          answer: "Cupping is especially beneficial for chronic upper back knots, shoulder impingement, tight IT bands, runner's knee, and stubborn neck stiffness."
        },
        {
          question: "How should I prepare for my cupping therapy appointment?",
          answer: "Drink plenty of water before and after your session, avoid large meals right beforehand, and wear loose athletic apparel for easy treatment access."
        }
      ];
    } else if (slugLower.includes('russian') || titleLower.includes('russian')) {
      faqs = [
        {
          question: "What is Russian massage and how does it work?",
          answer: "Russian massage is a clinical modality utilizing rhythmic friction, percussion, and gentle passive stretching to stimulate the nervous system and clear muscle fatigue."
        },
        {
          question: "How is Russian massage different from Swedish massage?",
          answer: "While Swedish massage focuses purely on broad relaxation, Russian massage emphasizes athletic recovery, tissue oxygenation, and restoring joint range of motion."
        },
        {
          question: "Is Russian massage painful or too intense?",
          answer: "No. Although dynamic and stimulating, Russian massage is calibrated to your comfort and designed to release deep tension without creating sharp pain."
        },
        {
          question: "Who should consider Russian massage therapy?",
          answer: "Athletes, fitness enthusiasts, and active adults suffering from muscular fatigue, limited mobility, or poor circulation benefit immensely."
        }
      ];
    } else if (slugLower.includes('sports-massage') || titleLower.includes('sports') || slugLower.includes('athlete')) {
      faqs = [
        {
          question: "What are the primary benefits of sports massage for athletes?",
          answer: "Sports massage targets muscle-tendon junctions to prevent injury, break down post-workout adhesions, reduce soreness, and boost athletic performance."
        },
        {
          question: "When should athletes schedule a sports massage?",
          answer: "Pre-event sessions (24–48 hours before) optimize muscle flexibility, while post-event recovery sessions (24–72 hours after) flush metabolic waste and speed recovery."
        },
        {
          question: "Can non-athletes benefit from sports massage therapy?",
          answer: "Yes. Active adults, runners, weekend warriors, and desk workers experiencing repetitive movement strain benefit from targeted biomechanical bodywork."
        },
        {
          question: "How does sports massage prevent athletic injuries?",
          answer: "By detecting micro-trauma, restoring muscle balance, and releasing fascial restrictions before they escalate into muscle strains or tendonitis."
        }
      ];
    } else if (slugLower.includes('stretch') || titleLower.includes('stretch') || slugLower.includes('fascial')) {
      faqs = [
        {
          question: "What is Fascial Stretch Therapy (FST)?",
          answer: "FST is an assisted, table-based stretching system that focuses on the joint capsule and connective tissue net to eliminate stiffness and restore full mobility."
        },
        {
          question: "How is assisted stretching different from regular stretching?",
          answer: "A certified therapist stabilizes your joints and applies synchronized traction and multi-angle stretches that cannot be replicated through self-stretching."
        },
        {
          question: "Is assisted stretch therapy painful?",
          answer: "Not at all. FST is rhythmic and relaxing, working with your natural breathing pattern to release tension without triggering the protective stretch reflex."
        },
        {
          question: "What should I wear to an assisted stretch therapy session?",
          answer: "Wear flexible, comfortable workout attire like athletic shorts, leggings, or sweatpants and a breathable top."
        }
      ];
    } else if (slugLower.includes('myofascial') || titleLower.includes('myofascial')) {
      faqs = [
        {
          question: "What is myofascial release therapy?",
          answer: "Myofascial release applies gentle, sustained pressure into restricted fascia to eliminate pain, release chronic tension, and restore fluid motion."
        },
        {
          question: "Why does restricted fascia cause chronic pain?",
          answer: "When fascia hardens due to stress or injury, it exerts excessive tensile pressure on nerves, blood vessels, and muscles, leading to chronic stiffness and referred pain."
        },
        {
          question: "What symptoms respond best to myofascial release?",
          answer: "Chronic low back pain, fibromyalgia, neck stiffness, postural imbalances, TMJ discomfort, and restricted shoulder rotation respond exceptionally well."
        },
        {
          question: "How many myofascial release sessions are needed for results?",
          answer: "Most clients notice improvement within 1 to 3 visits, with a series of 4 to 6 sessions recommended for lasting postural transformation."
        }
      ];
    } else if (slugLower.includes('trigger-point') || titleLower.includes('trigger point') || slugLower.includes('knots')) {
      faqs = [
        {
          question: "What is a trigger point in muscle tissue?",
          answer: "A trigger point is a tight knot within muscle fibers that causes localized pain and frequently radiates (refers) pain to other parts of the body."
        },
        {
          question: "How does trigger point therapy release stubborn muscle knots?",
          answer: "Targeted digital compression temporarily slows blood supply to the knot, which upon release floods the area with fresh oxygen and nutrients, resetting muscle tone."
        },
        {
          question: "Why do trigger points cause pain in distant areas?",
          answer: "Nerve pathways in the spinal cord converge, leading the brain to sense pain away from the actual knot (such as shoulder knots causing tension headaches)."
        },
        {
          question: "How soon will I feel relief after trigger point therapy?",
          answer: "Immediate tension reduction is felt during treatment, with complete muscle relaxation occurring within 24 to 48 hours."
        }
      ];
    } else if (slugLower.includes('foot') || slugLower.includes('plantar') || titleLower.includes('foot')) {
      faqs = [
        {
          question: "How does clinical foot massage relieve plantar fasciitis?",
          answer: "By releasing the plantar fascia, calves, and Achilles tendons, therapeutic foot bodywork reduces inflammation, breaks down scar tissue, and eases morning heel pain."
        },
        {
          question: "How long is a typical therapeutic foot massage session?",
          answer: "Sessions typically range from 45 to 60 minutes, including movement evaluation and targeted soft-tissue work."
        },
        {
          question: "How often should I get foot therapy for chronic pain?",
          answer: "For acute foot pain, 1 to 2 sessions per week for 3–4 weeks are recommended, followed by bi-weekly maintenance."
        },
        {
          question: "Do I need to do anything special before my foot therapy appointment?",
          answer: "Arrive in comfortable clothing with easily removable socks/shoes, and share any previous foot injuries or medical conditions with your therapist."
        }
      ];
    } else if (slugLower.includes('sciatica') || slugLower.includes('lower-back') || slugLower.includes('back-pain')) {
      faqs = [
        {
          question: "How does clinical massage help with sciatica and lower back pain?",
          answer: "Targeted bodywork releases the piriformis, glutes, and lumbar muscles, decompressing the sciatic nerve and restoring pelvic mobility."
        },
        {
          question: "Is deep tissue massage safe during a sciatica flare-up?",
          answer: "Yes, when performed by a skilled therapist who applies progressive pressure to alleviate muscle spasm without irritating inflamed nerve roots."
        },
        {
          question: "How many sessions are needed to resolve lower back pain?",
          answer: "Most clients experience significant pain reduction within 2 to 4 sessions, supported by personalized home stretching guidance."
        },
        {
          question: "What causes recurring lower back tightness?",
          answer: "Prolonged sitting, tight hip flexors, weak core stabilizers, and postural compensation patterns frequently drive recurring back pain."
        }
      ];
    } else if (slugLower.includes('neck') || slugLower.includes('shoulder') || slugLower.includes('headache')) {
      faqs = [
        {
          question: "How does massage therapy relieve neck stiffness and tension headaches?",
          answer: "By decompressing the suboccipital muscles, upper trapezius, and levator scapulae, reducing nerve irritation and restoring cranial blood flow."
        },
        {
          question: "Can poor desk posture cause chronic neck pain?",
          answer: "Yes. Forward head posture and rounded shoulders place severe strain on posterior neck muscles, which targeted clinical massage directly corrects."
        },
        {
          question: "How quickly do tension headaches subside after therapy?",
          answer: "Many clients experience immediate headache reduction during the session, with lasting tension relief following consistent weekly sessions."
        },
        {
          question: "What stretches help maintain neck mobility between appointments?",
          answer: "Gentle chin tucks, upper trap stretches, and doorway chest openers recommended by your therapist help maintain proper alignment."
        }
      ];
    } else if (slugLower.includes('deep-tissue') || titleLower.includes('deep tissue')) {
      faqs = [
        {
          question: "What is Deep Tissue Massage and how does it work?",
          answer: "Deep tissue massage targets the sub-surface muscle layers and connective fascia using slow, deliberate strokes and sustained pressure to break down adhesions."
        },
        {
          question: "Is deep tissue massage painful?",
          answer: "It involves firm therapeutic pressure that can feel intense over tight areas, but it should never feel sharp or unbearable. Pressure is constantly adjusted to your comfort."
        },
        {
          question: "How often should I schedule deep tissue massage?",
          answer: "For chronic muscle stiffness or injury rehabilitation, weekly to bi-weekly sessions are recommended. Monthly sessions work best for ongoing maintenance."
        },
        {
          question: "What should I do after my deep tissue massage session?",
          answer: "Drink plenty of water to support tissue hydration, take a warm bath with Epsom salts if desired, and avoid strenuous heavy lifting for 24 hours."
        }
      ];
    } else {
      faqs = [
        {
          question: `What should I expect during a session for "${title}"?`,
          answer: "We begin with a personalized intake and movement assessment, followed by customized clinical bodywork designed to address your specific pain points and goals."
        },
        {
          question: "How often should I schedule bodywork sessions?",
          answer: "For active pain relief or athletic recovery, weekly sessions produce the quickest results. For mobility maintenance, every 2 to 4 weeks is ideal."
        },
        {
          question: "How is 410 Muscle Therapy different from a standard day spa?",
          answer: "We specialize in clinical, biomechanical bodywork and functional recovery tailored to active adults, athletes, and individuals managing chronic pain."
        },
        {
          question: "How can I book an appointment at 410 Muscle Therapy?",
          answer: "You can book easily online 24/7 through our StyleSeat booking portal or reach out to our Timonium, MD clinic directly."
        }
      ];
    }

    await db.collection('posts').updateOne(
      { _id: post._id },
      { $set: { faq: faqs, updatedAt: new Date() } }
    );
    updatedCount++;
    console.log(`✓ Updated [${slug}] with ${faqs.length} topic-specific FAQs`);
  }

  console.log(`\n========================================`);
  console.log(`Successfully updated ${updatedCount} posts in MongoDB!`);
  console.log(`========================================\n`);

  await mongoose.disconnect();
}

generateBulkTailoredFaqs();
