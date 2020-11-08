/* eslint-disable max-statements */
import { Machine, interpret, assign } from "xstate";
import ComponentTree from "xstate-component-tree";

import componentUtil from "./utilities/component.js";
import paramsUtil from "./utilities/params.js";

import { parseURL, params } from "./_internal/url.js";
import wait from "./_internal/wait.js";

let first = true;

let lastPath = "";

export default ({
    xstate : {
        config : xStateConfig = {},
        options : xStateOptions = {}
    } = {},

    router : {
        name = "XCR",
        routes = {},
        fallback  = false,
    } = {},

    options : {
        debug = false,
    } = {},
} = {}) => {
    const routesMap = new Map(Object.entries(routes));
    const { paramsObj } = params();
    console.log(params())
    const initialContext = {
        params : paramsObj
    };
    
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
        ...xStateConfig,

        on : {
            ...xStateConfig.on,
            ...events,
        },
    };

    // eslint-disable-next-line new-cap
    const machine = Machine(updatedConfig, xStateOptions);
    const contextMachine = machine.withContext({
        ...initialContext,
    });
    const service = interpret(contextMachine);

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
        const path = parseURL(window.location.hash);

        if(debug) {
            // eslint-disable-next-line no-console
            console.log("URL", {
                path,
                params : paramsObj,
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
    // http://mydevhost.apple.com:5000/#/project?org=fear&project=Test_Project_6
    // Update url if current state matches one of the routes in routes.js
    service.subscribe((current) => {
        const stateHistory = current.toStrings().reverse();
        
        const paramsString = Object.entries(current.context.params)
            .map(([key, val]) => `${key}=${val}`)
            .join("&");
        
        // .find() so we can break.
        stateHistory.find((state) => {
            // console.log(Object.entries(routes))
            const [ route ] = Object.entries(routes).find(([ , val ]) => val === state) || [ false ];

            if(route) {
                history.pushState({}, name, `#/${route}${paramsString ? `?${paramsString}` : ""}`);

                return true;
            }
        })

        if(debug) {
            // eslint-disable-next-line no-console
            console.log("State", current);
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
    componentUtil as component,
    paramsUtil as params,
};
