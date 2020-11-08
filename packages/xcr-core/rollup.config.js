import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import livereload from "rollup-plugin-livereload";
import svelte from "rollup-plugin-svelte";
import injectProcessEnv from "rollup-plugin-inject-process-env";


const DEV_INPUT_DIR = "dev-env";
const DEV_OUTPUT_DIR = "dev-build";
const INPUT_DIR = "src";
const OUTPUT_DIR = "build";
const pkg = require("./package.json");

const production = !process.env.ROLLUP_WATCH;

const serve = () => {
    let started = false;

    return {
        writeBundle() {
            if(!started) {
                started = true;
                require("child_process").spawn("npm", [ "run", "serve", "--", "--dev" ], {
                    stdio : [ "ignore", "inherit", "inherit" ],
                    shell : true,
                });
            }
        },
    };
}

const config = [
    {
        input  : `${INPUT_DIR}/index.js`,
        output : [
            {
                file   : pkg.module,
                format : "es",
            },
            {
                file   : pkg.main,
                format : "cjs",
                name   : "XCR",
            },
        ],
        plugins : [
            resolve({
                browser : false,
            }),
            commonjs(),
            terser(),
        ],
    },

    // Build the dummy project for development
    !production && {
        inlineDynamicImports : true,

        input  : `${DEV_INPUT_DIR}/main.js`,

        output : [
            {
                file   : `${DEV_OUTPUT_DIR}/bundle.js`,
                format    : "iife",
                name      : "app",
                sourcemap : true,
            },
        ],

        plugins : [
            svelte({
                dev        : !production,
            }),
            resolve({
                browser : true,
                dedupe  : [ "svelte" ],
            }),
            commonjs(),
            terser(),
            serve(),
            livereload(`${OUTPUT_DIR}`),
            injectProcessEnv(),
        ],
    },
];

export default config;
