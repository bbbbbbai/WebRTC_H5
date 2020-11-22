import React, {useRef} from "react";

 // const oceans = require("../static/mp4/oceans.mp4")

//捕获Video作为媒体流示例
export const CaptureVideo = () => {

    const sourceVideo = useRef<any>(null);
    const playerVideo = useRef<any>(null);

    const canPlay = () => {

        console.log(121)
        //源视频对象
        const _sourceVideo = sourceVideo.current;
        //播放视频对象
        const _playerVideo = playerVideo.current;

        let stream = null;

        //捕获帧率
        const fps = 0;
        if(_sourceVideo.captureStream){
            stream = _sourceVideo.captureStream(fps);
        }else if (_sourceVideo.mozCaptureStream) {
            stream = _sourceVideo.mozCaptureStream(fps);
        } else {
            console.error('captureStream不支持');
            stream = null;
        }
        //将播放器源指定为stream
        _playerVideo.srcObject = stream;
    }

    return <div className="container">
        <h1>捕获Video作为媒体流示例</h1>
        <video ref={sourceVideo} className="video" id="my-video" onCanPlay={canPlay} playsInline controls loop muted>
            <source src="../asset/mp4/oceans.mp4" type="video/mp4"/>
        </video>
        <video className="video" ref={playerVideo} playsInline autoPlay />
    </div>
}