import React from "react";
import { Router, Switch, Route } from 'dva/router';

import Home from "./view/home/index";

const RouterConfig = ({ history }) => {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" component={Home} />
      </Switch>
    </Router>
  )
}

export default RouterConfig