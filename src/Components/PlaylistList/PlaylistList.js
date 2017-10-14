import React,{Component} from 'react';
import './PlaylistList.css';
import PlaylistListItem from '../PlaylistListItem/PlaylistListItem';

class PlaylistList extends Component {

  componentDidMount() {
    this.props.getUserPlayLists();
  }

  render() {
    return (
        <div className="PlaylistList">
          <h2>PlayLists</h2>
          {this.props.playlistList.map(playlistItem =>{
            return <PlaylistListItem
                playlistItem={playlistItem}
                key={playlistItem.playlistId}
                onEdit={this.props.onEdit}
                isSelected={playlistItem.playlistId === this.props.selectedPlayListId && true}
            />
          })}
        </div>
    );

  }
}

export default PlaylistList;
