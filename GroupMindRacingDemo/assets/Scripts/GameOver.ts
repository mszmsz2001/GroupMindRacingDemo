import { _decorator, Component, director, Node } from 'cc';
import { GlobalDataManager } from './GlobalDataManager';
const { ccclass, property } = _decorator;

@ccclass('GameOver')
export class GameOver extends Component {
    start() {
        // 获取所有玩家里程数据
        const mileageData = GlobalDataManager.getInstance().getPlayerDatas();
        
        // 打印四个里程数据（对应RacingTrack-001到004）
        if (mileageData && mileageData.length > 0) {
            // 循环打印每个玩家的里程
            for (let i = 0; i < mileageData.length; i++) {
                // 数组索引0对应RacingTrack-001，1对应002，以此类推
                console.log(`玩家${i + 1}的里程: ${mileageData[i].racemileage}`);
            }
        } else {
            console.warn("未获取到玩家里程数据");
        }
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


