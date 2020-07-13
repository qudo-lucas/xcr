# XState Component Router
Compose an event driven UI powered by a finite state machine with support for URLs.

*Huge thanks to [XState](https://xstate.js.org/docs/) and [xstate-component-tree](https://github.com/tivac/xstate-component-tree) for making this project possible.*

# Install 
`npm install xcr`

Install supported framework helpers:
```bash
npm install xcr-svelte

# Vue and React coming soon
```

# How It Works
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
`xcr` then utilizes `xstate-component-tree` in order to turn your state chart into an array of components that correspond with the current state(s) of your machine:
```javascript
[{
    component: auth,
    props: false
    children : [{
        component : signin,
        children: []
    }]
}]
```
From here you can loop over these components in the framework of you choice.

If you would like certain URLs to map to certain states, you can provide a routes option:
```javascript
const routes =  {
    "auth"        : "auth",
    "auth/signin" : "auth.signin",
    "auth/info"   : "auth.info",
    "home"        : "home",
};
```

# Getting Started


### Templates
`xcr` is easy to setup but if you want a head start in your favorite framework, here are a couple templates using a simple form and a couple views. 
* [Svelte Template](https://github.com/qudo-lucas/xcr/tree/master/templates/svelte)
* Vue Template (coming soon)
* Vue Template (coming soon)

## Config
The machine config is a standard XState config. You might notice the `component` function. This is a helper provided by by `xcr` to transform any state into something that `xstate-component-tree` can read. This is only required when a state represents a component.

```javascript
component(
    // This can be an inline import if your build system supports it.
    // For Rollup, just add  "inlineDynamicImports : true" to your config.
    // The Components component will be able to differentiate between import types.
    [Component Import],

    // The XState state object.
    [State (Object)],

    // Static props that will be passed into the component
    // when using the Components component.
    [Pops (Object)]
)

```
```javascript
import { component } from "xcr";

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
                    },

                    // Normal XState things
                    states : {
                        resting : {}
                        loading : invoke({
                            // ...stuff
                        }),
                    },
                }),
            },
        }),
			
        home : component(import("views/home/home.svelte")),
    },
};
```

## Service
The service file handles initializing the router and extracting the `XState` service and component tree. Here is an example of what a service could look like.

1. Import the router and state machine config.
2. Define routes.
3. Create the router, and deconstruct service and components off of the result.

``` javascript
// service.js
import router from "xcr";
import config from "shared/machines/main.machine.js";

const routes =  {
    "home"        : "home",
    "auth"        : "auth",
    "auth/signin" : "auth.signin",
    "auth/info"   : "auth.info",
};

const { service, components } = router(
    config,
    routes,
    {
        debug : true,
    }
);

components((tree) => {
    // Assign tree to a value your app can subscribe to, probably a store.
});
```

```javascript

router(
    [StateMachineConfig (Object)],
    
    // Default: {}
    // You can tell xrc which URLs correspond to which states.
    // If the browser loads a URL that matches a state, it will send
    // an event to the service causing the machine to load into
    // the correct state. If your current state matches a URL,
    // that URL will be pushed into browser history and appear
    // in the address bar. 
    [Routes (Object)] : {

        // Required.
        // The URL          // XState state
        [Router (String)] : [State (String)],
    },
    
    
    [Options (Object) : {
        // Default: false.
        // Enables helpful logging.
        debug : Boolean

        // Default: "XCR"
        // The name of your application that the router will save to browser history.
        name : String,

        // Default: false
        // Used if you want to enable a "404" page for invalid URLs.
        // If fallback is false, the state machine will just load the initial state.
        fallback : Boolean,
    },
);
```
```javascript
const {
    // The XState interpreter. Used to send events and access current state machine value. 
    service,

    // A function which takes a callback that is passed the current component tree array.
    components,
} = router( /*args*/);
```


# Examples
We will use this config for all the examples.
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

## Svelte
___
Svelte helpers: `npm install xcr-svelte`
``` javascript
// service.js
import router from "xcr";
import { writable } from "svelte/store";
import config from "shared/machines/main.machine.js";

const routes =  {
    "home"        : "home",
    "auth"        : "auth",
    "auth/signin" : "auth.signin",
    "auth/info"   : "auth.info",
};

const { service, components } = router(
    config,
    routes,
    {
        debug : true,
    }
);

// Whenever the components list updates save off value to store.
const tree = writable([], (set) =>
    components((list) => {
        set(list);
    })
);

export default service;
export {
    tree as components,
};
```
```javascript
// app.svelte (top level component)

<script>
// The store created in service.js
import { components } from "shared/service.js";

// Helper component from xcr that handles looping over an array of components
import { Components } from "@xcr/svelte";

</script>

<div class="view">
    <!--The Components component takes only the components property
    which should be an array of components created by the service.
    Note: this will only loop over the top level of current components.
    If one of our top level views has child states, we will need another
    Components component in those child component. See below.-->
	<Components components={$components} />
</div>

```
```javascript
// auth.svelte

<script>
// Looking at our state chart from above,
// notice the auth state has two child states, signin and info.
// Our app.svelte will handle rendering this component,
// but not any children of this component. To solve this you need to add the
// Components component to any component that has child states.

import { Components } from "@xcr/svelte";
import service from "shared/service.js";

// app.svelte handed us this as a prop so there's no need to
// import and subscribe to the store again from service.js.
// All levels below the top level subscription can just
// forward on the components prop. 
export let components;
</script>

<div class="child-view">
    <Components {components} />
    
    <!-- Utilize the XState instance and send an event that will update the view. -->
    <button on:click={() => service.send("HOME")}>Home</button>
</div>

```

