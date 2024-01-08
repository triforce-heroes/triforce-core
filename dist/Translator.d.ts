export declare const supportedLanguages: string[];
type SupportedLanguages = (typeof supportedLanguages)[number];
export interface TranslateResponse {
    success: boolean;
    time: number;
    data: {
        message: string | null;
    };
}
export declare function translate(hostname: string, sourceLanguage: SupportedLanguages, targetLanguage: SupportedLanguages, message: string, respectCache?: boolean, forceRetry?: boolean): Promise<string | null>;
export {};
