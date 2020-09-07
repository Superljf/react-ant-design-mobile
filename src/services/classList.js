import request from '@/utils/request';
import networkUtils from '@/utils/networkUtils';


// 查询班主任管理班级列表,包含任课班级和班主任管理的班级 --班主任
// eslint-disable-next-line import/prefer-default-export
export async function inquireClassesListByTeacherId(payload) {
  return request(networkUtils.getAction('inquireClassesListByTeacherId'), {
    method: 'POST',
    body: networkUtils.getRequestBody(payload),
  });
}


// 查询当前学期
export async function inquireCurrentSemester(payload) {
  return request(networkUtils.getAction('inquireCurrentSemester'), {
    method: 'POST',
    body: networkUtils.getRequestBody(payload),
  });
}

// 教师授课班级 普通权限
export async function inquireTeacherClassListCourseAccount(payload) {
  return request(networkUtils.getAction('inquireTeacherClassListCourseAccount', 'v2.0'), {
    method: 'POST',
    body: networkUtils.getRequestBody(payload),
  });
}


// 班级选择器-全部年级班级
export async function inquireGradeClassListSelectorComponentTenant(payload) {
  return request(networkUtils.getAction('inquireGradeClassListSelectorComponentTenant', 'v2.0'), {
    method: 'POST',
    body: networkUtils.getRequestBody(payload),
  });
}



