var canv = document.createElement("canvas");
canv.width=500;
canv.height=700;
canv.style.backgroundColor = "black";
window.addEventListener("load", function() {
	document.body.append(canv)
});

var ctx = canv.getContext("2d");

/**
ctx.fillstyle = "red";
ctx.fillRect(100, 100, 30, 30);
**/

var run = true;
var log_keys = false;
var drag_coefficient = 0.99;
var thrust_strength = 0.2;
var gravity = 0.05;

var x = 100;
var y = 100;

var x_d = 0;
var y_d = 0;

var up_thrust = false;
var right_thrust = false;
var left_thrust = false;

window.addEventListener("keydown", function(e) {
	if(log_keys) console.log("down " + e.code);
	switch(e.code) {
		case "ArrowRight":
			right_thrust = true;
			break;
		case "ArrowLeft":
			left_thrust = true;
			break;
		case "ArrowUp":
			up_thrust = true;
			break;
		case "ArrowDown":
			break;
		case "Space":
			if(!run) window.requestAnimationFrame(loop);
			run = !run;
	}
});

window.addEventListener("keyup", function(e) {
	if(log_keys) console.log("up " + e.code);

	switch(e.code) {
		case "ArrowRight":
			right_thrust = false;
			break;
		case "ArrowLeft":
			left_thrust = false;
			break;
		case "ArrowUp":
			up_thrust = false;
			break;
		case "ArrowDown":
			break;
	}});


function loop() {
	ctx.clearRect(0,0,canv.width,canv.height);

	if(up_thrust)    y_d += -thrust_strength;
	                 y_d += +gravity; // gravity
	if(right_thrust) x_d += +thrust_strength;
	if(left_thrust)  x_d += -thrust_strength;

	x+=x_d;
	x_d*=drag_coefficient;
	x = x % canv.width;
	if(x<0) x+=canv.width;

	if(y>=canv.height) y_d*=-1;
	y+=y_d;
	y_d*=drag_coefficient;
	//y = y % canv.height;
	//if(y<0) y+=canv.height;

	ctx.fillStyle = "red"
	ctx.fillRect(x,y,30,30);

	if(run) {
		window.requestAnimationFrame(loop);
	}
}

window.requestAnimationFrame(loop);
