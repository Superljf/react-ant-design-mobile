import React from 'react';
import { NavBar, Icon, Toast, } from 'antd-mobile';
import router from 'umi/router';
import { connect } from 'dva';
import nativeApi from '../../utils/nativeApi';
import wxApi from '../../utils/wxApi';
import share from '@/assets/share.png';
import Item from '@/pages/components/DynamicsListItem';
import styles from './index.less';


@connect(({ dynamicsList }) => ({
  dynamicsList,
}))

class DynamicsDetails extends React.PureComponent {
  state = {
    marginTop: 0,
    adminFlag: '',
  };

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const marginTop = document.getElementById('navContianer').offsetHeight;
    this.setState({ marginTop });
    nativeApi.onBackPressed(() => {
      nativeApi.onBackPressed(null);
      nativeApi.close();
    })
    this.getDynamicsList();
    const { dynamicsList: { authorityList } } = this.props;
    const { operationCode } = authorityList;
    if (operationCode.indexOf('YX_WISDOM-TEACHER_MOMENT_APP_ADMIN') !== -1) {
      this.setState({
        adminFlag: 1,
      })
    } else {
      this.setState({
        adminFlag: 0,
      })
    }
  }

  // 查询班级动态列表
  getDynamicsList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dynamicsList/inquireClassDynamicsList',
      payload: {
        classId: -1,
        // pageSize: 10,
        // pageIndex: 1,
      },
    }).then(() => {

    })
  }

  // 删除动态
  deleteDynamic = () => {
    const { dispatch, location, } = this.props;
    const { query } = location;
    const { classDynamicsId } = query;
    const { adminFlag } = this.state;
    dispatch({
      type: 'dynamicsList/deleteClassDynamicsAccount',
      payload: {
        adminFlag,
        classDynamicsId,
      },
    }).then(() => {
      Toast.success('删除成功', 2);
      router.goBack();
    })
  }

  // 分享
  share = () => {

  }




  render() {
    const { marginTop, adminFlag } = this.state;
    const {
      dynamicsList: { classDynamicsList, accountInfo }, location,
    } = this.props;
    const { query } = location;
    const { classDynamicsId } = query;
    const { accountId } = accountInfo;
    const dynamicListDetail = (classDynamicsList || []).map((item) => {
      // 非管理员只能删除自己的动态
      if ((classDynamicsId === item.classDynamicsId)) {
        if (adminFlag === 0) {
          return (
            <Item
              key={item.classDynamicsId}
              fullText
              item={item}
              haveDelete={item.teacherAccountId === accountId}
              deleteDynamic={this.deleteDynamic}
              componentName="dynamicsDetails"
            />
          );
        }
        //  管理员可以删除任何
        return (
          <Item
            key={item.classDynamicsId}
            fullText
            item={item}
            haveDelete
            deleteDynamic={this.deleteDynamic}
            componentName="dynamicsDetails"
          />
        );

      }
    });
    return (
      <div>
        <div id='navContianer'>
          <NavBar
            mode="dark"
            icon={<Icon type='left' />}
            onClick={() =>
              router.goBack()
            }
            rightContent={[
              <img style={{ width: '16px' }} src={share} alt="" onClick={this.share} />
            ]}
            onLeftClick={
              () => {
                if (wxApi.isWeixinBrowser()) {
                  router.goBack();
                  return;
                }
                nativeApi.close()
              }
            }
            style={{ backgroundColor: '#199ED8' }}
          >
            动态详情
          </NavBar>
        </div>
        <div style={{ marginTop: `${marginTop}px` }}>
          {dynamicListDetail}
        </div>
      </div>
    );
  }
}

export default DynamicsDetails;
