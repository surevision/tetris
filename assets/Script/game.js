var CellT = require("./cells/cell_t.js");
var CellI = require("./cells/cell_i.js");
var CellL = require("./cells/cell_l.js");
var CellJ = require("./cells/cell_j.js");
var CellS = require("./cells/cell_s.js");
var CellZ = require("./cells/cell_z.js");
var CellO = require("./cells/cell_o.js");

var RECT_WIDTH = 32;
var RECT_HEIGHT = 32;

var Phases = require("./common.js").Phases;
cc.Class({
    extends: cc.Component,

    properties: {
        graphicsNode: {
            type: cc.Node,
            default: null
        },
        nextGraphicsNode: {
            type: cc.Node,
            default: null
        },
        startBtn: {
            type: cc.Button,
            default: null
        },
        pauseLabel: {
            type: cc.Label,
            default: null
        },
        scoreLabel: {
            type: cc.Label,
            default: null
        },
        lineLabel: {
            type: cc.Label,
            default: null,
        },
        levelLabel: {
            type: cc.Label,
            default: null
        }
    },

    // use this for initialization
    onLoad: function () {
        this.phase = Phases.PRE_START;
        this.width = this.graphicsNode.width / RECT_WIDTH;
        this.height = this.graphicsNode.height / RECT_HEIGHT;
        this.graphics = this.graphicsNode.getComponent(cc.Graphics);
        this.nextGraphics = this.nextGraphicsNode.getComponent(cc.Graphics);
        this.clear();
        this.initCell();
        this.startBtn.node.on("click", this.onClickStart, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },

    clear: function() {
        this.score = 0;
        this.line = 0;
        this.level = 1;
        this.frameCount = 0;
        this.data = new Uint8Array(this.width * this.height);
        this.fastFall = false;
        this.inEffect = 0;  // >0 在播放特效中
        this.keyCode = cc.KEY.none;
    },
    
    initCell: function() {
        this.nextCell = this.generateNextCell();
    },

    onClickStart: function() {
        this.startGame();
    },

    onKeyDown: function(event) {
        var keyCode = event.keyCode;
        cc.log(keyCode);
        if (this.phase == Phases.START && keyCode != cc.KEY.p) {
            this.keyCode = keyCode;
        } else {
            this.keyCode = cc.KEY.none;
        }
        if (this.phase == Phases.START && keyCode == cc.KEY.p) {
            this.pause();
        }
        if (this.phase == Phases.PAUSE && keyCode == cc.KEY.r) {
            this.resume();
        }
    },

    getDataAtXY: function(x, y) {
        var pos = y * this.width + x;
        if (pos < 0 || pos > this.data.length - 1) {
            return 0;
        }
        return this.data[pos];
    },

    setDataAtXY: function(x, y, val) {
        val = val || 0;
        var pos = y * this.width + x;
        if (pos < 0 || pos > this.data.length - 1) {
            return
        }
        this.data[pos] = val;
    },

    generateNextCell: function(type) {
        var types = [CellI, CellO, CellT, CellL, CellJ, CellS, CellZ];
        type = type || types[Math.floor(Math.random() * types.length)];
        return new type();
    },

    generateCurrCell: function() {
        this.currentCell = cc.instantiate(this.nextCell);   // 拷贝
        // 左上角坐标系
        this.currentCell.x = Math.floor(this.width / 2 - this.currentCell.width() / 2);
        this.currentCell.y = 0;
        this.nextCell = this.generateNextCell();    // 生成下一个
    },

    startGame: function() {
        this.clear();
        this.phase = Phases.START;
        this.generateCurrCell();
        this.refreshNextCell();
        this.startBtn.node.active = false;
        this.pauseLabel.visible = true;
        cc.log("startGame");
    },

    pause: function() {
        this.phase = Phases.PAUSE;
        this.pauseLabel.string = "[R]esume";
    },

    resume: function() {
        this.phase = Phases.START;
        this.pauseLabel.string = "[P]ause";
    },

    gameover: function() {
        this.phase = Phases.GAME_OVER;
        this.startBtn.node.active = true;
        this.pauseLabel.visible = false;
    },

    
    /**
     * 检测碰撞
     * @return true 有碰撞 false 无碰撞
     */
    checkHit: function() {
        var x = this.currentCell.x;
        var y = this.currentCell.y;
        var i = 0;
        for (i = 0; i < this.currentCell.rects.length; i += 1) {
            var rect = this.currentCell.rects[i];
            var rx = rect.x + x;
            var ry = rect.y + y;
            if (rx < 0 || rx >= this.width) {
                // 撞墙
                return true;
            }
            if (ry >= this.height) {
                return true;   // 触底
            }
            if (this.getDataAtXY(rx, ry) > 0) {
                return true;   // 碰撞
            }
        }
        return false;
    },

    /**
     * 方块下落
     * @return true 有碰撞 false 无碰撞
     */
    fallCell: function() {
        var x = this.currentCell.x;
        var y = this.currentCell.y;
        var i = 0;
        // 下落
        y += 1;
        for (i = 0; i < this.currentCell.rects.length; i += 1) {
            var rect = this.currentCell.rects[i];
            var rx = rect.x + x;
            var ry = rect.y + y;
            if (ry >= this.height) {
                return true;   // 触底
            }
            if (this.getDataAtXY(rx, ry) > 0) {
                return true;   // 碰撞
            }
        }
        this.currentCell.y = y;
        return false;
    },

    /**
     * 检测gameover
     */
    checkGameover: function() {
        return this.currentCell.y == 0; // 经过一个fall以后依然在顶端
    },

    /**
     * 更新数据
     */
    refreshData: function() {
        var x = this.currentCell.x;
        var y = this.currentCell.y;
        for (var i = 0; i < this.currentCell.rects.length; i += 1) {
            var rect = this.currentCell.rects[i];
            var rx = rect.x + x;
            var ry = rect.y + y;
            this.setDataAtXY(rx, ry, 1);
        }
    },

    /**
     * 检查消除的行
     */
    checkClearLines: function() {
        var lines = [];
        for (var y = 0; y < this.data.length / this.width; y += 1) {
            var isFull = true;
            for (var x = 0; x < this.width; x += 1) {
                if (this.data[y * this.width + x] == 0) {
                    isFull = false;
                    break;
                }
            }
            if (isFull) {
                lines.push(y);
            }
        }
        if (lines.length > 0) {
            cc.log(lines);
        }
        this.line += lines.length;
        this.lineLabel.string = this.line;
        this.score += lines.length * lines.length;
        this.scoreLabel.string = this.score;
        return lines;
    },

    /**
     * 消除满行
     */
    clearLines: function(lines) {
        // 从后往前消除
        var cleared = 0;    // 记录消除的行数
        for (var i = 0; i < lines.length; i += 1) {
            // 数据后移
            for (var y = lines[i]; y >= 0; y -= 1) {
                for (var x = 0; x < this.width; x += 1) {
                    this.setDataAtXY(x, y, this.getDataAtXY(x, y - 1));
                }
            }
        }
    },
    /**
     * 向左移动
     */
    moveLeft: function() {
        this.currentCell.x -= 1;
        if (this.currentCell.x < 0) {
            this.currentCell.x = 0  // 撞墙
        } else if (this.checkHit()) {
            this.currentCell.x += 1;    // 恢复
        }
    },
    /**
     * 向右移动
     */
    moveRight: function() {
        this.currentCell.x += 1;
        if (this.currentCell.x + this.currentCell.width() > this.width - 1) {
            // 撞墙
            this.currentCell.x = this.width - this.currentCell.width() - 1;
        } else if (this.checkHit()) {
            // 恢复
            this.currentCell.x -= 1;
        }
    },
    rotateCell: function() {
        this.currentCell.rotateRight();
        if (this.checkHit()) {
            this.currentCell.rotateLeft();
        }
    },
    /**
     * 更新画面
     */
    refresh: function() {
        this.cleanGraphics();
        this.drawGrid();
        this.drawData();
        this.drawCurrCell();
    },

    /**
     * 清理画布
     */
    cleanGraphics: function() {
        this.graphics.clear();
        this.graphics.fillColor = cc.hexToColor('#FFFFFF');
        this.graphics.rect(0, 0, this.width * RECT_WIDTH, this.height * RECT_HEIGHT);
        this.graphics.fill();
    },

    /**
     * 绘制网格
     */
    drawGrid: function() {
        this.graphics.strokeColor = cc.hexToColor('#0000FF');
        for (var y = 0; y <= this.height; y += 1) {
            // 横线
            this.graphics.moveTo(0, y * RECT_HEIGHT);
            this.graphics.lineTo(this.width * RECT_WIDTH, y * RECT_HEIGHT);
            this.graphics.stroke();
        }
        for (var x = 0; x <= this.width; x += 1) {
            // 竖线
            this.graphics.moveTo(x * RECT_WIDTH, 0 * RECT_HEIGHT);
            this.graphics.lineTo(x * RECT_WIDTH, this.height * RECT_HEIGHT);
            this.graphics.stroke();
        }
    },

    /**
     * 绘制方格
     */
    drawData: function() {
        this.graphics.fillColor = cc.hexToColor('#666666');
        for (var y = 0; y < this.height; y += 1) {
            for (var x = 0; x < this.width; x += 1) {
                var _x = x * RECT_WIDTH;
                var _y = (this.height - y - 1) * RECT_HEIGHT;
                if (this.getDataAtXY(x, y) > 0) {
                    this.graphics.rect(_x, _y, RECT_WIDTH, RECT_HEIGHT);
                    this.graphics.fill();
                }
            }
        }
    },

    /**
     * 绘制当前方块
     */
    drawCurrCell: function() {
        this.graphics.fillColor = cc.hexToColor('#660000');
        for (var i = 0; i < this.currentCell.rects.length; i += 1) {
            var rect = this.currentCell.rects[i];
            var x = (rect.x + this.currentCell.x) * RECT_WIDTH;
            var y = (this.height - (rect.y + this.currentCell.y) - 1) * RECT_HEIGHT;
            this.graphics.rect(x, y, RECT_WIDTH, RECT_HEIGHT);
            this.graphics.fill();
        }
    },

    /**
     * 绘制预览方块
     */
    refreshNextCell: function() {
        this.nextGraphics.clear();
        this.nextGraphics.fillColor = cc.hexToColor('#FFFFFF');
        this.nextGraphics.rect(0, 0, 4 * RECT_WIDTH, 4 * RECT_HEIGHT);
        this.nextGraphics.fill();
        this.nextGraphics.fillColor = cc.hexToColor('#666600');
        for (var i = 0; i < this.nextCell.rects.length; i += 1) {
            var rect = this.nextCell.rects[i];
            var x = (this.nextGraphicsNode.width - this.nextCell.width() * RECT_WIDTH) / 2;
            var y = (this.nextGraphicsNode.height - this.nextCell.height() * RECT_HEIGHT) / 2;
            x += rect.x * RECT_WIDTH - RECT_WIDTH / 2;
            y += rect.y * RECT_HEIGHT + RECT_HEIGHT / 2;
            y = this.nextGraphicsNode.height - y;
            this.nextGraphics.rect(x, y, RECT_WIDTH, RECT_HEIGHT);
            this.nextGraphics.fill();
        }
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        this.frameCount += 1;
        this.updateKey();
        this.updateLogic(dt);
    },
    updateKey: function() {
        if (this.keyCode == cc.KEY.left) {
            // ←
            this.moveLeft();
        } else if (this.keyCode == cc.KEY.right) {
            // →
            this.moveRight();
        } else if (this.keyCode == cc.KEY.up) {
            this.rotateCell();
        } else if (this.keyCode == cc.KEY.down) {
            this.fastFall = true;
        }
        this.keyCode = cc.KEY.none;
    },
    updateLogic: function(dt) {
        if (this.inEffect > 0) {
            return;
        }
        if (this.phase == Phases.START) {
            // 游戏中
            var fallSpeed = 20 + 5 * (10 - this.level);
            if (this.fastFall) {
                fallSpeed = 5;
            }
            if (this.frameCount % fallSpeed == 0) {
                cc.log("updateLogic");
                if (this.fallCell()) {    // 方块下落1格
                    if (!this.checkGameover()) {    // 检测gameover
                        // 落地
                        this.fastFall = false;
                        this.refreshData(); // 更新数据
                        var lines = this.checkClearLines(); // 检测消除
                        this.clearLines(lines); // 消除行
                        this.generateCurrCell();
                        this.refreshNextCell();    
                    } else {
                        // gameover
                        this.gameover();
                    }
                }
            }
            this.refresh(); // 渲染
        } else if (this.phase == Phases.PAUSE) {
        } else if (this.phase == Phases.GAME_OVER) {
        } else if (this.phase == Phases.PRE_START) {
        }
    }
});
