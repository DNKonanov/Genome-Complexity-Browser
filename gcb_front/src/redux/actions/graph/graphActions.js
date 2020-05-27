import {
    FETCH_GRAPH
} from "../../constants/action-types";

import {
    SERVER_URL,
    SERVER_PORT
} from "../../constants/urls";
import {LOADING} from "../../constants/graph/container/constants";
import {IS_OPEN_DRAWER} from "../../constants/layout/constants";

export function fetchGraph(params) {
    return function (dispatch) {
        let url = SERVER_URL + SERVER_PORT + '/org/' + params.org + '/strain/' + params.stamm + '/contig/' + params.contig +
            '/start/' + params.og_start + '/end/' + params.og_end + '/window/' + params.window + '/tails/' + params.tails +
            '/pars/' + params.pars_int + '/operons/' + params.operons_int + '/depth/' + params.depth + '/freq_min/' + params.freq_min + '/hide_edges/' + params.hide_edges

        fetch(url)
            .then(response => response.json())
            .then(data => {
                dispatch({
                    type: FETCH_GRAPH,
                    payload: data,
                    params: params,
                    result: 'SUCCESS'
                })
            }).then(()=>{
                dispatch({
                    type: LOADING,
                    payload:{
                        loading:false
                    }
                })
        }).then(()=>{
            dispatch({
                type: IS_OPEN_DRAWER,
                payload:{
                    is_open_drawer:false
                }
            })
        })
            .catch(error => dispatch({
                type: FETCH_GRAPH,
                payload: {},
                params: params,
                result: 'FAIL'
            }));
    }
}

