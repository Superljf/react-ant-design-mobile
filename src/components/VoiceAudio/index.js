import React from 'react';
import { Button } from 'antd-mobile';
import { imgs,downloadPath } from '../../utils/constants';
import IconFont from '../IconFont';

import style from './style.less';
import nativeApi from '../../utils/nativeApi';
import wxApi from '../../utils/wxApi';
import VoiceAudioH5 from '../VoiceAudioH5';


class VoiceAudio extends React.PureComponent{
  state = {
    duration: {},
    fixDuratioin: {},
    descTimer: null,
    playState: false,

    currentUuid: null,
  };

  componentDidMount() {
    const {voiceList} = this.props;
    const duration = {};
    const fixDuratioin = {};
    voiceList.forEach(voice => {
      duration[voice.fileUuid] = Math.round(voice.fileLength/1000);
      fixDuratioin[voice.fileUuid] = Math.round(voice.fileLength/1000);
      if(! Math.round(voice.fileLength/1000)){
        const a = new Audio();
        a.src=downloadPath+voice.fileUuid;
        a.addEventListener('canplay', () => {
          duration[voice.fileUuid] = Math.round(a.duration);
          a.removeEventListener('canplay', () => {});
          this.setState({duration, fixDuratioin}, () => {
            this.forceUpdate();
          });
        })
      }
    });
    this.setState({duration, fixDuratioin}, () => {
      this.forceUpdate();
    });
  }

  componentWillUnmount() {
    nativeApi.stopAudio();
    this.state = () => {}
  }

  // audioPlayOrPause = (fileUuid, fileLength) => {
  //   const { playState, duration, currentUuid, fixDuratioin } = this.state;
  //   if(!playState){
  //     nativeApi.playAudio(downloadPath+fileUuid);
  //     this.setState({playState: true, currentUuid: fileUuid});
  //     const descTimer = setInterval(() => {
  //       const currentDuration = duration[fileUuid]-1;
  //       duration[fileUuid] = currentDuration;
  //       this.setState({duration}, () => {
  //         this.forceUpdate();
  //       });
  //       if(currentDuration <= 0){
  //         clearTimeout(descTimer);
  //         duration[fileUuid] = fileLength;
  //         this.setState({
  //           duration,
  //           playState: false,
  //         },() =>{
  //           this.forceUpdate();
  //         });
  //       }
  //     }, 1000);
  //     this.setState({descTimer});
  //   }else{
  //     const { descTimer } = this.state;
  //     clearTimeout(descTimer);
  //     if(currentUuid !== fileUuid){
  //       this.setState({duration: fixDuratioin,currentUuid: fileUuid, descTimer: null}, () => {
  //         this.forceUpdate();
  //         nativeApi.playAudio(downloadPath+fileUuid);
  //         const newduration = this.state.duration;
  //         const descTimer2 = setInterval(() => {
  //           const currentDuration = newduration[fileUuid]-1;
  //           newduration[fileUuid] = currentDuration;
  //           this.setState({duration: newduration}, () => {
  //             this.forceUpdate();
  //           });
  //           if(currentDuration <= 0){
  //             clearTimeout(descTimer2);
  //             newduration[fileUuid] = fileLength;
  //             this.setState({
  //               duration: {...fixDuratioin},
  //               playState: false,
  //               currentUuid: null,
  //             },() =>{
  //               this.forceUpdate();
  //             });
  //           }
  //         }, 1000);
  //         this.setState({descTimer: descTimer2});
  //       });
  //
  //       // alert('重置时间当前，开始播放下一个')
  //       return;
  //     }
  //
  //
  //
  //     duration[fileUuid] = fileLength;
  //     this.setState({
  //       duration,
  //       playState: false,
  //       descTimer: null,
  //     }, () => {
  //       this.forceUpdate();
  //     });
  //     nativeApi.stopAudio();
  //   }
  // };

  audioPlayOrPause = (fileUuid, fileLength) => {
    const { playState, duration, currentUuid, fixDuratioin } = this.state;
    this.setState({duration: {...fixDuratioin}}, () => {
      if(!playState){
        nativeApi.playAudio(downloadPath+fileUuid);
        this.setState({playState: true, currentUuid: fileUuid});
        const descTimer = setInterval(() => {
          const currentDuration = duration[fileUuid]-1;
          duration[fileUuid] = currentDuration;
          this.setState({duration}, () => {
            this.forceUpdate();
          });
          if(currentDuration <= 0){
            clearTimeout(descTimer);
            duration[fileUuid] = fileLength;
            this.setState({
              duration,
              playState: false,
            },() =>{
              this.forceUpdate();
            });
          }
        }, 1000);
        this.setState({descTimer});
      }else{
        const { descTimer } = this.state;
        clearTimeout(descTimer);
        if(currentUuid !== fileUuid){
          this.setState({duration: {...fixDuratioin},currentUuid: fileUuid, descTimer: null}, () => {
            this.forceUpdate();
            nativeApi.playAudio(downloadPath+fileUuid);
            const newduration = this.state.duration;
            const descTimer2 = setInterval(() => {
              const currentDuration = newduration[fileUuid]-1;
              newduration[fileUuid] = currentDuration;
              this.setState({duration: newduration}, () => {
                this.forceUpdate();
              });
              if(currentDuration < 0){
                clearTimeout(descTimer2);
                newduration[fileUuid] = fileLength;
                this.setState({
                  duration: {...fixDuratioin},
                  playState: false,
                  currentUuid: null,
                },() =>{
                  this.forceUpdate();
                });
              }
            }, 1000);
            this.setState({descTimer: descTimer2});
          });

          return;
        }

        duration[fileUuid] = fileLength;
        this.setState({
          duration,
          playState: false,
          descTimer: null,
        }, () => {
          this.forceUpdate();
        });
        nativeApi.stopAudio();
      }
    });

  };


  render() {
    const { duration, playState, currentUuid } = this.state;
    const { icon, audioStyle, voiceList } = this.props;
    const list = voiceList.map(voice => {
      return (
        <div className={style.audio} key={voice.fileUuid}>
          { icon ? <IconFont type={icon} style={{fontSize: '20px', color: '#0C9'}} /> : <img src={imgs.yuyin} alt="" />}
          &nbsp;&nbsp;
          <span
            onClick={this.audioPlayOrPause.bind(this, voice.fileUuid, Math.round(voice.fileLength/1000))}
            className={style.audioSpan}
            style={{...audioStyle}}
          >
            {playState && voice.fileUuid === currentUuid ? '播放中' : null}
            {duration[voice.fileUuid] || Math.round(voice.fileLength/1000)}"
          </span>
        </div>
      )
    });
    return (
      <React.Fragment>
        {wxApi.isWeixinBrowser() ? <VoiceAudioH5 {...this.props} /> : list}
      </React.Fragment>
    );
  }
}

export default VoiceAudio;
