import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import { RacingController } from './RacingController';

@ccclass('ProgressController')
export class ProgressController extends Component {

    @property({ type: RacingController, tooltip: "比赛控制节点" })
    racingController: RacingController = null;

    private speed: number = 0;

    @property(Node)
    scaleBar: Node = null;
    @property(Node)
    fillBar: Node = null;

    start() {
        if (this.fillBar) {
            this.fillBar.setScale(0, 1);
        }
        else {
            console.warn("ProgressController 脚本没有关联 fillBar 节点！");
        }

        if (!this.racingController) {
            console.warn("ProgressController 脚本没有关联 RacingController 组件！");
        }
    }

    update(deltaTime: number) {
        this.speed = this.racingController.trackSpeed;

        const fillRadio = this.speed / this.racingController.maxSpeed;
        if (this.fillBar) {
            this.fillBar.setScale(fillRadio, 1);
        }
    }
}


