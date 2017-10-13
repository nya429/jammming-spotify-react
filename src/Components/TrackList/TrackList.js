import React from 'react';
import './TrackList.css';
import Track from '../Track/Track';

class TrackList extends React.Component {
  render() {
    return (
              <div className="TrackList">
                {this.props.tracks.map(track => {
                  return <Track
                    onRemove={this.props.onRemove}
                    onAdd={this.props.onAdd}
                    onMouseOver={this.props.onMouseOver}
                    key={track.id}
                    track={track}
                    isRemoval={this.props.isRemoval}
                    mousePos={this.props.mousePos}
                    onPut={this.props.onPut}
                  />
                })}
              </div>

            );
          }

}

export default TrackList;
