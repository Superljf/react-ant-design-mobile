import React, { Component } from 'react'



class loadMore extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }


  render() {
    const { loadMore } = this.props;
    return (
      <div>
        {(loadMore) ?
          <div onClick={this.loadMore} style={{ textAlign: 'center' }}>加载更多</div> :
          (
            <div style={{ textAlign: 'center' }}>
              已加载全部
            </div>
          )}
      </div>
    );
  }
}

export default loadMore;