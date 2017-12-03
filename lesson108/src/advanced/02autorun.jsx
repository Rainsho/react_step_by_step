import React from 'react';
import ReactDOM from 'react-dom';
import { observable, computed, autorun } from 'mobx';
import { observer } from 'mobx-react';

let count = 0;

class Store {
  @observable numbers = [1, 2, 3];

  @observable showSum = true;

  @computed get sum() {
    count++;
    return this.numbers.reduce((a, b) => a + b, 0);
  }
}

const store = new Store();

window.store = store;

@observer
class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.store = this.props.store;
    window.disposer = autorun(() => console.log(`numbers is ${store.numbers} count is ${count}`));
  }

  render() {
    return (
      <div>
        <ul>
          {this.store.numbers.map((x, i) => <li key={i}>{x}</li>)}
        </ul>
        {this.store.showSum && <b>sum is {this.store.sum}</b>}
      </div>
    )
  }
}

ReactDOM.render(
  <Demo store={store} />,
  document.getElementById('root'),
);
