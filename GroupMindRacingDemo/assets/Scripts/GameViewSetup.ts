import { _decorator, Component, Node, UITransform, view } from 'cc';
import { ScrollingBackground } from './ScrollingBackground';
const { ccclass, property } = _decorator;

@ccclass('GameViewSetup')
export class GameViewSetup extends Component {

    // 添加背景滚动节点
    @property({ type: ScrollingBackground, tooltip: "背景滚动控制节点" })
    scrollingBackground: ScrollingBackground = null;

    // 添加赛道移动速度属性
    @property({ type: Number, tooltip: "赛道移动速度" })
    trackSpeed: number = 100;

    start() {
        const uiTransform = this.node.getComponent(UITransform);
        uiTransform.setAnchorPoint(0.5, 0);  //设置0好计算坐标

        // 计算并设置位置
        const visibleHeight = view.getVisibleSize().height;
        const canvasBottomY = -visibleHeight / 2;

        // 设置赛道根节点位置
        this.node.setPosition(this.node.x, canvasBottomY);

        // 检查是否已经关联了子脚本
        if (this.scrollingBackground) {
            // 将本组件上设置的 trackSpeed 值，赋给子组件的 bgSpeed 变量
            this.scrollingBackground.bgSpeed = this.trackSpeed;
        } else {
            console.warn("GameViewSetup 脚本没有关联 ScrollingBackground 组件！");
        }

    }

    update(deltaTime: number) {
        
    }
}


