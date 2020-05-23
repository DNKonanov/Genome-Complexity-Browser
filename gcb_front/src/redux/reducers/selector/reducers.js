import {
    ORG,
    STAMM,
    GENOME_NAME,
    METHOD,
    METHODS,
    CONTIG,
    OG_START_S,
    OG_END_S,
    COORD_START,
    COORD_END,
    PARS,
    OPERONS,
    DRAW_TYPES,
    DRAW_TYPE,
    DATA,
    SRC,
    COMPLEXITY_WINDOW,
    SEARCH_QUERY,
    SEARCH_RESULTS,

    OG_START_S_OG_END_S, COORD_START_COORD_END, STAMM_GENOME_NAME,
    SHOW_HOTSPOTS,
    COEF,

} from "../../constants/selector/constants";

const initiateState = {
    org: 'Escherichia_coli_300_genomes',
    stamm: 'GCF_000284495.1_ASM28449v1',
    genome_name: '',
    method: 'probabilistic complexity',
    methods: [
        'by strains complexity',
        'probabilistic complexity',
    ],
    contig: 'NC_011993.1',

    og_start_s: 'OG0001707',
    og_end_s: 'OG0001707',

    coord_start: 0,
    coord_end: 0,
    pars: false,
    operons: true,
    draw_types: ['line', 'markers'],
    draw_type: 'line',
    data: '',
    src: '',
    complexity_window: 20,
    search_query: '',
    search_results: [],
    // 23.05.2020
    show_hotspots: true,
    coef: 1.5
};

function complexityProfileSelector(state = initiateState, action) {
    switch (action.type) {
        case ORG:
            return {
                ...state,
                org: action.payload.org
            };
        case STAMM:
            return {
                ...state,
                stamm: action.payload.stamm
            };
        case GENOME_NAME:
            return {
                ...state,
                genome_name: action.payload.genome_name
            };
        case STAMM_GENOME_NAME:
            return {
                stamm: action.payload.stamm,
                genome_name: action.payload.genome_name
            };
        case METHOD:
            return {
                ...state,
                method: action.payload.method
            };
        case METHODS:
            return {
                ...state,
                methods: action.payload.methods
            };
        case CONTIG:
            return {
                ...state,
                contig: action.payload.contig
            };
        case OG_START_S:
            return {
                ...state,
                og_start_s: action.payload.og_start
            };
        case OG_END_S:
            return {
                ...state,
                og_end_s: action.payload.og_end
            };
        case OG_START_S_OG_END_S:
            return {
                ...state,
                og_start_s: action.payload.og_start_s,
                og_end_s: action.payload.og_end_s
            };
        ////////////////////////////////////
        case COORD_START:
            return {
                ...state,
                coord_start: action.payload.coord_start
            };
        case COORD_END:
            return {
                ...state,
                coord_end: action.payload.coord_end
            };
        case COORD_START_COORD_END:
            return {
                ...state,
                coord_start: action.payload.coord_start,
                coord_end: action.payload.coord_end,
            };
        case PARS:
            return {
                ...state,
                pars: action.payload.pars
            };
        case OPERONS:
            return {
                ...state,
                operons: action.payload.operons
            };
        case DRAW_TYPES:
            return {
                ...state,
                draw_types: action.payload.draw_types
            };
        case DRAW_TYPE:
            return {
                ...state,
                draw_type: action.payload.draw_type
            };
        case DATA:
            return {
                ...state,
                data: action.payload.data
            };
        case SRC:
            return {
                ...state,
                src: action.payload.src
            };
        case COMPLEXITY_WINDOW:
            return {
                ...state,
                complexity_window: action.payload.complexity_window
            };
        case SEARCH_QUERY:
            return {
                ...state,
                search_query: action.payload.search_query
            };
        case SEARCH_RESULTS:
            return {
                ...state,
                search_results: action.payload.search_results
            };
        // ========================REDUCER_CASE==============================
        case SHOW_HOTSPOTS:
            return {
                ...state,
                show_hotspots: action.payload.show_hotspots
            };
        case COEF:
            return {
                ...state,
                coef: action.payload.coef
            };

        default:
            return state;
    }
}

export default complexityProfileSelector;