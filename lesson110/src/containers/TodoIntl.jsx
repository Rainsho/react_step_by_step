import React from 'react';
import { IntlProvider, addLocaleData } from 'react-intl';
import { connect } from 'react-redux';

import locales from '../../res/locales';
import { changeLocale } from '../actions';

addLocaleData(locales);

class TodoIntl extends React.Component {
  render() {
    const { changeLocale, children, locale } = this.props;
    const message = locales.find(x => x.locale === locale);

    const radios = locales.map(x => (
      <span key={x.locale}>
        <input
          type="radio"
          name="locale"
          value={x.locale}
          onChange={changeLocale}
          checked={x.locale === locale}
        />
        <label>{x.locale}</label>
      </span>
    ));

    return (
      <IntlProvider locale={locale} messages={message}>
        <div>
          <div className="intl-control">{radios}</div>
          {children}
        </div>
      </IntlProvider>
    );
  }
}

export default connect(store => ({ locale: store.todoIntl }), { changeLocale })(TodoIntl);
