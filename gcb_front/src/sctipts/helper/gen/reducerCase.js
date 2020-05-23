const initiateState = {
    show_hotspots: true,
    coef: 1.5
};

console.log('======================CONSTANTS==============================');
let constants = Object.keys(initiateState).map(
    (key) => {
        console.log('export const ' + key.toUpperCase() + ' = ' + '\'' + key.toUpperCase() + '\'' + ';');
    }
);

console.log('======================ACTIONS===========================');
let keyName = Object.keys(initiateState).map((key) => {
    console.log('export const set' + key[0].toUpperCase() + key.slice(1) + ' = (' + key + ') => ({' + '\n' +
        '    type:' + key.toUpperCase() + ',' + '\n' +
        '    payload: {\n' +
        '        ' + key + ':' + key + '\n' +
        '    }\n' +
        '});')
});

console.log('========================REDUCER_CASE==============================');
let key = Object.keys(initiateState).map((key) => {
    console.log('case ' + key.toUpperCase() + ':\n' +
        '            return {\n' +
        '                ...state,\n' +
        '                ' + key + ': action.payload.' + key + '\n' +
        '            };')
});
console.log('======================SET_TO_MAP_TO_STATE_PROPS=============================');
let mapToState = Object.keys(initiateState).map((key) => {
    console.log(key + ':' + 'state.components_props.' + key + ',');
});

console.log('=======================IMPORT_CONSTANTS===============================');
let constName = Object.keys(initiateState).map(
    (key) => {
        console.log(key.toUpperCase() + ',');
    }
);

