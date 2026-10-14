import React, { useState } from 'react';
import {
  ShieldCheck,
  Stethoscope,
  Search,
  BookOpen,
  ArrowRight,
  PhoneCall,
  CheckCircle,
  XCircle,
  Award,
} from 'lucide-react';
import { SITE_CONFIG } from '../config/site-config';
import { articleService } from '../services/articleService';
import { ArticleCard } from '../components/ArticleCard';
import { CategoryIcon } from '../components/CategoryIcon';
import { AdPlacement } from '../components/AdPlacement';
import { SEOHead } from '../components/SEOHead';
import { useRouter } from '../context/RouterContext';

export const HomePage: React.FC = () => {
  const { navigate } = useRouter();
  const [heroSearch, setHeroSearch] = useState('');

  const { articles: publishedArticles } = articleService.getArticles({ status: 'published' });
  const featuredArticles = publishedArticles.filter((a) => a.featured);
  const reviewedArticles = publishedArticles.filter((a) => a.medicalReview?.isReviewed);
  const mainFeatured = featuredArticles[0] || publishedArticles[0];
  const secondaryArticles = publishedArticles.filter((a) => a.id !== mainFeatured?.id).slice(0, 6);
  const categoryCounts = articleService.getCategoryCounts();

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(heroSearch.trim())}`);
    }
  };

  return (
    <>
      <SEOHead
        title="यौन एवं प्रजनन स्वास्थ्य की प्रामाणिक जानकारी"
        description={SITE_CONFIG.description}
        canonicalUrl={SITE_CONFIG.productionUrl}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE_CONFIG.name,
          headline: SITE_CONFIG.tagline,
          inLanguage: 'hi-IN',
          url: SITE_CONFIG.productionUrl,
        }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-900 via-teal-850 to-stone-900 text-white pt-12 pb-20 sm:pt-16 sm:pb-24">
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-20">
          <div className="absolute -top-32 left-1/4 w-96 h-96 bg-emerald-400 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-teal-500 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Trust Badges */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-teal-800/90 to-emerald-900/90 border border-teal-500/40 text-teal-100 text-xs sm:text-sm font-bold mb-6 shadow-md shadow-teal-950/40">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-white">हिंदी हेल्थ गाइड</span>
            <span className="text-teal-400">•</span>
            <span className="text-emerald-300">भारत का प्रामाणिक 'स्वास्थ्य साथी'</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight max-w-4xl mx-auto">
            यौन एवं प्रजनन स्वास्थ्य की{' '}
            <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent font-black drop-shadow-sm">
              प्रामाणिक और गोपनीय
            </span>{' '}
            जानकारी
          </h1>

          <p className="mt-5 text-base sm:text-xl text-teal-100/90 max-w-2xl mx-auto leading-relaxed font-medium">
            बिना झिझक, बिना अपराधबोध। भारतीय पाठकों के लिए शरीर रचना, सुरक्षित संबंध, मासिक धर्म, गर्भनिरोध और डॉक्टर-समीक्षित स्वास्थ्य मार्गदर्शन सरल हिंदी में।
          </p>

          {/* Quick Search Form */}
          <form
            onSubmit={handleHeroSearch}
            className="mt-8 max-w-2xl mx-auto flex flex-col sm:flex-row gap-2 sm:gap-0 bg-white p-2 rounded-2xl shadow-2xl border border-teal-700/30"
          >
            <div className="relative flex-1 flex items-center pl-3">
              <Search className="w-5 h-5 text-stone-400 shrink-0" />
              <input
                type="text"
                placeholder="यौन स्वास्थ्य संबंधी कोई भी प्रश्न या विषय खोजें..."
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                className="w-full px-3 py-2 text-stone-900 text-sm sm:text-base focus:outline-hidden"
              />
            </div>
            <button
              type="submit"
              className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-6 py-3 rounded-xl transition shadow-sm text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>खोजें</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Popular Search Keywords */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-teal-200/80">
            <span className="text-teal-400 font-semibold">लोकप्रिय खोजें:</span>
            {[
              { label: 'मासिक धर्म', query: 'मासिक धर्म' },
              { label: 'कंडोम का सही उपयोग', query: 'कंडोम' },
              { label: 'इमरजेंसी पिल', query: 'आपातकालीन' },
              { label: 'हस्तमैथुन मिथक', query: 'हस्तमैथुन' },
              { label: 'एचपीवी वैक्सीन', query: 'एचपीवी' },
            ].map((tag, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => navigate(`/search?q=${encodeURIComponent(tag.query)}`)}
                className="bg-teal-800/60 hover:bg-teal-700 px-2.5 py-1 rounded-md border border-teal-700/60 transition"
              >
                {tag.label}
              </button>
            ))}
          </div>

          {/* Value Pillars */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-teal-800/60 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-800/80 flex items-center justify-center shrink-0 text-emerald-400">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">योग्य डॉक्टर</div>
                <div className="text-xs text-teal-300">विशेषज्ञ समीक्षा</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-800/80 flex items-center justify-center shrink-0 text-emerald-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">NACO/WHO</div>
                <div className="text-xs text-teal-300">मान्य स्रोत</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-800/80 flex items-center justify-center shrink-0 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">पूर्ण गोपनीयता</div>
                <div className="text-xs text-teal-300">सुरक्षित पठन</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-800/80 flex items-center justify-center shrink-0 text-emerald-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">हिंदी-प्रथम</div>
                <div className="text-xs text-teal-300">सटीक शब्दावली</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid Section (सातों स्वीकृत श्रेणियां) */}
      <section id="categories-section" className="py-16 sm:py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-teal-700 tracking-wider uppercase mb-2">
              विषयवार वर्गीकरण
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              सातों मुख्य श्रेणियां
            </h3>
            <p className="mt-3 text-stone-600 text-sm sm:text-base">
              प्रमाणित एवं विशेषज्ञ-परीक्षित जानकारी खोजने के लिए अपनी रुचि की श्रेणी चुनें:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {SITE_CONFIG.categories.map((cat) => {
              const count = categoryCounts[cat.slug] || 0;
              const isSpecial = cat.isMedicallyReviewedOnly;

              return (
                <div
                  key={cat.id}
                  onClick={() => navigate(`/category/${cat.slug}`)}
                  className={`group relative bg-white rounded-2xl p-6 border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                    isSpecial
                      ? 'border-purple-300 hover:border-purple-500 shadow-purple-900/5 hover:shadow-xl bg-gradient-to-b from-purple-50/50 to-white'
                      : 'border-stone-200/90 hover:border-teal-500 hover:shadow-xl'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                          isSpecial
                            ? 'bg-purple-100 text-purple-700 group-hover:bg-purple-600 group-hover:text-white'
                            : 'bg-teal-50 text-teal-700 group-hover:bg-teal-700 group-hover:text-white'
                        }`}
                      >
                        <CategoryIcon name={cat.iconName} className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 group-hover:bg-teal-100 group-hover:text-teal-800 transition">
                        {count} {count === 1 ? 'लेख' : 'लेख'}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-stone-900 group-hover:text-teal-800 transition leading-snug">
                      {cat.name}
                    </h4>
                    <p className="text-xs text-stone-500 font-medium mt-0.5">
                      {cat.englishName}
                    </p>
                    <p className="mt-3 text-sm text-stone-600 leading-relaxed line-clamp-3">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-teal-700 group-hover:text-teal-900">
                    <span>श्रेणी देखें</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Article Spotlight */}
      {mainFeatured && (
        <section className="py-12 bg-white border-y border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
                  विशेष संकलित लेख (Featured Article)
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">
                  चिकित्सकीय रूप से सत्यापित और विस्तृत स्वास्थ्य विश्लेषण
                </p>
              </div>
            </div>

            <ArticleCard article={mainFeatured} variant="featured" />
          </div>
        </section>
      )}

      {/* Myths vs Facts Spotlight Section */}
      <section className="py-16 bg-gradient-to-b from-amber-50/60 to-white border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-md">
                भ्रांतियों का पर्दाफाश
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-3">
                यौन स्वास्थ्य: मिथक बनाम वैज्ञानिक सच
              </h3>
              <p className="text-stone-600 text-sm sm:text-base mt-1">
                समाज में फैले डर और अधकचरी जानकारियों को विज्ञान की रोशनी में परखें
              </p>
            </div>
            <button
              onClick={() => navigate('/category/myths-vs-facts')}
              className="text-amber-900 font-bold text-sm flex items-center gap-1 hover:underline shrink-0"
            >
              सभी मिथक और तथ्य देखें <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-start gap-3">
                <XCircle className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">मिथक #1</span>
                  <p className="font-bold text-stone-900 text-base mt-0.5">
                    "हस्तमैथुन करने से शारीरिक दुर्बलता आती है और धातु की कमी से रीढ़ कमजोर होती है।"
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 pt-3 border-t border-stone-100">
                <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">वैज्ञानिक सच</span>
                  <p className="text-stone-700 text-sm leading-relaxed mt-0.5">
                    वीर्य में 90% से अधिक पानी और प्रोटीन होता है। हस्तमैथुन एक प्राकृतिक क्रिया है जिससे कोई शारीरिक कमजोरी नहीं होती। धातु रोग (Dhat Syndrome) एक सांस्कृतिक मनोवैज्ञानिक वहम है, कोई शारीरिक रोग नहीं।
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-start gap-3">
                <XCircle className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">मिथक #2</span>
                  <p className="font-bold text-stone-900 text-base mt-0.5">
                    "पहली बार संबंध बनाने पर महिला में रक्तस्राव (Bleeding) होना ही कौमार्य (Virginity) का एकमात्र प्रमाण है।"
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 pt-3 border-t border-stone-100">
                <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">वैज्ञानिक सच</span>
                  <p className="text-stone-700 text-sm leading-relaxed mt-0.5">
                    हाइमन (Hymen) एक लचीली झिल्ली होती है जो खेल-कूद, साइकिल चलाने, तैराकी या सामान्य शारीरिक गतिविधियों से पहले ही प्राकृतिक रूप से खिंच या टूट सकती है। रक्तस्राव न होना पूरी तरह सामान्य है।
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="py-16 sm:py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                नवीनतम प्रकाशित स्वास्थ्य लेख
              </h3>
              <p className="text-stone-600 text-sm sm:text-base mt-1">
                प्रमाणित चिकित्सकों और स्वास्थ्य पत्रकारों द्वारा रचित वैज्ञानिक विश्लेषण
              </p>
            </div>
            <button
              onClick={() => navigate('/category/medically-reviewed-articles')}
              className="bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs sm:text-sm font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Stethoscope className="w-4 h-4" />
              <span>डॉक्टर-समीक्षित लेख देखें ({reviewedArticles.length})</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {secondaryArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {/* Ad Slot */}
          <AdPlacement format="horizontal" className="mt-12" />
        </div>
      </section>

      {/* NACO & Government Health Centers Advisory Banner */}
      <section className="py-12 bg-teal-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-teal-950/70 border border-teal-800 rounded-3xl p-8 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-300 uppercase tracking-wider bg-teal-900/90 px-3 py-1 rounded-md">
                <PhoneCall className="w-3.5 h-3.5" /> 24x7 निःशुल्क एवं गोपनीय सरकारी सहायता
              </div>
              <h4 className="text-2xl sm:text-3xl font-extrabold text-white">
                शंका या आपात स्थिति में तुरंत विशेषज्ञ से बात करें
              </h4>
              <p className="text-sm sm:text-base text-teal-200/90 leading-relaxed">
                राष्ट्रीय एड्स नियंत्रण संगठन (NACO) की 1097 हेल्पलाइन पर बिना अपनी पहचान बताए हिंदी व क्षेत्रीय भाषाओं में मुफ्त परामर्श उपलब्ध है। जिला अस्पतालों में सरकारी 'सुरक्षा क्लीनिक' में मुफ्त जांच और दवाएं दी जाती हैं।
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <a
                href="tel:1097"
                className="bg-emerald-500 hover:bg-emerald-600 text-stone-950 font-extrabold px-6 py-3.5 rounded-xl transition shadow-lg flex items-center justify-center gap-2 text-base"
              >
                <PhoneCall className="w-5 h-5" />
                <span>कॉल करें: 1097</span>
              </a>
              <button
                onClick={() => navigate('/contact')}
                className="bg-teal-800 hover:bg-teal-700 text-white font-bold px-6 py-3.5 rounded-xl border border-teal-600 transition flex items-center justify-center gap-2 text-base cursor-pointer"
              >
                <span>संपादकीय टीम से पूछें</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
