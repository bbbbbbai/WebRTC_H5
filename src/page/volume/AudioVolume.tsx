import React, {useEffect, useState} from "react";
import {message} from "antd";
import SoundMeter from "./soundMeter.js";
import {useOpenMedia} from "../../hooks/useOpenMedia";
export const AudioVolume = () => {

    const [audioLevel,setAudioLevel] = useState(0);

    const openAudio = useOpenMedia("audio", (stream) => {
        handleSuccess(stream)
    }, (err) => {
        console.log("err====>",err);
        message.error("getUserMedia错误：" + err.anme);
    })

    useEffect(()=>{
        try {
            //AudioContext用于管理和播放所有的声音
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            //实例化AudioContext
            window.audioContext = new AudioContext();
        } catch (e) {
            console.log('网页音频API不支持。');
            message.error("网页音频API不支持。" );
        }
        window.soundMeter = new SoundMeter(window.audioContext);
        //根据约束条件获取媒体
        openAudio();

        return ()=>{
            window.soundMeter.stop();
        }
        // eslint-disable-next-line
    },[])

    //获取媒体成功
    const handleSuccess = (stream:any) => {
        window.stream = stream;
        //将声音测量对象与流连接起来
        window.soundMeter.connectToSource(stream);
        //开始实时读取音量值
        setTimeout(soundMeterProcess, 100);
    }



    //音频音量处理
    const soundMeterProcess = () => {
        //读取音量值，再乘以一个系数，可以得到音量条的宽度
        let val = (window.soundMeter.instant.toFixed(2) * 348) + 1;
        //设置音量值状态
        setAudioLevel(val);
        //每隔100毫秒调用一次soundMeterProcess函数，模拟实时检测音频音量
        setTimeout(soundMeterProcess, 100);
    }

    return <div className="container">
        <h1>
            <span>音量检测示例</span>
        </h1>
        {/* 这是使用了一个div来作为音量条的展示，高度固定，宽度根据音量值来动态变化 */}
        <div style={{
            width: audioLevel + 'px',
            height: '10px',
            backgroundColor: '#8dc63f',
            marginTop: '20px',
        }}>
        </div>
    </div>
}
