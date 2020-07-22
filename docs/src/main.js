import "./styles/main.scss"

// const handleScroll = () => {

//     // window.requestAnimationFrame(handleScroll);
// };

// let options = {
//     rootMargin: '0px',
//     threshold: 1.0
// }
  
// let observer = new IntersectionObserver(console.log, options);

// const createScrollListeners = () => {
//     const scrollAnchors = Array.from(document.querySelectorAll(".anchor"));

//     const scrollTargets = scrollAnchors.map((el) => ([
//             el.id,
//             el,
//     ]));

//     scrollTargets.forEach((target) => {
//         let options = {
//             root: document.querySelector('#scrollArea'),
//             rootMargin: '0px',
//             threshold: 1.0
//         }
        
//         let observer = new IntersectionObserver(console.log, options);

//         observer.observe(target);
//     });
//     // handleScroll();
// }

// createScrollListeners();
import cookie from "js-cookie";

(() => {
    const alignButtons = document.querySelectorAll(".align-button");

    document.body.setAttribute('data-align',  cookie.get("align") || "center");;

    alignButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const position = button.getAttribute("data-position");

            cookie.set("align", position);

            document.body.setAttribute('data-align', [position]);
        });
    });
})()