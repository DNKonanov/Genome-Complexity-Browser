
export const setRequisite = (TYPE_NAME, value) =>({
   type: TYPE_NAME,
   payload:{
       [TYPE_NAME.toLowerCase()]: value,
   }
});


// script ro create all this boring actions code gen
// let state = {
//     org: 'Escherichia_coli_300_genomes',
//     stamm: 'GCF_000284495.1_ASM28449v1',
//     genome_name: '',
//     method: 'probabilistic complexity',
    ////////////////
    // methods: [
    //     'by strains complexity',
    //     'probabilistic complexity',
    // ],
    // contig: 'NC_011993.1',
    // og_start: 'OG0001707',
    // og_end: 'OG0001707',
    // coord_start: 0,
    // coord_end: 0,
    // pars: false,
    // operons: true,
    //
    // draw_types: ['line', 'markers'],
    // draw_type: 'line',
    // data: '',
    // src: '',
    // complexity_window: 20,
    // search_query: '',
    // search_results: [],
// };
// let keyName = Object.keys(state).map((key) => {
//     console.log('export const set'+ key[0].toUpperCase() + key.slice(1) +' = ('+key+') => ({'+'\n' +
//         '    type:' + key.toUpperCase()+',' +'\n' +
//         '    payload: {\n' +
//         '        '+key+':' + key+'\n' +
//         '    }\n' +
//         '});')
// });