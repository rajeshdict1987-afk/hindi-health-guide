'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Sparkles,
  Heading2,
  Heading3,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Link2,
  ImageIcon,
  Eye,
  Code2,
  LogOut,
  Sliders,
  DollarSign,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { Article } from '@/src/types/article';
import { Advertisement, AdSenseSettings, DEFAULT_ADSENSE_SETTINGS } from '@/src/types/ad';
import { 
  getStoredArticles, 
  saveStoredArticles, 
  mergeArticles,
  getStoredAds, 
  saveStoredAds, 
  resetToDefaults,
  getStoredAdSenseSettings,
  saveStoredAdSenseSettings
} from '@/src/lib/store';
import { SITE_CONFIG } from '@/src/config/site-config';
import { generateSeoSuggestions, generateCleanSlug } from '@/src/lib/seoHelper';
import { validateArticleSchema } from '@/src/types/firestore';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged, signInAnonymously, signOut } from 'firebase/auth';
import { db, storage, auth, isFirebaseConfigured } from '@/lib/firebase';
import { compressAndConvertToWebP } from '@/lib/imageOptimizer';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginEmail, setLoginEmail] = useState('rajeshdict.1987@gmail.com');
  const [loginPin, setLoginPin] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'articles' | 'ads' | 'adsense'>('articles');
  const [editorMode, setEditorMode] = useState<'write' | 'preview'>('write');
  
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
    imageAlt: 'स्वास्थ्य लेख',
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

  // Google AdSense Settings State
  const [adSenseForm, setAdSenseForm] = useState<AdSenseSettings>(DEFAULT_ADSENSE_SETTINGS);

  const [message, setMessage] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingInline, setIsUploadingInline] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inlineFileInputRef = useRef<HTMLInputElement>(null);

  // Authentication & Initialization
  useEffect(() => {
    try {
      // 1. Check local session cookie or sessionStorage
      const hasSession = sessionStorage.getItem('admin_auth') === 'true';
      if (hasSession) {
        setIsAuthenticated(true);
      }

      // 2. Firebase Auth state listener (if configured)
      const unsubscribe = (isFirebaseConfigured && auth)
        ? onAuthStateChanged(auth, (user) => {
            if (user && hasSession) {
              setIsAuthenticated(true);
            }
          })
        : () => {};

      // 3. Load initial data
      const localArticles = getStoredArticles();
      setArticles(localArticles);
      setAds(getStoredAds());
      setAdSenseForm(getStoredAdSenseSettings());

      // Fetch latest articles from server and merge non-destructively
      fetch('/api/articles')
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success && Array.isArray(data.articles) && data.articles.length > 0) {
            setArticles((prev) => {
              const merged = mergeArticles(prev, data.articles);
              saveStoredArticles(merged);
              return merged;
            });
          }
        })
        .catch(() => {});

      // Fetch AdSense settings from Firestore if saved and active
      if (isFirebaseConfigured && db) {
        getDoc(doc(db, 'siteSettings', 'ads'))
          .then((snap) => {
            if (snap.exists()) {
              const data = snap.data() as AdSenseSettings;
              setAdSenseForm(prev => ({ ...prev, ...data }));
              saveStoredAdSenseSettings({ ...DEFAULT_ADSENSE_SETTINGS, ...data });
            }
          })
          .catch(() => {});
      }

      return () => unsubscribe();
    } catch (e) {
      console.error('Error loading stored data:', e);
    }
  }, []);

  const showNotification = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 4000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = loginEmail.trim().toLowerCase();
    if (cleanEmail !== 'rajeshdict.1987@gmail.com') {
      setLoginError('अनधिकृत ईमेल पता! केवल अधिकृत मुख्य संपादक (rajeshdict.1987@gmail.com) ही लॉगिन कर सकते हैं।');
      return;
    }
    if (loginPin.trim() === '8492') {
      if (isFirebaseConfigured && auth) {
        try {
          await signInAnonymously(auth);
        } catch (authErr) {
          console.warn('Firebase Auth anonymous login note:', authErr);
        }
      }
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      sessionStorage.setItem('admin_email', 'rajeshdict.1987@gmail.com');
      sessionStorage.setItem('admin_name', 'राजेश कुमार साहू');
      document.cookie = 'admin_session=authenticated; path=/; max-age=86400; SameSite=Lax';
      setLoginError('');
      showNotification('सफलतापूर्वक लॉगिन हो गया!');
    } else {
      setLoginError('अमान्य पिन (Invalid PIN)। कृपया सही गोपनीय पिन दर्ज करें।');
    }
  };

  const handleLogout = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn('Sign out note:', e);
      }
    }
    sessionStorage.removeItem('admin_auth');
    sessionStorage.removeItem('admin_email');
    sessionStorage.removeItem('admin_name');
    document.cookie = 'admin_session=; path=/; max-age=0; SameSite=Lax';
    setIsAuthenticated(false);
  };

  // Insert Rich Formatting at Cursor Position
  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = articleForm.content;
    const selectedText = currentText.substring(start, end) || 'यहाँ लिखें';

    const replacement = `${prefix}${selectedText}${suffix}`;
    const updatedContent = currentText.substring(0, start) + replacement + currentText.substring(end);

    setArticleForm(prev => ({ ...prev, content: updatedContent }));

    // Reset cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 50);
  };

  // Handle Main Featured Image & Ad Image Upload
  // Enforces WebP compression (max 1200px, max 500KB) and direct Firebase Storage upload
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, type: 'article' | 'ad' = 'article') {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isFirebaseConfigured || !storage) {
      showNotification('Firebase Storage सक्रिय नहीं है। कृपया इमेज का सीधा वेब URL दर्ज करें।');
      e.target.value = '';
      return;
    }

    setIsUploadingImage(true);
    showNotification('इमेज को ऑप्टिमाइज़ और WebP (<200KB) में कंप्रेस किया जा रहा है...');

    try {
      // 1. Client-Side WebP Compression (Strict <= 1200px width & <= 200KB)
      const optimizedFile = await compressAndConvertToWebP(file, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.8,
        maxSizeBytes: 200 * 1024 // Strict 200KB limit for Core Web Vitals
      });

      // 2. Upload strictly to Firebase Storage
      const folder = type === 'article' ? 'articles' : 'ads';
      const storageRef = ref(storage, `${folder}/${Date.now()}_${optimizedFile.name}`);
      const snapshot = await uploadBytes(storageRef, optimizedFile);
      
      // 3. Obtain public CDN download URL (No Base64 in state or localStorage)
      const downloadURL = await getDownloadURL(snapshot.ref);

      if (type === 'article') {
        setArticleForm(prev => ({ ...prev, imageUrl: downloadURL }));
      } else {
        setAdForm(prev => ({ ...prev, imageUrl: downloadURL }));
      }

      showNotification('इमेज सफलतापूर्वक कंप्रेस होकर WebP फॉर्मेट (<200KB) में Firebase Storage में अपलोड हो गई!');
    } catch (error) {
      console.error("Upload Error:", error);
      showNotification('इमेज अपलोड करने में विफल! कृपया सीधा वेब URL दर्ज करें।');
    } finally {
      setIsUploadingImage(false);
      // Reset input value
      e.target.value = '';
    }
  }

  // Handle Inline Image Upload directly into Article Content
  async function handleInlineImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isFirebaseConfigured || !storage) {
      showNotification('Firebase Storage सक्रिय नहीं है। कृपया इमेज का सीधा वेब URL उपयोग करें।');
      if (inlineFileInputRef.current) inlineFileInputRef.current.value = '';
      return;
    }

    setIsUploadingInline(true);
    showNotification('इनलाइन इमेज को WebP (<200KB) में कंप्रेस व अपलोड किया जा रहा है...');

    try {
      const optimizedFile = await compressAndConvertToWebP(file, {
        maxWidth: 1000,
        maxHeight: 1000,
        quality: 0.8,
        maxSizeBytes: 200 * 1024 // 200KB limit
      });

      const storageRef = ref(storage, `articles/inline_${Date.now()}_${optimizedFile.name}`);
      const snapshot = await uploadBytes(storageRef, optimizedFile);

      const downloadURL = await getDownloadURL(snapshot.ref);

      const inlineHtml = `\n<figure class="my-6">\n  <img src="${downloadURL}" alt="${file.name.replace(/\.[^/.]+$/, '')}" class="rounded-2xl shadow-md w-full object-cover max-h-[450px]" loading="lazy" />\n  <figcaption class="text-xs text-stone-500 mt-2 text-center">चित्र: ${file.name.replace(/\.[^/.]+$/, '')}</figcaption>\n</figure>\n`;

      insertFormatting(inlineHtml, '');
      showNotification('इनलाइन इमेज सफलतापूर्वक आर्टिकल में जोड़ दी गई!');
    } catch (err) {
      console.error('Inline image upload error:', err);
      showNotification('इनलाइन इमेज अपलोड करने में त्रुटि!');
    } finally {
      setIsUploadingInline(false);
      if (inlineFileInputRef.current) inlineFileInputRef.current.value = '';
    }
  }

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

  // Manual Sync: Force sync all articles between Client and Server
  const handleSyncAllToServer = async () => {
    setIsSyncing(true);
    showNotification('सर्वर व कैश के साथ सभी आर्टिकल्स सिंक किए जा रहे हैं...');
    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sync: true, articles }),
      });
      const data = await res.json();
      if (data && data.success && Array.isArray(data.articles)) {
        const merged = mergeArticles(data.articles, articles);
        setArticles(merged);
        saveStoredArticles(merged);
        showNotification(`✅ सभी ${merged.length} आर्टिकल्स सर्वर व कैश पर सफलतापूर्वक सिंक हो गए!`);
      } else {
        throw new Error(data.error || 'सिंक विफल');
      }
    } catch (err: any) {
      console.warn('Sync error:', err);
      showNotification('⚠️ सर्वर सिंक में समस्या आई, लेकिन आपके स्थानीय आर्टिकल्स सुरक्षित हैं।');
    } finally {
      setIsSyncing(false);
    }
  };

  // Save Article (Async, Verified, Next.js Cache Revalidated)
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors([]);

    if (!articleForm.title.trim() || !articleForm.content.trim()) {
      setValidationErrors(['कृपया आर्टिकल शीर्षक और मुख्य सामग्री अवश्य भरें।']);
      return;
    }

    const rawSlug = articleForm.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
    const slug = (rawSlug && rawSlug.length >= 3 && !/^[-]+$/.test(rawSlug))
      ? rawSlug
      : generateCleanSlug(articleForm.title, editingArticleId || Date.now().toString());

    const selectedCat = SITE_CONFIG.categories.find(c => c.slug === articleForm.category);

    // Ensure NO base64 image enters storage
    let safeImageUrl = articleForm.imageUrl;
    if (safeImageUrl.startsWith('data:image/')) {
      safeImageUrl = 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80';
    }

    const newArticle: Article = {
      id: editingArticleId || Date.now().toString(),
      slug,
      title: articleForm.title.trim(),
      excerpt: articleForm.excerpt.trim() || articleForm.title.trim(),
      content: articleForm.content.trim(),
      category: articleForm.category,
      categoryHindi: selectedCat ? selectedCat.hindiName : 'सामान्य स्वास्थ्य',
      readTime: articleForm.readTime || '5 मिनट',
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'published',
      author: {
        name: (articleForm.authorName || 'राजेश कुमार साहू').replace(/गुरु\s*/gi, '').replace(/Guru\s*/gi, '').trim() || 'राजेश कुमार साहू',
        role: articleForm.authorRole || 'मुख्य संपादक (Chief Editor)'
      },
      image: {
        url: safeImageUrl,
        alt: articleForm.imageAlt || articleForm.title
      },
      seo: {
        title: `${articleForm.title} | हिंदी हेल्थ गाइड`,
        metaDescription: articleForm.excerpt || articleForm.title,
        keywords: articleForm.tags.split(',').map(t => t.trim()).filter(Boolean)
      },
      tags: articleForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      reviewedBy: {
        name: 'राजेश कुमार साहू',
        credentials: 'मुख्य संपादक (Chief Editor) एवं स्वास्थ्य विश्लेषक'
      }
    };

    const validation = validateArticleSchema(newArticle);
    if (!validation.valid) {
      setValidationErrors(validation.errors);
      return;
    }

    setIsPublishing(true);
    showNotification('आर्टिकल सर्वर पर प्रकाशित किया जा रहा है...');

    try {
      // 1. Direct Server API save with cache invalidation
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin_secret_token'
        },
        body: JSON.stringify({ article: newArticle }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'सर्वर पर प्रकाशित करने में समस्या आई');
      }

      const serverArticles: Article[] = Array.isArray(data.articles) ? data.articles : [];
      const updated = editingArticleId
        ? mergeArticles([newArticle], serverArticles)
        : mergeArticles([newArticle], serverArticles);

      setArticles(updated);
      saveStoredArticles(updated);

      // 2. Background Firestore sync (optional if active)
      if (isFirebaseConfigured && db) {
        try {
          const docRef = doc(db, 'articles', newArticle.slug);
          setDoc(docRef, {
            ...newArticle,
            updatedAt: new Date().toISOString()
          }, { merge: true }).catch((err) => console.warn('Firestore sync note:', err));
        } catch (e) {
          console.warn('Firestore sync note:', e);
        }
      }

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
      setValidationErrors([]);
      setEditorMode('write');
      showNotification('✅ आर्टिकल सफलतापूर्वक प्रकाशित हो गया और पोर्टल पर तुरंत लाइव हो गया!');
    } catch (err: any) {
      console.error('Publish error:', err);
      // Fallback: preserve in localStorage immediately so work is never lost
      const localUpdated = editingArticleId
        ? articles.map(a => a.id === editingArticleId ? newArticle : a)
        : [newArticle, ...articles];
      setArticles(localUpdated);
      saveStoredArticles(localUpdated);

      setValidationErrors([
        `चेतावनी: आर्टिकल स्थानीय ब्राउज़र में सहेज लिया गया है, लेकिन सर्वर पर प्रकाशित करने में रुकावट आई: ${err.message || 'नेटवर्क समस्या'}।`,
        'कृपया नीचे दिए गए "सर्वर से सिंक करें" बटन पर क्लिक करके पुनः प्रयास करें।'
      ]);
    } finally {
      setIsPublishing(false);
    }
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
    setEditorMode('write');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteArticle = (id: string) => {
    if (confirm('क्या आप वाकई इस आर्टिकल को हटाना चाहते हैं?')) {
      const targetArt = articles.find(a => a.id === id);
      const updated = articles.filter(a => a.id !== id);
      setArticles(updated);
      saveStoredArticles(updated);

      // Delete from server API
      fetch(`/api/articles?id=${encodeURIComponent(id)}&slug=${encodeURIComponent(targetArt?.slug || '')}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer admin_secret_token'
        }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success && Array.isArray(data.articles)) {
            setArticles(data.articles);
            saveStoredArticles(data.articles);
          }
        })
        .catch((err) => console.warn('Server article delete note:', err));

      if (targetArt?.slug && isFirebaseConfigured && db) {
        try {
          deleteDoc(doc(db, 'articles', targetArt.slug)).catch(() => {});
        } catch {}
      }
      showNotification('आर्टिकल हटा दिया गया है।');
    }
  };

  // Save Sponsored Ad
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

    // Sync to Firestore (optional if active)
    if (isFirebaseConfigured && db) {
      try {
        setDoc(doc(db, 'advertisements', updatedAd.id), updatedAd, { merge: true }).catch(() => {});
      } catch {}
    }

    setEditingAdId(null);
    setAdForm({
      title: '',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
      targetUrl: 'https://www.mohfw.gov.in',
      position: 'mid',
      active: true
    });
    showNotification(editingAdId ? 'विज्ञापन सफलतापूर्वक अपडेट कर दिया गया!' : 'विज्ञापन सफलतापूर्वक प्रकाशित हो गया!');
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
      if (isFirebaseConfigured && db) {
        try {
          deleteDoc(doc(db, 'advertisements', id)).catch(() => {});
        } catch {}
      }
      showNotification('विज्ञापन हटा दिया गया है।');
    }
  };

  // Save Google AdSense Settings
  const handleSaveAdSense = async (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredAdSenseSettings(adSenseForm);

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'siteSettings', 'ads'), {
          ...adSenseForm,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } catch (err) {
        console.warn('Firestore AdSense save note:', err);
      }
    }

    showNotification('Google AdSense सेटिंग्स सफलतापूर्वक सुरक्षित कर दी गईं!');
  };

  const handleResetData = () => {
    if (confirm('क्या आप सभी आर्टिकल्स और विज्ञापनों को मूल डिफ़ॉल्ट स्थिति में रीसेट करना चाहते हैं?')) {
      const res = resetToDefaults();
      setArticles(res.articles);
      setAds(res.ads);
      showNotification('डेटा सफलतापूर्वक रीसेट कर दिया गया है!');
    }
  };

  // Login Screen
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
              <Shield className="w-4 h-4" />
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

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 pb-20 font-sans">
      {/* Top Admin Header */}
      <header className="bg-stone-900 text-white shadow-md w-full sticky top-0 z-40">
        <div className="w-full max-w-full px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{SITE_CONFIG.hindiName} - एडमिन पोर्टल</h1>
              <p className="text-xs text-stone-400">मुख्य संपादक: राजेश कुमार साहू (rajeshdict.1987@gmail.com)</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={handleResetData}
              className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-amber-400 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition"
              title="डेटा रीसेट करें"
            >
              <RotateCcw className="w-4 h-4" />
              <span>रीसेट डेटा</span>
            </button>
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition"
            >
              <ExternalLink className="w-4 h-4" />
              <span>साइट देखें</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition shadow"
            >
              <LogOut className="w-4 h-4" />
              <span>लॉगआउट</span>
            </button>
          </div>
        </div>
      </header>

      {/* Notification Toast */}
      {message && (
        <div className="w-full max-w-full px-4 sm:px-6 mt-4">
          <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-lg flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="font-medium text-sm">{message}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="w-full max-w-full px-4 sm:px-6 mt-6">
        {/* Navigation Tabs */}
        <div className="flex gap-3 border-b border-stone-300 pb-4 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('articles')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition shrink-0 ${
              activeTab === 'articles' ? 'bg-rose-600 text-white shadow-md' : 'bg-white text-stone-700 hover:bg-stone-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>आर्टिकल्स प्रबंधन ({articles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('adsense')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition shrink-0 ${
              activeTab === 'adsense' ? 'bg-amber-600 text-white shadow-md' : 'bg-white text-stone-700 hover:bg-stone-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Google AdSense सेटिंग्स</span>
          </button>

          <button
            onClick={() => setActiveTab('ads')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition shrink-0 ${
              activeTab === 'ads' ? 'bg-teal-600 text-white shadow-md' : 'bg-white text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>कस्टम बैनर विज्ञापन ({ads.length})</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: ARTICLES MANAGEMENT & RICH TEXT EDITOR */}
        {/* ========================================================================= */}
        {activeTab === 'articles' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Columns: Rich Article Editor */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-stone-200">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6">
                <div>
                  <h3 className="font-black text-xl text-stone-900">
                    {editingArticleId ? 'आर्टिकल संपादित करें' : 'नया हिंदी स्वास्थ्य आर्टिकल लिखें'}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">देवनागरी फॉन्ट, हेडिंग्स, कोट्स एवं ऑटो WebP इमेज अपलोडिंग</p>
                </div>
                {editingArticleId && (
                  <button
                    onClick={() => {
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
                    }}
                    className="text-xs text-rose-600 font-semibold hover:underline"
                  >
                    रद्द करें
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveArticle} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">आर्टिकल शीर्षक (Title in Hindi)</label>
                  <input
                    type="text"
                    required
                    value={articleForm.title}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      setArticleForm(prev => {
                        const autoSlug = (!prev.slug || prev.slug.startsWith('article-') || prev.slug === generateCleanSlug(prev.title))
                          ? generateCleanSlug(newTitle)
                          : prev.slug;
                        return { ...prev, title: newTitle, slug: autoSlug };
                      });
                    }}
                    placeholder="जैसे: सुरक्षित स्वास्थ्य, लक्षण और बचाव के उपाय"
                    className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-stone-700">
                      आर्टिकल URL स्लग (URL Slug in English)
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        if (articleForm.title) {
                          setArticleForm(prev => ({ ...prev, slug: generateCleanSlug(prev.title) }));
                        }
                      }}
                      className="text-[11px] text-rose-600 font-bold hover:underline"
                    >
                      शीर्षक से ऑटो-जनरेट करें
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={articleForm.slug}
                    onChange={(e) => {
                      const clean = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
                      setArticleForm({ ...articleForm, slug: clean });
                    }}
                    placeholder="जैसे: kabz-ke-gharelu-upay या reproductive-health-guide"
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono text-stone-800 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                  <p className="text-[11px] text-stone-500 mt-1 truncate">
                    🔗 लाइव यूआरएल: <span className="font-mono text-rose-600">https://hindihealthguide.org/articles/{articleForm.slug || 'slug-preview'}</span>
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">श्रेणी (Category)</label>
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
                    <label className="block text-xs font-bold text-stone-700 mb-1">पढ़ने का समय (Reading Time)</label>
                    <input
                      type="text"
                      value={articleForm.readTime}
                      onChange={(e) => setArticleForm({ ...articleForm, readTime: e.target.value })}
                      placeholder="5 मिनट"
                      className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                </div>

                {/* Featured Image with strict WebP compression and Firebase Storage upload */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-stone-700">मुख्य फ़ीचर्ड इमेज (WebP &lt; 500KB Auto-Compress &amp; Storage)</label>
                    {isUploadingImage && (
                      <span className="text-[11px] font-bold text-rose-600 animate-pulse">⚡ Firebase Storage में अपलोड हो रहा है...</span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploadingImage}
                    onChange={(e) => handleImageUpload(e, 'article')}
                    className="w-full text-xs text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 mb-2 disabled:opacity-50"
                  />
                  <input
                    type="text"
                    value={articleForm.imageUrl}
                    onChange={(e) => setArticleForm({ ...articleForm, imageUrl: e.target.value })}
                    placeholder="Firebase Storage URL या इमेज लिंक"
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none"
                  />
                  <p className="text-[11px] text-stone-500 mt-1">
                    🔒 कोई भी Base64 स्ट्रिंग localStorage में नहीं जाएगी। इमेज ऑटोमैटिकली 1200px / 500KB WebP में कंप्रेस होकर Firebase Storage CDN URL बन जाएगी।
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">संक्षिप्त सारांश (Excerpt / Meta Snippet)</label>
                  <textarea
                    rows={2}
                    value={articleForm.excerpt}
                    onChange={(e) => setArticleForm({ ...articleForm, excerpt: e.target.value })}
                    placeholder="आर्टिकल का छोटा 1-2 पंक्तियों का संक्षिप्त विवरण..."
                    className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none"
                  />
                </div>

                {/* Rich Editor Toolbar & Content */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-stone-700">
                      मुख्य लेख सामग्री (Rich Hindi Article Body)
                    </label>
                    <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setEditorMode('write')}
                        className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition ${
                          editorMode === 'write' ? 'bg-white shadow text-stone-900' : 'text-stone-500 hover:text-stone-900'
                        }`}
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>एडिटर (Editor)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditorMode('preview')}
                        className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition ${
                          editorMode === 'preview' ? 'bg-rose-600 text-white shadow' : 'text-stone-500 hover:text-stone-900'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>पूर्वावलोकन (Preview)</span>
                      </button>
                    </div>
                  </div>

                  {/* Toolbar */}
                  {editorMode === 'write' && (
                    <div className="flex flex-wrap items-center gap-1.5 p-2 bg-stone-100 border border-stone-300 rounded-t-xl text-xs">
                      <button
                        type="button"
                        onClick={() => insertFormatting('<h2>', '</h2>\n')}
                        className="px-2.5 py-1.5 bg-white hover:bg-stone-200 border border-stone-300 rounded-lg font-bold flex items-center gap-1"
                        title="उप-शीर्षक 2 जोड़ें"
                      >
                        <Heading2 className="w-3.5 h-3.5" />
                        <span>H2</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => insertFormatting('<h3>', '</h3>\n')}
                        className="px-2.5 py-1.5 bg-white hover:bg-stone-200 border border-stone-300 rounded-lg font-bold flex items-center gap-1"
                        title="उप-शीर्षक 3 जोड़ें"
                      >
                        <Heading3 className="w-3.5 h-3.5" />
                        <span>H3</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => insertFormatting('<strong>', '</strong>')}
                        className="p-1.5 bg-white hover:bg-stone-200 border border-stone-300 rounded-lg font-bold"
                        title="बोल्ड (Bold)"
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => insertFormatting('<em>', '</em>')}
                        className="p-1.5 bg-white hover:bg-stone-200 border border-stone-300 rounded-lg italic"
                        title="इटैलिक (Italic)"
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => insertFormatting('<ul>\n  <li>', '</li>\n  <li>दूसरा बिंदु</li>\n</ul>\n')}
                        className="p-1.5 bg-white hover:bg-stone-200 border border-stone-300 rounded-lg"
                        title="बुलेटेड सूची (Bullet List)"
                      >
                        <List className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => insertFormatting('<ol>\n  <li>', '</li>\n  <li>चरण दो</li>\n</ol>\n')}
                        className="p-1.5 bg-white hover:bg-stone-200 border border-stone-300 rounded-lg"
                        title="क्रमबद्ध सूची (Numbered List)"
                      >
                        <ListOrdered className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => insertFormatting('<blockquote class="p-4 my-4 border-l-4 border-rose-500 bg-rose-50/50 rounded-r-xl italic text-stone-800">\n  "', '"\n</blockquote>\n')}
                        className="p-1.5 bg-white hover:bg-stone-200 border border-stone-300 rounded-lg"
                        title="उद्धरण (Blockquote)"
                      >
                        <Quote className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => insertFormatting('<a href="/category/reproductive-health" class="text-rose-600 underline font-semibold">', '</a>')}
                        className="p-1.5 bg-white hover:bg-stone-200 border border-stone-300 rounded-lg"
                        title="आंतरिक लिंक (Internal Link)"
                      >
                        <Link2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Inline Image Upload trigger */}
                      <button
                        type="button"
                        onClick={() => inlineFileInputRef.current?.click()}
                        disabled={isUploadingInline}
                        className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-bold flex items-center gap-1 transition"
                        title="आर्टिकल में इनलाइन फोटो अपलोड करें"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>{isUploadingInline ? 'अपलोडिंग...' : '+ इनलाइन फोटो'}</span>
                      </button>
                      <input
                        ref={inlineFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleInlineImageUpload}
                        className="hidden"
                      />
                    </div>
                  )}

                  {editorMode === 'write' ? (
                    <textarea
                      ref={textareaRef}
                      rows={12}
                      required
                      value={articleForm.content}
                      onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                      placeholder="<h2>परिचय</h2><p>यहाँ विस्तार से वैज्ञानिक स्वास्थ्य जानकारी लिखें...</p>"
                      className="w-full p-4 bg-stone-50 border border-t-0 border-stone-300 rounded-b-xl text-sm font-mono focus:outline-none focus:ring-1 focus:ring-rose-500 leading-relaxed"
                    />
                  ) : (
                    <div className="p-6 bg-stone-50 border border-stone-300 rounded-xl min-h-[300px] prose prose-rose max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: articleForm.content || '<p class="text-stone-400 italic">पूर्वावलोकन देखने के लिए सामग्री दर्ज करें...</p>' }} />
                    </div>
                  )}
                </div>

                {/* Tags and AI Auto SEO */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-stone-700">टैग्स / कीवर्ड्स (Tags &amp; Keywords)</label>
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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">लेखक नाम</label>
                    <input
                      type="text"
                      value={articleForm.authorName}
                      onChange={(e) => setArticleForm({ ...articleForm, authorName: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">पद / भूमिका</label>
                    <input
                      type="text"
                      value={articleForm.authorRole}
                      onChange={(e) => setArticleForm({ ...articleForm, authorRole: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                    />
                  </div>
                </div>

                {validationErrors.length > 0 && (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
                    <h5 className="text-xs font-bold text-rose-800">कृपया निम्नलिखित सुधारें:</h5>
                    <ul className="text-xs text-rose-700 list-disc list-inside space-y-0.5">
                      {validationErrors.map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isPublishing}
                  className="w-full bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm"
                >
                  {isPublishing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>आर्टिकल प्रकाशित हो रहा है...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingArticleId ? 'अपडेट सुरक्षित करें' : 'आर्टिकल तुरंत प्रकाशित करें (Publish)'}</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right 5 Columns: Published Articles List */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-base text-stone-900">प्रकाशित स्वास्थ्य आर्टिकल्स</h4>
                    <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2.5 py-0.5 rounded-full">
                      {articles.length} कुल
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleSyncAllToServer}
                    disabled={isSyncing}
                    className="flex items-center gap-1.5 text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold px-3 py-1.5 rounded-xl transition disabled:opacity-50"
                    title="ब्राउज़र और सर्वर डेटाबेस को सिंक करें"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-rose-600' : ''}`} />
                    <span>{isSyncing ? 'सिंक हो रहा...' : 'सर्वर सिंक'}</span>
                  </button>
                </div>
                <div className="divide-y divide-stone-100 max-h-[750px] overflow-y-auto pr-1 space-y-3">
                  {articles.map((art) => (
                    <div key={art.id} className="pt-3 first:pt-0 flex items-start justify-between gap-3 group">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md">
                            {art.categoryHindi}
                          </span>
                          <span className="text-[10px] text-stone-400">
                            {new Date(art.publishedAt || art.createdAt || Date.now()).toLocaleDateString('hi-IN')}
                          </span>
                        </div>
                        <h5 className="font-bold text-sm text-stone-900 line-clamp-2 leading-snug group-hover:text-rose-600 transition">
                          {art.title}
                        </h5>
                        <p className="text-xs text-stone-500 line-clamp-1">{art.excerpt}</p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 pt-1">
                        <Link
                          href={`/articles/${art.slug}`}
                          target="_blank"
                          className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg transition"
                          title="देखें"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleEditArticle(art)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                          title="संपादित करें"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(art.id)}
                          className="p-1.5 bg-stone-100 hover:bg-rose-100 text-stone-400 hover:text-rose-600 rounded-lg transition"
                          title="हटाएं"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: GOOGLE ADSENSE SETTINGS MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'adsense' && (
          <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-stone-200 space-y-6">
            <div className="border-b border-stone-200 pb-4">
              <div className="flex items-center gap-2.5 text-amber-600 mb-1">
                <DollarSign className="w-6 h-6" />
                <h3 className="font-black text-xl text-stone-900">Google AdSense प्रबंधन एवं विज्ञापन कोड स्लॉट्स</h3>
              </div>
              <p className="text-xs text-stone-500">
                यहाँ अपने Google AdSense पब्लिशर आईडी (`ca-pub-XXXXXXXXXXXXXXXX`) अथवा विशिष्ट विज्ञापन कोड पेस्ट करें।
              </p>
            </div>

            <form onSubmit={handleSaveAdSense} className="space-y-6">
              <div className="flex items-center gap-3 p-4 bg-amber-50/60 border border-amber-200 rounded-xl">
                <input
                  type="checkbox"
                  id="adSenseEnabled"
                  checked={adSenseForm.adSenseEnabled}
                  onChange={(e) => setAdSenseForm({ ...adSenseForm, adSenseEnabled: e.target.checked })}
                  className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
                />
                <label htmlFor="adSenseEnabled" className="text-sm font-bold text-stone-800 cursor-pointer">
                  वेबसाइट पर Google AdSense विज्ञापन सक्रिय करें (Enable Google AdSense Globally)
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Google AdSense पब्लिशर क्लाइंट आईडी (Client ID)
                </label>
                <input
                  type="text"
                  value={adSenseForm.adSenseClientId}
                  onChange={(e) => setAdSenseForm({ ...adSenseForm, adSenseClientId: e.target.value })}
                  placeholder="जैसे: ca-pub-1234567890123456"
                  className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-sm font-mono focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">हेडर स्लॉट आईडी (Header Slot ID)</label>
                  <input
                    type="text"
                    value={adSenseForm.headerSlot}
                    onChange={(e) => setAdSenseForm({ ...adSenseForm, headerSlot: e.target.value })}
                    placeholder="स्लॉट आईडी (उदा. 9876543210)"
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">आर्टिकल के बीच स्लॉट (In-Article Slot)</label>
                  <input
                    type="text"
                    value={adSenseForm.inArticleSlot}
                    onChange={(e) => setAdSenseForm({ ...adSenseForm, inArticleSlot: e.target.value })}
                    placeholder="स्लॉट आईडी (उदा. 8765432109)"
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">साइडबार स्लॉट (Sidebar Slot ID)</label>
                  <input
                    type="text"
                    value={adSenseForm.sidebarSlot}
                    onChange={(e) => setAdSenseForm({ ...adSenseForm, sidebarSlot: e.target.value })}
                    placeholder="स्लॉट आईडी (उदा. 7654321098)"
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              {/* Custom Ad Code snippets */}
              <div className="space-y-4 pt-4 border-t border-stone-200">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    1. हेडर विज्ञापन कस्टम HTML/JS कोड (Header AdSense Code)
                  </label>
                  <textarea
                    rows={3}
                    value={adSenseForm.customHeaderCode || ''}
                    onChange={(e) => setAdSenseForm({ ...adSenseForm, customHeaderCode: e.target.value })}
                    placeholder="<script async src='https://pagead2.googlesyndication.com/...'>...</script>"
                    className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    2. आर्टिकल के अंदर विज्ञापन कस्टम कोड (In-Article AdSense Code)
                  </label>
                  <textarea
                    rows={3}
                    value={adSenseForm.customInArticleCode || ''}
                    onChange={(e) => setAdSenseForm({ ...adSenseForm, customInArticleCode: e.target.value })}
                    placeholder="<ins class='adsbygoogle' ...></ins>"
                    className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    3. साइडबार विज्ञापन कस्टम कोड (Sidebar AdSense Code)
                  </label>
                  <textarea
                    rows={3}
                    value={adSenseForm.customSidebarCode || ''}
                    onChange={(e) => setAdSenseForm({ ...adSenseForm, customSidebarCode: e.target.value })}
                    placeholder="<ins class='adsbygoogle' ...></ins>"
                    className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm"
              >
                <Save className="w-4 h-4" />
                <span>Google AdSense सेटिंग्स सुरक्षित करें (Save AdSense Settings)</span>
              </button>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: SPONSORED BANNER ADS MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'ads' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 6 Columns: Ad Form */}
            <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-stone-200">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6">
                <h3 className="font-bold text-lg text-stone-900">
                  {editingAdId ? 'बैनर विज्ञापन संपादित करें' : 'नया प्रायोजित बैनर जोड़ें'}
                </h3>
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
                    placeholder="जैसे: सुरक्षित स्वास्थ्य उत्पाद / जन स्वास्थ्य योजना"
                    className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">विज्ञापन विवरण (Description)</label>
                  <textarea
                    rows={3}
                    value={adForm.description}
                    onChange={(e) => setAdForm({ ...adForm, description: e.target.value })}
                    placeholder="विज्ञापन का छोटा विवरण या लाभ..."
                    className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-stone-700">विज्ञापन फोटो अपलोड करें (WebP Auto-Compress)</label>
                    {isUploadingImage && (
                      <span className="text-[11px] font-bold text-teal-600 animate-pulse">⚡ कंप्रेस व अपलोड हो रहा है...</span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploadingImage}
                    onChange={(e) => handleImageUpload(e, 'ad')}
                    className="w-full text-xs text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 mb-2 disabled:opacity-50"
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">स्थिति (Position)</label>
                    <select
                      value={adForm.position}
                      onChange={(e) => setAdForm({ ...adForm, position: e.target.value as Advertisement['position'] })}
                      className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none"
                    >
                      <option value="mid">पेज के मध्य (Mid Article/Page)</option>
                      <option value="bottom">निचला भाग (Bottom Section)</option>
                      <option value="footer">फुटर बैनर (Footer Banner)</option>
                      <option value="article-sidebar">आर्टिकल साइडबार (Sidebar)</option>
                      <option value="article-inline">आर्टिकल इनलाइन (Inline)</option>
                    </select>
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-stone-700">
                      <input
                        type="checkbox"
                        checked={adForm.active}
                        onChange={(e) => setAdForm({ ...adForm, active: e.target.checked })}
                        className="w-4 h-4 text-teal-600 rounded"
                      />
                      <span>सक्रिय (Active)</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingAdId ? 'विज्ञापन अपडेट करें' : 'विज्ञापन प्रकाशित करें'}</span>
                </button>
              </form>
            </div>

            {/* Right 6 Columns: Existing Ads List */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
                <h4 className="font-bold text-base text-stone-900 mb-4 flex items-center justify-between">
                  <span>सक्रिय बैनर विज्ञापन सूची</span>
                  <span className="text-xs bg-teal-100 text-teal-800 font-bold px-2.5 py-0.5 rounded-full">
                    {ads.length} कुल
                  </span>
                </h4>
                <div className="space-y-4">
                  {ads.map((ad) => (
                    <div key={ad.id} className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-center gap-4">
                      {ad.imageUrl && (
                        <div className="w-24 h-16 relative rounded-lg overflow-hidden shrink-0 bg-stone-200">
                          <Image
                            src={ad.imageUrl}
                            alt={ad.title}
                            fill
                            sizes="96px"
                            className="object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            ad.active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                          }`}>
                            {ad.active ? 'सक्रिय' : 'निष्क्रिय'}
                          </span>
                          <span className="text-[10px] text-stone-500 bg-stone-200/60 px-2 py-0.5 rounded">
                            {ad.position}
                          </span>
                        </div>
                        <h5 className="font-bold text-sm text-stone-900 truncate">{ad.title}</h5>
                        <p className="text-xs text-stone-500 line-clamp-1">{ad.description}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleEditAd(ad)}
                          className="p-2 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg transition"
                          title="संपादित करें"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAd(ad.id)}
                          className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                          title="हटाएं"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
