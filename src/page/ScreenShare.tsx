import React, {FC} from "react"
import {getDisplayMedia} from "../hooks/useOpenMedia";
import {Button} from "antd";


/**
 * 共享屏幕
 * @constructor
 */
export const ScreenShare: FC = () => {

    const startScreenShare = async ()=>{
        const stream =  await getDisplayMedia();
        headleSuccess(stream);
    }

    const headleSuccess = (stream:any) =>{
        const video = document.querySelector("#my-video") as HTMLVideoElement;
        // const videoTracks = steam.getAudioTracks();
        const videoTracks = stream.getVideoTracks();
        console.log("videoTracks====>",videoTracks[0]);
        video.srcObject = stream;
        window.stream = stream
    }

    return <div className="container">
        <h1>共享屏幕示例</h1>
        <div>
            <video className="video" id="my-video" autoPlay playsInline/>
            <canvas id="my-canvas" onClick={startScreenShare}>开始共享</canvas>
            <Button onClick={startScreenShare}>开始共享</Button>
        </div>
    </div>

}