import React from 'react';
import './TrackList.css';
import Track from '../Track/Track.js';


function TrackList(props) {
  return (
    <div className="TrackList">
      {props.tracks.map(track => <Track track={track} key={track.id} onAdd={props.onAdd} onRemove={props.onRemove} isRemoval={props.isRemoval} />)}
    </div>
  );
}


export default TrackList;
