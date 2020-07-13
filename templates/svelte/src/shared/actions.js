import service from "shared/service.js";

const send = (el, event) => el.addEventListener("click", () => service.send(event));

export {
    send,
};
