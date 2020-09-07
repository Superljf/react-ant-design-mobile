import React from 'react';

class Container extends React.PureComponent{
  render() {
    const { children } = this.props;
    return (
      <div>
        {children}
      </div>
    );
  }
}

export default Container;
