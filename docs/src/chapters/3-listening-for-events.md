# Router Store

Subscribing to the router store allows you take action when certain events occur. The router store updates on page load and whenever an event is sent via the the "send()" method. Like the send method, the router store is also passed in as prop to every view as well as exported to the Router component.

```javascript
{
    data,        // Payload from the last event.
    event,       // Name of the last event.
    _event,      // Two events ago.
    current,     // Current view. Only updates when view changes.
    params,      // A JavaScript Map of URL parameters.
} = $router
```

### Within a View
```html
<script>
export let router;
</script>
```

### Outside a View
```html
<Router
    initial="signin"
    bind:router="{router}"
    {views}
/>


<script>
import Router from "svelte-event-router";

// Views
import signin from "./views/signin.svelte";
import signup from "./views/signup.svelte";

const views = { 
    signin, // url.com/#/signin                      
    signup, // url.com/#/signup                        
};

let router;

// Wait for router to be ready
$: if($router) {
    // Code to run on any router update
}
</script>
```

## Custom event listeners
Sometimes events are used to trigger other actions besides updating the view. Here we are sending a "submit" event. Since it doesn't match up with the name of a view, the router won't update the view but it will still update the router store.

```html
<form on:submit="{() => send('submit', { user })}"></form>

<script>
export let send;
</script>
```
```html
<Router
    initial="signin"
    bind:router="{router}"
    {views}
/>


<script>
import Router from "svelte-event-router";

// Views
import signin from "./views/signin.svelte";
import signup from "./views/signup.svelte";

let router;

const views = { 
    signin, // url.com/#/signin                      
    signup, // url.com/#/signup                        
};

const myFunction = (user) => {  };

// Wait for the router to be ready,
// run our function if the last event was "submit",
// pass in the payload from the last "submit" event.
$: if($router) {
    $router.event === "submit" && myFunction($router.data);
}
</script>
```

## Consuming URL Parameters
The router store searches for any URL parameters and formats them as a JavaScript Map.
```html
<Router
    initial="signin"
    bind:router="{router}"
    {views}
/>

<script>
import Router from "svelte-event-router";

// Views
import signin from "./views/signin.svelte";
import signup from "./views/signup.svelte";

let router;

const views = { 
    signin, // url.com/#/signin                      
    signup, // url.com/#/signup                        
};

const loadPost = (id) => {  };

// Wait for the router to be ready,
// check if URL parameter exists,
// and pass it into our function.
$: if($router) {
    $router.params.has("id") && loadPost(params.get("id"));
};
</script>
```

## Utilizing Current
Here's an example of a simple nav that highlights the button corresponding to the active view.
```html
<Router
    initial="signin"
    bind:router="{router}"
    bind:send="{send}"
    {views}
/>

<button
    on:click="{() => send('signin')}"
    style="text-decoration: {$router.current === 'signin' ? 'underline' : 'none'}"
>
Sign In
</button>
<button
    on:click="{() => send('signup')}"
    style="text-decoration: {$router.current === 'signup' ? 'underline' : 'none'}"
>   
Sign Up
</button>

<script>
import Router from "svelte-event-router";

// Views
import signin from "./views/signin.svelte";
import signup from "./views/signup.svelte";

let router;
let send;

const views = { 
    signin, // url.com/#/signin                      
    signup, // url.com/#/signup                        
};
</script>
```