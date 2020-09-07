import {stringify} from 'qs';
import {
  inquireCnNoticeByParentList,
  inquireCnNoticePublished,
  updateCnNoticeReadByParentList,
} from '../../../services/classNotice';
import networkUtils from '../../../utils/networkUtils';
import nativeApi from '../../../utils/nativeApi';

export default {
  namespace: 'notice',

  state: {
    isLoading: true,
    noticeList: [],
    totalPageCount: 0,
    totalRecordCount: 0,

    noticeDetail: {},
    readSuccess: false,
  },

  effects: {
    *inquireCnNoticeByParentList({payload}, {put, call}){
      yield put({
        type:'saveState',
        payload: { isLoading: true},
      });

      const response = yield call(inquireCnNoticeByParentList, payload);

      yield put({
        type:'saveState',
        payload: {
          isLoading: false,
          noticeList: response.datas || [],
          totalPageCount: response.totalPageCount,
          totalRecordCount: response.totalRecordCount,
        },
      });
    },

    *inquireCnNoticePublished({payload}, {put, call}){
      yield put({
        type: 'saveState',
        payload: {noticeDetail: {}},
      });

      const response = yield call(inquireCnNoticePublished, payload);

      yield put({
        type: 'saveState',
        payload: {noticeDetail: response.datas[0] || {}},
      });
    },

    *updateCnNoticeReadByParentList({payload}, {put, call}){
      const response = yield call(updateCnNoticeReadByParentList, payload);
      yield put({
        type:'saveState',
        payload: { readSuccess: response.flag === 'SUCCESS'},
      });
    },
  },

  reducers: {
    saveState(state, { payload }){console.log(payload)
      return {...state, ...payload}
    }
  },
}
