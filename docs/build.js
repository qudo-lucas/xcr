const fs = require("fs-extra");
const md = require("markdown-it")();

const read = (file) => new Promise((resolve, reject) => {
    fs.readFile(`${__dirname}/src/${file}`, (err, data) => {
        if(err) {
            reject(err);
        }
        
        resolve(data.toString());
    });
});

const readChapters = new Promise((resolve, reject) => {
    fs.readdir(`${__dirname}/src/chapters`, (err, chapters) => {
        if(err) {
            reject();
        }

        resolve(chapters);
    });
});

// Finds all occurrences of an html tag and it's content
const tag = (t, html) => html.match(new RegExp(`\<${t}\>(.+?)\<\/${t}\>`, "gi"));

(async () => {
    const chapters = await readChapters;
    const files = await Promise.all(chapters.map((file) => read(`chapters/${file}`)));
    
    let template = await read("index.html");

    let chaptersHtml = "";
    let navHtml = "";

    files.forEach((current, idx) => {
        const id = chapters[idx]
            .toLowerCase()
            .split(" ")
            .join("-");

        let html = md.render(current);
        const [ h1 ] = tag("h1", html);
        const [ , title ] = h1.match(/\<h1\>(.*?)\<\/h1\>/);
        const h2s = tag("h2", html);

        html = html.replace(`<h1>${title}</h1>`,
            `<a class="no-border" href="#${id}">
                <span id="${id}" class="anchor"></span>
                <h1>${title}</h1>
            </a>`);

        navHtml += `<a class="no-border" href="#${id}">${title}</a>`;

        if(h2s) {
            h2s.forEach((ref) => {
                const [ , h2 ] = ref.match(/\<h2\>(.*?)\<\/h2\>/);
                const h2Id = h2
                    .toLowerCase()
                    .split(" ")
                    .join("-");

                html = html.replace(`<h2>${h2}</h2>`,
                    `<a class="no-border" href="#${id}-${h2Id}">
                        <span id="${id}-${h2Id}" class="anchor"></span>
                        <h2>${h2}</h2>
                    </a>`);

                navHtml += `<a href="#${id}-${h2Id}" class="sub no-border">${h2}</a>`;
            });
        }

        chaptersHtml +=  `
            <div class="chapter">
                ${html}
            </div>`;
    });

    template = template.replace("{chapters}", chaptersHtml);
    template = template.replace("{nav}", navHtml);

    await fs.mkdirp(`${__dirname}/build`);

    fs.writeFile(`${__dirname}/build/index.html`, template, () => null);
    fs.copy(`${__dirname}/src/public`, `${__dirname}/build`);
})();
