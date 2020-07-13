import { PreprocessorArgs } from '../types';
export declare const ALIAS_MAP: Map<string, string>;
export declare const addLanguageAlias: (entries: Array<[string, string]>) => void;
export declare const getLanguage: (attributes: PreprocessorArgs['attributes'], defaultLang: string) => {
    lang: string;
    alias: string;
};
