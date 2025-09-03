import { _decorator, Component, Node, UITransform, view , Input, EventTouch, Vec2 } from 'cc';
import { ScrollingBackground } from './ScrollingBackground';
const { ccclass, property } = _decorator;

@ccclass('GameViewSetup')
export class GameViewSetup extends Component {

    // 添加背景滚动节点
    @property({ type: ScrollingBackground, tooltip: "背景滚动控制节点" })
    scrollingBackground: ScrollingBackground = null;

    // 添加赛道移动速度属性
    trackSpeed: number = 100;
    
    // 基础速度（按压开始时的速度）
    private baseSpeed: number = 100;
    
    // 最大速度限制
    maxSpeed: number = 500;
    
    // 加速度（每秒增加的速度）
    acceleration: number = 20;
    
    // 是否正在按压
    private isPressing: boolean = false;
    
    // 按压开始的时间
    private pressStartTime: number = 0;

    protected onLoad(): void {
        // 初始化基础速度
        this.baseSpeed = this.trackSpeed;
        
        // 监听触摸/鼠标事件
        this.node.on(Input.EventType.TOUCH_START, this.onPressStart, this);
        this.node.on(Input.EventType.TOUCH_END, this.onPressEnd, this);
        this.node.on(Input.EventType.TOUCH_CANCEL, this.onPressEnd, this);
        
        // 鼠标支持（桌面平台）
        this.node.on(Input.EventType.MOUSE_DOWN, this.onPressStart, this);
        this.node.on(Input.EventType.MOUSE_UP, this.onPressEnd, this);
    }


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
        // 如果正在按压，计算当前速度
        if (this.isPressing) {
            // 计算按压持续时间
            const pressDuration = performance.now() - this.pressStartTime;
            
            // 计算增加的速度（转换为秒）
            const addedSpeed = (pressDuration / 1000) * this.acceleration;
            
            // 计算新速度（不超过最大值）
            const newSpeed = this.baseSpeed + addedSpeed;
            this.trackSpeed = Math.min(newSpeed, this.maxSpeed);
        } else if (this.trackSpeed > this.baseSpeed) {
        // 松开后减速（直到达到最低速度）
        this.trackSpeed -= this.acceleration * deltaTime;
        // 确保不会低于最低速度
        this.trackSpeed = Math.max(this.trackSpeed, this.baseSpeed);
    }
    }


    // 按压开始
    private onPressStart(event: EventTouch | MouseEvent): void {
        this.isPressing = true;
        this.pressStartTime = performance.now();
        // 记录按压开始时的速度作为基础速度
        this.baseSpeed = this.trackSpeed;
    }

    // 按压结束
    private onPressEnd(event: EventTouch | MouseEvent): void {
        this.isPressing = false;
        // 可以在这里添加松开后的逻辑，比如保持当前速度或逐渐减速
        // 示例：保持当前速度（不重置）
    }

    protected onDestroy(): void {
        // 移除事件监听
        this.node.off(Input.EventType.TOUCH_START, this.onPressStart, this);
        this.node.off(Input.EventType.TOUCH_END, this.onPressEnd, this);
        this.node.off(Input.EventType.TOUCH_CANCEL, this.onPressEnd, this);
        
        this.node.off(Input.EventType.MOUSE_DOWN, this.onPressStart, this);
        this.node.off(Input.EventType.MOUSE_UP, this.onPressEnd, this);
    }







}


