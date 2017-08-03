var CellBase = cc.Class({
	ctor: function() {
		this.rects = [];	// 方块
		this.rotates = []; 	// 旋转坐标
		this.rotateIndex = -1;	// 旋转索引
		this.initRects();
		this.initRotates();
		this.rotateRight();
	},
	initRects: function(){},
	initRotates: function(){},
	/**
	 * 根据旋转情况设置方块坐标
	 */
	applyRotate: function() {
		for (var i = 0; i < this.rects.length; i += 1) {
			this.rects[i].x = this.rotates[this.rotateIndex][i].x;
			this.rects[i].y = this.rotates[this.rotateIndex][i].y;
		}
	},
	/**
	 * 向右旋转
	 */
	rotateRight: function() {
		this.rotateIndex += 1;
		this.rotateIndex %= this.rotates.length;
		this.applyRotate();
	},
	/**
	 * 向左旋转
	 */
	rotateRight: function() {
		this.rotateIndex -= 1;
		this.rotateIndex += this.rotates.length;
		this.rotateIndex %= this.rotates.length;
		this.applyRotate();
	},
});