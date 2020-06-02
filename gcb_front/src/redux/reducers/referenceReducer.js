import {
    FETCH_COMPLEXITY,
    FETCH_CONTIGS,
    FETCH_ORGANISMS,
    FETCH_STAMMS,
    FETCH_WINDOWS,
    PUT_SELECTION
} from "../constants/action-types";

import * as math from 'mathjs';


const initialState = {
    organisms: [],
    stamms: {
        list: [],
        names: [],
        org: 'None'
    },
    contigs: {
        list: [],
        stamm: 'None'
    },

    complexity_windows: {
        list: [],
        complexity_window: 0,
    },
    complexity: {
        complexity: [],
        max_complexity: 0,
        length_list: [],
        OGs: [],
        coord_list: [],
        request: {
            complexity_window: 0,
            org: '',
            stamm: '',
            contig: '',
            method: '',
            pars: false,
            coef: 1.5,
        }
    },
    selection: 'None'
};


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
                    list: action.payload[0],
                    names: action.payload[1],
                    org: action.org
                }
            };
        case FETCH_WINDOWS:
            return {
                ...state,
                complexity_windows: {
                    list: action.payload,
                    stamm: action.stamm
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

                    hotspots: action.payload[4],
                    base: action.payload[5],
                    hotspots_sym: action.payload[6],
                    request: action.params
                }
            };
        case PUT_SELECTION:
            return {
                ...state,
                selection: action.payload
            };
        case 'SET_OGS' :
            return {
              ...state,
              selection:{
                  og_start:action.payload.og_start,
                  og_start_s:action.payload.og_start_s
              }
            };
        default:
            return state;
    }
}