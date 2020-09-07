import React from 'react';
import { NavBar, Icon, Toast, } from 'antd-mobile';
import router from 'umi/router';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import nativeApi from '../../utils/nativeApi';
import wxApi from '../../utils/wxApi';
import Item from '@/pages/components/DynamicsListItem';


@connect(({ dynamicsList }) => ({
  dynamicsList,
}))

class MinePublic extends React.PureComponent {
  state = {
    marginTop: 0,
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
  }

  // 查询教师本人发布的动态列表
  getDynamicsList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dynamicsList/inquireDynamicsListByTeacherAccount',
      payload: {
        // pageSize: 10,
        // pageIndex: 1,
      },
    })
  }

  // 删除动态
  deleteDynamic = () => {
    const { dispatch, location, } = this.props;
    const { query } = location;
    const { classDynamicsId } = query;
    dispatch({
      type: 'dynamicsList/deleteClassDynamicsAccount',
      payload: {
        classDynamicsId,
      },
    }).then(() => {
      Toast.success('删除成功', 2);
      router.goBack();
    })
  }




  render() {
    const { marginTop } = this.state;
    const {
      dynamicsList: { mineClassDynamicsList, loading },
    } = this.props;
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />
    const mineClassDynamicsListItem = (mineClassDynamicsList || []).map((item) => {
      return (
        <Item
          key={item.classDynamicsId}
          fullText={false}
          item={item}
          haveDelete
          componentName="minePublic"
        />
      );
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
            我发布的
          </NavBar>
        </div>
        <div style={{ marginTop: `${marginTop}px` }}>

          <Spin indicator={antIcon} tip="Loading..." spinning={loading}>
            {mineClassDynamicsListItem}
          </Spin>

        </div>
      </div>
    );
  }
}

export default MinePublic;
