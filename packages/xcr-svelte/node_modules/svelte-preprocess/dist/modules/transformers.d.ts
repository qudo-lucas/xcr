import { Transformer, TransformerArgs, TransformerOptions } from '../types';
export declare const runTransformer: (name: string, options: TransformerOptions, { content, map, filename, attributes }: TransformerArgs<any>) => Promise<ReturnType<Transformer<unknown>>>;
