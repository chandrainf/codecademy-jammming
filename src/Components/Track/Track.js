/*import React from 'react';
import './Track.css';


function Track(props) {

  function addTrack() {
    props.onAdd(props.track);
  }

  function removeTrack() {
    props.onRemove(props.track);
  }

  function renderAction() {
    if (props.isRemoval) {
      return <button className="Track-action" onClick={removeTrack}> -
      </button>;
    } else {
      return <button className="Track-action" onClick={addTrack}> +
      </button>;
    }
  }

  function renderPreview() {
    if (props.track.previewUrl) {
      return <a href={props.track.previewUrl} target="_blank" rel="noopener noreferrer"> | Preview</a>;
    }
  }

  return (
    <div className="Track">
      <div className="Track-information">
        <h3>{props.track.name}</h3>
        <p>{props.track.artist + ' | ' + props.track.album} {renderPreview()}</p>
      </div>
      {props.track.preview && (
      <audio className="audio" controls>
           <source src={props.track.preview} type="video/mp4" />
     </audio>
      )}
      <div className="Album-image">
          {props.track.image && <img src={props.track.image}></img>}
        </div>
      {renderAction()}
    </div>
    
    
  );
}



export default Track;

*/

import React from "react";
import "./Track.css";

class Track extends React.Component {
  constructor(props) {
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }

  renderAction() {
    if (this.props.isRemoval) {
      return (
        <button className="Track-action" onClick={this.removeTrack}>
          -
        </button>
      );
    } else {
      return (
        <button className="Track-action" onClick={this.addTrack}>
          +
        </button>
      );
    }
  }

  addTrack() {
    this.props.onAdd(this.props.track);
  }

  removeTrack() {
    this.props.onRemove(this.props.track);
  }

  render() {
    return (
      <div className="Track">
        <div className="Track-information">
          <h3>{this.props.track.name}</h3>
          <p>
            {this.props.track.artist} | {this.props.track.album}
          </p>
        </div>
        {this.props.track.preview && (
          <audio className="audio" controls>
            <source src={this.props.track.preview} type="video/mp4" />
          </audio>
        )}
        <div className="Album-image">
          {this.props.track.image && <img src={this.props.track.image}></img>}
        </div>
        {this.renderAction()}
      </div>
    );
  }
}

export default Track;