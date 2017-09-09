import React from 'react';
import './Track.css';

class Track extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isRemoval:this.props.isRemoval
    }
    /*
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    */
    this.onChange = this.onChange.bind(this);
  }

/*  renderAction(isRemoval) {
      if(isRemoval) {
          return <a onClick={this.removeTrack}>-</a>
      } else {
          return <a onClick={this.addTrack}>+</a>
      }

  }
  */
  renderAction(isRemoval) {
      return <a className="Track-action" onClick={this.onChange}>{isRemoval ? '-': '+'}</a>
  }

  onChange(event) {
     this.toggleRemoval();
     this.props.onChange(this.props.track, this.state.isRemoval);
  }

  toggleRemoval() {
    this.setState({isRemoval:!this.state.isRemoval});
  }

/*
  addTrack(event) {
    this.toggleRemoval();
    this.props.onAdd(this.props.track);
  }

  removeTrack(event) {
    this.toggleRemoval();
    this.props.onRemove(this.props.track);
  }
*/

  render() {
    return (
              <div className="Track">
                <div className="Track-information">
                  <h3>{this.props.track.name}</h3>
                  <p>{this.props.track.artist} | {this.props.track.album}</p>
                </div>
                  {this.renderAction(this.state.isRemoval)}
              </div>
            );
          }

}

export default Track;
