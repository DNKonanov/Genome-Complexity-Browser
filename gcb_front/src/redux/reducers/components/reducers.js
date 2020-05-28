import {DISABLED_SELECT_REFERENCE} from "../../constants/components/constants";
import {select} from "material-components-web/index";

const initiateState = {
    select: {
        disabled_select_reference: false
    }
};
function componentsProps(state = initiateState, action) {
    switch (action.type) {
        case DISABLED_SELECT_REFERENCE:
            return {
                ...state,
                select: {
                    disabled_select_reference: action.payload.disabled_select_reference
                }
            };
        default:
            return state;
    }
}

export default componentsProps;