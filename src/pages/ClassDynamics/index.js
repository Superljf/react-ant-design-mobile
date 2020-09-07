import React, { Component, } from 'react';
import { NavBar, Icon } from 'antd-mobile';
import router from 'umi/router';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import nativeApi from '../../utils/nativeApi';
import DynamicsList from '@/pages/components/DynamicsList/dynamicList'
import wxApi from '../../utils/wxApi';
import styles from './index.less';
import MenuBar from './MenuBar';

@connect(({ dynamicsList }) => ({
  dynamicsList,
}))


class ClassDynamics extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      marginTop: 0,
    };
  }



  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const marginTop = document.getElementById('navContianer').offsetHeight;
    this.setState({ marginTop });
    nativeApi.onBackPressed(() => {
      nativeApi.onBackPressed(null);
      nativeApi.close();
    })
  }

  componentWillUnmount() {
    this.setState = () => { }
  }

  goMinePublic = () => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: `/minePublic`,
      })
    )
  }

  render() {
    const { marginTop } = this.state;
    return (
      <div>
        <div id='navContianer'>
          <NavBar
            rightContent={[
              <span style={{ fontSize: '14px' }} onClick={this.goMinePublic}>我发布的</span>
            ]}
            mode="dark"
            icon={<Icon type='left' />}
            onLeftClick={
              () => {
                if (wxApi.isWeixinBrowser()) {
                  router.goBack();
                  return;
                }
                nativeApi.close()
              }
            }
            style={{ backgroundColor: '#199ED8', }}
          >
            班级动态
          </NavBar>
        </div>
        <div style={{ marginTop: `${marginTop}px` }}>
          <MenuBar />
          <DynamicsList />
        </div>
      </div>
    );
  }
}

export default ClassDynamics;
