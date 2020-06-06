import {IS_OPEN_DRAWER, CURRENT_TAB} from "../../constants/layout/constants";

const initiateState = {
   leftMenu:{
       is_open_drawer:true,
       current_tab: 0,
   } 
};

function layout(state = initiateState, action) {
    
    switch (action.type) {
        case IS_OPEN_DRAWER:
            return {
                ...state,
                leftMenu: {
                    is_open_drawer: action.payload.is_open_drawer,
                    current_tab: state.leftMenu.current_tab,
                },
            };
        case CURRENT_TAB:
            return {
                ...state,
                leftMenu: {
                    is_open_drawer: state.leftMenu.is_open_drawer,
                    current_tab: action.payload.current_tab,
                },
            };

        default:
            return state;
    }
}

export default layout;