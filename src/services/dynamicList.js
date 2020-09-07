import request from '@/utils/request';
import networkUtils from '@/utils/networkUtils';


// 根据班级ID查询班级动态列表
// eslint-disable-next-line import/prefer-default-export
export async function inquireClassDynamicsListByClassIdListForTeacherAccount(payload) {
  return request(networkUtils.getAction('inquireClassDynamicsListByClassIdListForTeacherAccount'), {
    method: 'POST',
    body: networkUtils.getRequestBody(payload),
  });
}

// 根据评论ID列表获取评论内容(点赞信息)
export async function inquireClassDynamicsCommentContentListByCommentIdListAccount(payload) {
  return request(networkUtils.getAction('inquireClassDynamicsCommentContentListByCommentIdListAccount'), {
    method: 'POST',
    body: networkUtils.getRequestBody(payload),
  });
}


// 查询当前账户信息
export async function inquireCurrentAccountInfo(payload) {
  return request(networkUtils.getAction('inquireCurrentAccountInfo'), {
    method: 'POST',
    body: networkUtils.getRequestBody(payload),
  });
}

// 删除班级动态点赞
export async function deleteClassDynamicsLikeAccount(payload) {
  return request(networkUtils.getAction('deleteClassDynamicsLikeAccount'), {
    method: 'POST',
    body: networkUtils.getRequestBody(payload),
  });
}

// 创建班级动态点赞
export async function createClassDynamicsLikeAccount(payload) {
  return request(networkUtils.getAction('createClassDynamicsLikeAccount'), {
    method: 'POST',
    body: networkUtils.getRequestBody(payload),
  });
}

// 创建班级动态评论(回复)
export async function createClassDynamicsCommentAccount(payload) {
  return request(networkUtils.getAction('createClassDynamicsCommentAccount'), {
    method: 'POST',
    body: networkUtils.getRequestBody(payload),
  });
}


// 删除班级动态评论(回复)
export async function deleteClassDynamicsCommentAccount(payload) {
  return request(networkUtils.getAction('deleteClassDynamicsCommentAccount'), {
    method: 'POST',
    body: networkUtils.getRequestBody(payload),
  });
}


// 删除班级动态
export async function deleteClassDynamicsAccount(payload) {
  return request(networkUtils.getAction('deleteClassDynamicsAccount'), {
    method: 'POST',
    body: networkUtils.getRequestBody(payload),
  });
}

// 查询教师本人发布的动态列表
export async function inquireDynamicsListByTeacherAccount(payload) {
  return request(networkUtils.getAction('inquireDynamicsListByTeacherAccount'), {
    method: 'POST',
    body: networkUtils.getRequestBody(payload),
  });
}


// 新教师获取未读消息
export async function inquireClassDynamicsUnreadOperatingMessageCountForTeacherAccount(payload) {
  return request(networkUtils.getAction('inquireClassDynamicsUnreadOperatingMessageCountForTeacherAccount'), {
    method: 'POST',
    body: networkUtils.getRequestBody(payload),
  });
}

// 新教师获取未读消息详情
export async function inquireClassDynamicsUnreadOperatingMessageForTeacherAccount(payload) {
  return request(networkUtils.getAction('inquireClassDynamicsUnreadOperatingMessageForTeacherAccount'), {
    method: 'POST',
    body: networkUtils.getRequestBody(payload),
  });
}





// 教师获取已读消息
export async function inquireClassDynamicsReadMessageForTeacherAccount(payload) {
  return request(networkUtils.getAction('inquireClassDynamicsReadMessageForTeacherAccount'), {
    method: 'POST',
    body: networkUtils.getRequestBody(payload),
  });
}




// 根据消息ID列表获取评论列表
export async function inquireClassDynamicsCommentListByMessageIdListAccount(payload) {
  return request(networkUtils.getAction('inquireClassDynamicsCommentListByMessageIdListAccount'), {
    method: 'POST',
    body: networkUtils.getRequestBody(payload),
  });
}

// 根据班级动态ID列表查询班级动态列表
export async function inquireClassDynamicsListByClassDynamicsIdListForTeacherAccount(payload) {
  return request(networkUtils.getAction('inquireClassDynamicsListByClassDynamicsIdListForTeacherAccount'), {
    method: 'POST',
    body: networkUtils.getRequestBody(payload),
  });
}


// 根据accountIdList查询用户信息列表
export async function inquireClassDynamicsUserInfoListByAccountListAccount(payload) {
  return request(networkUtils.getAction('inquireClassDynamicsUserInfoListByAccountListAccount'), {
    method: 'POST',
    body: networkUtils.getRequestBody(payload),
  });
}


// 查询用户指定产品权限代码列表
export async function inquireOperationCodeListByProductAccount(payload) {
  return request(networkUtils.getAction('inquireOperationCodeListByProductAccount'), {
    method: 'POST',
    body: networkUtils.getRequestBody(payload),
  });
}





