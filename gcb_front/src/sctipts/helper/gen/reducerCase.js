const initiateState = {
    disabled_select_reference:false,
};
console.log('=================================================================');
let key = Object.keys(initiateState).map((key) => {
    console.log('case ' + key.toUpperCase() + ':\n' +
        '            return {\n' +
        '                ...state,\n' +
        '                ' + key + ': action.payload.' + key + '\n' +
        '            };')
});
console.log('=================================================================');
let mapToState = Object.keys(initiateState).map((key) => {
    console.log(key + ':' + 'state.components_props.' + key + ',');
});
console.log('=================================================================');
let constants = Object.keys(initiateState).map(
    (key) => {
        console.log('export const ' + key.toUpperCase() + ' = ' + '\'' + key.toUpperCase() + '\'' + ';');
    }
);
console.log('=================================================================');
let constName = Object.keys(initiateState).map(
    (key) => {
        console.log(key.toUpperCase() + ',');
    }
);
console.log('=================================================================');
let keyName = Object.keys(initiateState).map((key) => {
    console.log('export const set' + key[0].toUpperCase() + key.slice(1) + ' = (' + key + ') => ({' + '\n' +
        '    type:' + key.toUpperCase() + ',' + '\n' +
        '    payload: {\n' +
        '        ' + key + ':' + key + '\n' +
        '    }\n' +
        '});')
});
