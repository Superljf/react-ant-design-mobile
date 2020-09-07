// import networkUtils from '@/utils/networkUtils';
import {
  createClassDynamicsAccount,
} from '@/services/createDynamics';

export default {
  namespace: 'createDynamics',

  state: {
    loading: true,
  },


  effects: {
    // 新建班级动态
    *createClassDynamics({ payload }, { put, call }) {
       yield call(createClassDynamicsAccount, payload);
    },
  },


  reducers: {
    changeLoading(state, { payload }) {
      return {
        ...state,
        loading: payload,
      }
    },
  },
}
