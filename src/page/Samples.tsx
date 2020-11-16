import React, {FC} from "react"
import {List} from "antd";
import {Link} from "react-router-dom";

const data = [
    {title: "首页", path: "/"},
    {title: "相机", path: "/camera"},
    {title: "麦克风", path: "/microphone"},
    {title: "截取视频", path: "/canvas"},
    {title: "共享屏幕", path: "/screenShare"}
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