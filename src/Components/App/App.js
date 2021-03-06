import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';
import PlaylistList from '../PlaylistList/PlaylistList';
import Header from '../Header/Header';
import ToastInformation from '../ToastInformation/ToastInformation';

const emptyState = {
    searchResults:{
      tracks:[],
      total:0,
      next:null,
      page:null,
      previous:null
    },
    playlistName:"",
    playlistId:null,
    playlistTracks:[],
    savedTracks:[],
    };

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isToast:null,  //identify toast status
            isFetch:false, // identify loading status
            isUpload:false, //used to 1) identify the time for re-fetch PlaylistList 2) block multiple opting
            toastInformation:'',
              searchResults:{
              tracks:[],
              total:0,
              next:null,
              limit:null,
              offset:null,
              previous:null,
              href:null
            },
            playlistName:"",
            playlistId:null,
            playlistTracks:[],
            playlistList:[], //Used to store an array of keys of palylist
            savedTracks:[], //used to store an array of currentTracks of selected playlist
        };

        this.searchTerm = '';
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.updatePlaylistName = this.updatePlaylistName.bind(this);
        this.savePlaylist = this.savePlaylist.bind(this);
        this.search = this.search.bind(this);
        this.getUserPlayLists = this.getUserPlayLists.bind(this);
        this.switchPlaylist = this.switchPlaylist.bind(this);
        this.switchResultPage = this.switchResultPage.bind(this);
        this.getTrackInfo = this.getTrackInfo.bind(this);
        this.getSearchTerm = this.getSearchTerm.bind(this);
        this.delayToast = this.delayToast.bind(this);
        this.delayHeaderLoad = this.delayHeaderLoad.bind(this);
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

    switchResultPage(url) {
      Spotify.handleSearch(url).then(searchResults => this.setState({searchResults:searchResults}));
    }

    switchPlaylist(playlistItem) {
      if(this.state.playlistId === playlistItem.playlistId) {
        return this.setState({
            playlistName:"",
            playlistId:null,
            playlistTracks:[]
          });
      }
      this.updatePlaylistId(playlistItem.playlistId);
      this.updatePlaylistName(playlistItem.playlistName);
      Spotify.getPlaylistTracks(playlistItem.playlistId).then(tracks => {
        this.setState({playlistTracks:tracks,savedTracks:tracks.slice(0)})  //temp solution for deep copy
      });
    }

    getUserPlayLists() {
      Spotify.getUserPlayLists().then(playlists => {this.setState({playlistList:playlists})});
    }

    search(searchTerm) {
        Spotify.search(searchTerm).then(searchResults => this.setState({searchResults:searchResults,isFetch:false}));
        this.setState({isFetch:true});
    }

    savePlaylist(event) {
        if(this.state.isUpload)
          return;

        const trackUris = this.state.playlistTracks.map(playlistTrack => playlistTrack.id);
        const playlistName = this.state.playlistName;
        const playlistId = this.state.playlistId;

        if(!playlistName) {
            return this.renderToast('Enter a name');//Not sure is that right;
        }

        if(!trackUris.length) {
            return this.renderToast('Pick a track');//Not sure is that right;
        }

        this.setState({isUpload:true});
        //The playlistId is in the playlistList,
        //1) update the playlistName
        //2) update the playlistTrack
        //TODO: solve unnecessary request : uncheck state of playlistTracks

        if(playlistId) {
          return this.updateCurrentPlaylist(playlistId,playlistName,trackUris);
        }
        //The playlistId is not in the playlistList
        //create a playlist and then update the playlist.
        return this.createPlaylist(playlistId,playlistName,trackUris);
    }

    createPlaylist(playlistId,playlistName,trackUris) {
      return Spotify.createPlaylist(playlistName).then(
        playlistId => Spotify.updatePlaylistTracks(trackUris,playlistId)
      ).then(status =>  this.updatefinished(status,'create'));
    }

    updateCurrentPlaylist(playlistId,playlistName,trackUris) {

      let savedplaylistName = this.state.playlistList.filter(playlist => playlist.playlistId === playlistId.toString())[0].playlistName;

      if(playlistName === savedplaylistName && this.state.savedTracks.toString() === this.state.playlistTracks.toString() ) { //Temp solution for array compare
        this.renderHeader();
        console.log('renderHeader');
        return this.renderToast('Nothing has changed');
      }

      if (playlistName === savedplaylistName) {   //The playlistName has not changed, only update the PlaylistTracks
        return this.updatePlaylistTracks(trackUris,playlistId);
      } else if (this.state.savedTracks === this.state.playlistTracks) {
         return this.updatePlaylistName(playlistId,playlistName);//The PlaylistTracks  has not changed, only update the playlistName
      } else {
      //The playlistName and Tracks both have changed,  update both
      //TODO: check status in Nameupload
              return Spotify.updatePlaylistName(playlistId,playlistName).then(
                () => this.updatePlaylistTracks(trackUris,playlistId)
              );
            }
      }

    updatePlaylistName(playlistId,playlistName) {
      return Spotify.updatePlaylistName(playlistId,playlistName).then(status => this.updatefinished(status,'upload'));
    }

    updatePlaylistTracks(trackUris,playlistId) {
      return Spotify.updatePlaylistTracks(trackUris,playlistId).then(status => this.updatefinished(status,'upload'));
    }

    //handle render result of different status code
    updatefinished (status,method) {
      this.renderHeader();
      if(status) {
          this.getUserPlayLists();
          this.renderToast(method === 'create' ? 'Playlist Created' : 'Playlist Uploaded');
          this.setState(emptyState);
        } else {
          this.renderToast(method === 'create' ? 'Fail Created' : 'Fail Updated');
        }
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

    //used to handle Track MouseOver Event
    getTrackInfo(id) {
      return Spotify.getTrack(id);
    }

    getSearchTerm(term) {
      this.search(term);
      this.searchTerm = term;
    }

    componentDidUpdate(prevProps, prevState) {
      this.searchTerm = '';

    }

    renderToast (toastInformation) {
      this.setState({isToast:true,toastInformation:toastInformation});
      setTimeout(this.delayToast,800);
    }

    delayToast () {
      this.setState({isToast:false});
    }

    renderHeader() {
      setTimeout(this.delayHeaderLoad,300);
    }

    delayHeaderLoad () {
      this.setState({isUpload:false});
    }

    render() {
        return (
            <div>
              <Header load={this.state.isUpload || this.state.isFetch }/>
                <div className="App">
                    <SearchBar  term={this.searchTerm} onSearch={this.search}/>
                    <div className="App-playlist">
                        <PlaylistList
                             selectedPlayListId={this.state.playlistId} getUserPlayLists={this.getUserPlayLists} onEdit={this.switchPlaylist} playlistList={this.state.playlistList} />
                        <SearchResults
                            onPut={this.getSearchTerm} onMouseOver={this.getTrackInfo} onPage={this.switchResultPage} onAdd={this.addTrack} searchResults={this.state.searchResults}/>
                        <Playlist
                            onSave={this.savePlaylist} onNameChange={this.updatePlaylistName} onRemove={this.removeTrack} playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks}/>
                        <ToastInformation isToast={this.state.isToast} toastInformation={this.state.toastInformation}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
