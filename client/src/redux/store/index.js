import { reduces } from "../reduces";
import { createStore } from "redux";

export const store = createStore(
    reduces,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()   
);