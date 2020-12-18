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
var meteor_spawn_interval = 2500; // in ms
var win_speed = 0.1;

function drawLose() {
	var ctx = canv.getContext("2d");
	ctx.fillStyle = "red";
	ctx.font = '16px serif';
	ctx.fillText("Crash!\r\nSuper Sad Spaceship :(", canv.width/4, canv.height/2);
}

function drawWin() {
	var ctx = canv.getContext("2d");
	ctx.fillStyle = "blue";
	ctx.font = '16px serif';
	ctx.fillText("Yay! The universe is saved!", canv.width/4, canv.height/2);
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
var meteors = [];
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
	var need_drawLose = false;
	var need_drawWin = false;
	var time = new Date().getTime();
	var needMeteors = time % meteor_spawn_interval; // every so many ms
	if(-50 < needMeteors && needMeteors < 50) {
		meteors.push(Meteor.getRandomMeteor());
	}
	if (meteors.length > 20) {
		for(var i in meteors) {
			var m = meteors[i];
			if (m.x < 0 || m.x > width || m.y < 0 || m.y > height) {
				meteors.splice(i, 1);
			}
		}
	}

	/**** Physics updates ****/
	// Change the angle based on left/right arrow keys
	if(ksleft)  ship.applyTurn(turn_strength);
	if(ksright) ship.applyTurn(-turn_strength);
	if(ksup) ship.applyThrust(thrust_strength);



	// Collisions

	// Meteor collisions
	for(var i in meteors) {
		var m = meteors[i];
		// ground
		var [collisionLanding, vLanding] = landing.collideShip(m);
	  var [collisionGround, vGround] = ground.collideShip(m);
	  if(collisionLanding) m.applyCollision(vLanding);
	  if(collisionGround) m.applyCollision(vGround);

		// with the ship
		var [collisionShip, vShip] = collideCircleCircle(m.getCenter(), m.r, ship.getCenter(), ship.r);
	 	if(collisionShip) { 
	 		m.applyCollision(vShip);
	 		ship.applyCollision(vectorScale(vShip, -1));
			if(!cheat) {
				run = false;
				need_drawLose = true;
			}
		}
		

		// each other
		for(var j=0; j<i; j++) {
			var o = meteors[j];
			var [collisionMeteor, vMeteor] = collideCircleCircle(m.getCenter(), m.r, o.getCenter(), o.r);
	  	if(collisionMeteor) {
	  		m.applyCollision(vMeteor);
	 			o.applyCollision(vectorScale(vMeteor, -1));
			}
		}
	}

	// Ground & Landing collisions
	var [collisionLanding, vLanding] = landing.collideShip(ship)
	var [collisionGround, vGround] = ground.collideShip(ship)

	if(collisionLanding) ship.applyCollision(vLanding);
	if(collisionGround) ship.applyCollision(vGround);

	var speed = ship.getSpeed();
	if(collisionLanding) {
		if(speed < win_speed) { 
			run = false;
			need_drawWin = true;
		}
	}

	if(collisionGround || collisionLanding) {
		if(!cheat && speed > crash_speed) {
			run = false;
			need_drawLose = true;
		}
	}

	for(var i in meteors) {
		meteors[i].runPhysics(drag_coefficient, 0, gravity);
	}
	ship.runPhysics(drag_coefficient, 0, gravity);

	/**** Drawing ****/
	// Clear the canvas
	bpClearCanvas();

	landing.draw();
	ground.draw();
	for(var i in meteors) {
		meteors[i].draw();
	}
	ship.draw();
	drawUI();
	if(need_drawWin) drawWin();
	if(need_drawLose) drawLose();
	if(debug) bpDrawCollisionLine(lastCollision);
}

bpStartGameLoop(loop);
