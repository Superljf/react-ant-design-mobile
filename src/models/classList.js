import networkUtils from '@/utils/networkUtils';
import {
  inquireClassesListByTeacherId,
  inquireCurrentSemester,
  inquireTeacherClassListCourseAccount,
  inquireGradeClassListSelectorComponentTenant,
} from '@/services/classList';

export default {
  namespace: 'classList',

  state: {
    loading: true,
    classList: [],
    newCreateList: [],
    currentCode: [],
    notMineClassList: [],
    selectedId: -1,
    gradeClassList: [],
    selectedClassList: [],
    currentSelectedClassList: [], // 班级圈选中的班级
  },


  effects: {
    // 获取班级列表
    *inquireClassesList({ payload }, { put, call }) {
      const response = yield call(inquireClassesListByTeacherId, payload);
      if (networkUtils.isSuccess(response)) {
        yield put({
          type: 'getClassList',
          payload: {
            classList: response.datas,
          }
        });
      }
    },
    // 查询当前学期码
    *inquireCurrentSemester({ payload }, { put, call }) {
      const response = yield call(inquireCurrentSemester, payload);
      if (networkUtils.isSuccess(response)) {
        yield put({
          type: 'getCode',
          payload: {
            currentCode: response.datas[0],
          }
        });
      }
    },
    // 教师授课班级
    *inquireTeacherClassListCourse({ payload }, { put, call }) {
      const response = yield call(inquireTeacherClassListCourseAccount, payload);
      if (networkUtils.isSuccess(response)) {
        yield put({
          type: 'getNotMine',
          payload: {
            notMineClassList: response.datas,
          }
        });
      }
    },

    // 教师授课班级
    *inquireGradeClassListSelector({ payload }, { put, call }) {
      const response = yield call(inquireGradeClassListSelectorComponentTenant, payload);
      if (networkUtils.isSuccess(response)) {
        yield put({
          type: 'getGradeClassListSelector',
          payload: {
            gradeClassList: response.datas,
          }
        });
      }
    },
    
  },


  reducers: {
    changeLoading(state, { payload }) {
      return {
        ...state,
        loading: payload,
      }
    },
    getClassList(state, { payload }) {
      return {
        ...state,
        classList: payload.classList,
      };
    },
    getCode(state, { payload }) {
      return {
        ...state,
        currentCode: payload.currentCode,
      };
    },
    getNotMine(state, { payload }) {
      return {
        ...state,
        notMineClassList: payload.notMineClassList,
      };
    },
    createList(state, { payload }) {
      return {
        ...state,
        newCreateList: payload.newCreateList,
      };
    },

    changeSelectedClassId(state, { payload }) {
      const { classId } = payload;
      return {
        ...state,
        selectedId: classId,
      }
    },

    getGradeClassListSelector(state, { payload }) {
      return {
        ...state,
        gradeClassList: payload.gradeClassList,
      };
    },

    getSelectedClassList(state, { payload }) {
      return {
        ...state,
        selectedClassList: payload.selectedClassList,
      };
    },

    getCurrentSelectedClassList(state, { payload }) {
      return {
        ...state,
        currentSelectedClassList: payload.currentSelectedClassList,
      };
    },
  },
}
