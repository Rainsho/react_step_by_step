import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import { addTodo, markTodo, deleteTodo } from '../actions';
// import { anony } from '../constants';
import AddTodo from '../components/AddTodo';
import TodoView from '../components/TodoView';

const TodoList = (props) => {
  const { doer: { doers, current }, todos, intl, addTodo, markTodo, deleteTodo } = props;
  const doer = doers[current];

  // for short
  const fmt = id => intl.formatMessage({ id });

  const views = Object.values(todos).map(x => (
    <TodoView
      key={x.tid}
      todo={Object.assign({}, x, { uname: doers[x.uid].name })}
      markTodo={markTodo}
      deleteTodo={deleteTodo}
    />
  ));

  return (
    <div>
      <AddTodo addTodo={content => addTodo(doer.uid, content)} />
      <div style={{ display: Object.values(todos).length > 0 ? 'block' : 'none' }}>
        <div className="todo-title">
          <span>{fmt('COMMON.DONE')}</span>
          <span>{fmt('COMMON.USER')}</span>
          <span>{fmt('COMMON.CONTENT')}</span>
          <span>{fmt('COMMON.OPERATE')}</span>
        </div>
        {views}
      </div>
    </div>
  );
};

export default injectIntl(
  connect(
    store => ({
      doer: store.doer,
      todos: store.todos,
    }),
    { addTodo, markTodo, deleteTodo }
  )(TodoList)
);
