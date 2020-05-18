import {
    SET_USER_COORDINATES_STR,
    SET_USER_COORDINATES,
    SET_USER_VALUES,
    SET_MAX_USER_VALUE

}
    from "../../constants/file/constants";

const initiateState = {
    userCoordinatesStr: '',
    userCoordinates: [],
    userValues: [],
    maxUserValue: 1,


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

        default:
            return state;
    }
}

export default fileCoordinates;