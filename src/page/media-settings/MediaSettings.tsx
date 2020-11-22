import React, {FC, useEffect, useRef, useState} from "react";
import {Button, Modal, Select} from "antd";
import SoundMeter from "../volume/soundMeter.js";

const {Option} = Select
export const MediaSettings: FC = () => {

    //是否弹出对话框
    const [visible, setVisible] = useState(false);

    //视频输入设备列表
    const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);

    //音频输入设备列表
    const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);

    //音频输出设备列表
    const [audioOutputDevices, setAudioOutputDevices] = useState<MediaDeviceInfo[]>([]);

    //分辨率
    const [resolution, setResolution] = useState("vga");

    //当前选择的音频输入设备
    const [selectedAudioDevice, setSelectedAudioDevice] = useState("");

    //当前选择的视频输入设备
    const [selectedVideoDevice, setSelectedVideoDevice] = useState("");

    //音频音量
    const [audioLevel, setAudioLevel] = useState(0);

    const previewVideo = useRef<any>(null);

    const progressbar = useRef<any>(null);

    useEffect(() => {
        try {
            //AudioContext是用于管理和播放所有的声音
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            //实例化AudioContext
            window.audioContext = new AudioContext();
        } catch (e) {
            console.log('网页音频API不支持。');
        }


        updateDevices().then((data: any) => {
            //判断当前选择的音频输入设备是否为空并且是否有设备
            if (selectedAudioDevice === "" && data.audioDevices.length > 0) {
                setSelectedAudioDevice(data.audioDevices[0].deviceId);
            }
            //判断当前选择的视频输入设备是否为空并且是否有设备
            if (selectedVideoDevice === "" && data.videoDevices.length > 0) {
                setSelectedVideoDevice(data.videoDevices[0].deviceId)
            }
            setVideoDevices(data.videoDevices);
            setAudioDevices(data.audioDevices);
            setAudioOutputDevices(data.audioOutputDevices);
            console.log("audioOutputDevices===>", audioOutputDevices);
        }).then(() => {
            const deviceInfo = localStorage["deviceInfo"];
            if (deviceInfo) {
                const info = JSON.parse(deviceInfo) as any;
                console.log("info", info);
                setSelectedAudioDevice(info.audioDevice);
                setSelectedVideoDevice(info.videoDevice)
                setResolution(info.resolution);
            }
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
    const showModal = () => {
        setVisible(true)
        //停止预览
        setTimeout(startPreview, 100);
    }

    //点击“确定”按钮进行处理
    const handleOk = (e: any) => {
        //关闭对话框
        setVisible(false)
        //判断是否能存储
        if (window.localStorage) {
            //设置信息
            let deviceInfo = {
                //音频设备Id
                audioDevice: selectedAudioDevice,
                //视频设备Id
                videoDevice: selectedVideoDevice,
                //分辨率
                resolution: resolution,
            };
            //使用JSON转成字符串后存储在本地
            localStorage["deviceInfo"] = JSON.stringify(deviceInfo);
        }
        //停止预览
        stopPreview();
    }
    //取消设置
    const handleCancel = () => {
        //关闭对话框
        setVisible(false)
        //停止预览
        stopPreview();
    }

    //停止预览
    const stopPreview = () => {
        //关闭音视频流
        if (window.stream) {
            closeMediaStream(window.stream);
        }
    }
    //关闭音视频流
    const closeMediaStream = (stream: any) => {
        //判断stream是否为空
        if (!stream) {
            return;
        }
        let tracks, i, len;
        //判断是否有getTracks方法
        if (stream.getTracks) {
            //获取所有Track
            tracks = stream.getTracks();
            //迭代所有Track
            for (i = 0, len = tracks.length; i < len; i += 1) {
                //停止每个Track
                tracks[i].stop();
            }
        } else {
            //获取所有音频Track
            tracks = stream.getAudioTracks();
            //迭代所有音频Track
            for (i = 0, len = tracks.length; i < len; i += 1) {
                //停止每个Track
                tracks[i].stop();
            }
            //获取所有视频Track
            tracks = stream.getVideoTracks();
            //迭代所有视频Track
            for (i = 0, len = tracks.length; i < len; i += 1) {
                //停止每个Track
                tracks[i].stop();
            }
        }
    }
    //音频输入设备改变
    const handleAudioDeviceChange = (value: string) => {
        setSelectedAudioDevice(value)
        setTimeout(startPreview, 100);
    }

    //视频输入设备改变
    const handleVideoDeviceChange = (value: string) => {
        setSelectedVideoDevice(value);
        setTimeout(startPreview, 100);
    }

    //分辨率选择改变
    const handleResolutionChange = (value: string) => {
        console.log('选择的分辨率为: ' + JSON.stringify(value));
        setResolution(value)
    }

    //音频音量处理
    const soundMeterProcess = () => {
        //读取音量值，再乘以一个系数，可以得到音量条的宽度
        let val = (window.soundMeter.instant.toFixed(2) * 348) + 1;
        //设置音量值状态
        setAudioLevel(val);
        if (!visible) {
            //每隔100毫秒调用一次soundMeterProcess函数，模拟实时检测音频音量
            setTimeout(soundMeterProcess, 100);
        }
    }

    //开始预览
    const startPreview = () => {
        //判断window对象里是否有stream
        if (window.stream) {
            //关闭音视频流
            closeMediaStream(window.stream);
        }
        window.soundMeter = new SoundMeter(window.audioContext);
        //视频预览对象
        const videoElement = previewVideo.current;
        //音频源
        const audioSource = selectedAudioDevice;
        //视频源
        const videoSource = selectedVideoDevice;

        const constraints = {
            //设置音频设备Id
            audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
            //设置视频设备Id
            video: {deviceId: videoSource ? {exact: videoSource} : undefined}
        };

        //根据约束条件获取数据流
        navigator.mediaDevices.getUserMedia(constraints)
            .then(function (stream) {
                //成功返回音视频流
                window.stream = stream;
                videoElement.srcObject = stream;
                //将声音测量对象与流连接起来
                window.soundMeter.connectToSource(stream);
                //每隔100毫秒调用一次soundMeterProcess函数，模拟实时检测音频音量
                setTimeout(soundMeterProcess, 100);
                //返回枚举设备
                return navigator.mediaDevices.enumerateDevices();
            })
    }


    return (
        <div className="container">
            <h1>
                <span>设置综合示例</span>
            </h1>
            <Button onClick={showModal}>修改设备</Button>
            <Modal
                title="修改设备"
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="确定"
                cancelText="取消">
                <div className="item">
                    <span className="item-left">麦克风</span>
                    <div className="item-right">
                        <Select value={selectedAudioDevice} style={{width: 350}} onChange={handleAudioDeviceChange}>
                            {
                                audioDevices ? audioDevices.map((device, index) => {
                                    return (
                                        <Option value={device.deviceId} key={device.deviceId}>{device.label}</Option>);
                                }) : null
                            }
                        </Select>
                        <div ref={progressbar} style={{
                            width: audioLevel + 'px',
                            height: '10px',
                            backgroundColor: '#8dc63f',
                            marginTop: '20px',
                        }}>
                        </div>
                    </div>
                </div>
                <div className="item">
                    <span className="item-left">摄像头</span>
                    <div className="item-right">
                        <Select value={selectedVideoDevice} style={{width: 350}} onChange={handleVideoDeviceChange}>
                            {
                                videoDevices.map((device, index) => {
                                    return (
                                        <Option value={device.deviceId} key={device.deviceId}>{device.label}</Option>);
                                })
                            }
                        </Select>
                        <div className="video-container" style={{marginTop: "30px"}}>
                            <video id='previewVideo' ref={previewVideo} autoPlay playsInline
                                   style={{width: '100%', height: '100%', objectFit: 'contain'}}/>
                        </div>

                    </div>
                </div>
                <div className="item">
                    <span className="item-left">清晰度</span>
                    <div className="item-right">
                        <Select style={{width: 350}} value={resolution} onChange={handleResolutionChange}>
                            <Option value="qvga">流畅(320x240)</Option>
                            <Option value="vga">标清(640x360)</Option>
                            <Option value="hd">高清(1280x720)</Option>
                            <Option value="fullhd">超清(1920x1080)</Option>
                        </Select>
                    </div>
                </div>
            </Modal>
        </div>
    );
}