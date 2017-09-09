import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar'
import SearchResults from '../SearchResults/SearchResults'
import Playlist from '../Playlist/Playlist'

class App extends Component {
  constructor(props) {
      super(props);
      this.state = {
        searchResults:[
          {name:'name1',artist:'artist',album:'album',id:'4'},
          {name:'name2',artist:'artist',album:'album',id:'5'},
          {name:'name3',artist:'artist',album:'album',id:'6'},
        ],
        playlistName:"PlayListName",
        playlistTracks:[]
      };
      this.addTrack = this.addTrack.bind(this);
      this.removeTrack = this.removeTrack.bind(this);
      this.changeTrack = this.changeTrack.bind(this);
  }

  changeTrack(track,isRemoval) {
    if(isRemoval) {
      this.removeTrack(track);
    } else {
      this.addTrack(track);
    }
  }

  removeTrack(track) {
      let playlistTracks = this.state.playlistTracks.filter(playListTrack => playListTrack.id !== track.id);
      this.setState({playlistTracks:playlistTracks});

  }

  addTrack(track) {
      let playlistTracks = this.state.playlistTracks;
      if(!playlistTracks.find(playlistTrack => playlistTrack.id === track.id)) {
        playlistTracks.push(track);
        this.setState({playlistTracks:playlistTracks});
      }
      return false;
  }

  render() {
    return (
      <div>
    <h1>Ja<span className="highlight">mmm</span>ing</h1>
    <div className="App">
      <SearchBar />
      <div className="App-playlist">
        <SearchResults
          onChange={this.changeTrack} searchResults={this.state.searchResults}/>
        <Playlist
          onChange={this.changeTrack} playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks}/>
      </div>
    </div>
  </div>
    );
  }
}

export default App;
