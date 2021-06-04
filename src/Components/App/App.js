import React, { useState } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar.js';
import SearchResults from '../SearchResults/SearchResults.js';
import Playlist from '../Playlist/Playlist.js';
import Spotify from '../../util/Spotify.js';


function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState('New Playlist');
  const [playlistId, setPlaylistId] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [msgVisibility, setMsgVisibility] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messageColor, setMessageColor] = useState('');
  // Track whether button is HIDE or GET PLAYLISTS.
  const [getButton, setGetButton] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [playlistsFetched, setPlaylistsFetched] = useState(false);

  function search(term) {
    Spotify.search(term).then(searchResults => {
      setSearchResults([...searchResults]);
    });
  }

  function addTrack(track) {
    // If the track is already on the playlist, do not save.
    if (playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    } else {
      playlistTracks.push(track);
      setPlaylistTracks([...playlistTracks]);
      // Remove track from searchResults after adding it to playlistTracks.
      const index = searchResults.indexOf(track);
      searchResults.splice(index, 1);
      setSearchResults([...searchResults]);
    }
  }

  function removeTrack(track) {
    const index = playlistTracks.indexOf(track);
    playlistTracks.splice(index, 1);
    setPlaylistTracks([...playlistTracks]);
    // Add track back to searchResults if removing from playlistTracks.
    searchResults.unshift(track);
    setSearchResults([...searchResults]);
  }

  async function savePlaylist() {
    const currentTrackURIs = playlistTracks.map(track => track.uri);
    if (!currentTrackURIs.length) {
      return activateMsg('Tracks required.', '#FF0000');
    }
    if (!playlistName) {
      return activateMsg('Playlist name required.', '#FF0000');
    }
    if (!editMode) {
      Spotify.savePlaylist(playlistName, currentTrackURIs).then(() => {
        activateMsg('Playlist saved!', '#228B22');
        setPlaylistName('New Playlist');
        setPlaylistTracks([]);
        setPlaylistsFetched(false);
      });
    }
    if (editMode) {
      const previousTracks = await Spotify.getPlaylistTracks(playlistId);
      const previousTrackURIs = previousTracks.map(track => track.uri);
      // When saving an existing playlist, remove all previously saved tracks and then save all current playlist tracks to Spotify.
      Spotify.renamePlaylist(playlistName, playlistId)
      .then(Spotify.deleteTracks(previousTrackURIs, playlistId))
      .then(Spotify.addTracks(currentTrackURIs, playlistId))
      .then(() => {
        activateMsg('Playlist updated!', '#228B22');
        setPlaylistName('New Playlist');
        setPlaylistTracks([]);
      });
      setEditMode(false);
    }
    // Update list of playlists if already open after saving.
    if (!getButton) {
      setTimeout(() => getPlaylists(), 1500);
    }
  }

  async function getPlaylist(playlistId) {
    const name = await Spotify.getPlaylistName(playlistId);
    const tracks = await Spotify.getPlaylistTracks(playlistId);
    setPlaylistName(name);
    setPlaylistId(playlistId);
    setPlaylistTracks(tracks);
    setEditMode(true);
  }

  async function getPlaylists() {
    activateMsg('Retrieving playlists...', '#FF8C00');
    const allPlaylists = await Spotify.getPlaylists();
    setPlaylists(allPlaylists);
    setPlaylistsFetched(true);
    setTimeout(() => activateMsg('Playlists retrieved.', '#228B22'), 400);
  }

  function deletePlaylist(playlistId) {
    Spotify.deletePlaylist(playlistId);
    activateMsg('Playlist deleted.', '#FF0000');
    setTimeout(() => getPlaylists(), 800);
  }

  function activateMsg(text, color) {
    setMessageText(text);
    setMessageColor(color);
    // Activates the msgVisibility prop for 3 seconds.
    setMsgVisibility(true);
    setTimeout(() => {setMsgVisibility(false)}, 3000);
  }

  function toggleButton() {
    setGetButton(!getButton);
    if (getButton) {
      getPlaylists();
    } else {
      setPlaylists([]);
      setPlaylistsFetched(false);
    }
  }

  function getToken() {
    // Generate access token before running search to prevent page reset on initial search.
    Spotify.getAccessToken();
  }

  return (
    <div>
      <h1>Ja<span className="highlight">mmm</span>ing</h1>
      <div className="App">
        <SearchBar onSearch={search} token={getToken} />
        <a href="#Temp-user" className="Temp-access-button"><button>GET TEMPORARY ACCESS DETAILS</button></a>
        <div className="App-playlist">
          <SearchResults searchResults={searchResults} onAdd={addTrack} />
          <Playlist playlistTracks={playlistTracks} playlistName={playlistName} playlistsFetched={playlistsFetched} onRemove={removeTrack} onNameChange={setPlaylistName} onSave={savePlaylist} onGet={toggleButton} playlists={playlists} msgVisibility={msgVisibility} msgText={messageText} msgColor={messageColor} getButton={getButton} get={getPlaylist} delete={deletePlaylist} />
        </div>
        <div id="Temp-user">
          <h3>Temporary user details:</h3>
          <p className="Description">Don't have a Spotify account and not bothered creating one? Not a problem - use the login credentials below and you can still test out the app.</p>
          <p className="Login">Username:<span> 313tgjrwnueaobmyzepfgtcucj6y</span></p>
          <p className="Login">Password:<span> testuser</span></p>
        </div>
      </div>
    </div>
  );
}


export default App;
