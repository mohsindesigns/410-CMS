const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const uri = process.env.MONGODB_URI;
const dbName = 'eagle_revolution';

const data = {
  "globalSite": {
    "metadata": {
      "title": "Performance Recovery Specialist | 410 Muscle Therapy",
      "description": "Elite performance recovery bodywork, mobility restoration, and injury prevention for athletes & active adults. Est. 2020. #bodywork #performancerecovery",
      "bookingUrl": "https://www.styleseat.com/m/v/410muscletherapy",
      "established": "2020"
    },
    "branding": {
      "name": "410 Muscle Therapy",
      "tagline": "Performance Recovery Specialist",
      "hashtag": "#bodywork #performancerecovery",
      "logoText1": "MUSCLE",
      "logoText2": "THERAPY"
    },
    "contactInfo": {
      "address": "125 Wellness Way, Suite 101\nLos Angeles, CA 90001",
      "phone": "(323) 456-7890",
      "email": "info@muscletherapy.com",
      "hours": "Mon–Sat: 8:00 AM – 7:00 PM"
    }
  },
  "globalMetadata": {
    "title": "Performance Recovery Specialist | 410 Muscle Therapy",
    "description": "Elite performance recovery bodywork, mobility restoration, and injury prevention for athletes & active adults. Est. 2020. #bodywork #performancerecovery",
    "bookingUrl": "https://www.styleseat.com/m/v/410muscletherapy",
    "giftCardUrl": "https://app.squareup.com/gift/V4MA1Q75Q5VJ5/order"
  },
  "navbar": {
    "logoText1": "MUSCLE",
    "logoText2": "THERAPY",
    "bookBtn": "BUY GIFT CARD",
    "logoAlt": "410 Muscle Therapy Logo",
    "links": [
      {
        "label": "Home",
        "href": "/",
        "active": true
      },
      {
        "label": "Services",
        "href": "/services"
      },
      {
        "label": "Gallery",
        "href": "/gallery"
      },
      {
        "label": "Blogs",
        "href": "/blogs"
      },
      {
        "label": "Book Appointment",
        "href": "https://www.styleseat.com/m/v/410muscletherapy"
      }
    ]
  },
  "hero": {
    "label": "Performance Recovery Specialist • Est. 2020",
    "title1": "Recover Faster.",
    "title2": "Perform Higher.",
    "description": "Specialized performance bodywork, mobility restoration, and injury prevention designed for athletes and active adults since 2020. #bodywork #performancerecovery",
    "ctaBook": "BOOK RECOVERY SESSION",
    "ctaServices": "EXPLORE SERVICES",
    "socialProofText": "Trusted by 500+ athletes & active adults",
    "image": "/images/hero-bg.webp",
    "imageAlt": "Expert muscle therapy session"
  },
  "stats": {
    "label": "Our Achievements",
    "titleLine1": "Proven Results.",
    "titleLine2": "Professional",
    "titleItalicWord": "Standards.",
    "description": "At 410 Muscle Therapy, we believe that true recovery is built on specialized bodywork and precision movement science. Since our founding in 2020, we have dedicated ourselves to helping competitive athletes and active individuals overcome chronic pain, restore joint mobility, and achieve peak physical performance. Our targeted manual therapies address the root causes of muscular imbalances, ensuring long-term health and accelerated recovery times so you can return to what you love with confidence.",
    "image": "/images/blog-3.webp",
    "imageAlt": "Clinical sports massage session",
    "items": [
      {
        "value": "8+",
        "label": "Years of Experience",
        "desc": "Providing dedicated clinical manual therapy and recovery."
      },
      {
        "value": "5,000+",
        "label": "Clients Treated",
        "desc": "Helping athletes, active individuals, and professionals."
      },
      {
        "value": "15,000+",
        "label": "Sessions Completed",
        "desc": "Targeted bodywork sessions tailored to specific needs."
      },
      {
        "value": "98%",
        "label": "Client Satisfaction",
        "desc": "Ensuring every client experiences measurable pain relief."
      },
      {
        "value": "Certified",
        "label": "& Fully Trained",
        "desc": "Equipped with advanced manual therapy certifications."
      },
      {
        "value": "Trusted By",
        "label": "Athletes & Professionals",
        "desc": "Trusted by competitive teams, trainers, and athletes."
      }
    ]
  },
  "services": {
    "label": "Our Services",
    "stickyLabel": "Capabilities",
    "stickyHeading": "Our Services",
    "servicePrefix": "Service",
    "ctaExplore": "Explore Therapy",
    "ctaBook": "Book Session",
    "titleLine1": "Therapies",
    "titleLine2": "Designed",
    "titleLine3": "Around",
    "titleItalicWord": "You",
    "ctaAll": "VIEW ALL SERVICES",
    "ctaLearnMore": "LEARN MORE",
    "description": "Our specialized manual therapies are tailored to target the root causes of chronic pain, release muscle tightness, and improve joint alignment. Whether you are recovering from a sports injury, dealing with everyday tension, or looking to maximize athletic performance, our hands-on treatments facilitate accelerated healing, restore proper posture, and enhance overall body mobility.",
    "items": [
      {
        "id": "01",
        "slug": "deep-tissue-therapy",
        "name": "Deep Tissue Therapy",
        "description": "Targets chronic muscle tension and knots to relieve pain and restore natural movement.",
        "image": "/images/service-massage.webp",
        "benefits": [
          "Relieves tightness & knots",
          "Improves mobility",
          "Enhances blood flow",
          "Reduces pain & stiffness",
          "Speeds up recovery"
        ]
      },
      {
        "id": "02",
        "slug": "sports-massage",
        "name": "Sports Massage",
        "description": "Designed specifically for athletes to enhance performance, increase flexibility, and prevent injuries.",
        "image": "/images/testimonial-1.webp",
        "benefits": [
          "Speeds up recovery times",
          "Improves range of motion",
          "Reduces muscle soreness",
          "Boosts athletic performance"
        ]
      },
      {
        "id": "03",
        "slug": "muscle-recovery",
        "name": "Muscle Recovery",
        "description": "Comprehensive therapy designed to flush lactic acid, reduce inflammation, and restore muscle tissues.",
        "image": "/images/testimonial-2.webp",
        "benefits": [
          "Flushes metabolic waste",
          "Minimizes muscle soreness",
          "Restores muscle energy",
          "Reduces post-workout fatigue"
        ]
      },
      {
        "id": "04",
        "slug": "injury-recovery",
        "name": "Injury Recovery",
        "description": "Targeted, rehabilitation-focused manual therapy to speed recovery from strains, sprains, and joint issues.",
        "image": "/images/testimonial-3.webp",
        "benefits": [
          "Accelerates healing process",
          "Prevents chronic scar tissue",
          "Restores functional mobility",
          "Relieves localized pain"
        ]
      },
      {
        "id": "05",
        "slug": "mobility-therapy",
        "name": "Mobility Therapy",
        "description": "Focuses on unlocking tight joints, lengthening connective tissue, and restoring functional range of motion.",
        "image": "/images/testimonial-4.webp",
        "benefits": [
          "Restores natural joint motion",
          "Corrects movement imbalances",
          "Improves posture & alignment",
          "Prevents joint stiffness"
        ]
      },
      {
        "id": "06",
        "slug": "trigger-point-therapy",
        "name": "Trigger Point Therapy",
        "description": "Applies focused pressure to specific hyper-irritable points in muscle tissue to relieve radiating pain.",
        "image": "/images/testimonial-5.webp",
        "benefits": [
          "Deactivates active trigger points",
          "Relieves referred pain patterns",
          "Releases localized muscle spasm",
          "Restores resting muscle length"
        ]
      },
      {
        "id": "07",
        "slug": "stretch-therapy",
        "name": "Stretch Therapy",
        "description": "Assisted PNF and static stretching to systematically lengthen muscle groups and improve overall flexibility.",
        "image": "/images/testimonial-6.webp",
        "benefits": [
          "Increases muscle elasticity",
          "Relieves full-body tension",
          "Enhances neurological relaxation",
          "Improves athletic efficiency"
        ]
      },
      {
        "id": "08",
        "slug": "performance-recovery",
        "name": "Performance Recovery",
        "description": "A holistic combination of bodywork and stretching designed to prime the nervous system and muscles for competition.",
        "image": "/images/blog-1.webp",
        "benefits": [
          "Primes neuromuscular system",
          "Optimizes muscle tone",
          "Boosts mental alertness",
          "Maximizes movement output"
        ]
      }
    ]
  },
  "whyChooseUs": {
    "label": "WHY CHOOSE 410 MUSCLE THERAPY",
    "titleLine1": "Engineered For Peak",
    "titleLine2": "Human",
    "titleItalicWord": "Performance.",
    "description": "Since 2020, we've evolved beyond traditional massage to deliver targeted performance bodywork, rapid athletic recovery, mobility optimization, and root-cause injury prevention.",
    "imageBadgeLabel": "Performance Recovery",
    "established": "Est. 2020",
    "provenLabel": "Proven Standard",
    "provenStat": "98% Success",
    "provenDescription": "Every protocol is built on diagnostic movement assessment, targeted bodywork, and athletic recovery science.",
    "provenCheck1": "Movement & Posture Analysis",
    "provenCheck2": "Targeted Myofascial Release",
    "cta": "Experience Performance Recovery",
    "image": "/images/theraphist.jpeg",
    "imageAlt": "Clinical Precision Therapy",
    "items": [
      {
        "id": "01",
        "title": "Performance Precision",
        "description": "Targeted bodywork mapping specific trigger points and fascial restrictions to eliminate pain and boost output.",
        "footerLabel": "Specialized Technique"
      },
      {
        "id": "02",
        "title": "Recovery Specialist",
        "description": "Years of hands-on experience helping competitive athletes, runners, lifters, and active adults stay at their peak.",
        "footerLabel": "Expert Practice"
      },
      {
        "id": "03",
        "title": "Biomechanical Results",
        "description": "We focus on structural alignment, mobility restoration, and joint decompression rather than symptom masking.",
        "footerLabel": "Proven Outcomes"
      },
      {
        "id": "04",
        "title": "Accelerated Recovery",
        "description": "Specialized myofascial bodywork designed to flush metabolic waste, relieve soreness, and restore full range of motion.",
        "footerLabel": "Rapid Relief"
      }
    ]
  },
  "therapist": {
    "label": "The Specialist",
    "title": "Meet Antoine Lyles",
    "tagline": "Performance Recovery Specialist",
    "image": "/images/theraphist.jpeg",
    "imageAlt": "Antoine Lyles — Performance Recovery Specialist",
    "desc1": "Since founding 410 Muscle Therapy in 2020, Antoine Lyles has evolved the practice beyond standard therapy into a premier sports recovery destination. Specializing in performance bodywork, structural mobility restoration, targeted myofascial release, and injury prevention, he helps athletes and active adults eliminate pain, recover faster, and perform at their highest potential. #bodywork #performancerecovery",
    "desc2": "Antoine’s approach combines hands-on soft tissue manipulation with functional biomechanics to restore fluid movement patterns. By working closely with each individual, he designs custom recovery protocols that target tight muscle groups, relieve joint pressure, and optimize neural pathways. His passion for performance science ensures that whether you are a professional athlete or simply seeking relief from daily tension, you receive elite-level care tailored to your unique physical demands.",
    "certBadgeLabel": "Certified Specialist",
    "certBadgeSub": "Advanced Performance Recovery & Movement Science",
    "photoBadge": "PERFORMANCE RECOVERY SPECIALIST",
    "ctaMore": "LEARN MORE ABOUT ANTOINE",
    "signatureName": "Antoine Lyles",
    "signatureTitle": "Performance Recovery Specialist",
    "features": [
      {
        "title": "Est. 2020",
        "desc": "Performance practice"
      },
      {
        "title": "Advanced",
        "desc": "Certifications"
      },
      {
        "title": "Athletes",
        "desc": "Recovery focus"
      },
      {
        "title": "5,000+",
        "desc": "Sessions completed"
      }
    ]
  },
  "process": {
    "label": "THE CLINICAL PROCESS",
    "title": "Your Recovery Journey.",
    "description": "A structured, evidence-based manual therapy protocol designed to systematically eliminate chronic pain, restore joint alignment, and optimize physical movement.",
    "phaseLabel": "PHASE",
    "items": [
      {
        "id": "01",
        "title": "Comprehensive Clinical Assessment",
        "description": "We perform a thorough biomechanical evaluation, mapping postural compensations, joint restrictions, and active muscle trigger points to locate the root cause of your discomfort.",
        "duration": "15-20 Mins",
        "goal": "Diagnostic Trigger Mapping",
        "actions": [
          "Full spinal & joint alignment evaluation",
          "Myofascial trigger point & knot mapping",
          "Comprehensive pain & injury history review",
          "Active & passive range-of-motion testing"
        ]
      },
      {
        "id": "02",
        "title": "Targeted Treatment Blueprint",
        "description": "Based on your clinical findings, we design a customized therapeutic plan integrating deep tissue pressure, myofascial release, and targeted PNF stretching tailored to your lifestyle.",
        "duration": "Session Strategy",
        "goal": "Custom Therapy Strategy",
        "actions": [
          "Selection of specific manual bodywork techniques",
          "Customized session frequency & duration schedule",
          "Establishment of measurable mobility benchmarks",
          "Personalized home stretching guidance"
        ]
      },
      {
        "id": "03",
        "title": "Hands-On Manual Therapy",
        "description": "Focused, deep tissue sessions to decompress restricted muscle layers, flush metabolic waste, release stubborn adhesions, and restore optimal neurological signaling.",
        "duration": "60-90 Mins",
        "goal": "Tissue Release & Alignment",
        "actions": [
          "Targeted deep tissue & myofascial decompression",
          "Cross-fiber friction for scar tissue breakdown",
          "Assisted PNF stretching for muscle lengthening",
          "Continuous comfort & pressure threshold monitoring"
        ]
      },
      {
        "id": "04",
        "title": "Long-Term Mobility & Peak Output",
        "description": "We re-test your range of motion, verify pain reduction, and equip you with preventative maintenance strategies so you can stay active, strong, and injury-free.",
        "duration": "Ongoing Wellness",
        "goal": "Pain-Free Performance",
        "actions": [
          "Post-session range of motion verification",
          "Custom home stretch & mobility routine",
          "Injury prevention & postural maintenance guidance",
          "Follow-up check-ins & maintenance scheduling"
        ]
      }
    ]
  },
  "testimonials": {
    "label": "Clients Love Us",
    "title1": "Real People.",
    "title2": "Real Results.",
    "quoteIcon": "\"",
    "dash": "—",
    "items": [
      {
        "quote": "Antoine helped me recover from a shoulder injury faster than I expected. I feel stronger, move better, and have zero pain now!",
        "name": "Competition Athlete",
        "stars": 5
      },
      {
        "quote": "The deep tissue work was intense but exactly what my lower back needed. The range of motion is completely back to normal.",
        "name": "Sarah Jenkins, Marathon Runner",
        "stars": 5
      },
      {
        "quote": "Professional, knowledgeable, and highly effective. I highly recommend Antoine for anyone looking to optimize recovery.",
        "name": "Marcus Vance, Fitness Coach",
        "stars": 5
      },
      {
        "quote": "After weeks of chronic neck stiffness, a single targeted session here unlocked my mobility. Simply outstanding work.",
        "name": "David Choi, Software Engineer",
        "stars": 5
      },
      {
        "quote": "The PNF stretching combined with sports massage has completely resolved my hamstring tightness. I can sprint with full confidence.",
        "name": "Elena Rostova, Track Athlete",
        "stars": 5
      },
      {
        "quote": "Antoine understands sports mechanics deeply. The targeted pressure points released tension I didn’t even know was there.",
        "name": "Robert Miller, Cyclist",
        "stars": 5
      }
    ],
    "results": [
      {
        "id": 1,
        "label": "Reduced pain and improved performance.",
        "image": "/images/testimonial-1.webp"
      },
      {
        "id": 2,
        "label": "More mobility, less stiffness, better daily life.",
        "image": "/images/testimonial-2.webp"
      },
      {
        "id": 3,
        "label": "Back to training stronger than ever before.",
        "image": "/images/testimonial-3.webp"
      },
      {
        "id": 4,
        "label": "Restored muscle balance and reduced tension.",
        "image": "/images/testimonial-4.webp"
      },
      {
        "id": 5,
        "label": "Faster relief from sports-related soreness.",
        "image": "/images/testimonial-5.webp"
      },
      {
        "id": 6,
        "label": "Deep recovery that fits an active lifestyle.",
        "image": "/images/testimonial-6.webp"
      }
    ]
  },
  "ctaBanner": {
    "tagline": "Take the First Step",
    "title": "Ready to Feel Your Best?",
    "description": "Book your appointment today and start your journey to a pain-free, stronger you.",
    "button": "BOOK APPOINTMENT"
  },
  "contactFaq": {
    "label": "Support & Booking",
    "title": "Booking & Common Questions.",
    "description": "Find answers to frequently asked questions and request your personalized manual therapy session using our clinical booking portal.",
    "faqLabel": "Support & FAQ",
    "faqTitle": "Recovery Information.",
    "formLabel": "Book A Session",
    "formTitle": "Request Your Consultation.",
    "formClinicPortal": "INSTANT ONLINE BOOKING",
    "formClinicPortalSub": "Book Directly via StyleSeat",
    "formStyleSeatBtn": "BOOK ON STYLESEAT",
    "formNameLabel": "Full Name",
    "formNamePlaceholder": "John Doe",
    "formEmailLabel": "Email Address",
    "formEmailPlaceholder": "john@example.com",
    "formPhoneLabel": "Phone Number",
    "formPhonePlaceholder": "(323) 456-7890",
    "formServiceLabel": "Select Therapy",
    "formServicePlaceholder": "Choose a service",
    "formMessageLabel": "Recovery Goals / Symptoms",
    "formMessagePlaceholder": "Describe target areas, soreness, or injury history...",
    "formBtnSubmit": "SEND BOOKING REQUEST",
    "formBtnSuccess": "REQUEST SUBMITTED",
    "formSuccessToast": "Request submitted! We will call you soon.",
    "trustHipa": "Secure HIPAA Booking",
    "trustResponse": "Response within 2 hours",
    "formServicesOptions": [
      {
        "value": "deep-tissue",
        "label": "Deep Tissue Therapy"
      },
      {
        "value": "sports-massage",
        "label": "Sports Massage"
      },
      {
        "value": "recovery",
        "label": "Muscle Recovery"
      },
      {
        "value": "injury-recovery",
        "label": "Injury Recovery"
      },
      {
        "value": "mobility-therapy",
        "label": "Mobility Therapy"
      },
      {
        "value": "trigger-point",
        "label": "Trigger Point Therapy"
      },
      {
        "value": "stretch-therapy",
        "label": "Stretch Therapy"
      }
    ],
    "faqs": [
      {
        "q": "Do you accept health insurance plans?",
        "a": "Yes, we accept major insurance providers including Aetna, BlueCross BlueShield, Cigna, and United Healthcare. Coverage depends on your specific plan’s manual therapy benefits. We offer direct insurance verification prior to booking."
      },
      {
        "q": "What should I wear to my recovery session?",
        "a": "For stretch therapy and active mobility sessions, please wear loose, comfortable athletic attire. For deep tissue or targeted massage therapies, standard clinical draping protocols are followed to prioritize your privacy and comfort."
      },
      {
        "q": "How many treatment sessions will I need?",
        "a": "Many clients experience noticeable relief and mobility improvement after a single session. For chronic postural issues, muscle tightness, or athletic recovery maintenance, a structured series of 4 to 6 sessions is recommended."
      },
      {
        "q": "What is your cancellation and rescheduling policy?",
        "a": "We require a 24-hour notification for any cancellations or rescheduling. This allows us to allocate the time to clients on our waitlist. Late cancellations or missed appointments may incur a standard fee."
      },
      {
        "q": "Is trigger point or deep tissue therapy painful?",
        "a": "While releasing restricted muscle tissue can cause temporary tenderness, we practice active communication throughout the session to ensure the pressure remains within your preferred comfort and therapeutic threshold."
      }
    ]
  },
  "servicesPageHero": {
    "metadata": {
      "title": "Services | Muscle Therapy & Sports Recovery",
      "description": "Explore our comprehensive manual therapy and sports recovery services designed to optimize your performance and health."
    },
    "label": "OUR SERVICES",
    "title1": "Therapies",
    "title2": "Designed Around",
    "title3": "You.",
    "description": "Evidence-based treatments. Personalized care. Real results. Move better, feel better, perform better.",
    "btn1": "BOOK APPOINTMENT",
    "btn2": "SEE HOW WE HELP",
    "image": "/images/service-massage.webp",
    "imageAlt": "Precision Care & Recovery",
    "sealText": "PRECISION CARE • REAL RESULTS • FEEL BETTER • MOVE BETTER •",
    "features": [
      {
        "icon": "shield",
        "title": "Personalized",
        "subtitle": "Treatments"
      },
      {
        "icon": "users",
        "title": "Advanced",
        "subtitle": "Techniques"
      },
      {
        "icon": "award",
        "title": "Experienced",
        "subtitle": "Therapists"
      },
      {
        "icon": "check",
        "title": "Proven",
        "subtitle": "Results"
      },
      {
        "icon": "star",
        "title": "Athlete & Active",
        "subtitle": "Focused"
      }
    ]
  },
  "serviceDetailPage": {
    "backLink": "Back to All Services",
    "heroSectionLabel": "CLINICAL RECOVERY PROTOCOL",
    "profileBadgePrefix": "PROFILE",
    "specialtyBadge": "Clinical Specialty",
    "tailoredLabel": "100% Tailored Therapy",
    "tailoredSub": "Individualized Protocols",
    "specDurationLabel": "Duration",
    "specDurationValue": "60 / 90 Mins",
    "specIntensityLabel": "Intensity",
    "specIntensityValue": "Targeted Deep",
    "specFocusLabel": "Focus",
    "specFocusValue": "Trigger Mapping",
    "specResultsLabel": "Results",
    "specResultsValue": "Immediate Relief",
    "bookingDesc": "Schedule your consultation with Antoine Lyles and start feeling pain-free.",
    "bookingCta": "Book Appointment Now",
    "heroDescriptionSuffix": "Targeted manual therapy engineered to eliminate chronic pain, unlock joint mobility, and accelerate athletic recovery.",
    "heroCtaSecondary": "SEE HOW IT HELPS",
    "statsItem1Val": "98%",
    "statsItem1Label": "Pain Relief Success",
    "statsItem2Val": "5,000+",
    "statsItem2Label": "Sessions Completed",
    "statsItem3Val": "Est. 2020",
    "statsItem3Label": "Clinical Standard",
    "statsItem4Val": "100%",
    "statsItem4Label": "Targeted Protocols",
    "overviewSectionLabel": "WHY THIS THERAPY WORKS",
    "overviewTitle1": "Targeted Bodywork.",
    "overviewTitle2": "Engineered For Recovery.",
    "overviewWatermark": "SPECIALIST PRACTICE • EST. 2020",
    "overviewSuccessRate": "98% SUCCESS",
    "overviewIntroSuffix": "We map postural compensations and active muscle trigger points to eliminate root-cause pain, flush soreness, and decompress joint structures.",
    "overviewCtaText": "BOOK YOUR SESSION NOW",
    "overviewHipaaText": "HIPAA Compliant & Certified",
    "candidateSectionLabel": "TARGET CANDIDATES",
    "candidateTitle1": "Who Benefits Most.",
    "candidateTitle2": "Clinical Indications.",
    "candidateSuitability": "SUITABILITY: OPTIMAL",
    "protocolSectionLabel": "02 / SESSION PROTOCOL",
    "protocolTitle1": "3-Phase Clinical",
    "protocolTitle2": "Treatment Sequence.",
    "protocolPhasePrefix": "PHASE 0",
    "protocolDurations": [
      "15 MIN",
      "45 MIN",
      "15 MIN"
    ],
    "protocolBannerBadge": "CLINICAL EXCELLENCE",
    "protocolBannerTitlePrefix": "Ready to experience",
    "protocolBannerTitleSuffix": "?",
    "protocolBannerCta": "BOOK YOUR SESSION NOW",
    "benefitsTitle": "Key Clinical Benefits",
    "benefitCardDesc": "Targeted mechanical input designed to accelerate tissue recovery and restore movement.",
    "whoTitle": "Who Is This Therapy For?",
    "whoProfiles": [
      {
        "label": "01. Athletes",
        "desc": "Competitive athletes needing accelerated recovery between high-intensity training sessions."
      },
      {
        "label": "02. Desk Professionals",
        "desc": "Individuals suffering from postural neck, shoulder, or lower back tightness from prolonged sitting."
      },
      {
        "label": "03. Chronic Pain Sufferers",
        "desc": "Anyone dealing with persistent muscle knots, joint stiffness, or old injury scar tissue buildup."
      },
      {
        "label": "04. Post-Rehab Patients",
        "desc": "People looking to safely regain full range of motion following physical therapy or injury rehabilitation."
      }
    ],
    "sessionTitle": "What To Expect During Your Session",
    "sessionSteps": [
      {
        "num": "01",
        "title": "Postural & Palpation Assessment",
        "desc": "We begin with an active range-of-motion test and palpation to pinpoint tight muscle groups and trigger points."
      },
      {
        "num": "02",
        "title": "Targeted Clinical Bodywork",
        "desc": "Hands-on application of deep tissue pressure, myofascial release, and cross-fiber friction adjusted to your comfort level."
      },
      {
        "num": "03",
        "title": "Post-Session Recovery Plan",
        "desc": "We measure mobility improvements post-therapy and provide personalized home stretching recommendations."
      }
    ],
    "relatedLabel": "Explore More",
    "relatedTitle": "Related Therapies",
    "relatedViewAll": "View All",
    "relatedCardCta": "Explore Therapy"
  },
  "galleryPage": {
    "metadata": {
      "title": "Gallery | Muscle Therapy & Sports Recovery",
      "description": "Take a look inside our clinic and see the professional environment where we restore mobility, alleviate pain, and optimize performance."
    },
    "label": "Our Environment",
    "titleLine1": "The",
    "titleLine2": "Gallery.",
    "description": "Step inside our world. Experience the dedicated environment where we alleviate chronic pain, restore dynamic mobility, and optimize athletic output.",
    "ctaBook": "BOOK YOUR SESSION"
  },
  "contactPage": {
    "metadata": {
      "title": "Contact | 410 Muscle Therapy",
      "description": "Contact 410 Muscle Therapy for consultation and booking."
    },
    "label": "Book A Session",
    "titleLine1": "Get in",
    "titleLine2": "Touch.",
    "description": "Ready to optimize your performance and reduce pain? Fill out the form below or reach out directly to schedule your clinical manual therapy session.",
    "infoHeading": "Contact Information",
    "infoAddressLabel": "Address",
    "infoPhoneLabel": "Phone",
    "infoEmailLabel": "Email",
    "infoHoursLabel": "Clinic Hours",
    "mapLabel": "Map Location"
  },
  "blogsPage": {
    "metadata": {
      "title": "Blogs | Muscle Therapy Insights",
      "description": "Read our latest recovery insights and clinical articles."
    },
    "label": "Recovery Insights",
    "titleLine1": "Our",
    "titleLine2": "Journal.",
    "description": "Explore our latest articles, insights, and clinical tips on deep tissue therapy, mobility, and athletic recovery.",
    "ctaReadMore": "Read More"
  },
  "blogDetailPage": {
    "backLink": "Back to Blogs"
  },
  "blog": {
    "label": "Recovery Insights",
    "title": "Tips, Advice & Insights",
    "ctaAll": "VIEW ALL ARTICLES",
    "ctaReadMore": "Read More"
  },
  "footer": {
    "logoAlt": "410 Muscle Therapy Logo",
    "insuranceLabel": "We Accept Most Insurance Plans",
    "brandDescription": "Elite performance recovery bodywork, mobility optimization, and injury prevention for athletes and active adults since 2020. #bodywork #performancerecovery",
    "quickLinksLabel": "Quick Links",
    "servicesLabel": "Services",
    "contactLabel": "Contact Us",
    "copyright": "© 2024 Muscle Therapy. All Rights Reserved.",
    "privacy": "Privacy Policy",
    "terms": "Terms & Conditions",
    "divider": "|",
    "quickLinks": [
      "Home",
      "About",
      "Services",
      "Conditions",
      "Reviews",
      "Blog",
      "Contact"
    ],
    "services": [
      "Deep Tissue Therapy",
      "Sports Massage",
      "Muscle Recovery",
      "Injury Recovery",
      "Mobility Therapy",
      "Trigger Point Therapy"
    ],
    "insurers": [
      {
        "name": "aetna",
        "display": "aetna",
        "tagline": "Health Insurance",
        "color": "#B8181F"
      },
      {
        "name": "bcbs",
        "display": "BlueCross",
        "tagline": "BlueShield",
        "color": "#005499"
      },
      {
        "name": "cigna",
        "display": "Cigna",
        "tagline": "Health Benefits",
        "color": "#007DBB"
      },
      {
        "name": "uhc",
        "display": "United",
        "tagline": "Healthcare",
        "color": "#0073CF"
      }
    ],
    "address": "125 Wellness Way, Suite 101\nLos Angeles, CA 90001",
    "phone": "(323) 456-7890",
    "email": "info@muscletherapy.com",
    "hours": "Mon–Sat: 8:00 AM – 7:00 PM"
  }
};

async function seed() {
    if (!uri) {
        console.error("MONGODB_URI not found in .env.local");
        return;
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected to MongoDB. Target DB: " + dbName);

        const db = client.db(dbName);
        const collection = db.collection('site_contents');

        const result = await collection.updateOne(
            { key: 'complete_data' },
            { 
                $set: { 
                    data: data,
                    lastUpdated: new Date()
                } 
            },
            { upsert: true }
        );

        console.log("Successfully seeded site contents. Matched: " + result.matchedCount + ", Upserted: " + result.upsertedCount);

        // Seed blog posts if they exist in the JSON data
        if (data.blog && Array.isArray(data.blog.items)) {
            const postsCollection = db.collection('posts');
            for (const item of data.blog.items) {
                let htmlContent = '';
                if (Array.isArray(item.content)) {
                    htmlContent = item.content.map(block => {
                        if (block.type === 'heading') {
                            return `<h2>${block.text}</h2>`;
                        } else {
                            return `<p>${block.text}</p>`;
                        }
                    }).join('\n');
                } else if (typeof item.content === 'string') {
                    htmlContent = item.content;
                }

                const postDoc = {
                    title: item.title,
                    slug: item.slug,
                    content: htmlContent,
                    excerpt: item.excerpt,
                    featuredImage: item.image,
                    status: 'published',
                    publishedAt: new Date(item.date || Date.now()),
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
                console.log("Seeded blog post: " + item.slug);
            }
        }

    } catch (err) {
        console.error("Error seeding database:", err);
    } finally {
        await client.close();
    }
}

seed();

