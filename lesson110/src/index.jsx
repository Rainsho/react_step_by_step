import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { FormattedRelative } from 'react-intl';

import store from './store';
import TodoIntl from './containers/TodoIntl';

const App = () => (
  <Provider store={store}>
    <TodoIntl>
      <FormattedRelative value={Date.now() - Math.random() * 1e10} />
    </TodoIntl>
  </Provider>
);

ReactDOM.render(<App />, document.getElementById('root'));
