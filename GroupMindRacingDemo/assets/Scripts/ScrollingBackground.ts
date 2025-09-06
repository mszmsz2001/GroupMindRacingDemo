import { _decorator, Component, Node, UITransform, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScrollingBackground')
export class ScrollingBackground extends Component {

    // 添加背景属性面板
    @property(Node)     // bg00是起始与终点背景
    bg00: Node = null;
    @property(Node)     // bg01-bg04是循环滚动背景
    bg01: Node = null;
    @property(Node)
    bg02: Node = null;
    @property(Node)
    bg03: Node = null;
    @property(Node)
    bg04: Node = null;
    @property(Node)
    bg05: Node = null;

    // 不再需要 @property，因为它将由父节点控制
    // 但它仍然是一个 public 变量，外部可以访问和修改
    public bgSpeed: number = 100;

    // 背景高度
    private bgHeight: number = 0;
    // 记录初始位置
    private canvasBottomY: number = 0;

    start() {
        // 记录初始位置
        this.bgHeight = this.bg01.getComponent(UITransform).height; // 获取1个背景高度，因为两个背景是相同的

        /* 设置了赛道父节点的Y坐标，所以可以注释掉
        // const visibleHeight = view.getVisibleSize().height;         // 获取可视区域高度，即画布画板
        // this.canvasBottomY = -visibleHeight / 2; // 计算画布底部的Y坐标
        */

        // 设置父节点坐标
        this.node.setPosition(0, this.canvasBottomY);

        // 设置初始位置,防止摆放错误
        this.bg05.setPosition(0, this.canvasBottomY + this.bgHeight/2);
        this.bg00.setPosition(0, this.canvasBottomY + this.bgHeight + this.bgHeight/2);
        this.bg01.setPosition(0, this.canvasBottomY + this.bgHeight*2 + this.bgHeight/2);
        this.bg02.setPosition(0, this.canvasBottomY + this.bgHeight*3 + this.bgHeight/2);
        this.bg03.setPosition(0, this.canvasBottomY + this.bgHeight*4 + this.bgHeight/2);
        this.bg04.setPosition(0, this.canvasBottomY + this.bgHeight*5 + this.bgHeight/2);

    }

    update(deltaTime: number) {

        let position0 = this.bg00.position;
        let position1 = this.bg01.position;
        let position2 = this.bg02.position;
        let position3 = this.bg03.position;
        let position4 = this.bg04.position;
        let position5 = this.bg05.position;

        // 计算背景移动距离
        let distance = this.bgSpeed * deltaTime;
        this.bg00.setPosition(position0.x, position0.y - distance);
        this.bg01.setPosition(position1.x, position1.y - distance);
        this.bg02.setPosition(position2.x, position2.y - distance);
        this.bg03.setPosition(position3.x, position3.y - distance);
        this.bg04.setPosition(position4.x, position4.y - distance);
        this.bg05.setPosition(position5.x, position5.y - distance);

        // 不用上面的position是因为会有一帧的差值
        let p0 = this.bg00.position;
        let p1 = this.bg01.position;
        let p2 = this.bg02.position;
        let p3 = this.bg03.position;
        let p4 = this.bg04.position;
        
        // 如果背景移动出屏幕，则跳到下一个循环的位置
        if (p1.y + this.bgHeight/2 < this.canvasBottomY) {
            this.bg01.setPosition(p1.x, p1.y + this.bgHeight*4);
        }
        if (p2.y + this.bgHeight/2 < this.canvasBottomY) {
            this.bg02.setPosition(p2.x, p2.y + this.bgHeight*4);
        }
        if (p3.y + this.bgHeight/2 < this.canvasBottomY) {
            this.bg03.setPosition(p3.x, p3.y + this.bgHeight*4);
        }
        if (p4.y + this.bgHeight/2 < this.canvasBottomY) {
            this.bg04.setPosition(p4.x, p4.y + this.bgHeight*4);
        }

    }
}


