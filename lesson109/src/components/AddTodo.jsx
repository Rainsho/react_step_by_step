import React from 'react';

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
    this.props.addTodo(this.state.content);
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
