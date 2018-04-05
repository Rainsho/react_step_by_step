import React from 'react';
import { Route, IndexRoute, Link } from 'react-router';
import { FormattedRelative } from 'react-intl';

import TodoIntl from './containers/TodoIntl';
import App from './containers/TodoApp';

const A = () => (
  <div>
    <FormattedRelative value={Date.now() - Math.random() * 1e10} />
    <h1>A</h1>
    <Link to="b">link</Link>
  </div>
);

const B = () => (
  <div>
    <FormattedRelative value={Date.now() - Math.random() * 1e10} />
    <h1>B</h1>
    <Link to="a">link</Link>
  </div>
);

export default (
  <Route path="/" component={TodoIntl}>
    <Route component={App}>
      <IndexRoute component={A} />
      <Route path="a" component={A} />
      <Route path="b" component={B} />
    </Route>
  </Route>
);
