import React from 'react';
import { Icon as Micon } from 'antd-mobile';
import { downloadPath, imgs } from '../../utils/constants';
import IconFont from '../IconFont';

import style from './style.less';

class VoiceAudioH5 extends React.PureComponent{
  state = {
    duration: {},
    fixDuratioin: {},
    descTimer: null,
    playState: false,

    currentUuid: null,

    audioObj: {},
  };

  componentDidMount() {
    const {voiceList} = this.props;
    const audioObj = {};
    voiceList.forEach((voice) => {
      const audio = new Audio();
      audio.src = downloadPath+voice.fileUuid;
      audioObj[voice.fileUuid] = audio;

      audio.addEventListener('canplay', () => {
        const initDuration = {};
        initDuration[voice.fileUuid] = Math.round(audio.duration);
        const {duration} = this.state;

        this.setState({
          duration: {...duration, ...initDuration},
          fixDuratioin: {...duration, ...initDuration}},
          () => {
          this.forceUpdate();
        })
      });
    });
    this.setState({audioObj});
  }

  componentWillReceiveProps(nextProps) {
    const {voiceList} = nextProps;
    const {fixDuratioin, audioObj} = this.state;
    let changeFlag = false;
    if(voiceList.length !== Object.keys(fixDuratioin).length){
      changeFlag = true;
    }
    if(!changeFlag){
      voiceList.forEach(voice => {
        changeFlag = Object.keys(fixDuratioin).indexOf(voice.fileUuid) < 0;
      })
    }
    if(!changeFlag){
      return;
    }

    voiceList.forEach(voice => {
      if(Object.keys(fixDuratioin).indexOf(voice.fileUuid) < 0){
        const audio = new Audio();
        audio.src = downloadPath+voice.fileUuid;
        audioObj[voice.fileUuid] = audio;

        audio.addEventListener('canplay', () => {
          const initDuration = {};
          initDuration[voice.fileUuid] = Math.round(audio.duration);
          const {duration} = this.state;

          this.setState({
              duration: {...duration, ...initDuration},
              fixDuratioin: {...duration, ...initDuration}},
            () => {
              this.forceUpdate();
            })
        });
      }
    });

    this.setState({audioObj});
  }

  componentWillUnmount() {
    this.audioStop();
    this.state = () => {}
  }

  audioStop = (timer, audio) => {
    if(timer && audio){
      clearInterval(timer);
      audio.pause();
      audio.currentTime = 0;
    }else{
      const {descTimer, currentUuid, audioObj} = this.state;
      if(descTimer){
        clearInterval(descTimer)
      }
      if(currentUuid){
        audioObj[currentUuid].pause();
        audioObj[currentUuid].currentTime = 0;
      }
    }

  };

  audioPlay = (audio, fileUuid, fixDuratioin) => {
    const {duration} = this.state;
    this.setState({currentUuid: fileUuid, playState: true, duration: {...fixDuratioin}}, () => {
      this.forceUpdate();
      audio.play();
      // let currDuration = duration[fileUuid];
      const descTimer = setInterval(() => {
        const currentDuration = duration[fileUuid]-1;
        duration[fileUuid] = currentDuration;
        this.setState({duration: {...duration}}, () => {
          if(currentDuration < 0){
            clearInterval(descTimer);
            this.setState({duration:{...fixDuratioin}, playState: false, currentUuid: null}, () => {
              this.forceUpdate();
            })
          }
          this.forceUpdate();
        });

      }, 1000);
      this.setState({descTimer});
    });

  };

  audioPlayOrPause = (fileUuid) => {
    const {audioObj, playState, currentUuid, fixDuratioin} = this.state;
    if(!playState){
      this.audioPlay(audioObj[fileUuid], fileUuid, fixDuratioin);
    }else{
      const { descTimer } = this.state;
      this.audioStop(descTimer, audioObj[currentUuid]);
      this.setState({ playState: false, descTimer: null, duration: {...fixDuratioin}}, () => {
        this.forceUpdate();
        if(fileUuid === currentUuid){
          this.setState({duration:{...fixDuratioin}, currentUuid: null});
          return;
        }
        this.audioPlay(audioObj[fileUuid], fileUuid, {...fixDuratioin});

      })

    }
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
            onClick={this.audioPlayOrPause.bind(this, voice.fileUuid)}
            className={style.audioSpan}
            style={{...audioStyle}}
          >
            {playState && voice.fileUuid === currentUuid ? '播放中' : null}
            {duration[voice.fileUuid]}"
          </span>
        </div>
      )
    });
    return (
      <React.Fragment>
        {list}
      </React.Fragment>
    );
  }
}

export default VoiceAudioH5;
