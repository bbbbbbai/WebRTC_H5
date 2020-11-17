import React, {FC, useState} from 'react'
import {useOpenMedia} from "../hooks/useOpenMedia";
import {Button, message, Select} from "antd";

const {Option} = Select;

const filters = [
    ["rtc-video-filter__filter", "没有滤镜"],
    ["rtc-video-filter__blur", "模糊"],
    ["rtc-video-filter__grayscale", "灰度"],
    ["rtc-video-filter__invert", "反转"],
    ["rtc-video-filter__sepia", "深褐色"],
]

export const VideoFilter: FC = () => {

    const [videoClass, setVideoClass] = useState("");

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

    const handleChange = (vule: string) => {
        setVideoClass(vule);
    }

    return <div className="container">
        <h1>视频滤镜示例</h1>
        <video className={"video " + videoClass} id="my-video" autoPlay playsInline/>
        <Button onClick={openCamera}>打开摄像头</Button>
        <Select defaultValue={filters[0][0]} style={{width: 120}} onChange={handleChange}>
            {
                filters.map((item, index) => {
                    return <Option key={index} value={item[0]}>{item[1]}</Option>
                })
            }
        </Select>
    </div>
}