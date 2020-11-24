import React, {useRef, useState} from "react";
import {Button, message} from "antd";
import {useOpenMedia} from "../hooks/useOpenMedia";

enum IStatus {
    start,
    startRecord,
    stopRecord,
    play,
    download
}

/**
 * 录制音频示例
 * @constructor
 */
export const RecordAudio = () => {

    const audioPlayer = useRef<any>(null);

    const openAudio = useOpenMedia("audio", (stream) => {
        handleSuccess(stream)
    }, (err) => {
        console.log("err====>", err);
        message.error("getUserMedia错误：" + err.anme);
    })

    //当前状态
    const [status, setStatus] = useState<IStatus>(IStatus.start);

    //录制数据
    const [recordedBlobs, setRecordedBlobs] = useState<any[]>([]);

    //录制对象
    const [mediaRecorder, setMediaRecorder] = useState<any>(null);

    /**
     * 成功返回流
     * @param steam
     */
    const handleSuccess = (stream: MediaStream) => {
        window.stream = stream;
        setStatus(IStatus.startRecord);
    }

    //开始录制
    const startRecordButtonClickHandler = () => {
        setRecordedBlobs([])
        let options = {mineType: 'audio/ogg;'};
        try {
            //初始化MediaRecorder对象，传入音频流及媒体类型
            // @ts-ignore
            const _mediaRecorder = new MediaRecorder(window.stream, options);
            console.log("_mediaRecorder===>", _mediaRecorder);
            setMediaRecorder(_mediaRecorder);
            //录制停止事件回调
            _mediaRecorder.onstop = (event: any) => {
                console.log('Recorder stopped: ', event);
                console.log('Recorded Blobs: ', recordedBlobs);
            };

            //当数据有效时触发的事件，可以把数据存储到缓存区里
            _mediaRecorder.ondataavailable = handleDataAvailable;

            //录制10秒
            _mediaRecorder.start(10);
            console.log('MediaRecorder started', _mediaRecorder);
            setStatus(IStatus.stopRecord);
        } catch (e) {
            console.error('MediaRecorder创建失败:', e);
            return;
        }


    }

    //录制数据回调事件
    const handleDataAvailable = (event: any) => {
        console.log('handleDataAvailable', event);
        //判断是否有数据
        if (event.data && event.data.size > 0) {
            //记录数据
            setRecordedBlobs(v => [...v, event.data]);
        }
    }

    //停止播放
    const stopRecordButtonClickHandler = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setStatus(IStatus.play);
        }
    }

    //播放录制的数据
    const playButtonClickHandler =()=>{
        //生成Blob文件，类型为audio/ogg
        const blob = new Blob(recordedBlobs, { type: 'audio/ogg' });
        if(audioPlayer.current){
             const _audioPlayer = audioPlayer.current;
            _audioPlayer.src  =  null;
            //根据Blob文件生成播放器的数据源
            _audioPlayer.src = window.URL.createObjectURL(blob);
            //播放声音
            _audioPlayer.play();
            //设置当前状态为download
            setStatus(IStatus.download);
        }
    }

    //下载录制的文件
    const downloadButtonClickHandler  =()=>{
        //生成Blob文件，类型为audio/ogg
        const blob = new Blob(recordedBlobs, { type: 'audio/ogg' });
        //URL.createObjectURL()方法会根据传入的参数创建一个指向该参数对象的URL
        const url = window.URL.createObjectURL(blob);
        //创建a标签
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        //设置下载文件
        a.download = 'test-'+new Date().getTime()+'.ogg';
        //将a标签添加至网页
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            //URL.revokeObjectURL()方法会释放一个通过URL.createObjectURL()创建的对象URL.
            //window.URL.revokeObjectURL(url);
        }, 100);
        setStatus(IStatus.start)
    }

    return <div className="container">
        <h1>
            <span>音频录制</span>
        </h1>

        {/* 音频播放器，播放录制的音频 */}
        <audio id="my-audio" ref={audioPlayer} controls autoPlay/>
        <div>
            <Button onClick={openAudio} disabled={status !== IStatus.start}>打开麦克风</Button>
            <Button
                className="button"
                disabled={status !== IStatus.startRecord}
                onClick={startRecordButtonClickHandler}>
                开始录制
            </Button>
            <Button
                className="button"
                disabled={status !== IStatus.stopRecord}
                onClick={stopRecordButtonClickHandler}>
                停止录制
            </Button>
            <Button
                className="button"
                disabled={status !== IStatus.play}
                onClick={playButtonClickHandler}>
                播放
            </Button>
            <Button
                className="button"
                disabled={status !== IStatus.download}
                onClick={downloadButtonClickHandler}>
                下载
            </Button>
        </div>
    </div>
}