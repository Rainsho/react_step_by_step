import React from 'react';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router';

import DoerInfo from './DoerInfo';

const App = ({ intl, children }) => (
  <div>
    <h1>{intl.formatMessage({ id: 'COMMON.HELLO' })}</h1>
    <DoerInfo />
    <hr />
    {children}
    <footer>
      <Link to="home">{intl.formatMessage({ id: 'COMMON.HELLO' })}</Link>
    </footer>
  </div>
);

export default injectIntl(App);
