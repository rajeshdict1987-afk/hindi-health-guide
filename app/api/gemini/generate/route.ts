import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { ENV } from "@/src/config/env";

export async function POST(req: NextRequest) {
  try {
    const apiKey = ENV.getGeminiApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API Key is not configured on the server." },
        { status: 503 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const { prompt, history, model } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

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
      return NextResponse.json({ text: response.text });
    } else {
      const response = await ai.models.generateContent({
        model: selectedModel,
        contents: prompt,
        config: {
          systemInstruction,
        },
      });

      return NextResponse.json({ text: response.text });
    }
  } catch (error: any) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate AI response" },
      { status: 500 }
    );
  }
}

