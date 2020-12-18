/**** Config ****/
// Screen dimensions
var width = 600;
var height = 400;

// General game state
var terrain_height = 20;
var starting_fuel = 100;
var crash_speed = 0.8;
var cheat = false;
var debug = false;

// Physics
var gravity = -0.01;
var drag_coefficient = 0.99;
var thrust_strength = 0.2;
var turn_strength = 0.05; // radians 

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
	var altitude = (ship.y - r - ground.height).toFixed(2);
	ctx.fillText("Altitude: " + altitude, 10, 16);

	// Fuel
	ctx.fillStyle = (ship.fuel <= 0) ? "red" : "white";
	ctx.fillText("Fuel: " + ship.fuel.toFixed(2), canv.width - 85, 16);

	// Speed indicator, in red when crashing is possible
	speed = Math.sqrt(ship.vx**2 + ship.vy**2);
	ctx.fillStyle = (speed > crash_speed && ship.vy < 0) ? "red" : "white";
	ctx.fillText("Speed: " + speed.toFixed(2), 10, 16+16); //+16 from 16px altitude text above
}

/**** Init ****/
// Canvas setup
var canv = bpMakeCanvas(width, height);
var ctx = canv.getContext("2d");

// Objects
var ship = new Ship(Math.random()*canv.width, canv.height/2 + Math.random()*canv.height/2, 0.5*Math.PI, starting_fuel, canv.getContext("2d"));
var ground = new Terrain(terrain_height, canv, canv.getContext("2d"));
var landing = new Landing(ground.getLandingSpot(), canv, canv.getContext("2d"));
var lastCollision = [[0,0],[0,0]];

// Extra handler for pause via "Space"
window.addEventListener("keydown", function(e) {
	if(log_keys) console.log("down " + e.code);

	switch(e.code) {
		case "Space":
			if(!run) window.requestAnimationFrame(loop);
			run = !run;
			break;

		case "KeyG":
			cheat = !cheat;
			break;

		case "KeyD":
			debug = !debug;
			break;
	}
});

function loop() {
	/**** Physics updates ****/
	// Change the angle based on left/right arrow keys
	if(ksleft)  ship.applyTurn(turn_strength);
	if(ksright) ship.applyTurn(-turn_strength);
	if(ksup) ship.applyThrust(thrust_strength);

	ship.runPhysics(drag_coefficient, 0, gravity);

	// Collisions
	var need_drawLose = false;
	var [collisionLanding, vLanding] = landing.collideShip(ship)
	var [collisionGround, vGround] = ground.collideShip(ship)

	if(collisionLanding) ship.applyCollision(vLanding);
	if(collisionGround) ship.applyCollision(vGround);

	if(collisionGround || collisionLanding) {
		if(!cheat && speed > crash_speed) {
			run = false;
			need_drawLose = true;
		}
	}

	/**** Drawing ****/
	// Clear the canvas
	bpClearCanvas();

	drawUI();
	landing.draw();
	ground.draw();
	ship.draw();
	if(need_drawLose) drawLose();
	if(debug) bpDrawCollisionLine(lastCollision);
}

bpStartGameLoop(loop);
