
const clientId = 'Insert your clienID here';
const redirectURI = 'http://jammming-chandrainf.surge.sh';
let accessToken;
//const redirectURI = window.location.href;
//const redirectURI = 'http://localhost:3000';


const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      window.location = accessURL;
    }
  },

  search(term) {
    accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      method: 'GET',
      headers: {Authorization: `Bearer ${accessToken}`}
    })
    .then(response => response.json())
    .then(jsonResponse => {
      if (!jsonResponse.tracks) {
        return [];
      } else {
        return jsonResponse.tracks.items.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
          preview: track.preview_url,
          image: track.album.images[2].url,
        })
      )};
    });
  },

  savePlaylist(name, trackURIs) {
    const accessToken = Spotify.getAccessToken();
    const headers = {Authorization: `Bearer ${accessToken}`};
    let userId;
    return fetch('https://api.spotify.com/v1/me', {headers: headers})
    .then(response => response.json())
    .then(jsonResponse => {
      userId = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({name: name})
      })
    })
    .then(response => response.json())
    .then(jsonResponse => {
      const playlistId = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({uris: trackURIs})
      })
    })
  },

  getPlaylists() {
    const accessToken = Spotify.getAccessToken();
    const headers = {Authorization: `Bearer ${accessToken}`};
    let userId;
    return fetch('https://api.spotify.com/v1/me', {headers: headers})
    .then(response => response.json())
    .then(jsonResponse => {
      userId = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {headers: headers})
    })
    .then(response => response.json())
    .then(jsonResponse => {
      return jsonResponse.items.map(playlists => ({
        name: playlists.name,
        id: playlists.id
      }));
    })
  },

  getPlaylistName(playlistId) {
    const accessToken = Spotify.getAccessToken();
    const headers = {Authorization: `Bearer ${accessToken}`};
    return fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      method: 'GET',
      headers: headers
    })
    .then(response => response.json())
    .then(jsonResponse => {
      return jsonResponse.name;
    })
  },

  getPlaylistTracks(playlistId) {
    const accessToken = Spotify.getAccessToken();
    const headers = {Authorization: `Bearer ${accessToken}`};
    return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: 'GET',
      headers: headers
    })
    .then(response => response.json())
    .then(jsonResponse => {
      return jsonResponse.items.map(song => ({
        id: song.track.id,
        name: song.track.name,
        artist: song.track.artists[0].name,
        album: song.track.album.name,
        uri: song.track.uri,
        previewUrl: song.track.preview_url
      }))
    })
  },

  renamePlaylist(playlistName, playlistId) {
    const accessToken = Spotify.getAccessToken();
    const headers = {Authorization: `Bearer ${accessToken}`};
    return fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify({name: playlistName})
    })
  },

  addTracks(trackURIs, playlistId) {
    const accessToken = Spotify.getAccessToken();
    const headers = {Authorization: `Bearer ${accessToken}`};
    return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({uris: trackURIs})
    })
  },

  deleteTracks(trackURIs, playlistId) {
    const accessToken = Spotify.getAccessToken();
    const headers = {Authorization: `Bearer ${accessToken}`};
    const formattedTrackURIs = [];
    for (let i=0; i<trackURIs.length; i++) {
      formattedTrackURIs.push({uri: trackURIs[i]});
    }
    return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: 'DELETE',
      headers: headers,
      body: JSON.stringify({tracks: formattedTrackURIs})
    })
  },

  deletePlaylist(playlistId) {
    const accessToken = Spotify.getAccessToken();
    const headers = {Authorization: `Bearer ${accessToken}`};
    fetch(`https://api.spotify.com/v1/playlists/${playlistId}/followers`, {
      method: 'DELETE',
      headers: headers
    });
  }
}


export default Spotify;
