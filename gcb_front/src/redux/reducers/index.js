import {combineReducers} from 'redux';
import referenceReducer from './referenceReducer';
import graphReducer from './graphReducer'
import fileCoordinates from "./file/reducers";
import { reducer as formReducer } from 'redux-form'
import complexityProfileSelector from "./selector/reducers";

export default combineReducers({
    reference: referenceReducer,
    graph: graphReducer,
    file: fileCoordinates,
    requisite: complexityProfileSelector,

    form: formReducer,
});