import {
  inquireOwnOrganizationTreeTenant,
  inquireOwnOrganizationTreeByKeywordTenant,
} from '@/services/component/employeeSelector';

export default {
  namespace: 'employeeSelector',

  state: {
    loading: true,
    ownDatas: [],
    ownSearchDatas: [],
    ownSearchLoading: true,
  },

  reducers: {
    fetchOwnDatas(state, { payload }){
      return { ...state, ownDatas: payload.datas };
    },

    fetchOwnSearchDatas(state, { payload }){
      return { ...state, ownSearchDatas: payload.datas};
    },

    changeLoading(state, { payload }){
      return {
        ...state,
        loading: payload,
      }
    },

    changeSearchLoading(state, { payload }){
      console.log('model', payload)
      return {
        ...state,
        ownSearchLoading: payload,
      }
    },
  },

  effects: {
    *inquireOwnOrganizationTreeTenant(payload, { call, put }){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(inquireOwnOrganizationTreeTenant, payload);
      yield put({
        type: 'fetchOwnDatas',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },


    *inquireOwnOrganizationTreeByKeywordTenant(payload, { call, put }){
      yield put({
        type: 'changeSearchLoading',
        payload: true,
      });
      const response = yield call(inquireOwnOrganizationTreeByKeywordTenant, payload);
      yield put({
        type: 'fetchOwnSearchDatas',
        payload: response,
      });
      yield put({
        type: 'changeSearchLoading',
        payload: false,
      });
    },


  }
}
