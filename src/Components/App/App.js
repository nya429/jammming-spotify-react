import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends Component {
  constructor(props) {
      super(props);
      this.state = {
        searchResults:[],
        playlistName:"New PlayList",
        playlistTracks:[]
      };
      this.addTrack = this.addTrack.bind(this);
      this.removeTrack = this.removeTrack.bind(this);
      this.updatePlaylistName = this.updatePlaylistName.bind(this);
      this.savePlaylist = this.savePlaylist.bind(this);
      this.search = this.search.bind(this);
    /*  this.changeTrack = this.changeTrack.bind(this);*/
  }
/*
  changeTrack(track,isRemoval) {
    if(isRemoval) {
      this.removeTrack(track);
    } else {
      this.addTrack(track);
    }
  }
*/
search(searchTerm) {
  Spotify.search(searchTerm).then(searchResults => this.setState({searchResults:searchResults}));
}

savePlaylist(event) {
  const trackUris = this.state.playlistTracks.map(playlistTrack => playlistTrack.id);
  Spotify.savePlaylist(this.state.playlistName,trackUris).then(status => {
    if(status) {
      alert('PlayList Created');
      this.setState({
          searchResults:[],
          playlistName:"New PlayList",
          playlistTracks:[]
        });
    }
  }
  );
}

updatePlaylistName (name) {
  this.setState({playlistName:name});
}

removeTrack(track) {
  let tracks = this.state.playlistTracks;
  tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);
  this.setState({playlistTracks: tracks});
}

addTrack(track) {
    let tracks = this.state.playlistTracks;
    if (tracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    tracks.push(track);
    this.setState({playlistTracks: tracks});
  }

  render() {
    return (
      <div>
    <h1>Ja<span className="highlight">mmm</span>ing</h1>
    <div className="App">
      <SearchBar onSearch={this.search}/>
      <div className="App-playlist">
        <SearchResults
          onAdd={this.addTrack} searchResults={this.state.searchResults}/>
        <Playlist
          onSave={this.savePlaylist} onNameChange={this.updatePlaylistName} onRemove={this.removeTrack} playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks}/>
      </div>
    </div>
  </div>
    );
  }
}

export default App;
