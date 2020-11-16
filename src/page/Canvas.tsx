import React, {FC, useEffect, useRef} from 'react'
import {Button, message} from "antd";
import {useOpenMedia} from "../hooks/useOpenMedia";


export const Canvas: FC = () => {

    const videoRef = useRef(null);
    useEffect(() => {
        openCamera();
        // eslint-disable-next-line
    }, [])

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

    /**
     * 截屏
     */
    const takeSnap = () => {
        const canvas = document.querySelector("#my-canvas") as HTMLCanvasElement;
        const video = document.querySelector("#my-video") as HTMLVideoElement;
        canvas.width = video.offsetWidth;
        canvas.height = video.offsetHeight;
        // @ts-ignore
        canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    }

    return <div className="container">
        <h1>截取视频示例</h1>
        <div>
            <video ref={videoRef} className="video" id="my-video" autoPlay playsInline/>
            <canvas id="my-canvas"></canvas>
            <Button onClick={takeSnap}>截屏</Button>
        </div>
    </div>
}