/*

 - Boilerplate code for use in recreating Asteroids -



What this gives us:


bpMakeCanvas(width, height)
 Creates a canvas object for drawing, and puts it into the DOM

bpDrawCircle(x, y, radius, color)
 Draws a circle on the canvas

bpClearCanvas()
 Erases everything that's been drawn on the canvas

bpStartGameLoop(loopFunction)
 Calls the passed function ~60 times a second (or whatever monitor refresh rate is)

Variables representing the state of our arrow keys:
	ksup   
	ksdown 
	ksleft 
	ksright

*/



// Making these global, half for readability and half because I'm lazy.
//  This is bad practice obviously; don't do this in your own code!
var canv;
var ksup    = false;
var ksdown  = false;
var ksleft  = false;
var ksright = false;

// Toggle to print keystrokes
var log_keys = false;

// Pause
var run = true;

// Create canvas element for drawing
function bpMakeCanvas(width, height)
{
	canv = document.createElement("canvas");
	canv.width = width;
	canv.height = height;
	canv.style.background = "black";
	window.addEventListener("load", function()
	{
		document.body.append(canv);
	});

	return canv;
}


// Clears the canvas
function bpClearCanvas()
{
	var ctx = canv.getContext("2d");
	ctx.clearRect(0, 0, canv.width, canv.height);
}


// Draws a filled circle (adjusting y so it's bottom-up)
function bpDrawCircle(x, y, radius, color)
{
	var ctx = canv.getContext("2d");
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(x, canv.height-y, radius, 0, 2*Math.PI);
	ctx.fill();
}

function bpDrawCollisionLine(l1)
{
	var ctx = canv.getContext("2d");
	ctx.lineWidth = 4;
	ctx.strokeStyle = "lime";
	ctx.beginPath();
	ctx.moveTo(l1[0][0], canv.height-l1[0][1]);
	ctx.lineTo(l1[1][0], canv.height-l1[1][1]);
	ctx.closePath();
	ctx.stroke();
}

// Add Keyboard up/down event listeners, and have them modify our keystate variables
window.addEventListener("keydown",function(e)
{
	if(log_keys) console.log("down " + e.code);
	if(e.code == "ArrowUp")    ksup    = true;
	if(e.code == "ArrowDown")  ksdown  = true;
	if(e.code == "ArrowLeft")  ksleft  = true;
	if(e.code == "ArrowRight") ksright = true;
});
window.addEventListener("keyup",function(e)
{
	if(log_keys) console.log("up " + e.code);
	if(e.code == "ArrowUp")    ksup    = false;
	if(e.code == "ArrowDown")  ksdown  = false;
	if(e.code == "ArrowLeft")  ksleft  = false;
	if(e.code == "ArrowRight") ksright = false;
});


// Run game loop function at monitor's refresh rate
function bpStartGameLoop(loopFunction)
{
	// To have this run independently of users framerate, see this article and implement
	//  his technique:  https://www.gafferongames.com/post/fix_your_timestep/

	function repeat()
	{
		if (run) loopFunction();
		window.requestAnimationFrame(repeat);
	}
	window.requestAnimationFrame(repeat);
}


