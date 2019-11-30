import React, { Component } from 'react';
import Webcam from 'react-webcam';

const videoConstraints = {
  width: 350,
  height: 350,
  facingMode: 'user',
};

export default class WebCamPicture extends Component {
  capture = () => {
    const imageSrc = this.props.refProp.current.getScreenshot();
    //console.log("Take Picture");
    this.props.landmarkPicture(imageSrc);
  };

  render() {
    return (
      <div>
        <Webcam
          audio={false}
          height={350}
          ref={this.props.refProp}
          screenshotFormat="image/jpeg"
          width={350}
          videoConstraints={videoConstraints}
        />
        <button onClick={this.capture} type="button">
          Take Picture
        </button>
      </div>
    );
  }
}