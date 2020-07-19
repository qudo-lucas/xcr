/* eslint-disable max-statements */
import { Machine, interpret, assign } from "xstate";
import ComponentTree from "xstate-component-tree";

import component from "./utilities/component.js";
import parseURL from "./_internal/url.js";
import wait from "./_internal/wait.js";

let first = true;

// TODO: options { fallback : 'initial' or 'state' }
export default (config, routes, { debug = false, name = "XCR", fallback = false }) => {
    const routesMap = new Map(Object.entries(routes));
    
    // events to add to their config
    const events = {
        "xcr:update:params" : {
            actions : assign(({ params = {} }) => {
                return { params };
            }),
        },

        "xcr:404": fallback,
    };
    
    routesMap.forEach((value, url) => {
        // remove leading and trailing "/"
        events[`xcr:url:${url}`] = value.replace(/^\/|\/$/g, "");
    });

    // Add routes as top level events
    const updatedConfig = {
        ...config,

        on : {
            ...config.on,
            ...events,
        },
    };

    // eslint-disable-next-line new-cap
    const machine = Machine(updatedConfig);
    const service = interpret(machine);

    const components = (cb) =>  new ComponentTree(service, cb);

    service.start();

    // Expose the service in the console
    if(debug) {
        setTimeout(() => {
            window.state = service;
        }, 1000);
    }

    // Handle routing
    const updateViewFromURL = async () => {
        const { params, path } = parseURL(window.location.hash);

        console.log({path});

        if(debug) {
            // eslint-disable-next-line no-console
            console.log("URL", {
                path,
                params,
            });
        }

        if(routesMap.has(path)) {
            // TODO look into an xstate onReady solution.
            // Wait a sec to ensure service is ready.
            if(first) {
                first = false;
                
                await wait(500);

                return service.send(`xcr:url:${path}`);
            } 

            service.send(`xcr:url:${path}`);
        } else if(fallback){
            service.send("xcr:404");
        }
    };

    // Update url if current state matches one of the routes in routes.js
    service.subscribe((current) => {
        // Get most recent state (current state)
        const stateString = current.toStrings().pop();

        routesMap.forEach((value, url) => {
            if(value === stateString) {
                history.pushState({}, name, `#/${url}`);
            }
        });

        if(debug) {
            // eslint-disable-next-line no-console
            console.log("State", current.value);
        }
    });

    updateViewFromURL();

    // Recheck the URL when these things happen
    window.onpopstate = updateViewFromURL;
    window.onhashchange = updateViewFromURL;

    return {
        service,
        components,
    };
};

export {
    component,
};
