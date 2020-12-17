// Ship properties
var r = 10;  // radius of ship's big main circle
var rs = 4;  // radius of ship's front small circle
var ds = 15; // distance between the circles


function Ship(x, y, a, fuel, ctx) {
	this.fuel = fuel;

	this.x = x;
	this.y = y;
	this.a = a;
	
	this.vx =  0;
	this.vy =  0;
	            
	this.ctx = ctx;
	this.color = 'red';
}


Ship.prototype.draw = function() {
	// Draw the big circle
	bpDrawCircle(this.x, this.y, r, "red");

	// Draw the small circle, offset by the ship's angle
	var xs = this.x + ds*Math.cos(this.a)
	var ys = this.y + ds*Math.sin(this.a)
	bpDrawCircle(xs, ys, rs, "red");
};

// applyTurn updates the ships orientation by angle
Ship.prototype.applyTurn = function(angle) {
	ship.a+= angle;
};

// applyThrust moves updates the ship's velocity, based on it's angle, only if
// there is fuel.
Ship.prototype.applyThrust = function(thrust) {
	if(this.fuel > 0)
	{
		this.vx+= thrust*Math.cos(this.a);
		this.vy+= thrust*Math.sin(this.a);
		this.fuel-= 1;
	}
};

// runPhysics updates the position based on the current velocity after applying
// drag and any velocity forcing functions (e.g. gravity).
Ship.prototype.runPhysics = function(drag, dx, dy) {
	ship.vx*= drag;
	ship.vy*= drag;

	ship.vx+= dx;
	ship.vy+= dy;

	ship.x+= ship.vx;
	ship.y+= ship.vy;
};
