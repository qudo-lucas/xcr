import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import scss from "rollup-plugin-scss";

const buildDocs = require("./plugin-build-docs.js");

const production = !process.env.ROLLUP_WATCH;

// Plugin serve
function serve() {
	let started = false;

	return {
		writeBundle() {
			if (!started) {
				started = true;

				require('child_process').spawn('npm', [ "run", "serve", "--", "--dev", "--port 5000" ], {
					stdio: ['ignore', 'inherit', 'inherit'],
					shell: true
				});
			}
		}
	};
}

// Plugin build
const docs = (config) => ({
    writeBundle : () => buildDocs(config)
});

const config = {

    input : "src/main.js",
    output : {
        file    : "build/js/bundle.js",
        format : "iife", 
    },

    plugins : [
        docs({
            template : "src/index.html",
            sections : [
                {
                    title : "Documentation",
                    src   : "src/sections/documentation" 
                },
                {
                    title : "Guides",
                    src   : "src/sections/guides" 
                },
            ]
        }),

        resolve({
			browser : true,
			dedupe  : ['svelte']
		}),
        commonjs(),

        scss({
            output : "build/main.css",
        }),

        !production && livereload('build'),

        !production && serve(),

        production && terser()
    ]
}
export default config;