import React, { useState } from 'react';
import { Image, Upload, Copy, Check, Trash2, ArrowLeft } from 'lucide-react';
import { adminAuth } from '../../services/firebase';
import { useRouter } from '../../context/RouterContext';
import { SEOHead } from '../../components/SEOHead';

interface MediaItem {
  id: string;
  url: string;
  name: string;
  alt: string;
  uploadedAt: string;
}

const INITIAL_MEDIA: MediaItem[] = [
  {
    id: 'm1',
    url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    name: 'adolescence-health.jpg',
    alt: 'किशोरावस्था शारीरिक बदलाव',
    uploadedAt: '2026-08-10',
  },
  {
    id: 'm2',
    url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
    name: 'menstrual-health.jpg',
    alt: 'मासिक धर्म चक्र और स्वास्थ्य',
    uploadedAt: '2026-08-14',
  },
  {
    id: 'm3',
    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    name: 'condom-safe-sex.jpg',
    alt: 'सुरक्षित संबंध और कंडोम दिशानिर्देश',
    uploadedAt: '2026-08-30',
  },
  {
    id: 'm4',
    url: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&w=1200&q=80',
    name: 'hpv-vaccine.jpg',
    alt: 'एचपीवी वैक्सीन और कैंसर सुरक्षा',
    uploadedAt: '2026-09-01',
  },
];

export const AdminMediaPage: React.FC = () => {
  const { navigate } = useRouter();
  const authState = adminAuth.getState();

  if (!authState.isAuthenticated) {
    navigate('/admin/login');
    return null;
  }

  const [mediaList, setMediaList] = useState<MediaItem[]>(INITIAL_MEDIA);
  const [newUrl, setNewUrl] = useState('');
  const [newAlt, setNewAlt] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUrl.trim()) {
      const item: MediaItem = {
        id: `media-${Date.now()}`,
        url: newUrl.trim(),
        name: `image-${Date.now()}.jpg`,
        alt: newAlt.trim() || 'स्वास्थ्य शिक्षा छवि',
        uploadedAt: new Date().toISOString().split('T')[0],
      };
      setMediaList([item, ...mediaList]);
      setNewUrl('');
      setNewAlt('');
    }
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteMedia = (id: string) => {
    setMediaList(mediaList.filter((m) => m.id !== id));
  };

  return (
    <>
      <SEOHead title="मीडिया गैलरी" description="स्वास्थ्य लेखों की छवियां प्रबंधित करें।" />

      <div className="bg-stone-100 min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate('/admin')}
              className="text-stone-600 hover:text-stone-900 font-bold text-xs sm:text-sm flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-xl border border-stone-200"
            >
              <ArrowLeft className="w-4 h-4" /> डैशबोर्ड पर वापस जाएं
            </button>
            <h1 className="text-xl font-bold text-stone-900">सुरक्षित मीडिया प्रबंधन</h1>
          </div>

          {/* Add Media Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs mb-8">
            <h2 className="text-base font-bold text-stone-900 mb-3 flex items-center gap-2">
              <Upload className="w-4 h-4 text-teal-700" />
              <span>नई छवि URL या एसेट जोड़ें</span>
            </h2>
            <form onSubmit={handleAddMedia} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-6">
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono"
                />
              </div>
              <div className="sm:col-span-4">
                <input
                  type="text"
                  placeholder="Alt Text (छवि विवरण)"
                  value={newAlt}
                  onChange={(e) => setNewAlt(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-2.5 rounded-xl transition text-xs"
                >
                  जोड़ें
                </button>
              </div>
            </form>
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mediaList.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-xs group"
              >
                <div className="h-44 bg-stone-100 overflow-hidden relative">
                  <img src={item.url} alt={item.alt} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-xs font-bold text-stone-900 truncate">{item.alt}</p>
                  <p className="text-[11px] text-stone-400 font-mono truncate">{item.name}</p>
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <button
                      onClick={() => copyUrl(item.url, item.id)}
                      className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" /> कॉपी हुआ!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> URL कॉपी
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => deleteMedia(item.id)}
                      className="text-stone-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
