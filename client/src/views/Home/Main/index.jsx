import React from "react";
import { Switch, Route } from "react-router-dom";

export function Main() {
    
    return (
        <Switch>
            <Route exact path="/home" >
                <div>????</div>
            </Route>
            <Route exact path="/home/market/cash" >
                <div>/home/market/cash</div>
            </Route>
        </Switch>
    );
}