import React, {useEffect, useRef, useState} from "react";
import {Button, message, Select} from "antd";
import {useOpenMedia} from "../hooks/useOpenMedia";

const {Option} = Select;
export const DeviceSelect = () => {

    //当前选择的音频输入设备
    const [selectedAudioDevice, setSelectedAudioDevice] = useState("");

    //当前选择的音频输出设备
    const [selectedAudioOutputDevice, setSelectedAudioOutputDevice] = useState("");

    //当前选择的视频输入设备
    const [selectedVideoDevice, setSelectedVideoDevice] = useState("");

    //视频输入设备列表
    const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);

    //音频输入设备列表
    const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);

    //音频输出设备列表
    const [audioOutputDevices, setAudioOutputDevices] = useState<MediaDeviceInfo[]>([]);

    const previewVideo = useRef<any>(null);


    const openCamera = useOpenMedia("all", (stream) => {
        handleSuccess(stream)
    }, (err) => {
        message.error("getUserMedia错误：" + err.anme);
    })

    const handleSuccess = (stream: MediaStream) => {
        const videoElement = previewVideo.current;
        // const videoTracks = steam.getAudioTracks();
        window.stream = stream;
        videoElement.srcObject = stream;
    }

    useEffect(() => {
        updateDevices().then((data: any) => {
            //判断当前选择的音频输入设备是否为空并且是否有设备
            if (selectedAudioDevice === "" && data.audioDevices.length > 0) {
                setSelectedAudioDevice(data.audioDevices[0].deviceId);
            }
            //判断当前选择的音频输出设备是否为空并且是否有设备
            if (selectedAudioOutputDevice === "" && data.audioOutputDevices.length > 0) {
                setSelectedAudioOutputDevice(data.audioOutputDevices[0].deviceId);
            }
            //判断当前选择的视频输入设备是否为空并且是否有设备
            if (selectedVideoDevice === "" && data.videoDevices.length > 0) {
                setSelectedVideoDevice(data.videoDevices[0].deviceId)
            }
            setVideoDevices(data.videoDevices);
            setAudioDevices(data.audioDevices);
            setAudioOutputDevices(data.audioOutputDevices);
        });
        // eslint-disable-next-line
    }, [])


    //更新设备信息
    const updateDevices = () => {
        return new Promise((resolve, reject) => {
            //枚举所有设备
            navigator.mediaDevices.enumerateDevices().then((devices) => {
                console.log("devices====>", devices);
                const _videoDevices = [];
                const _audioDevices = [];
                const _audioOutputDevices = [];
                for (let device of devices) {
                    //过滤出视频输入设备
                    if (device.kind === 'videoinput') {
                        //过滤出音频输入设备
                        _videoDevices.push(device);
                    } else if (device.kind === 'audioinput') {
                        //过滤出音频输出设备
                        _audioDevices.push(device);
                    } else if (device.kind === 'audiooutput') {
                        _audioOutputDevices.push(device);
                    }
                    setVideoDevices(_videoDevices);
                    setAudioDevices(_audioDevices);
                    setAudioOutputDevices(_audioOutputDevices);
                    const data = {
                        videoDevices: _videoDevices,
                        audioDevices: _audioDevices,
                        audioOutputDevices: _audioOutputDevices
                    };
                    resolve(data);
                }
            })
        });
    }

    const startTest = () => {
        //根据约束条件获取数据流
        openCamera();
    }

    const handleAudioDeviceChange = (value: string) => {
        setSelectedAudioDevice(value)
        setTimeout(startTest, 100);
    }

    const handleVideoDeviceChange = (value: string) => {
        setSelectedVideoDevice(value);
        setTimeout(startTest, 100);
    }

    const handleAudioOutputDeviceChange = (value: string) => {
        setSelectedAudioOutputDevice(value);
        const videoElement = previewVideo.current;
        if (typeof videoElement.sinkId !== 'undefined') {
            //调用HTMLMediaElement的setSinkId()方法改变输出源
            videoElement.setSinkId(value)
                .then(() => {
                    console.log(`音频输出设备设置成功: ${value}`);
                }).catch((error: any) => {
                if (error.name === 'SecurityError') {
                    console.log(`你需要使用HTTPS来选择输出设备: ${error}`);
                }
            });
        } else {
            console.warn('你的浏览器不支持输出设备选择。');
        }
    }

    return <div className="container">
        <h1>
            <span>输入输出设备选择示例</span>
        </h1>

        <Select value={selectedAudioDevice} style={{width: 150, marginRight: '10px'}}
                onChange={handleAudioDeviceChange}>
            {
                audioDevices.map((device, index) => {
                    return (<Option value={device.deviceId} key={device.deviceId}>{device.label}</Option>);
                })
            }
        </Select>
        {/* 音频输出设备列表 */}
        <Select value={selectedAudioOutputDevice} style={{width: 150, marginRight: '10px'}}
                onChange={handleAudioOutputDeviceChange}>
            {
                audioOutputDevices.map((device, index) => {
                    return (<Option value={device.deviceId}
                                    key={device.deviceId}>{device.label}</Option>);
                })
            }
        </Select>

        {/* 视频频输入设备列表 */}
        <Select value={selectedVideoDevice} style={{width: 150}} onChange={handleVideoDeviceChange}>
            {
                videoDevices.map((device, index) => {
                    return (<Option value={device.deviceId}
                                    key={device.deviceId}>{device.label}</Option>);
                })
            }
        </Select>
        {/* 视频预览展示 */}
        <video className="video" ref={previewVideo} autoPlay playsInline
               style={{objectFit: 'contain', marginTop: '10px'}}/>
        <Button onClick={startTest}>测试</Button>
    </div>
}