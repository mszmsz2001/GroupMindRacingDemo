import { _decorator, Component, Label, math, Node } from 'cc';
const { ccclass, property } = _decorator;

enum GameState {WAITING, COUNTDOWN, PLAYING, GAMEOVER}

@ccclass('GameManager')
export class GameManager extends Component {

    @property(Node)
    GameGuidanceLable: Node = null;

    @property(Label)
    countdownLable: Label = null;

    @property(Label)
    gameTimerLable: Label = null;

    @property
    startDelay: number = 10; // 游戏开始前等待秒数

    @property
    countdownTime: number = 3; // 游戏倒计时3，2，1

    @property
    gameDuration: number = 30; // 游戏总时长

    private gameState: GameState = GameState.WAITING;
    private timer: number = 0;

    start() {
        this.timer = this.startDelay;
        this.GameGuidanceLable.active = true;
        this.countdownLable.node.active = false;
        // console.log("进入游戏倒计时状态："+this.countdownLable.node.active);
        this.gameTimerLable.node.active = false;
    }

    update(deltaTime: number) {
        this.timer -= deltaTime;
        
        // 选择游戏状态
        switch (this.gameState) {
            case GameState.WAITING:
                // 更新引导面板标签
                this.GameGuidanceLable.getChildByName("Countdown").getComponent(Label).string = Math.ceil(this.timer)+'秒后开始';

                if (this.timer <= 0) {
                    this.GameGuidanceLable.active = false;
                    this.gameState = GameState.COUNTDOWN;
                    this.timer = this.countdownTime;
                    this.countdownLable.node.active = true;
                }
                break;

            case GameState.COUNTDOWN:
                this.countdownLable.string = Math.ceil(this.timer).toString(); // 更新游戏开始倒计时标签, timer取整
                if (this.timer <= 0) {
                    this.countdownLable.string = "Go!";
                    this.gameState = GameState.PLAYING;
                    this.timer = this.gameDuration;
                    this.gameTimerLable.node.active = true;
                    // 0.5秒后隐藏倒计时Label
                    this.scheduleOnce(() => this.countdownLable.node.active = false, 0.5);
                }
                break;

            case GameState.PLAYING:
                this.gameTimerLable.string = `剩余时间：${Math.ceil(this.timer)}` // 更新游戏计时标签
                if (this.timer <= 0) {
                    this.gameState = GameState.GAMEOVER;
                    this.gameTimerLable.string = "游戏结束";

                }
                break;
        }
        
    }
}


