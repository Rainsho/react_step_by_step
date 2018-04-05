import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

class DoerStatistic extends React.Component {
  componentWillMount() {
    this.checkExist(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkExist(nextProps);
  }

  checkExist(props) {
    const { doer, dispatch } = props;
    if (!doer) dispatch(push('/home'));
  }

  render() {
    const { doer, todos, intl } = this.props;
    if (!doer) return null;

    // for short
    const fmt = id => intl.formatMessage({ id });

    const allTodos = Object.values(todos).filter(x => x.uid === doer.uid);
    const undone = allTodos.filter(x => !x.done).length;
    const done = allTodos.length - undone;

    // console.log(this.props);
    return (
      <div>
        <h2>{doer.name}</h2>
        <div className="doer-statistic">
          <span style={{ width: undone / allTodos.length * 100 + '%' }}>{`${fmt(
            'COMMON.UNDONE'
          )}: ${undone}`}</span>
          <span style={{ width: done / allTodos.length * 100 + '%' }}>{`${fmt(
            'COMMON.DONE'
          )}: ${done}`}</span>
        </div>
      </div>
    );
  }
}

export default injectIntl(
  connect((store, ownProps) => ({
    doer: store.doer.doers[ownProps.params.uid],
    todos: store.todos,
  }))(DoerStatistic)
);
