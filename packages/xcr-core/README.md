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

# How It Works (High Level)
### Config
`XCR` requires basic understanding of [XState](https://xstate.js.org/docs/) and how to structure a state machine config. Here's an example of what a config could look like.

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

### Component Tree
`XCR` utilizes `xstate-component-tree` in order to turn your state chart into an array of components that represent the structure of the config. You can then loop over the components tree array in the framework of your choice. Notice how the initial state of the machine above would be `auth.signin`. Since both of these states have a component attatched to them, we would expect the component tree to look like this.

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

And if we transitioned into the `home` state, we would expect the updated component tree to look like this:
```javascript
[{
    component: home,
    props: false
    children : []
}]
```


### Using URLs
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


## Templates
`XCR` is easy to setup but if you want a head start in your favorite framework, here are a couple templates using a simple form and a couple views. 
* [Svelte Template](https://github.com/qudo-lucas/xcr-template--svelte)
* Vue Template (coming soon)
* Vue Template (coming soon)

## Config
The machine config is a standard [XState](https://xstate.js.org/docs/) config. `XCR` provides a `component()` function to make it easier to transform any state into something that `xstate-component-tree` can read. The `component()` helper is only required when a state represents a component.

```javascript
component(
    // This can be an inline import if your build system supports it.
    // For Rollup, just add  "inlineDynamicImports : true" to your config.
    // The Components component will be able to differentiate between import types.
    [Component (Import)],

    // The XState state object.
    [State (Object)],

    // Static props that will be passed into the component
    // when using the Components component.
    [Props (Object)]
)

```
```javascript
import Signin from "views/auth/pages/signin.svelte";

import { component } from "xcr";

export default {
    initial : "auth",

    on : {
        AUTH : "auth",
        HOME : "home"
    },
    
    states : {
        // Inline import
        auth : component(import("views/auth/auth.svelte"), {
			initial : "signin",
					
            states : {
                // Top level import
                signin : component(Signin, {
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

export default service;
```

```javascript

router(
    // XState machine config
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
[Template](https://github.com/qudo-lucas/xcr-template--svelte)

Framework helpers: `npm install xcr-svelte`

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

// Whenever the tree updates save value off to tree store.
const tree = writable([],
    (set) =>
        components((list) => set(list))
);

export default service;
export {
    tree as components,
};
```
```javascript
// app.svelte (top level component)

<script>
// The store created above in service.js
import { components } from "shared/service.js";

// Helper component from xcr that handles looping over the component tree.
import { Components } from "xcr-svelte";

</script>

<div class="view">
    <!--The Components component takes only the components property
    which should be an array of components created by the service.
    Note: this will only loop over the top level of current components.
    If one of our top level views has child states, we will need another
    Components component in those child components. See below.-->
	<Components components={$components} />
</div>

```
```javascript
// auth.svelte

<script>
// Looking at our state chart from above,
// notice the auth state has two child states, signin and info.
// Our app.svelte will handle rendering this component,
// but not any children below this component. To solve this we need to add the
// Components component to any component that has child states.

import { Components } from "xcr-svelte";
import service from "shared/service.js";

// app.svelte handed us the component tree as a prop so there's no need to
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

