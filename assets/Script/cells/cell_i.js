var CellBase = require("./cell_base.js");
var CellI = cc.Class({
	extends: CellBase,
	initRects: function() {
		// 方块 |
		this.rects.push(cc.v2(1, 0));
		this.rects.push(cc.v2(1, 1));
		this.rects.push(cc.v2(1, 2));
		this.rects.push(cc.v2(1, 3));
	},
	initRotates: function() {
		// 旋转
		this.rotates.push([
			cc.v2(1, 0),
			cc.v2(1, 1),
			cc.v2(1, 2),
			cc.v2(1, 3)
		]); // |
		this.rotates.push([
			cc.v2(0, 1),
			cc.v2(1, 1),
			cc.v2(2, 1),
			cc.v2(3, 1)
		]); // -
	}

});