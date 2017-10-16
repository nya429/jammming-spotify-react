const clientId = '429c0efa1b924e15a334ed5a3c7b259c';
const redirectUri = 'http://localhost:3000/';
const scope = 'playlist-modify-public';
let accessToken;
let userId;

const Spotify = {
    getAccessToken() {
        if(accessToken) {
            return accessToken;
        }

        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1]; //Set the access token value
            let expiresIn = Number(expiresInMatch[1]); //Number Constructor ,   Set a variable for expiration time
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            const url = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&showscope=${scope}&redirect_uri=${redirectUri}`;
            window.location = url;
        }
    },

    handleSearch (url, limit = 20) {
      return fetch(url,{
          headers: {
              Authorization: `Bearer ${accessToken}`}
      }).then(
          response => response.json()
      ).then(jsonResponse => {
        console.log(jsonResponse)
          if(!jsonResponse.tracks) {
              return   {
                  tracks:[],
                  total:null,
                  next:null,
                  limit:null,
                  offset:null,
                  previous:null,
                  href:null
                };
          } else {
              let tracks = jsonResponse.tracks.items.map(item => ({
                      id:item.id,
                      name:item.name,
                      artist:item.album.artists[0].name,
                      image:item.album.images[2].url,
                      album:item.album.name,
                      uri:item.uri
                  }));
              let results = {
                tracks:tracks,
                total:jsonResponse.tracks.total,
                next:jsonResponse.tracks.next,
                limit:jsonResponse.tracks.limit,
                offset:jsonResponse.tracks.offset,
                previous:jsonResponse.tracks.previous,
                href:jsonResponse.tracks.href
              }
              return results;
              /*
              return( jsonResponse.tracks.items.map(item => ({
                      id:item.id,
                      name:item.name,
                      artist:item.album.artists[0].name,
                      album:item.album.name,
                      uri:item.uri
                  }))
              );
              */
            }
      });
    },

  search (term, limit = 20, offset = 0) {
        let url = `https://api.spotify.com/v1/search?type=track&q=${term}&limit=${limit}&offset=${offset}`;
        return this.handleSearch(url,limit);
  },

  updatePlaylistTracks(trackUris,playlistId) {
    const accessToken = Spotify.getAccessToken();
    return fetch(
          `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,{
              method:'PUT',
              headers:{
                  Authorization: `Bearer ${accessToken}`,
                  'Content-Type': 'application/json'
              },
              body:JSON.stringify({uris: trackUris.map(trakUri => 'spotify:track:' + trakUri)})
          }).then(response => response.status === 201);
  },

  savePlaylist(playlistName,trackUris) {
        if(!(playlistName&&trackUris.length)) {
            return Promise.resolve(false);
        }
        //if playlist.id in playlistList obj, then       upadte the palylist,
        //if playlist id isn't in the play listobj       create a playlist and then update the playlist.

        return Spotify.createPlaylist(playlistName).then(playlistId => Spotify.updatePlaylistTracks(trackUris,playlistId));


    },

    //Retrieve user's userId which should be stored in global variable UserId
    getCurrentUserId() {
      if(userId) {
        return Promise.resolve(userId);
      }

      const accessToken = Spotify.getAccessToken();
      const headers = {
          Authorization: `Bearer ${accessToken}`
      };

      return fetch('https://api.spotify.com/v1/me',{
          method:'GET',headers:headers
      }).then(
          response => response.json()
      ).then(jsonResponse =>  {
          userId = jsonResponse.id;
    });
  },

  //Retrieve user's playlists
  getUserPlayLists() {
    return  this.getCurrentUserId().then(() =>fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,{
        method:'GET',
        headers:{
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }).then(
        response => response.json()
      ).then(
          jsonResponse => {
            if(!jsonResponse.items) {
              console.log('getUserPlayLists null')
              return [];
            } else {
              console.log('getUserPlayLists success');
              return jsonResponse.items.map(item => (
                      {playlistId:item.id,
                       playlistName:item.name}
                    ));
            }
          }));
  },

  //used to retrieve a playlist tracks
  getPlaylistTracks(playlistId) {
    return this.getCurrentUserId().then(() => fetch(
        `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,{
            method:'GET',
            headers:{
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
      }).then(
        response => response.json()
      ).then(
        jsonResponse => {if(!jsonResponse.items) {
            console.log('getPlaylistTracks null')
            return [];
          } else {
            console.log('getPlaylistTracks success');
            return jsonResponse.items.map(item => (
        {
          id:item.track.id,
          name:item.track.name,
          artist:item.track.album.artists[0].name,
          image:item.track.album.images[2].url,
          album:item.track.album.name,
          uri:item.track.uri
        }
                  ));
          }}
        ));
  },

  createPlaylist(playlistName) {
    if(!playlistName) {
        return Promise.resolve(false);
    }

    return Spotify.getCurrentUserId().then(() => fetch(
            `https://api.spotify.com/v1/users/${userId}/playlists`,{
                method:'POST',
                headers:{
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({name: playlistName})
            })).then(
            response => response.json()
        ).then(
            jsonResponse => jsonResponse.id
          );
  },

  updatePlaylistName(playlistId,playlistName) {
    return Spotify.getCurrentUserId().then(()=> fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}`,{
        method:'PUT',
        headers:{
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({name:playlistName})
      })).then(response => {
          console.log('DEBUG ') //TODO check status code here
        return response.status === 200});
  },

  //used to get a Track
  getTrack(id) {
    if(!id) {
        return Promise.resolve(false);
    }
      let url = `https://api.spotify.com/v1/tracks/${id}`;

      const accessToken = Spotify.getAccessToken();
      const headers = {
          Authorization: `Bearer ${accessToken}`
      };

      return fetch(url,{
          method:'GET',headers:headers
      }).then(
        response => response.json()
      ).then(
        jsonResponse => {console.log(jsonResponse);return ({
            name:jsonResponse.name,
            image:jsonResponse.album.images[1].url,
            artist:jsonResponse.album.artists[0].name,
            album:jsonResponse.album.name,
            duration:jsonResponse.duration_ms,
            preview:jsonResponse.preview_url,
            externalUrl:jsonResponse.external_urls.spotify, //{'spotify':"https://..."}

          });}
      );
  },

}

export default Spotify;
