
const sanitizeURL = (str) => {
    // grab everything after "#/"up until the ?
    let [ url ] = str.split("?");

    url = url.replace("#", "");

    // remove leading and trailing spaces
    url = url.replace(/^\/|\/$/g, "");

    return url;
};

const getParams = (url) => {
    const [ , params = false ] = url.split("?");
    
    if(!params) {
        return {};
    }

    const segments = params.split("&");
    const paramsObj = {};

    segments.forEach((segment) => {
        const [ key, val ] = segment.split("=");

        paramsObj[key] = val;
    });

    return paramsObj;
};

export default (url) => ({
    params : getParams(url),
    path   : sanitizeURL(url),
});