
const parseURL = (str = window.location.hash) => {
    // grab everything after "#/"up until the ?
    let [ url ] = str.split("?");

    url = url.replace("#", "");

    // remove leading and trailing spaces
    url = url.replace(/^\/|\/$/g, "");

    return url;
};

const params = () => {
    const paramsObj = {};

    // Will turn into a string cuz JS is cool
    const paramsString = [];

    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        paramsObj[key] = value;
        paramsString.push(`${key}=${value}`);
    });

    return {
        paramsObj,
        paramsString : paramsString.join("&")
    };
}

export {
    params,
    parseURL,
}