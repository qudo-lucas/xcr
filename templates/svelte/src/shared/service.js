import { writable } from "svelte/store";
import router from "xcr";
import config from "shared/machines/main.machine.js";

const routes =  {
    auth          : "auth",
    "auth/signin" : "auth.signin",
    "auth/info"   : "auth.info",
    home          : "home",
};

// Init the router
const { service, components } = router(
    config,
    routes,
    {
        debug : __dev__,
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
