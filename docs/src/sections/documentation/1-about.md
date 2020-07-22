# About
XCR requires basic understanding on [XState](https://xstate.org). Since XCR is essentially a library for XState, everything you know and love about XState will still work as expected. The goal of XCR is to take the awesome architecture tools and methodology that XState provides and expand that feature set into more of your app. Usually we use XState for handing things like a form, but what if we could use it for everything?


There are certain features we often expect other services to handle because we haven't discovered a better way. An issue when developing modern web apps with XState is that often times you will have XState handling certain areas of your app while a router or some other conditional logic handles the rendering of certain components. What if all of this could be unified into one beautiful state machine? XCR exists to better architect your project and eliminate the need for using XState for certain app flows and a router for others. Below is an example state machine created with XCR using the `component` helper. When the state machine is in **home** state, `home.component` will render. When the user is in the **about** state, `about.component` will render. To update the view/component, simple send an event to the service.

```javascript
import { component } from "xcr";

export default {
    initial : "home",

    on : {
        HOME  : "home",
        ABOUT : "about",
    }

    states : {
        home : component(import("home.component"), {
            // Home state
        }, {
            // Optional props to pass to component
        }),
        about : component(import("about.component"), {
            // About state
        }),
    }
}
```
```html
<nav>
    <button onClick="() => service.send('HOME')">Home</button>
    <button onClick="() => service.send('AOUT')">About</button>
</nav>
```