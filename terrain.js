
function Terrain(height, canv, ctx) {
	this.height = height;

	this.canv = canv;
	this.ctx = ctx;
	this.color = "beige";
}

var dummy = new Terrain(0, undefined);


Terrain.prototype.draw = function() {
	this.ctx.fillStyle = this.color;
  this.ctx.fillRect(0, this.canv.height-this.height, this.canv.width, this.height);
}
