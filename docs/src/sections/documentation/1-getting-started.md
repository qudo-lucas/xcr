# Getting Started

To get started, import Router and specify your views.
```html
<div class="container">
    <Router
        initial="signin"
        {views}
    />
</div>

<script>
import Router from "svelte-event-router";

// Views
import signin from "./views/signin.svelte";
import signup from "./views/signup.svelte";

const views = { 
    signin, // url.com/#/signin                      
    signup, // url.com/#/signup                        
}; 
</script>
```