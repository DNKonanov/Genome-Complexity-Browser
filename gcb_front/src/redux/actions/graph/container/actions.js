export const setContainerGraph = (TYPE_NAME, value) =>({
    type: TYPE_NAME,
    payload:{
        [TYPE_NAME.toLowerCase()]: value,
    }
});
