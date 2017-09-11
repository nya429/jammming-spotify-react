//Implement Spotify Search Request
//Get a Spotify user's access token
//Send a search request to the Spotify API
//Save a user's playlist to their Spotify account.
const clientId = '429c0efa1b924e15a334ed5a3c7b259c';
const clientSecret = '5db9e2e995314407a78aa0ff08df8fbe';
const redirectUri = 'https://localhost:3000/';
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

    if (accessTokenMatch && expiresInMatch) {
        accessToken = accessTokenMatch[1]; //Set the access token value
        let expiresIn = Number(expiresInMatch[1]); //Number Constructor ,   Set a variable for expiration time
        window.setTimeout(() => accessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
        return accessToken;
    } else {
          const url = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=${scope}&redirect_uri=${redirectUri}`;
          window.location.assign(redirectUri);
    }
  },
  search(term) {
    return Spotify.getAccessToken().then(()=>{
      let url = `https://api.spotify.com/v1/search?type=track&q=${term}`;
      return fetch(url,{
            method:'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`}
            });
          }).then(
      response => response.json()
    ).then(
      jsonResponse => {
        console.log(jsonResponse);
        return [];
      }
    );
  }
}

export default Spotify;
