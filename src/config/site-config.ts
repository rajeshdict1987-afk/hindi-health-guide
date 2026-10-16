import { ENV } from './env';

export interface CategoryConfig {
  slug: string;
  name: string;
  hindiName: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  icon: string;
}

export const SITE_CONFIG = {
  name: 'Hindi Health Guide',
  hindiName: 'हिंदी हेल्थ गाइड',
  description: 'भारत में वैज्ञानिक, प्रमाण-आधारित यौन एवं प्रजनन स्वास्थ्य शिक्षा प्रदान करने वाला समर्पित हिंदी मंच। डब्ल्यूएचओ (WHO) और एनएसीओ (NACO) दिशानिर्देशों पर आधारित।',
  productionUrl: ENV.productionUrl,
  categories: [
    {
      slug: 'reproductive-health',
      name: 'Reproductive Health',
      hindiName: 'प्रजनन स्वास्थ्य',
      description: 'मासिक धर्म, गर्भधारण, मातृत्व और प्रजनन अंगों की संपूर्ण जानकारी।',
      seoTitle: 'प्रजनन स्वास्थ्य (Reproductive Health) - हिंदी हेल्थ गाइड',
      seoDescription: 'प्रजनन स्वास्थ्य, मासिक धर्म चक्र और गर्भधारण से जुड़े सभी महत्वपूर्ण वैज्ञानिक तथ्य हिंदी में।',
      icon: 'HeartPulse',
    },
    {
      slug: 'sexual-education',
      name: 'Sexual Education',
      hindiName: 'यौन शिक्षा',
      description: 'सुरक्षित यौन संबंध, शारीरिक विकास और वैज्ञानिक दृष्टिकोण।',
      seoTitle: 'यौन शिक्षा (Sexual Education) - हिंदी हेल्थ गाइड',
      seoDescription: 'सुरक्षित यौन संबंध और यौन स्वास्थ्य से जुड़े मिथक और वैज्ञानिक तथ्य हिंदी में जानें।',
      icon: 'BookOpen',
    },
    {
      slug: 'sti-hiv-prevention',
      name: 'STI & HIV Prevention',
      hindiName: 'एसटीआई और एचआईवी रोकथाम',
      description: 'लैंगिक संक्रमणों (STIs) से बचाव, लक्षण और समय पर जांच व उपचार।',
      seoTitle: 'एसटीआई और एचआईवी रोकथाम - हिंदी हेल्थ गाइड',
      seoDescription: 'एचआईवी और यौन संचारित संक्रमणों (STIs) के लक्षण, बचाव और उपचार की आधिकारिक जानकारी।',
      icon: 'ShieldAlert',
    },
    {
      slug: 'contraception-family-planning',
      name: 'Contraception & Family Planning',
      hindiName: 'गर्भनिरोधक और परिवार नियोजन',
      description: 'विभिन्न गर्भनिरोधक साधनों की जानकारी, प्रभावशीलता और उपयोग।',
      seoTitle: 'गर्भनिरोधक और परिवार नियोजन - हिंदी हेल्थ गाइड',
      seoDescription: 'कंडोम, पिल्स और अन्य गर्भनिरोधक उपायों की पूरी जानकारी हिंदी में।',
      icon: 'CheckCircle2',
    },
    {
      slug: 'myths-facts',
      name: 'Myths & Facts',
      hindiName: 'मिथक और तथ्य',
      description: 'यौन स्वास्थ्य से जुड़े सामाजिक भ्रमों और वैज्ञानिक सत्यों की पड़ताल।',
      seoTitle: 'मिथक और तथ्य (Myths & Facts) - हिंदी हेल्थ गाइड',
      seoDescription: 'यौन स्वास्थ्य के बारे में समाज में फैली गलतफहमियों और वैज्ञानिक सच्चाइयों की सूची।',
      icon: 'HelpCircle',
    },
    {
      slug: 'mental-emotional-health',
      name: 'Mental & Emotional Health',
      hindiName: 'मानसिक और भावनात्मक स्वास्थ्य',
      description: 'रिश्तों की समझ, सहमति (Consent), चिंता और मानसिक कल्याण।',
      seoTitle: 'मानसिक और भावनात्मक स्वास्थ्य - हिंदी हेल्थ गाइड',
      seoDescription: 'संबंधों, सहमति, मानसिक तनाव और भावनात्मक संतुलन पर विशेषज्ञ सलाह।',
      icon: 'Smile',
    },
    {
      slug: 'expert-advice-qa',
      name: 'Expert Advice & Q&A',
      hindiName: 'विशेषज्ञ सलाह और प्रश्नोत्तरी',
      description: 'चिकित्सकों और स्वास्थ्य विशेषज्ञों द्वारा आपके गोपनीय प्रश्नों के उत्तर।',
      seoTitle: 'विशेषज्ञ सलाह और प्रश्नोत्तरी - हिंदी हेल्थ गाइड',
      seoDescription: 'यौन और प्रजनन स्वास्थ्य पर प्रमाणित डॉक्टरों के उत्तर और मार्गदर्शन।',
      icon: 'MessageSquare',
    },
  ] as CategoryConfig[],
};
