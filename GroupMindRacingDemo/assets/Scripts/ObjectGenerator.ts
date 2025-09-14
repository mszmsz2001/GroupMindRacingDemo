import { _decorator, Component, Node, Prefab, SpriteFrame, NodePool, instantiate, view, math, Vec3, UITransform } from 'cc';
import { RacingController } from './RacingController';
// import { SceneryObject } from './SceneryObject';
const { ccclass, property } = _decorator;

@ccclass('ObjectGenerator')
export class ObjectGenerator extends Component {

    @property(Prefab)
    sceneryPrefab: Prefab = null;
    @property([SpriteFrame])
    scenerySprites: SpriteFrame[] = [];
    @property(RacingController)
    racingController: RacingController = null;
    @property(Node)
    trackNode: Node = null; // 把赛道Mask节点拖进来

    // --- 新增：用于尺寸归一化和防重叠的属性 ---
    @property({ tooltip: "所有景物在游戏中的目标显示高度" })
    targetSceneryHeight: number = 250;

    @property({ tooltip: "景物之间的最小垂直间距，防止重叠" })
    minSpacingY: number = 50;
    // ------------------------------------------

    private objectPool: NodePool = new NodePool();
    private spawnTimer: number = 0;
    private spawnY: number = 0;
    private recycleY: number = 0;
    private trackHalfWidth: number = 0;
    
    // --- 新增：用于记录上一景物位置的变量 ---
    private lastSpawnY_Left: number = Infinity;
    private lastSpawnY_Right: number = Infinity;
    // -----------------------------------------

    start() {
        const visibleSize = view.getVisibleSize();
        this.spawnY = visibleSize.height / 2 + 200;
        this.recycleY = -visibleSize.height / 2 - 200;
        this.trackHalfWidth = this.trackNode.getComponent(UITransform).width / 2;
        // this.resetSpawnTimer();
        // ... 初始化对象池 ...
    }

    update(deltaTime: number) {
        if (!this.racingController || this.racingController.trackSpeed <= 0) return;
        
        // 随着赛道滚动，更新上一个Y坐标记录，为新生成做准备
        const distance = this.racingController.trackSpeed * deltaTime;
        this.lastSpawnY_Left -= distance;
        this.lastSpawnY_Right -= distance;
        
        this.spawnTimer -= deltaTime;
        if (this.spawnTimer <= 0) {
            this.trySpawnObject();
            // this.resetSpawnTimer();
        }
    }

    trySpawnObject() {
        // 随机决定这次是在左边还是右边生成
        const spawnOnLeft = math.random() < 0.5;
        const lastSpawnY = spawnOnLeft ? this.lastSpawnY_Left : this.lastSpawnY_Right;

        // --- 防重叠核心逻辑 ---
        // 检查当前生成点与上一个同侧景物的距离是否足够远
        const requiredSpacing = this.targetSceneryHeight + this.minSpacingY;
        if (this.spawnY - lastSpawnY < requiredSpacing) {
            // 距离太近，放弃本次生成，等待下一个时机
            return;
        }
        // ------------------------

        let objNode = this.objectPool.size() > 0 ? this.objectPool.get() : instantiate(this.sceneryPrefab);
        const randomSprite = this.scenerySprites[math.randomRangeInt(0, this.scenerySprites.length)];
        
        // --- 尺寸归一化逻辑 ---
        const originalHeight = randomSprite.height;
        if (originalHeight === 0) { this.objectPool.put(objNode); return; }
        const scale = this.targetSceneryHeight / originalHeight;
        objNode.setScale(scale, scale, 1);
        // -------------------------

        const displayHalfWidth = (randomSprite.width * scale) / 2;
        const padding = 20; // 景物与赛道边缘的间距
        const offset = this.trackHalfWidth + padding + displayHalfWidth;
        const xPos = spawnOnLeft ? -offset : offset;
        
        objNode.setParent(this.node);
        objNode.setPosition(xPos, this.spawnY);

        // 更新Y坐标记录
        if (spawnOnLeft) {
            this.lastSpawnY_Left = this.spawnY;
        } else {
            this.lastSpawnY_Right = this.spawnY;
        }
        
        // const sceneryScript = objNode.getComponent(SceneryObject);
        // sceneryScript.init(this, randomSprite, this.racingController.trackSpeed, this.recycleY);
    }
    
    // ... 其他方法 (recycleObject, resetSpawnTimer, 初始化对象池) ...
}