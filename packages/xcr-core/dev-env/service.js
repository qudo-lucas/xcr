import xcr from "../";
import { writable } from "svelte/store";

import config from "./machine.js";

const { service, components } = xcr({
    xstate : {
        config,
    },

    options : {
        debug : true,
    },
});
 
// Whenever the tree updates save value off to tree store.
const tree = writable([],
    (set) => {
        components((list) => set(list));
    }
);

const context = writable({}, (set) => {
    service.subscribe((state) => set(state.context));
});
 
export default service;
export {
    tree as components,
    context,
};
