'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Shield, 
  FileText, 
  Megaphone, 
  Plus, 
  Trash2, 
  Edit, 
  ArrowLeft, 
  CheckCircle2, 
  ExternalLink,
  Save,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { Article } from '@/src/types/article';
import { Advertisement } from '@/src/types/ad';
import { getStoredArticles, saveStoredArticles, getStoredAds, saveStoredAds, resetToDefaults } from '@/src/lib/store';
import { SITE_CONFIG } from '@/src/config/site-config';
import { generateSeoSuggestions, generateCleanSlug } from '@/src/lib/seoHelper';
import { validateArticleSchema } from '@/src/types/firestore';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginEmail, setLoginEmail] = useState('rajeshdict.1987@gmail.com');
  const [loginPin, setLoginPin] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'articles' | 'ads'>('articles');
  
  // Articles State
  const [articles, setArticles] = useState<Article[]>([]);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [articleForm, setArticleForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: SITE_CONFIG.categories[0].slug,
    categoryHindi: SITE_CONFIG.categories[0].hindiName,
    readTime: '5 मिनट',
    authorName: 'राजेश कुमार साहू',
    authorRole: 'मुख्य संपादक (Chief Editor)',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'स्वास्थ्य स्वास्थ्य लेख',
    tags: 'स्वास्थ्य, चिकित्सा, प्रजनन स्वास्थ्य'
  });

  // Ads State
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [editingAdId, setEditingAdId] = useState<string | null>(null);
  const [adForm, setAdForm] = useState({
    title: '',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
    targetUrl: 'https://www.mohfw.gov.in',
    position: 'mid' as Advertisement['position'],
    active: true
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    try {
      if (sessionStorage.getItem('admin_auth') === 'true') {
        setIsAuthenticated(true);
      }
      setArticles(getStoredArticles());
      setAds(getStoredAds());
    } catch (e) {
      console.error('Error loading stored data:', e);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = loginEmail.trim().toLowerCase();
    if (cleanEmail !== 'rajeshdict.1987@gmail.com') {
      setLoginError('अनधिकृत ईमेल पता! केवल अधिकृत मुख्य संपादक (rajeshdict.1987@gmail.com) ही लॉगिन कर सकते हैं।');
      return;
    }
    if (loginPin.trim() === '8492') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      sessionStorage.setItem('admin_email', 'rajeshdict.1987@gmail.com');
      sessionStorage.setItem('admin_name', 'राजेश कुमार साहू');
      setLoginError('');
    } else {
      setLoginError('अमान्य पिन (Invalid PIN)। कृपया सही गोपनीय पिन दर्ज करें।');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 border border-stone-200">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-rose-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg mb-4">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-stone-900">{SITE_CONFIG.hindiName}</h1>
            <p className="text-sm text-stone-500 mt-1">सुरक्षित एडमिन पोर्टल (Secure Admin Login)</p>
          </div>

          {loginError && (
            <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm font-medium">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">एडमिन ईमेल (Admin Email)</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="rajeshdict.1987@gmail.com"
                className="w-full p-3.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">गोपनीय पिन (Secret Login PIN)</label>
              <input
                type="password"
                required
                maxLength={6}
                value={loginPin}
                onChange={(e) => setLoginPin(e.target.value)}
                placeholder="गुप्त पिन दर्ज करें"
                className="w-full p-3.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none tracking-widest font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              <span>लॉगिन करें (Secure Login)</span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-stone-100 text-center">
            <Link href="/" className="text-xs text-stone-500 hover:text-stone-800 font-medium flex items-center justify-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>वेबसाइट पर वापस लौटें</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const showNotification = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 4000);
  };

  const handleResetData = () => {
    if (confirm('क्या आप सभी आर्टिकल्स और विज्ञापनों को मूल डिफ़ॉल्ट स्थिति में रीसेट करना चाहते हैं?')) {
      const res = resetToDefaults();
      setArticles(res.articles);
      setAds(res.ads);
      showNotification('डेटा सफलतापूर्वक रीसेट कर दिया गया है!');
    }
  };

  // Handle Image Upload to Base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'article' | 'ad') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (type === 'article') {
        setArticleForm(prev => ({ ...prev, imageUrl: result }));
      } else {
        setAdForm(prev => ({ ...prev, imageUrl: result }));
      }
      showNotification('फोटो सफलतापूर्वक अपलोड हो गई!');
    };
    reader.readAsDataURL(file);
  };

  const handleAutoSeoGenerate = () => {
    if (!articleForm.title && !articleForm.content) {
      alert('कृपया पहले शीर्षक या सामग्री दर्ज करें।');
      return;
    }
    const suggestion = generateSeoSuggestions(articleForm.title, articleForm.content);
    const validPrevSlug = (articleForm.slug && articleForm.slug.length >= 3 && !/^[-]+$/.test(articleForm.slug)) ? articleForm.slug : '';
    setArticleForm(prev => ({
      ...prev,
      excerpt: prev.excerpt || suggestion.metaDescription,
      tags: prev.tags || suggestion.tags,
      slug: validPrevSlug || suggestion.slug || generateCleanSlug(articleForm.title)
    }));
    showNotification('✨ AI SEO सुझाव (Meta Description, Tags & Slug) सफलतापूर्वक जनरेट हो गए!');
  };

  // Save Article
  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleForm.title || !articleForm.content) {
      alert('कृपया शीर्षक और सामग्री भरें।');
      return;
    }

    const rawSlug = articleForm.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
    const slug = (rawSlug && rawSlug.length >= 3 && !/^[-]+$/.test(rawSlug))
      ? rawSlug
      : generateCleanSlug(articleForm.title, editingArticleId || Date.now().toString());

    const selectedCat = SITE_CONFIG.categories.find(c => c.slug === articleForm.category);

    const newArticle: Article = {
      id: editingArticleId || Date.now().toString(),
      slug,
      title: articleForm.title,
      excerpt: articleForm.excerpt || articleForm.title,
      content: articleForm.content,
      category: articleForm.category,
      categoryHindi: selectedCat ? selectedCat.hindiName : 'सामान्य स्वास्थ्य',
      readTime: articleForm.readTime,
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      status: 'published',
      author: {
        name: (articleForm.authorName || 'राजेश कुमार साहू').replace(/गुरु\s*/gi, '').replace(/Guru\s*/gi, '').trim() || 'राजेश कुमार साहू',
        role: articleForm.authorRole
      },
      image: {
        url: articleForm.imageUrl,
        alt: articleForm.imageAlt || articleForm.title
      },
      seo: {
        title: `${articleForm.title} | हिंदी हेल्थ गाइड`,
        metaDescription: articleForm.excerpt || articleForm.title,
        keywords: articleForm.tags.split(',').map(t => t.trim())
      },
      tags: articleForm.tags.split(',').map(t => t.trim()),
      reviewedBy: {
        name: 'राजेश कुमार साहू',
        credentials: 'मुख्य संपादक (Chief Editor) एवं स्वास्थ्य विश्लेषक'
      }
    };

    const validation = validateArticleSchema(newArticle);
    if (!validation.valid) {
      alert(`आर्टिकल स्कीमा सत्यापन त्रुटि (Schema Validation Error):\n• ${validation.errors.join('\n• ')}`);
      return;
    }

    let updated: Article[];
    if (editingArticleId) {
      updated = articles.map(a => a.id === editingArticleId ? newArticle : a);
    } else {
      updated = [newArticle, ...articles];
    }

    setArticles(updated);
    saveStoredArticles(updated);
    setEditingArticleId(null);
    setArticleForm({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: SITE_CONFIG.categories[0].slug,
      categoryHindi: SITE_CONFIG.categories[0].hindiName,
      readTime: '5 मिनट',
      authorName: 'राजेश कुमार साहू',
      authorRole: 'मुख्य संपादक (Chief Editor)',
      imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
      imageAlt: '',
      tags: 'स्वास्थ्य, चिकित्सा'
    });
    showNotification('आर्टिकल सफलतापूर्वक सहेज लिया गया!');
  };

  const handleEditArticle = (art: Article) => {
    setEditingArticleId(art.id);
    setArticleForm({
      title: art.title,
      slug: art.slug,
      excerpt: art.excerpt,
      content: art.content,
      category: art.category,
      categoryHindi: art.categoryHindi,
      readTime: art.readTime || '5 मिनट',
      authorName: (art.author?.name || 'राजेश कुमार साहू').replace(/गुरु\s*/gi, '').replace(/Guru\s*/gi, '').trim() || 'राजेश कुमार साहू',
      authorRole: art.author?.role || 'मुख्य संपादक (Chief Editor)',
      imageUrl: art.image?.url || '',
      imageAlt: art.image?.alt || '',
      tags: art.tags?.join(', ') || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteArticle = (id: string) => {
    if (confirm('क्या आप वाकई इस आर्टिकल को हटाना चाहते हैं?')) {
      const updated = articles.filter(a => a.id !== id);
      setArticles(updated);
      saveStoredArticles(updated);
      showNotification('आर्टिकल हटा दिया गया है।');
    }
  };

  // Save Ad
  const handleSaveAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adForm.title || !adForm.targetUrl) {
      alert('कृपया विज्ञापन शीर्षक और टारगेट लिंक भरें।');
      return;
    }

    const updatedAd: Advertisement = {
      id: editingAdId || Date.now().toString(),
      title: adForm.title,
      description: adForm.description,
      imageUrl: adForm.imageUrl,
      targetUrl: adForm.targetUrl,
      position: adForm.position,
      active: adForm.active,
      createdAt: editingAdId ? (ads.find(a => a.id === editingAdId)?.createdAt || new Date().toISOString()) : new Date().toISOString()
    };

    let updated: Advertisement[];
    if (editingAdId) {
      updated = ads.map(a => a.id === editingAdId ? updatedAd : a);
    } else {
      updated = [updatedAd, ...ads];
    }

    setAds(updated);
    saveStoredAds(updated);
    setEditingAdId(null);
    setAdForm({
      title: '',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
      targetUrl: 'https://www.mohfw.gov.in',
      position: 'mid',
      active: true
    });
    showNotification(editingAdId ? 'विज्ञापन सफलतापूर्वक अपडेट कर दिया गया!' : 'विज्ञापन (AdSense) सफलतापूर्वक प्रकाशित हो गया!');
  };

  const handleEditAd = (ad: Advertisement) => {
    setEditingAdId(ad.id);
    setAdForm({
      title: ad.title,
      description: ad.description,
      imageUrl: ad.imageUrl,
      targetUrl: ad.targetUrl,
      position: ad.position,
      active: ad.active
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteAd = (id: string) => {
    if (confirm('क्या आप इस विज्ञापन को हटाना चाहते हैं?')) {
      const updated = ads.filter(ad => ad.id !== id);
      setAds(updated);
      saveStoredAds(updated);
      showNotification('विज्ञापन हटा दिया गया है।');
    }
  };

  const toggleAdStatus = (id: string) => {
    const updated = ads.map(ad => ad.id === id ? { ...ad, active: !ad.active } : ad);
    setAds(updated);
    saveStoredAds(updated);
    showNotification('विज्ञापन की स्थिति बदल दी गई है।');
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 pb-20">
      {/* Top Admin Header */}
      <header className="bg-stone-900 text-white shadow-md w-full">
        <div className="w-full max-w-full px-3 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{SITE_CONFIG.hindiName} - एडमिन पैनल</h1>
              <p className="text-xs text-stone-400">पूर्ण आर्टिकल्स और विज्ञापन (AdSense स्टाइल) नियंत्रण केंद्र</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleResetData}
              className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-amber-400 px-4 py-2 rounded-xl text-sm font-medium transition"
              title="डेटा रीसेट करें"
            >
              <RotateCcw className="w-4 h-4" />
              <span>रीसेट डेटा</span>
            </button>
            <Link
              href="/"
              className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition shadow"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>साइट पर वापस जाएं</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Notification Toast */}
      {message && (
        <div className="w-full max-w-full px-3 sm:px-6 mt-4">
          <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-lg flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="font-medium text-sm">{message}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="w-full max-w-full px-3 sm:px-6 mt-8">
        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b border-stone-300 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('articles')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition shadow-sm ${
              activeTab === 'articles' ? 'bg-rose-600 text-white' : 'bg-white text-stone-700 hover:bg-stone-200'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>आर्टिकल्स प्रबंधन ({articles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ads')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition shadow-sm ${
              activeTab === 'ads' ? 'bg-teal-600 text-white' : 'bg-white text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Megaphone className="w-5 h-5" />
            <span>विज्ञापन (AdSense) प्रबंधन ({ads.length})</span>
          </button>
        </div>

        {/* ARTICLES TAB CONTENT */}
        {activeTab === 'articles' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Article Creation / Edit Form */}
            <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-stone-200 h-fit sticky top-24">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6">
                <h3 className="font-bold text-lg text-stone-900">
                  {editingArticleId ? 'आर्टिकल संपादित करें' : 'नया आर्टिकल पोस्ट करें'}
                </h3>
                {editingArticleId && (
                  <button
                    onClick={() => {
                      setEditingArticleId(null);
                      setArticleForm({
                        title: '', slug: '', excerpt: '', content: '',
                        category: SITE_CONFIG.categories[0].slug, categoryHindi: SITE_CONFIG.categories[0].hindiName,
                        readTime: '5 मिनट', authorName: 'राजेश कुमार साहू', authorRole: 'मुख्य संपादक (Chief Editor)',
                        imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
                        imageAlt: '', tags: 'स्वास्थ्य'
                      });
                    }}
                    className="text-xs text-rose-600 font-semibold hover:underline"
                  >
                    रद्द करें
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveArticle} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">आर्टिकल शीर्षक (Title)</label>
                  <input
                    type="text"
                    required
                    value={articleForm.title}
                    onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                    placeholder="जैसे: सुरक्षित स्वास्थ्य और सावधानियां"
                    className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">श्रेणी (Category)</label>
                  <select
                    value={articleForm.category}
                    onChange={(e) => {
                      const cat = SITE_CONFIG.categories.find(c => c.slug === e.target.value);
                      setArticleForm({
                        ...articleForm,
                        category: e.target.value,
                        categoryHindi: cat ? cat.hindiName : ''
                      });
                    }}
                    className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  >
                    {SITE_CONFIG.categories.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>{cat.hindiName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">छवि अपलोड करें (Direct Photo Upload or URL)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'article')}
                    className="w-full text-xs text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 mb-2"
                  />
                  <input
                    type="text"
                    value={articleForm.imageUrl}
                    onChange={(e) => setArticleForm({ ...articleForm, imageUrl: e.target.value })}
                    placeholder="या इमेज URL यहाँ पेस्ट करें"
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">संक्षिप्त सारांश (Excerpt)</label>
                  <textarea
                    rows={2}
                    value={articleForm.excerpt}
                    onChange={(e) => setArticleForm({ ...articleForm, excerpt: e.target.value })}
                    placeholder="आर्टिकल का छोटा विवरण..."
                    className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">मुख्य सामग्री (HTML / Text Content)</label>
                  <textarea
                    rows={6}
                    required
                    value={articleForm.content}
                    onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                    placeholder="<h2>परिचय</h2><p>यहाँ विस्तार से जानकारी लिखें...</p>"
                    className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-sm font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-stone-700">टैग्स / कीवर्ड्स (Tags & Keywords)</label>
                    <button
                      type="button"
                      onClick={handleAutoSeoGenerate}
                      className="text-xs bg-amber-500 hover:bg-amber-600 text-white font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm transition"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>✨ AI ऑटो SEO जनरेट करें</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={articleForm.tags}
                    onChange={(e) => setArticleForm({ ...articleForm, tags: e.target.value })}
                    placeholder="जैसे: स्वास्थ्य, चिकित्सा, प्रजनन स्वास्थ्य"
                    className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none"
                  />
                  <p className="text-[11px] text-stone-500 mt-1">शीर्षक और सामग्री के आधार पर स्वचालित टैग और मेटा विवरण (Meta Description) जनरेट करने के लिए ऊपर बटन दबाएं।</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">लेखक नाम</label>
                    <input
                      type="text"
                      value={articleForm.authorName}
                      onChange={(e) => setArticleForm({ ...articleForm, authorName: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">पढ़ने का समय</label>
                    <input
                      type="text"
                      value={articleForm.readTime}
                      onChange={(e) => setArticleForm({ ...articleForm, readTime: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-rose-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-rose-700 transition flex items-center justify-center gap-2 shadow"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingArticleId ? 'आर्टिकल अपडेट करें' : 'आर्टिकल प्रकाशित करें'}</span>
                </button>
              </form>
            </div>

            {/* Articles List */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-bold text-lg text-stone-900 mb-4">प्रकाशित आर्टिकल्स की सूची ({articles.length})</h3>
              {articles.map((art) => (
                <div key={art.id} className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">{art.categoryHindi}</span>
                    <h4 className="font-bold text-stone-900 text-base">{art.title}</h4>
                    <p className="text-xs text-stone-500 line-clamp-1">{art.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-stone-400 pt-1">
                      <span>लेखक: {art.author?.name}</span>
                      <span>दिनांक: {new Date(art.publishedAt).toLocaleDateString('hi-IN')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/articles/${art.slug}`}
                      target="_blank"
                      className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1"
                      title="देखें"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleEditArticle(art)}
                      className="p-2 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-xl text-xs font-semibold flex items-center gap-1"
                      title="संपादित करें"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteArticle(art.id)}
                      className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-semibold flex items-center gap-1"
                      title="हटाएं"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ADS TAB CONTENT */}
        {activeTab === 'ads' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Ad Creation Form */}
            <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-stone-200 h-fit sticky top-24">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6">
                <div>
                  <h3 className="font-bold text-lg text-stone-900">
                    {editingAdId ? 'विज्ञापन संपादित करें' : 'नया विज्ञापन (AdSense स्टाइल) जोड़ें'}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">विज्ञापन फुटर, बॉटम, मिड या साइडबार में दिखाई देगा</p>
                </div>
                {editingAdId && (
                  <button
                    onClick={() => {
                      setEditingAdId(null);
                      setAdForm({
                        title: '',
                        description: '',
                        imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
                        targetUrl: 'https://www.mohfw.gov.in',
                        position: 'mid',
                        active: true
                      });
                    }}
                    className="text-xs text-teal-600 font-semibold hover:underline"
                  >
                    रद्द करें
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveAd} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">विज्ञापन शीर्षक (Title)</label>
                  <input
                    type="text"
                    required
                    value={adForm.title}
                    onChange={(e) => setAdForm({ ...adForm, title: e.target.value })}
                    placeholder="जैसे: सुरक्षित स्वास्थ्य उत्पाद / कैंपेन"
                    className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">विज्ञापन विवरण (Description)</label>
                  <textarea
                    rows={3}
                    value={adForm.description}
                    onChange={(e) => setAdForm({ ...adForm, description: e.target.value })}
                    placeholder="विज्ञापन का विवरण या ऑफर..."
                    className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">विज्ञापन फोटो अपलोड करें (Direct Upload or URL)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'ad')}
                    className="w-full text-xs text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 mb-2"
                  />
                  <input
                    type="text"
                    value={adForm.imageUrl}
                    onChange={(e) => setAdForm({ ...adForm, imageUrl: e.target.value })}
                    placeholder="या इमेज URL यहाँ पेस्ट करें"
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">टारगेट लिंक (Target Click URL)</label>
                  <input
                    type="url"
                    required
                    value={adForm.targetUrl}
                    onChange={(e) => setAdForm({ ...adForm, targetUrl: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">विज्ञापन की स्थिति (Position)</label>
                  <select
                    value={adForm.position}
                    onChange={(e) => setAdForm({ ...adForm, position: e.target.value as Advertisement['position'] })}
                    className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none"
                  >
                    <option value="mid">मध्य भाग (Mid Content - होमपेज)</option>
                    <option value="bottom">निचला भाग (Bottom Content)</option>
                    <option value="footer">फुटर बैनर (Footer Banner)</option>
                    <option value="article-sidebar">आर्टिकल साइडबार (Sidebar)</option>
                    <option value="article-inline">आर्टिकल के अंदर (Inline)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="adActive"
                    checked={adForm.active}
                    onChange={(e) => setAdForm({ ...adForm, active: e.target.checked })}
                    className="w-4 h-4 text-teal-600 rounded"
                  />
                  <label htmlFor="adActive" className="text-xs font-semibold text-stone-700">तुरंत लाइव सक्रिय करें</label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-teal-700 transition flex items-center justify-center gap-2 shadow"
                >
                  {editingAdId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  <span>{editingAdId ? 'विज्ञापन अपडेट करें' : 'विज्ञापन पोस्ट करें'}</span>
                </button>
              </form>
            </div>

            {/* Ads List */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-bold text-lg text-stone-900 mb-4">सक्रिय विज्ञापन सूची ({ads.length})</h3>
              {ads.map((ad) => (
                <div key={ad.id} className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    {ad.imageUrl && (
                      <div className="w-20 h-20 relative rounded-xl overflow-hidden shrink-0 bg-stone-100">
                        <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-700 px-2 py-0.5 rounded">
                          स्थिति: {ad.position}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${ad.active ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-600'}`}>
                          {ad.active ? 'सक्रिय (Active)' : 'निष्क्रिय (Paused)'}
                        </span>
                      </div>
                      <h4 className="font-bold text-stone-900 text-base">{ad.title}</h4>
                      <p className="text-xs text-stone-600 line-clamp-1">{ad.description}</p>
                      <a href={ad.targetUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-teal-600 hover:underline flex items-center gap-1">
                        <span>{ad.targetUrl}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleEditAd(ad)}
                      className="p-2 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-xl text-xs font-semibold flex items-center gap-1"
                      title="संपादित करें"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleAdStatus(ad.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${ad.active ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
                    >
                      {ad.active ? 'रोकें (Pause)' : 'चालू करें'}
                    </button>
                    <button
                      onClick={() => handleDeleteAd(ad.id)}
                      className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl"
                      title="हटाएं"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
