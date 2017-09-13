//Implement Spotify Search Request
//Get a Spotify user's access token
//Send a search request to the Spotify API
//Save a user's playlist to their Spotify account.
const clientId = '429c0efa1b924e15a334ed5a3c7b259c';
//const clientSecret = '5db9e2e995314407a78aa0ff08df8fbe';
const redirectUri = 'http://localhost:3000/';
const scope = 'playlist-modify-public';
let accessToken;


const Spotify = {
  getAccessToken() {

    //condition 1 : if the user's access token is already set. If it is, return the value saved to access token.
    if(accessToken) {
      return accessToken;
    }

/*
  If the (access token , expiration time, token_type, code, redirect_uri)are in the URL, implement the following steps:


      Set the access token to expire at the value for expiration time
      Clear the parameters from the URL, so the app doesn't try grabbing the access token after it has expired

*/
    //str.match(regexp)
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
//  //http://localhost:3000/#access_token=BQAP-HzJlRSRJkcnGOxbg8boF5TMAwfRxdF_tjrPSnuFquvmCkbgsWeCbORYvHjYe6QWRJy5jlP1kgVL54LOTGoRGeLBhyrXRZQMbB9ojYbDU9VdN0kG48NIRjECYkCTVsjCGe8HhfRzvzrdUod0Xad3-CkKlgh8G0BA94Pgl7waxofSkA&token_type=Bearer&expires_in=3600
    if (accessTokenMatch && expiresInMatch) {
        accessToken = accessTokenMatch[1]; //Set the access token value
        let expiresIn = Number(expiresInMatch[1]); //Number Constructor ,   Set a variable for expiration time
        window.setTimeout(() => accessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
        return accessToken;
    } else {
          const url = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&showscope=${scope}&redirect_uri=${redirectUri}`;
          window.location.assign(url);
    }
  },
  search(term) {
    const accessToken = Spotify.getAccessToken();
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
/*
GET current user's ID
POST a new playlist with the input name to the current user's Spotify account. Receive the playlist ID back from the request.
POST the track URIs to the newly-created playlist, referencing the current user's account (ID) and the new playlist (ID)
  */
   savePlaylist(playlistName,trackUris) {
     if(!playlistName&&trackUris.length) {
       return;
     }
     const accessToken = Spotify.getAccessToken();
     const headers = {
       Authorization: `Bearer ${accessToken}`
     };
     let userId;

     return fetch('https://api.spotify.com/v1/me',{
       method:'GET',headers:headers
     }).then(
         response => response.json()
       ).then(jsonResponse =>  {
         userId = jsonResponse.id;
         return fetch(
          `https://api.spotify.com/v1/users/${userId}/playlists`,{
            method:'POST',
            headers:{
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            body:JSON.stringify({name: playlistName})
          }).then(
            response => response.json()
          ).then(
            jsonResponse => {
              let playlistId = jsonResponse.id;
              console.log(trackUris);
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
      });
   }
}

export default Spotify;
