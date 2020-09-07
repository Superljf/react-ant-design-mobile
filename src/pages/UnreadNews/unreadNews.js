import React from 'react';
import { NavBar, Icon, } from 'antd-mobile';
import router from 'umi/router';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import MessageList from '@/pages/components/MessageList/messageList';
import nativeApi from '../../utils/nativeApi';
import wxApi from '../../utils/wxApi';


@connect(({ dynamicsList }) => ({
  dynamicsList,
}))

class UnreadNews extends React.PureComponent {
  state = {
    marginTop: 0,
    unreadMessageIdList: [],
    classDynamicsIdList: [],
    pageIndex: 1,
    pageSize: 20,
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
    // 数据处理
    // const initIdList = [];
    // const initClassDynamicsIdList = [];
    // const { dynamicsList: { unreadNews } } = this.props;
    // (unreadNews || []).forEach((item) => {
    //   initIdList.push(item.messageId);
    //   initClassDynamicsIdList.push(item.classDynamicsId);
    // })
    // this.setState({
    //   unreadMessageIdList: initIdList,
    //   classDynamicsIdList: initClassDynamicsIdList,
    // }, () => {
    //   this.getReadDynamicsList();
    //   this.getClassDynamicsCommentListByMessageIdList();
    //   this.getClassDynamicsListByClassDynamicsIdList();
    // })
    this.getUnreadNewsDetails();
  }


  // 获取未读消息详情
  getUnreadNewsDetails = () => {
    const { dispatch } = this.props;
    const { pageIndex, pageSize } = this.state;
    dispatch({
      type: 'dynamicsList/getUnreadDetails',
      payload: {
        pageIndex,
        pageSize,
      }
    })
  }

  // 教师获取已读消息  ------让未读变为已读
  getReadDynamicsList = () => {
    const { dispatch } = this.props;
    const { unreadMessageIdList } = this.state;
    dispatch({
      type: 'dynamicsList/inquireClassDynamicsReadMessageForTeacherAccount',
      payload: {
        unreadMessageIdList,
        // pageSize: 10,
        // pageIndex: 1,
      },
    })
  }

  // 根据消息ID列表获取评论列表 
  getClassDynamicsCommentListByMessageIdList = () => {
    const { dispatch } = this.props;
    const { unreadMessageIdList } = this.state;
    dispatch({
      type: 'dynamicsList/inquireClassDynamicsCommentListByMessageIdListAccount',
      payload: {
        messageIdList: unreadMessageIdList,
      },
    })
  }

  // 根据班级动态ID列表查询班级动态列表 
  getClassDynamicsListByClassDynamicsIdList = () => {
    const { dispatch } = this.props;
    const commentIdList = [];
    const { classDynamicsIdList } = this.state;
    dispatch({
      type: 'dynamicsList/inquireClassDynamicsListByClassDynamicsIdListForTeacherAccount',
      payload: {
        classDynamicsIdList,
      }
    }).then(() => {
      const { dynamicsList: { classDynamicsByIdList } } = this.props;
      (classDynamicsByIdList || []).forEach((item) => {
        item.commentList.forEach((item2) => {
          commentIdList.push(item2.commentId)
        })
      })
    }).then(() => {
      this.getCommentList(commentIdList);
    })
  }

  
  // 根据评论ID列表获取评论内容(点赞信息)
  getCommentList = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dynamicsList/inquireClassDynamicsCommentContentList',
      payload: {
        commentIdList: value,
      },
    })
  }



  render() {
    const { marginTop } = this.state;
    const {
      dynamicsList: { loading, classDynamicsByIdList, commentListByMessageId, messageDetails },
    } = this.props;
    // console.log(this.props)
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

    const unreadNewsDetails = (messageDetails || []).map(item => {
        return (
          <MessageList
            key={item.commentId}
            item={item}
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
            消息
          </NavBar>
        </div>
        <div style={{ marginTop: `${marginTop}px` }}>
          <Spin indicator={antIcon} tip="Loading..." spinning={loading}>
            {unreadNewsDetails}
          </Spin>
        </div>
      </div>
    );
  }
}

export default UnreadNews;
