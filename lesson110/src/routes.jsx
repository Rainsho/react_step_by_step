import React from 'react';
import { Route, IndexRoute } from 'react-router';

import TodoIntl from './containers/TodoIntl';
import TodoApp from './containers/TodoApp';
import TodoList from './containers/TodoList';
import DoerStatistic from './containers/DoerStatistic';

const routes = (
  <Route path="/" component={TodoIntl}>
    <Route component={TodoApp}>
      <IndexRoute component={TodoList} />
      <Route path="home" component={TodoList} />
      <Route path="user/:uid" component={DoerStatistic} />
    </Route>
  </Route>
);

export default routes;
