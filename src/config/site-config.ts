/**
 * Centralized Site Configuration for Hindi Health Guide (हिंदी हेल्थ गाइड)
 * All public metadata, categories, navigation, and settings are defined here.
 */

export interface CategoryConfig {
  id: string;
  name: string;
  englishName: string;
  slug: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  iconName: string;
  color: string;
  featuredOrder: number;
  isMedicallyReviewedOnly?: boolean;
}

export interface SiteConfig {
  name: string;
  hindiName: string;
  tagline: string;
  description: string;
  productionUrl: string;
  defaultLanguage: string;
  contactEmail: string;
  socialLinks: {
    twitter?: string;
    facebook?: string;
    youtube?: string;
    instagram?: string;
  };
  categories: CategoryConfig[];
  helplines: {
    name: string;
    number: string;
    description: string;
    tollFree: boolean;
  }[];
  medicalDisclaimer: string;
  editorialPrinciples: {
    title: string;
    description: string;
  }[];
}

export const SITE_CONFIG: SiteConfig = {
  name: "Hindi Health Guide",
  hindiName: "हिंदी हेल्थ गाइड",
  tagline: "यौन एवं प्रजनन स्वास्थ्य की प्रामाणिक, वैज्ञानिक और गोपनीय जानकारी",
  description:
    "हिंदी हेल्थ गाइड भारत के पाठकों के लिए यौन शिक्षा, प्रजनन स्वास्थ्य, सुरक्षित संबंध, मिथक बनाम तथ्य और डॉक्टर-समीक्षित स्वास्थ्य मार्गदर्शन का सबसे विश्वसनीय हिंदी मंच है।",
  productionUrl: "https://hindihealthguide.org",
  defaultLanguage: "hi-IN",
  contactEmail: "editorial@hindihealthguide.org",
  socialLinks: {
    twitter: "https://twitter.com/hindihealthgd",
    youtube: "https://youtube.com/@hindihealthguide",
  },
  helplines: [
    {
      name: "NACO राष्ट्रीय एड्स और STI हेल्पलाइन",
      number: "1097",
      description: "निःशुल्क, 24x7 और पूर्णतः गोपनीय परामर्श (भारत सरकार)",
      tollFree: true,
    },
    {
      name: "राष्ट्रीय स्वास्थ्य हेल्पलाइन (NHP)",
      number: "1800-180-1104",
      description: "स्वास्थ्य एवं परिवार कल्याण मंत्रालय, भारत सरकार",
      tollFree: true,
    },
    {
      name: "Tele-MANAS मानसिक स्वास्थ्य परामर्श",
      number: "14416 / 1800-891-4416",
      description: "मानसिक तनाव, चिंता एवं भावनात्मक स्वास्थ्य सहायता",
      tollFree: true,
    },
    {
      name: "महिला राष्ट्रीय हेल्पलाइन",
      number: "1091 / 181",
      description: "सहमति, सुरक्षा एवं आपातकालीन सहायता",
      tollFree: true,
    },
  ],
  medicalDisclaimer:
    "महत्वपूर्ण अस्वीकरण (Medical Disclaimer): हिंदी हेल्थ गाइड पर उपलब्ध सभी लेख, उत्तर और सामग्री केवल शैक्षिक और जागरूकता उद्देश्यों के लिए प्रकाशित की जाती है। यह किसी योग्य चिकित्सक (Doctor/Specialist) के परामर्श, निदान (Diagnosis) या व्यक्तिगत चिकित्सा उपचार का विकल्प नहीं है। किसी भी स्वास्थ्य संबंधी लक्षण या शंका की स्थिति में हमेशा योग्य डॉक्टर से प्रत्यक्ष परामर्श लें। आपात स्थिति में तुरंत निकटतम अस्पताल या राष्ट्रीय हेल्पलाइन से संपर्क करें।",
  editorialPrinciples: [
    {
      title: "प्रमाण-आधारित चिकित्सा स्रोत",
      description:
        "हमारी सामग्री WHO (विश्व स्वास्थ्य संगठन), MoHFW (स्वास्थ्य एवं परिवार कल्याण मंत्रालय), NACO, ICMR और CDC के सहकर्मी-समीक्षित वैज्ञानिक दिशानिर्देशों पर आधारित होती है।",
    },
    {
      title: "योग्य डॉक्टरों द्वारा समीक्षा",
      description:
        "संवेदनशील और चिकित्सीय लेखों की समीक्षा MBBS, MD/MS, गायनेकोलॉजिस्ट, डर्मेटोलॉजिस्ट या यूरोलॉजिस्ट द्वारा की जाती है और उनके नाम व पंजीयन संख्या पारदर्शी रूप से दर्ज होती है।",
    },
    {
      title: "गरिमापूर्ण एवं गैर-अश्लील भाषा",
      description:
        "यौन शिक्षा को अश्लीलता (pornography) से पूर्णतः अलग रखकर सम्मानजनक, स्पष्ट और वैज्ञानिक देवनागरी हिंदी में प्रस्तुत किया जाता है।",
    },
    {
      title: "सहमति, निजता और सुरक्षा",
      description:
        "हम सभी पारस्परिक संबंधों में स्पष्ट सहमति (Consent), लैंगिक समानता और नाबालिगों की सुरक्षा को सर्वोच्च प्राथमिकता देते हैं।",
    },
  ],

  /**
   * 7 Approved Categories (सातों स्वीकृत श्रेणियां)
   * Names, counts, and slugs are strictly fixed according to master prompt.
   */
  categories: [
    {
      id: "cat-1",
      name: "यौन शिक्षा",
      englishName: "Sexual Education",
      slug: "sexual-education",
      description:
        "शरीर रचना, किशोरावस्था, हार्मोनल बदलाव, स्वच्छता और वैज्ञानिक यौन शिक्षा के बुनियादी सिद्धांतों पर प्रामाणिक जानकारी।",
      seoTitle: "यौन शिक्षा (Sexual Education in Hindi) – संपूर्ण और प्रामाणिक गाइड",
      seoDescription:
        "किशोरावस्था, शरीर रचना और वैज्ञानिक यौन शिक्षा की संपूर्ण हिंदी जानकारी। जानिए शरीर और हार्मोनल बदलावों के बारे में।",
      iconName: "GraduationCap",
      color: "teal",
      featuredOrder: 1,
    },
    {
      id: "cat-2",
      name: "यौन और प्रजनन स्वास्थ्य",
      englishName: "Sexual and Reproductive Health",
      slug: "sexual-and-reproductive-health",
      description:
        "गर्भधारण, परिवार नियोजन, गर्भनिरोधक विकल्प, मासिक धर्म, बांझपन और प्रजनन प्रणाली के स्वास्थ्य से जुड़े वैज्ञानिक लेख।",
      seoTitle: "यौन और प्रजनन स्वास्थ्य (Reproductive Health in Hindi)",
      seoDescription:
        "मासिक धर्म, गर्भधारण, गर्भनिरोधक साधन और प्रजनन स्वास्थ्य की संपूर्ण जानकारी हिंदी में।",
      iconName: "HeartPulse",
      color: "emerald",
      featuredOrder: 2,
    },
    {
      id: "cat-3",
      name: "स्वास्थ्य संबंधी सवाल-जवाब",
      englishName: "Health Q&A",
      slug: "health-qa",
      description:
        "पाठकों के आम यौन स्वास्थ्य प्रश्नों के सीधे, तथ्यपरक और चिकित्सीय साक्ष्यों पर आधारित स्पष्ट उत्तर।",
      seoTitle: "यौन स्वास्थ्य सवाल-जवाब (Health Q&A in Hindi)",
      seoDescription:
        "यौन एवं प्रजनन स्वास्थ्य से जुड़े आम प्रश्नों के डॉक्टर-समीक्षित और वैज्ञानिक हिंदी उत्तर।",
      iconName: "HelpCircle",
      color: "sky",
      featuredOrder: 3,
    },
    {
      id: "cat-4",
      name: "मिथक बनाम तथ्य",
      englishName: "Myths vs Facts",
      slug: "myths-vs-facts",
      description:
        "भारतीय समाज में यौन स्वास्थ्य को लेकर फैली भ्रांतियों, अंधविश्वासों और अधूरी जानकारियों का वैज्ञानिक पर्दाफाश।",
      seoTitle: "यौन स्वास्थ्य: मिथक बनाम वैज्ञानिक तथ्य (Myths vs Facts in Hindi)",
      seoDescription:
        "यौन स्वास्थ्य से जुड़े आम मिथक और उनके पीछे के वैज्ञानिक तथ्य। जानिए क्या सच है और क्या केवल अफवाह।",
      iconName: "CheckCircle2",
      color: "amber",
      featuredOrder: 4,
    },
    {
      id: "cat-5",
      name: "रिलेशनशिप, सहमति और संवाद",
      englishName: "Relationships, Consent and Communication",
      slug: "relationships-consent-communication",
      description:
        "स्वस्थ रिश्ते, पारस्परिक सहमति (Consent), भावनात्मक जुड़ाव और साथी के साथ पारदर्शी संवाद की महत्वपूर्ण समझ।",
      seoTitle: "रिलेशनशिप, सहमति और संवाद (Relationships & Consent Guide)",
      seoDescription:
        "स्वस्थ संबंध, आपसी सहमति का महत्व और पार्टनर के साथ बेहतर संवाद बनाने के व्यावहारिक मार्गदर्शन।",
      iconName: "Users",
      color: "rose",
      featuredOrder: 5,
    },
    {
      id: "cat-6",
      name: "सुरक्षित संबंध और STI जानकारी",
      englishName: "Safe Sex and STI Information",
      slug: "safe-sex-and-sti",
      description:
        "कंडोम का सही उपयोग, यौन संचारित संक्रमण (STI/STD) के लक्षण, जांच, रोकथाम, NACO दिशानिर्देश और उपचार।",
      seoTitle: "सुरक्षित संबंध और STI जानकारी (Safe Sex & STI Guide Hindi)",
      seoDescription:
        "STI/STD के लक्षण, जांच और बचाव। कंडोम का सही इस्तेमाल और सुरक्षित संबंध बनाने की विस्तृत जानकारी।",
      iconName: "ShieldAlert",
      color: "indigo",
      featuredOrder: 6,
    },
    {
      id: "cat-7",
      name: "डॉक्टर/विशेषज्ञ द्वारा समीक्षा किए गए लेख",
      englishName: "Medically Reviewed Articles",
      slug: "medically-reviewed-articles",
      description:
        "प्रमाणित चिकित्सकों और स्वास्थ्य विशेषज्ञों द्वारा गहनता से जाँचे और सत्यापित किए गए उच्च-विश्वसनीयता वाले लेख।",
      seoTitle: "डॉक्टर/विशेषज्ञ द्वारा समीक्षित लेख (Medically Reviewed Articles in Hindi)",
      seoDescription:
        "सत्यापित डॉक्टरों और चिकित्सा विशेषज्ञों द्वारा समीक्षित हिंदी स्वास्थ्य लेख। डॉक्टर का नाम और पंजीकरण संख्या सहित।",
      iconName: "Stethoscope",
      color: "purple",
      featuredOrder: 7,
      isMedicallyReviewedOnly: true,
    },
  ],
};

export const NAVIGATION_LINKS = [
  { name: "होम", href: "/" },
  { name: "श्रेणियां", href: "/#categories" },
  { name: "डॉक्टर-समीक्षित लेख", href: "/category/medically-reviewed-articles" },
  { name: "मिथक और सच", href: "/category/myths-vs-facts" },
  { name: "सवाल-जवाब", href: "/category/health-qa" },
  { name: "हमारे बारे में", href: "/about" },
];

export const FOOTER_LINKS = {
  categories: SITE_CONFIG.categories.map((c) => ({
    name: c.name,
    href: `/category/${c.slug}`,
  })),
  institutional: [
    { name: "हमारे बारे में (About Us)", href: "/about" },
    { name: "संपादकीय नीति (Editorial Policy)", href: "/editorial-policy" },
    { name: "चिकित्सीय अस्वीकरण (Medical Disclaimer)", href: "/medical-disclaimer" },
    { name: "संपर्क करें (Contact Us)", href: "/contact" },
  ],
  legal: [
    { name: "गोपनीयता नीति (Privacy Policy)", href: "/privacy-policy" },
    { name: "नियम एवं शर्तें (Terms of Use)", href: "/terms" },
    { name: "सहमति नीति (Consent & Safety)", href: "/editorial-policy#consent" },
  ],
};
