import React from 'react';
import './Track.css';

class Track extends React.Component {
  constructor(props) {
    super(props);
    /*
    this.state = {
      isRemoval:this.props.isRemoval
    }
    */

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    /*
    this.onChange = this.onChange.bind(this);
    this.changeName = this.changeName.bind(this);
    */
  }

renderAction() {
      if(this.props.isRemoval) {
          return <a className="Track-action" onClick={this.removeTrack}>-</a>
      } else {
          return <a className="Track-action" onClick={this.addTrack}>+</a>
      }

  }
/*
  renderAction() {
      return <a className="Track-action" onClick={this.onChange}>{this.state.isRemoval ? '-': '+'}</a>
  }


  onChange(event) {
     //this.toggleRemoval();
     this.props.onChange(this.props.track, this.state.isRemoval);
  }

  toggleRemoval() {
    this.setState({isRemoval:!this.state.isRemoval});
  }
*/

  addTrack(event) {
    //this.toggleRemoval();
    this.props.onAdd(this.props.track);
  }

  removeTrack(event) {
    //this.toggleRemoval();
    this.props.onRemove(this.props.track);
  }


  render() {
    return (
              <div className="Track">
                <div className="Track-information">
                  <h3>{this.props.track.name}</h3>
                  <p>{this.props.track.artist} | {this.props.track.album}</p>
                </div>
                  {this.renderAction()}
              </div>
            );
          }

}

export default Track;
