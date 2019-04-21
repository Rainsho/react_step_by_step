import React from 'react';

// 静态方法可抽出
const Bracketed = (nextProps, prevState) => {
  if (nextProps.nick === 'Iron Man') {
    return { name: `[${prevState.name}]` };
  }

  return null;
};

class A extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Tony',
    };

    this.listRef = React.createRef();
  }

  static getDerivedStateFromProps = Bracketed;

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // 服务 componentDidUpdate
    if (prevProps.list.length < this.props.list.length && this.listRef.current) {
      const list = this.listRef.current;
      return list.scrollHeight - list.scrollTop;
    }

    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // 配合 getSnapshotBeforeUpdate
    if (snapshot !== null) {
      const list = this.listRef.current;
      // -> <h1>{this.props.nick}</h1>
      list.scrollTop = list.scrollHeight - snapshot;
    }
  }

  render() {
    return (
      <div>
        <h1>{this.state.name}</h1>
        <div
          ref={this.listRef}
          style={{
            width: 200,
            height: 400,
            overflow: 'auto',
            border: '1px solid',
          }}
        >
          {this.props.list.map(x => (
            <div key={x} onClick={this.props.double}>
              {x}
            </div>
          ))}
          <h1>{this.props.nick}</h1>
        </div>
        <button
          onClick={e => {
            e.stopPropagation();
            this.setState({ name: 'Hulk' });
          }}
        >
          change do Hulk
        </button>
        <button
          onClick={e => {
            e.stopPropagation();
            this.setState({ err: 'hehe' });
          }}
        >
          {this.state.err ? this.state.err.err.err : 'throw'}
        </button>
      </div>
    );
  }
}

// App.getDerivedStateFromProps = Bracketed;

class B extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nick: 'Who am I',
      list: new Array(10).fill(1).map((c, i) => i),
    };
  }

  componentDidCatch(error, info) {
    // 捕获子组件的异常
    console.error(error);
    console.info(info);
    this.setState({ hasError: true });
  }

  double = e => {
    e.stopPropagation();

    let list = this.state.list;
    // list = list.concat(list.map(x => x + list.length));
    list = list.concat(new Array(10).fill(1).map((x, i) => i + list.length));
    this.setState({ list });
  };

  render() {
    if (this.state.hasError) return <h1>404</h1>;

    return (
      <div
        onClick={e => {
          e.stopPropagation();
          this.setState({ nick: 'Iron Man' });
        }}
      >
        <A nick={this.state.nick} list={this.state.list} double={this.double} />
        <h1>Root H1 Marker</h1>
      </div>
    );
  }
}

export default B;
