
function Terrain(height, canv, ctx) {
	this.height = height;

	this.canv = canv;
	this.ctx = ctx;
	this.color = "beige";

	// start and end at height, create variation in between.
	// We also include the bottom corners of the canvas.
	this.coords = [];
	for(var i=0; i<=10; i++) {
		this.coords.push([i*this.canv.width/10, // 10 parts
											2*(this.height + Math.random()*this.height)]);
	}
	this.coords.push([this.canv.width,0], [0,0]);
}


Terrain.prototype.draw = function() {
	this.ctx.fillStyle = this.color;
	this.ctx.beginPath();
	this.ctx.moveTo(0,this.canv.height);
	for(var i in this.coords) {
		var p = this.coords[i];
		ctx.lineTo(p[0], this.canv.height-p[1]);
	}
	ctx.closePath();
	ctx.fill();  
}

Terrain.prototype.collideShip = function(ship) {
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

// getLandingSpot returns a random point on a random segment, suitable to
// then place a landing pad.
Terrain.prototype.getLandingSpot = function() {
	// We want to ignore the segments running along the sides and bottom. This
	// needs a -2 (see constructor). We also need to leave one final point to
	// create the segment, so another -1.
	var segNum = Math.floor(Math.random() * (this.coords.length-3));

	// Make a line, and extract the vector along it, scaling it by [0,1]
	var line = [this.coords[segNum], this.coords[segNum+1]];
	var vect = vectorScale(vectorSub(line[1], line[0]), Math.random());

	// Return the point along line if you add vect to the start point.
	return [line[0][0] + vect[0], line[0][1] + vect[1]]
}
