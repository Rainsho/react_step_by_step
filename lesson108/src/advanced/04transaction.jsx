import React from 'react';
import ReactDOM from 'react-dom';
import { observable, transaction } from 'mobx';
import { observer } from 'mobx-react';

class Store {
  @observable count = 0;

  withoutTransaction() {
    this.count++;
    this.count++;
    this.count++;
  }

  withTransaction() {
    transaction(() => {
      transaction(() => {
        this.count++;
        this.count++;
      });
      this.count++;
    })
  }
}

const store = new Store();

@observer
class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.store = this.props.store;
    this.times = 0;
  }

  render() {
    console.log('render', ++this.times, 'times');
    return (
      <div>
        <h1>{`count is ${this.store.count}`}</h1>
        <button onClick={() => {
          new Promise(res => res())
            .then(() => this.store.withoutTransaction());
        }}>withoutTransaction</button>
        <br />
        <button onClick={() => {
          new Promise(res => res())
            .then(() => this.store.withTransaction());
        }}>withTransaction</button>
      </div>
    );
  }
}

ReactDOM.render(
  <Demo store={store} />,
  document.getElementById('root'),
);
