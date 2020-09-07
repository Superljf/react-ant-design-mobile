import networkUtils from '@/utils/networkUtils';
import {
  inquireClassDynamicsListByClassIdListForTeacherAccount,
  inquireClassDynamicsCommentContentListByCommentIdListAccount,
  inquireCurrentAccountInfo,
  deleteClassDynamicsLikeAccount,
  createClassDynamicsLikeAccount,
  createClassDynamicsCommentAccount,
  deleteClassDynamicsCommentAccount,
  deleteClassDynamicsAccount,
  inquireDynamicsListByTeacherAccount,
  // inquireClassDynamicsUnreadMessageForTeacherAccount,
  inquireClassDynamicsUnreadOperatingMessageForTeacherAccount,  // 获取未读详情
  inquireClassDynamicsUnreadOperatingMessageCountForTeacherAccount, // 获取未读数量
  inquireClassDynamicsReadMessageForTeacherAccount,
  inquireClassDynamicsCommentListByMessageIdListAccount,
  inquireClassDynamicsListByClassDynamicsIdListForTeacherAccount,
  inquireClassDynamicsUserInfoListByAccountListAccount,
  inquireOperationCodeListByProductAccount,
} from '@/services/dynamicList';

export default {
  namespace: 'dynamicsList',
  state: {
    loading: true,
    classDynamicsList: [],
    mineClassDynamicsList: [],
    commentContentList: [],
    accountInfo: [],
    unreadNews: [],
    readNews: [],
    commentListByMessageId: [],
    classDynamicsByIdList: [],
    UserInfoList: [],
    pageCount: [],
    createDynamicsId: '',
    authorityList: [],
    messageDetails: [],
  },


  effects: {
    // 根据班级ID查询班级动态列表
    *inquireClassDynamicsList({ payload }, { put, call }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(inquireClassDynamicsListByClassIdListForTeacherAccount, payload);
      if (networkUtils.isSuccess(response)) {
        yield put({
          type: 'getClassList',
          payload: {
            pageCount: response,
            classDynamicsList: response.datas,
          }
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 根据评论ID列表获取评论内容(点赞信息)
    *inquireClassDynamicsCommentContentList({ payload }, { put, call }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(inquireClassDynamicsCommentContentListByCommentIdListAccount, payload);
      if (networkUtils.isSuccess(response)) {
        yield put({
          type: 'getComment',
          payload: {
            commentContentList: response.datas,
          }
        });
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }
    },

    // -----定时
    // 根据班级ID查询班级动态列表
    *inquireClassDynamicsListSetTime({ payload }, { put, call }) {

      const response = yield call(inquireClassDynamicsListByClassIdListForTeacherAccount, payload);
      if (networkUtils.isSuccess(response)) {
        yield put({
          type: 'getClassList',
          payload: {
            pageCount: response,
            classDynamicsList: response.datas,
          }
        });
      }

    },

    // 根据评论ID列表获取评论内容(点赞信息)
    *inquireClassDynamicsCommentContentListSetTime({ payload }, { put, call }) {

      const response = yield call(inquireClassDynamicsCommentContentListByCommentIdListAccount, payload);
      if (networkUtils.isSuccess(response)) {
        yield put({
          type: 'getComment',
          payload: {
            commentContentList: response.datas,
          }
        });

      }
    },

    // 查询教师本人发布的动态列表
    *inquireDynamicsListByTeacherAccount({ payload }, { put, call }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(inquireDynamicsListByTeacherAccount, payload);
      if (networkUtils.isSuccess(response)) {
        yield put({
          type: 'getMyClassList',
          payload: {
            mineClassDynamicsList: response.datas,
          }
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 查询当前账户信息
    *inquireCurrentAccountInfo({ payload }, { put, call }) {
      const response = yield call(inquireCurrentAccountInfo, payload);
      if (networkUtils.isSuccess(response)) {
        yield put({
          type: 'getInfo',
          payload: {
            accountInfo: response.datas[0],
          }
        });
      }
    },
    // 根据accountIdList查询用户信息列表
    *inquireClassDynamicsUserInfoList({ payload }, { put, call }) {
      const response = yield call(inquireClassDynamicsUserInfoListByAccountListAccount, payload);
      if (networkUtils.isSuccess(response)) {
        yield put({
          type: 'getInfoList',
          payload: {
            UserInfoList: response.datas,
          }
        });
      }
    },
    // 教师获取未读消息
    *getUnreadCount({ payload }, { put, call }) {
      const response = yield call(inquireClassDynamicsUnreadOperatingMessageCountForTeacherAccount, payload);
      if (networkUtils.isSuccess(response)) {
        yield put({
          type: 'getNews',
          payload: {
            unreadNews: response.datas[0],
          }
        });
      }
    },

    //  未读消息详情
    *getUnreadDetails({ payload }, { put, call }) {
      const response = yield call(inquireClassDynamicsUnreadOperatingMessageForTeacherAccount, payload);
      if (networkUtils.isSuccess(response)) {
        yield put({
          type: 'getNewsDetails',
          payload: {
            messageDetails: response.datas,
          }
        });
      }
    },

    // 教师获取已读消息
    *inquireClassDynamicsReadMessageForTeacherAccount({ payload }, { put, call }) {
      const response = yield call(inquireClassDynamicsReadMessageForTeacherAccount, payload);
      if (networkUtils.isSuccess(response)) {
        yield put({
          type: 'getReadNews',
          payload: {
            readNews: response.datas,
          }
        });
      }
    },

    // 根据消息ID列表获取评论列表
    *inquireClassDynamicsCommentListByMessageIdListAccount({ payload }, { put, call }) {
      const response = yield call(inquireClassDynamicsCommentListByMessageIdListAccount, payload);
      if (networkUtils.isSuccess(response)) {
        yield put({
          type: 'getNewsId',
          payload: {
            commentListByMessageId: response.datas,
          }
        });
      }
    },

    // 根据  班级动态ID  列表查询班级动态列表
    *inquireClassDynamicsListByClassDynamicsIdListForTeacherAccount({ payload }, { put, call }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(inquireClassDynamicsListByClassDynamicsIdListForTeacherAccount, payload);
      if (networkUtils.isSuccess(response)) {
        yield put({
          type: 'getIdClassList',
          payload: {
            classDynamicsByIdList: response.datas,
          }
        });
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }
    },

    // 查询用户指定产品权限代码列表
    *inquireOperationCodeListByProductAccount({ payload }, { put, call }) {
      const response = yield call(inquireOperationCodeListByProductAccount, payload);
      if (networkUtils.isSuccess(response)) {
        yield put({
          type: 'getAuthorityList',
          payload: {
            authorityList: response.datas[0],
          }
        });
      }
    },



    // 删除班级动态点赞
    *deleteClassDynamicsLikeAccount({ payload }, { call }) {
      yield call(deleteClassDynamicsLikeAccount, payload);
    },
    // 创建班级动态点赞
    *createClassDynamicsLikeAccount({ payload }, { call }) {
      yield call(createClassDynamicsLikeAccount, payload);
    },
    // 创建班级动态评论(回复)
    *createClassDynamicsCommentAccount({ payload }, { put, call }) {
      const response = yield call(createClassDynamicsCommentAccount, payload);
      if (networkUtils.isSuccess(response)) {
        yield put({
          type: 'getId',
          payload: {
            createDynamicsId: response.datas[0],
          }
        });
      }
    },
    // 删除班级动态评论(回复)
    *deleteClassDynamicsCommentAccount({ payload }, { call }) {
      yield call(deleteClassDynamicsCommentAccount, payload);
    },
    // 删除班级动态
    *deleteClassDynamicsAccount({ payload }, { call }) {
      yield call(deleteClassDynamicsAccount, payload);
    },


  },


  reducers: {
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    getClassList(state, { payload }) {
      return {
        ...state,
        classDynamicsList: payload.classDynamicsList,
        pageCount: {
          totalPageCount: payload.pageCount.totalPageCount,
          totalRecordCount: payload.pageCount.totalRecordCount,
        }
      };
    },
    getNews(state, { payload }) {
      return {
        ...state,
        unreadNews: payload.unreadNews,
      };
    },
    getNewsDetails(state, { payload }) {
      return {
        ...state,
        messageDetails: payload.messageDetails,
      };
    },
    getAuthorityList(state, { payload }) {
      return {
        ...state,
        authorityList: payload.authorityList,
      };
    },
    getNewsId(state, { payload }) {
      return {
        ...state,
        commentListByMessageId: payload.commentListByMessageId,
      };
    },
    getId(state, { payload }) {
      return {
        ...state,
        createDynamicsId: payload.createDynamicsId,
      };
    },
    getIdClassList(state, { payload }) {
      return {
        ...state,
        classDynamicsByIdList: payload.classDynamicsByIdList,
      };
    },
    getReadNews(state, { payload }) {
      return {
        ...state,
        readNews: payload.readNews,
      };
    },
    getMyClassList(state, { payload }) {
      return {
        ...state,
        mineClassDynamicsList: payload.mineClassDynamicsList,
      };
    },
    getComment(state, { payload }) {
      return {
        ...state,
        commentContentList: payload.commentContentList,
      };
    },
    getInfo(state, { payload }) {
      return {
        ...state,
        accountInfo: payload.accountInfo,
      };
    },
    getInfoList(state, { payload }) {
      return {
        ...state,
        UserInfoList: payload.UserInfoList,
      };
    },
  },
}
