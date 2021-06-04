import React from 'react';
import './PlaylistList.css';
import PlaylistItem from '../PlaylistItem/PlaylistItem.js';


function PlaylistList(props) {

  function playlistMode() {
    if (props.playlists.length) {
      return props.playlists.map(playlist => <PlaylistItem name={playlist.name} key={playlist.id} id={playlist.id} get={props.get} delete={props.delete} />);
    } else if (!props.playlists.length && !props.getButton && props.playlistsFetched) {
      return <p className="Message">There are no saved playlists to display.</p>;
    }
  }

  return (
    <div className="PlaylistList">
      {playlistMode()}
    </div>
  );
}


export default PlaylistList;
