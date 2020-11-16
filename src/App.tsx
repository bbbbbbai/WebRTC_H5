import React from 'react';
import { Route } from "react-router";
import { HashRouter, Switch } from "react-router-dom";
import "./styless/css/styless.scss"
import {Samples} from "./page/Samples";
import {Provider} from "react-redux";
import { createStore } from 'redux';
import todoReducer from "./redux/reducers";
import { applyMiddleware } from 'redux';
import reduxThunk from "redux-thunk";
import { Camera } from './page/Camera';
import { compose } from 'redux';
import { Microphone } from './page/Microphone';
import { Canvas } from './page/Canvas';
import {ScreenShare} from "./page/ScreenShare";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// const store = createStore(todoReducer, applyMiddleware(reduxThunk))
const store = createStore(
    todoReducer,composeEnhancers(applyMiddleware(reduxThunk))
);
function App() {
  return (
      <Provider store={store}>
      <HashRouter>
          <Switch>
              <Route path="/" exact component={Samples} />
              <Route path="/camera" exact component={Camera} />
              <Route path="/microphone" exact component={Microphone} />
              <Route path="/canvas" exact component={Canvas} />
              <Route path="/screenShare" exact component={ScreenShare} />
          </Switch>
      </HashRouter>
      </Provider>
  );
}

export default App;
