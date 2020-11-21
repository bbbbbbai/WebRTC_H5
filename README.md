# WebRTC 示例

项目目录

    h5-samples  
    ├─debug.log  
    ├─package.json  
    ├─README.md  
    ├─tsconfig.json  
    ├─yarn.lock  
    ├─src  
    |  ├─App.tsx  //路由管理
    |  ├─index.tsx  
    |  ├─react-app-env.d.ts  
    |  ├─reportWebVitals.ts  
    |  ├─styless  //样式
    |  |    ├─css  
    |  |    |  ├─canvas.scss  
    |  |    |  ├─record.scss  
    |  |    |  └styless.scss  
    |  ├─redux  //状态管理
    |  |   ├─count.ts  
    |  |   ├─reducers.ts  
    |  |   ├─action  
    |  |   |   └action.ts  
    |  ├─page  
    |  |  ├─Camera.tsx  //打开摄像头示例
    |  |  ├─Canvas.tsx  //截取视频示例
    |  |  ├─Microphone.tsx  //麦克风示例
    |  |  ├─Resolution.tsx  //视频分辨率示例
    |  |  ├─Samples.tsx  //入口示例页面
    |  |  ├─ScreenShare.tsx  //共享屏幕示例
    |  |  ├─VideoFilter.tsx  //视频滤镜示例
    |  |  ├─volume  //音量检测
    |  |  |   ├─AudioVolume.tsx  
    |  |  |   └soundMeter.js 
    |  ├─hooks  
    |  |   └useOpenMedia.ts  //媒体方法
    |  ├─constants  
    |  |     ├─index.ts  //公共接口
    |  |     └windows.ts  //window 全局 接口
 