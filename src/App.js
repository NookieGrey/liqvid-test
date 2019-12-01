import React from 'react';
import WebCamPicture from "./components/WebCamPicture";

export class App extends React.Component {
  saveToDB = (item) => {
    this.props.db.get('images')
      .push(item)
      .write();

    this.forceUpdate();
  };

  render() {
    const images = this.props.db.get('images').value();

    const $images = images.slice().reverse().map((item) => (
      <div className="item" key={item.uuid}>
        <img src={item.picture} alt=""/>
        <div className="item-box">
          <div>Age: {item.age}</div>
          <div>Gender: {item.gender ? "Male" : "Female"}</div>
        </div>
      </div>
    ));

    return (
      <div className="App">
        <h1>Liqvid Test App</h1>
        <WebCamPicture saveToDB={this.saveToDB}/>
        <div className="item-list">
          {$images}
        </div>
      </div>
    );
  }
}

export default App;
