import React from 'react';
import store from '../stores/TodoStore';
import action from '../actions/TodoAction';
import { DOER_CHANGE } from '../constants/TodoEvents';

export default class DoerInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      doer: store.getDoer(),
      errMsg: store.getErrMsg(),
      name: '',
      pswd: '',
    };
    this.handleLogout = this.handleLogout.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  componentDidMount() {
    store.on(DOER_CHANGE, () => {
      this.setState({
        doer: store.getDoer(),
        errMsg: store.getErrMsg(),
      });
    });
  }

  componentWillUnmount() {
    store.removeListener(DOER_CHANGE);
  }

  handleInput(key, e) {
    this.setState({ [key]: e.target.value });
  }

  handleLogout(e) {
    e.preventDefault();
    this.setState({ name: '', pswd: '' }, action.logout);
  }

  handleLogin() {
    const { name, pswd } = this.state;
    action.login(name, pswd);
  }

  render() {
    const { doer, errMsg } = this.state;
    if (doer) {
      return (
        <div className="doer-info-welcome">
          <span>{`Welecome: ${doer.name}`}</span>
          <a href="#" onClick={this.handleLogout}>Logout</a>
        </div>
      );
    }
    return (
      <div className="doer-info-regist">
        <label>name: </label><input
          type="text"
          value={this.state.name}
          onChange={(e) => { this.handleInput('name', e); }}
        /><label>password: </label><input
          type="text"
          value={this.state.pswd}
          onChange={(e) => { this.handleInput('pswd', e); }}
        /><button onClick={this.handleLogin}>Regist/Login</button>
        {errMsg && <span>{errMsg}</span>}
      </div>
    );
  }
}
