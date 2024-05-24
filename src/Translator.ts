export const supportedLanguages = [
  "zh",
  "de",
  "en",
  "es",
  "fr",
  "it",
  "ja",
  "kr",
  "nl",
  "pt",
];

type SupportedLanguages = (typeof supportedLanguages)[number];

export interface TranslateResponse {
  translatedText: string;
}

export async function translate(
  hostname: string,
  sourceLanguage: SupportedLanguages,
  targetLanguage: SupportedLanguages,
  message: string,
): Promise<string | null> {
  return fetch(`${hostname}/translate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      source: sourceLanguage,
      target: targetLanguage,
      q: message,
    }),
  })
    .then(async (response) => response.json() as Promise<TranslateResponse>)
    .then((response) => response.translatedText);
}
