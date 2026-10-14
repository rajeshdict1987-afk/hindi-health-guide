import React, { useState } from 'react';
import {
  PlusCircle,
  FileText,
  CheckCircle,
  Clock,
  Trash2,
  Edit3,
  Eye,
  LogOut,
  Image,
  Search,
  ExternalLink,
  Shield,
  Stethoscope,
  RefreshCw,
} from 'lucide-react';
import { articleService } from '../../services/articleService';
import { adminAuth } from '../../services/firebase';
import { Article, ArticleStatus } from '../../types/article';
import { SITE_CONFIG } from '../../config/site-config';
import { useRouter } from '../../context/RouterContext';
import { SEOHead } from '../../components/SEOHead';

export const AdminDashboardPage: React.FC = () => {
  const { navigate } = useRouter();
  const authState = adminAuth.getState();

  // If not logged in, redirect to login
  if (!authState.isAuthenticated) {
    navigate('/admin/login');
    return null;
  }

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch all articles including drafts
  const allArticles = [
    ...articleService.getArticles({ status: 'published' }).articles,
    ...articleService.getArticles({ status: 'draft' }).articles,
    ...articleService.getArticles({ status: 'archived' }).articles,
  ];

  const filteredArticles = allArticles.filter((art) => {
    const matchesStatus = statusFilter === 'all' || art.status === statusFilter;
    const matchesSearch =
      art.title.toLowerCase().includes(search.toLowerCase()) ||
      art.categorySlug.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalPublished = allArticles.filter((a) => a.status === 'published').length;
  const totalDrafts = allArticles.filter((a) => a.status === 'draft').length;
  const totalReviewed = allArticles.filter((a) => a.medicalReview?.isReviewed).length;

  const handleDelete = (id: string, title: string) => {
    if (confirm(`क्या आप निश्चित रूप से "${title}" को हटाना चाहते हैं?`)) {
      articleService.deleteArticle(id);
      setRefreshKey((k) => k + 1);
    }
  };

  const togglePublish = (article: Article) => {
    const newStatus: ArticleStatus = article.status === 'published' ? 'draft' : 'published';
    articleService.updateArticle(article.id, { status: newStatus });
    setRefreshKey((k) => k + 1);
  };

  const handleResetData = () => {
    if (confirm('क्या आप सभी लेखों को प्रारंभिक प्रमाणित डेटा पर रीसेट करना चाहते हैं?')) {
      articleService.resetToDefault();
      setRefreshKey((k) => k + 1);
    }
  };

  return (
    <>
      <SEOHead title="एडमिन डैशबोर्ड" description="हिंदी हेल्थ गाइड संपादकीय डैशबोर्ड।" />

      <div className="bg-stone-100 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Admin Header */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-800">
                <Shield className="w-4 h-4 text-teal-600" />
                <span>सुरक्षित संपादकीय नियंत्रण कक्ष</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
                हिंदी हेल्थ गाइड एडमिन डैशबोर्ड
              </h1>
              <p className="text-stone-500 text-xs sm:text-sm mt-1">
                सक्रिय उपयोगकर्ता: <strong className="text-stone-800">{authState.email}</strong> ({authState.displayName})
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate('/admin/articles/new')}
                className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 text-sm shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>नया लेख लिखें</span>
              </button>
              <button
                onClick={() => navigate('/admin/media')}
                className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold px-4 py-2.5 rounded-xl transition flex items-center gap-2 text-sm border border-stone-300"
              >
                <Image className="w-4 h-4 text-stone-500" />
                <span>मीडिया गैलरी</span>
              </button>
              <button
                onClick={() => {
                  adminAuth.logout();
                  navigate('/');
                }}
                className="text-rose-600 hover:bg-rose-50 px-3 py-2.5 rounded-xl transition flex items-center gap-1.5 text-xs font-bold border border-rose-200"
                title="लॉगआउट"
              >
                <LogOut className="w-4 h-4" />
                <span>लॉगआउट</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
              <div className="text-xs text-stone-500 font-bold uppercase">कुल लेख</div>
              <div className="text-3xl font-extrabold text-stone-900 mt-1">{allArticles.length}</div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
              <div className="text-xs text-emerald-600 font-bold uppercase">प्रकाशित (Live)</div>
              <div className="text-3xl font-extrabold text-emerald-700 mt-1">{totalPublished}</div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
              <div className="text-xs text-amber-600 font-bold uppercase">प्राइवेट ड्राफ्ट</div>
              <div className="text-3xl font-extrabold text-amber-700 mt-1">{totalDrafts}</div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
              <div className="text-xs text-purple-600 font-bold uppercase">डॉक्टर-समीक्षित</div>
              <div className="text-3xl font-extrabold text-purple-700 mt-1">{totalReviewed}</div>
            </div>
          </div>

          {/* Articles Management Table */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            {/* Table Filter Toolbar */}
            <div className="p-5 border-b border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="शीर्षक या श्रेणी खोजें..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-hidden focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <div className="flex rounded-xl bg-stone-100 p-1 border border-stone-200 text-xs font-semibold">
                  {['all', 'published', 'draft'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg transition capitalize ${
                        statusFilter === st ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
                      }`}
                    >
                      {st === 'all' ? 'सभी' : st === 'published' ? 'प्रकाशित' : 'ड्राफ्ट'}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleResetData}
                  className="p-2 text-stone-400 hover:text-stone-700 rounded-lg"
                  title="डिफ़ॉल्ट प्रमाणित लेखों पर रीसेट करें"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[11px] font-bold">
                    <th className="py-3.5 px-6">लेख का शीर्षक</th>
                    <th className="py-3.5 px-4">श्रेणी</th>
                    <th className="py-3.5 px-4">स्थिति</th>
                    <th className="py-3.5 px-4">समीक्षा</th>
                    <th className="py-3.5 px-4">व्यूज</th>
                    <th className="py-3.5 px-6 text-right">कार्रवाई</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {filteredArticles.map((art) => {
                    const cat = SITE_CONFIG.categories.find((c) => c.slug === art.categorySlug);
                    return (
                      <tr key={art.id} className="hover:bg-stone-50/80 transition">
                        <td className="py-4 px-6 max-w-sm">
                          <div className="font-bold text-stone-900 line-clamp-1">{art.title}</div>
                          <div className="text-[11px] text-stone-400 font-mono mt-0.5">/{art.slug}</div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="bg-stone-100 text-stone-700 px-2.5 py-1 rounded-md text-xs font-medium">
                            {cat?.name || art.categorySlug}
                          </span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          {art.status === 'published' ? (
                            <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold">
                              प्रकाशित
                            </span>
                          ) : (
                            <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-bold">
                              ड्राफ्ट
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          {art.medicalReview?.isReviewed ? (
                            <span className="text-purple-700 font-semibold flex items-center gap-1 text-xs">
                              <Stethoscope className="w-3.5 h-3.5" />
                              {art.medicalReview.reviewerName}
                            </span>
                          ) : (
                            <span className="text-stone-400 text-xs">लंबित</span>
                          )}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-stone-600 font-medium">
                          {art.viewsCount || 0}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap text-right space-x-2">
                          {/* Preview Link */}
                          <button
                            onClick={() => navigate(`/articles/${art.slug}`)}
                            className="p-1.5 text-stone-500 hover:text-teal-700 rounded-lg hover:bg-stone-100"
                            title="लेख देखें / पूर्वावलोकन"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit Link */}
                          <button
                            onClick={() => navigate(`/admin/articles/${art.id}/edit`)}
                            className="p-1.5 text-stone-500 hover:text-teal-700 rounded-lg hover:bg-stone-100"
                            title="एडिट करें"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Publish/Unpublish toggle */}
                          <button
                            onClick={() => togglePublish(art)}
                            className={`px-2 py-1 text-xs font-bold rounded-lg border ${
                              art.status === 'published'
                                ? 'text-amber-700 border-amber-300 hover:bg-amber-50'
                                : 'text-emerald-700 border-emerald-300 hover:bg-emerald-50'
                            }`}
                          >
                            {art.status === 'published' ? 'अनपब्लिश' : 'पब्लिश'}
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(art.id, art.title)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50"
                            title="हटाएं"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredArticles.length === 0 && (
                <div className="p-8 text-center text-stone-400 text-sm">
                  कोई लेख नहीं मिला।
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
