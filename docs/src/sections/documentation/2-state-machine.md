# State Machine

## Component State Helper
The component state helper allows you to attach a component to a certain state, therefore rendering the specified component when in that state. Every component rendered via the state machine is automatically passed props **event** and **ctx** which correspond to the last XState event and current machine context. This allows you to easily utilize event payloads from within your components (more on this in [Sending Events]("#sending-events")).

```javascript
import { component } from "xcr";

component(
    Component (Import),
    XState State (Object),
    Component Props (Object)
);
```

`Component (Import)` → The first parameter of the `component` function requires a reference to your component which can be a top level or inline import.

`XState State (Object)` → The second parameter takes an object which represents the normal XState state.

`Component Props (Object)` → The third parameter allows you to pass static or dynamic props into your components via the state machine.

### Example
You can mix regular XState states with component states. See below. 

```javascript
import { component } from "xcr";
import { actions } from "xstate";

// Example of top level import
import Home from "./home.svelte"

const { raise } = actions;

export default {
    initial : "boot",

    on : {
        HOME  : "home",
        ABOUT : "about",
    }

    states : {
        boot : {
            invoke : {
                src : /* some promise */
                onDone : raise("HOME"),
            }
        },

        home : component(Home, {
            
            states : {
                loading : {},
                ready   : {}
            }
        }),
        about : component(import("about.component"), {
            // About state
        }),
    }
}
```

## Nested Components
Nested components are possible as long as the nested component's parent is setup to render child components (See [Rendering Components](#rendering-components)).

### Example 
```javascript 
{
    auth : component(import("auth.component"), {
        initial : "signin",

        states : {
            signin : component(import("signin.component"), {

            }),
            signup : component(import("signup.component"), {

            }),
        }
    }),
}

```