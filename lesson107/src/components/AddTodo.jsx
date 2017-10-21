import React from 'react';
import action from '../actions/TodoAction';

export default class AddTodo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInput(e) {
    this.setState({ content: e.target.value });
  }

  handleSubmit() {
    const content = this.state.content;
    this.setState({ content: '' }, () => {
      action.addTodo(content);
    });
  }

  render() {
    return (
      <div>
        <input
          type="text"
          value={this.state.content}
          onChange={this.handleInput}
        /><button onClick={this.handleSubmit}>Add Todo</button>
      </div>
    );
  }
}
