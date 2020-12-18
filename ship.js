// Ship properties
var r = 10;  // radius of ship's big main circle
var rs = 4;  // radius of ship's front small circle
var ds = 15; // distance between the circles


function Ship(x, y, a, fuel, ctx) {
	this.fuel = fuel;

	this.r = r;
	this.rs = rs;

	this.x = x;
	this.y = y;
	this.a = a;
	
	this.vx =  0;
	this.vy =  0;
	            
	this.ctx = ctx;
	this.color = 'red';
}


Ship.prototype.getCenter = function() {
	return [this.x,this.y];
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
		if(!cheat) this.fuel-= 1;
	}
};


Ship.prototype.applyCollision = function(v) {
	// offset the ship by the overlap of the circle and the line.
	// This is the difference of r and |v| in the direction of v_unit
	var v_len = Math.sqrt(vectorDot(v,v));
	var v_unit = vectorScale(v, 1/v_len);
	var v_offset = vectorScale(v_unit, r - v_len);
	this.x += v_offset[0];
	this.y += v_offset[1];

	speed = Math.sqrt(this.vx**2 + this.vy**2);
	var v_speed =  vectorScale(v_unit, speed);

	// Bounce the ship along the normal vector, retaining 10% of the
	// velocity
	this.vx += 1.1*v_speed[0];
	this.vy += 1.1*v_speed[1];
}

// runPhysics updates the position based on the current velocity after applying
// drag and any velocity forcing functions (e.g. gravity).
Ship.prototype.runPhysics = function(drag, ddx, ddy) {
	this.vx*= drag;
	this.vy*= drag;

	this.vx+= ddx;
	this.vy+= ddy;

	this.x+= this.vx;
	this.y+= this.vy;
};
