import {OG_START_S_OG_END_S, COORD_START_COORD_END,STAMM_GENOME_NAME} from "../../constants/selector/constants";

export const setRequisite = (TYPE_NAME, value) =>({
   type: TYPE_NAME,
   payload:{
       [TYPE_NAME.toLowerCase()]: value,
   }
});

export const setOgStartOgEnd = (og_start_s,og_end_s) =>({
    type:OG_START_S_OG_END_S,
    payload:{
        og_start_s:og_start_s,
        og_end_s:og_end_s,
    }
});

export const setCoordStartCoordEnd = (coord_start,coord_end) =>({
    type:COORD_START_COORD_END,
    payload:{
        coord_start:coord_start,
        coord_end:coord_end,
    }
});

export const setStammGenomeName = (stamm,genome_name) =>({
    type:STAMM_GENOME_NAME,
    payload:{
        stamm:stamm,
        genome_name:genome_name,
    }
});
