import React from 'react';
import './Track.css';

class Track extends React.Component {

  constructor(props) {
    super(props);
    this.delay = false;
    this.addTrack = this.addTrack.bind(this);
    this.clearToast = this.clearToast.bind(this);
    this.delayToast = this.delayToast.bind(this);
  }

renderAction() {
      if(this.props.isRemoval) {
          return <a className="Track-action" onClick={this.removeTrack}>-</a>
      } else {
          return <a className="Track-action" onClick={this.addTrack}>+</a>
      }

  }


  addTrack(event) {
    this.props.onAdd(this.props.track);
  }

  removeTrack(event) {
    this.props.onRemove(this.props.track);
  }

  delayToast(event) {
        this.delay = setTimeout(() => {this.props.onMouseOver(this.props.track.id)},500);
  }

  clearToast(event) {
      clearTimeout(this.delay);
  }

  render() {
    return (
              <div className="Track">
                <div className="Track-image">
                  <img src={this.props.track.image} alt={this.props.track.name} />
                </div>
                <div className="Track-information">
                  <h3>{this.props.track.name}</h3>
                  {!this.props.isRemoval && <p id={'ss'} onMouseOver={this.delayToast} onMouseOut={this.clearToast}  >{this.props.track.artist}  |  {this.props.track.album}</p>}
                  {this.props.isRemoval && <p>{this.props.track.artist}  |  {this.props.track.album}</p>}
                </div>
                  {this.renderAction()}
              </div>
            );
          }

}

export default Track;
