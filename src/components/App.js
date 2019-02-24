import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import '../css/App.css';
import Header from './Header';
import Reddit from './Reddit';
import Youtube from './Youtube';

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Header/>
        <Route path="/reddit/:sub?/:category?" component={ Reddit } />
        <Route path="/youtube" component={ Youtube } />
      </div>
    </BrowserRouter>
  );
}

export default App;
