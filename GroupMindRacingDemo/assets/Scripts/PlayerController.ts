import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {

    // 添加音效
    @property(AudioClip)
    engineSound: AudioClip = null; // 赛车引擎声

    @property(AudioSource)
    audioSource: AudioSource = null; // 声音播放组件

    private canMove: boolean = false;
    private hasFinished: boolean = false;
    private isSoundPlaying: boolean = false;

    start() {

    }

    update(deltaTime: number) {
        
    }

    //---以下是供 GameManager 调用的公共命令---

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
        // 停止播放引擎声
        if (this.audioSource && this.isSoundPlaying) {
            this.audioSource.stop();
            this.isSoundPlaying = false;
        }
    }

    // 命令：比赛结束！
    public onRaceEnd() {
        this.canMove = false;
        
    }

    playEngineSound() {

    }


}


