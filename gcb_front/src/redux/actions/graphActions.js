import {
  FETCH_GRAPH
} from "../constants/action-types";

import {
  SERVER_URL
} from "../constants/urls";

export function fetchGraph(params) {
  return function (dispatch) {
    let url = SERVER_URL + '/org/' + params.org + '/strain/' + params.stamm + '/contig/' + params.contig +
      '/start/' + params.og_start + '/end/' + params.og_end + '/window/' + params.window + '/tails/' + params.tails +
      '/pars/' + params.pars_int + '/operons/' +params.operons_int + '/depth/' + params.depth + '/freq_min/' + params.freq_min

    fetch(url)
      .then(response => response.json())
      .then(data => dispatch({
        type: FETCH_GRAPH,
        payload: data,
        params: params,
        result: 'SUCCESS'
      }))
      .catch(error => dispatch({
        type: FETCH_GRAPH,
        payload: {},
        params: params,
        result: 'FAIL'
      }));
  }
}