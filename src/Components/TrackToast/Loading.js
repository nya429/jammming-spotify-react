import React from 'react';
import './TrackToast.css';

class Loading extends React.Component {
  //thanks to CSS Load
  render() {
    return (<div  style ={this.props.style} className='Toast'>
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
}




export default Loading;
