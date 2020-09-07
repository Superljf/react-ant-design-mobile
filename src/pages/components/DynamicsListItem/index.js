/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-plusplus */
/* eslint-disable no-nested-ternary */
/* eslint-disable prefer-destructuring */
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Avatar, Input, Button, } from 'antd';
import moment from "moment";
import { UserOutlined } from '@ant-design/icons';
import router from 'umi/router';
import { Modal, Popover, Icon, Toast } from 'antd-mobile';
import styles from './index.less';
import { routerRedux } from 'dva/router';
import fsUtils from "@/utils/fsUtils";
import liked from '@/assets/like.png';
import update from 'react-addons-update';
import commentPng from '@/assets/comments.png';
import cancelLike from '@/assets/cancelLike.png';
import willLike from '@/assets/willLike.png';
import comment from '@/assets/comment.png';

const { Item } = Popover;
const { alert } = Modal;

@connect(({ dynamicsList, }) => ({
  dynamicsList,
}))


class ItemIndex extends Component {
  constructor(props) {
    super(props);
    const { fullText, haveDelete } = this.props;
    this.state = {
      showComment: false,
      commentInputVisible: false, // 输入框
      fullText, // 默认展开还是收起
      haveDelete, // 是否含有删除...
      likerList: [], // 存放点赞
      accountId: '', // 当前账户ID
      accountName: '', // 当前用户名称
      initCommentList: [], // 存评论列表
      commentContent: '', // 评论内容
      deleteVisible: false, //  删除按钮显示隐藏
      commentIcon: false,  // 点击按钮时输入框
      contentIndex: 0, // 存放需要操作的索引
      senderName: '', // 回复 别人
      popoverVisible: false, // 删除...是否显示
      adminFlag: 0, // "adminFlag" : 租户管理员标志：0-不是管理员；1-管理员。
      adminModal: false,  // 管理员是否展示回复删除
      currentCommentId: '', // 当前评论Id
      isCommentContent: false, // 是评论还是回复
    };
  }

  // 当前人员类型(0-家长，1-教师)
  componentDidMount() {
    this.getCommentLikeList();
    this.getCommentList();
    const { dynamicsList: { accountInfo, UserInfoList, authorityList } } = this.props;
    const { operationCode } = authorityList;
    // 如果要检索的字符串值没有出现，则该方法返回 -1。
    if (operationCode.indexOf('YX_WISDOM-TEACHER_MOMENT_APP_ADMIN') !== -1) {
      this.setState({
        adminFlag: 1,
      })
    }
    const { accountId } = accountInfo;
    let personName = ''; // 处理当前用户名字  
    (UserInfoList || []).forEach((id) => {
      if (id.accountId === accountId) {
        personName = id.personName;
      }
    })
    this.setState({
      accountId,
      accountName: `${personName}老师`,
    })
  }

  componentWillReceiveProps(nextProps) {
    const { dynamicsList: { commentContentList: preCommentContentList } } = nextProps;
    const { dynamicsList: { commentContentList } } = this.props;
    if (JSON.stringify(preCommentContentList) !== JSON.stringify(commentContentList)) {
      this.getCommentLikeList();
      this.getCommentList();
    }
    const { dynamicsList: { accountInfo, UserInfoList, authorityList } } = this.props;
    const { operationCode } = authorityList;
    // 如果要检索的字符串值没有出现，则该方法返回 -1。
    if (operationCode.indexOf('YX_WISDOM-TEACHER_MOMENT_APP_ADMIN') !== -1) {
      this.setState({
        adminFlag: 1,
      })
    }
    const { accountId } = accountInfo;
    let personName = ''; // 处理当前用户名字  
    (UserInfoList || []).forEach((id) => {
      if (id.accountId === accountId) {
        personName = id.personName;
      }
    })
    this.setState({
      accountId,
      accountName: `${personName}老师`,
    })
  }

  // 点赞数据处理
  getCommentLikeList = () => {
    const { item, dynamicsList: { commentContentList } } = this.props;
    const newLikeList = [];
    (item.commentList || []).forEach((item4) => {
      (commentContentList || []).forEach(item5 => {
        if ((item4.commentId === item5.commentId) && item5.commentType === 1) {
          newLikeList.push({
            senderAccountId: item4.senderAccountId,
            senderName: item4.senderName
          });
        }
      })
    })
    this.setState({
      likerList: newLikeList,
    })
  }


  // 评论数据处理
  getCommentList = () => {
    const { item, dynamicsList: { commentContentList } } = this.props;
    const newCommentList = [];
    item.commentList.forEach((item2) => {
      (commentContentList || []).forEach(item3 => {
        if ((item3.commentId === item2.commentId) && item3.commentType === 0) {
          newCommentList.push({
            senderAccountId: item2.senderAccountId,
            senderName: item2.senderName,
            receiverName: item2.receiverName,
            commentContent: item3.commentContent,
            commentId: item2.commentId,
          });
        }
      });
    });
    this.setState({
      initCommentList: newCommentList,
    });
  }

  // 评论模块展示
  showComment = () => {
    const { showComment } = this.state;
    this.setState({
      showComment: !showComment,
    });
  };

  // 评论框展示
  showCommentInput = () => {
    this.setState({
      commentInputVisible: true,
      commentIcon: true,
      senderName: '',
    })
  }

  // 输入框回调事件
  onChangeContent = (e) => {
    this.setState({
      commentContent: e.target.value,
    })
  }

  // 点击ICON 评论 
  onChangeCommentContent = (e) => {
    this.setState({
      commentContent: e.target.value,
      isCommentContent: true,
    })
  }

  // 回复别人的评论 
  onChangeReplyContent = (e) => {
    this.setState({
      commentContent: e.target.value,
      isCommentContent: false,
    })
  }


  // 发送评论
  sendContent = () => {
    const { item, dynamicsList: { UserInfoList } } = this.props;
    const { teacherName } = item;
    const { initCommentList, commentContent, accountId, contentIndex, senderName, accountName, isCommentContent } = this.state;
    // 评论区分是点击ICON评论还是 如果是点击ICON评论  如果是回复评论  
    if (isCommentContent) {
      this.setState({
        initCommentList: update(initCommentList, {
          $push: [{
            commentContent,
            receiverName: '',
            senderAccountId: accountId,
            senderName: accountName,
          }]
        }),
        commentInputVisible: false,
        showComment: false,
      })
    } else {
    this.setState({
      initCommentList: update(initCommentList, {
        $push: [{
          commentContent,
          receiverName: senderName,
          senderAccountId: accountId,
          senderName: accountName,
        }]
      }),
      commentInputVisible: false,
      showComment: false,
    })
  }
    const { teacherAccountId, classDynamicsId } = item;
    const myInfo = [];
    UserInfoList.forEach((info) => {
      if (info.accountId === teacherAccountId) {
        myInfo.push(info)
      }
    })
    const { dispatch } = this.props;
    const { familyId, personType } = myInfo[0];
    //  当首条评论时处理
    if (item.commentList.length === 0) {
      dispatch({
        type: 'dynamicsList/createClassDynamicsCommentAccount',
        payload: {
          currentPersonTypeEnum: 1,
          classDynamicsId,
          receiverPersonTypeEnum: personType,
          receiverFamilyId: familyId,
          receiverAccountId: teacherAccountId,
          commentContent,
        }
      }).then(() => {
        const { dynamicsList: { createDynamicsId } } = this.props;
        this.setState({
          currentCommentId: createDynamicsId,
        })
      })
    } else if (isCommentContent) {
      const { receiverPersonType, receiverFamilyId, senderAccountId, } = item.commentList[contentIndex];
      dispatch({
        type: 'dynamicsList/createClassDynamicsCommentAccount',
        payload: {
          currentPersonTypeEnum: 1,
          classDynamicsId,
          receiverPersonTypeEnum: receiverPersonType,
          receiverFamilyId: -1,
          receiverAccountId: -1,
          commentContent,
        }
      }).then(() => {
        const { dynamicsList: { createDynamicsId } } = this.props;
        this.setState({
          currentCommentId: createDynamicsId,
        })
      })
    } else {
      const { receiverPersonType, receiverFamilyId, senderAccountId, receiverAccountId, senderFamilyId, senderPersonType } = item.commentList[contentIndex];
      dispatch({
        type: 'dynamicsList/createClassDynamicsCommentAccount',
        payload: {
          currentPersonTypeEnum: 1,
          classDynamicsId,
          receiverPersonTypeEnum: senderPersonType,  
          receiverFamilyId: senderFamilyId, 
          receiverAccountId: senderAccountId,
          commentContent,
        }
      }).then(() => {
        const { dynamicsList: { createDynamicsId } } = this.props;
        this.setState({
          currentCommentId: createDynamicsId,
        })
      })
    }
  }

  // 展示删除Modal
  deleteContent = (index) => {
    this.setState({
      deleteVisible: true,
      commentInputVisible: true,
      contentIndex: index,
    })
  }

  // 展示回复Modal
  replyContent = (index) => {
    this.setState({
      deleteVisible: false,
      commentInputVisible: true,
      contentIndex: index,
    })
    const { initCommentList, accountId } = this.state;
    if (accountId !== initCommentList[index].senderAccountId) {
      this.setState({
        senderName: initCommentList[index].senderName,
      })
    }
  }

  // 删除评论
  deleteButton = () => {
    const { contentIndex, initCommentList, currentCommentId, adminFlag } = this.state;
    this.setState({
      initCommentList: update(initCommentList, { $splice: [[contentIndex, 1]] }),
      commentInputVisible: false,
    })
    const { commentId } = initCommentList[contentIndex];
    const { dispatch } = this.props;
    dispatch({
      type: 'dynamicsList/deleteClassDynamicsCommentAccount',
      payload: {
        commentId: commentId === undefined ? currentCommentId : commentId,
        adminFlag,
      }
    })
  }

  cancelButton = () => {
    this.setState({
      commentInputVisible: false,
    })
  }

  // 点击外围取消显示评论框
  hiddenCommentModal = () => {
    this.setState({
      showComment: false,
      commentInputVisible: false,
      commentIcon: false,
    });
  }

  goDynamicsDetails = () => {
    // 跳转动态详情
    const { dispatch } = this.props;
    const { item } = this.props;
    const { classDynamicsId } = item;
    dispatch(
      routerRedux.push({
        pathname: `/dynamicsDetails`,
        query: {
          classDynamicsId,
        }
      })
    )
  }

  // 点赞和取消赞  --一开始是点赞状态
  giveLike = () => {
    this.setState({
      showComment: false,
    });
  }

  // 取消赞
  cancelLikeIcon = () => {
    this.setState(prevState => {
      const { likerList, accountId } = prevState;
      const index = likerList.findIndex((item) => {
        return item.senderAccountId === accountId;
      })
      return {
        likerList: update(likerList, { $splice: [[index, 1]] })
      }
    })
    const { item } = this.props;
    const { classDynamicsId } = item;
    const { dispatch } = this.props;
    dispatch({
      type: 'dynamicsList/deleteClassDynamicsLikeAccount',
      payload: {
        currentPersonTypeEnum: 1,
        classDynamicsId,
      }
    })
  }

  // 点赞
  giveLikeIcon = () => {
    this.setState(prevState => {
      const { likerList, accountId, accountName } = prevState;
      return {
        likerList: update(likerList, {
          $push: [{
            senderAccountId: accountId,
            senderName: accountName,
          }]
        })
      }
    })
    const { item } = this.props;
    const { classDynamicsId } = item;
    const { dispatch } = this.props;
    dispatch({
      type: 'dynamicsList/createClassDynamicsLikeAccount',
      payload: {
        currentPersonTypeEnum: 1,
        classDynamicsId,
      }
    })
  }

  //  全文收起
  showFullText = () => {
    const { fullText } = this.state;
    this.setState({
      fullText: !fullText,
    });
  };

  // 动态详情删除动态---------------------------------
  onSelect = () => {
    this.setState({
      popoverVisible: false,
    });
  };

  // 删除动态
  deleteDynamic = () => {
    const { deleteDynamic, componentName, dispatch, item } = this.props;
    const { classDynamicsId } = item;
    // 动态详情删除 or 我发布的删除
    if (componentName === "dynamicsDetails") {
      deleteDynamic();
    } else {
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
  }

  deleteDynamicIcon = () => {
    alert('确定要删除该条动态吗', '', [
      { text: '取消', onPress: () => console.log('cancel') },
      { text: '确定', onPress: () => this.deleteDynamic() },
    ])
  }

  // 管理员----------------------------
  handleReplyOrDelete = (index) => {
    this.setState({
      contentIndex: index,
      adminModal: true,
      commentInputVisible: true,
    })
  }

  replyButton = () => {
    this.setState({
      commentIcon: true,
    })
  }

  adminDeleteButton = () => {
    alert('确定要删除该条评论吗', '', [
      { text: '取消', onPress: () => this.setState({ commentInputVisible: false }) },
      { text: '确定', onPress: () => this.deleteButton() },
    ])
  }

  // 预览头像
  preview = (fileUuid, fileName) => {
    fsUtils.gotoFilePreview(fileUuid, fileName);
  };

  // 长按事件
  handleTouchEnd = () => {
    clearTimeout(this.pressTime);
  }

  touchStart = (index) => {
    this.pressTime = setTimeout(() => {
      this.setState({
        deleteVisible: true,
        commentInputVisible: true,
        contentIndex: index,
      })
    }, '1000');
  }


  render() {
    const { showComment, fullText, likerList, accountId, initCommentList, commentInputVisible, deleteVisible,
      commentIcon, senderName, haveDelete, popoverVisible, adminFlag, adminModal, accountName } = this.state;
    const { item } = this.props;
    const placeContent = `回复  ${senderName}`;
    const { dynamicsList: { UserInfoList, commentContentList } } = this.props;
    const { teacherAccountId } = item;
    let photoId = '';
    let personName = '';
    (UserInfoList || []).forEach((id) => {
      if (id.accountId === teacherAccountId) {
        photoId = id.photoId;
        personName = id.personName;
      }
    })
    console.log(initCommentList)
    const commentList = (initCommentList || []).map((item2, index) => {
      return (
        // 发送人是我则删除  否则回复
        <Fragment>
          <span
            key={item2.commentId}
            className={styles.reply}
            onClick={
              item2.senderAccountId === accountId ? this.deleteContent.bind(this, index) : this.replyContent.bind(this, index)
            }
          >
            {(item2.receiverName === '') ?
              (
                <span onClick={this.deleteContent.bind(this, index)} style={{ color: '#77d1d1' }}>
                  {item2.commentContent === '' ? '' : (
                    <span>
                      {item2.senderAccountId === accountId ?
                        "我" : (
                          // 我发布的动态可长按删除别人的评论
                          <span>{item.teacherAccountId === accountId ? (
                            <span onTouchStart={this.touchStart.bind(this, index)} onTouchEnd={this.handleTouchEnd}>{item2.senderName}</span>)
                            : <span>{item2.senderName}</span>}
                          </span>
                        )}
                      <span style={{ color: 'black' }}>：
                        <span>{item.teacherAccountId === accountId ? (
                          <span onTouchStart={this.touchStart.bind(this, index)} onTouchEnd={this.handleTouchEnd}>{item2.commentContent}</span>)
                          : <span>{item2.commentContent}</span>}
                        </span>
                      </span>
                    </span>
                  )}
                </span>
              )
              :
              (
                <Fragment>
                  <span key={item2.commentId}>
                    <span style={{ color: '#77d1d1' }}>{item2.senderAccountId === accountId ? "我" : item2.senderName}</span> 回复&nbsp;
                    <span style={{ color: '#77d1d1' }}>{accountName === item2.receiverName ? "我" : item2.receiverName}<span style={{ color: 'black' }}>：{item2.commentContent}</span></span>
                  </span>
                </Fragment>
              )}
          </span>
        </Fragment>
      )
    })
    const isFull = fullText ? '-fullText' : '-lessText';

    let noneLike; // 判断有没有人点赞 无人点赞但是有评论内容则不显示点赞div
    let myIsLike = false;
    // 是否是自己点赞
    const likeName = (likerList || []).map((likeItem) => {
      let name = '';
      name = likeItem.senderName;
      noneLike = likeItem.senderName;
      if (name === undefined) {
        return null;
      }
      if (accountId === likeItem.senderAccountId) {
        myIsLike = true;
        return (
          <span style={{ padding: '4px' }}>我</span>
        )
      }
      return (
        <span key={likeItem.senderAccountId} style={{ padding: '4px' }}>{name}</span>
      )
    })

    // 动态图片渲染
    const photoList = (item.pictureList || []).map((pic) => {
      return (
        <img style={{ width: '63px', height: '63px', padding: '1px' }} src={fsUtils.getViewFileAddress(pic.pictureId)} onClick={() => this.preview(pic.pictureId, pic.pictureName)} alt="" />
      )
    })

    return (
      <Fragment>
        <div className={styles.backGround}>
          <br />
          {/* 头像部分 */}
          <div style={{ marginTop: '-14px' }} onClick={(e) => this.hiddenCommentModal(e)}>
            {photoId === '' ? (
              <Avatar style={{ marginTop: '4px', marginLeft: '7px' }} shape="square" icon={<UserOutlined />} />
            )
              :
              (
                <Fragment>
                  <Avatar style={{ marginTop: '4px', marginLeft: '7px' }} shape="square" src={fsUtils.getViewFileAddress(photoId)} onClick={() => this.preview(photoId, personName)} />
                </Fragment>
              )
            }

            <div style={{ float: 'right', width: '86%' }}>
              <span style={{ color: '#77d1d1' }}>{item.teacherName}</span>&nbsp;
              {haveDelete &&
                (
                  <span onClick={e => e.stopPropagation()}>
                    <Popover
                      mask
                      overlayClassName="fortest"
                      overlayStyle={{ color: 'currentColor' }
                      }
                      visible={popoverVisible}
                      overlay={
                        [
                          (<Item
                            key="4"

                          >
                            <span
                              onClick={(e) => this.deleteDynamicIcon(e)}
                            >
                              删除
                            </span>
                          </Item>
                          ),
                        ]}
                      align={{
                        overflow: { adjustY: 0, adjustX: 0 },
                        offset: [-10, 0],
                      }
                      }
                      onVisibleChange={this.handleVisibleChange}
                      onSelect={this.onSelect}
                    >
                      <span style={{
                        float: 'right'
                      }}
                      >
                        <Icon type="ellipsis" /> &nbsp;
                      </span>
                    </Popover>
                  </span>

                )
              }
              <span className={styles.course}>{item.teacherCourseName.indexOf(',') === -1 ? <span>{item.teacherCourseName}</span> : <span>多科目</span>}</span> <br />
              <span style={{ fontSize: '12px', color: 'gray' }}>{moment(item.createTime).format('YYYY-MM-DD')}</span>
            </div>

          </div>

          {/* 正文 */}
          <div className={styles[`text${isFull}`]} onClick={(e) => this.goDynamicsDetails(e)}>
            {item.content}
          </div>
          {item.content.length > 300 && (
            <span style={{ color: '#199ED8', margin: '14%' }} onClick={this.showFullText}>
              {fullText ? '收起' : '全文'}
            </span>
          )}
          <div style={{ marginLeft: '14%' }}>{photoList}</div>


          {/* 归属班级 */}
          <div className={styles.myClass}>
            <div>
              {item.classList.length !== 0 ? <span style={{ fontSize: '12px', color: 'gray' }}> 归属班级:</span> : <span> &nbsp;   </span>}
              {(item.classList || []).map((classItem) => {
                return (
                  <span key={classItem.classId} style={{ fontSize: '12px', color: 'gray' }}> {classItem.className} </span>
                )
              })}
            </div>
            <div style={{ float: 'right' }}>
              <img onClick={this.showComment} style={{ width: '20px' }} src={commentPng} alt="" />
            </div>
            {/* 点赞弹窗 */}
            {showComment && (
              <div className={styles.commentBg}>
                <div className={styles.willLike} onClick={this.giveLike}>
                  {myIsLike ?
                    (
                      <Fragment>
                        <img className={styles.commentIcon} src={cancelLike} alt="" />
                        <span onClick={this.cancelLikeIcon}>取消</span>
                      </Fragment>
                    ) :
                    (
                      <Fragment>
                        <img className={styles.commentIcon} src={willLike} alt="" />
                        <span onClick={this.giveLikeIcon}>赞</span>
                      </Fragment>
                    )
                  }
                </div>
                <div className={styles.willComment}>
                  <img className={styles.commentIcon} src={comment} alt="" /> <span onClick={this.showCommentInput}> 评论</span>
                </div>
              </div>

            )}
          </div>

          {/* 点赞块 */}
          <Fragment>
            {noneLike !== undefined && (
              <div className={styles.triangle} />)}
            <div className={styles.comment}>
              {noneLike !== undefined && (
                <span className={styles.like}>
                  <img src={liked} style={{ width: '18px', color: '#d8f1f1' }} alt="" />
                  {likeName}
                </span>
              )
              }
              {/* 获取点赞人姓名 */}
              {(noneLike !== undefined && item.commentList.length !== 0) && <div className={styles.line} />}
              {/* 获取评论人姓名和评论内容 */}
              {adminFlag === 0 && <Fragment>{commentList}</Fragment>}
              {/* 管理员 */}
              {adminFlag === 1 && (
                <Fragment>
                  {initCommentList.map((item2, index) => {
                    return (
                      // 发送人是我则删除  否则回复
                      <Fragment>
                        <span
                          key={item2.commentId}
                          className={styles.reply}
                          onClick={this.handleReplyOrDelete.bind(this, index)}
                        >
                          {(item2.receiverName === '') ?
                            (
                              <span onClick={this.deleteContent.bind(this, index)} style={{ color: '#77d1d1' }}>
                                {item2.commentContent === '' ? '' : (
                                  <span>{item2.senderAccountId === accountId ? "我" : item2.senderName}
                                    <span style={{ color: 'black' }}>：{item2.commentContent}</span>
                                  </span>
                                )}
                              </span>
                            )
                            :
                            (
                              <Fragment>
                                <span key={item2.commentId}>
                                  <span style={{ color: '#77d1d1' }}>{item2.senderAccountId === accountId ? "我" : item2.senderName}</span> 回复&nbsp;
                                  <span style={{ color: '#77d1d1' }}> {accountName === item2.receiverName ? "我" : item2.receiverName}<span style={{ color: 'black' }}> ：{item2.commentContent}</span></span>
                                </span>
                              </Fragment>
                            )}
                        </span>
                      </Fragment>
                    )
                  })}
                </Fragment>
              )}
            </div>
          </Fragment>

          {/* 输入框 */}
          {adminFlag === 0 && (
            <Fragment>
              <Modal
                // 点评论ICON
                popup
                visible={commentInputVisible}
                onClose={this.hiddenCommentModal}
                animationType="slide-up"
                afterClose={() => { }}
              >
                {(commentIcon || !deleteVisible) ?
                  (
                    <div className={styles.ipt}>
                      {senderName !== '' ?
                        <Input placeholder={placeContent} style={{ width: '80%' }} onChange={this.onChangeReplyContent} />
                        :
                        <Input placeholder="评论" style={{ width: '80%' }} onChange={this.onChangeCommentContent} />
                      }
                      <Button onClick={this.sendContent}>发送</Button>
                    </div>
                  ) : (
                    <Fragment>
                      <div className={styles.btn}>
                        <Button style={{ width: '100%', color: 'red', margin: '6px' }} onClick={this.deleteButton}>删除</Button>
                        <Button style={{ width: '100%' }} onClick={this.cancelButton}>取消</Button>
                      </div>
                    </Fragment>
                  )
                }
              </Modal>
            </Fragment>
          )}
          {/* 管理员权限 */}
          {adminFlag === 1 && (
            <Fragment>
              <Modal
                // 点评论ICON
                popup
                visible={commentInputVisible}
                onClose={this.hiddenCommentModal}
                animationType="slide-up"
                afterClose={() => { }}
              >
                {(commentIcon || !adminModal) ?
                  (
                    <div className={styles.ipt}>
                      {senderName !== '' ?
                        <Input placeholder={placeContent} style={{ width: '80%' }} onChange={this.onChangeReplyContent} />
                        :
                        <Input placeholder="评论" style={{ width: '80%' }} onChange={this.onChangeCommentContent} />
                      }
                      <Button onClick={this.sendContent}>发送</Button>
                    </div>
                  ) : (
                    <Fragment>
                      <div className={styles.btn}>
                        <Button style={{ width: '100%', }} onClick={this.replyButton}>回复</Button>
                        <Button style={{ width: '100%', color: 'red', margin: '6px' }} onClick={this.adminDeleteButton}>删除</Button>
                        <Button style={{ width: '100%' }} onClick={this.cancelButton}>取消</Button>
                      </div>
                    </Fragment>
                  )
                }
              </Modal>
            </Fragment>
          )}
        </div>
      </Fragment>
    )
  }

}

export default ItemIndex;