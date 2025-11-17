"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TranslationResponse, WordAnalysis } from "@/types/translation";
import { Languages, Loader2 } from "lucide-react";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "nl", name: "Dutch" },
  { code: "pl", name: "Polish" },
  { code: "tr", name: "Turkish" },
];

const ROLE_COLORS: Record<string, string> = {
  noun: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  verb: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  adjective:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  adverb:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  pronoun: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  preposition:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  conjunction:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  article: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
};

function getRoleColor(role: string): string {
  const lowerRole = role.toLowerCase();
  for (const [key, color] of Object.entries(ROLE_COLORS)) {
    if (lowerRole.includes(key)) {
      return color;
    }
  }
  return ROLE_COLORS.default;
}

type WordAnalysisCardProps = {
  analysis: WordAnalysis;
};

function WordAnalysisCard({ analysis }: WordAnalysisCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold">
              {analysis.word}
            </CardTitle>
            <CardDescription className="text-base font-medium text-foreground mt-1">
              {analysis.translation}
            </CardDescription>
          </div>
          <span
            className={`${getRoleColor(
              analysis.role
            )} px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap`}
          >
            {analysis.role}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{analysis.explanation}</p>

        {analysis.subWords && analysis.subWords.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <h4 className="text-xs font-semibold text-muted-foreground mb-3">
              Word breakdown:
            </h4>
            <div className="space-y-3">
              {analysis.subWords.map((subWord, index) => (
                <div key={index} className="bg-muted/50 p-3 rounded-md">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm">
                      {subWord.word}
                    </span>
                    <span
                      className={`${getRoleColor(
                        subWord.role
                      )} px-2 py-0.5 rounded text-xs`}
                    >
                      {subWord.role}
                    </span>
                  </div>
                  <p className="text-sm font-medium mb-1">
                    {subWord.translation}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {subWord.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function Translator() {
  const [inputText, setInputText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("es");
  const [sourceLanguage, setSourceLanguage] = useState("");
  const [translation, setTranslation] = useState<TranslationResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setError("Please enter some text to translate");
      return;
    }

    setIsLoading(true);
    setError(null);
    setShowTranslation(false);

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText,
          targetLanguage,
          sourceLanguage: sourceLanguage || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Translation failed");
      }

      setTranslation(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl overflow-visible">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Languages className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Learn by Translation</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Translate text and understand every word with detailed grammatical
          analysis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 overflow-visible">
        <Card>
          <CardHeader>
            <CardTitle>Input Text</CardTitle>
            <CardDescription>
              Enter the text you want to translate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="source-lang">Source Language (optional)</Label>
              <Select
                value={sourceLanguage || undefined}
                onValueChange={(value) => setSourceLanguage(value)}
              >
                <SelectTrigger id="source-lang">
                  <SelectValue placeholder="Auto-detect" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="input-text">Text</Label>
              <Textarea
                id="input-text"
                placeholder="Paste or type your text here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[200px] resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target-lang">Target Language</Label>
              <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger id="target-lang">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleTranslate}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Translating...
                </>
              ) : (
                <>
                  <Languages className="mr-2 h-4 w-4" />
                  Translate & Analyze
                </>
              )}
            </Button>

            {error && (
              <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-visible">
          <CardHeader>
            <CardTitle>Translation</CardTitle>
            <CardDescription>
              {translation
                ? `From ${translation.sourceLanguage} to ${translation.targetLanguage}`
                : "Your translation will appear here"}
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-visible">
            {translation ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2 text-muted-foreground">
                    Original Text (hover over words for meaning)
                  </h3>
                  <div className="p-4 bg-muted rounded-lg overflow-visible">
                    <p className="text-lg leading-relaxed flex flex-wrap gap-x-2 gap-y-1">
                      {translation.wordAnalysis.map((analysis, index) => (
                        <span
                          key={index}
                          className="relative group cursor-help inline-block"
                        >
                          <span className="border-b-2 border-dotted border-primary/50 hover:border-primary transition-colors">
                            {analysis.word}
                          </span>
                          <span className="invisible group-hover:visible absolute left-1/2 -translate-x-1/2 top-full mt-2 w-80 max-w-[90vw] max-h-[70vh] overflow-y-auto p-3 bg-popover text-popover-foreground text-sm rounded-lg shadow-xl border z-50 pointer-events-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/50 hover:visible">
                            <span className="font-semibold block mb-1">
                              {analysis.translation}
                            </span>
                            <span
                              className={`${getRoleColor(
                                analysis.role
                              )} px-2 py-0.5 rounded text-xs inline-block mb-1`}
                            >
                              {analysis.role}
                            </span>
                            <span className="block text-xs text-muted-foreground mt-1">
                              {analysis.explanation}
                            </span>

                            {analysis.subWords &&
                              analysis.subWords.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-border">
                                  <span className="text-xs font-semibold block mb-2 text-muted-foreground">
                                    Word breakdown:
                                  </span>
                                  <div className="space-y-2">
                                    {analysis.subWords.map(
                                      (subWord, subIndex) => (
                                        <div
                                          key={subIndex}
                                          className="bg-muted/50 p-2 rounded"
                                        >
                                          <div className="flex items-center justify-between mb-1">
                                            <span className="font-semibold text-xs">
                                              {subWord.word}
                                            </span>
                                            <span
                                              className={`${getRoleColor(
                                                subWord.role
                                              )} px-1.5 py-0.5 rounded text-[10px]`}
                                            >
                                              {subWord.role}
                                            </span>
                                          </div>
                                          <span className="block text-xs font-medium">
                                            {subWord.translation}
                                          </span>
                                          <span className="block text-[10px] text-muted-foreground mt-0.5">
                                            {subWord.explanation}
                                          </span>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}

                            <span className="absolute left-1/2 -translate-x-1/2 bottom-full w-0 h-0 border-l-[6px] border-r-[6px] border-b-[6px] border-l-transparent border-r-transparent border-b-popover drop-shadow-sm"></span>
                          </span>
                        </span>
                      ))}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <Button
                    onClick={() => setShowTranslation(!showTranslation)}
                    variant={showTranslation ? "secondary" : "default"}
                    className="w-full"
                  >
                    {showTranslation
                      ? "Hide Translation"
                      : "Reveal Translation"}
                  </Button>

                  {showTranslation && (
                    <div className="w-full p-4 bg-primary/5 rounded-lg border-2 border-primary/20 animate-in fade-in slide-in-from-top-2 duration-300">
                      <h3 className="text-sm font-medium mb-2 text-muted-foreground">
                        Full Translation
                      </h3>
                      <p className="text-lg leading-relaxed font-medium">
                        {translation.translatedText}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                <p>Enter text and click translate to see results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {translation && translation.wordAnalysis.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Word-by-Word Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {translation.wordAnalysis.map((analysis, index) => (
              <WordAnalysisCard key={index} analysis={analysis} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
