import { _decorator, Component, director, Node, Label } from 'cc';
import { GlobalDataManager } from './GlobalDataManager';
const { ccclass, property } = _decorator;

@ccclass('GameOver')
export class GameOver extends Component {
    // 四个玩家里程显示的Label组件（在编辑器中拖入对应节点）
    @property({ 
        type: Label, 
        tooltip: "玩家1里程显示标签" 
    })
    player01Label: Label = null;

    @property({ 
        type: Label, 
        tooltip: "玩家2里程显示标签" 
    })
    player02Label: Label = null;

    @property({ 
        type: Label, 
        tooltip: "玩家3里程显示标签" 
    })
    player03Label: Label = null;

    @property({ 
        type: Label, 
        tooltip: "玩家4里程显示标签" 
    })
    player04Label: Label = null;

    start() {
        // 获取所有玩家里程数据
        const mileageData = GlobalDataManager.getInstance().getPlayerDatas();
        
        // 显示数据到界面
        this.displayMileageData(mileageData);
    }

    /**
     * 显示里程数据到UI界面
     * @param data 里程数据数组
     */
    private displayMileageData(data: any[]) {
        // 检查数据是否有效
        if (!data || data.length === 0) {
            console.warn("未获取到玩家里程数据");
            this.setAllLabels("无数据");
            return;
        }

        // 设置每个玩家的里程显示
        this.setLabelText(this.player01Label, 1, data[0]?.racemileage);
        this.setLabelText(this.player02Label, 2, data[1]?.racemileage);
        this.setLabelText(this.player03Label, 3, data[2]?.racemileage);
        this.setLabelText(this.player04Label, 4, data[3]?.racemileage);
    }

    /**
     * 设置单个标签的文本内容
     * @param label 标签组件
     * @param playerIndex 玩家序号
     * @param mileage 里程数据
     */
    private setLabelText(label: Label, playerIndex: number, mileage: number) {
        if (label) {
            // 如果里程数据存在则显示，否则显示"无数据"
            label.string = ` ${mileage !== undefined ? Math.ceil(mileage / 100) : "无数据"}`;
        } else {
            console.warn(`玩家${playerIndex}的显示标签未设置`);
        }
    }

    /**
     * 当没有数据时，设置所有标签显示相同内容
     * @param text 要显示的文本
     */
    private setAllLabels(text: string) {
        if (this.player01Label) this.player01Label.string = `玩家1: ${text}`;
        if (this.player02Label) this.player02Label.string = `玩家2: ${text}`;
        if (this.player03Label) this.player03Label.string = `玩家3: ${text}`;
        if (this.player04Label) this.player04Label.string = `玩家4: ${text}`;
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