import request from '@/utils/request';
import networkUtils from '@/utils/networkUtils';


// 新建班级动态
// eslint-disable-next-line import/prefer-default-export
export async function createClassDynamicsAccount(payload) {
  return request(networkUtils.getAction('createClassDynamicsAccount'), {
    method: 'POST',
    body: networkUtils.getRequestBody(payload),
  });
}




