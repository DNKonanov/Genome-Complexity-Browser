import {
  FETCH_ORGANISMS,
  FETCH_STAMMS,
  FETCH_CONTIGS,
  FETCH_COMPLEXITY
} from "../constants/action-types";

import * as math from 'mathjs';


const initialState = {
  organisms: [],
  stamms: {
    list: [],
    org: 'None'
  },
  contigs: {
    list: [],
    stamm: 'None'
  },
  complexity: {
    complexity: [],
    max_complexity: 0,
    length_list: [],
    OGs: [],
    coord_list: [],
    request : {
      org: '',
      stamm: '',
      contig: '',
      method: '',
      pars: ''
    }
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
    case FETCH_COMPLEXITY:
      return {
        ...state,
        complexity: {
          complexity: action.payload[0],
          max_complexity: math.max(action.payload[0]),
          length_list: action.payload[3],
          OGs: action.payload[1],
          coord_list: action.payload[2],
          request: action.params
        }
      };
    default:
      return state;
  }
}