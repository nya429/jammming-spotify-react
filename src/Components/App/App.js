import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';
import PlaylistList from '../PlaylistList/PlaylistList'

const emptyState = {
    searchResults:[],
    playlistName:"New PlayList",
    playlistId:null,
    playlistTracks:[]
    };

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchResults:[],
            playlistName:"New PlayList",
            playlistId:null,
            playlistTracks:[],
            playlistList:[] //Used to store an array of keys of palylist
        };
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.updatePlaylistName = this.updatePlaylistName.bind(this);
        this.savePlaylist = this.savePlaylist.bind(this);
        this.search = this.search.bind(this);
        this.getUserPlayLists = this.getUserPlayLists.bind(this);
        this.onEdit = this.onEdit.bind(this);
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
    onEdit(playlistItem) {
      this.updatePlaylistName(playlistItem.playlistName);
      this.updatePlaylistId(playlistItem.playlistId);
      Spotify.getPlaylistTracks(playlistItem.playlistId).then(tracks => this.setState({playlistTracks:tracks}));
    }

    getUserPlayLists() {
      console.log('getUserPlayLists')
      Spotify.getUserPlayLists().then(playlists => {this.setState({playlistList:playlists})});
    }

    search(searchTerm) {
        Spotify.search(searchTerm).then(searchResults => this.setState({searchResults:searchResults}));
    }

    savePlaylist(event) {
        const trackUris = this.state.playlistTracks.map(playlistTrack => playlistTrack.id);
        const playlistName = this.state.playlistName;
        const playlistId = this.state.playlistId;

        if(!(playlistName&&trackUris.length)) {
            return alert('Fail to createPlaylist');//Not sure is that right;
        }

        //The playlistId is in the playlistList,
        //1) update the playlistName
        //2) update the playlistTrack TODO: uncheck state of playlistTracks
        if(playlistId) {
          this.updateCurrentPlaylist(playlistId,playlistName,trackUris);
        }
        //The playlistId is not in the playlistList
        //create a playlist and then update the playlist.
        this.createPlaylist(playlistId,playlistName,trackUris);
    }

    createPlaylist(playlistId,playlistName,trackUris) {
      return Spotify.createPlaylist(playlistName).then(
        playlistId => Spotify.updatePlaylistTracks(trackUris,playlistId)
      ).then(status => {
                          if(status) {
                            alert('PlayList Created');
                            this.setState(emptyState);
                          }
                        }
             );
    }

    updateCurrentPlaylist(playlistId,playlistName,trackUris) {

      let savedplaylistName = this.state.playlistList.filter(playlist => playlist.playlistId === playlistId.toString())[0].playlistName;

      //The playlistName has not changed, only update the PlaylistTracks
      if (playlistName === savedplaylistName) {
        this.updatePlaylistTracks(trackUris,playlistId);
      } else {
      //The playlistName has changed,  update the both PlaylistTracks and playlistName
              return Spotify.updatePlaylistName(playlistId,playlistName).then(
                () => this.updatePlaylistTracks(trackUris,playlistId)
              );
            }
      }


    updatePlaylistTracks(trackUris,playlistId) {
      return Spotify.updatePlaylistTracks(trackUris,playlistId).then(status => {
        if(status) {
            alert('PlayList updated');
            this.setState(emptyState);
            }
          });
    }

    updatePlaylistName (playlistNaem) {
        this.setState({playlistName:playlistNaem});
    }

    updatePlaylistId (playlistId) {
        this.setState({playlistId:playlistId});
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
                        <PlaylistList
                             getUserPlayLists={this.getUserPlayLists} onEdit={this.onEdit} playlistList={this.state.playlistList} />
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
