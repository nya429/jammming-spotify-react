import React, { Component } from 'react';
import './PlaylistListItem.css';

class PlaylistListItem extends Component {
  constructor(props) {
    super(props);
    this.editPlaylist = this.editPlaylist.bind(this);
  }

  editPlaylist(event) {
    this.props.onEdit(this.props.playlistItem);
  }

  render() {
    return (
      <div className='PlaylistItem'>
        <div className='PlaylistItem-information'>
          <h3>{this.props.playlistItem.playlistName}</h3>
        </div>
          <a className="PlaylistItem-action" onClick={this.editPlaylist}>...</a>
      </div>
    );
  }
}

export default PlaylistListItem;
