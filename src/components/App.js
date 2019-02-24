import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import '../css/App.css';
import Header from './Header';
import Reddit from './reddit/Reddit';
import Youtube from './youtube/Youtube';

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Header/>
        <Switch>
          <Route path="/reddit/:sub?/:category?" component={ Reddit } />
          <Route path="/youtube" component={ Youtube } />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
