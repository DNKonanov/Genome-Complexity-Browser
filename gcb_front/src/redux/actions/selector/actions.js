import {
    COORD_START_COORD_END,
    OG_START_S_OG_END_S, SEARCH_QUERY,
    SEARCH_RESULTS, SET_COORD_ON_CLICK,
    STAMM_GENOME_NAME
} from "../../constants/selector/constants";
import axios from 'axios';
import {SERVER_PORT, SERVER_URL} from "../../constants/urls";


export const setRequisite = (TYPE_NAME, value) => ({
    type: TYPE_NAME,
    payload: {
        [TYPE_NAME.toLowerCase()]: value,
    }
});

export const setOgStartOgEnd = (og_start_s, og_end_s) => ({
    type: OG_START_S_OG_END_S,
    payload: {
        og_start_s: og_start_s,
        og_end_s: og_end_s,
    }
});

export const setCoordStartCoordEnd = (coord_start, coord_end) => ({
    type: COORD_START_COORD_END,
    payload: {
        coord_start: coord_start,
        coord_end: coord_end,
    }
});

export const setStammGenomeName = (stamm, genome_name) => ({
    type: STAMM_GENOME_NAME,
    payload: {
        stamm: stamm,
        genome_name: genome_name,
    }
});

const axiosBaseUrl = axios.create({
    baseURL: SERVER_URL + SERVER_PORT,
});

export const loadGenName = (org, stamm, pars) => async (dispatch) => {
    try {
        const res = await axiosBaseUrl.get('/get_genes/org/' + org + '/strain/' + stamm + '/pars/' + pars.toString());
        dispatch({
            type: SEARCH_QUERY,
            payload: {
                search_query:res.data
            }
        });
    } catch (err) {

    }
};

export const setCoordOnClick = (og_start_s, og_end_s,coord_start, coord_end) => ({
    type: SET_COORD_ON_CLICK,
    payload: {
        og_start_s: og_start_s,
        og_end_s: og_end_s,
        coord_start: coord_start,
        coord_end: coord_end,
    }
});