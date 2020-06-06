import {IS_OPEN_DRAWER, CURRENT_TAB} from "../../constants/layout/constants";

export const setIs_open_drawer = (is_open_drawer) => ({
    type:IS_OPEN_DRAWER,
    payload: {
        is_open_drawer: is_open_drawer
    }
});


export const setCurrentTab = (current_tab) => ({
    type:CURRENT_TAB,
    payload: {
        current_tab: current_tab
    }
});