import React from 'react';
import './TrackList.css';
import Track from '../Track/Track';

class TrackList extends React.Component {
  render() {
    return (
              <div className="TrackList">
                {this.props.tracks.map(track => {
                  return <Track
                    toggleRemoval={this.toggleRemoval}
                    onChange={this.props.onChange}
                    key={track.id}
                    track={track}
                    isRemoval={this.props.isRemoval}
                  />
                })}
              </div>

            );
          }

}

export default TrackList;
