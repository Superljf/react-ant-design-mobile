
import { inquireSubordinateUnitListTenant } from '@/services/component/companySelector';

export default {
  namespace: 'companySelector',

  state: {
    loading: true,
    companyDatas: [],
    zoneDatas: [],
  },

  reducers: {
    fetchCompanyList(state, { payload }){
      return {...state, companyDatas: payload.datas};
    },

    fetchZone(state, { payload }){
      return {...state, zoneDatas: payload.datas};
    },

    changeLoading(state, {payload}) {
      return {
        ...state,
        loading: payload,
      }
    },
  },

  effects: {
    *inquireSubordinateUnitListTenant({ payload }, { put, call }){
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      const response = yield call(inquireSubordinateUnitListTenant, payload);
      yield put({
        type: 'fetchCompanyList',
        payload: response,
      });

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
  }
}
