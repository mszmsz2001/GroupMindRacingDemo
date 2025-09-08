import { _decorator, Component, Node, UITransform, view , Input, EventTouch, Vec2 } from 'cc';
import { RacingController } from './RacingController';
const { ccclass, property} = _decorator;

@ccclass('SpeedUp')
export class SpeedUp extends Component {
    @property({ type: RacingController, tooltip: "比赛控制节点" })
    RacingController: RacingController = null;
    
    // 加速度（每秒增加的速度）
    acceleration: number = 0;
    
    // 是否正在按压
    private isPressing: boolean = false;
    
    // 按压开始的时间
    private pressStartTime: number = 0;

    protected onLoad(): void {
        
        // 监听触摸/鼠标事件
        this.node.on(Input.EventType.TOUCH_START, this.onPressStart, this);
        this.node.on(Input.EventType.TOUCH_END, this.onPressEnd, this);
        this.node.on(Input.EventType.TOUCH_CANCEL, this.onPressEnd, this);
        
        // 鼠标支持（桌面平台）
        this.node.on(Input.EventType.MOUSE_DOWN, this.onPressStart, this);
        this.node.on(Input.EventType.MOUSE_UP, this.onPressEnd, this);
    }


    update(deltaTime: number) {
        // 如果正在按压，计算当前速度
        
    }

    // 按压开始
    private onPressStart(event: EventTouch | MouseEvent): void {
        this.isPressing = true;
        // 设置加速度
        this.acceleration = 100; // 每秒增加100像素/秒的速度  
        this.RacingController.acceleration = this.acceleration;
        console.log("speed up：" + this.RacingController.acceleration);
        this.pressStartTime = performance.now();
    }

    // 按压结束
    private onPressEnd(event: EventTouch | MouseEvent): void {
        this.isPressing = false;
        this.acceleration = -50; // 每秒减少50像素/秒的速度
        this.RacingController.acceleration = this.acceleration;
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


