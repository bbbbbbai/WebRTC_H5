import React from 'react'
import {useOpenMedia} from "../hooks/useOpenMedia";
import {Button, message} from "antd";

export const Microphone = () => {

    const openAudio = useOpenMedia("audio", (stream) => {
        handleSuccess(stream)
    }, (err) => {
        console.log("err====>",err);
        message.error("getUserMedia错误：" + err.anme);
    })

    /**
     * 成功返回流
     * @param steam
     */
    const handleSuccess = (stream: MediaStream) => {
        const audio = document.querySelector("#my-audio") as HTMLAudioElement;
        console.log("steam===>",stream);
        // const videoTracks = steam.getAudioTracks();
        audio.srcObject = stream;
    }

    return <div className="container">
        <h1>打开麦克风</h1>
        <audio id="my-audio" controls autoPlay/>
        <Button onClick={openAudio}>打开麦克风</Button>
    </div>
}