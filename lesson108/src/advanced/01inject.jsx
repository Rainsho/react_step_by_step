import React from 'react';
import ReactDOM from 'react-dom';
import { observable } from 'mobx';
import { observer, inject, Provider } from 'mobx-react';

class Store {
  @observable name = 'Rainsho';
}

const store = new Store();

window.store = store;

@inject('store')
@observer
class Hello1 extends React.Component {
  render() {
    return <h1>hello, {this.props.store.name}</h1>;
  }
}

@inject(stores => ({
  name: stores.store.name,
}))
@observer
class Hello2 extends React.Component {
  render() {
    return <h1>hello, {this.props.name}</h1>;
  }
}

ReactDOM.render(
  <Provider store={store}>
    <div>
      <Hello1 />
      <Hello2 />
    </div>
  </Provider>,
  document.getElementById('root'),
);
