import React from 'react';
import { IntlProvider, addLocaleData } from 'react-intl';
import { connect } from 'react-redux';

import locales from '../../res/locales';
import { changeLocale } from '../actions';
import Radio from '../components/Radio';

addLocaleData(locales);

let intl = null;

class TodoIntl extends React.Component {
  componentDidMount() {
    // 向外暴露 intl 对象及相关方法
    // 并无意义!!! 此时 UI 已使用错误的 intl 渲染完成
    intl = this.el.getChildContext().intl;
  }

  componentDidUpdate() {
    // 向外暴露 intl 对象及相关方法
    // 并无意义!!! 此时 UI 已使用错误的 intl 渲染完成
    intl = this.el.getChildContext().intl;
  }

  render() {
    const { changeLocale, children, locale } = this.props;
    const message = locales.find(x => x.locale === locale);

    intl = message;

    const radios = locales.map(x => (
      <Radio
        key={x.locale}
        value={x.locale}
        checked={x.locale === locale}
        onChange={changeLocale}
      />
    ));

    return (
      <IntlProvider locale={locale} messages={message} ref={el => (this.el = el)}>
        <div>
          <div className="intl-control">{radios}</div>
          {children}
        </div>
      </IntlProvider>
    );
  }
}

export default connect(store => ({ locale: store.todoIntl }), { changeLocale })(TodoIntl);

export function formatMessage(id, defaultMessage, options) {
  if (!intl || !intl.formatMessage) {
    // throw new Error('INTL NOT FOUND');
    return;
  }

  return intl.formatMessage({ id, defaultMessage }, options);
}
