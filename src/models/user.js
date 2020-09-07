import { query as queryUsers, queryCurrent } from '@/services/user';
import { setAuthority } from '@/utils/authority';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    // saveCurrentUser(state, action) {
    //   return {
    //     ...state,
    //     currentUser: action.payload || {},
    //   };
    // },

    saveCurrentUser(state, action) {
      const response = action.payload.datas[0];
      setAuthority(response.roleList);
      return {
        ...state,
        currentUser: {name: response.userName} || {},
      };
    },

    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
