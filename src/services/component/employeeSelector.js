import request from '@/utils/request';
import { parsePayloadParam } from '@/utils/utils';
// import { stringify } from 'qs';

/**
 * 本单位
 * @param payload
 * @returns {Promise<void>}
 */
export async function inquireOwnOrganizationTreeTenant(payload){
  return request('inquireOwnOrganizationTreeTenant.json', {
    method: 'POST',
    body:parsePayloadParam(payload),
  })
};

/**
 * 本单位人员搜索
 * @param payload
 * @returns {Promise<void>}
 */
export async function inquireOwnOrganizationTreeByKeywordTenant(payload){
  return request('inquireOwnOrganizationTreeByKeywordTenant.json', {
    method: 'POST',
    body: parsePayloadParam(payload),
  })
};
