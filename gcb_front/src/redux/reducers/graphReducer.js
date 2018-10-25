import {
  FETCH_GRAPH
} from "../constants/action-types";

const initialState = {
  graph: {
    params: {},
    data: ""
  }
}


export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_GRAPH:
      return {
        ...state,
        graph: {
          params: action.params,
          data: action.payload
        }
      };
    default:
      return state;
  }
}