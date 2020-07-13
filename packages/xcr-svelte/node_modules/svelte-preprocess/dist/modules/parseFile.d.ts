import { PreprocessorArgs } from '../types';
export declare const resolveSrc: (importerFile: string, srcPath: string) => string;
export declare const getSrcContent: (file: string) => Promise<string>;
export declare const parseFile: ({ attributes, filename, content }: PreprocessorArgs, language: string) => Promise<{
    filename: string;
    attributes: Record<string, string | boolean>;
    content: string;
    lang: string;
    alias: string;
    dependencies: string[];
}>;
