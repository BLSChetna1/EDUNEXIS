/**
 * EDUNEXIS Student Portal Mock Educational Data
 * Authentic sample curriculum and learning content tailored for primary students in Jharkhand.
 */

export const DEMO_STUDENT_PROFILE = {
  id: "JH-STU-3014",
  name: "Asha Murmu",
  schoolName: "Rajkiya Prathmik Vidyalaya, Torpa",
  class: "Class 3",
  section: "A",
  rollNumber: "14",
  contactNumber: "+91 ******3210", // Masked sensitive guardian phone
  preferredLanguage: "sat", // Santhali
  nativeLanguageName: "Santhali (ᱥᱟᱱᱛᱟᱲᱤ)",
  avatar: "👧",
  isDemo: true,
  createdAt: "2026-06-15T09:00:00Z",
};

export const TOPICS_LEARNED = [
  {
    id: "math-addition",
    topicId: "math-addition",
    title: "दो अंकों का जोड़ (Addition of Two-Digit Numbers)",
    subject: "Mathematics",
    subjectHindi: "गणित",
    category: "Math",
    summary: "बिना हासिल और हासिल वाले दो अंकों के जोड़ को कंकड़ और माचिस की तीलियों से सीखना।",
    date: "Yesterday",
    status: "Completed",
    score: "10/10",
    badgeColor: "#2D6A4F",
    icon: "➕",
    readTime: "8 mins read",
  },
  {
    id: "lang-story",
    topicId: "lang-story",
    title: "कहानियों को पढ़ना और समझना (Reading & Understanding Stories)",
    subject: "Language",
    subjectHindi: "भाषा / संथाली-हिंदी",
    category: "Language",
    summary: "संथाली लोककथा 'चांदो और तितली' को अपनी मातृभाषा और हिंदी में धाराप्रवाह पढ़ना और नए शब्द सीखना।",
    date: "2 days ago",
    status: "Completed",
    score: "9/10",
    badgeColor: "#C85A32",
    icon: "📖",
    readTime: "10 mins read",
  },
  {
    id: "evs-trees",
    topicId: "evs-trees",
    title: "हमारे आस-पास के पेड़-पौधे (Plants & Trees Around Us)",
    subject: "Environmental Studies",
    subjectHindi: "पर्यावरण अध्ययन (EVS)",
    category: "EVS",
    summary: "साल (सखुआ), महुआ और करंज के पेड़ों की पहचान, उनके पत्तों के आकार और वन-संरक्षण का महत्व।",
    date: "3 days ago",
    status: "Completed",
    score: "10/10",
    badgeColor: "#007791",
    icon: "🌳",
    readTime: "7 mins read",
  },
  {
    id: "math-placevalue",
    topicId: "math-placevalue",
    title: "संख्याओं की पहचान और स्थानीय मान (Place Value Basics)",
    subject: "Mathematics",
    subjectHindi: "गणित",
    category: "Math",
    summary: "दहाई और इकाई के बंडल बनाना और 1 से 99 तक संख्याओं को संथाली और देवनागरी में लिखना।",
    date: "Last week",
    status: "Completed",
    score: "8/10",
    badgeColor: "#7B2CBF",
    icon: "🔢",
    readTime: "6 mins read",
  },
];

export const TODAYS_TOPICS = [
  {
    id: "math-subtraction",
    topicId: "math-subtraction",
    title: "घटाव की समझ (Understanding Subtraction)",
    subject: "Mathematics",
    subjectHindi: "गणित",
    category: "Math",
    summary: "जब चीजें कम होती हैं तो कैसे घटाते हैं? हाट बाज़ार में सामान खरीदने और बचे हुए पैसों के सरल उदाहरण।",
    teacher: "Sunita Murmu",
    time: "10:30 AM Today",
    badge: "Current Class",
    icon: "➖",
    readTime: "10 mins",
    actionLabel: "Start Learning",
  },
  {
    id: "lang-sentences",
    topicId: "lang-sentences",
    title: "सरल वाक्य रचना (Simple Sentence Formation)",
    subject: "Language",
    subjectHindi: "भाषा / संथाली-हिंदी",
    category: "Language",
    summary: "चित्र देखकर छोटे-छोटे वाक्य बनाना और नए संथाली-हिंदी शब्दों का अपनी बातचीत में प्रयोग करना।",
    teacher: "Sunita Murmu",
    time: "01:15 PM Today",
    badge: "Current Class",
    icon: "✏️",
    readTime: "8 mins",
    actionLabel: "Start Learning",
  },
];

export const UPCOMING_TOPICS = [
  {
    id: "math-multiplication",
    topicId: "math-multiplication",
    title: "गुणा की बुनियादी समझ (Multiplication Basics)",
    subject: "Mathematics",
    subjectHindi: "गणित",
    category: "Math",
    summary: "बार-बार जोड़ने की क्रिया को गुणा के रूप में समझना — 2, 3 और 5 के पहाड़े आसान तालियों की लय में।",
    plannedDate: "Tomorrow",
    unit: "Unit 3: Multiplication & Division",
    icon: "✖️",
  },
  {
    id: "evs-animals",
    topicId: "evs-animals",
    title: "हमारे घरेलू और जंगली जानवर (Animals Around Us)",
    subject: "Environmental Studies",
    subjectHindi: "पर्यावरण अध्ययन (EVS)",
    category: "EVS",
    summary: "जंगल के हाथी, हिरण और घर की गाय-बकरी के रहन-सहन और उनकी आवाजों को पहचानना।",
    plannedDate: "Thursday",
    unit: "Unit 2: Living Creatures",
    icon: "🐘",
  },
  {
    id: "lang-riddles",
    topicId: "lang-riddles",
    title: "संथाली और हिंदी में शब्द पहेलियां (Word Riddles in Mother Tongue)",
    subject: "Language",
    subjectHindi: "भाषा / संथाली-हिंदी",
    category: "Language",
    summary: "पारंपरिक बुझौवल और पहेलियों के माध्यम से शब्द भंडार और सोच-समझ की शक्ति बढ़ाना।",
    plannedDate: "Friday",
    unit: "Unit 4: Oral Folklore & Rhymes",
    icon: "🧩",
  },
];

export const SYLLABUS_DATA = {
  "Class 3": {
    meta: "Class 3 Primary Syllabus (Aligned with NEP 2020 & FLN Foundational Stage)",
    subjects: [
      {
        id: "math",
        name: "Mathematics (गणित)",
        icon: "📐",
        color: "#2D6A4F",
        description: "Number sense up to 999, basic operations, and geometric patterns from village life.",
        units: [
          {
            unitNumber: "Unit 1",
            title: "Numbers & Place Value (संख्या ज्ञान एवं स्थानीय मान)",
            completed: 3,
            total: 3,
            topics: [
              { name: "गिनती 1 से 100 तक (Counting 1 to 100)", status: "completed", topicId: "math-placevalue" },
              { name: "इकाई और दहाई के बंडल (Bundles of Tens & Ones)", status: "completed", topicId: "math-placevalue" },
              { name: "तीन अंकों की संख्याएँ (Numbers up to 500)", status: "completed" },
            ],
          },
          {
            unitNumber: "Unit 2",
            title: "Addition & Subtraction (जोड़ एवं घटाव)",
            completed: 1,
            total: 3,
            topics: [
              { name: "दो अंकों का जोड़ (Addition of Two-Digit Numbers)", status: "completed", topicId: "math-addition" },
              { name: "घटाव की समझ (Understanding Subtraction)", status: "in-progress", topicId: "math-subtraction" },
              { name: "हासिल वाले जोड़ और घटाव (Addition/Subtraction with Regrouping)", status: "upcoming" },
            ],
          },
          {
            unitNumber: "Unit 3",
            title: "Multiplication Concepts (गुणा की समझ)",
            completed: 0,
            total: 3,
            topics: [
              { name: "बार-बार जोड़ना ही गुणा है (Repeated Addition as Multiplication)", status: "upcoming", topicId: "math-multiplication" },
              { name: "2, 3, 5 के पहाड़े (Tables of 2, 3, and 5)", status: "upcoming" },
              { name: "हाट-बाज़ार में गुणा का उपयोग (Multiplication in Village Markets)", status: "upcoming" },
            ],
          },
          {
            unitNumber: "Unit 4",
            title: "Shapes, Space & Measurement (आकृतियाँ एवं मापन)",
            completed: 0,
            total: 2,
            topics: [
              { name: "सरल ज्यामितीय आकृतियाँ: गोल, चौकोर, तिकोना (2D Shapes)", status: "upcoming" },
              { name: "हाथ और बीता से नापना (Measuring with Hands & Paces)", status: "upcoming" },
            ],
          },
        ],
      },
      {
        id: "lang",
        name: "Language & Vernacular Bridge (भाषा एवं संथाली)",
        icon: "📖",
        color: "#C85A32",
        description: "Bilingual phonemic awareness, Ol Chiki script familiarity, vocabulary enrichment, and story reading.",
        units: [
          {
            unitNumber: "Unit 1",
            title: "Letters & Sounds (वर्ण एवं ध्वनियाँ)",
            completed: 2,
            total: 2,
            topics: [
              { name: "हिंदी वर्णमाला और संथाली ओल चिकि परिचय (Alphabet Mapping)", status: "completed" },
              { name: "समान ध्वनियों की पहचान (Phonics & Sound Blends)", status: "completed" },
            ],
          },
          {
            unitNumber: "Unit 2",
            title: "Words & Vocabulary (शब्द एवं शब्द भंडार)",
            completed: 2,
            total: 3,
            topics: [
              { name: "परिवार और घर के शब्द (Family & Household Words)", status: "completed" },
              { name: "कहानियों को पढ़ना और समझना (Reading Stories)", status: "completed", topicId: "lang-story" },
              { name: "सरल वाक्य रचना (Simple Sentence Formation)", status: "in-progress", topicId: "lang-sentences" },
            ],
          },
          {
            unitNumber: "Unit 3",
            title: "Folklore, Poetry & Songs (लोककथाएँ एवं बालगीत)",
            completed: 0,
            total: 2,
            topics: [
              { name: "संथाली और हिंदी में शब्द पहेलियां (Word Riddles in Mother Tongue)", status: "upcoming", topicId: "lang-riddles" },
              { name: "बाहा और सोहराय पर्व के बालगीत (Festival Rhymes)", status: "upcoming" },
            ],
          },
        ],
      },
      {
        id: "evs",
        name: "Environmental Studies (पर्यावरण अध्ययन)",
        icon: "🌿",
        color: "#007791",
        description: "Understanding family relations, village surroundings, forest ecosystems, and health hygiene.",
        units: [
          {
            unitNumber: "Unit 1",
            title: "My Family & Community (मेरा परिवार और समाज)",
            completed: 2,
            total: 2,
            topics: [
              { name: "हमारे घर के सदस्य और रिश्ते (Family Members & Roles)", status: "completed" },
              { name: "गाँव के सहयोगी: लोहार, कुम्हार, किसान (Village Helpers)", status: "completed" },
            ],
          },
          {
            unitNumber: "Unit 2",
            title: "Flora & Fauna of Jharkhand (झारखंड के पेड़-पौधे और जीव)",
            completed: 1,
            total: 3,
            topics: [
              { name: "हमारे आस-पास के पेड़-पौधे (Plants & Trees Around Us)", status: "completed", topicId: "evs-trees" },
              { name: "हमारे घरेलू और जंगली जानवर (Animals Around Us)", status: "upcoming", topicId: "evs-animals" },
              { name: "पक्षी और उनकी बोलियाँ (Birds of the Forest)", status: "upcoming" },
            ],
          },
          {
            unitNumber: "Unit 3",
            title: "Water, Food & Hygiene (जल, भोजन और स्वच्छता)",
            completed: 0,
            total: 2,
            topics: [
              { name: "पानी के स्रोत और शुद्धता (Water Sources & Cleanliness)", status: "upcoming" },
              { name: "मिड-डे मील और स्वस्थ खानपान (Healthy Eating Habits)", status: "upcoming" },
            ],
          },
        ],
      },
    ],
  },
  "Class 1": {
    meta: "Class 1 Foundational Stage (Oral Language, Shapes & Number Sense 1-20)",
    subjects: [
      {
        id: "math",
        name: "Mathematics (गणित)",
        icon: "📐",
        color: "#2D6A4F",
        description: "Pre-number concepts, counting objects up to 20, comparing sizes.",
        units: [
          {
            unitNumber: "Unit 1",
            title: "Pre-Number Concepts (पूर्व संख्या संप्रत्यय)",
            completed: 2,
            total: 2,
            topics: [
              { name: "छोटा-बड़ा, भारी-हल्का (Big-Small, Heavy-Light)", status: "completed" },
              { name: "ऊपर-नीचे, पास-दूर (Spatial Relations)", status: "completed" },
            ],
          },
          {
            unitNumber: "Unit 2",
            title: "Numbers 1 to 9 (संख्या 1 से 9)",
            completed: 1,
            total: 2,
            topics: [
              { name: "उंगलियों और कंकड़ों से गिनती (Counting 1 to 9)", status: "completed" },
              { name: "शून्य (0) की अवधारणा (Concept of Zero)", status: "upcoming" },
            ],
          },
        ],
      },
      {
        id: "lang",
        name: "Language (भाषा)",
        icon: "📖",
        color: "#C85A32",
        description: "Oral storytelling, listening to tribal folk rhymes, drawing and scribbling.",
        units: [
          {
            unitNumber: "Unit 1",
            title: "Oral Expression (मौखिक अभिव्यक्ति)",
            completed: 2,
            total: 2,
            topics: [
              { name: "मेरा नाम और मेरा गाँव (Self Introduction)", status: "completed" },
              { name: "पशु-पक्षियों की आवाजें निकालना (Mimicking Animal Sounds)", status: "completed" },
            ],
          },
        ],
      },
      {
        id: "evs",
        name: "EVS (हमारा परिवेश)",
        icon: "🌿",
        color: "#007791",
        description: "Identifying body parts, personal hygiene, and classroom rules.",
        units: [
          {
            unitNumber: "Unit 1",
            title: "My Body & Cleanliness (मेरा शरीर और सफाई)",
            completed: 1,
            total: 2,
            topics: [
              { name: "हाथ धोना और दाँत साफ करना (Daily Hygiene)", status: "completed" },
              { name: "शरीर के अंगों के नाम मातृभाषा में (Body Parts)", status: "upcoming" },
            ],
          },
        ],
      },
    ],
  },
  "Class 2": {
    meta: "Class 2 Foundational Stage (Numbers up to 99, Simple Addition & Word Recognition)",
    subjects: [
      {
        id: "math",
        name: "Mathematics (गणित)",
        icon: "📐",
        color: "#2D6A4F",
        description: "Numbers up to 99, simple 1-digit addition and subtraction.",
        units: [
          {
            unitNumber: "Unit 1",
            title: "Numbers up to 50",
            completed: 2,
            total: 2,
            topics: [
              { name: "संख्याओं को क्रम में लगाना", status: "completed" },
              { name: "आगे और पीछे की संख्या", status: "completed" },
            ],
          },
        ],
      },
      {
        id: "lang",
        name: "Language (भाषा)",
        icon: "📖",
        color: "#C85A32",
        description: "Two-letter words, simple picture sentences, bilingual songs.",
        units: [
          {
            unitNumber: "Unit 1",
            title: "Word Building (शब्द निर्माण)",
            completed: 2,
            total: 2,
            topics: [
              { name: "सरल शब्द पढ़ना", status: "completed" },
              { name: "मात्राओं की पहचान", status: "completed" },
            ],
          },
        ],
      },
      {
        id: "evs",
        name: "EVS (पर्यावरण)",
        icon: "🌿",
        color: "#007791",
        description: "Our domestic pets, local trees, and water.",
        units: [
          {
            unitNumber: "Unit 1",
            title: "Our Green Friends",
            completed: 1,
            total: 2,
            topics: [
              { name: "पेड़ों से हमें क्या मिलता है?", status: "completed" },
              { name: "सब्जियों और फलों के नाम", status: "upcoming" },
            ],
          },
        ],
      },
    ],
  },
  "Class 4": {
    meta: "Class 4 Preparatory Stage (Large Numbers, Fractions, Regional Geography)",
    subjects: [
      {
        id: "math",
        name: "Mathematics (गणित)",
        icon: "📐",
        color: "#2D6A4F",
        description: "4-digit numbers, division, simple fractions, and time reading.",
        units: [
          {
            unitNumber: "Unit 1",
            title: "Numbers & Operations",
            completed: 2,
            total: 3,
            topics: [
              { name: "चार अंकों की संख्याएँ (Numbers to 9999)", status: "completed" },
              { name: "भाग की प्रक्रिया (Long Division)", status: "in-progress" },
              { name: "आधा और चौथाई (Fractions 1/2, 1/4)", status: "upcoming" },
            ],
          },
        ],
      },
      {
        id: "lang",
        name: "Language (भाषा)",
        icon: "📖",
        color: "#C85A32",
        description: "Paragraph writing, story comprehension, Hindi-tribal grammar comparison.",
        units: [
          {
            unitNumber: "Unit 1",
            title: "Composition & Grammar",
            completed: 1,
            total: 2,
            topics: [
              { name: "संज्ञा और सर्वनाम की समझ", status: "completed" },
              { name: "अपने गाँव पर 5 वाक्य लिखना", status: "upcoming" },
            ],
          },
        ],
      },
      {
        id: "evs",
        name: "EVS (पर्यावरण)",
        icon: "🌿",
        color: "#007791",
        description: "Rivers of Jharkhand, mineral resources, and tribal craft heritage.",
        units: [
          {
            unitNumber: "Unit 1",
            title: "Jharkhand Our Land",
            completed: 2,
            total: 2,
            topics: [
              { name: "दामोदर और सुवर्णरेखा नदियाँ", status: "completed" },
              { name: "डोकरा और मिट्टी की कला", status: "completed" },
            ],
          },
        ],
      },
    ],
  },
  "Class 5": {
    meta: "Class 5 Preparatory Stage (Bridge to Upper Primary Curriculum)",
    subjects: [
      {
        id: "math",
        name: "Mathematics (गणित)",
        icon: "📐",
        color: "#2D6A4F",
        description: "Factors, multiples, decimals, perimeter, and area calculation.",
        units: [
          {
            unitNumber: "Unit 1",
            title: "Advanced Arithmetic",
            completed: 2,
            total: 3,
            topics: [
              { name: "गुणनखंड और गुणज (Factors & Multiples)", status: "completed" },
              { name: "दशमलव संख्याएँ (Decimals)", status: "in-progress" },
              { name: "क्षेत्रफल और परिमाप (Area & Perimeter)", status: "upcoming" },
            ],
          },
        ],
      },
      {
        id: "lang",
        name: "Language (भाषा)",
        icon: "📖",
        color: "#C85A32",
        description: "Advanced comprehension, essay writing, literary stories in Hindi & tribal languages.",
        units: [
          {
            unitNumber: "Unit 1",
            title: "Literature & Grammar",
            completed: 2,
            total: 2,
            topics: [
              { name: "बिरसा मुंडा की जीवनी", status: "completed" },
              { name: "मुहावरे और लोकोक्तियाँ", status: "completed" },
            ],
          },
        ],
      },
      {
        id: "evs",
        name: "EVS (पर्यावरण)",
        icon: "🌿",
        color: "#007791",
        description: "Forest conservation acts, climate, weather, and science basics.",
        units: [
          {
            unitNumber: "Unit 1",
            title: "Ecosystem & Conservation",
            completed: 1,
            total: 2,
            topics: [
              { name: "जंगल अधिकार और हमारा पर्यावरण", status: "completed" },
              { name: "ऋतु चक्र और खेती-किसानी", status: "upcoming" },
            ],
          },
        ],
      },
    ],
  },
};

export const TOPIC_DETAILS_MAP = {
  "math-subtraction": {
    id: "math-subtraction",
    title: "घटाव की समझ (Understanding Subtraction)",
    subject: "Mathematics",
    subjectHindi: "गणित",
    grade: "Class 3",
    readTime: "10 mins read",
    badgeColor: "#2D6A4F",
    icon: "➖",
    heroDescription: "जब हमारे पास कुछ चीजें होती हैं और उनमें से कुछ कम हो जाती हैं या किसी को दे दी जाती हैं, तो बचे हुए को जानने के लिए हम 'घटाव' (Subtraction) करते हैं।",
    simpleExplanation: "सोचिए कि आपके पास 8 मीठे जामुन हैं। आपने अपने छोटे भाई को 3 जामुन खाने के लिए दिए। अब आपकी हथेली पर कितने जामुन बचे? जब आप 8 में से 3 अलग कर देते हैं, तो बचते हैं 5 जामुन! यही घटाव है। गणित में इसे 8 - 3 = 5 लिखते हैं। घटाव का चिन्ह '-' (ऋण या माइनस) होता है।",
    importantConcepts: [
      {
        title: "कम होना या अलग करना (Taking Away)",
        text: "घटाव का मतलब है कुल संख्या में से कुछ संख्या को कम कर देना।",
      },
      {
        title: "घटाव का निशान '-' (Minus Sign)",
        text: "जब भी दो संख्याओं के बीच '-' दिखे, तो समझें कि दूसरी संख्या पहली में से घटेगी।",
      },
      {
        title: "दहाई और इकाई का नियम",
        text: "दो अंकों के घटाव में पहले इकाई (Ones) को इकाई से घटाते हैं, फिर दहाई (Tens) को दहाई से।",
      },
    ],
    vocabularyBridge: [
      {
        hindi: "घटाव / कम करना",
        sat: "ᱜᱷᱟᱴᱟᱣ / ᱠᱚᱢ (घटाव / कोम)",
        hoc: "ᱠᱚᱢᱮᱭᱟ (कोमेया)",
        unr: "ᱠᱚᱢ ᱠᱮᱫᱟ (कोम केदा)",
        english: "Subtraction / Minus",
      },
      {
        hindi: "बचा हुआ / शेष",
        sat: "ᱥᱟᱨᱮᱡ (सारेज)",
        hoc: "ᱥᱟᱨᱮᱡ (सारेज)",
        unr: "ᱥᱟᱨᱮᱡᱽ (सारेज)",
        english: "Remaining / Leftover",
      },
      {
        hindi: "गिनती / संख्या",
        sat: "ᱞᱮᱠᱷᱟ (लेखा)",
        hoc: "ᱞᱮᱠᱷᱟ (लेखा)",
        unr: "ᱞᱮᱠᱷᱟ (लेखा)",
        english: "Counting / Number",
      },
      {
        hindi: "इकाई (एक-एक वस्तु)",
        sat: "ᱢᱤᱫᱴᱟᱹᱝ (मिदटांग)",
        hoc: "ᱢᱤᱭᱟᱹᱫᱽ (मियाद)",
        unr: "ᱢᱤᱭᱟᱹᱫᱽ (मियाद)",
        english: "Unit / Ones",
      },
      {
        hindi: "दहाई (दस का बंडल)",
        sat: "ᱜᱮᱞᱟᱝ (गेलांग)",
        hoc: "ᱜᱮᱞ (गेल)",
        unr: "ᱜᱮᱞ (गेल)",
        english: "Tens bundle",
      },
    ],
    villageExample: {
      title: "🌾 गाँव का उदाहरण: तोरपा का साप्ताहिक हाट",
      story: "आशा अपनी माँ के साथ तोरपा के हाट गई। माँ ने उसे 25 रुपये दिए। आशा ने 10 रुपये की पेंसिल और रबर खरीदी। अब आशा के पास कितने रुपये बचे? 25 रुपये में से 10 रुपये खर्च हुए, यानी 25 - 10 = 15 रुपये बचे! आशा ने बचे हुए पैसों को संभाल कर अपने बस्ते में रख लिया।",
    },
    practiceActivity: {
      question: "यदि टोकरी में 14 आम हैं और आपने 5 आम अपने दोस्तों को दे दिए, तो टोकरी में कितने आम बचेंगे?",
      hint: "14 में से 5 उंगलियाँ गिनकर पीछे की ओर गिनें: 13, 12, 11, 10, 9...",
      answer: "14 - 5 = 9 आम बचेंगे।",
    },
  },
  "math-addition": {
    id: "math-addition",
    title: "दो अंकों का जोड़ (Addition of Two-Digit Numbers)",
    subject: "Mathematics",
    subjectHindi: "गणित",
    grade: "Class 3",
    readTime: "8 mins read",
    badgeColor: "#2D6A4F",
    icon: "➕",
    heroDescription: "जब दो या दो से अधिक चीजों के समूहों को एक साथ मिलाया जाता है, तो उसे 'जोड़' (Addition) कहते हैं। जोड़ से संख्या बढ़ती है।",
    simpleExplanation: "दो अंकों के जोड़ में हम पहले इकाई के अंकों को जोड़ते हैं, फिर दहाई के अंकों को जोड़ते हैं। उदाहरण के लिए: 24 + 13। इकाई में 4 और 3 मिलकर 7 बने। दहाई में 2 और 1 मिलकर 3 बने। कुल उत्तर हुआ 37!",
    importantConcepts: [
      {
        title: "मिलाना और एक साथ गिनना",
        text: "जोड़ का मतलब है दो समूहों को मिलाकर एक बड़ा समूह बनाना।",
      },
      {
        title: "जोड़ का चिन्ह '+' (Plus Sign)",
        text: "यह संकेत बताता है कि दोनों ओर की संख्याओं को जोड़ना है।",
      },
      {
        title: "माचिस की तीलियों का बंडल",
        text: "10 तीलियों का 1 बंडल = 1 दहाई। खुली तीलियां = इकाई।",
      },
    ],
    vocabularyBridge: [
      {
        hindi: "जोड़ना / मिलाना",
        sat: "ᱢᱮᱥᱟ / ᱡᱚᱲᱟᱣ (मेसा / जोड़ाव)",
        hoc: "ᱢᱮᱥᱟᱭᱮᱭᱟ (मेसायेया)",
        unr: "ᱢᱮᱥᱟ ᱠᱮᱫᱟ (मेसा केदा)",
        english: "Addition / Combine",
      },
      {
        hindi: "कुल मिलाकर",
        sat: "ᱡᱚᱛᱚᱛᱮ (जोतोते)",
        hoc: "ᱥᱟᱱᱟᱢᱛᱮ (सनामते)",
        unr: "ᱥᱚᱵᱮᱱᱛᱮ (सोबेनते)",
        english: "Total / In all",
      },
      {
        hindi: "दो (संख्या)",
        sat: "ᱵᱟᱨ (बार)",
        hoc: "ᱵᱟᱨᱤᱭᱟ (बारिया)",
        unr: "ᱵᱟᱨᱤᱭᱟ (बारिया)",
        english: "Two",
      },
    ],
    villageExample: {
      title: "🌾 गाँव का उदाहरण: महुआ के फूलों की टोकरी",
      story: "सुबह-सुबह बिरसा ने पेड़ के नीचे से 12 महुआ के फूल चुने। उसकी बहन सुकूमनी ने 15 फूल चुने। दोनों ने अपने फूल एक ही डलिया में डाल दिए। अब डलिया में कुल 12 + 15 = 27 फूल हो गए!",
    },
    practiceActivity: {
      question: "कक्षा 3 में 16 लड़के और 18 लड़कियाँ हैं। कक्षा में कुल कितने बच्चे हैं?",
      hint: "पहले 6 और 8 जोड़ें (14 हुआ, 4 इकाई और 1 दहाई हासिल), फिर 1 + 1 + 1 दहाई जोड़ें।",
      answer: "16 + 18 = 34 बच्चे।",
    },
  },
  "lang-story": {
    id: "lang-story",
    title: "कहानियों को पढ़ना और समझना (Reading Stories)",
    subject: "Language",
    subjectHindi: "भाषा / संथाली-हिंदी",
    grade: "Class 3",
    readTime: "10 mins read",
    badgeColor: "#C85A32",
    icon: "📖",
    heroDescription: "कहानियाँ हमें नई दुनिया की सैर कराती हैं। कहानी पढ़ते समय पात्रों की भावना और कहानी की मुख्य सीख को समझना जरूरी होता है।",
    simpleExplanation: "लोककथा 'चांदो और तितली' में एक छोटी तितली सुबह सूरज (चांदो) के उगने पर फूलों का रस पीने निकलती है। रास्ते में वह चींटी से मिलती है जो चावल का दाना खींच रही थी। तितली चींटी की मदद करती है। यह कहानी हमें आपसी सहयोग और मित्रता का पाठ पढ़ाती है।",
    importantConcepts: [
      {
        title: "कहानी के मुख्य पात्र",
        text: "कहानी में कौन-कौन है और वे क्या काम कर रहे हैं, इसे ध्यान से देखें।",
      },
      {
        title: "नए शब्दों का अर्थ",
        text: "अनजान शब्दों को रेखांकित करें और अपनी संथाली/मुंडारी बोली में उनके अर्थ समझें।",
      },
      {
        title: "कहानी की सीख",
        text: "कहानी हमें सिखाती है कि मिल-जुलकर काम करने से कठिन काम भी आसान हो जाता है।",
      },
    ],
    vocabularyBridge: [
      {
        hindi: "सूरज",
        sat: "ᱥᱤᱧ ᱪᱟᱸᱫᱚ (सिञ चांदो)",
        hoc: "ᱥᱤᱝᱜᱤ (सिंगी)",
        unr: "ᱥᱤᱝᱜᱤ (सिंगी)",
        english: "Sun",
      },
      {
        hindi: "तितली",
        sat: "ᱯᱤᱯᱤᱲᱤᱭᱟᱹᱝ (पिपिड़िय़ांग)",
        hoc: "ᱯᱤᱯᱤᱲᱤᱭᱟᱹᱝ (पिपिड़िय़ांग)",
        unr: "ᱯᱤᱯᱤᱲᱤᱭᱟᱹᱝ (पिपिड़िय़ांग)",
        english: "Butterfly",
      },
      {
        hindi: "मित्रता / दोस्त",
        sat: "ᱜᱟᱛᱮ (गाते)",
        hoc: "ᱜᱟᱛᱮ (गाते)",
        unr: "ᱡᱚᱲᱤ (जोड़ी)",
        english: "Friend / Friendship",
      },
      {
        hindi: "कहानी",
        sat: "ᱠᱟᱹᱦᱱᱤ (कहनी)",
        hoc: "ᱠᱟᱹᱦᱱᱤ (कहनी)",
        unr: "ᱠᱟᱹᱦᱱᱤ (कहनी)",
        english: "Story / Tale",
      },
    ],
    villageExample: {
      title: "🌾 गाँव का उदाहरण: दादी की चौपाल",
      story: "शाम को चूल्हा जलने के बाद जब बच्चे दादी के पास बैठते हैं, तो दादी संथाली में राजा और सियार की पुरानी कहनी सुनाती हैं। सभी बच्चे ध्यान से सुनते हैं और अंत में पूछते हैं कि सियार ने क्या किया!",
    },
    practiceActivity: {
      question: "तितली ने चींटी की क्या मदद की?",
      hint: "कहानी याद करें: चींटी क्या खींच रही थी?",
      answer: "तितली ने भारी चावल का दाना उठाने में चींटी की मदद की।",
    },
  },
  "evs-trees": {
    id: "evs-trees",
    title: "हमारे आस-पास के पेड़-पौधे (Plants & Trees Around Us)",
    subject: "Environmental Studies",
    subjectHindi: "पर्यावरण अध्ययन (EVS)",
    grade: "Class 3",
    readTime: "7 mins read",
    badgeColor: "#007791",
    icon: "🌳",
    heroDescription: "पेड़ हमारे सच्चे मित्र हैं। वे हमें शुद्ध हवा, मीठे फल, छाया और जीवनदायिनी जड़ी-बूटियाँ देते हैं। झारखंड की धरती सघन वनों से सुशोभित है।",
    simpleExplanation: "हमारे झारखंड में साल का पेड़ सबसे पवित्र माना जाता है। इसे सखुआ भी कहते हैं। सरहुल के पर्व पर साल के सफेद फूलों (बाहा) से पूजा की जाती है। महुआ का पेड़ हमें स्वादिष्ट फूल और तेल देता है। करंज के बीजों से दीपक जलता है। हमें कभी हरे पेड़ नहीं काटने चाहिए।",
    importantConcepts: [
      {
        title: "पेड़ के प्रमुख अंग",
        text: "जड़ (Roots), तना (Trunk), पत्तियां (Leaves), फूल (Flowers) और फल (Fruits)।",
      },
      {
        title: "पत्तियों का हरा रंग",
        text: "पत्तियाँ सूर्य के प्रकाश से पूरे पेड़ के लिए भोजन तैयार करती हैं।",
      },
      {
        title: "प्रकृति की रक्षा",
        text: "एक पेड़ काटने से पहले दस नए पेड़ लगाना हमारी संस्कृति का नियम है।",
      },
    ],
    vocabularyBridge: [
      {
        hindi: "साल का पेड़ (सखुआ)",
        sat: "ᱥᱟᱨᱡᱚᱢ ᱫᱟᱨᱮ (सारजोम दारे)",
        hoc: "ᱥᱟᱨᱡᱚᱢ ᱫᱟᱨᱩ (सारजोम दारू)",
        unr: "ᱥᱟᱨᱡᱚᱢ ᱫᱟᱨᱩ (सारजोम दारू)",
        english: "Sal Tree",
      },
      {
        hindi: "पत्ता",
        sat: "ᱥᱟᱠᱟᱢ (साकाम)",
        hoc: "ᱥᱟᱠᱟᱢ (साकाम)",
        unr: "ᱥᱟᱠᱟᱢ (साकाम)",
        english: "Leaf",
      },
      {
        hindi: "फूल",
        sat: "ᱵᱟᱦᱟ (बाहा)",
        hoc: "ᱵᱟ (बा)",
        unr: "ᱵᱟᱦᱟ (बाहा)",
        english: "Flower",
      },
      {
        hindi: "जंगल / वन",
        sat: "ᱵᱤᱨ (बीर)",
        hoc: "ᱵᱤᱨ (बीर)",
        unr: "ᱵᱤᱨ (बीर)",
        english: "Forest",
      },
    ],
    villageExample: {
      title: "🌾 गाँव का उदाहरण: सरहुल की परंपरा",
      story: "सरहुल के दिन पाहन (ग्राम पुजारी) जाहेरथान में जाकर सखुआ (साल) के नए फूलों से धरती और प्रकृति की पूजा करते हैं। बच्चे अपने कानों और बालों में बाहा के फूल सजाकर खुशी से नाचते हैं।",
    },
    practiceActivity: {
      question: "झारखंड के दो प्रसिद्ध वृक्षों के नाम बताइए जो हमारे लिए उपयोगी हैं?",
      hint: "एक से सरहुल में पूजा होती है और दूसरे के मीठे फूल चुने जाते हैं।",
      answer: "1. साल (सखुआ / सारजोम दारे) और 2. महुआ (महुल दारे)।",
    },
  },
};

export const SAMPLE_AI_CONVERSATIONS = [
  {
    topicId: "math-subtraction",
    messages: [
      {
        sender: "user",
        text: "मुझे घटाव समझ नहीं आया, क्या आप मुझे सरल तरीके से समझा सकते हैं?",
        timestamp: "10:35 AM",
      },
      {
        sender: "assistant",
        text: "नमस्ते आशा! बिल्कुल, घटाव बहुत आसान है। 😊\n\nसोचो तुम्हारे पास 10 कंचे (गुल्ली) हैं। खेलते समय तुमने अपने दोस्त को 4 कंचे दे दिए। अब तुम्हारी जेब में कितने कंचे बचे? चलो गिनते हैं: 10 में से 4 हटाए तो बचे 6! गणित में इसे कहते हैं: 10 - 4 = 6।\n\nसंथाली में इसे कहते हैं 'ᱠᱚᱢ ᱠᱮᱫᱟ' (कम किया)। क्या तुम 7 - 2 का उत्तर बता सकती हो?",
        timestamp: "10:35 AM",
      },
    ],
  },
  {
    topicId: "evs-trees",
    messages: [
      {
        sender: "user",
        text: "साल के पेड़ को संथाली में क्या कहते हैं?",
        timestamp: "Yesterday",
      },
      {
        sender: "assistant",
        text: "साल (सखुआ) के पेड़ को संथाली में 'ᱥᱟᱨᱡᱚᱢ ᱫᱟᱨᱮ' (सारजोम दारे) कहते हैं! 🌳\n\nहो (Ho) भाषा में इसे 'ᱥᱟᱨᱡᱚᱢ ᱫᱟᱨᱩ' (Sarjom Daru) कहा जाता है। यह झारखंड का बहुत पवित्र पेड़ है और सरहुल पर्व पर इसके फूलों की पूजा की जाती है। क्या तुम्हारे स्कूल के पास भी कोई सारजोम दारे है?",
        timestamp: "Yesterday",
      },
    ],
  },
];
