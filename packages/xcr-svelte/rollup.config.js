import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import svelte from "rollup-plugin-svelte";
import { terser } from "rollup-plugin-terser";

const INPUT_DIR = "src";
const pkg = require("./package.json");
const components = !process.env.COMPONENTS;

const config = [
    {
        input  : `${INPUT_DIR}/index.js`,
        output : {
            file   : pkg.module,
            format : "es",
        },
        plugins : [
            svelte({
                format : "esm",
            }),
            resolve({
                browser : false,
            }),
            commonjs(),
            terser(),
        ],
    },
    {
        input  : `${INPUT_DIR}/index.js`,
        output :  {
            file   : pkg.main,
            format : "cjs",
            name   : "XCR",
        },
        plugins : [
            svelte({
                format : "cjs",
            }),
            resolve({
                browser : false,
            }),
            commonjs(),
            terser(),
        ],
    }
];

export default config;
