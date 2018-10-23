import {
  FETCH_ORGANISMS, FETCH_STAMMS, FETCH_CONTIGS
} from "../constants/action-types";

const initialState = {
  organisms: [],
  stamms: {
    list: [],
    org: 'None'
  },
  contigs: {
    list: [],
    stamm: 'None'
  }
}


export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_ORGANISMS:
      return {
        ...state,
        organisms: action.payload
      };
    case FETCH_STAMMS:
      return {
        ...state,
        stamms: {
          list: action.payload,
          org: action.org
        }
      };
    case FETCH_CONTIGS:
      return {
        ...state,
        contigs: {
          list: action.payload,
          stamm: action.stamm
        }
      };
    default:
      return state;
  }
}