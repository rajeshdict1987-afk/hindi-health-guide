'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FileEdit, Save, ArrowLeft, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export default function NewNotePage() {
  const [noteTitle, setNoteTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle && !noteBody) return;

    try {
      const existing = JSON.parse(localStorage.getItem('hhg_health_notes') || '[]');
      existing.unshift({
        id: Date.now().toString(),
        title: noteTitle || 'स्वास्थ्य नोट',
        body: noteBody,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('hhg_health_notes', JSON.stringify(existing));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {}
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
      <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-stone-900">नया व्यक्तिगत स्वास्थ्य नोट (Health Note)</h1>
              <p className="text-xs text-stone-500">PWA नोट-टेकिंग: आपके व्यक्तिगत स्वास्थ्य प्रश्न व लक्षण केवल आपके डिवाइस पर सुरक्षित</p>
            </div>
          </div>
          <Link
            href="/"
            className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>होम</span>
          </Link>
        </div>

        {saved && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-2 text-sm font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>आपका स्वास्थ्य नोट सुरक्षित रूप से सहेज लिया गया है!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">नोट का शीर्षक (Note Title)</label>
            <input
              type="text"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="उदा. डॉक्टर से पूछने योग्य सवाल / लक्षण"
              className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">स्वास्थ्य विवरण / सवाल (Details)</label>
            <textarea
              rows={6}
              value={noteBody}
              onChange={(e) => setNoteBody(e.target.value)}
              placeholder="अपने लक्षण, तारीख, या डॉक्टर के लिए सवाल यहाँ लिखें..."
              className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-3 text-xs text-emerald-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>गोपनीयता सुरक्षा: यह नोट केवल आपके व्यक्तिगत ब्राउज़र में रहता है और किसी सर्वर पर नहीं भेजा जाता।</span>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition shadow text-sm"
            >
              <Save className="w-4 h-4" />
              <span>नोट सहेजें (Save Note)</span>
            </button>
            <Link
              href="/"
              className="px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold text-sm transition text-center"
            >
              रद्द करें
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
