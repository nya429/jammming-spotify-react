import React from 'react';
import './TrackToast.css';

//TODO: clearify the DATAurl when using Inline style e.g. backg-img in Child Component
const buttonIcons = {
    play:'./play-button.png',
    spotify:'./spotify.png',
    pause:'./pause.png'
};

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
            bmp:90
          };
          this.audio ='';
          this.musicPlay = this.musicPlay.bind(this);
          this.lapse = this.lapse.bind(this);
          this.handleEnded = this.handleEnded.bind(this);
          this.handleReady = this.handleReady.bind(this);
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

      lapse(event) {
        console.log('lapse');
        if(!isNaN(this.audio.duration)) {
        let remain= this.audio.duration - this.audio.currentTime;
        let remainMin = Math.floor(remain/60);
        let remainSecond = Math.floor(remain%60);
        let surplusTime = remainMin + ':' + remainSecond < 10 ?  '0' + remainSecond : remainSecond;
        this.setState({lapse:surplusTime});
        }
      }

      render() {
        let playerIcons = '';
        if(this.state.isReady) {
          playerIcons = this.state.isPlay ? 'playIcon pause' : 'playIcon play';
        } else {
          playerIcons = 'playIcon';
        }

        let TrackImg = this.state.isPlay ? 'TrackImg pause' : 'TrackImg play';

        //TODO: multiple class selector question .playIcon .play {。。。} in CSS not working  &&
        return (  <div className='playerContainer' >

                      <img className={TrackImg} onClick={this.musicPlay} src={this.props.img} alt={'trackImg'}/>
                      <div className="playerIcons">
                        <span className={playerIcons}  onClick={this.musicPlay} ></span>
                      </div>
                      <span className='timeLapse'></span>
                      <audio ref={(ref)=>this.audio = ref}  src={this.props.srcUrl} />
                      <Music time={this.state.lapse}/>
                  </div>
            );
    }

}


export default PreviewPlayer;
