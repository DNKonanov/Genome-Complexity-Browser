import {
  FETCH_ORGANISMS,
  FETCH_STAMMS,
  FETCH_CONTIGS,
  FETCH_COMPLEXITY,
  PUT_SELECTION
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


export function fetchComplexity(org, stamm, contig, method, pars) {
  return function (dispatch) {
    let pars_int = 0
    if (pars === true) {
      pars_int = 1
    }
    let url = SERVER_URL + '/org/' + org + '/stamms/' + stamm + '/contigs/' + contig + '/methods/' + method + '/pars/' + pars_int + '/complexity/'

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
          pars: pars
        }
      }));
  }
}


export function putSelectedRef(org, stamm, contig, og_start, og_end, method, pars, operons) {
  return function (dispatch) {
    let pars_int = 0
    if (pars === true) pars_int = 1

    let operons_int = 0
    if (operons === true) operons_int = 1
    dispatch({
      type: PUT_SELECTION,
      payload: {
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