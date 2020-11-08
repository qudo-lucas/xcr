import component from "../src/utilities/component";

export default {
    initial : "home",

    on : {
        HOME : ".home",
        ABOUT : ".about",
    },
    
    states : {
        home : component(import("./views/home/home.svelte"), {

            initial : "tab1",
            
            on : {
                TAB1 : ".tab1",
                TAB2 : ".tab2",
            },

            states : {
                tab1 : component(import("./views/home/views/tab-1.svelte")),
                tab2 : component(import("./views/home/views/tab-2.svelte")),
            }
        }),
        about : component(import("./views/about/about.svelte"), {}),
    }
}