# XState Component Router
Compose an event driven UI powered by a finite state machine via [xstate](https://xstate.js.org/docs/) + [xstate-component-tree](https://github.com/tivac/xstate-component-tree).

### How It Works
Once you setup your state machine, it might look something like this:

```javascript
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
```
`xcr` then utilizes `xstate-component-tree` in order to turn your state chart into something like this:


