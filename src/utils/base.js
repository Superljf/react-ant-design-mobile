import nativeApi from "./nativeApi";
import wxApi from "./wxApi";

const base = {
  /**
   * 是否安卓终端
   * @returns {boolean}
   */
  isAndroid() {
    const userAgent = window.navigator.userAgent.toLowerCase();

    return /Android/i.test(userAgent);
  },

  /**
   * 是否iOS终端
   * @returns {boolean}
   */
  isIos() {
    const userAgent = window.navigator.userAgent.toLowerCase();

    return /iPhone/i.test(userAgent);
  },

  /**
   * 是否移动端
   * @returns {*|boolean}
   */
  isMobile() {
    return this.isAndroid() || this.isIos();
  },

  /**
   * 返回
   */
  back() {
    if (nativeApi.native()) {
      nativeApi.back();
    } else {
      window.history.back();
    }
  },

  /**
   * 页面关闭
   */
  close() {
    if (nativeApi.native()) {
      nativeApi.close();
    } else if (wxApi.isWeixin()) {
      wxApi.closeWindow();
    } else {
      window.history.back();
    }
  },
};

export default base;
