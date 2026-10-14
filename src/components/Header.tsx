import React, { useState } from 'react';
import {
  Search,
  Menu,
  X,
  Shield,
  PhoneCall,
  UserCheck,
  ChevronDown,
  Lock,
} from 'lucide-react';
import { SITE_CONFIG, NAVIGATION_LINKS } from '../config/site-config';
import { useRouter } from '../context/RouterContext';
import { CategoryIcon } from './CategoryIcon';
import { BrandLogo } from './BrandLogo';

export const Header: React.FC = () => {
  const { navigate, currentPath } = useRoute();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [fontSizeLevel, setFontSizeLevel] = useState<'normal' | 'large' | 'larger'>('normal');

  function useRoute() {
    return useRouter();
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const handleFontSizeChange = (level: 'normal' | 'large' | 'larger') => {
    setFontSizeLevel(level);
    const root = document.documentElement;
    if (level === 'normal') root.style.fontSize = '16px';
    if (level === 'large') root.style.fontSize = '18px';
    if (level === 'larger') root.style.fontSize = '20px';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-all shadow-xs">
      {/* Top Advisory & Accessibility Bar */}
      <div className="bg-teal-900 text-teal-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-semibold text-teal-300">
              <PhoneCall className="w-3.5 h-3.5" /> NACO राष्ट्रीय हेल्पलाइन: 1097 (निःशुल्क)
            </span>
            <span className="hidden sm:inline text-teal-400/60">|</span>
            <span className="hidden sm:inline">स्वास्थ्य हेल्पलाइन: 1800-180-1104</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Font Size Adjuster */}
            <div className="flex items-center gap-1 bg-teal-950/60 rounded px-1.5 py-0.5 border border-teal-800">
              <span className="text-[10px] text-teal-300 mr-1">फॉन्ट:</span>
              <button
                type="button"
                onClick={() => handleFontSizeChange('normal')}
                className={`px-1 rounded text-xs transition ${fontSizeLevel === 'normal' ? 'bg-teal-700 text-white font-bold' : 'hover:text-white'}`}
                title="सामान्य आकार"
              >
                अ
              </button>
              <button
                type="button"
                onClick={() => handleFontSizeChange('large')}
                className={`px-1 rounded text-xs transition ${fontSizeLevel === 'large' ? 'bg-teal-700 text-white font-bold' : 'hover:text-white'}`}
                title="बड़ा आकार"
              >
                अ+
              </button>
              <button
                type="button"
                onClick={() => handleFontSizeChange('larger')}
                className={`px-1 rounded text-xs transition ${fontSizeLevel === 'larger' ? 'bg-teal-700 text-white font-bold' : 'hover:text-white'}`}
                title="अति बड़ा आकार"
              >
                अ++
              </button>
            </div>

            <div className="hidden md:flex items-center gap-1 text-[11px] text-teal-200">
              <Lock className="w-3 h-3 text-teal-300" />
              <span>गोपनीय स्वास्थ्य परामर्श</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-22 py-2">
          {/* Logo & Brand Identity */}
          <div
            className="cursor-pointer py-1"
            onClick={() => navigate('/')}
            title="होमपेज पर जाएं"
          >
            <BrandLogo size="md" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAVIGATION_LINKS.map((item) => (
              <button
                key={item.href}
                onClick={() => {
                  if (item.href === '/#categories') {
                    if (currentPath !== '/') {
                      navigate('/');
                      setTimeout(() => {
                        document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    } else {
                      document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  } else {
                    navigate(item.href);
                  }
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentPath === item.href
                    ? 'bg-teal-50 text-teal-800 font-semibold'
                    : 'text-stone-700 hover:text-teal-800 hover:bg-stone-100'
                }`}
              >
                {item.name}
              </button>
            ))}

            {/* Categories Mega Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:text-teal-800 hover:bg-stone-100 transition"
              >
                <span>सभी श्रेणियां</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCategoryMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setIsCategoryMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-stone-100 text-xs font-bold text-stone-400 uppercase tracking-wider">
                    सातों स्वीकृत श्रेणियां
                  </div>
                  {SITE_CONFIG.categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        navigate(`/category/${cat.slug}`);
                        setIsCategoryMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2.5 flex items-start gap-3 hover:bg-teal-50/80 transition group"
                    >
                      <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700 group-hover:bg-teal-600 group-hover:text-white transition mt-0.5">
                        <CategoryIcon name={cat.iconName} className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-stone-800 group-hover:text-teal-900">
                          {cat.name}
                        </div>
                        <div className="text-xs text-stone-500 line-clamp-1">{cat.englishName}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Search Bar & Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="लेख या विषय खोजें..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-56 lg:w-64 pl-9 pr-3 py-2 text-sm bg-stone-100 border border-transparent rounded-lg focus:outline-hidden focus:bg-white focus:border-teal-600 transition"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            </form>

            <button
              onClick={() => navigate('/admin')}
              className="px-3 py-2 text-xs font-semibold text-stone-600 hover:text-teal-800 hover:bg-stone-100 rounded-lg border border-stone-200 flex items-center gap-1.5 transition"
              title="संपादकीय एडमिन पैनल"
            >
              <UserCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>एडमिन</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => navigate('/search')}
              className="p-2 text-stone-600 hover:text-teal-800 rounded-lg"
              aria-label="खोजें"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-stone-600 hover:text-teal-800 rounded-lg"
              aria-label="मेनू खोलें"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-lg animate-in fade-in duration-200">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="यौन स्वास्थ्य विषय या लेख खोजें..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-stone-100 border border-stone-200 rounded-lg focus:outline-hidden focus:bg-white focus:border-teal-600"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
          </form>

          <div className="space-y-1">
            {NAVIGATION_LINKS.map((item) => (
              <button
                key={item.href}
                onClick={() => {
                  navigate(item.href);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-base font-medium transition ${
                  currentPath === item.href
                    ? 'bg-teal-50 text-teal-900 font-semibold'
                    : 'text-stone-800 hover:bg-stone-100'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="border-t border-stone-100 pt-3">
            <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 px-3">
              सातों श्रेणियां
            </div>
            <div className="space-y-1">
              {SITE_CONFIG.categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    navigate(`/category/${cat.slug}`);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between text-stone-700 hover:bg-teal-50 hover:text-teal-900"
                >
                  <div className="flex items-center gap-2">
                    <CategoryIcon name={cat.iconName} className="w-4 h-4 text-teal-700" />
                    <span>{cat.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-stone-100 pt-3 flex justify-between items-center px-3">
            <button
              onClick={() => {
                navigate('/admin');
                setIsMobileMenuOpen(false);
              }}
              className="text-xs font-semibold text-teal-700 flex items-center gap-1.5"
            >
              <UserCheck className="w-4 h-4" /> एडमिन / संपादक लॉगिन
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
