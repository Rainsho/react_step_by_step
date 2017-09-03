import React from 'react';

class TodoList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            todos: ['eat', 'code', 'sleep'],
        };
        this.handleChange = this.handleChange.bind(this);
        this.addTodo = this.addTodo.bind(this);
    }

    handleChange(e) {
        this.setState({ text: e.target.value });
    }

    addTodo() {
        const todos = [...this.state.todos];
        const text = this.state.text;
        todos.push(text);
        this.setState({ text: '', todos });
    }

    render() {
        const lis = this.state.todos.map(x => <li>{x}</li>);
        return (
            <div>
                <h1>Todo List</h1>
                <input type="text" value={this.state.text} onChange={this.handleChange} />
                <button onClick={this.addTodo}>Add Todo</button>
                <hr />
                <ul>{lis}</ul>
            </div>
        );
    }
}

export default TodoList;
