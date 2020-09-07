/* eslint-disable no-underscore-dangle */
import dtoUtils from "./dtoUtils";
import { Toast } from 'antd-mobile';
import wxApi from './wxApi';
import router from 'umi/router';

const AJAX_FILE_TYPE = 'fs';
const nativeContext = window._android_context;

const nativeService = {
  ajaxClient: nativeContext ? nativeContext.getService('ajaxClient') : {},
  sessionManager: nativeContext ? nativeContext.getService('sessionManager') : {},
  pageManager: nativeContext ? nativeContext.getService('pageManager') : {},
  socialShareManager : nativeContext ? nativeContext.getService('socialShareManager') : {},
  mediaManager : nativeContext ? nativeContext.getService('mediaManager') : {},
  networkManager : nativeContext ? nativeContext.getService('networkManager') : {},
};

let couldToken = '';

const ajaxQueueMap = new Map();

window._android_ajax_complete = function(token) {
    const tokenObject = ajaxQueueMap.get(token);
    if (tokenObject) {
        let response = nativeService.ajaxClient.getData(token);

        if (tokenObject.type === AJAX_FILE_TYPE) {
            response = dtoUtils.resolveFileResponse(response);
        }

        if(dtoUtils.isSuccess(response) || response.data.length) {
            const fileList = response.data.map(file => (
                {
                    filename: file.fileName,
                    fileUuid: file.fileUuid,
                    fileSize: file.fileSize,
                    fileFormat: dtoUtils.resolveSuffix(file.fileName),
                }
            ));

            tokenObject.resolve(fileList);
        }

    }
};

window._android_on_resume = function() {

};

window._cloud_select_complete = function(fileList) {
  const componentKeyObject = ajaxQueueMap.get(couldToken);
  if (componentKeyObject) {
    componentKeyObject.resolve(JSON.parse(fileList));
  }
};

window._android_on_record_complete = function(token) {
  const response = nativeService.mediaManager.getData(token);
  const {filePath} = JSON.parse(response).data[0];
  const uploadToken = nativeService.ajaxClient.uploadFileLoading(filePath);
  ajaxQueueMap.set(uploadToken, ajaxQueueMap.get('voice'))
};

const nativeApi = {
    native() {
        if (typeof nativeContext === 'undefined') {
            return false;
        }

        return true;
    },

    /**
     * 获取会话
     */
    getSessionUuid() {
        return nativeService.sessionManager.getCurrentSessionUuid();
    },

    /**
     * 返回
     */
    back() {
      if(wxApi.isWeixinBrowser()){
        router.goBack();
        return;
      }
      if (!this.native()) {
          return;
      }
      nativeService.pageManager.back();
    },

    close() {
      if (!this.native()) {
        return;
      }

      try {
        nativeService.pageManager.closeWebView();
      } catch (e) {
        console.log(e);
      }

      nativeService.pageManager.close();
    },

    onBackPressed(action) {
      window._android_on_back_pressed = action;
    },

    /**
     * 获取接口地址
     * @returns {string}
     */
    getApiPath() {
        return !this.native() ? '/store/api/' : nativeContext.getApiPath();

        // return '/store/api/';
    },

    /** w文件相关* */
    /**
     * 获取文件接口
     * @returns {string}
     */
    getFsPath() {
        return !this.native() ? '/fs/api/' : nativeContext.getFsPath();

        // return '/fs/api/';
    },

    async selectImageFileAndCaptureImage(isSelectFile, limit) {
        if (!this.native()) {
            return;
        }

        const options = {
          isSelectFile: isSelectFile || false,
          maxcount: limit || "",
        };

        return new Promise((resolve) => {
            const token = nativeService.ajaxClient.selectImageFileAndCaptureImage(JSON.stringify(options));

            ajaxQueueMap.set(token, {
                type: AJAX_FILE_TYPE,
                resolve,
            });

        });
    },

  async newSelectImageFileAndCaptureImage() {
    if (!this.native()) {
      return;
    }
    const options = { "isSelectFile":"true", "maxcount":"9", "enableCloud":"true", "token":"null"};

    return new Promise((resolve) => {
      const token = nativeService.ajaxClient.selectImageFileAndCaptureImage(JSON.stringify(options));
      couldToken = token;
      ajaxQueueMap.set(token, {
        type: AJAX_FILE_TYPE,
        resolve,
      });
    });
  },


  openUri(url, packageName) {
      nativeService.pageManager.loadBundle(packageName, url);
  },

  openLink(url) {
    nativeService.ajaxClient.openUrlSystem(url);
  },

  socialShare(opt){
    nativeService.socialShareManager.share(JSON.stringify(opt));
  },

  shareLeave(param){
    param = JSON.stringify(param);
    nativeService.mediaManager.shareLeave(param);
  },

  shareScreenShot(){
    nativeService.mediaManager.shareScreenShot();
  },

  startRecord(){
    nativeService.mediaManager.startRecord();
  },

  endRecord(){
    if (!this.native()) {
      return;
    }
    nativeService.mediaManager.endRecord();
    return new Promise((resolve) => {

      ajaxQueueMap.set('voice', {
        type: AJAX_FILE_TYPE,
        resolve,
      });
    });
  },

  playAudio(url) {
    if (!this.native()) {
      return;
    }
    nativeService.mediaManager.playAuido(url);
  },

  stopAudio() {
    if (!this.native()) {
      return;
    }
    nativeService.mediaManager.stopAuido();
  },

};

export default nativeApi;
