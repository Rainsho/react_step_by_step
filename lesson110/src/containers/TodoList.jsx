import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import { addTodo } from '../actions';
// import { anony } from '../constants';
import AddTodo from '../components/AddTodo';

class TodoList extends React.Component {
  render() {
    const { doer, todos, intl, addTodo } = this.props;

    // for short
    const fmt = id => intl.formatMessage({ id });

    return <AddTodo addTodo={content => addTodo(doer.uid, content)} />;
  }
}

export default injectIntl(
  connect(store => ({ doer: store.doer, todos: store.todos }), { addTodo })(TodoList)
);
