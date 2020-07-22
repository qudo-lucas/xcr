const fs = require("fs-extra");
const path = require('path');
const md = require("markdown-it")();

// Finds all occurrences of an html tag and it's content
const tag = (t, html) => html.match(new RegExp(`\<${t}\>(.+?)\<\/${t}\>`, "gi"));

const read = (file) => new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
        if(err) {
            reject(err);
        }
        
        resolve(data.toString());
    });
});

const readDir = (dir) => new Promise((resolve, reject) => {
    fs.readdir(dir, (err, chapters) => {
        if(err) {
            reject();
        }

        resolve(chapters);
    });
});

const readSections = async (sections = []) => {
    try {
        // Read files in each section directory
        const files = await Promise.all(
            sections.map(
                ({ title, src }) => new Promise(async (resolve, reject) => {
                     // read all files in each section
                    const paths = await readDir(path.join(__dirname, src));
                   
                    const data = await Promise.all(paths.map((loc) => read(path.join(__dirname, src, loc))));

                    const chapters = data.map((content, idx) => ({
                        name : paths[idx],
                        data : md.render(content),
                    }));
        
                    resolve({
                        title,
                        chapters   
                    });
                })
            )
        );

        return  files;
    } catch(err) {
        console.log(err);
    }
}

const buildHTML = (sections) => {
    let navHTML = "";
    let sectionsHTML = "";

    const clean = (str) => str.toLowerCase().split(" ").join("-");

    sections.forEach(({ title : sectionTitle, chapters }, idx) => {
        const sectionId = clean(sectionTitle);

        // Add section header to nav
        navHTML += `<a class="no-border section" href="#${sectionId}">${sectionTitle}</a>`;

        // Start the section and add section header to body
        sectionsHTML += `
            <section class="section">
                <span id="${sectionId}" class="anchor"></span>
                <h1 class="section">${sectionTitle}</h1>
        `;

        // Loop through each chapter within the section
        chapters.forEach(({ name, data }) => {
            // Locate first h1 tag and it's contents
            const [ h1 ] = tag("h1", data);

            // Get contents inside the first h1 and assume it's the chapter title
            const [ , chapterTitle ] = h1.match(/\<h1\>(.*?)\<\/h1\>/);

            const chapterId = `${sectionId}--${clean(chapterTitle)}`;

 
            // Add chapter title as nav item under the section
            navHTML += `<a class="no-border chapter" href="#${chapterId}">${chapterTitle}</a>`;

            // Turn the section header into a link
            data = data.replace(`<h1>${chapterTitle}</h1>`,
            `<a class="no-border target" href="#${chapterId}">
                <span id="${chapterId}" class="anchor"></span>
                <h1 class="chapter">${chapterTitle}</h1>
            </a>`);


            // Look up all sub chapter headings, add them to nav, convert headers into links
            const subChapters = tag("h2", data);
        
            if(subChapters) {
                subChapters.forEach((subChapter) => {
                    const [ , subChapterTitle ] = subChapter.match(/\<h2\>(.*?)\<\/h2\>/);
                    const subChapterId = `${sectionId}--${chapterId}--${clean(subChapterTitle)}`;
        
                    data = data.replace(`<h2>${subChapterTitle}</h2>`,
                        `<a class="no-border target" href="#${subChapterId}">
                            <span id="${subChapterId}" class="anchor"></span>
                            <h2>${subChapterTitle}</h2>
                        </a>`);
        
                    navHTML += `<a href="#${subChapterId}" class="sub-chapter no-border">${subChapterTitle}</a>`;
                });
            };

            sectionsHTML += data;
        });

        sectionsHTML += `</section>`;
    });

    return {
        navHTML, 
        sectionsHTML,
    }
}

module.exports = async ({ template, sections }) => {
    console.log("🛠️ Bilding documentation...")
    try {
        let html = await read(path.join(__dirname, template));

        const SECTIONS = await readSections(sections);

        const { navHTML = "", sectionsHTML = "" } = buildHTML(SECTIONS);
        
        // replace in template
        html = html.replace("{nav}", navHTML);
        html = html.replace("{sections}", sectionsHTML);

        await fs.mkdirp(`${__dirname}/build`);

        fs.writeFile(`${__dirname}/build/index.html`, html, () => null);
        fs.copy(`${__dirname}/src/public`, `${__dirname}/build`);

        console.log("✅ Build complete!")
    } catch(err) {
        console.log(err);
    }
};
