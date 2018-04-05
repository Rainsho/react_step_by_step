import React from 'react';
import { injectIntl } from 'react-intl';

const App = ({ intl, children }) => (
  <div>
    <h1>{intl.formatMessage({ id: 'COMMON.HELLO' })}</h1>
    {/* <DoerInfo /> */}
    {/* <AddTodo /> */}
    <hr />
    {children}
  </div>
);

export default injectIntl(App);
