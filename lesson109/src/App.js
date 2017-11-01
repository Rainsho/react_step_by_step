import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DoerInfo from '../components/DoerInfo';
import AddTodo from '../components/AddTodo';
import TodoList from '../components/TodoList';
import * as TodoActions from '../actions/TodoActionCreator';

const App = ({data, actions}) => (
  <div>
    <DoerInfo data={data} login={actions.createLoginAction} register={actions.createRegisterAction} logout={actions.createLogoutAction} />
    <AddTodo addTodo={actions.createAddTodoAction} />
    <TodoList todos={data.todos} deleteTodo={actions.createDeleteTodoAction} mark={actions.createMarkTodoAction} />
  </div>
)

const mapStateToProps = state => ({
  data:{
      todos:state.TodoReducer.todos,
      doers:state.TodoReducer.doers,
      doer:state.TodoReducer.doer,
      errMsg:state.TodoReducer.errMsg
  }
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(TodoActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
