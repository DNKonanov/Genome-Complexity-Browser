import  { combineReducers } from 'redux';
import referenceReducer from './referenceReducer';
import graphReducer from './graphReducer'

export default combineReducers({
  reference: referenceReducer,
  graph: graphReducer
});