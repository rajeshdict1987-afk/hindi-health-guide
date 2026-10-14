import React, { useState, useEffect } from 'react';
import {
  Save,
  Eye,
  ArrowLeft,
  Plus,
  Trash2,
  Stethoscope,
  Globe,
  HelpCircle,
  CheckCircle,
} from 'lucide-react';
import { articleService } from '../../services/articleService';
import { adminAuth } from '../../services/firebase';
import { Article, ArticleStatus } from '../../types/article';
import { SITE_CONFIG } from '../../config/site-config';
import { useRouter } from '../../context/RouterContext';
import { SEOHead } from '../../components/SEOHead';

interface AdminArticleEditorPageProps {
  articleId?: string; // If undefined, this is a new article
}

export const AdminArticleEditorPage: React.FC<AdminArticleEditorPageProps> = ({ articleId }) => {
  const { navigate } = useRouter();
  const authState = adminAuth.getState();

  if (!authState.isAuthenticated) {
    navigate('/admin/login');
    return null;
  }

  const existingArticle = articleId ? articleService.getArticleById(articleId) : null;

  const [title, setTitle] = useState(existingArticle?.title || '');
  const [slug, setSlug] = useState(existingArticle?.slug || '');
  const [quickAnswer, setQuickAnswer] = useState(existingArticle?.quickAnswer || '');
  const [excerpt, setExcerpt] = useState(existingArticle?.excerpt || '');
  const [content, setContent] = useState(existingArticle?.content || '');
  const [categorySlug, setCategorySlug] = useState(
    existingArticle?.categorySlug || SITE_CONFIG.categories[0].slug
  );
  const [status, setStatus] = useState<ArticleStatus>(existingArticle?.status || 'draft');
  const [readingTime, setReadingTime] = useState(existingArticle?.readingTimeMinutes || 5);
  const [featured, setFeatured] = useState(existingArticle?.featured || false);

  // Featured Image
  const [imageUrl, setImageUrl] = useState(
    existingArticle?.image?.url ||
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80'
  );
  const [imageAlt, setImageAlt] = useState(existingArticle?.image?.alt || '');
  const [imageCaption, setImageCaption] = useState(existingArticle?.image?.caption || '');
  const [imageCredit, setImageCredit] = useState(existingArticle?.image?.credit || '');

  // Medical Review
  const [isReviewed, setIsReviewed] = useState(existingArticle?.medicalReview?.isReviewed || false);
  const [reviewerName, setReviewerName] = useState(existingArticle?.medicalReview?.reviewerName || '');
  const [reviewerRole, setReviewerRole] = useState(existingArticle?.medicalReview?.reviewerRole || '');
  const [reviewerRegistration, setReviewerRegistration] = useState(
    existingArticle?.medicalReview?.reviewerRegistration || ''
  );
  const [reviewNotes, setReviewNotes] = useState(existingArticle?.medicalReview?.reviewNotes || '');

  // SEO
  const [seoTitle, setSeoTitle] = useState(existingArticle?.seo?.title || '');
  const [metaDescription, setMetaDescription] = useState(existingArticle?.seo?.metaDescription || '');
  const [keywordsStr, setKeywordsStr] = useState(existingArticle?.seo?.keywords?.join(', ') || '');

  // References
  const [references, setReferences] = useState(
    existingArticle?.references || [
      {
        title: 'WHO Reproductive Health Guidelines',
        organization: 'विश्व स्वास्थ्य संगठन (WHO)',
        url: 'https://www.who.int/health-topics/sexual-health',
      },
    ]
  );

  const [message, setMessage] = useState('');

  // Auto-generate slug from title if empty
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!existingArticle && !slug) {
      const generated = val
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      if (generated) setSlug(generated);
    }
  };

  const addReference = () => {
    setReferences([
      ...references,
      { title: '', organization: 'राष्ट्रीय एड्स नियंत्रण संगठन (NACO)', url: '' },
    ]);
  };

  const removeReference = (idx: number) => {
    setReferences(references.filter((_, i) => i !== idx));
  };

  const handleSave = (publishImmediately = false) => {
    if (!title.trim() || !content.trim()) {
      alert('कृपया शीर्षक और सामग्री अवश्य भरें।');
      return;
    }

    const targetStatus: ArticleStatus = publishImmediately ? 'published' : status;
    const finalSlug = slug.trim() || `article-${Date.now()}`;
    const keywords = keywordsStr
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    const articlePayload = {
      title,
      slug: finalSlug,
      quickAnswer,
      excerpt,
      content,
      categorySlug,
      status: targetStatus,
      readingTimeMinutes: Number(readingTime) || 5,
      featured,
      author: existingArticle?.author || {
        id: 'auth-editor',
        name: authState.displayName || 'संपादकीय मंडल',
        hindiTitle: 'वरिष्ठ स्वास्थ्य समीक्षक',
        bio: 'प्रमाण-आधारित चिकित्सा पत्रकारिता एवं स्वास्थ्य संचार विशेषज्ञ।',
      },
      image: {
        url: imageUrl,
        alt: imageAlt || title,
        caption: imageCaption,
        credit: imageCredit,
      },
      medicalReview: {
        isReviewed,
        reviewerName: isReviewed ? reviewerName : undefined,
        reviewerRole: isReviewed ? reviewerRole : undefined,
        reviewerRegistration: isReviewed ? reviewerRegistration : undefined,
        reviewedDate: isReviewed ? new Date().toISOString().split('T')[0] : undefined,
        reviewNotes: isReviewed ? reviewNotes : undefined,
      },
      seo: {
        title: seoTitle || title,
        metaDescription: metaDescription || excerpt,
        keywords,
      },
      references: references.filter((r) => r.title && r.url),
    };

    if (existingArticle) {
      articleService.updateArticle(existingArticle.id, articlePayload);
      setMessage('लेख सफलतापूर्वक अपडेट किया गया!');
    } else {
      const created = articleService.createArticle(articlePayload);
      setMessage('नया लेख सफलतापूर्वक बनाया गया!');
      navigate(`/admin/articles/${created.id}/edit`);
    }

    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <>
      <SEOHead title={existingArticle ? `एडिट: ${existingArticle.title}` : 'नया लेख बनाएं'} />

      <div className="bg-stone-100 min-h-screen py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/admin')}
              className="text-stone-600 hover:text-stone-900 font-bold text-xs sm:text-sm flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-xl border border-stone-200"
            >
              <ArrowLeft className="w-4 h-4" /> डैशबोर्ड पर वापस जाएं
            </button>

            <div className="flex items-center gap-2">
              {slug && (
                <button
                  type="button"
                  onClick={() => navigate(`/articles/${slug}`)}
                  className="bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5"
                >
                  <Eye className="w-4 h-4" />
                  <span>पूर्वावलोकन</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => handleSave(false)}
                className="bg-stone-800 hover:bg-stone-900 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>ड्राफ्ट सहेजें</span>
              </button>
              <button
                type="button"
                onClick={() => handleSave(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm"
              >
                <CheckCircle className="w-4 h-4" />
                <span>प्रकाशित करें (Publish)</span>
              </button>
            </div>
          </div>

          {message && (
            <div className="mb-6 bg-emerald-100 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>{message}</span>
            </div>
          )}

          {/* Editor Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xs space-y-8">
            {/* 1. Basic Info */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-stone-900 pb-2 border-b border-stone-100">
                1. बुनियादी विवरण (Basic Information)
              </h2>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  लेख का मुख्य शीर्षक (Title) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. किशोरावस्था में शारीरिक और हार्मोनल बदलाव..."
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-hidden focus:bg-white focus:border-teal-700 text-base font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    स्थायी URL Slug (अंग्रेजी अक्षरों व डैश में) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="adolescence-hormonal-changes"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    स्वीकृत श्रेणी (7 Approved Categories) *
                  </label>
                  <select
                    value={categorySlug}
                    onChange={(e) => setCategorySlug(e.target.value)}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs font-semibold"
                  >
                    {SITE_CONFIG.categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name} ({c.englishName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  सीधा उत्तर (Quick Answer) – पाठकों को तुरंत स्पष्ट समाधान
                </label>
                <textarea
                  rows={2}
                  placeholder="एक-दो वाक्यों में मुख्य प्रश्न का सीधा, तथ्यपरक उत्तर लिखें..."
                  value={quickAnswer}
                  onChange={(e) => setQuickAnswer(e.target.value)}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  संक्षिप्त विवरण (Excerpt)
                </label>
                <textarea
                  rows={2}
                  placeholder="कार्ड और सोशल मीडिया पूर्वावलोकन के लिए 2-3 वाक्यों का संक्षिप्त सार..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs"
                />
              </div>
            </div>

            {/* 2. Main Markdown Content */}
            <div className="space-y-4 pt-4 border-t border-stone-100">
              <h2 className="text-lg font-bold text-stone-900 pb-2 border-b border-stone-100">
                2. मुख्य चिकित्सा सामग्री (Content / Markdown)
              </h2>
              <p className="text-xs text-stone-500">
                हेडिंग के लिए <code>## हेडिंग</code>, सबहेडिंग के लिए <code>### हेडिंग</code>, बुलेट के लिए <code>- बिंदु</code> और बोल्ड के लिए <code>**शब्द**</code> का उपयोग करें।
              </p>
              <textarea
                rows={14}
                required
                placeholder="यहाँ संपूर्ण वैज्ञानिक सामग्री लिखें..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-stone-900 font-mono text-xs sm:text-sm leading-relaxed"
              />
            </div>

            {/* 3. Featured Image */}
            <div className="space-y-4 pt-4 border-t border-stone-100">
              <h2 className="text-lg font-bold text-stone-900 pb-2 border-b border-stone-100">
                3. मुख्य छवि (Featured Image)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">छवि URL</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Alt Text (विवरण)</label>
                  <input
                    type="text"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">कैप्शन</label>
                  <input
                    type="text"
                    value={imageCaption}
                    onChange={(e) => setImageCaption(e.target.value)}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">क्रेडिट (स्रोत)</label>
                  <input
                    type="text"
                    value={imageCredit}
                    onChange={(e) => setImageCredit(e.target.value)}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* 4. Medical Review */}
            <div className="space-y-4 pt-4 border-t border-stone-100 bg-purple-50/50 p-6 rounded-2xl border border-purple-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-purple-700" />
                  <h2 className="text-lg font-bold text-stone-900">
                    4. चिकित्सक / विशेषज्ञ द्वारा समीक्षा (Medical Review)
                  </h2>
                </div>
                <label className="flex items-center gap-2 text-xs font-bold text-purple-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isReviewed}
                    onChange={(e) => setIsReviewed(e.target.checked)}
                    className="w-4 h-4 text-purple-700 rounded"
                  />
                  <span>डॉक्टर द्वारा समीक्षित मार्क करें</span>
                </label>
              </div>

              {isReviewed && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      समीक्षक डॉक्टर का नाम *
                    </label>
                    <input
                      type="text"
                      placeholder="उदा. डॉ. सुनिता वर्मा"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      योग्यता / विशेषज्ञता (Role/Degree) *
                    </label>
                    <input
                      type="text"
                      placeholder="MBBS, MS (Obs & Gynae)"
                      value={reviewerRole}
                      onChange={(e) => setReviewerRole(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      NMC / स्टेट मेडिकल काउंसिल पंजीयन संख्या *
                    </label>
                    <input
                      type="text"
                      placeholder="NMC Reg. No. 48291"
                      value={reviewerRegistration}
                      onChange={(e) => setReviewerRegistration(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      समीक्षा संबंधी टिप्पणी (Notes)
                    </label>
                    <input
                      type="text"
                      placeholder="WHO प्रोटोकॉल के अनुसार चिकित्सा तथ्यों का सत्यापन किया गया।"
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 5. Scientific References */}
            <div className="space-y-4 pt-4 border-t border-stone-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-stone-900">
                  5. वैज्ञानिक एवं चिकित्सीय संदर्भ (References)
                </h2>
                <button
                  type="button"
                  onClick={addReference}
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> नया संदर्भ जोड़ें
                </button>
              </div>

              {references.map((ref, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="संस्थान (उदा. WHO, NACO, ICMR)"
                    value={ref.organization}
                    onChange={(e) => {
                      const updated = [...references];
                      updated[idx].organization = e.target.value;
                      setReferences(updated);
                    }}
                    className="w-1/4 px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    placeholder="दिशानिर्देश शीर्षक"
                    value={ref.title}
                    onChange={(e) => {
                      const updated = [...references];
                      updated[idx].title = e.target.value;
                      setReferences(updated);
                    }}
                    className="w-2/5 px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                  />
                  <input
                    type="url"
                    placeholder="सत्यापित URL"
                    value={ref.url}
                    onChange={(e) => {
                      const updated = [...references];
                      updated[idx].url = e.target.value;
                      setReferences(updated);
                    }}
                    className="flex-1 px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => removeReference(idx)}
                    className="p-1.5 text-rose-500 hover:text-rose-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* 6. SEO Metadata */}
            <div className="space-y-4 pt-4 border-t border-stone-100">
              <h2 className="text-lg font-bold text-stone-900 pb-2 border-b border-stone-100">
                6. एसईओ मेटाडाटा (Search Engine Optimization)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">SEO Title</label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">कीवर्ड्स (कॉमा से अलग करें)</label>
                  <input
                    type="text"
                    value={keywordsStr}
                    onChange={(e) => setKeywordsStr(e.target.value)}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">Meta Description (120-160 अक्षर)</label>
                  <textarea
                    rows={2}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Save Bar */}
            <div className="pt-6 border-t border-stone-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => handleSave(false)}
                className="bg-stone-800 hover:bg-stone-900 text-white font-bold px-6 py-2.5 rounded-xl transition text-sm"
              >
                ड्राफ्ट सुरक्षित करें
              </button>
              <button
                type="button"
                onClick={() => handleSave(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl transition text-sm shadow-sm"
              >
                वेबसाइट पर प्रकाशित करें
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
