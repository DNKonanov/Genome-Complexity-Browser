import {IS_OPEN_DRAWER} from "../../constants/layout/constants";

export const setIs_open_drawer = (is_open_drawer) => ({
    type:IS_OPEN_DRAWER,
    payload: {
        is_open_drawer:is_open_drawer
    }
});
