import React,{Component} from 'react';
import './PlaylistList.css';
import PlaylistListItem from '../PlaylistListItem/PlaylistListItem';

class PlaylistList extends Component {

  componentWillMount() {
    this.props.getUserPlayLists();
  }

  render() {
    return (
        <div className="PlaylistList">
          <h2>PlayList</h2>
          {this.props.playlistList.map(playlistItem =>{
            return <PlaylistListItem
                playlistItem={playlistItem}
                key={playlistItem.playlistId}
                onEdit={this.props.onEdit}
            />
          })}
        </div>
    );

  }
}

export default PlaylistList;
