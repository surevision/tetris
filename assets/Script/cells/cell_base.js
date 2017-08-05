var CellBase = cc.Class({
	ctor: function() {
		this.rects = [];	// 方块
		this.rotates = []; 	// 旋转坐标
		this.rotateIndex = -1;	// 旋转索引
		this.x = 0;
		this.y = 0;
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
	/**
	 * 当前宽度
	 */
	width: function() {
		var w = 0;
		for (var i = 0; i < this.rects.length; i += 1) {
			if (w <= this.rects[i].x) {
				w = this.rects[i].x;
			}
		}
		return w;
	},
	/**
	 * 当前高度
	 */
	height: function() {
		var h = 0;
		for (var i = 0; i < this.rects.length; i += 1) {
			if (h <= this.rects[i].y) {
				h = this.rects[i].y;
			}
		}
		return h;
	}
});