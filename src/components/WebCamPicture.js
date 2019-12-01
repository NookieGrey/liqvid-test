import React, { Component } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from "face-api.js";
import uuid from "uuid";

const videoConstraints = {
  width: 350,
  height: 350,
  facingMode: 'user',
};

export default class WebCamPicture extends Component {
  constructor(props) {
    super(props);
    this.resultRef = React.createRef();
    this.sourceRef = React.createRef();

    this.state = {
      operating: false
    }
  }
  capture = () => {
    this.setState({
      operating: true
    });

    const picture = this.sourceRef.current.getScreenshot();

    const ctx = this.resultRef.current.getContext("2d");
    const image = new Image();
    image.onload = async () => {
      ctx.drawImage(image, 0, 0);
      const detection = await faceapi.detectSingleFace(this.sourceRef.current.canvas).withFaceLandmarks().withAgeAndGender();

      if (detection) {
        this.props.saveToDB({
          picture,
          age: Math.round(detection.age),
          gender: detection.gender === "male" ? 1 : 0,
          uuid: uuid()
        });
      } else {
        alert("Face not found");
      }

      this.setState({
        operating: false
      })
    };

    image.src = picture;
  };

  render() {
    return (
      <div className="action-panel">
        <Webcam
          audio={false}
          height={350}
          ref={this.sourceRef}
          screenshotFormat="image/jpeg"
          width={350}
          videoConstraints={videoConstraints}
        />
        <button onClick={this.capture} type="button" disabled={this.state.operating}>
          Take Picture ->
        </button>
        <canvas ref={this.resultRef} width={350} height={350} />
      </div>
    );
  }
}