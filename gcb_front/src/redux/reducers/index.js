import {combineReducers} from 'redux';
import referenceReducer from './referenceReducer';
import graphReducer from './graph/graphReducer'
import fileCoordinates from "./file/reducers";
import {reducer as formReducer} from 'redux-form'
import complexityProfileSelector from "./selector/reducers";
import containerGraphReducer from "./graph/container/reducer";
import componentsProps from "./components/reducers";


export default combineReducers({
    reference: referenceReducer,
    graph: graphReducer,
    //buttons
    file: fileCoordinates,
    // reference
    requisite: complexityProfileSelector,
    // graph container
    container: containerGraphReducer,
    // components
    components:componentsProps,
    form: formReducer,
});