import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import { login, logout } from '../actions';
import { anony } from '../constants';

class DoerInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      pswd: '',
    };
    this.handleInput = this.handleInput.bind(this);
  }

  handleInput(key, e) {
    this.setState({ [key]: e.target.value });
  }

  render() {
    const { doer: { doers, current }, logout, intl } = this.props;
    const doer = doers[current];

    // for short
    const fmt = id => intl.formatMessage({ id });

    if (doer.uid !== anony.uid) {
      return (
        <div className="doer-info-welcome">
          <span>{`${fmt('COMMON.WELCOME')}: ${doer.name}`}</span>
          <a href="#" onClick={() => this.setState({ pswd: '' }, logout)}>
            {fmt('COMMON.LOGOUT')}
          </a>
        </div>
      );
    }

    const { login, msg } = this.props;
    const { name, pswd } = this.state;

    return (
      <div className="doer-info-regist">
        <label>{`${fmt('COMMON.NAME')}: `}</label>
        <input type="text" value={name} onChange={e => this.handleInput('name', e)} />
        <label>{`${fmt('COMMON.PSWD')}: `}</label>
        <input type="text" value={pswd} onChange={e => this.handleInput('pswd', e)} />
        <button onClick={() => login(name, pswd)}>{fmt('COMMON.LOGIN')}</button>
        {msg && <span>{msg}</span>}
      </div>
    );
  }
}

export default injectIntl(
  connect(store => ({ doer: store.doer, msg: store.msg }), { login, logout })(DoerInfo)
);
