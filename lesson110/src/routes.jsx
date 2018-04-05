import React from 'react';
import { Route, IndexRoute, Link } from 'react-router';

import TodoIntl from './containers/TodoIntl';
import App from './containers/TodoApp';
import TodoList from './containers/TodoList';

const routes = (
  <Route path="/" component={TodoIntl}>
    <Route component={App}>
      <IndexRoute component={TodoList} />
      <Route path="home" component={TodoList} />
    </Route>
  </Route>
);

export default routes;
