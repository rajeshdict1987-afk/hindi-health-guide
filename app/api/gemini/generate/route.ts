import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { ENV } from "@/src/config/env";
import { generateWhoNacoResponse } from "@/src/lib/whoNacoAssistant";

export async function POST(req: NextRequest) {
  let prompt = "";
  let history: any = null;
  let model = "gemini-3.8-flash";

  try {
    const body = await req.json();
    prompt = body.prompt;
    history = body.history;
    model = body.model || "gemini-3.8-flash";
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  const apiKey = ENV.getGeminiApiKey();

  // If Gemini API Key is not configured on Vercel/server, seamlessly activate WHO & NACO Intelligent Offline Fallback
  if (!apiKey) {
    const fallbackText = generateWhoNacoResponse(prompt);
    return NextResponse.json({
      text: fallbackText,
      mode: "who-naco-offline-fallback",
      disclaimer: "डब्ल्यूएचओ (WHO) एवं एनएसीओ (NACO) राष्ट्रीय स्वास्थ्य मानकों पर आधारित प्रमाणित मार्गदर्शन।"
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const systemInstruction = 
      "आप 'हिंदी हेल्थ गाइड' के आधिकारिक एआई स्वास्थ्य सहायक (AI Health Assistant) हैं।\n" +
      "सख्त निर्देश:\n" +
      "1. उपयोगकर्ता द्वारा पूछे गए विशिष्ट प्रश्न का सीधा, प्रासंगिक और संक्षिप्त उत्तर केवल सरल, प्रमाणिक हिंदी (Devanagari) में दें।\n" +
      "2. कोई भी अनावश्यक या असंबंधित सामान्य भाषण, लंबी भूमिका या भटकाव न लिखें। केवल पूछे गए प्रश्न का स्पष्ट, वैज्ञानिक और बिंदुवार (bullet points) समाधान दें।\n" +
      "3. सभी तथ्य डब्ल्यूएचओ (WHO) और एनएसीओ (NACO) के क्लिनिकल मानकों के अनुरूप होने चाहिए।\n" +
      "4. उत्तर के अंत में केवल एक छोटी पंक्ति का चिकित्सा अस्वीकरण शामिल करें: '⚠️ अस्वीकरण: यह जानकारी केवल शैक्षिक उद्देश्य के लिए है; व्यक्तिगत सलाह हेतु डॉक्टर से परामर्श लें।'\n";

    const selectedModel = model || "gemini-3.8-flash";

    if (history && Array.isArray(history) && history.length > 0) {
      const formattedHistory = history.map((msg: { role: string; text: string }) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      const chat = ai.chats.create({
        model: selectedModel,
        history: formattedHistory,
        config: {
          systemInstruction,
        }
      });

      const response = await chat.sendMessage({ message: prompt });
      return NextResponse.json({ text: response.text, mode: "gemini" });
    } else {
      const response = await ai.models.generateContent({
        model: selectedModel,
        contents: prompt,
        config: {
          systemInstruction,
        },
      });

      return NextResponse.json({ text: response.text, mode: "gemini" });
    }
  } catch (error: any) {
    console.warn("Gemini API error, falling back to WHO & NACO Guidelines Engine:", error?.message || error);
    // Intelligent graceful degradation: never show an error to user
    const fallbackText = generateWhoNacoResponse(prompt);
    return NextResponse.json({
      text: fallbackText,
      mode: "who-naco-offline-fallback",
      disclaimer: "डब्ल्यूएचओ (WHO) एवं एनएसीओ (NACO) राष्ट्रीय स्वास्थ्य मानकों पर आधारित प्रमाणित मार्गदर्शन।"
    });
  }
}
