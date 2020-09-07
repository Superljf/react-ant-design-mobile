/* eslint-disable react/destructuring-assignment */
import React, { Component, } from 'react';
import { connect } from 'dva';
import createPng from '@/assets/xg.svg';
import { Spin, BackTop } from 'antd';
import arrowImg from '@/assets/arrow.png';
import Up from '@/assets/up.png';
import { LoadingOutlined } from '@ant-design/icons';
import { routerRedux } from 'dva/router';
import eventProxy from '@/utils/eventProxy';
import Item from '@/pages/components/DynamicsListItem';
import styles from './dynamicList.less';


@connect(({ dynamicsList, classList, }) => ({
  dynamicsList, classList,
}))

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageIndex: 1,
      pageSize: 10,
      loadMore: '',
      initClassDynamicsList: [], // 存渲染总数据
      initCommentContentList: [],
    };
  }

  componentDidMount() {
    this.getUnreadNews();
    this.getDynamicsList()
    // 班级圈班级添加清除事件监听
    eventProxy.on('query', () => {
      this.getDynamicsList()
    })
    // eventProxy.on('clear', () => {
    //   this.getDynamicsList()
    // })
  }

  componentWillReceiveProps(nextProps) {
    const { classList: { selectedId } } = nextProps;
    const { selectedId: prevSelectedId } = this.props.classList;
    if (selectedId !== prevSelectedId) {
      this.setState({
        pageIndex: 1,
        initClassDynamicsList: [],
        initCommentContentList: [],
      }, () => {
        this.getDynamicsList();
      })
    }
  }


  // 查询班级动态列表
  getDynamicsList = () => {
    const { pageSize, pageIndex, initClassDynamicsList, initCommentContentList } = this.state;
    const { classList: { selectedId, currentSelectedClassList, } } = this.props;
    let combineClassList = [];
    if (selectedId === -1) {
      const currentSelectedList = [];
      const allClass = [];
      // 将classId、classIdList 中的班级都渲染出来传入
      (currentSelectedClassList || []).forEach((id) => {
        if (id.classId === -1) {
          id.classIdList.forEach((idList) => {
            allClass.push(idList)
          })
        } else {
          currentSelectedList.push(id.classId)
        }
      })
      combineClassList = [...currentSelectedList, ...allClass];
    }
    const { dispatch } = this.props;
    const commentIdList = [];
    const accountIdList = [];
    dispatch({
      type: 'dynamicsList/inquireClassDynamicsList',
      payload: {
        classId: selectedId === -1 ? combineClassList : selectedId,
        pageSize,
        pageIndex,
      },
    }).then(() => {
      const {
        dynamicsList: { classDynamicsList, commentContentList, pageCount }
      } = this.props;
      const { totalPageCount } = pageCount;
      if (totalPageCount > pageIndex) {
        this.setState({
          loadMore: true,
        })
      } else {
        this.setState({
          loadMore: false,
        })
      }
      (classDynamicsList || []).forEach((item) => {
        item.commentList.forEach((item2) => {
          commentIdList.push(item2.commentId)
        })
        accountIdList.push(item.teacherAccountId)
      })
      this.getCommentList(commentIdList);
      this.getUserInfoList(accountIdList);
      this.setState({
        initClassDynamicsList: [...initClassDynamicsList, ...classDynamicsList],
        initCommentContentList: [...commentContentList, ...initCommentContentList]
      }, () => {
        (initClassDynamicsList || []).forEach((item) => {
          item.commentList.forEach((item2) => {
            commentIdList.push(item2.commentId)
          })
          accountIdList.push(item.teacherAccountId)
        })
        this.getCommentList(commentIdList);
        this.getUserInfoList(accountIdList);
      })
    })
  };


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

  // 根据accountIdList查询用户信息列表
  getUserInfoList = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dynamicsList/inquireClassDynamicsUserInfoList',
      payload: {
        personType: 1,
        accountIdList: value,
      }
    })
  }

  // 教师获取未读消息
  getUnreadNews = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dynamicsList/getUnreadCount',
    })
  }

  // 发布动态跳转
  createDynamics = () => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: `/createDynamics`,
      })
    )
  }

  // 未读消息进消息列表
  onClickMessage = () => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: `/unreadNews`,
      })
    )
  }

  // 加载更多
  loadMore = () => {
    const { pageIndex } = this.state;
    this.setState({
      pageIndex: pageIndex + 1,
    }, () => {
      this.getDynamicsList();
    })
  }



  render() {
    const {
      dynamicsList: { loading, unreadNews, commentContentList } } = this.props;
    const { initClassDynamicsList, } = this.state;
    const { loadMore } = this.state;
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />
    const { count } = unreadNews;

    return (
      <div className={styles.backGround}>
        <Spin indicator={antIcon} tip="Loading..." spinning={loading}>
          {count !== 0 && (
            <div
              className={styles.news}
              onClick={this.onClickMessage}
            >
              <div className={styles.newsContent}>
                {count}条新消息
                <img
                  src={arrowImg}
                  role="presentation"
                  alt=""
                  className={styles.newsArrow}
                />
              </div>
            </div>
          )}
          {commentContentList.length > 0 && (
            (initClassDynamicsList || []).map(item => {
              return (
                <Item
                  key={item.classDynamicsId}
                  item={item}
                  haveDelete={false}
                  fullText={false}
                  // commentContentList={commentContentList}
                />
              )
            })
          )}
          {/* {dynamicListInfo} */}
          {/* 发布动态ICON */}
          <div>
            <img onClick={this.createDynamics} className={styles.create} src={createPng} alt="" />
          </div>
          {!loading && (
            <div>
              {(loadMore) ?
                <div onClick={this.loadMore} style={{ textAlign: 'center' }}>加载更多</div> :
                (
                  <div style={{ textAlign: 'center' }}>
                    {loading ? <span>正在加载中...</span> : <span>已加载全部</span>}
                  </div>
                )}
            </div>
          )}
          <BackTop>
            <img src={Up} alt="" className={styles.upIcon} />
          </BackTop>
        </Spin>
      </div>
    );
  }
}

export default index;
