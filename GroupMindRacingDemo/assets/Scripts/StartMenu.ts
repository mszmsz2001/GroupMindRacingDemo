import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('StartMenu')
export class StartMenu extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }

    // 开始游戏按钮点击事件
    onStartButtonClick() {
        // 打开场景
        director.loadScene('02-GameScene');
    }
}


