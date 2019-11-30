import React from 'react';
import WebCamPicture from "./components/WebCamPicture";
import * as faceapi from 'face-api.js';
import uuid from 'uuid';


export class App extends React.Component {
  constructor(props){
    super(props);
    this.resultRef = React.createRef();
    this.sourceRef = React.createRef();
  }

  landmarkWebCamPicture = (picture) => {
    const ctx = this.resultRef.current.getContext("2d");
    const image = new Image();
    image.onload = async () => {
      ctx.drawImage(image,0,0);
      const detection = await faceapi.detectSingleFace(this.sourceRef.current.canvas).withFaceLandmarks().withAgeAndGender();

      this.saveToDB({
        picture,
        age: Math.round(detection.age),
        gender: detection.gender === "male" ? 1 : 0,
        uuid: uuid()
      })
    };
    image.src = picture;
  };

  saveToDB = (item) => {
    this.props.db.get('images')
      .push(item)
      .write();

    this.forceUpdate();
  };

  render() {
    const images = this.props.db.get('images').value();

    const $images = images.map((item) => (
      <div className="item" key={item.uuid}>
        <img src={item.picture} alt=""/>
        <div>Age: {item.age}</div>
        <div>Gender: {item.gender ? "Male" : "Female"}</div>
      </div>
    ));

    return (
      <div className="App">
        <WebCamPicture refProp={this.sourceRef} landmarkPicture={this.landmarkWebCamPicture} />
        <canvas ref={this.resultRef} width={350} height={350} />
        <div className="item-list">
          {$images}
        </div>
      </div>
    );
  }
}

export default App;
