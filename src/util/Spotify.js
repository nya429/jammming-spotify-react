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

    search(term) {
        const accessToken = Spotify.getAccessToken();
        /*
        let limit = 20;
        let page = 1;
        let offset = (page-1)*limit;*/
        let url = `https://api.spotify.com/v1/search?type=track&q=${term}`;
        return fetch(url,{
            headers: {
                Authorization: `Bearer ${accessToken}`}
        }).then(
            response => response.json()
        ).then(jsonResponse => {
            if(!jsonResponse.tracks) {
                return [];
            } else {
                return( jsonResponse.tracks.items.map(item => ({
                        id:item.id,
                        name:item.name,
                        artist:item.album.artists[0].name,
                        album:item.album.name,
                        uri:item.uri
                    }))
                );}
        });
    },

  savePlaylist(playlistName,trackUris) {
        if(!(playlistName&&trackUris.length)) {
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
                jsonResponse => {
                  console.log(jsonResponse);
                    let playlistId = jsonResponse.id;
                    return fetch(
                        `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,{
                            method:'POST',
                            headers:{
                                Authorization: `Bearer ${accessToken}`,
                                'Content-Type': 'application/json'
                            },
                            body:JSON.stringify({uris: trackUris.map(trakUri => 'spotify:track:' + trakUri)})
                        }).then(response => response.status === 201);

                });

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
    if(!userId) {
      return Promise.resolve(false);
    }
    return  fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,{
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
          });
  },
}

export default Spotify;
