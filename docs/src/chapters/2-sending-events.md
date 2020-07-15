# Sending Events

Events allow you to communicate with a router instance. Events are used to update the current view, or communicate with other services.

## The Send Method
The send method is passed in as a prop to all views as well as exported from the Router component. To update the current router view, send an event that matches the name of one of your views. If a view isn't matched to the event name, the router will stay where it is and nothing will happen. 
```bash
send([ Event Name (String) ], [ Optional Payload (Any) ]);
```

### Within a View
```html
<button on:click="{() => send('signup')}">Go to Signup</button>

<script>
export let send;
</script>
```

### Outside a View
```html
<div class="container">
    <Router
        initial="signin"
        bind:send="{send}"
        {views}
    />
    <button on:click="{() => send('signup')}">Go to Signup</button>
</div>

<script>
import Router from "svelte-event-router";

// Views
import signin from "./views/signin.svelte";
import signup from "./views/signup.svelte";

let send;

const views = { 
    signin, // url.com/#/signin                      
    signup, // url.com/#/signup                        
};
</script>
```
