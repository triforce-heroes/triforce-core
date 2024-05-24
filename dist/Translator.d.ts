export declare const supportedLanguages: string[];
type SupportedLanguages = (typeof supportedLanguages)[number];
export interface TranslateResponse {
    translatedText: string;
}
export declare function translate(hostname: string, sourceLanguage: SupportedLanguages, targetLanguage: SupportedLanguages, message: string): Promise<string | null>;
export {};
