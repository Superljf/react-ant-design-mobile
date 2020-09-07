import {stringify} from 'qs';
import request from '../utils/request'

export async function inquireCnNoticeByParentList(payload){
  return request('inquireCnNoticeByParentListAccount', {
    method: 'POST',
    body: stringify(payload),
  })
}

// export async function inquireCnNoticePublished(payload){
//   return request('inquireCnNoticePublishedAccount', {
//     method: 'POST',
//     body: stringify(payload),
//   })
// }

// export async function inquireCnNoticePublished(payload){
//   return request('inquireCnNoticePublishedByFamilyAccount', {
//     method: 'POST',
//     body: stringify(payload),
//   })
// }

export async function inquireCnNoticePublished(payload){
  return request('inquireCnNoticePublishedByParentAccount', {
    method: 'POST',
    body: stringify(payload),
  })
}

export async function updateCnNoticeReadByParentList(payload){
  return request('updateCnNoticeReadByParentListAccount', {
    method: 'POST',
    body: stringify(payload),
  })
}
