import ts from 'typescript';
import { Transformer, Options } from '../types';
declare type CompilerOptions = Options.Typescript['compilerOptions'];
export declare function compileFileFromMemory(compilerOptions: CompilerOptions, { filename, content }: {
    filename: string;
    content: string;
}): {
    code: string;
    map: undefined;
    diagnostics: ts.Diagnostic[];
};
declare const transformer: Transformer<Options.Typescript>;
export default transformer;
