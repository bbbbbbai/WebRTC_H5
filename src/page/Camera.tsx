import React from 'react'
import {useOpenMedia} from "../hooks/useOpenMedia";
import {Button, message} from "antd";


export const Camera = () => {

    const openCamera = useOpenMedia("video", (steam) => {
        handleSuccess(steam)
    }, (err) => {
        message.error("getUserMedia错误：" + err.anme);
    })

    /**
     * 成功返回流
     * @param steam
     */
    const handleSuccess = (steam: MediaStream) => {
        const video = document.querySelector("#my-video") as HTMLVideoElement;
        // const videoTracks = steam.getAudioTracks();
        video.srcObject = steam;
    }

    return <div className="container">
        <h1>打开摄像头</h1>
        <video className="video" id="my-video" autoPlay playsInline/>
        <Button onClick={openCamera}>打开摄像头</Button>
    </div>
}