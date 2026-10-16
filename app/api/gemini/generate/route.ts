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

    const systemInstruction = "आप 'हिंदी हेल्थ गाइड' के आधिकारिक एआई स्वास्थ्य सहायक (AI Health Assistant) हैं। आप उपयोगकर्ताओं को यौन स्वास्थ्य, प्रजनन स्वास्थ्य, एचआईवी/एड्स जागरूकता, और सामान्य कल्याण के संबंध में डब्ल्यूएचओ (WHO) और एनएसीओ (NACO) के मानकों के अनुरूप वैज्ञानिक, सटीक और संवेदनशील जानकारी हिंदी भाषा में प्रदान करते हैं। हमेशा चिकित्सा अस्वीकरण (Medical Disclaimer) शामिल करें कि यह पेशेवर चिकित्सा सलाह का विकल्प नहीं है।";

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
