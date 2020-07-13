import { actions } from "xstate";

import { component } from "xcr";

const { raise } = actions;

export default {
    initial : "auth",

    on : {
        AUTH : "auth",
        HOME : "home"
    },
    
    states : {
        auth : component(import("views/auth/auth.svelte"), {
			initial : "signin",
					
            states : {
                signin : component(import("views/auth/pages/signin.svelte"), {
                    on : {
                        NEXT : "info"
                    }
                }),
            
                info : component(import("views/auth/pages/general-info.svelte"), {
                    on : {
                        BACK : "signin",
                        NEXT : {
                            actions : raise("HOME"),
                        }
                    }
                }),
            },
        }),
			
        home : component(import("views/home/home.svelte")),
    },
};
