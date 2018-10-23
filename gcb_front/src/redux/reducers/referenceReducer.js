import {
  FETCH_ORGANISMS
} from "../constants/action-types";

const initialState = {
  organisms: []
}


export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_ORGANISMS:
      return {
        ...state,
        organisms: action.payload
      };
    default:
      return state;
  }
}