import { _decorator, Component, Node, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RacingTrack')
export class RacingTrack extends Component {

    // 添加背景属性面板
    @property(Node)
    bg01: Node = null;
    @property(Node)
    bg02: Node = null;

    // 设置背景移动速度
    @property({ type: Number, tooltip: "背景移动速度" })
    bgSpeed: number = 100;

    // 背景高度
    private bgHeight: number = 0;

    start() {
        this.bgHeight = this.bg01.getComponent(UITransform).height; // 获取1个背景高度，因为两个背景是相同的
    }

    update(deltaTime: number) {
        let position1 = this.bg01.position;
        let position2 = this.bg02.position;
        // 计算背景移动距离
        let distance = this.bgSpeed * deltaTime;
        this.bg01.setPosition(position1.x, position1.y - distance);
        this.bg02.setPosition(position2.x, position2.y - distance);
        
        // 不用上面的position是因为会有一帧的差值
        let p1 = this.bg01.position;
        let p2 = this.bg02.position;
        // 如果背景移动出屏幕，则跳到下一个循环的位置
        if (p1.y < -this.bgHeight) {
            this.bg01.setPosition(p1.x, p2.y + this.bgHeight);
        }
        if (p2.y < -this.bgHeight) {
            this.bg02.setPosition(p2.x, p1.y + this.bgHeight);
        }
    }
}


