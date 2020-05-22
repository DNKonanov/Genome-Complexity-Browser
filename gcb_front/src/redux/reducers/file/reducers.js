import {
    SET_USER_COORDINATES_STR,
    SET_USER_COORDINATES,
    SET_USER_VALUES,
    SET_MAX_USER_VALUE, IS_LOAD_USER_COORDINATES, ENABLED_SHOW_DELETE_USER_COORDINATES

}
    from "../../constants/file/constants";

const initiateState = {
    userCoordinatesStr: '',
    userCoordinates: [],
    userValues: [],
    maxUserValue: 1,
    // buttons
    is_Load_User_Coordinates:false,
    enabled_Show_Delete_User_Coordinates:false,
};

function fileCoordinates(state = initiateState, action) {
    switch (action.type) {
        case SET_USER_COORDINATES_STR:
            return {
                ...state,
                userCoordinatesStr: action.payload.userCoordinatesStr
            };
        case SET_USER_COORDINATES:
            return {
                ...state,
                userCoordinates: action.payload.userCoordinates
            };
        case SET_USER_VALUES:
            return {
                ...state,
                userValues: action.payload.userValues,
            };
        case SET_MAX_USER_VALUE:
            return {
                ...state,
                maxUserValue: action.payload.maxUserValue,
            };
        case IS_LOAD_USER_COORDINATES:
            return {
                ...state,
                is_Load_User_Coordinates: action.payload.is_Load_User_Coordinates
            };
        case ENABLED_SHOW_DELETE_USER_COORDINATES:
            return {
                ...state,
                enabled_Show_Delete_User_Coordinates: action.payload.enabled_Show_Delete_User_Coordinates
            };


        default:
            return state;
    }
}

export default fileCoordinates;