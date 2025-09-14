import { _decorator, Component, instantiate, math, Node, Prefab, sp, Sprite, SpriteFrame, UITransform, Vec3, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScrollingBackground')
export class ScrollingBackground extends Component {

    // 添加赛道背景属性面板
    @property(Node)     // bg00是起始与终点背景
    bg00: Node = null;
    @property(Node)     // bg01-bg04是循环滚动背景
    bg01: Node = null;
    @property(Node)
    bg02: Node = null;
    @property(Node)
    bg03: Node = null;
    @property(Node)
    bg04: Node = null;
    @property(Node)
    bg05: Node = null;

    // 添加周围景色节点
    @property({ type: Prefab, tooltip: "周围景物生成器" })
    sceneryPrefab: Prefab = null;
    @property([SpriteFrame])
    scenerySprites: SpriteFrame[] = []; // 拖入所有树木、房子的图片
    private leftSceneryNodes: Node[] = []; // 用于管理所有激活的左侧景物
    private rightSceneryNodes: Node[] = []; // 用于管理所有激活的右侧景物

    @property({ tooltip: "每侧预先生成的景物数量" })
    // 每侧始终保持10个景物，赛道最多容纳9个，多1个是为了第一个景物消失时上面不会有空缺
    sceneryCountPerSide: number = 10; 
    @property({ tooltip: "景物之间的固定垂直间距" })
    splitSceneryPosY: number = 100; // 景物的距离间隔

    @property({ type: Number, tooltip: "周围景色的起始生成Y坐标，从赛道底端生成为0" })
    startSpawnSceneryPosY: number = 50; // 生成周围景色的Y坐标

    // 不再需要 @property，因为它将由父节点控制
    // 但它仍然是一个 public 变量，外部可以访问和修改
    public bgSpeed: number = 100;

    // 背景高度
    private bgHeight: number = 0;
    // 修正背景拼接图Y坐标位置
    private fixCanvasBottomY: number = -450;

    start() {
        // 记录初始位置
        this.bgHeight = this.bg01.getComponent(UITransform).height; // 获取1个背景高度，因为两个背景是相同的

        /* 设置了赛道父节点的Y坐标，所以可以注释掉
        // const visibleHeight = view.getVisibleSize().height;         // 获取可视区域高度，即画布画板
        // this.canvasBottomY = -visibleHeight / 2; // 计算画布底部的Y坐标
        */

        // 设置初始位置,防止摆放错误
        this.bg05.setPosition(0, this.fixCanvasBottomY + this.bgHeight/2);
        this.bg00.setPosition(0, this.fixCanvasBottomY + this.bgHeight + this.bgHeight/2);
        this.bg01.setPosition(0, this.fixCanvasBottomY + this.bgHeight*2 + this.bgHeight/2);
        this.bg02.setPosition(0, this.fixCanvasBottomY + this.bgHeight*3 + this.bgHeight/2);
        this.bg03.setPosition(0, this.fixCanvasBottomY + this.bgHeight*4 + this.bgHeight/2);
        this.bg04.setPosition(0, this.fixCanvasBottomY + this.bgHeight*5 + this.bgHeight/2);

        // 初始化周围景色
        this.initializeScenery();

    }

    update(deltaTime: number) {

        let position0 = this.bg00.position;
        let position1 = this.bg01.position;
        let position2 = this.bg02.position;
        let position3 = this.bg03.position;
        let position4 = this.bg04.position;
        let position5 = this.bg05.position;

        // 计算背景移动距离
        let distance = this.bgSpeed * deltaTime;
        this.bg00.setPosition(position0.x, position0.y - distance);
        this.bg01.setPosition(position1.x, position1.y - distance);
        this.bg02.setPosition(position2.x, position2.y - distance);
        this.bg03.setPosition(position3.x, position3.y - distance);
        this.bg04.setPosition(position4.x, position4.y - distance);
        this.bg05.setPosition(position5.x, position5.y - distance);

        // this.sceneryPrefab.setPosition(this.sceneryPrefab.position.x, this.sceneryPrefab.position.y - distance);

        // 不用上面的position是因为会有一帧的差值
        let p0 = this.bg00.position;
        let p1 = this.bg01.position;
        let p2 = this.bg02.position;
        let p3 = this.bg03.position;
        let p4 = this.bg04.position;
        
        // 如果背景移动出屏幕，则跳到下一个循环的位置
        if (p1.y + this.bgHeight/2 < this.fixCanvasBottomY) {
            this.bg01.setPosition(p1.x, p1.y + this.bgHeight*4);
        }
        if (p2.y + this.bgHeight/2 < this.fixCanvasBottomY) {
            this.bg02.setPosition(p2.x, p2.y + this.bgHeight*4);
        }
        if (p3.y + this.bgHeight/2 < this.fixCanvasBottomY) {
            this.bg03.setPosition(p3.x, p3.y + this.bgHeight*4);
        }
        if (p4.y + this.bgHeight/2 < this.fixCanvasBottomY) {
            this.bg04.setPosition(p4.x, p4.y + this.bgHeight*4);
        }

        // if (this.sceneryPrefab.position.y + 100 < this.fixCanvasBottomY) {
        //     this.spawnScenery();
        // }
        const teleportDistance = this.splitSceneryPosY + this.node.getComponent(UITransform).height;
        this.updateScenerySide(this.leftSceneryNodes, distance, teleportDistance);
        this.updateScenerySide(this.rightSceneryNodes, distance, teleportDistance);


    }

    // 在游戏开始时，预先生成所有景物
    initializeScenery() {
        if (!this.sceneryPrefab || this.scenerySprites.length === 0) return;

        for (let i = 0; i < this.sceneryCountPerSide; i++) {
            // 创建左侧景物
            const leftNode = instantiate(this.sceneryPrefab);
            this.node.addChild(leftNode);
            this.leftSceneryNodes.push(leftNode);
            // 将其放置在初始位置
            this.setupSceneryNode(leftNode, i * this.splitSceneryPosY, true);

            // 创建右侧景物
            const rightNode = instantiate(this.sceneryPrefab);
            this.node.addChild(rightNode);
            this.rightSceneryNodes.push(rightNode);
            // 将其放置在初始位置
            this.setupSceneryNode(rightNode, i * this.splitSceneryPosY, false);
        }
    }

    // 设置周围景色（随机）
    setupSceneryNode(sceneNode: Node, setPositionY: number, isLeft: boolean) {
        // 先随机替换景色
        this.randomScenery(sceneNode)

        const currentScale_X = sceneNode.scale.x;
        const currentScale_Y = sceneNode.scale.y;
        // 计算节点的半宽高（考虑缩放）
        const sceneHalfWidth = sceneNode.getComponent(UITransform).width / 2 * currentScale_X;
        const sceneHalfHeight = sceneNode.getComponent(UITransform).height / 2 * currentScale_Y;

        // 设置坐标
        const xPos = isLeft ? -150 - sceneHalfWidth : 150 + sceneHalfWidth;
        const yPos = this.fixCanvasBottomY + this.startSpawnSceneryPosY + setPositionY;
        sceneNode.setPosition(xPos, yPos);
    }
    randomScenery(node: Node) {
        // 随机选择一个图片
        const randomIndex = math.randomRangeInt(0, this.scenerySprites.length);
        const randomSprite = this.scenerySprites[randomIndex];
        // 设置节点的 Sprite 组件为随机选择的图片
        node.getComponent(Sprite).spriteFrame = randomSprite;
    }


    // 更新景物逻辑
    updateScenerySide(nodes: Node[], distance: number, teleportDistance: number) {
        for (const node of nodes) {
            node.translate(new Vec3(0, -distance, 0));

            if (node.position.y + this.splitSceneryPosY/2 < this.fixCanvasBottomY) {
                node.translate(new Vec3(0, teleportDistance, 0))
                this.randomScenery(node);
            }
        }
    }
}


