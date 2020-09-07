import React from 'react';
import { Icon, NavBar, Card, Button, Toast, Modal } from 'antd-mobile';
import {connect} from 'dva';
import router from 'umi/router';
import { stringify } from 'qs';
import { getUrlParamReg } from '../../../utils/utils';
import { downloadPath, imgs } from '../../../utils/constants';
import VoiceAudio from '../../../components/VoiceAudio';
import IconFont from '../../../components/IconFont';
import Ellipsis from '../../../components/Ellipsis';
import fsUtils from '../../../utils/fsUtils';
import nativeApi from '../../../utils/nativeApi';
import wxApi from '../../../utils/wxApi';
import networkUtils from '../../../utils/networkUtils';


@connect(({notice}) => ({...notice}))
class Detail extends React.PureComponent{
  state = {
    readFlag: 0,
    navHeight: 0,
    alertShow: true,
    noticeDetail: {},

    outlink: false,
    outlinkSrc:null,
  };

  componentDidMount() {
    nativeApi.onBackPressed(() => {
      const {outlink} = this.state;
      if(outlink){
        this.setState({outlink: !outlink, outlinkSrc: null});
        return;
      }

      const {alertShow} = this.state;
      if(alertShow){
        this.setState({alertShow: !alertShow});
        this.noticeDetailBack();
      }
    });
    const navHeight = document.getElementById('navContianer').offsetHeight;
    this.setState({navHeight});
    let noticeParentId = getUrlParamReg('noticeParentId');
    const wlh = window.location.href;
    const usp = new URLSearchParams(wlh.substring(wlh.lastIndexOf("?")+1, wlh.length));
    const msg = usp.get("message");
    if(msg){
      noticeParentId = usp.get("noticeParentId");
    }
    const readFlag = getUrlParamReg('readFlag') ? parseInt(getUrlParamReg('readFlag'), 10) : getUrlParamReg('readFlag');
    this.setState({readFlag});
    // const {dispatch} = this.props;
    // dispatch({
    //   type:'notice/inquireCnNoticePublished',
    //   payload: {noticeId},
    // }).then(() => {
    //   const {noticeDetail} = this.props;
    //   if(readFlag !== noticeDetail.readFlag){
    //     this.setState({readFlag: noticeDetail.readFlag});
    //     // router.push(`/plugin/parent/classnotice/detail?noticeId=${noticeId}&readFlag=${noticeDetail.readFlag}`);
    //   }
    // });

    const sessionUuid = networkUtils.getSessionUuid();
    fetch(`${nativeApi.getApiPath()}/store/api/v2.0/inquireCnNoticePublishedByParentAccount.json`,{
      method: 'POST',
      headers:{ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
      body: stringify({sessionUuid, noticeParentId}),
    }).then(res => res.json())
      .then(resp => {
        const noticeDetail = resp.datas[0] || {};
        this.setState({noticeDetail});
        if(readFlag !== noticeDetail.readFlag){
          this.setState({readFlag: noticeDetail.readFlag});
        }
      });

  }

  // componentWillUnmount() {
  //   nativeApi.onBackPressed(null)
  // }

  filePreview = (file) => {
    fsUtils.gotoFilePreview(file.fileUuid, file.fileName);
  };

  knowClick = () => {
    this.readNotice();

    Toast.success('已读');
    const noticeParentId = getUrlParamReg('noticeParentId');
    router.push(`/plugin/parent/classnotice/detail?noticeParentId=${noticeParentId}&readFlag=1`);
  };

  readNotice = (action) => {
    const { dispatch } = this.props;
    const noticeParentId = getUrlParamReg('noticeParentId');
    dispatch({
      type: 'notice/updateCnNoticeReadByParentList',
      payload: {noticeParentId},
    }).then(() => {
      const {readSuccess} = this.props;
      if(readSuccess){
        this.setState({readFlag: 1}, () => {
          this.forceUpdate();
        });
        if(action)
          action();
      }
    });
  };

  getFileIcon = (fileName) => {
    const type = fileName.substring(fileName.lastIndexOf('.')+1).toLowerCase();
    return imgs[type] || imgs.unknow;
  };

  shareOnClick = () => {
    nativeApi.shareScreenShot();
  };

  noticeDetailBack = () => {
    const {outlink} = this.state;
    if(outlink){
      this.setState({outlink: !outlink, outlinkSrc: null});
      return;
    }
    // const { noticeDetail } = this.props;
    const { noticeDetail } = this.state;
    const readFlag = getUrlParamReg('readFlag');
    if(readFlag === '1' || noticeDetail.readFlag === 1){
      // router.push('/plugin/parent/classnotice');
      const msg = getUrlParamReg('message');
      if(msg){
        nativeApi.close();
      }
      if(noticeDetail.readFlag === 0){
        router.go(-2);
        return;
      }
      router.go(-1);
      return;
    }
    this.setState({alertShow: false});
    Modal.alert('', '是否已知晓通知内容？', [
      { text: '再看下', onPress: () => {
          this.setState({alertShow: true});
        }
      },
      { text: '我已知晓', onPress: () => {
          Toast.success('正在返回...');
          this.readNotice(() => {
          Toast.success('已读');
          if(!nativeApi.native()){
            router.goBack();
            return;
          }
          nativeApi.onBackPressed(null);
          // router.goBack();
          nativeApi.back()
        });
        }
      },
    ])

  };

  outLinkOnClick = (src) => {
    // this.setState({
    //   outlink: true,
    //   outlinkSrc:src,
    // })
    nativeApi.openLink(src);
  };

  render() {
    // const { noticeDetail } = this.props;
    const { readFlag, navHeight, outlink, outlinkSrc, noticeDetail } = this.state;
    noticeDetail.urlList = noticeDetail.urlList || [];
    noticeDetail.voiceList = noticeDetail.voiceList || [];
    noticeDetail.fileList = noticeDetail.fileList || [];
    noticeDetail.pictureList = noticeDetail.pictureList || [];
    const renderTitle = (
      <div>
        <h3 className='breakWord'>{noticeDetail.title}</h3>
        <div>
          {noticeDetail.accountPhoto ?
            <img width="20" style={{borderRadius: '10px'}} src={downloadPath + noticeDetail.accountPhoto} alt="" />
            : <Icon type="user" />
            }
          <span style={{padding:'10px', verticalAlign: 'middle', color: '#999999', fontSize: '14px'}}>
            {noticeDetail.accountName}&nbsp;{noticeDetail.date}&nbsp;{noticeDetail.updateFlag ? '修改' : '发布' }
          </span>

        </div>
      </div>
    );

    const renderFooter = (
      <React.Fragment>
        {noticeDetail.urlList.map((url,idx) => {
          const key= url+idx;
          return (
            <div key={key} style={{color: '#0C9',marginBottom: '5px', paddingLeft: '5px'}}>
              <IconFont type='iconLink' style={{fontSize: '14px', color: '#0C9', verticalAlign: 'middle'}} />
              &nbsp;&nbsp;
              <span onClick={()=> this.outLinkOnClick(url)} target='_blank' rel="noopener noreferrer" style={{color: '#00CC99', display: 'inline-block', verticalAlign: 'middle'}}>
                <Ellipsis lines={1}>
                  {url}
                </Ellipsis>
              </span>
            </div>
          )
        })}

        {noticeDetail.voiceList.length>0?(
          <div style={{marginBottom: '5px'}}>
            <VoiceAudio
              voiceList={noticeDetail.voiceList}
              icon='iconshengyin_o'
            />
          </div>
          ):null
        }
        {noticeDetail.fileList.map((file) => {
          return (
            <div key={file.fileUuid} style={{color: '#00CC99', marginBottom: '5px', paddingLeft: '3px'}}>
              <img src={this.getFileIcon(file.fileName)} alt='' />
              &nbsp;&nbsp;
              <span onClick={this.filePreview.bind(this, file)}>
                {file.fileName}
              </span>
            </div>
          )
        })}
      </React.Fragment>
    );
    const imgList = (
      <React.Fragment>
        {noticeDetail.pictureList.map((pic) => {
          return (
            <div style={{padding: '10px'}} key={pic.fileUuid}>
              <img src={downloadPath+pic.fileUuid} width='100%' alt="" />
            </div>
          );
        })}
      </React.Fragment>
    );

    return (
      <React.Fragment>
        <div style={{display:  outlink ? 'none' : 'block'}}>
          <div id='navContianer'>
            <NavBar
              mode="dark"
              icon={<Icon type='left' />}
              onLeftClick={this.noticeDetailBack}
              style={{backgroundColor: '#1bc376'}}
              rightContent={wxApi.isWeixinBrowser() ? null : [<span key='1' onClick={this.shareOnClick}><img src={imgs.share} alt="" /></span>]}
            >
              通知详情
            </NavBar>
          </div>
          <div style={{marginTop: `${navHeight}px`}}>
            <Card full>
              <Card.Header
                title={renderTitle}
              />
              <Card.Body>
                <div className='breakWord' style={{textIndent: '1em'}}>
                  {noticeDetail.content}
                </div>
              </Card.Body>
              <Card.Footer content={renderFooter} />
            </Card>
          </div>

          <div style={{marginBottom: '50px'}}>
            {imgList}
          </div>
          {readFlag === 0 ?(
            <div style={{position: 'fixed', bottom: '0px', width:'100%'}}>
              <Button
                style={{backgroundColor: '#00CC99', color: '#FFFFFF'}}
                activeStyle={{ backgroundColor: '#05A57C' }}
                onClick={this.knowClick}
              >
                我已知晓
              </Button>
            </div>
          ) : null}
        </div>
        {outlink ? (
          <div>
            <NavBar
              mode="dark"
              icon={<Icon type='left' />}
              onLeftClick={() => {
                this.setState({outlink: false, outlinkSrc: null});
              }}
              style={{backgroundColor: '#1bc376', position: 'fixed', width: '100%', zIndex:'1000'}}
            >
              {null}
            </NavBar>
            <iframe
              style={{marginTop: '45px'}}
              title={outlinkSrc}
              id="mainContent"
              src={outlinkSrc}
              width="100%"
              height={document.documentElement.clientHeight}
            />
          </div>
        ) : null}
      </React.Fragment>
    );
  }
}

export default Detail;
