import React, {useRef, useState} from "react"
import {Button} from "antd";

let peerConnA:any = null;
let peerConnB:any = null;


/**
 * 连接建立示例
 */
export const PeerConnection = () => {

    const startButtonRef = useRef<any>(null)
    const callButtonRef = useRef<any>(null)
    const hangupButtonRef = useRef<any>(null)
    const localVideoRef = useRef<any>(null)
    const remoteVideoRef = useRef<any>(null)
    const [localStream, setLocalStream] = useState<any>(null)
    //开始
    const start = async () => {
        console.log('开始获取本地媒体流');
        try {
            //获取音视频流
            const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
            console.log('获取本地媒体流成功');
            //本地视频获取流
            localVideoRef.current.srcObject = stream;
            setLocalStream(stream)
        } catch (e) {
            console.log("getUserMedia错误:" + e);
        }
    }
    //呼叫
    const call = async () => {
        console.log('开始呼叫...');
        if (!localStream) {
            return;
        }

        console.log("localStream===>",localStream);

        //视频轨道
        const videoTracks = localStream.getVideoTracks();
        //音频轨道
        const audioTracks = localStream.getAudioTracks();
        //判断视频轨道是否有值
        if (videoTracks.length > 0) {
            //输出摄像头的名称
            console.log(`使用的视频设备为: ${videoTracks[0].label}`);
        }
        //判断音频轨道是否有值
        if (audioTracks.length > 0) {
            //输出麦克风的名称
            console.log(`使用的音频设备为: ${audioTracks[0].label}`);
        }

        //设置ICE Server，使用Google服务器
        let configuration = {"iceServers": [{"urls": "stun:stun.l.google.com:19302"}]};

        //创建RTCPeerConnection对象
        // @ts-ignore
        const _peerConnA = new RTCPeerConnection(configuration);
        peerConnA = _peerConnA
        _peerConnA.addEventListener('icecandidate', onIceCandidateA);
        // @ts-ignore
        const _peerConnB = new RTCPeerConnection(configuration);
        peerConnB = _peerConnB
        _peerConnB.addEventListener('icecandidate', onIceCandidateB);


        //监听ICE状态变化
        _peerConnA.addEventListener('iceconnectionstatechange', onIceStateChangeA);
        //监听ICE状态变化
        _peerConnB.addEventListener('iceconnectionstatechange', onIceStateChangeB);


        //监听track事件，可以获取到远端视频流
        _peerConnB.addEventListener('track', gotRemoteStream);

        //循环迭代本地流的所有轨道
        localStream.getTracks().forEach((track:any) => {
            //把音视频轨道添加到连接中
            _peerConnA.addTrack(track, localStream);
        });

        try {
            console.log('peerConnA创建提议Offer开始');
            //创建提议Offer
            const offer = await _peerConnA.createOffer();
            //创建Offer成功
            await onCreateOfferSuccess(offer);
        } catch (e) {
            //创建Offer失败
            console.error("@onCreateOfferSuccess",e)
        }
    }

    const onCreateOfferSuccess = async (desc:any)=>{
        //peerConnA创建Offer返回的SDP信息
        console.log(`peerConnA创建Offer返回的SDP信息\n${desc.sdp}`);
        console.log('设置peerConnA的本地描述start');
        try {
            //设置peerConnA的本地描述
            await peerConnA.setLocalDescription(desc);
            onSetLocalSuccess(peerConnA);
        } catch (e) {
            console.error("@setLocalDescription",e)
        }

        console.log('peerConnB开始设置远端描述');
        try {
            //设置peerConnB的远端描述
            await peerConnB.setRemoteDescription(desc);
            onSetRemoteSuccess(peerConnB);
        } catch (e) {
            console.error("@setRemoteDescription",e)
        }

        console.log('peerConnB开始创建应答Answer');
        try {
            //创建应答Answer
            const answer = await peerConnB.createAnswer();
            //创建应答成功
            await onCreateAnswerSuccess(answer);
        } catch (e) {
            console.error("@onCreateAnswerSuccess",e)
        }
    }

    //创建应答成功
    const onCreateAnswerSuccess = async (desc:any) => {
        //输出SDP信息
        console.log(`peerConnB的应答Answer数据:\n${desc.sdp}`);
        console.log('peerConnB设置本地描述开始:setLocalDescription');
        try {
            //设置peerConnB的本地描述信息
            await peerConnB.setLocalDescription(desc);
            onSetLocalSuccess(peerConnB);
        } catch (e) {
            console.error("@setLocalDescription",e)
        }
        console.log('peerConnA设置远端描述开始:setRemoteDescription');
        try {
            //设置peerConnA的远端描述，即peerConnB的应答信息
            await peerConnA.setRemoteDescription(desc);
            onSetRemoteSuccess(peerConnA);
        } catch (e) {
            console.error("@setRemoteDescription",e)
        }
    }

    //设置本地描述完成
     const onSetLocalSuccess = (pc:any) => {
        console.log(`${getName(pc)}设置本地描述完成:setLocalDescription`);
    }

    //设置远端描述完成
    const onSetRemoteSuccess = (pc:any) => {
        console.log(`${getName(pc)}设置远端描述完成:setRemoteDescription`);
    }



    const onIceStateChangeA = (event:any)=>{
        console.log(`peerConnA连接的ICE状态: ${peerConnA.iceConnectionState}`);
        console.log('ICE状态改变事件: ', event);
    }

    const onIceStateChangeB = (event:any)=>{
        console.log(`peerConnB连接的ICE状态: ${peerConnB.iceConnectionState}`);
        console.log('ICE状态改变事件: ', event);
    }

    const onIceCandidateB = async (event: any) => {
        try {
            if (event.candidate) {
                //将peerConnA的Candidate添加至peerConnB
                await peerConnA.addIceCandidate(event.candidate);
                onAddIceCandidateSuccess(peerConnA);
            }
        } catch (e) {
            console.error("@addIceCandidate",e)
        }
        console.log(`IceCandidate数据:\n${event.candidate ? event.candidate.candidate : '(null)'}`);
    }


    const gotRemoteStream = (e:any)=> {
        if (remoteVideoRef.current.srcObject !== e.streams[0]) {
            //取集合第一个元素
            remoteVideoRef.current.srcObject = e.streams[0];
            console.log('peerConnB开始接收远端流',e);
        }
    }

    const onIceCandidateA = async (event: any) => {
        try {
            if (event.candidate) {
                //将peerConnA的Candidate添加至peerConnB
                await peerConnB.addIceCandidate(event.candidate);
                onAddIceCandidateSuccess(peerConnB);
            }
        } catch (e) {
            console.error("@addIceCandidate",e)
        }
        console.log(`IceCandidate数据:\n${event.candidate ? event.candidate.candidate : '(null)'}`);
    }

    const onAddIceCandidateSuccess = (pc: any) => {
        console.log(`${getName(pc)}添加IceCandidate成功`);
    }

    const getName = (pc: any) => {
        return (pc === peerConnA) ? 'peerConnA' : 'peerConnB';
    }

    //挂断
    const hangup = () => {
        console.log('结束会话');
        //关闭peerConnA
        peerConnA.close();
        //关闭peerConnB
        peerConnB.close();
        //将peerConnA设置为空
        peerConnA= null;
        //将peerConnB设置为空
        peerConnB= null;

    }

    return <div className="container">
        <h1>
            <span>RTCPeerConnection示例</span>
        </h1>
        {/* 本地视频 */}
        <video ref={localVideoRef} playsInline autoPlay muted/>
        {/* 远端视频 */}
        <video ref={remoteVideoRef} playsInline autoPlay/>
        <div>
            <Button ref={startButtonRef} onClick={start} style={{marginRight: "10px"}}>开始</Button>
            <Button ref={callButtonRef} onClick={call} style={{marginRight: "10px"}}>呼叫</Button>
            <Button ref={hangupButtonRef} onClick={hangup} style={{marginRight: "10px"}}>挂断</Button>
        </div>
    </div>
}