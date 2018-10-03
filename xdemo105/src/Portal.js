import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Portal extends Component {
  render() {
    return ReactDOM.createPortal(<div>{this.props.children}</div>, document.body);
  }
}

export default Portal;
