import { _decorator, Component, Node , director} from 'cc';
const { ccclass } = _decorator;

// 定义玩家数据接口
export interface PlayerData {
    name: string;
    racemileage: number;
}

@ccclass('GlobalDataManager')
export class GlobalDataManager extends Component {
    // 单例实例
    private static instance: GlobalDataManager;
    
    // 存储玩家数据
    private playerDatas: PlayerData[] = [];
    
    // 获取单例
    public static getInstance(): GlobalDataManager {
        if (!this.instance) {
            // 如果没有实例，则创建一个新节点并挂载此组件
            const node = new Node('GlobalDataManager');
            director.addPersistRootNode(node); // 设置为持久化节点，不会被场景切换销毁
            this.instance = node.addComponent(GlobalDataManager);
        }
        return this.instance;
    }
    
    // 保存玩家数据
    public setPlayerDatas(datas: PlayerData[]): void {
        this.playerDatas = datas;
    }
    
    // 获取玩家数据
    public getPlayerDatas(): PlayerData[] {
        return this.playerDatas;
    }
    
    // 清空玩家数据（可选）
    public clearPlayerDatas(): void {
        this.playerDatas = [];
    }
}