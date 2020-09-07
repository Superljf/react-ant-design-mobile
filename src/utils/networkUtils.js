import queryString from 'qs';
import nativeApi from "./nativeApi";
import dtoUtils from "./dtoUtils";

const API_PATH = '/store/api/';

const pagination = {
  current: 1,
  total: 0,
  pageSize: 10,
};

const defaultPageCriteria ={
  pageIndex: 1,
  pageSize: 10,
};

const networkUtils = {
  defaultPageCriteria,
  pagination,
  getSessionUuid() {
    return nativeApi.native() ? nativeApi.getSessionUuid() : window.localStorage.getItem("sid");
  },
  getAction(action, version, product, format) {
    let url = nativeApi.native() ? nativeApi.getApiPath() : API_PATH;

    if (product) {
      url += `${product}/`;
    }

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
  getRequestBody(params) {
    return new URLSearchParams(queryString.stringify({
      ...params,
      sessionUuid: this.getSessionUuid(),
    }, { indices: false }))
  },
  getFileAddress(action, params) {
    const url = this.getAction(action, null, null, 'file');

    return `${url}?sessionUuid=${this.getSessionUuid()}&${queryString.stringify(params)}`;
  },
  getPagination(response) {
    return {
      current: Number(response.pageIndex),
      total: Number(response.totalRecordCount),
      pageSize: Number(response.pageSize),
    }
  },
  isSuccess(response) {
    return dtoUtils.isSuccess(response);
  },
};

export default networkUtils;
