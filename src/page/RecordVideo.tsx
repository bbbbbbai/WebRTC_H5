import React, {useRef, useState} from "react";
import {Button} from "antd";
import {IStatus} from "../constants";


/**
 * 录制视频示例
 */
export const RecordVideo = () => {

    //当前状态
    const [status, setStatus] = useState<IStatus>(IStatus.start);
    //录制数据
    const [recordedBlobs, setRecordedBlobs] = useState<any[]>([]);

    //录制对象
    const [mediaRecorder, setMediaRecorder] = useState<any>(null);

    const videoPreviewRef = useRef<any>(null)
    const videoPlayerRef = useRef<any>(null)

    const startClickHandler = async () => {
        //约束条件
        const constraints = {
            //开启音频
            audio: true,
            //设置视频分辨率为1280*720
            video: {
                width: 1280, height: 720
            }
        };
        try {
            //获取音视频流
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            window.stream = stream;
            //将视频预览对象源指定为stream
            const videoPreview = videoPreviewRef.current;
            videoPreview.srcObject = stream;
            setStatus(IStatus.startRecord)
        } catch (e) {
            console.error('navigator.getUserMedia error:', e);
        }
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
    const playButtonClickHandler = () => {
        //生成Blob文件，类型为video/webm
        const blob = new Blob(recordedBlobs, {type: 'video/webm'});
        const videoPlayer = videoPlayerRef.current;
        videoPlayer.src = null;
        videoPlayer.srcObject = null;
        //URL.createObjectURL()方法会根据传入的参数创建一个指向该参数对象的URL
        videoPlayer.src = window.URL.createObjectURL(blob);
        setStatus(IStatus.download);
        videoPlayer.play();
    }

    //下载录制的文件
    const downloadButtonClickHandler = () => {
        //生成Blob文件，类型为video/webm
        const blob = new Blob(recordedBlobs, {type: 'video/webm'});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        //指定下载文件及类型
        a.download = 'test' + new Date().getTime() + '.webm';
        //将a标签添加至网页
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            //URL.revokeObjectURL()方法会释放一个通过URL.createObjectURL()创建的对象URL.
            //window.URL.revokeObjectURL(url);
        }, 100);
        //设置录制状态
        setStatus(IStatus.start);
    }

    return <div className="container">
        <h1>
            <span>录制视频示例</span>
        </h1>
        {/* 视频预览 muted表示默认静音 */}
        <video className="small-video" ref={videoPreviewRef} playsInline autoPlay muted/>
        {/* 视频回放 loop表示循环播放 */}
        <video className="small-video" ref={videoPlayerRef} playsInline loop/>
        <div>
            <Button onClick={startClickHandler} disabled={status !== IStatus.start}>打开摄像头</Button>
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