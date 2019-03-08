import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import PrivateRoute from './auth/PrivateRoute';

import Header from './header/Header';
import Index from './Index';
import Login from './auth/Login';
import Reddit from './reddit/Reddit';
import Youtube from './youtube/Youtube';
import TVSeries from './tvseries/TVSeries';
import Seasons from './tvseries/Seasons';
import Settings from './settings/Settings';

import '../css/App.css';

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Header/>
        <Switch>
          <Route exact path="/" component={ Index } />
          <Route exact path="/login" component={ Login } />
          <Route exact path="/reddit/:sub?/:category?" component={ Reddit } />
          <Route exact path="/youtube" component={ Youtube } />
          <Route exact path="/twitch" component={ Youtube } />
          <Route exact path="/tvseries" component={ TVSeries } />
          <Route exact path='/tvseries/:id' component={ Seasons } />
          <Route exact path="/settings" component={ Settings } />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
