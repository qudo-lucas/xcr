const watch = require("node-watch");
const build = require("./plugin-build-docs.js");

const production = process.env.NODE_ENV !== "development";

const config = {
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
};

if(production) {
    

    return;
}

require("child_process").spawn("npm", [ "run", "serve", "--", "--dev", "--port 5000" ], {
    stdio : [ "ignore", "inherit", "inherit" ],
    shell : true,
});

watch('src', { recursive: true }, () => build(config));
