import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameOver')
export class GameOver extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }
    onExitClick() {
        // 打开场景
        director.loadScene('00-StartMenu');
        console.log("跳转成功");
    }
    onAgainButtonClick() {
        // 打开场景
        director.loadScene('02-GameScene');
        console.log("跳转成功");
    }  

}


