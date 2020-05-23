import {
    FETCH_ORGANISMS,
    FETCH_STAMMS,
    FETCH_CONTIGS,
    FETCH_COMPLEXITY,
    PUT_SELECTION,
    FETCH_WINDOWS
} from "../constants/action-types";

import {
    SERVER_URL,
    SERVER_PORT
} from "../constants/urls";

import axios from 'axios';

const axiosFetch = axios.create({baseURL: SERVER_URL + SERVER_PORT});

export function fetchOrganisms() {
    return function (dispatch) {
        fetch(SERVER_URL + SERVER_PORT + '/org/')
            .then(response => response.json())
            .then(organisms => dispatch({
                type: FETCH_ORGANISMS,
                payload: organisms.sort()
            }));
    }
}

export function fetchStammsForOrg(org) {
    return function (dispatch) {
        fetch(SERVER_URL + SERVER_PORT + '/org/' + org + '/stamms/')
            .then(response => response.json())
            .then(stamms => dispatch({
                type: FETCH_STAMMS,
                payload: stamms,
                org: org
            }));
    }
}

export function fetchWindows(org, stamm, pars) {
    return function (dispatch) {
        let pars_int = 0;
        if (pars === true) {
            pars_int = 1
        }
        fetch(SERVER_URL + SERVER_PORT + '/org/' + org + '/stamms/' + stamm + '/complexity_windows/pars/' + pars_int)
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
        fetch(SERVER_URL + SERVER_PORT + '/org/' + org + '/stamms/' + stamm + '/contigs/')
            .then(response => response.json())
            .then(contigs => dispatch({
                type: FETCH_CONTIGS,
                payload: contigs.sort(),
                stamm: stamm
            }));
    }
}


export function fetchComplexity(org, stamm, contig, method, pars, complexity_window, coef) {
  return function (dispatch) {

    let pars_int = 0;
    if (pars === true) {
      pars_int = 1
    }
    let url = SERVER_URL + SERVER_PORT + '/org/' + org + '/stamms/' + stamm + '/contigs/' + contig + '/methods/' + method + '/pars/' + pars_int + '/complexity/window/' + complexity_window + '/coef/' + coef

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
          complexity_window: complexity_window,
          coef: coef,
        }
    }));
  }
}

export const fetchComplexityt = (org, stamm, contig, method, pars, complexity_window) => async dispatch => {

    const otherUrlPart = '/org/' + org + '/stamms/' + stamm + '/contigs/' + contig + '/methods/' + method + '/pars/' + pars === true ? 1 : 0 + '/complexity/window/' + complexity_window + '/';

    try {
        const res = await axiosFetch.get(otherUrlPart);
        dispatch({
            type: FETCH_COMPLEXITY,
            payload: res.data,
            params: {
                org: org,
                stamm: stamm,
                contig: contig,
                method: method,
                pars: pars,
                complexity_window: complexity_window
            }
        });
    } catch (err) {
        console.log('trouble')
    }
};

export const putSelectedRef = (org, stamm, contig, og_start_s, og_end_s, method, pars, operons, complexity_window) => ({
    type: PUT_SELECTION,
    payload: {
        complexity_window: complexity_window,
        org: org,
        stamm: stamm,
        contig: contig,

        og_start: og_start_s,
        og_end: og_end_s,

        method: method,
        pars_int: pars === true ? 1 : 0,
        operons_int: operons === true ? 1 : 0,
    }
});

