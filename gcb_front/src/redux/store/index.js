import {applyMiddleware, compose, createStore} from "redux";
import rootReducer from "../reducers/index";
import thunk from 'redux-thunk'

const initialState = {};

const middleware = [thunk];
const reduxDevtools = window.__REDUX_DEVTOOLS_EXTENSION__;
const store = createStore(
    rootReducer,

    initialState,
    compose(
        applyMiddleware(...middleware),
        reduxDevtools && reduxDevtools(),
    )
);

export default store;