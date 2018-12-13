import {
  FETCH_ORGANISMS,
  FETCH_STAMMS,
  FETCH_CONTIGS,
  FETCH_COMPLEXITY,
  PUT_SELECTION,
  FETCH_WINDOWS
} from "../constants/action-types";

import {
  SERVER_URL
} from "../constants/urls";



export function fetchOrganisms() {
  return function (dispatch) {
    fetch(SERVER_URL + '/org/')
      .then(response => response.json())
      .then(organisms => dispatch({
        type: FETCH_ORGANISMS,
        payload: organisms.sort()
      }));
  }
}

export function fetchStammsForOrg(org) {
  return function (dispatch) {
    fetch(SERVER_URL + '/org/' + org + '/stamms/')
      .then(response => response.json())
      .then(stamms => dispatch({
        type: FETCH_STAMMS,
        payload: stamms.sort(),
        org: org
      }));
  }
}

export function fetchWindows(org, stamm, pars) {
  return function (dispatch) {
    let pars_int = 0
    if (pars === true) {
      pars_int = 1
    }
    fetch(SERVER_URL + '/org/' + org + '/stamms/' + stamm + '/complexity_windows/pars/' + pars_int)
    .then(response => response.json())
    .then(complexity_windows => dispatch({
      type: FETCH_WINDOWS,
      payload: complexity_windows.sort(),
      stamm: stamm
    }))
  }
}


export function fetchContigs(org, stamm) {
  return function (dispatch) {
    fetch(SERVER_URL + '/org/' + org + '/stamms/' + stamm + '/contigs/')
      .then(response => response.json())
      .then(contigs => dispatch({
        type: FETCH_CONTIGS,
        payload: contigs.sort(),
        stamm: stamm
      }));
  }
}


export function fetchComplexity(org, stamm, contig, method, pars, complexity_window) {
  return function (dispatch) {

    let pars_int = 0
    if (pars === true) {
      pars_int = 1
    }
    let url = SERVER_URL + '/org/' + org + '/stamms/' + stamm + '/contigs/' + contig + '/methods/' + method + '/pars/' + pars_int + '/complexity/window/' + complexity_window + '/'

    fetch(url)
      .then(response => response.json())
      .then(data => dispatch({
        type: FETCH_COMPLEXITY,
        payload: data,
        params: {
          org: org,
          stamm: stamm,
          contig: contig,
          method: method,
          pars: pars,
          complexity_window: complexity_window
        }
      }));
  }
}


export function putSelectedRef(org, stamm, contig, og_start, og_end, method, pars, operons, complexity_window) {
  return function (dispatch) {
    let pars_int = 0
    if (pars === true) pars_int = 1

    let operons_int = 0
    if (operons === true) operons_int = 1
    dispatch({
      type: PUT_SELECTION,
      payload: {
        complexity_window: complexity_window,
        org: org,
        stamm: stamm,
        contig: contig,
        og_start: og_start,
        og_end: og_end,
        method: method,
        pars_int: pars_int,
        operons_int: operons_int
      }
    })
  }
}
