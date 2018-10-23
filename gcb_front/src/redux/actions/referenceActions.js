import {
  FETCH_ORGANISMS,
  FETCH_STAMMS,
  FETCH_CONTIGS,
  FETCH_COMPLEXITY
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
        payload: organisms
      }));
  }
}

export function fetchStammsForOrg(org) {
  return function (dispatch) {
    fetch(SERVER_URL + '/org/' + org + '/stamms/')
      .then(response => response.json())
      .then(stamms => dispatch({
        type: FETCH_STAMMS,
        payload: stamms,
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
        payload: contigs,
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