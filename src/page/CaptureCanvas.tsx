import React, {useEffect, useRef} from "react";

//捕获Canvas作为媒体流示例
export const CaptureCanvas = () => {

    const canvasRef = useRef<any>(null);
    const videoRef = useRef<any>(null);


    useEffect(() => {
        startCaptureCanvas();
        // eslint-disable-next-line
    }, [])

    //开始捕获Canvas
    const startCaptureCanvas = () => {
        window.stream = canvasRef.current.captureStream(10);
        //将视频对象的源指定为stream
        videoRef.current.srcObject = window.stream;
        drawLine();
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
            <span>捕获Canvas作为媒体流示例</span>
        </h1>
        <div>
            {/* 画布Canvas容器 */}
            <div className="small-canvas">
                {/* Canvas不设置样式 */}
                <canvas ref={canvasRef}/>
            </div>
            <video className="small-video" ref={videoRef} playsInline autoPlay/>
        </div>
    </div>
}