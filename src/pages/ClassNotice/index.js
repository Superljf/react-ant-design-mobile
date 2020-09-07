import React from 'react';
import {NavBar, Icon} from 'antd-mobile';
import router from 'umi/router';
import { getUrlParamReg, historyBack } from '../../utils/utils';
import List from './List';
import nativeApi from '../../utils/nativeApi';
import wxApi from '../../utils/wxApi';

class ClassNotice extends React.PureComponent{
  state = {
    marginTop: 0,
  };

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const marginTop = document.getElementById('navContianer').offsetHeight;
    this.setState({marginTop});
    nativeApi.onBackPressed(() => {
      nativeApi.onBackPressed(null);
      nativeApi.close();
    })
  }

  componentWillUnmount() {
    this.setState = () => {}
  }

  render() {
    const {marginTop} = this.state;

    return(
      <div>
        <div id='navContianer'>
          <NavBar
            mode="dark"
            icon={<Icon type='left' />}
            onLeftClick={
              () => {
                if(wxApi.isWeixinBrowser()){
                  router.goBack();
                  return;
                }
                nativeApi.close()
              }
            }
            style={{backgroundColor: '#1bc376'}}
          >
            班级通知
          </NavBar>
        </div>
        <div style={{marginTop: `${marginTop}px`}}>
          <List />
        </div>
      </div>
    );
  }
}

export default ClassNotice;
