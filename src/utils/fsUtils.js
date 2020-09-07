import { message } from 'antd';
import nativeApi from "./nativeApi";
import dtoUtils from './dtoUtils';
import base from './base';
import wxApi from './wxApi';

const FS_API_PATH = '/fs/api/';
const IMAGE_ACCEPTS = ["image/jpg", "image/jpeg", "image/png"];
const fsUtils = {
  IMAGE_ACCEPTS,
  getAction(action, version, format) {
    let url = nativeApi.native() ? nativeApi.getFsPath() : FS_API_PATH;

    if (version) {
      url += `${version}/`;
    } else {
      url += 'v1.0/';
    }

    url += `${action}`;

    if (format) {
      url += `.${format}`;
    } else {
      url += '.json';
    }

    return url;
  },
  getFileUploadAddress() {
    return this.getAction("uploadFile");
  },
  getViewFileAddress(fileUuid) {
    return `${this.getAction("viewPic", null, "file")}?fileUuid=${fileUuid}`;
  },
  getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  },
  resolveSuffix(fileName) {
    return dtoUtils.resolveSuffix(fileName);
  },
  resolveResponse(response) {
    return dtoUtils.resolveFileResponse(response);
  },
  gotoFilePreview(fileUuid, fileName) {
    if (nativeApi.native()) {
      nativeApi.openUri(`index.html#?fileUuid=${fileUuid}&fileName=${encodeURIComponent(fileName)}`, "YX_FILE-PREVIEW_APP");
    }else if (base.isMobile() || wxApi.isWeixin()) {
      window.location.href = `/YX_FILE-PREVIEW_APP/index.html#?fileUuid=${fileUuid}&fileName=${encodeURIComponent(fileName)}`;
    } else {
      let filePath = "";
      if (navigator.userAgent.indexOf("MSIE 9.0") > 0) {
        filePath = `../fileView/view.html?uuid=${fileUuid}&fn=${encodeURIComponent(fileName)}`;
      } else {
        filePath = this.getFilePreviewAddress(fileUuid, fileName);
      }
      window.open(`${filePath}`);
    }
  },
  getFilePreviewAddress(fileUuid, fileName) {
    return `/file-preview/1.0/?fileUuid=${fileUuid}&fileName=${encodeURIComponent(fileName)}`;
  },
  getImageAccept() {
    return IMAGE_ACCEPTS.join(',');
  },
  beforeUpload(file, acceptTypes, sizeLimit) {

    const isJPG = acceptTypes.includes(file.type);
    if (!isJPG) {
      message.error('You can only upload Image file!');
    }
    const isLt5M = file.size / 1024 / 1024 < sizeLimit;
    if (!isLt5M) {
      message.error(`Image must smaller than ${sizeLimit}MB!`);
    }
    return isJPG && isLt5M;
  },
  validUploadFileList(info) {
    let {fileList} = info;

    fileList = fileList.map((file) => {
      let newFile = file;

      if (file.response) {
        const {response} = file;

        if (response.flag === 'SUCCESS') {
          newFile = {
            ...file,
            url: fsUtils.getViewFileAddress(response.data[0].fileUuid),
          };
        }
      }

      return newFile;
    });

    fileList = fileList.filter((file) => {
      if (file.response) {
        return file.response.flag === 'SUCCESS';
      }

      return true;
    });

    return fileList;
  },
};

export default fsUtils;
