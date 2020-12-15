/**** Config ****/
// Screen dimensions
var width = 600;
var height = 400;

// General game state
var terrain_height = 20;
var starting_fuel = 100;
var crash_speed = 0.8;

// Physics
var gravity = -0.01;
var drag_coefficient = 0.99;
var thrust_strength = 0.2;
var turn_strength = 0.05; // radians 

// Ship properties
var r = 10;  // radius of ship's big main circle
var rs = 4;  // radius of ship's front small circle
var ds = 15; // distance between the circles
var fuel = starting_fuel;

// Ship state
var x = 200; // ship x coordinate
var y = 100; // ship y coordinate
var a = 0.5*Math.PI;   // ship angle

var dx = 0; // ship x speed
var dy = 0; // ship y speed
var da = 0;   // ship anglular velocity


function drawShip(x, y, a) {
	// Draw the big circle
	bpDrawCircle(x, y, r, "red");

	// Draw the small circle, offset by the ship's angle
	var xs = x + ds*Math.cos(a)
	var ys = y + ds*Math.sin(a)
	bpDrawCircle(xs, ys, rs, "red");
}


function drawTerrain(y) {
	var ctx = canv.getContext("2d");
	ctx.fillStyle = "beige";
  ctx.fillRect(0, canv.height-y, canv.width, y);
}

function drawLose() {
	var ctx = canv.getContext("2d");
	ctx.fillStyle = "red";
	ctx.font = '16px serif';
	ctx.fillText("Crash!\r\nSuper Sad Spaceship :(", canv.width/4, canv.height/2);
}

function drawUI() {
	var ctx = canv.getContext("2d");
	ctx.fillStyle = "white";
	ctx.font = '16px serif';

	// Altitude from the bottom of the big circle to the ground
	var altitude = (y - r - terrain_height).toFixed(2);
	ctx.fillText("Altitude: " + altitude, 10, 16);

	// Fuel
	ctx.fillStyle = (fuel <= 0) ? "red" : "white";
	ctx.fillText("Fuel: " + fuel.toFixed(2), canv.width - 85, 16);

	// Speed indicator, in red when crashing is possible
	speed = Math.sqrt(dx**2 + dy**2);
	ctx.fillStyle = (speed > crash_speed && dy < 0) ? "red" : "white";
	ctx.fillText("Speed: " + speed.toFixed(2), 10, 16+16); //+16 from 16px altitude text above
}

/**** Init ****/
// Canvas setup
var canv = bpMakeCanvas(width, height);
var ctx = canv.getContext("2d");

// Extra handler for pause via "Space"
window.addEventListener("keydown", function(e) {
	if(log_keys) console.log("down " + e.code);

	switch(e.code) {
		case "Space":
			if(!run) window.requestAnimationFrame(loop);
			run = !run;
	}
});

function loop() {
	/**** Physics updates ****/
	// Change the angle based on left/right arrow keys
	if(ksleft)  a+= turn_strength;
	if(ksright) a-= turn_strength;

	// Move the ship forward, based on it's angle
	if(ksup && fuel > 0)
	{
		dx+= thrust_strength*Math.cos(a);
		dy+= thrust_strength*Math.sin(a);
		fuel-= 1;
	}
	dx*= drag_coefficient;
	dy*= drag_coefficient;
	dy+= gravity; // gravity

	x+= dx;
	y+= dy;

  // Ground collision
  var need_drawLose = false;
	if(y-r <= terrain_height){
		speed = Math.sqrt(dx**2 + dy**2);
		if(speed > crash_speed) {
			run = false;
			need_drawLose = true;
		} else {
			y = r + terrain_height; 
			dy = 0;
		}
	}

	/**** Drawing ****/
	// Clear the canvas
	bpClearCanvas();

	drawUI();
	drawShip(x, y, a);
	drawTerrain(terrain_height);
	if(need_drawLose) drawLose();
}

bpStartGameLoop(loop);
