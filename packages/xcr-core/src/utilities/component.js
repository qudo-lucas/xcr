export default (component, state = {}, props) => ({
    ...state,

    meta : {
        ...state.meta,
        load : (ctx, event) => [
            component,
            {
                ...props,
                ctx,
                event,
            },
        ],
    },
});