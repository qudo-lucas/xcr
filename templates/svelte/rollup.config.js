import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import svelte from "rollup-plugin-svelte";
import babel from "rollup-plugin-babel";
import livereload from "rollup-plugin-livereload";
import json from "@rollup/plugin-json";
import sass from "rollup-plugin-sass";
import copy from "rollup-plugin-copy";
import injectProcessEnv from "rollup-plugin-inject-process-env";
import alias from "@rollup/plugin-alias";
import { scss as preSCSS } from "svelte-preprocess";
import replace from "@rollup/plugin-replace";

const INPUT_DIR = "src";
const OUTPUT_DIR = "build";

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
};

export default {
    // Used in state charts
    inlineDynamicImports : true,
    
    input  : `${INPUT_DIR}/main.js`,
    output : {
        format    : "iife",
        file      : `${OUTPUT_DIR}/bundle.js`,
        name      : "app",
        sourcemap : true,
    },
    plugins : [
        svelte({
            // we'll extract any component CSS out into
            // a separate file — better for performance
            dev        : !production,

            preprocess : [
                preSCSS({  }),
            ],

            css : (css) => {
                css.write(`${OUTPUT_DIR}/bundle.css`);
            },
        }),
        resolve({
            browser : true,
            dedupe  : [ "svelte" ],
        }),
        // babel({
        //     exclude        : "node_modules/**",
        //     runtimeHelpers : true,
        // }),
        commonjs(),
        copy({
            targets : [
                { src : `${INPUT_DIR}/public/**/*`, dest : OUTPUT_DIR },
                { src : `${INPUT_DIR}/index.html`, dest : OUTPUT_DIR },
            ],
        }),
        sass({
            output  : `${OUTPUT_DIR}/main.css`,
        }),
        json(),
        injectProcessEnv({
            NODE_ENV : production,
        }),
        alias({
            entries : [
                { find : "shared", replacement : `./${INPUT_DIR}/shared` },
                { find : "test", replacement : "./test" },
                { find : "views", replacement : `./${INPUT_DIR}/views` },
            ],
        }),
        replace({
            __dev__ : !production,
        }),
        !production && livereload(`${OUTPUT_DIR}`),
        !production && serve(),
    ],
};
