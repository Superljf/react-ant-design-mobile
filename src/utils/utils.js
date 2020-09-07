import moment from 'moment';
import React from 'react';
import nzh from 'nzh/cn';
import { parse, stringify } from 'qs';
import { Modal } from 'antd';

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  const year = now.getFullYear();
  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  return nzh.toMoney(n);
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  }
  if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

export function formatWan(val) {
  const v = val * 1;
  if (!v || Number.isNaN(v)) return '';

  let result = val;
  if (val > 10000) {
    result = Math.floor(val / 10000);
    result = (
      <span>
        {result}
        <span
          style={{
            position: 'relative',
            top: -2,
            fontSize: 14,
            fontStyle: 'normal',
            marginLeft: 2,
          }}
        >
          万
        </span>
      </span>
    );
  }
  return result;
}

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export function isAntdPro() {
  return window.location.hostname === 'preview.pro.ant.design';
}

export const importCDN = (url, name) =>
  new Promise(resolve => {
    const dom = document.createElement('script');
    dom.src = url;
    dom.type = 'text/javascript';
    dom.onload = () => {
      resolve(window[name]);
    };
    document.head.appendChild(dom);
  });


// 自己添加
/**
 * 获取url参数
 * @param paraName
 * @returns {*}
 */
export function getUrlParam(paraName) {
  const url = document.location.toString();
  const arrObj = url.split("?");
  if (arrObj.length > 1) {
    const arrPara = arrObj[1].split("&");
    let arr;

    for (let i = 0; i < arrPara.length; i+=1) {
      arr = arrPara[i].split("=");

      if (arr != null && arr[0] === paraName) {
        return arr[1];
      }
    }
    return "";
  }
  return "";
}

/**
 * 正则获取url参数
 * @param name
 * @returns {*}
 */
export function getUrlParamReg(name) {
  const regName = new RegExp(`(^|[?&])${  name  }=([^&]*)(&|$)`);
  const r = window.location.href.replace(/.*?[\?#](.*)/, "$1").match(regName);
  if(r != null) return decodeURIComponent(r[2]);
  return null;
};

/**
 * 数组转map
 * @param datas
 * @param key1
 * @param key2
 * @returns {Map<any, any>}
 */
export function datasToMap(datas, key1, key2){
  const map = new Map();
  datas.forEach((item) => {
    const key = key2 ? `${item[key1]}-${item[key2]}` : item[key1];
    map.set(key, item);
  })

  return map;
}

export function parsePayloadParam(payload){
  return stringify(payload.payload);
}

/**
 * 提交时弹出提示层
 * @param title
 * @returns {{destroy: () => void; update: (newConfig: ModalFuncProps) => void}}
 */
export function submitShowModal(title){
  return Modal.info({
    title,
    content: '正在提交，请稍等...',
    maskClosable: false,
    keyboard: false,
    okButtonProps: { style: { display: 'none' } },
    closable: false,
  });
};


/**
 * 提交完成取消提示层
 * @param modal
 * @param flag
 * @param successContent
 * @param failContent
 */
export function hideSubmitModal(modal, flag, successContent, failContent ){
  let time = 1000;
  if(!flag){
    time = 3000;
  }
  hideModal(modal, flag ? successContent : failContent , time);
}

const hideModal = (modal, content, time) => {
  modal.update({
    content,
  });
  setTimeout(() => {
    modal.destroy();
  }, time);
};

// 附件提交解析
export function parseFileList(payload, fileList){
  const fileSizeList = [];
  const fileNameList = [];
  const fileUuidList = [];
  fileList.forEach(file => {
    fileSizeList.push(file.fileSize);
    fileNameList.push(file.fileName);
    fileUuidList.push(file.fileUuid);
  });
  return { ...payload, fileUuidList, fileNameList, fileSizeList };
}

/**
 * 序号
 * @param pageIndex
 * @param pageSize
 * @param index
 * @returns {*}
 */
export function serialNumber(pageIndex, pageSize, index){
  return (pageIndex-1) * pageSize + index;
}

export function historyBack(props, e){
  if(e)
    e.preventDefault();

  const { history } = props;
  history.goBack();
}


export function injectScript(url) {
  const script = document.createElement("script");
  script.src = url;
  document.head.appendChild(script);
};

export function init(){
  let pathPrefix = "https://injectionmamp/";
  if (pathPrefix === null) {
    console.log('Could not find mamp.js script tag. Plugin loading may fail.');
    pathPrefix = '';
  }
  injectScript(`${pathPrefix  }cordova.js`);
}
