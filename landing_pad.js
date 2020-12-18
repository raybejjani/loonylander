
var pad_width = 40;
var pad_y_offset = 40; // how high the top of the pad will be relative to p

function Landing(p, canv, ctx) {
	this.x = p[0];
	this.y = p[1]+20;

	this.ctx = ctx
	this.canv = canv;
	this.color = "dimgrey";

	this.coords = [	[this.x-pad_width/2, this.y],
									[this.x+pad_width/2, this.y],
									[this.x+pad_width/4, this.y-pad_y_offset],
									[this.x-pad_width/4, this.y-pad_y_offset],
									// repeat the first point to allow collisions on the last segment
									[this.x-pad_width/2, this.y],
								];
}


Landing.prototype.draw = function() {
	this.ctx.fillStyle = this.color;
	this.ctx.strokeStyle = this.color;
	this.ctx.lineWidth = 4;
	this.ctx.beginPath();
	for(var i in this.coords) {
		var p = this.coords[i];
		ctx.lineTo(p[0], this.canv.height-p[1]);
	}
	ctx.fill();  
}

Landing.prototype.collideShip = function(ship) {
	for(var i=0; i < this.coords.length-1; i++) {
		var line = [this.coords[i], this.coords[i+1]];
		var [collided, v] = collideLineCircle(line, ship.getCenter(), ship.r);
		if(collided) {
	    lastCollision = [this.coords[i], this.coords[i+1]];
			return [collided, v];
		}
	}
	return [false, undefined];
};
