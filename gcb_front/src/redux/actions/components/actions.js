import {DISABLED_SELECT_REFERENCE} from "../../constants/components/constants";

export const setDisabled_select_reference = (disabled_select_reference) => ({
    type: DISABLED_SELECT_REFERENCE,
    payload: {
        disabled_select_reference: disabled_select_reference
    }
});
