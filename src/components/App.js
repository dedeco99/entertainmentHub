import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import '../css/App.css';
import Header from './Header';
import Reddit from './Reddit';
import Youtube from './Youtube';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Header/>
          <Route path="/reddit" component={ Reddit } />
          <Route path="/youtube" component={ Youtube } />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
