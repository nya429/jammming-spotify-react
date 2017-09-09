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
          {name:'name',artist:'artist',album:'album',id:'4'},
          {name:'name',artist:'artist',album:'album',id:'5'},
          {name:'name',artist:'artist',album:'album',id:'6'},
        ],
        playlistName:"PlayListName",
        playlistTracks:[
          {name:'name',artist:'artist',album:'album',id:'1'},
          {name:'name',artist:'artist',album:'album',id:'2'},
          {name:'name',artist:'artist',album:'album',id:'3'},
        ]
      };

  }

  render() {
    return (
      <div>
    <h1>Ja<span className="highlight">mmm</span>ing</h1>
    <div className="App">
      <SearchBar />
      <div className="App-playlist">
        <SearchResults searchResults={this.state.searchResults}/>
        <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks}/>
      </div>
    </div>
  </div>
    );
  }
}

export default App;
