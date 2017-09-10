import React from 'react';
import ReactDOM from 'react-dom';
import TodoList from './TodoList';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <TodoList />
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);
