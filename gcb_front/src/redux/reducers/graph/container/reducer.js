import {
    WINDOW,
    TAILS,
    DEPTH,
    FREQ_MIN,
    LAYOUT,
    LOADING,
    STEP,
    HIDE_EDGES,
    CY,
    EDGE_DESCRIPTION,
    JSON_FORMAT,
    SELECTED_NODES,
    USER_COLORS,

} from "../../../constants/graph/container/constants";
const initiateState = {
    //from gcb_front/src/redux/reducers/graph/container/reducer.js
    window: 5,
    tails: 1,
    depth: 30,
    freq_min: 2,
    layout: 'graphviz',
    loading: false,
    step: 1,
    hide_edges: true,
    // from gcb_front/src/components/graph/CytoscapeDagreGraph.js
    cy: false,
    edge_description: 'empty',
    json_format: '',
    selected_nodes: 'empty',
    user_colors: '',
};
function containerGraphReducer(state=initiateState, action) {
    switch (action.type) {
        case WINDOW:
            return {
                ...state,
                window: action.payload.window
            };
        case TAILS:
            return {
                ...state,
                tails: action.payload.tails
            };
        case DEPTH:
            return {
                ...state,
                depth: action.payload.depth
            };
        case FREQ_MIN:
            return {
                ...state,
                freq_min: action.payload.freq_min
            };
        case LAYOUT:
            return {
                ...state,
                layout: action.payload.layout
            };
        case LOADING:
            return {
                ...state,
                loading: action.payload.loading
            };
        case STEP:
            return {
                ...state,
                step: action.payload.step
            };
        case HIDE_EDGES:
            return {
                ...state,
                hide_edges: action.payload.hide_edges
            };
        case CY:
            return {
                ...state,
                cy: action.payload.cy
            };
        case EDGE_DESCRIPTION:
            return {
                ...state,
                edge_description: action.payload.edge_description
            };
        case JSON_FORMAT:
            return {
                ...state,
                json_format: action.payload.json_format
            };
        case SELECTED_NODES:
            return {
                ...state,
                selected_nodes: action.payload.selected_nodes
            };
        case USER_COLORS:
            return {
                ...state,
                user_colors: action.payload.user_colors
            };

        default:
            return state;
    }
}

export default containerGraphReducer;