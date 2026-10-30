/**
 * Intelligent Step-by-Step Content Formatter for Hindi Health Guide
 * 
 * Transforms raw text, pasted text, or mixed HTML into an elegant, highly readable,
 * magazine-grade step-by-step layout.
 * 
 * Features:
 * 1. Automatically detects numbered sections (1. ..., 2. ..., चरण 1: ...) and renders them as Step Cards with badges.
 * 2. Automatically detects lettered sub-points ((क), (ख), (ग) or (a), (b)) and renders them as styled sub-cards.
 * 3. Highlights key sections: प्रस्तावना (Intro), निष्कर्ष (Conclusion), डिस्क्लेमर (Disclaimer), अक्सर पूछे जाने वाले सवाल (FAQs).
 * 4. Converts bullet points (-, *, •, —) into clean bullet lists with highlighted prefixes (e.g., - एस्ट्रोजन: ...).
 * 5. Converts Q&A (प्रश्न 1: ..., उत्तर: ...) into interactive/styled FAQ cards.
 * 6. Ensures every paragraph is clean, well-spaced, and never collapsed into a giant wall of text.
 */

export function formatHindiArticleContent(rawContent: string): string {
  if (!rawContent || !rawContent.trim()) return '';

  // 1. Purge any 'गुरु' prefix from content
  const cleanRaw = rawContent
    .replace(/गुरु\s*राजेश\s*कुमार\s*साहू/g, 'राजेश कुमार साहू')
    .replace(/गुरु\s*राजेश/g, 'राजेश')
    .replace(/Guru\s*Rajesh\s*Kumar\s*Sahu/gi, 'Rajesh Kumar Sahu')
    .replace(/Guru\s*Rajesh/gi, 'Rajesh');

  // Check if content already contains well-structured HTML paragraphs (<p>...</p>)
  const paragraphCount = (cleanRaw.match(/<\/p>/gi) || []).length;
  const headingCount = (cleanRaw.match(/<\/(h2|h3|h4)>/gi) || []).length;

  // If already heavily HTML formatted with multiple <p> tags AND no large unformatted text blocks, return sanitized
  if (paragraphCount >= 6 && headingCount >= 2 && !cleanRaw.includes('\n\n')) {
    return cleanRaw;
  }

  // Split into raw lines while preserving empty lines for paragraph boundaries
  const lines = cleanRaw.split(/\r?\n/);
  const formattedBlocks: string[] = [];
  let inBulletList = false;
  let currentBulletItems: string[] = [];

  const flushBulletList = () => {
    if (inBulletList && currentBulletItems.length > 0) {
      formattedBlocks.push(
        `<ul class="my-5 space-y-3 pl-2 list-none not-prose">\n` +
        currentBulletItems.join('\n') +
        `\n</ul>`
      );
      currentBulletItems = [];
      inBulletList = false;
    }
  };

  let currentParagraphLines: string[] = [];

  const flushParagraph = () => {
    if (currentParagraphLines.length > 0) {
      const text = currentParagraphLines.join(' ').trim();
      if (text) {
        // If line contains HTML tag like <ol>, <ul>, <figure>, <img>, <blockquote>, output directly
        if (/^<(ol|ul|figure|table|blockquote|div|h1|h2|h3|h4|h5|p)[\s>]/i.test(text)) {
          formattedBlocks.push(text);
        } else {
          // Highlight strong colons (e.g. "लक्षण: ..." or "कारण: ...")
          const enrichedText = enrichInlineFormatting(text);
          formattedBlocks.push(
            `<p class="text-stone-800 leading-relaxed text-base sm:text-lg mb-5 font-normal tracking-normal">${enrichedText}</p>`
          );
        }
      }
      currentParagraphLines = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Empty line indicates paragraph boundary
    if (!line) {
      flushBulletList();
      flushParagraph();
      continue;
    }

    // Check if line is an existing HTML block tag
    if (/^<(h[1-6]|ul|ol|figure|blockquote|table|div)[\s>]/i.test(line)) {
      flushBulletList();
      flushParagraph();
      formattedBlocks.push(rawLine);
      continue;
    }

    // Pattern 1: Step / Major Numbered Section Heading (e.g. "1. हार्मोनल असंतुलन क्या है...", "चरण 1: ...", "Step 1: ...")
    const stepMatch = line.match(/^(\d+)[\.\)]\s*(.+)$/) || line.match(/^(?:चरण|Step)\s*(\d+)[:\.\-]\s*(.+)$/i);
    // Ensure it's a heading and not just a short numbered list item inside text
    // Headings are typically standalone, question/phrase ending with ?, :, or broad title phrase
    if (stepMatch) {
      const num = stepMatch[1];
      const title = stepMatch[2].trim();

      // If the line is short or ends with ? or : or is clearly a section title
      const isHeading = title.length < 120 || title.endsWith('?') || title.endsWith('।') || title.includes('क्या') || title.includes('कैसे') || title.includes('उपाय') || title.includes('लक्षण') || title.includes('कारण');

      if (isHeading && (currentParagraphLines.length === 0 || i === 0 || lines[i - 1].trim() === '')) {
        flushBulletList();
        flushParagraph();

        formattedBlocks.push(
          `<div class="my-8 pt-6 pb-3 border-b-2 border-rose-100 flex items-start gap-3.5 not-prose">
  <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-600 to-rose-700 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-md mt-0.5">
    ${num}
  </div>
  <div class="space-y-1">
    <span class="inline-block text-[11px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
      चरण ${num} (Step ${num})
    </span>
    <h2 class="text-xl sm:text-2xl font-black text-stone-900 leading-snug">
      ${enrichInlineFormatting(title)}
    </h2>
  </div>
</div>`
        );
        continue;
      }
    }

    // Pattern 2: Lettered Sub-headings / Sub-points (e.g. "(क) संतुलित आहार", "(ख) ...", "क. ...")
    const letterMatch = line.match(/^(\([क-हa-zA-Z0-9]+\))\s*(.+)$/) || line.match(/^([क-ह])[\.\)]\s*(.+)$/);
    if (letterMatch) {
      flushBulletList();
      flushParagraph();

      const badge = letterMatch[1].replace(/[()]/g, '');
      const subTitle = letterMatch[2].trim();

      formattedBlocks.push(
        `<div class="my-5 p-4 bg-gradient-to-r from-rose-50/70 via-stone-50 to-white border-l-4 border-rose-500 rounded-r-2xl shadow-xs not-prose">
  <h3 class="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2.5">
    <span class="px-2.5 py-0.5 bg-rose-600 text-white text-xs font-black rounded-lg shadow-xs">
      ${badge}
    </span>
    <span>${enrichInlineFormatting(subTitle)}</span>
  </h3>
</div>`
      );
      continue;
    }

    // Pattern 3: Major Section Keywords (प्रस्तावना:, निष्कर्ष:, डिस्क्लेमर:, अक्सर पूछे जाने वाले सवाल)
    if (/^(?:प्रस्तावना|परिचय|भूमिका)[:\.\-]\s*(.*)$/i.test(line)) {
      flushBulletList();
      flushParagraph();
      const match = line.match(/^(?:प्रस्तावना|परिचय|भूमिका)[:\.\-]\s*(.*)$/i)!;
      const rest = match[1].trim();
      formattedBlocks.push(
        `<div class="my-6 p-5 bg-gradient-to-r from-stone-100 via-rose-50/40 to-stone-50 border-l-4 border-stone-800 rounded-r-2xl not-prose">
  <div class="flex items-center gap-2 text-stone-900 font-extrabold text-lg mb-1">
    <span class="w-3 h-3 rounded-full bg-rose-600"></span>
    <h3>प्रस्तावना एवं मुख्य सार</h3>
  </div>
  ${rest ? `<p class="text-stone-700 text-sm sm:text-base leading-relaxed mt-2">${enrichInlineFormatting(rest)}</p>` : ''}
</div>`
      );
      continue;
    }

    if (/^(?:निष्कर्ष|सार संक्षेप)[:\.\-]\s*(.*)$/i.test(line)) {
      flushBulletList();
      flushParagraph();
      const match = line.match(/^(?:निष्कर्ष|सार संक्षेप)[:\.\-]\s*(.*)$/i)!;
      const rest = match[1].trim();
      formattedBlocks.push(
        `<div class="my-8 p-6 bg-gradient-to-br from-emerald-50 via-teal-50/60 to-white border border-emerald-300 rounded-3xl shadow-sm not-prose">
  <div class="flex items-center gap-2 text-emerald-950 font-black text-xl mb-2">
    <span class="text-emerald-600 text-2xl">✓</span>
    <h3>निष्कर्ष (Doctor's Key Takeaway)</h3>
  </div>
  ${rest ? `<p class="text-emerald-900 leading-relaxed text-base sm:text-lg">${enrichInlineFormatting(rest)}</p>` : ''}
</div>`
      );
      continue;
    }

    if (/^(?:डिस्क्लेमर|Disclaimer|वैधानिक चेतावनी)[:\.\-]\s*(.*)$/i.test(line)) {
      flushBulletList();
      flushParagraph();
      const match = line.match(/^(?:डिस्क्लेमर|Disclaimer|वैधानिक चेतावनी)[:\.\-]\s*(.*)$/i)!;
      const rest = match[1].trim();
      formattedBlocks.push(
        `<div class="my-6 p-4 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-start gap-3 not-prose">
  <span class="text-amber-600 font-bold text-lg mt-0.5">⚠️</span>
  <div class="text-xs sm:text-sm text-amber-900 space-y-1">
    <strong class="font-bold">डिस्क्लेमर (Medical Disclaimer):</strong>
    <p class="leading-relaxed">${enrichInlineFormatting(rest || 'यह आलेख केवल सामान्य जन-स्वास्थ्य जागरूकता एवं शैक्षणिक उद्देश्य से तैयार किया गया है। किसी भी स्वास्थ्य समस्या के निदान व उपचार हेतु हमेशा प्रमाणित चिकित्सक से परामर्श लें।')}</p>
  </div>
</div>`
      );
      continue;
    }

    // Pattern 4: FAQ Questions & Answers
    const faqQMatch = line.match(/^(?:प्रश्न|सवाल|Q|Q\d+)[:\.\s](\d+)?[:\.\s]*(.+)$/i);
    if (faqQMatch) {
      flushBulletList();
      flushParagraph();
      const qText = (faqQMatch[2] || faqQMatch[1] || '').trim();
      formattedBlocks.push(
        `<div class="mt-6 mb-2 p-4 bg-white border border-rose-200 rounded-xl shadow-xs not-prose">
  <h4 class="font-bold text-stone-900 text-base flex items-start gap-2">
    <span class="px-2 py-0.5 bg-rose-600 text-white rounded text-xs font-black shrink-0 mt-0.5">प्रश्न</span>
    <span>${enrichInlineFormatting(qText)}</span>
  </h4>
</div>`
      );
      continue;
    }

    const faqAMatch = line.match(/^(?:उत्तर|जवाब|Ans|A)[:\.\s]*(.+)$/i);
    if (faqAMatch) {
      flushBulletList();
      flushParagraph();
      const aText = faqAMatch[1].trim();
      formattedBlocks.push(
        `<div class="mb-5 pl-4 pr-3 py-3 bg-stone-50 border-l-4 border-emerald-500 rounded-r-xl not-prose">
  <div class="text-stone-800 text-sm sm:text-base leading-relaxed flex items-start gap-2">
    <span class="px-2 py-0.5 bg-emerald-600 text-white rounded text-xs font-bold shrink-0 mt-0.5">उत्तर</span>
    <p>${enrichInlineFormatting(aText)}</p>
  </div>
</div>`
      );
      continue;
    }

    // Pattern 5: Bullet Points (-, *, •, —)
    const bulletMatch = line.match(/^[\-\*•—]\s+(.+)$/);
    if (bulletMatch) {
      flushParagraph();
      inBulletList = true;
      const bContent = enrichInlineFormatting(bulletMatch[1].trim());
      currentBulletItems.push(
        `<li class="flex items-start gap-3 text-stone-800 leading-relaxed text-base sm:text-lg">
  <span class="w-2 h-2 rounded-full bg-rose-600 mt-2.5 shrink-0 shadow-xs"></span>
  <div class="flex-1">${bContent}</div>
</li>`
      );
      continue;
    }

    // Pattern 6: Numbered Sub-items within a section (e.g. "1. अनियमित माहवारी: ...", "2. अत्यधिक रक्तस्राव: ...")
    const subItemMatch = line.match(/^(\d+)[\.\)]\s*([^:।]+[:।])\s*(.*)$/);
    if (subItemMatch && subItemMatch[2].length < 60) {
      flushBulletList();
      flushParagraph();
      const num = subItemMatch[1];
      const heading = subItemMatch[2].replace(/[:।]$/, '').trim();
      const description = subItemMatch[3].trim();

      formattedBlocks.push(
        `<div class="my-3 p-3.5 bg-stone-50 hover:bg-rose-50/30 border border-stone-200/80 rounded-xl transition flex items-start gap-3 not-prose">
  <span class="w-6 h-6 rounded-full bg-stone-200 text-stone-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
    ${num}
  </span>
  <div class="text-stone-800 text-sm sm:text-base leading-relaxed">
    <strong class="font-bold text-stone-900">${heading}:</strong> ${enrichInlineFormatting(description)}
  </div>
</div>`
      );
      continue;
    }

    // Default: Regular text line
    flushBulletList();
    currentParagraphLines.push(line);
  }

  // Final flush
  flushBulletList();
  flushParagraph();

  return formattedBlocks.join('\n\n');
}

/**
 * Enriches inline formatting (bold keywords, highlighted labels before colons)
 */
function enrichInlineFormatting(text: string): string {
  if (!text) return '';

  // If text has "नाम: विवरण", bold the label prefix
  return text.replace(/^([^:]{2,30}):\s+(.+)$/, (match, prefix, rest) => {
    // Avoid double-wrapping if already has HTML tags
    if (prefix.includes('<')) return match;
    return `<strong class="font-bold text-stone-900">${prefix}:</strong> ${rest}`;
  });
}
