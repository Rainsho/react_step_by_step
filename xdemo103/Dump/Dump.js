import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Dump extends Component {
  state = {
    count: 1,
  };

  add = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return (
      <div className="header">
        <h1>Hello {this.props.name}</h1>
        <p>{this.state.count}</p>
        <button onClick={this.add}>button</button>
      </div>
    );
  }
}

Dump.propTypes = {
  name: PropTypes.string,
};

export default Dump;
