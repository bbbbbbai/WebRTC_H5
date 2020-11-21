export {}

declare global {
    interface Window {
        constraints: {
            audio: boolean,
            video: boolean
        }
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__:any
        stream:any
        AudioContext:any
        webkitAudioContext:any
        soundMeter:any
        audioContext:any
    }
}