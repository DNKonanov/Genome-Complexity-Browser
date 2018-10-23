import {
  FETCH_ORGANISMS, FETCH_STAMMS, FETCH_CONTIGS
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