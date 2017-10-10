import React from 'react';
import './TrackToast.css';

const buttonIcons = [
    {play:'./play-button.png'},
    {spotify:'./spotify.png'},
    {pause:'./pause.png'}
];

class PreviewPlayer extends React.Component {
      constructor(props) {
          super(props);
          this.state={
            isPlay:false
          };
          this.musicPlay = this.musicPlay.bind(this);
      }

      musicPlay(event) {
          console.log('play');
        let audio = this.refs.audio;
        if(this.state.isPlay) {
          audio.pause();
          this.setState({isPlay:false});
        } else {
          audio.play();
          this.setState({isPlay:true});
        }

      }

      render() {
        return (  <div className='TrackImg'>
                      <img onClick={this.musicPlay} src={this.props.img} alt={'trackImg'}/>
                      <a><span onClick={this.musicPlay}  className='playerIcon'></span>
                      <span className='timeLapse'></span></a>
                      <audio ref='audio' src={this.props.srcUrl} />
                  </div>
            );
    }

}


export default PreviewPlayer;
