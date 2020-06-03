import {IS_OPEN_DRAWER} from "../../constants/layout/constants";

const initiateState = {
   leftMenu:{
       is_open_drawer:true
   }
};

function layout(state = initiateState, action) {
    switch (action.type) {
        case IS_OPEN_DRAWER:
            return {
                ...state,
                leftMenu: {
                    is_open_drawer: action.payload.is_open_drawer
                },
            };
        default:
            return state;
    }
}

export default layout;