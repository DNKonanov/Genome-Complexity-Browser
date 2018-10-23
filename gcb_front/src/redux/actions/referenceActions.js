import {
  FETCH_ORGANISMS
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