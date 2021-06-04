import React from 'react';
import './Playlist.css';
import TrackList from '../TrackList/TrackList.js';
import PlaylistList from '../PlaylistList/PlaylistList.js';


function Playlist(props) {

  function handleNameChange(e) {
    props.onNameChange(e.target.value);
  }

  function message() {
    setTimeout(() => document.getElementById("Message").style.color = props.msgColor);
    return <p id="Message">{props.msgText}</p>;
  }

  function displayMessage() {
    if (props.msgVisibility) {
      document.getElementById("Message").style.visibility = "visible";
    } else {
      document.getElementById("Message").style.visibility = "hidden";
    }
  }

  function toggleButton() {
    return (props.getButton) ? 'GET' : 'HIDE';
  }

  setTimeout(() => {displayMessage()});

  return (
    <div className="Playlist">
      <input value={props.playlistName} onChange={handleNameChange} />
      <TrackList tracks={props.playlistTracks} onRemove={props.onRemove} isRemoval={true} />
      <button className="Playlist-button" onClick={props.onSave}>SAVE TO SPOTIFY</button>
      {message()}
      <button className="Playlist-button" onClick={props.onGet}>{toggleButton()} PLAYLISTS</button>
      <PlaylistList playlists={props.playlists} playlistsFetched={props.playlistsFetched} getButton={props.getButton} get={props.get} delete={props.delete} />
    </div>
  );
}


export default Playlist;
