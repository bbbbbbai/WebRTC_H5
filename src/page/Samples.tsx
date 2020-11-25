import React, {FC} from "react"
import {List} from "antd";
import {Link} from "react-router-dom";

const data = [
    {title: "首页", path: "/"},
    {title: "相机", path: "/camera"},
    {title: "麦克风", path: "/microphone"},
    {title: "截取视频", path: "/canvas"},
    {title: "共享屏幕", path: "/screenShare"},
    {title: "视频滤镜", path: "/videoFilter"},
    {title: "视频分辨率设置", path: "/resolution"},
    {title: "音量检测", path: "/audioVolume"},
    {title: "输入输出设备选择", path: "/deviceSelect"},
    {title: "设置综合", path: "/mediaSettings"},
    {title: "mediaStreamAPI测试", path: "/mediaStreamAPI"},
    {title: "捕获Video作为媒体流", path: "/captureVideo"},
    {title: "捕获Canvas作为媒体流示例", path: "/captureCanvas"},
    {title: "录制音频示例", path: "/recordAudio"},
    {title: "录制视频示例", path: "/RecordVideo"}
];

export const Samples: FC = () => {
    return <div>
        <List
            header={<div>WebRTC示例</div>}
            footer={<div>footer</div>}
            bordered
            dataSource={data}
            renderItem={item => (
                <List.Item>
                    <Link to={item['path']}> {item['title']}</Link>
                </List.Item>
            )}
        >
        </List>
    </div>
}