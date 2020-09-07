import router from 'umi/router';
import React from 'react';
import { List } from 'antd-mobile';
import { getUrlParamReg } from './utils';
import { leave, honor, studentCard, holiday, workStudy } from './constants';

const {Item } = List;
const {Brief} = Item;

export  function formatBreadcrumbList(breadcrumb) {
  const tab = localStorage.getItem('tab') || '1';
  const identityKey = localStorage.getItem('identityKey');
  let href = identityKey === 'ART_TEACHER' ? `/apply_t/${breadcrumb.modular}/tabs?tab=${tab}` : `/apply_s/${breadcrumb.modular}/tabs?tab=${tab}`;
  // 学生事务申请外的面包屑初步通配:
  if(breadcrumb.menu){
    href = `/${breadcrumb.menu}/${breadcrumb.modular}/`;
    return [{
      title: '首页',
      href: '/'},{
      title:breadcrumb.third,
      href,
    },{
      title: breadcrumb.fourth,
    }]
  }else{
    return [{
      title: '首页',
      href: '/',
    }, {
      title: breadcrumb.second,
    }, {
      title: breadcrumb.third,
      href,
    }, {
      title: breadcrumb.fourth,
    }]
  }
;
}

/**
 * tab点击
 * @param key
 */
export function routerTabClick(key){
  localStorage.setItem('tab', key);
  if( getUrlParamReg('tab') === key){
    return;
  }
  let pathName =  window.location.hash;
  const indexHash = pathName.lastIndexOf('#')+1;
  pathName = pathName.substring(indexHash, pathName.length);
  if(pathName.lastIndexOf('?') > -1){
    pathName = pathName.substring(0, pathName.lastIndexOf('?'));
  }
  router.push(`${pathName}?tab=${key}`);
}

export function defaultTabsKey(){
  return getUrlParamReg('tab') || '1'
}

export function saveData(response, payload) {
  if(response.flag === 'SUCCESS'){
    const sid = response.datas[0].sessionUuid;
    localStorage.setItem('sid', sid);
    localStorage.setItem('accountName',payload.accountName);
    localStorage.setItem('code',payload.code);
    localStorage.setItem('appKey',payload.appKey);
    localStorage.setItem('identityKey',payload.identityKey);
  }
}
// mobile
export function homeList(dataSource, style){
  return dataSource.map(data => {
    return (
      <span key={data.listId}>
        <div style={{height: '12px', backgroundColor: '#F5F5F9'}} />
        <Item multipleLine onClick={data.action.bind(this, data.listId)}>
          <div style={{position: 'relative'}}>
            <span>{data.fullName}</span>
            <span className={style.titleType}>{data.titleType}</span>
          </div>
          <Brief>
            <span className={style.content}>{data.content1}</span>
            <br />
            <span className={style.content}>{data.content2}</span>
          </Brief>
        </Item>
        <div className={style.applyDate}>{data.date}</div>
      </span>
    )});
}

// mobile
export function leaveList(dataSource, style){
  return dataSource.map(data => {
    return (
      <span key={data.listId}>
        <div style={{height: '12px', backgroundColor: '#F5F5F9'}} />
        <Item multipleLine onClick={data.action}>
          <div style={{position: 'relative'}}>
            <span>{leave.leaveType[data.leaveType]}</span>
          </div>
          <span className={style.leaveState} style={{backgroundColor: leave.leaveStateColor[Number(data.leaveState)]}}>{leave.leaveState[data.leaveState]}</span>
          <Brief>
            <span className={style.content}>{data.content1}</span>
            <br />
            <span className={style.content}>{data.content2}</span>
          </Brief>
        </Item>
        <div className={style.applyDate}>{data.date}</div>
      </span>
    )});
}

// mobile
export function renderHonorList(dataSource, style){
  return dataSource.map(data => {
    return (
      <span key={data.listId}>
        <div style={{height: '12px', backgroundColor: '#F5F5F9'}} />
        <Item multipleLine onClick={data.action}>
          <div style={{position: 'relative'}}>
            <span>{leave.leaveType[data.leaveType]}</span>
          </div>
          <span className={style.leaveState} style={{backgroundColor: honor.nodeStateColors[Number(data.honorState)]}}>{honor.honorState[data.honorState]}</span>
          <Brief>
            <span className={style.content}>{data.content1}</span>
            <br />
            <span className={style.content}>{data.content2}</span>
            <br />
            <span className={style.content}>{data.honorDate}</span>
          </Brief>
        </Item>
        <div className={style.applyDate}>{data.date}</div>
      </span>
    )});
}

export function renderPunishmentList(dataSource, style){
  return dataSource.map(data => {
    return (
      <span key={data.listId}>
        <div style={{height: '12px', backgroundColor: '#F5F5F9'}} />
        <Item multipleLine onClick={data.action}>
          <div style={{position: 'relative'}}>
            <span>{data.punishmentLevel}</span>
          </div>
          <span className={style.leaveState} style={{backgroundColor: leave.leaveStateColor[Number(data.punishmentState)]}}>
            {data.punishmentState === 1 ? '进行中' : '撤销'}
          </span>
          <Brief>
            <span className={style.content}>{data.content1}</span>
            <br />
            <span className={style.content}>{data.content2}</span>
          </Brief>
        </Item>
        <div className={style.applyDate}>{data.date}</div>
      </span>
    )});
}

export function renderStudentCardList(dataSource, style){
  return dataSource.map(data => {
    return (
      <span key={data.listId}>
        <div style={{height: '12px', backgroundColor: '#F5F5F9'}} />
        <Item multipleLine onClick={data.action}>
          <div style={{position: 'relative'}}>
            <span>{data.punishmentLevel}</span>
          </div>
          <span className={style.leaveState} style={{backgroundColor: leave.leaveStateColor[Number(data.handleState)]}}>
            {studentCard.handleState[data.handleState]}
          </span>
          <Brief>
            <span className={style.content}>{data.content1}</span>
            <br />
            <span className={style.content}>{data.content2}</span>
          </Brief>
        </Item>
        <div className={style.applyDate}>{data.date}</div>
      </span>
    )});
}

export function renderFestivalLeaveList(dataSource, style){
  return dataSource.map(data => {
    return (
      <span key={data.listId}>
        <div style={{height: '12px', backgroundColor: '#F5F5F9'}} />
        <Item multipleLine onClick={data.action}>
          <div style={{position: 'relative'}}>
            <span>{data.festivalName}</span>
          </div>
          <span className={style.leaveState} style={{backgroundColor: holiday.backStateColor[Number(data.backState)]}}>
            {holiday.backStr[data.backState]}
          </span>
          <Brief>
            <span className={style.content}>{data.content1}</span>
            <br />
            <span className={style.content}>{data.content2}</span>
          </Brief>
        </Item>
        <div className={style.applyDate}>{data.date}</div>
      </span>
    )});
}

export function renderWorkStudyApplyList(dataSource, style){
  return dataSource.map(data => {
    return (
      <span key={data.listId}>
        <div style={{height: '12px', backgroundColor: '#F5F5F9'}} />
        <Item multipleLine onClick={data.action}>
          <div style={{position: 'relative'}}>
            <span>{data.jobName}</span>
          </div>
          <span className={style.leaveState} style={{backgroundColor: workStudy.stateColor[Number(data.applyState)]}}>
            {workStudy.applyState[data.applyState]}
          </span>
          <Brief>
            <span className={style.content}>{data.content1}</span>
          </Brief>
        </Item>
        <div className={style.applyDate}>{data.date}</div>
      </span>
    )});
}

export function renderGrantApplyList(dataSource, style){
  return dataSource.map(data => {
    return (
      <span key={data.listId}>
        <div style={{height: '12px', backgroundColor: '#F5F5F9'}} />
        <Item multipleLine onClick={data.action}>
          <div style={{position: 'relative'}}>
            <span>{data.poorLevel}</span>
          </div>
          <span className={style.leaveState} style={{backgroundColor: workStudy.stateColor[Number(data.applyState)]}}>
            {workStudy.applyState[data.applyState]}
          </span>
          <Brief>
            <span className={style.content}>{data.content1}</span>
          </Brief>
        </Item>
        <div className={style.applyDate}>{data.date}</div>
      </span>
    )});
}

export function renderLoanApplyList(dataSource, style){
  return dataSource.map(data => {
    return (
      <span key={data.listId}>
        <div style={{height: '12px', backgroundColor: '#F5F5F9'}} />
        <Item multipleLine onClick={data.action}>
          <span className={style.leaveState} style={{backgroundColor: workStudy.stateColor[Number(data.applyState)]}}>
            {workStudy.applyState[data.applyState]}
          </span>
          <Brief>
            <span className={style.content}>{data.content1}</span>
            <br />
            <span className={style.content}>{data.content2}</span>
          </Brief>
        </Item>
        <div className={style.applyDate}>{data.date}</div>
      </span>
    )});
}
