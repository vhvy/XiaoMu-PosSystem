import { combineReducers } from "redux";
import { categories } from "./categories";
import { commodity } from "./commodity";
import { stock } from "./stock";

export const warehouse = combineReducers({
    categories,
    commodity,
    stock
});