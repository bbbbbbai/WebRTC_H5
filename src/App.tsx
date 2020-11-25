import React from 'react';
import {Route} from "react-router";
import {HashRouter, Switch} from "react-router-dom";
import "./styless/css/styless.scss"
import {Samples} from "./page/Samples";
import {Provider} from "react-redux";
import {createStore} from 'redux';
import todoReducer from "./redux/reducers";
import {applyMiddleware} from 'redux';
import reduxThunk from "redux-thunk";
import {Camera} from './page/Camera';
import {compose} from 'redux';
import {Microphone} from './page/Microphone';
import {Canvas} from './page/Canvas';
import {ScreenShare} from "./page/ScreenShare";
import {VideoFilter} from "./page/VideoFilter";
import {Resolution} from "./page/Resolution";
import {AudioVolume} from "./page/volume/AudioVolume";
import {DeviceSelect} from "./page/DeviceSelect";
import {MediaSettings} from "./page/media-settings/MediaSettings";
import {MediaStreamAPI} from "./page/MediaStreamAPI";
import {CaptureVideo} from "./page/CaptureVideo";
import {CaptureCanvas} from "./page/CaptureCanvas";
import {RecordAudio} from "./page/RecordAudio";
import {RecordVideo} from "./page/RecordVideo";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// const store = createStore(todoReducer, applyMiddleware(reduxThunk))
const store = createStore(
    todoReducer, composeEnhancers(applyMiddleware(reduxThunk))
);

function App() {
    return (
        <Provider store={store}>
            <HashRouter>
                <Switch>
                    <Route path="/" exact component={Samples}/>
                    <Route path="/camera" exact component={Camera}/>
                    <Route path="/microphone" exact component={Microphone}/>
                    <Route path="/canvas" exact component={Canvas}/>
                    <Route path="/screenShare" exact component={ScreenShare}/>
                    <Route path="/videoFilter" exact component={VideoFilter}/>
                    <Route path="/resolution" exact component={Resolution}/>
                    <Route path="/audioVolume" exact component={AudioVolume}/>
                    <Route path="/deviceSelect" exact component={DeviceSelect}/>
                    <Route path="/mediaSettings" exact component={MediaSettings}/>
                    <Route path="/mediaStreamAPI" exact component={MediaStreamAPI}/>
                    <Route path="/captureVideo" exact component={CaptureVideo}/>
                    <Route path="/captureCanvas" exact component={CaptureCanvas}/>
                    <Route path="/recordAudio" exact component={RecordAudio}/>
                    <Route path="/recordVideo" exact component={RecordVideo}/>
                </Switch>
            </HashRouter>
        </Provider>
    );
}

export default App;
