import React from "react";
import {useOpenMedia} from "../hooks/useOpenMedia";
import {Button, message} from "antd";

export const MediaStreamAPI = () => {

    const openCamera = useOpenMedia("all", (steam) => {
        handleSuccess(steam)
    }, (err) => {
        message.error("getUserMedia错误：" + err.anme);
    })


    /**
     * 成功返回流
     * @param stream
     */
    const handleSuccess = (stream: MediaStream) => {
        const video = document.querySelector("#my-video") as HTMLVideoElement;
        // const videoTracks = steam.getAudioTracks();
        window.stream = stream;
        video.srcObject = stream;
    }

    //获取所有轨道
    const btnGetTracks = () => {
        if (!window.stream) {
            return;
        }
        console.log("@getTracks ", window.stream.getTracks())
    }

    //获取音频轨道
    const btnGetAudioTracks = () => {
        if (!window.stream) {
            return;
        }
        console.log("@getVideoTracks ", window.stream.getVideoTracks())
    }

    //根据Id获取音频轨道
    const btnGetTrackById = () => {
        if (!window.stream) {
            return;
        }
        console.log("@getTrackById ", window.stream.getTrackById(window.stream.getAudioTracks()[0].id));
    }

    //删除音频轨道
    const btnRemoveAudioTrack = () => {
        if (!window.stream) {
            return;
        }
        if (window.stream.getAudioTracks().length === 0) {
            return
        }
        console.log("@removeTrack getAudioTracks");
        window.stream.removeTrack(window.stream.getAudioTracks()[0]);
    }

    //获取视频轨道
    const btnGetVideoTracks = () => {
        if (!window.stream) {
            return;
        }
        console.log("@getVideoTracks ", window.stream.getVideoTracks());
    }

    const btnRemoveVideoTrack = () => {
        console.log("@removeTrack getVideoTracks");
        if (!window.stream) {
            return;
        }
        if (window.stream.getVideoTracks().length === 0) {
            return
        }
        window.stream.removeTrack(window.stream.getVideoTracks()[0]);
    }

    return <div className="container">
        <h1>MediaStreamAPI测试</h1>
        <video className="video" id="my-video" autoPlay playsInline/>
        <Button onClick={openCamera}>打开摄像头</Button>
        <br/>
        <Button onClick={btnGetTracks}>获取所有轨道</Button>
        <Button onClick={btnGetAudioTracks}>获取音频轨道</Button>
        <Button onClick={btnGetTrackById}>根据Id获取音频轨道</Button>
        <Button onClick={btnRemoveAudioTrack}>删除音频轨道</Button>
        <Button onClick={btnGetVideoTracks}>获取视频轨道</Button>
        <Button onClick={btnRemoveVideoTrack}>删除视频轨道</Button>
    </div>
}