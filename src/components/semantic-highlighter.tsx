"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useStore } from "../hooks/use-store";

type HighlightingMode = "simple" | "pro";

interface Token {
  text: string;
  start: number;
  end: number;
  pos: string;
  tag: string;
  dep: string;
  head: string;
  shape: string;
  is_alpha: boolean;
  is_stop: boolean;
  is_punct: boolean;
  is_entity: boolean;
  entity_type: string | null;
  morphology: Record<string, string>;
  lemma: string;
}

interface ProcessedToken {
  token: string;
  start: number;
  end: number;
  labels: string[];
}

export function SemanticHighlighter() {
  const { text, setText } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [highlightedText, setHighlightedText] = useState<ProcessedToken[]>([]);
  const [mode, setMode] = useState<HighlightingMode>("simple");
  const [rawTokens, setRawTokens] = useState<Token[]>([]);

  // Transform raw tokens based on current mode
  const processTokens = useCallback((tokens: Token[], currentMode: HighlightingMode) => {
    return tokens.map((token) => {
      const labels: string[] = [];

      // In simple mode, only show basic parts of speech
      if (currentMode === "simple") {
        // Map spaCy POS tags to simple mode categories
        const simpleModeMap: Record<string, string> = {
          "NOUN": "Noun",
          "PROPN": "Noun", // Proper nouns are also nouns
          "VERB": "Verb",
          "AUX": "Verb",   // Auxiliary verbs are also verbs
          "ADJ": "Adjective",
          "ADV": "Adverb",
          "PRON": "Pronoun",
          "ADP": "Preposition",
          "CCONJ": "Conjunction",
          "SCONJ": "Conjunction",
          "INTJ": "Interjection",
          "DET": "Determiner"
        };

        const simpleLabel = simpleModeMap[token.pos];
        if (simpleLabel) {
          labels.push(simpleLabel);
        }
      } else {
        // Pro mode: show all POS tags and additional features
        if (token.pos) {
          labels.push(token.pos);
        }

        // Add semantic labels
        if (token.is_entity && token.entity_type) {
          labels.push(`NamedEntity.${token.entity_type}`);
        }

        // Add dependency information
        if (token.dep === "neg") {
          labels.push("Negation");
        }

        // Add morphological features
        if (Object.keys(token.morphology).length > 0) {
          labels.push(`Morph.${Object.entries(token.morphology).map(([k, v]) => `${k}=${v}`).join(".")}`);
        }

        // Add shape information for non-standard tokens
        if (!token.is_alpha && !token.is_punct) {
          labels.push(`Shape.${token.shape}`);
        }
      }

      return {
        token: token.text,
        start: token.start,
        end: token.end,
        labels: labels,
      };
    });
  }, []);

  // Update highlighted text when mode changes
  useEffect(() => {
    if (rawTokens.length > 0) {
      setHighlightedText(processTokens(rawTokens, mode));
    }
  }, [mode, rawTokens, processTokens]);

  const analyzeText = async () => {
    if (!text.trim()) {
      setError("Please enter some text to analyze");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to Highlight Syntax");
      }

      const data = await response.json();
      setRawTokens(data.tokens);
      setHighlightedText(processTokens(data.tokens, mode));
    } catch (error) {
      console.error("Error analyzing text:", error);
      setError("Failed to Highlight Syntax. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getTokenStyle = (labels: string[]) => {
    const labelStyleMap: Record<string, string> = {
      // Simple Mode Categories
      "Noun": "text-emerald-700 dark:text-emerald-400",
      "Verb": "text-violet-700 dark:text-violet-400 italic",
      "Adjective": "text-red-700 dark:text-red-400",
      "Adverb": "text-amber-700 dark:text-amber-400 italic",
      "Pronoun": "text-sky-700 dark:text-sky-400",
      "Preposition": "text-orange-700 dark:text-orange-400",
      "Conjunction": "text-yellow-700 dark:text-yellow-400",
      "Interjection": "text-green-700 dark:text-green-400",
      "Determiner": "text-lime-700 dark:text-lime-400",

      // Pro Mode Categories
      "NOUN": "text-emerald-700 dark:text-emerald-400",
      "PROPN": "text-emerald-700 dark:text-emerald-400 underline decoration-emerald-400",
      "VERB": "text-violet-700 dark:text-violet-400 italic",
      "AUX": "text-violet-700 dark:text-violet-400 italic",
      "PART": "text-cyan-700 dark:text-cyan-400",
      "DET": "text-lime-700 dark:text-lime-400",
      "PRON": "text-sky-700 dark:text-sky-400",
      "ADP": "text-orange-700 dark:text-orange-400",
      "ADV": "text-amber-700 dark:text-amber-400 italic",
      "CCONJ": "text-yellow-700 dark:text-yellow-400",
      "SCONJ": "text-yellow-700 dark:text-yellow-400",
      "ADJ": "text-red-700 dark:text-red-400",
      "NUM": "text-teal-700 dark:text-teal-400",
      "INTJ": "text-green-700 dark:text-green-400",
      "PUNCT": "text-zinc-600 dark:text-zinc-400",
      "SYM": "text-indigo-700 dark:text-indigo-400",
      "X": "text-neutral-700 dark:text-neutral-400",

      // Semantic Categories
      "NamedEntity": "text-orange-700 dark:text-orange-400 underline decoration-orange-400",
      "Negation": "text-red-700 dark:text-red-400 font-bold",
      "Morph": "text-purple-700 dark:text-purple-400",
      "Shape": "text-pink-700 dark:text-pink-400",
    };

    // Ensure we pick the most specific style if multiple labels apply
    return labels
      .map((label) => {
        // Handle semantic categories first
        if (label.startsWith("NamedEntity")) return labelStyleMap["NamedEntity"];
        if (label === "Negation") return labelStyleMap["Negation"];
        if (label.startsWith("Morph")) return labelStyleMap["Morph"];
        if (label.startsWith("Shape")) return labelStyleMap["Shape"];

        // Then handle POS tags
        return labelStyleMap[label] || "";
      })
      .filter(Boolean) // Remove empty strings
      .join(" ");
  };

  const formatLabel = (label: string) => {
    // For simple mode, just return the label as is
    if (mode === "simple") {
      return label;
    }

    // For pro mode, show only POS tags and their basic names
    return label
      .replace("NOUN", "Noun")
      .replace("PROPN", "Proper Noun")
      .replace("VERB", "Verb")
      .replace("AUX", "Auxiliary Verb")
      .replace("PART", "Participle")
      .replace("DET", "Article")
      .replace("PRON", "Pronoun")
      .replace("ADP", "Preposition")
      .replace("ADV", "Adverb")
      .replace("CCONJ", "Coordinating Conjunction")
      .replace("SCONJ", "Subordinating Conjunction")
      .replace("ADJ", "Adjective")
      .replace("NUM", "Number")
      .replace("INTJ", "Interjection")
      .replace("PUNCT", "Punctuation")
      .replace("SYM", "Symbol")
      .replace("X", "Unknown");
  };

  const uniqueCategories = useMemo(() => {
    if (highlightedText.length === 0) return [];
    const categories = new Set<string>();
    highlightedText.forEach((token: ProcessedToken) => {
      token.labels.forEach((label: string) => {
        // In simple mode, only add the basic categories
        if (mode === "simple") {
          categories.add(label);
        } else {
          // In pro mode, only add POS tags
          if (!label.startsWith("NamedEntity") &&
            !label.startsWith("Morph") &&
            !label.startsWith("Shape") &&
            label !== "Negation") {
            categories.add(label);
          }
        }
      });
    });
    return Array.from(categories);
  }, [highlightedText, mode]);

  return (
    <div className="container mx-auto px-4 max-w-5xl">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="text-input"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Enter text to syntax highlight
              </label>
              <textarea
                id="text-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
                placeholder="Type or paste your text here..."
                aria-label="Text to analyze"
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={analyzeText}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600"
                aria-label={isLoading ? "Highlighting text..." : "Highlight Syntax"}
              >
                {isLoading ? "Highlighting..." : "Highlight Syntax"}
              </button>

              <div className="flex space-x-2 p-1 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                {(['simple', 'pro'] as HighlightingMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${mode === m
                      ? 'bg-blue-500 text-white shadow'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    aria-pressed={mode === m}
                    aria-label={`Select ${m} highlighting mode`}
                  >
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </button>
                ))}
              </div>

              {error && (
                <p className="text-red-600 dark:text-red-400 text-sm" role="alert">
                  {error}
                </p>
              )}
            </div>

            {highlightedText.length > 0 && (
              <section aria-live="polite" aria-atomic="true" role="region">
                <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-sm">
                  <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    Highlighted Text
                  </h2>
                  <div
                    className="prose prose-gray dark:prose-invert max-w-none leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap text-base"
                    role="region"
                    aria-label="Analyzed text with semantic highlighting"
                  >
                    {highlightedText.map((token, index) => {
                      const currentToken = token;
                      const nextToken = highlightedText[index + 1];
                      const shouldAddSpace = nextToken && currentToken.end < nextToken.start;
                      return (
                        <span key={index}>
                          <span
                            className={`${getTokenStyle(currentToken.labels)}`}
                            title={
                              currentToken.labels.length
                                ? currentToken.labels.map(formatLabel).join("\n")
                                : currentToken.token
                            }
                            aria-label={`${currentToken.token} (${currentToken.labels.join(", ")})`}
                            role="tooltip"
                            tabIndex={0}
                          >
                            {currentToken.token}
                          </span>
                          {shouldAddSpace && " "}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Sticky Legend */}
        {highlightedText.length > 0 && (
          <div className="lg:w-56 flex-shrink-0">
            <div className="lg:sticky lg:top-1/2 lg:-translate-y-1/2">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Parts of Speech
                  </h3>
                </div>
                <div className="p-3 max-h-[calc(100vh-8rem)] overflow-y-auto">
                  <div className="space-y-2">
                    {uniqueCategories.map((category, idx) => (
                      <div key={idx} className="flex items-center gap-2 group">
                        <div className={`w-2.5 h-2.5 rounded-full ${getTokenStyle([category])} bg-opacity-20`} />
                        <span className={`text-sm ${getTokenStyle([category])}`}>
                          {formatLabel(category)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}