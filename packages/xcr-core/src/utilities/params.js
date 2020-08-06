import { assign } from "xstate";

export default  {
    add : (key, value = "") => assign({
        params : ({ params : existing }) => ({ ...existing, [key] : value })
    }),

    remove : (key) => assign(({ params }) => {
        delete params[key];

        return {
            params,
        }
    }),

    clear : () => assign({
        params : {},
    }),
};