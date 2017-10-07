import React from 'react';
import './TrackToast.css';

class TrackToast extends React.Component {
  constructor (props) {
  super(props);
  this.state = {
      trackInfo:null,
    };
  }

  //thanks to CSS Load
  renderBubbling (style) {
    return (<div style ={style} className='Toast'>
              <div className="bubblingG">
            	<span id="bubblingG_1">
            	</span>
            	<span id="bubblingG_2">
            	</span>
            	<span id="bubblingG_3">
            	</span>
            </div>
          </div>);
  }

  renderToast(style) {
    return (
      <div style ={style} className='ToastInfo'>
          <div  className='TrackImg'>
            <img />
          </div>
          <div>
            <h3 className='TrackName'>Shape of you</h3>
            <h3 className='AlbumName'>Divide</h3>
            <h3 className='TimePeriod'>4:30</h3>
            <h3 className='ArtistName'>Ed Sheeran</h3>
          </div>
      </div>
    );
  }

 componentDidMount() {
   setTimeout(() => {
     this.setState({trackInfo:this.props.trackInfo})
   },500);
 }

  render() {
    let style = {
      left:this.props.pos.x + 'px',
      top:this.props.pos.y + 'px',
    }
    return this.state.trackInfo ? this.renderToast(style) : this.renderBubbling(style);

  }
}

export default TrackToast;
