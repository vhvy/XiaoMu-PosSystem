import { combineReducers } from "redux";
import { categories } from "./categories";
import { commodity } from "./commodity";

export const warehouse = combineReducers({
    categories,
    commodity
});