import React from 'react';
import './TrackToast.css';

//TODO: clearify the DATAurl when using Inline style e.g. backg-img in Child Component

let fade = '';
class Music extends  React.Component {

  render() {
    return (<div>
              <a>{this.props.time}</a>
              <p>-Powered by Spotify</p>
            </div>);
  }
}


class PreviewPlayer extends React.Component {
      constructor(props) {
          super(props);
          this.state={
            isReady:false,
            isPlay:false,
            lapse: null,
            mute:false,
            vol:1,
            bmp:90
          };
          this.fade='',
          this.audio ='';
          this.musicPlay = this.musicPlay.bind(this);
          this.lapse = this.lapse.bind(this);
          this.handleEnded = this.handleEnded.bind(this);
          this.handleReady = this.handleReady.bind(this);
          this.toggleMute = this.toggleMute.bind(this);
      }

      musicPlay(event) {
        if(!this.state.isReady)
          return;
        if(this.state.isPlay) {
          this.audio.pause();
          this.setState({isPlay:false});
        } else {
          this.audio.play();
          this.setState({isPlay:true});
        }
      }

      componentDidMount() {
            this.audio.addEventListener('canplay',this.handleReady,false);
            this.audio.addEventListener('timeupdate',this.lapse,false);
            this.audio.addEventListener('ended',this.handleEnded,false);
      }

      componentWillUnmount() {
        clearInterval(this.fade);
        this.audio.removeEventListener('canplay',this.handleReady);
        this.audio.removeEventListener('timeupdate',this.lapse);
        this.audio.removeEventListener('ended',this.handleEnded);
      }

      handleReady(event) {
        this.setState({isReady:true});
      }

      handleEnded(event) {
          this.setState({isPlay:false});
      }


      toggleMute(event) {
          let audio = this.audio;
          let volUnit = 5;
          //this.audio.volume = this.state.mute ? this.state.vol : 0;
          this.state.mute ? this.unmuteMusic(audio,volUnit, this.state.vol) : this.muteMusic(audio,volUnit);
          this.setState({mute:(!this.state.mute)});
      }

      muteMusic(audio,volUnit) {
        clearInterval(fade);
        //this.audio.volume = this.state.mute ? this.state.vol : 0;
        console.log('DEBUG muteMusic start');
        console.log(audio.volume);
         fade = setInterval(function() {
            if(audio.volume <= 0.05) {
              audio.volume = 0;
              clearInterval(fade);
              console.log('DEBUG muteMusic ended');
              console.log(audio.volume);
            } else {
            audio.volume = (Math.floor(audio.volume * 100) - volUnit) / 100;
          }
        },10);
      }

      unmuteMusic(audio,volUnit,vol) {
        console.log('DEBUG unmuteMusic start');
        console.log(audio.volume);
        clearInterval(fade);
          fade = setInterval(function() {
            if(audio.volume >= vol || audio.volume >= 0.95) {
              audio.volume = vol;
              clearInterval(fade);
              console.log('DEBUG unmuteMusic ended');
              console.log(audio.volume);
            } else {
            audio.volume = (Math.floor(audio.volume * 100) + volUnit) / 100;
          }
        },10);
      }

      lapse(event) {
        if(!isNaN(this.audio.duration)) {
        let remain= this.audio.duration - this.audio.currentTime;
        let remainMin = Math.floor(remain/60);
        let remainSecond = Math.floor(remain%60);
        let surplusTime = remainMin + ':' + remainSecond < 10 ?  '0' + remainSecond : remainSecond;
        this.setState({lapse:surplusTime});
        }
      }

      classSet(classNames) {
         let className = '';
         for (let key in classNames) {
           if(classNames[key]) {
             className += (key + ' ');
           }
         }
         return className.replace(/(\s*$)/g, "");
      }

      render() {
        let playIconClassSet = {
          'playIcon':true,
          'pause':this.state.isReady && this.state.isPlay,
          'play':this.state.isReady && !this.state.isPlay,
          'isPlay':this.state.isReady && this.state.isPlay,
          'mute':this.state.isReady && this.state.mute,
        }


        let TrackImgClassSet = {
          'TrackImg':true,
          'Imgpause':this.state.isReady && this.state.isPlay,
          'Imgmute':this.state.isReady && this.state.mute,
        }

        let volumeIconsClassSet = {
          'volumeIcon':true,
          'muted':this.state.isReady && this.state.mute,
          'unMuted':this.state.isReady && !this.state.mute,
          'volplay':this.state.isReady && this.state.isPlay,
        }

        //TODO: multiple class selector question .playIcon .play {。。。} in CSS not working  &&
        return (  <div className='playerContainer' >

                      <img className={this.classSet(TrackImgClassSet)} src={this.props.img} alt={'trackImg'}/>
                      <div className="playerIcons">
                        <span className={this.classSet(playIconClassSet)}  onClick={this.musicPlay} ></span>
                      </div>
                      <div className={this.classSet(volumeIconsClassSet)} onClick={this.toggleMute} style={{curosr:'pointer'}}></div>
                      <span className='timeLapse'></span>
                      <audio ref={(ref)=>this.audio = ref}  src={this.props.srcUrl} />
                  </div>
            );
    }

}


export default PreviewPlayer;
