import React, {useRef, useState} from "react";
import {Button} from "antd";
import {getDisplayMedia} from "../hooks/useOpenMedia";


/**
 * 录制屏幕示例
 */
export const RecordScreen = ()=>{

    const myVideoRef = useRef<any>(null);

    //录制数据
    const [recordedBlobs, setRecordedBlobs] = useState<any[]>([]);

    //录制对象
    const [mediaRecorder, setMediaRecorder] = useState<any>(null);

    //开始录制
    const startCaptureScreen = async ()=>{
        const stream =  await getDisplayMedia();
        window.stream = stream;
        const myVideo = myVideoRef.current;
        myVideo.srcObject = stream;

        stream.addEventListener('inactive', (e:any) => {
            console.log('监听到屏幕捕获停止后停止录制!');
            stopRecord(e);
        });

        setRecordedBlobs([])
        try {
            //初始化MediaRecorder对象，传入音频流及媒体类型
            let options = {mineType: 'audio/ogg;'};
            // @ts-ignore
            const _mediaRecorder = new MediaRecorder(stream, options);
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
        } catch (e) {
            console.error('MediaRecorder创建失败:', e);
            return;
        }
    }

    //录制数据回调事件
    const handleDataAvailable = (event: any) => {
        //判断是否有数据
        if (event.data && event.data.size > 0) {
            //记录数据
            setRecordedBlobs(v => [...v, event.data]);
        }
    }


    //停止录制
    const stopRecord =(e:any)=>{
        if(!mediaRecorder || !window.stream){
            return
        }
        //停止录制
        mediaRecorder.stop();
        //停掉所有轨道
        window.stream.getTracks().forEach((track:any) => track.stop());
        //将stream设置为空
        window.stream = null;
        //生成Blob文件，类型为video/webm
        const blob = new Blob(recordedBlobs, { type: 'video/webm' });
        //创建一个下载链接
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        //指定下载文件及类型
        a.download = 'screen.webm';
        //将a标签添加至网页
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            //释放url对象
            window.URL.revokeObjectURL(url);
        }, 100);
    }


    return <div className="container">
        <h1>
            <span>录制屏幕示例</span>
        </h1>
        {/* 捕获屏幕数据渲染 */}
        <video className="video" ref={myVideoRef} autoPlay playsInline></video>
        <Button onClick={startCaptureScreen} style={{ marginRight: "10px" }}>开始</Button>
        <Button onClick={stopRecord}>停止</Button>
    </div>
}