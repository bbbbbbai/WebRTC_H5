import React, {useEffect, useRef, useState} from "react";
// @ts-ignore
import oceans from "../asset/mp4/oceans.mp4";
import {Button} from "antd";

let peerConnA: RTCPeerConnection | null = null;
let peerConnB: RTCPeerConnection | null = null;

/**
 * 连接建立视频
 * @constructor
 */
export const PeerConnectionVideo = () => {

    const [localStream, setLocalStream] = useState<MediaStream | null>(null)
    const localVideoRef = useRef<any>(null)
    const remoteVideoRef = useRef<any>(null)

    useEffect(() => {
        window.stream = localStream;
    }, [localStream])

    const canPlay = () => {
        const stream = localVideoRef.current.captureStream(0);
        setLocalStream(stream);
    }

    //呼叫
    const call = async () => {
        if (!localStream) {
            return;
        }
        console.log('开始呼叫...');

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
        let configuration: RTCConfiguration = {iceServers: [{urls: "stun:stun.l.google.com:19302"}]};

        //创建RTCPeerConnection对象
        peerConnA = new RTCPeerConnection(configuration);
        //监听Candidate返回信息
        peerConnA.addEventListener("icecandidate", onIceCandidateA);

        //创建RTCPeerConnection对象
        peerConnB = new RTCPeerConnection(configuration);
        //监听Candidate返回信息
        peerConnB.addEventListener("icecandidate", onIceCandidateB);


        //监听ICE状态变化
        peerConnA.addEventListener('iceconnectionstatechange', onIceStateChangeA);
        //监听ICE状态变化
        peerConnB.addEventListener('iceconnectionstatechange', onIceStateChangeB);


        //监听track事件，可以获取到远端视频流
        peerConnB.addEventListener('track', gotRemoteStream);


        //循环迭代本地流的所有轨道
        localStream.getTracks().forEach((track) => {
            console.log("track====>", track)
            //把音视频轨道添加到连接中
            peerConnA && peerConnA.addTrack(track, localStream);
        });

        try {
            console.log('peerConnA创建提议Offer开始');
            //创建提议Offer
            const offer = await peerConnA.createOffer();
            console.log("offer===>", offer);
            //创建Offer成功
            await onCreateOfferSuccess(offer);
        } catch (e) {
            //创建Offer失败
            console.error("@onCreateOfferSuccess", e)
        }
    }

    const onCreateOfferSuccess = async (desc: RTCSessionDescriptionInit) => {
        //peerConnA创建Offer返回的SDP信息
        console.log(`peerConnA创建Offer返回的SDP信息\n${desc.sdp}`);
        console.log('设置peerConnA的本地描述start');
        try {
            if (!peerConnA) return;
            //设置peerConnA的本地描述
            await peerConnA.setLocalDescription(desc);
            console.log("设置peerConnA的本地描述 完成")
        } catch (e) {
            console.error("@setLocalDescription", e)
        }
        console.log('peerConnB开始设置远端描述');
        try {
            if (!peerConnB) return;
            //设置peerConnB的远端描述
            await peerConnB.setRemoteDescription(desc);
            console.log("设置peerConnB的本地描述 完成")
        } catch (e) {
            console.error("@setRemoteDescription", e)
        }

        console.log('peerConnB开始创建应答Answer');
        try {
            if (!peerConnB) return;
            //创建应答Answer
            const answer = await peerConnB.createAnswer();
            //创建应答成功
            await onCreateAnswerSuccess(answer);
        } catch (e) {
            console.error("@onCreateAnswerSuccess", e)
        }

    }

    const onCreateAnswerSuccess = async (desc: RTCSessionDescriptionInit) => {
        //输出SDP信息
        console.log(`peerConnB的应答Answer数据:\n${desc.sdp}`);
        console.log('peerConnB设置本地描述开始:setLocalDescription');

        try {
            if (!peerConnB) return;
            //设置peerConnB的本地描述信息
            await peerConnB.setLocalDescription(desc);
        } catch (e) {
            console.error("@setLocalDescription", e)
        }

        try {
            if (!peerConnA) return;
            //设置peerConnA的远端描述，即peerConnB的应答信息
            await peerConnA.setRemoteDescription(desc);
        } catch (e) {
            console.error("@setLocalDescription", e)
        }


    }


    //监听track事件，可以获取到远端视频流
    const gotRemoteStream = (event: RTCTrackEvent) => {
        console.log("@gotRemoteStream====>", event);
        if (remoteVideoRef.current.srcObject !== event.streams[0]) {
            //取集合第一个元素
            remoteVideoRef.current.srcObject = event.streams[0];
            console.log('peerConnB开始接收远端流', event);
        }
    }

    //监听ICE A状态变化
    const onIceStateChangeA = (e: Event) => {
        console.log("@onIceStateChangeA ", e)
    }

    //监听ICE B状态变化
    const onIceStateChangeB = (e: Event) => {
        console.log("@onIceStateChangeB ", e)
    }


    //监听Candidate返回信息
    const onIceCandidateA = async (event: RTCPeerConnectionIceEvent) => {
        try {
            if (event.candidate && peerConnB) {
                console.log("onIceCandidateA====>", event.candidate);
                //将peerConnA的Candidate添加至peerConnB
                await peerConnB.addIceCandidate(event.candidate);
            }
        } catch (e) {
            console.error("@addIceCandidate", e)
        }
        console.log(`IceCandidate数据:\n${event.candidate ? event.candidate.candidate : '(null)'}`);
    }

    //监听CandidateB返回信息
    const onIceCandidateB = async (event: RTCPeerConnectionIceEvent) => {
        try {
            if (event.candidate && peerConnA) {
                console.log("onIceCandidateB====>", event.candidate);
                //将peerConnA的Candidate添加至peerConnB
                await peerConnA.addIceCandidate(event.candidate);
            }
        } catch (e) {
            console.error("@addIceCandidate", e)
        }
        console.log(`IceCandidate数据:\n${event.candidate ? event.candidate.candidate : '(null)'}`);
    }

    //挂断
    const hangup = () => {
        console.log('结束会话');
        //关闭peerConnA
        peerConnA && peerConnA.close();
        //关闭peerConnB
        peerConnB &&  peerConnB.close();
        //将peerConnA设置为空
        peerConnA= null;
        //将peerConnB设置为空
        peerConnB= null;
    }

    return <div className="container">
        <h1>捕获Video作为媒体流示例</h1>
        <video ref={localVideoRef} className="video" id="my-video" onCanPlay={canPlay} playsInline controls loop muted>
            <source src={oceans} type="video/mp4"/>
        </video>
        <video className="video" ref={remoteVideoRef} playsInline autoPlay/>
        <div>
            <Button onClick={call} style={{marginRight: "10px"}}>呼叫</Button>
            <Button onClick={hangup} style={{marginRight: "10px"}}>挂断</Button>
        </div>
    </div>
}