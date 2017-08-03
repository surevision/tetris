var CellBase = require("./cell_base.js");
var CellZ = cc.Class({
	extends: CellBase,
	initRects: function() {
		// 方块 -_
		this.rects.push(cc.v2(0, 1));
		this.rects.push(cc.v2(1, 1));
		this.rects.push(cc.v2(1, 2));
		this.rects.push(cc.v2(2, 2));
	},
	initRotates: function() {
		// 旋转
		this.rotates.push([
			cc.v2(0, 1),
			cc.v2(1, 1),
			cc.v2(1, 2),
			cc.v2(2, 2)
		]);	// -_
		this.rotates.push([
			cc.v2(1, 0),
			cc.v2(1, 1),
			cc.v2(0, 1),
			cc.v2(0, 2)
		]);	// .`
	}

})