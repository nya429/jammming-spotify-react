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
  renderBubbling () {
    let style = {
      left:this.props.pos.y,
      top:this.props.pos.y
    }
    return (<div style={style} className="bubblingG">
            	<span id="bubblingG_1">
            	</span>
            	<span id="bubblingG_2">
            	</span>
            	<span id="bubblingG_3">
            	</span>
            </div>);
  }

  renderToast() {
    return (
      <div className='Toast'>
          <div  className='TrackName'>
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
  render() {
    return (<div className='Toast'>
              {this.renderBubbling (this.props.pos)}
            </div>);
  }
}

export default TrackToast;
