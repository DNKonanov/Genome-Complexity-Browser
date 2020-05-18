import {
    SET_USER_COORDINATES_STR,
    SET_USER_COORDINATES,
    SET_USER_VALUES,
    SET_MAX_USER_VALUE,

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




// // LOAD USER
// export const loadUser = () => async (dispatch, getState) => {
//     dispatch({type: USER_LOADING});
//
//     try {
//         const res = await axios.get('/api/auth/user', tokenConfig(getState));
//         dispatch({
//             type: USER_LOADED,
//             payload: res.data
//         });
//     } catch (err) {
//         dispatch({
//             type: AUTH_ERROR
//         });
//     }
// };
