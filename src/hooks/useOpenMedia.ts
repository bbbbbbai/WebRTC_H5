/**
 * 打开摄像头
 * @param callback 成功回调
 * @param fail 错误回调
 */
export const useOpenMedia = (
    constraint: "audio" | "video" | "all",
    callback: (steam: MediaStream) => void,
    fail?: (e: any) => void) => {
    let constraints = {
        audio: false,
        video: false
    }
    switch (constraint) {
        case "all":
            constraints.audio = true;
            constraints.video = true
            break;
        case "audio":
            constraints.audio = true;
            break;
        case "video":
            constraints.video = true;
            break;
    }

    return () => {
        try {
            navigator.mediaDevices.getUserMedia(constraints).then(callback).catch(fail)
        } catch (e) {
            fail && fail(e);
        }
    }
}


export const getDisplayMedia = () => {
    const _m = navigator.mediaDevices as any;
    return _m.getDisplayMedia({video:true});
}