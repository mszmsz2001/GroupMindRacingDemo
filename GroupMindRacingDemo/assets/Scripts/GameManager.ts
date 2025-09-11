import { _decorator, Component,director, Label, labelAssembler, math, Node } from 'cc';
import { RacingController } from './RacingController';
import { GameOver } from './GameOver';
const { ccclass, property } = _decorator;

// 游戏状态枚举(等待、倒计时、游戏中、游戏结束、切换)
enum GameState {WAITING, COUNTDOWN, PLAYING, GAMEOVER, TRANSITIONING}

@ccclass('GameManager')
export class GameManager extends Component {

    // 脚本
    @property({ type: [RacingController], tooltip: "游戏模式控制节点" })
    Players: RacingController[] = [];

    // UI
    @property(Node)
    gameGuidanceLabel: Node = null;
    @property(Label)
    countdownLabel: Label = null;
    @property(Label)
    gameTimerLabel: Label = null;

    @property
    startDelay: number = 10; // 游戏开始前等待秒数

    @property
    countdownTime: number = 3; // 游戏倒计时3，2，1

    @property
    gameDuration: number = 30; // 游戏总时长

    private gameState: GameState = GameState.WAITING;
    private timer: number = 0;    
    private hasFinished: boolean = false;

    start() {
        this.timer = this.startDelay;
        this.gameGuidanceLabel.active = false;
        this.countdownLabel.node.active = false;
        // console.log("进入游戏倒计时状态："+this.countdownLable.node.active);
        this.gameTimerLabel.node.active = false;

        this.Players.forEach(player => player.onWaitingStart()); // 通知所有玩家进入等待状态
    }

    update(deltaTime: number) {
        this.timer -= deltaTime;

        if (this.hasFinished) {
            // 游戏已经结束
            return;
        }
    
        this.switchGameState();
        
    }

    // 选择游戏状态
    switchGameState() {
        switch (this.gameState) {
            case GameState.WAITING:
                // 更新引导面板标签
                this.gameGuidanceLabel.getChildByName("Countdown").getComponent(Label).string = Math.ceil(this.timer).toString() + '秒后开始';
                this.gameGuidanceLabel.active = true;

                if (this.timer <= 0) {
                    this.Players.forEach(player => player.onCountdownStart()); // 通知所有玩家进入倒计时状态
                    this.gameGuidanceLabel.active = false;
                    this.scheduleOnce(() => {
                        this.gameState = GameState.COUNTDOWN;
                        this.timer = this.countdownTime;
                        this.countdownLabel.node.active = true;
                    }, 1);

                    // 先设置为游戏结束，防止多次进入
                    this.gameState = GameState.TRANSITIONING;
                } 
                break;

            case GameState.COUNTDOWN:
                this.countdownLabel.string = Math.ceil(this.timer).toString(); // 更新游戏开始倒计时标签, timer取整
                if (this.timer <= 0) {
                    this.countdownLabel.string = "Go!";
                    // 0.5秒后隐藏倒计时Label
                    this.scheduleOnce(() => this.countdownLabel.node.active = false, 0.5);
                    // 提前显示游戏计时标签                  
                    this.gameTimerLabel.node.active = true;
                    this.Players.forEach(player => player.onRaceStart()); // 通知所有玩家进入比赛状态
                    this.scheduleOnce(() => {
                        this.gameState = GameState.PLAYING;
                        this.timer = this.gameDuration;
                    }, 1);

                    // 先设置为游戏结束，防止多次进入
                    this.gameState = GameState.TRANSITIONING;
                }
                break;

            case GameState.PLAYING:
                this.gameTimerLabel.string = `剩余时间：${Math.ceil(this.timer)}` // 更新游戏计时标签
                if (this.timer <= 0) {
                    this.gameState = GameState.GAMEOVER;
                    this.Players.forEach(player => player.onRaceEnd()); // 通知所有玩家进入游戏结束状态
                    
                }
                break;
            case GameState.GAMEOVER:
                this.gameTimerLabel.string = "游戏结束，正在结算中...";
                this.hasFinished = true;
                // 切换到游戏结束场景
                this.scheduleOnce(() => {director.loadScene("03-GameOver-TimeOver")}, 5);
                break;
        }
    }
}


