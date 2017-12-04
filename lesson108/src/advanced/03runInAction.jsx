import React from 'react';
import ReactDOM from 'react-dom';
import { observable, action, useStrict, runInAction } from 'mobx';
import { observer } from 'mobx-react';

useStrict(true);

class Store {
  @observable state = 'waiting';

  @action.bound
  asyncAction1() {
    new Promise((res, rej) => {
      this.state = 'pending';
      const callback = Math.random() > 0.5 ? res : rej;
      setTimeout(callback, 1000);
    })
      .then(() => {
        this.state = 'done';
      })
      .catch(() => {
        this.state = 'error';
      });
  }

  @action.bound
  handleDone() {
    this.state = 'done';
  }

  @action.bound
  handleError() {
    this.state = 'error';
  }

  @action.bound
  asyncAction2() {
    new Promise((res, rej) => {
      this.state = 'pending';
      const callback = Math.random() > 0.5 ? res : rej;
      setTimeout(callback, 1000);
    })
      .then(this.handleDone)
      .catch(this.handleError);
  }

  @action.bound
  asyncAction3() {
    new Promise((res, rej) => {
      this.state = 'pending';
      const callback = Math.random() > 0.5 ? res : rej;
      setTimeout(callback, 1000);
    })
      .then(() => {
        runInAction(() => {
          this.state = 'done';
        });
      })
      .catch(() => {
        runInAction(() => {
          this.state = 'error';
        });
      });
  }
}

const store = new Store();

@observer
class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.store = this.props.store;
  }

  render() {
    return (
      <div>
        <h1>{this.store.state}</h1>
        <button onClick={this.store.asyncAction1}>callback not in action</button>
        <br />
        <button onClick={this.store.asyncAction2}>callback other action</button>
        <br />
        <button onClick={this.store.asyncAction3}>callback runInAction</button>
      </div>
    )
  }
}

ReactDOM.render(
  <Demo store={store} />,
  document.getElementById('root'),
);
