var CellT = require("./cells/cell_t.js");


var Phases = require("./common.js").Phases;
cc.Class({
    extends: cc.Component,

    RECT_WIDTH: 32,
    RECT_HEIGHT: 32,

    properties: {
        graphics: {
            type: cc.Graphics,
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
        this.clear();
        this.initCell();
    },

    clear: function() {
        this.score = 0;
        this.line = 0;
        this.level = 1;
        this.frameCount = 0;
    },
    initCell: function() {
        var t = new CellT();
        cc.log(t);
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        this.frameCount += 1;
        this.updateLogic(dt);
    },
    updateLogic: function(dt) {
    }
});
