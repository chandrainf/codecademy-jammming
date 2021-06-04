import React from 'react';
import './PlaylistItem.css';


function PlaylistItem(props) {

  function getPlaylist() {
    props.get(props.id);
  }

  function deletePlaylist() {
    props.delete(props.id);
  }

  return (
    <div className="PlaylistItem">
      <p className="Edit" onClick={getPlaylist}>{props.name}</p>
      <p className="Delete" onClick={deletePlaylist}>X</p>
    </div>
  );
}


export default PlaylistItem;
