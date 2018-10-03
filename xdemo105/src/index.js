import React from 'react';
import ReactDOM from 'react-dom';

const Bracketed = (nextProps, prevState) => {
  if (nextProps.nick === 'Iron Man') {
    return { name: `[${prevState.name}]` };
  }

  return null;
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Tony',
    };
  }

  // static getDerivedStateFromProps = Bracketed;

  render() {
    return (
      <div>
        <h1>{this.state.name}</h1>
        <h1>{this.props.nick}</h1>
        <button onClick={() => this.setState({ name: 'Hulk' })}>change do Hulk</button>
      </div>
    );
  }
}

App.getDerivedStateFromProps = Bracketed;

class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nick: '',
    };
  }

  render() {
    return (
      <div onClick={() => this.setState({ nick: 'Iron Man' })}>
        <App nick={this.state.nick} />
      </div>
    );
  }
}

ReactDOM.render(<Root />, document.body.appendChild(document.createElement('div')));
