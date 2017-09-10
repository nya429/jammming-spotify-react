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
      <SearchBar />
      <div className="App-playlist">
        <SearchResults
          onAdd={this.addTrack} searchResults={this.state.searchResults}/>
        <Playlist
          onRemove={this.removeTrack} playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks}/>
      </div>
    </div>
  </div>
    );
  }
}

export default App;
