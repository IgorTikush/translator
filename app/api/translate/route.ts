import { NextResponse } from "next/server";
import {
  TranslateRequestValidation,
  type TranslationResponse,
} from "@/types/translation";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validationResult = TranslateRequestValidation.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { text, targetLanguage, sourceLanguage } = validationResult.data;

    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "OpenRouter API key not configured" },
        { status: 500 }
      );
    }

    const prompt = `You are a language learning assistant. Translate the following text to ${targetLanguage}${
      sourceLanguage ? ` from ${sourceLanguage}` : ""
    } and provide a detailed word-by-word analysis to help the user learn.

Text to translate: "${text}"

Please respond with a JSON object in this exact format:
{
  "originalText": "the original text",
  "translatedText": "the complete translation",
  "sourceLanguage": "detected or provided source language",
  "targetLanguage": "${targetLanguage}",
  "wordAnalysis": [
    {
      "word": "original word or phrase (group multiple words if they should be translated together)",
      "translation": "translation of this word/phrase",
      "role": "grammatical role in ${targetLanguage} (e.g., noun phrase, verb phrase, adjective, etc.)",
      "explanation": "brief explanation of the phrase/word as a unit IN ${targetLanguage}",
      "subWords": [
        {
          "word": "individual word within the phrase",
          "translation": "translation of this individual word",
          "role": "grammatical role of this specific word in ${targetLanguage}",
          "explanation": "explanation of this individual word IN ${targetLanguage}"
        }
      ]
    }
  ]
}

Important:
- ALL explanations and grammatical roles must be written in ${targetLanguage}, not English
- Group words together when they form idiomatic expressions, compound nouns, phrasal verbs, or should be translated as a unit
- For single words, you can omit the "subWords" array or leave it empty
- For phrases (multiple words grouped together), ALWAYS include "subWords" array with breakdown of each word
- Each subWord should explain the individual word's meaning and role
- Provide the grammatical role for each unit and subunit in ${targetLanguage}
- Include helpful context about word usage in ${targetLanguage}
- Ensure the JSON is valid and properly formatted
- Return ONLY the JSON object, no additional text

Examples of when to group words:
- Phrasal verbs: "give up", "look after"
- Compound nouns: "ice cream", "bus stop"
- Idiomatic expressions: "piece of cake", "break a leg"
- Fixed phrases: "buenos días", "s'il vous plaît"
- Article + noun combinations in languages where they're inseparable`;

    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": request.headers.get("referer") || "",
        "X-Title": "Translation Learning App",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3.1",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 16000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenRouter API error:", errorData);
      return NextResponse.json(
        { error: "Translation service error", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "No response from translation service" },
        { status: 500 }
      );
    }

    let translationResponse: TranslationResponse;

    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : content;
      translationResponse = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Failed to parse response:", content);
      return NextResponse.json(
        { error: "Failed to parse translation response", details: content },
        { status: 500 }
      );
    }

    return NextResponse.json(translationResponse);
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
