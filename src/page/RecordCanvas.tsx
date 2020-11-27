import React, {useRef, useState} from "react"
import {Button} from "antd";

/**
 * 录制Canvas
 * @constructor
 */
export const RecordCanvas = ()=>{
    //录制数据
    const [recordedBlobs, setRecordedBlobs] = useState<any[]>([]);

    //录制对象
    const [mediaRecorder, setMediaRecorder] = useState<any>(null);

    const canvasRef =  useRef<any>(null);

    const videoRef = useRef<any>(null);

    //开始
    const startCaptureCanvas = ()=>{
        window.stream = canvasRef.current.captureStream(10);
        videoRef.current.srcObject = window.stream;
        drawLine();

        setRecordedBlobs([])
        try {
            //初始化MediaRecorder对象，传入音频流及媒体类型
            // @ts-ignore
            const _mediaRecorder = new MediaRecorder(window.stream, { mimeType: 'video/webm' });
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
        console.log('handleDataAvailable', event);
        //判断是否有数据
        if (event.data && event.data.size > 0) {
            //记录数据
            setRecordedBlobs(v => [...v, event.data]);
        }
    }

    //结束
    const stopRecord = ()=>{
        if(!mediaRecorder && !window.stream){
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
        a.download = 'canvas.webm';
        //将a标签添加至网页
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            //释放url对象
            window.URL.revokeObjectURL(url);
        }, 100);

    }

    ///画线
    const drawLine = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        //填充颜色
        context.fillStyle = '#CCC';
        //绘制Canvas背景
        context.fillRect(0, 0, 320, 240);

        context.lineWidth = 1;
        //画笔颜色
        context.strokeStyle = "#FF0000";

        //监听画板鼠标按下事件，开始绘画
        canvas.addEventListener("mousedown", startAction);
        //监听画板鼠标抬起事件，结束绘画
        canvas.addEventListener("mouseup", endAction);
    }
    //鼠标按下事件
    const startAction = (event: any) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        //开始新的路径
        context.beginPath();
        //将画笔移动到指定坐标，类似起点
        context.moveTo(event.offsetX, event.offsetY);
        //开始绘制
        context.stroke();
        //监听鼠标移动事件
        canvas.addEventListener("mousemove", moveAction);
    }
    //鼠标移动事件
    const moveAction = (event: any) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        //将画笔移动到结束坐标，类似终点
        context.lineTo(event.offsetX, event.offsetY);
        //开始绘制
        context.stroke();
    }
    //鼠标抬起事件
    const endAction = () => {
        const canvas = canvasRef.current;
        canvas.removeEventListener("mousemove", moveAction);
    }

    return <div className="container">
        <h1>
            <span>录制Canvas示例</span>
        </h1>
        <div>
            {/* 画布Canvas容器 */}
            <div className="small-canvas">
                {/* Canvas不设置样式 */}
                <canvas ref={canvasRef}></canvas>
            </div>
            <video className="small-video" ref={videoRef} playsInline autoPlay>
            </video>
        </div>
        <Button className="button" onClick={startCaptureCanvas}>开始
        </Button>
        <Button className="button" onClick={stopRecord}>停止</Button>
    </div>
}