import React, {useState} from 'react'
import { message, Select} from "antd";

const {Option} = Select;
//QVGA 320*240
const qvgaConstraints = {
    video: {width: {exact: 320}, height: {exact: 240}}
};

//VGA 640*480
const vgaConstraints = {
    video: {width: {exact: 640}, height: {exact: 480}}
};

//高清 1280*720
const hdConstraints = {
    video: {width: {exact: 1280}, height: {exact: 720}}
};
//超清 1920*1080
const fullHdConstraints = {
    video: {width: {exact: 1920}, height: {exact: 1080}}
};

//2K 2560*1440
const twoKConstraints = {
    video: {width: {exact: 2560}, height: {exact: 1440}}
};

//4K 4096*2160
const fourKConstraints = {
    video: {width: {exact: 4096}, height: {exact: 2160}}
};

//8K 7680*4320
const eightKConstraints = {
    video: {width: {exact: 7680}, height: {exact: 4320}}
};

export const Resolution = () => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    // const openCamera = useOpenMedia("video", (steam) => {
    //     handleSuccess(steam)
    //     setStream(steam);
    // }, (err) => {
    //     message.error("getUserMedia错误：" + err.anme);
    // })

    // /**
    //  * 成功返回流
    //  * @param steam
    //  */
    // const handleSuccess = (steam: MediaStream) => {
    //     const video = document.querySelector("#my-video") as HTMLVideoElement;
    //     // const videoTracks = steam.getAudioTracks();
    //     video.srcObject = steam;
    // }
    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
        //根据下拉列表框的值获取不同分辨率的视频
        switch (value) {
            case 'qvga':
                getMedia(qvgaConstraints);
                break;
            case 'vga':
                getMedia(vgaConstraints);
                break;
            case 'hd':
                getMedia(hdConstraints);
                break;
            case 'fullhd':
                getMedia(fullHdConstraints);
                break;
            case '2k':
                getMedia(twoKConstraints);
                break;
            case '4k':
                getMedia(fourKConstraints);
                break;
            case '8k':
                getMedia(eightKConstraints);
                break;
            default:
                getMedia(vgaConstraints);
                break;
        }
    }

    const getMedia = (constraints: { video: { width: { exact: number }, height: { exact: number } } }) => {
        //判断流对象是否为空
        if (stream) {
            //迭代并停止所有轨道
            stream.getTracks().forEach(track => {
                track.stop();
            });
        }
        //重新获取视频
        navigator.mediaDevices.getUserMedia(constraints).then(gotStream).catch(handleError)
    }
    //错误处理
    const handleError = (error: any) => {
        console.log(`getUserMedia错误: ${error.name}`, error);
        message.error("当前设备不满足")
    }
    const gotStream = (mediaStream: MediaStream) => {
        const video = document.querySelector("#my-video") as HTMLVideoElement;
        window.stream = mediaStream;
        setStream(mediaStream)
        //将video视频源指定为mediaStream
        video.srcObject = mediaStream;
        const track = mediaStream.getVideoTracks()[0];
        const constraints = track.getConstraints();
        console.log('约束条件为:' + JSON.stringify(constraints));
    }

    return <div className="container">
        <h1>视频分辨率设置示例</h1>
        <video className="video" id="my-video" autoPlay playsInline/>
        <Select defaultValue="vga" style={{width: '100px', marginLeft: '20px'}} onChange={handleChange}>
            <Option value="qvga">QVGA</Option>
            <Option value="vga">VGA</Option>
            <Option value="hd">高清</Option>
            <Option value="fullhd">超清</Option>
            <Option value="2k">2K</Option>
            <Option value="4k">4K</Option>
            <Option value="8k">8K</Option>
        </Select>
        {/*<Button onClick={openCamera}>打开摄像头</Button>*/}
    </div>
}