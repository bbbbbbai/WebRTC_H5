import React from 'react'
import {useOpenMedia} from "../hooks/useOpenMedia";
import {Button, message} from "antd";

export const Microphone = () => {

    const openCamera = useOpenMedia("audio", (steam) => {
        handleSuccess(steam)
    }, (err) => {
        console.log("err====>",err);
        message.error("getUserMedia错误：" + err.anme);
    })

    /**
     * 成功返回流
     * @param steam
     */
    const handleSuccess = (steam: MediaStream) => {
        const audio = document.querySelector("#my-audio") as HTMLAudioElement;
        console.log("steam===>",steam);
        // const videoTracks = steam.getAudioTracks();
        audio.srcObject = steam;
    }

    return <div className="container">
        <h1>打开麦克风</h1>
        <audio id="my-audio" controls autoPlay/>
        <Button onClick={openCamera}>打开麦克风</Button>
    </div>
}