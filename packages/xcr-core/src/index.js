/* eslint-disable max-statements */
import { Machine, interpret, assign } from "xstate";
import ComponentTree from "xstate-component-tree";

import component from "./utilities/component.js";
import parseURL from "./_internal/url.js";


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

    const components = (cb) => new ComponentTree(service, cb);

    service.start();

    // Expose the service in the console
    if(debug) {
        setTimeout(() => {
            window.state = service;
        }, 1000);
    }

    // Handle routing
    const updateViewFromURL = () => {
        const { params, path } = parseURL(window.location.hash);

        if(debug) {
            // eslint-disable-next-line no-console
            console.log("URL", {
                path,
                params,
            });
        }

        if(routesMap.has(path)) {
            // service.send({
            //     type : "xcr:update:params",
            //     params,
            // });

            service.send(`xcr:url:${path}`);
        } else if(fallback){
            service.send("xcr:404");
        }
    };

    updateViewFromURL();

    // Update url if current state matches one of the routes in routes.js
    service.subscribe((current) => {
        routesMap.forEach((value, url) => {
            history.pushState({}, name, `#/${url.replace("xcr:url:", "")}`);
        });

        if(debug) {
            // eslint-disable-next-line no-console
            console.log("State", current.value);
        }
    });

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
