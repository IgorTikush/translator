import { z } from "zod"

export const TranslateRequestValidation = z.object({
  text: z.string().min(1, "Text is required").max(5000, "Text is too long"),
  targetLanguage: z.string().min(2, "Target language is required"),
  sourceLanguage: z.string().optional(),
})

export type TranslateRequest = z.infer<typeof TranslateRequestValidation>

export type SubWord = {
  word: string
  translation: string
  role: string
  explanation: string
}

export type WordAnalysis = {
  word: string
  translation: string
  role: string
  explanation: string
  subWords?: SubWord[]
}

export type TranslationResponse = {
  originalText: string
  translatedText: string
  wordAnalysis: WordAnalysis[]
  sourceLanguage: string
  targetLanguage: string
}

