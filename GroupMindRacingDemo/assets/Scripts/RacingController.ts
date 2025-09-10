import { _decorator, AudioClip, AudioSource, Component, Label, math, Node, UITransform, view,director ,find, Scene} from 'cc';
import { ScrollingBackground } from './ScrollingBackground';
import { GlobalDataManager } from './GlobalDataManager';
const { ccclass, property } = _decorator;

@ccclass('RacingController')
export class RacingController extends Component {

    // 添加背景滚动节点
    @property({ type: ScrollingBackground, tooltip: "背景滚动控制节点" })
    scrollingBackground: ScrollingBackground = null;

    // 添加音效
    @property(AudioClip)
    engineSound: AudioClip = null; // 赛车引擎声

    @property(AudioSource)
    audioSource: AudioSource = null; // 声音播放组件

    // UI里程显示
    @property(Label)
    mileageLabel: Label = null;

    private canMove: boolean = false;
    private isSoundPlaying: boolean = false;

    // 添加赛道移动速度属性
    @property({ type: Number, tooltip: "赛道移动速度" })
    trackSpeed: number = 100;
    // 比赛里程显示，单位：像素
    public raceMileage: number = 0;
    // 基础速度（按压开始时的速度）
    private baseSpeed: number = 100;    
    // 最大速度限制
    maxSpeed: number = 500;
    // 加速度（每秒增加的速度）
    public acceleration: number = 0;

    start() {
        const uiTransform = this.node.getComponent(UITransform);
        uiTransform.setAnchorPoint(0.5, 0);  //设置0好计算坐标

        // 计算并设置位置
        const visibleHeight = view.getVisibleSize().height;
        const canvasBottomY = -visibleHeight / 2;

        // 设置赛道根节点位置
        this.node.setPosition(this.node.x, canvasBottomY);

        // 设置赛道初速度
        this.setSpeed(0);

        // 检查是否已经关联了子脚本
        if (this.scrollingBackground) {
            // 将本组件上设置的 trackSpeed 值，赋给子组件的 bgSpeed 变量
            this.scrollingBackground.bgSpeed = this.trackSpeed;
        } else {
            console.warn("GameMode 脚本没有关联 ScrollingBackground 组件！");
        }
    }

    update(deltaTime: number) {

        if (!this.scrollingBackground) {
            console.warn("GameMode 脚本没有关联 ScrollingBackground 组件！");
        }

       // 让赛道移动
        if (this.canMove) {

            // 计算加速度
            const addedSpeed = this.acceleration * deltaTime;
            // 计算新速度（不超过最大值）
            const newSpeed = this.trackSpeed + addedSpeed;
            this.setSpeed(newSpeed);

            // 更新赛道里程
            this.raceMileage += this.trackSpeed * deltaTime;
        } else {
            this.scrollingBackground.bgSpeed = 0;
        }

        // 更新里程UI显示
        this.mileageLabel.string = `里程：${Math.floor(this.raceMileage/100)}`;
        console.log(`里程：${Math.floor(this.raceMileage/100)}`);

    }

    //---以下是供 GameManager 调用的公共命令---//

    // 命令：等待开始！
    public onWaitingStart() {
        this.canMove = false;
    }

    // 命令：倒计时开始！
    public onCountdownStart() {
        if (!this.audioSource || !this.engineSound) return; // 确保音频组件和音频剪辑存在

        // 播放赛车引擎声
        if (this.audioSource && this.engineSound) {
            this.isSoundPlaying = true;
            this.audioSource.clip = this.engineSound;
            this.audioSource.play();
        }
    }

    // 命令：比赛开始！
    public onRaceStart() {
        this.canMove = true;
        this.speedUp(); // 开始加速
        // 停止播放引擎声
        if (this.audioSource && this.isSoundPlaying) {
            this.audioSource.stop();
            this.isSoundPlaying = false;
        }
    }

    // 命令：比赛结束！
    public onRaceEnd() {
        // 等待几秒恒定加速度减速至0
        this.speedDown();
        this.scheduleOnce(() => {
            this.acceleration = 0;
            this.canMove = false;
        }, Math.abs(this.trackSpeed / this.acceleration));
        this.collectAllMileages();
    }

    //---以上是供 GameManager 调用的公共命令---//

    //---以下是 加速、减速 命令---//
    // 加速
    speedUp() {
        this.acceleration = 100; // 每秒增加100像素/秒的速度
    }

    // 减速
    speedDown() {
        this.acceleration = -200; // 每秒减少50像素/秒的速度
    }

    // 设置速度
    public setSpeed(newSpeed: number) {
        // 将速度限制在某个区间内，比如 0 到 this.maxSpeed
        this.trackSpeed = math.clamp(newSpeed, 0, this.maxSpeed);
        this.scrollingBackground.bgSpeed = this.trackSpeed;
    }
    // 计算速度

    // 收集所有四辆车的里程并保存
    private collectAllMileages() {
        const allMileages = [];
        const targetNames = ['RacingTrack-001', 'RacingTrack-002', 'RacingTrack-003', 'RacingTrack-004'];
        
        // 找到Canvas节点（四辆赛车的父节点）
        const canvasNode = find('Canvas');
        if (!canvasNode) {
            console.error("未找到Canvas节点！");
            return;
        }
        console.log(`已找到Canvas节点，子节点数量: ${canvasNode.children.length}`);

        // 遍历目标名称列表，从Canvas的子节点中查找
        targetNames.forEach(targetName => {
            // 在Canvas的子节点中查找目标节点
            const targetNode = canvasNode.getChildByName(targetName);
            
            if (!targetNode) {
                console.error(`在Canvas下未找到${targetName}`);
                return;
            }

            // 获取节点上的RaceController组件
            const targetController = targetNode.getComponent(RacingController);
            if (!targetController) {
                console.error(`${targetName}上未挂载RaceController组件`);
                return;
            }

            // 添加里程数据
            allMileages.push({
                racemileage: Math.floor(targetController.raceMileage)
            });
            console.log(`已收集${targetName}的里程: ${targetController.raceMileage}`);
        });

        console.log(`共收集到${allMileages.length}/4个玩家里程数据`);
        GlobalDataManager.getInstance().setPlayerDatas(allMileages);
        // 切换到游戏结束场景
        director.loadScene("03-GameOver-TimeOver");
    }


}


 