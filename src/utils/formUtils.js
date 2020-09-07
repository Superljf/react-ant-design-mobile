import { message } from 'antd';
import { Toast } from 'antd-mobile';
import { stringify } from 'qs';
import React from 'react';
import { fsPath } from './constants';

export function handleFormValidateNumber(rule, value, callback){
  const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
  if (!((!Number.isNaN(value) && reg.test(value)) || value === '' || value === '-')) {
    callback('请输入数字');
  }
  callback();
}

export function handleInputNumberChange(e){
  e.preventDefault();
  const { value } = e.target;
  const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
  if (!((!Number.isNaN(value) && reg.test(value)) || value === '' || value === '-')) {
    message.info('请输入数字',3)
    e.target.value ='';
  }
}

/**
 * 表单中包含数组参数
 * @param payload
 * @returns {string}
 */
export function formArrayParamsParse(payload){
  const keys = Object.keys(payload);
  const param = {}
  let pstr = '';
  for(let i = 0; i < keys.length; i+=1){
    const key = keys[i];
    const val = payload[key];
    if(val instanceof Array){
      for (let j = 0; j <val.length ; j+=1) {
        const v = val[j];
        if(v || v === 0){
          pstr+=`${key}=${v}&`;
        }
      }
    }else{
      param[key] = val;
    }
  }

  return pstr + stringify(param);
}

/**
 * 必填星号
 * @param label
 * @returns {*}
 */
export function mustFill(label){
  return <span><span style={{color: '#FF0052'}}>*</span><span style={{color: '#262626'}}>{label}</span></span>
}

/**
 * 必填星号
 * @param label
 * @returns {*}
 */
export function mobileMustFill(label){
  return <span style={{color: '#FF0052'}}>*<span style={{fontSize:'13px', color:'#595959'}}>{label}：</span></span>
}


export function uploadImage(files){
  const fileList = {
    fileSizeList: [],
    fileNameList: [],
    fileUuidList: [],
    fileIndex: [],
  };
  for (let i = 0; i < files.length ; i+=1) {
    const file = files[i];
    const dataurl = file.url;
    const fileName = file.file.name;
    const imgFile = dataURLtoFile(dataurl, fileName);
    const formData = new FormData();
    Toast.info(`图片上传中...`, 0);
    formData.append('file', imgFile);
     fetch(`${fsPath}uploadFile.json`,{
      method: 'POST',
      body: formData,
    }).then((response) => response.json())
      .then((responseData) => {
        if(responseData.flag === 'SUCCESS'){
          const data = responseData.data[0];
          fileList.fileSizeList.push(data.fileSize);
          fileList.fileNameList.push(data.fileName);
          fileList.fileUuidList.push(data.fileUuid);
          file.uuid = data.fileUuid;
          file.size = data.fileSize;
          file.name = data.fileName;
          if(fileList.fileUuidList.length === files.length){
            Toast.hide();
          }
        }else{
          Toast.fail(`${file.file.name}上传失败`, 1);
        }
      });
  }
  return fileList;
}

const dataURLtoFile = (dataurl, filename) => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while(n-=1){
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {type:mime});
};
