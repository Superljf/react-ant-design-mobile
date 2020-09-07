import request from '@/utils/request';
import { stringify } from 'qs';

export async function inquireSubordinateUnitListTenant(payload) {
  return request('inquireSubordinateUnitListTenant.json', {
    method: 'POST',
    body: stringify(payload),
  })
}

export async function inquireZoneOrganizationTreeForAppTenant(payload){
  return request('inquireZoneOrganizationTreeForAppTenant.json', {
    method: 'POST',
    body: stringify(payload),
  })
}
