import React from 'react';

export default class DoerInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      pswd: '',
    };
    this.handleLogout = this.handleLogout.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
  }

  handleInput(key, e) {
    this.setState({ [key]: e.target.value });
  }

  handleLogout(e) {
    e.preventDefault();
    this.setState({ name: '', pswd: '' }, this.props.logout);
  }

  handleLogin() {
    this.props.login(this.state.name, this.state.pswd);
  }

   handleRegister() {
    this.props.register(this.state.name, this.state.pswd);
  }

  render() {
    const { doer, errMsg } = this.props.data;
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
        /><button onClick={this.handleLogin}>Login</button>
        <button onClick={this.handleRegister}>Register</button>
        {errMsg && <span>{errMsg}</span>}
      </div>
    );
  }
}
