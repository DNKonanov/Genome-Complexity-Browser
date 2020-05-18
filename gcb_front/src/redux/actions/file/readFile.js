import {
    SET_USER_COORDINATES_STR,
    SET_USER_COORDINATES,
    SET_USER_VALUES,
    SET_MAX_USER_VALUE, IS_LOAD_USER_COORDINATES, ENABLED_SHOW_DELETE_USER_COORDINATES,

} from "../../constants/file/constants";

export const setUserCoordinatesStr = (userCoordinatesStr) => ({
    type: SET_USER_COORDINATES_STR,
    payload: {
        userCoordinatesStr: userCoordinatesStr
    },
});

export const setUserCoordinates = (userCoordinates) =>({
   type:SET_USER_COORDINATES,
   payload: {
       userCoordinates:userCoordinates,
   }
});

export const setUserValues = (userValues) =>({
   type:SET_USER_VALUES,
   payload:{
       userValues:userValues,
   }
});


export const setMaxUserValue = (maxUserValue) =>({
   type:SET_MAX_USER_VALUE,
   payload:{
       maxUserValue:maxUserValue,
   }
});

export const setIs_Load_User_Coordinates = (is_Load_User_Coordinates) => ({
    type:IS_LOAD_USER_COORDINATES,
    payload: {
        is_Load_User_Coordinates:is_Load_User_Coordinates
    }
});
export const setEnabled_Show_Delete_User_Coordinates = (enabled_Show_Delete_User_Coordinates) => ({
    type:ENABLED_SHOW_DELETE_USER_COORDINATES,
    payload: {
        enabled_Show_Delete_User_Coordinates:enabled_Show_Delete_User_Coordinates
    }
});