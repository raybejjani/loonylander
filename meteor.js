var rm = 15;
var meteor_bounce = 1.0;

function Meteor(x, y, vx, vy) {
	// FIXME: non r radii are unstable on the ground, eventually exploding
	// away.
	this.r = r; //0.5*rm + 0.8*Math.random()*rm;

	this.x = x;
	this.y = y;
	
	this.vx =  vx;
	this.vy =  vy;

	this.bounce = meteor_bounce;

	this.ctx = ctx;
	this.color = 'rosybrown';
}

Meteor.prototype.getCenter = Ship.prototype.getCenter;
Meteor.prototype.applyCollision = Ship.prototype.applyCollision;
Meteor.prototype.runPhysics = Ship.prototype.runPhysics;

Meteor.prototype.draw = function() {
	bpDrawCircle(this.x, this.y, this.r, this.color);
};


Meteor.getRandomMeteor = function() {
	var m = new Meteor(1.1*width, 0.5*height + 0.5*Math.random()*height,
											-20*(Math.random() - 0.5), -Math.random());
  return m;
}
