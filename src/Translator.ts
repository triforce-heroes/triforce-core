export const supportedLanguages = [
  "ch_tw",
  "ch",
  "de",
  "en_us",
  "en",
  "es_us",
  "es",
  "fr_us",
  "fr",
  "it",
  "jp",
  "kr",
  "nl",
  "pt_br",
  "pt",
];

type SupportedLanguages = (typeof supportedLanguages)[number];

export interface TranslateResponse {
  success: boolean;
  time: number;
  data: { message: string | null };
}

export async function translate(
  hostname: string,
  sourceLanguage: SupportedLanguages,
  targetLanguage: SupportedLanguages,
  message: string,
  respectCache = true,
  forceRetry = false,
): Promise<string | null> {
  return fetch(`${hostname}/translate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      source: sourceLanguage,
      target: targetLanguage,
      message,
      ...(respectCache ? {} : { cache: false }),
      ...(forceRetry ? { retry: true } : {}),
    }),
  })
    .then(async (response) => response.json() as Promise<TranslateResponse>)
    .then((response) =>
      response.success && response.data.message !== null
        ? response.data.message
        : null,
    );
}
