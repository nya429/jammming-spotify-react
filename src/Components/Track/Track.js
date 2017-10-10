import React from 'react';
import './Track.css';
import TrackToast from '../TrackToast/TrackToast';

class Track extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      hover:false,
      pos:null,
      trackToast:null
    }
    this.delay = false;
    this.removeTrack = this.removeTrack.bind(this);
    this.addTrack = this.addTrack.bind(this);
    this.clearToast = this.clearToast.bind(this);
    this.delayToast = this.delayToast.bind(this);
    this.toast = this.toast.bind(this);
  }

renderAction() {
      if(this.props.isRemoval) {
          return <a className="Track-action" onClick={this.removeTrack}>-</a>
      } else {
          return <a className="Track-action" onClick={this.addTrack}>+</a>
      }

  }
//return (<p onMouseClick={this.clearToast} onMouseUp={this.toast} onMouseEnter={this.delayToast} onMouseOut={this.clearToast}>{this.props.track.artist}  |  {this.props.track.album}</p>);
  renderTrack() {
        if(this.props.isRemoval) {
            return (<p>{this.props.track.artist}  |  {this.props.track.album}</p>);
        } else {
            return (<p  onMouseUp={this.toast}>{this.props.track.artist}  |  {this.props.track.album}</p>);
        }

    }


  addTrack(event) {
    this.props.onAdd(this.props.track);
  }

  removeTrack(event) {
    this.props.onRemove(this.props.track);
  }

  toast(event) {
    //event.nativeEvent.stopImmediatePropagation();
    //this.clearToast(event);
    this.setState({
          hover:true,
          pos:this.props.mousePos,
        });
        this.props.onMouseOver(this.props.track.id).then(jsonResponse => {this.setState({
          trackToast:jsonResponse
        });
        console.log('toast' + jsonResponse);
        }
      );
  }

  delayToast(event) {
        //TODO: get pageX pgetY after 500x
        //event.persist()
          this.delay = setTimeout(() => {
            this.toast();
        },800);
  }

  clearToast(event) {
      clearTimeout(this.delay);
      this.setState({
        hover:false,
        pos:null,
        trackToast:null
      });
  }
/*
  getMousePos(event) {
              let pos =  {'x':event.pageX,'y':event.pageY};
              console.log(pos);
              this.setState({
                    hover:true,
                    pos:pos
                  });
    }
*/
  render() {
    return (
              <div className="Track" ref="bodyBox">
                <div className="Track-image">
                  <img src={this.props.track.image} alt={this.props.track.name} />
                </div>
                {this.state.hover && <TrackToast outClickHandler={this.clearToast} pos={this.state.pos} trackInfo={this.state.trackToast}/>}
                <div className="Track-information">
                  <h3>{this.props.track.name}</h3>
                  {this.renderTrack()}
                </div>
                   {this.renderAction()}
              </div>
            );
          }

}

export default Track;
