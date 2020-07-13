import { PreprocessorGroup, TransformerOptions, Options } from './types';
interface Transformers {
    typescript?: TransformerOptions<Options.Typescript>;
    scss?: TransformerOptions<Options.Sass>;
    sass?: TransformerOptions<Options.Sass>;
    less?: TransformerOptions<Options.Less>;
    stylus?: TransformerOptions<Options.Stylus>;
    postcss?: TransformerOptions<Options.Postcss>;
    coffeescript?: TransformerOptions<Options.Coffeescript>;
    pug?: TransformerOptions<Options.Pug>;
    globalStyle?: Options.GlobalStyle;
    replace?: Options.Replace;
    [languageName: string]: TransformerOptions;
}
declare type AutoPreprocessOptions = {
    /** @deprecated for svelte v3 use instead a array of processors */
    onBefore?: ({ content, filename, }: {
        content: string;
        filename: string;
    }) => Promise<string> | string;
    markupTagName?: string;
    /** @deprecated add transformer config directly to svelte-preprocess options object */
    transformers?: Transformers;
    aliases?: Array<[string, string]>;
    preserve?: string[];
    typescript?: TransformerOptions<Options.Typescript>;
    scss?: TransformerOptions<Options.Sass>;
    sass?: TransformerOptions<Options.Sass>;
    less?: TransformerOptions<Options.Less>;
    stylus?: TransformerOptions<Options.Stylus>;
    postcss?: TransformerOptions<Options.Postcss>;
    babel?: TransformerOptions<Options.Babel>;
    coffeescript?: TransformerOptions<Options.Coffeescript>;
    pug?: TransformerOptions<Options.Pug>;
    globalStyle?: Options.GlobalStyle;
    [languageName: string]: string | Promise<string> | Array<[string, string]> | string[] | TransformerOptions;
};
export declare function autoPreprocess({ onBefore, aliases, markupTagName, preserve, ...rest }?: AutoPreprocessOptions): PreprocessorGroup;
export {};
