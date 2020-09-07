/* eslint-disable prefer-destructuring */
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import fsUtils from "@/utils/fsUtils";
import { Avatar, } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styles from './messageList.less';
import { routerRedux } from 'dva/router';
import liked from '@/assets/like.png';


@connect(({ dynamicsList }) => ({
  dynamicsList,
}))


class ItemIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  // 当前人员类型(0-家长，1-教师)
  componentDidMount() {

  }

  // 点击外围取消显示评论框
  hiddenCommentModal = () => {
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


  // 预览头像
  preview = (fileUuid, fileName) => {
    fsUtils.gotoFilePreview(fileUuid, fileName);
  };

  render() {
    const { item } = this.props;
    const {
      dynamicsList: { classDynamicsByIdList, commentContentList },
    } = this.props;
    // let commentContent;
    // (commentContentList || []).forEach((item2) => {
    //   if (item.commentId === item2.commentId) {
    //     commentContent = item2.commentContent;
    //   }
    // })
    // const content = [];
    // classDynamicsByIdList.forEach((item2) => {
    //   if (item.classDynamicsId === item2.classDynamicsId) {
    //     content.push(item2.content)
    //   }
    // })

    const { dynamicsList: { UserInfoList } } = this.props;
    const { senderAccountId } = item;
    let photoId = '';
    let personName = '';
    (UserInfoList || []).forEach((id) => {
      if (id.accountId === senderAccountId) {
        photoId = id.photoId;
        personName = id.personName;
      }
    })
    const { commentType, operatingContent, content, pictureId } = item;
    const photo = (
      <img style={{ width: '60px', height: '60px', marginTop: '6px', marginRight: '6px' }} src={fsUtils.getViewFileAddress(pictureId)} alt="" />
    )

    return (
      <div className={styles.backGround}>
        {/* 头像部分 */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }} onClick={(e) => this.hiddenCommentModal(e)}>
          <div style={{ display: 'flex', margin: '6px' }}>
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
            {/* 名字 */}

            <div style={{ margin: '0 6px' }}>
              <span style={{ color: '#77d1d1' }}>{item.senderName}</span>&nbsp;<br />
              {commentType === 0 ? <img src={liked} style={{ width: '18px', color: '#d8f1f1' }} alt="" />
                : <span>{operatingContent}</span>
              }
              <br />
              <span style={{ fontSize: '12px', color: 'gray' }}>{item.createTime}</span>
            </div>
          </div>
          {/* 正文 */}
          <div className={pictureId === '' ? styles.text : styles.pic} onClick={(e) => this.hiddenCommentModal(e)}>
            { pictureId === '' ? <span>{content}</span> : <span>{photo}</span> }
          </div>
        </div>
      </div>
    )
  }
}

export default ItemIndex;