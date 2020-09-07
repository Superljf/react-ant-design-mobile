/* eslint-disable no-undef */
import dataUtils from "./dataUtils";

const wxService = window.wx;

const wxApi = {
  /**
   * 是否微信终端
   * @returns {boolean}
   */
  isWeixin() {
    const userAgent = window.navigator.userAgent.toLowerCase();

    return /micromessenger/i.test(userAgent) && dataUtils.checkTrue(dataUtils.getData("weixinAuthorized"));
  },

  /**
   * 是否微信终端浏览器
   * @returns {boolean}
   */
  isWeixinBrowser() {
    const userAgent = window.navigator.userAgent.toLowerCase();

    return /micromessenger/i.test(userAgent);
  },

  /**
   * 配置初始化
   * @param options
   */
  init(options) {
    //options
    // appId: 'wx5385f30f8c848040', // 必填，公众号的唯一标识
    // timestamp: 1547725706324, // 必填，生成签名的时间戳
    // nonceStr: '123456', // 必填，生成签名的随机串
    // signature: 'd31c528998c20acc6bdb1963fbfd82270b0c00e8',// 必填，签名
    // jsApiList: ['chooseImage', 'getNetworkType', 'previewImage', 'startRecord', 'closeWindow', 'uploadImage', 'updateAppMessageShareData'], // 必填，需要使用的JS接口列表

    const {
      success,
      failure,
    } = options;

    wxService.config({
      ...options,
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    });

    wxService.ready(() => {
      if (success) {
        success();
      }
    });

    wxService.error((res) => {
      if (failure) {
        failure(res);
      }
    });
  },
  checkJsApi(jsApiList) {
    return new Promise(resolve => {
      wxService.checkJsApi({
        jsApiList,
        success: function () {
          resolve();
        },
      });
    });
  },
  closeWindow() {
    wxService.closeWindow();
  },
  getNetworkType() {
    // wx.getNetworkType({
    //   success: function (res) {
    //     // var networkType = res.networkType; // 返回网络类型2g，3g，4g，wifi
    //     console.log(res);
    //   },
    // });
  },
  scanQRCode() {
    return new Promise(resolve => {
      wxService.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: function (res) {
          const {
            resultStr,
          } = res;

          resolve(resultStr);
        },
      });
    });
  },
  test() {
    // wx.checkJsApi({
    //   jsApiList: ['chooseImage'],
    //   success: function(res) {
    //     console.log(res);
    //   },
    // })

    wxService.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
        console.log(localIds);

        wx.uploadImage({
          localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: function (res) {
            var serverId = res.serverId; // 返回图片的服务器端ID
            alert(serverId);

            wx.updateAppMessageShareData({
              title: '测试', // 分享标题
              desc: `测试${serverId}`, // 分享描述
              link: '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: '', // 分享图标
              success: function () {
                // 设置成功
              },
            })
          },
        });
      },
    });

    // wx.openLocation({
    //   latitude: 0, // 纬度，浮点数，范围为90 ~ -90
    //   longitude: 0, // 经度，浮点数，范围为180 ~ -180。
    //   name: '', // 位置名
    //   address: '', // 地址详情说明
    //   scale: 1, // 地图缩放级别,整形值,范围从1~28。默认为最大
    //   infoUrl: '', // 在查看位置界面底部显示的超链接,可点击跳转
    // });

    // wx.startRecord();

    // wx.previewImage({
    //   current: 'http://www.yuexunedu.com/fs/api/v1.0/viewPic.file?fileUuid=00a0h89aad483e7e2f1437b9cd76af176b1268b', // 当前显示图片的http链接
    //   urls: ["http://www.yuexunedu.com/fs/api/v1.0/viewPic.file?fileUuid=00a0h89aad483e7e2f1437b9cd76af176b1268b"], // 需要预览的图片http链接列表
    // });
  },
};

export default wxApi;
