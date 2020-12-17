
function Terrain(height, canv, ctx) {
	this.height = height;

	this.canv = canv;
	this.ctx = ctx;
	this.color = "beige";

	// start and end at height, create variation in between.
	// We also include the bottom corners of the canvas.
	this.coords = [[0,0], [0,this.height]];
	for(var i=1; i<=10; i++) {
		this.coords.push([i*this.canv.width/10, // 10 parts
											0.5*(this.height + Math.random()*this.height)]);
	}
	this.coords.push([this.canv.width,this.height], [this.canv.width,0]);
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
		var [collided, v] = this.collideLineCircle(line, ship.getCenter(), ship.r);
		if(collided) {
	    lastCollision = [this.coords[i], this.coords[i+1]];
			return [collided, v];
		}
	}
	return [false, undefined];
};


// dot product p . q
// p & q are 2-element arrays
function vectorDot(p, q) {
	return p[0]*q[0] + p[1]*q[1];
}

// cross product p x q
// p & q are 2-element arrays
function vectorCross(p, q) {
	return p[0]*q[1] - p[1]*q[0];
}

// Multiply a vector by a scalar
function vectorScale(p, f) {
	return [f*p[0], f*p[1]];
}

// add two vectors
// p & q are 2-element arrays
function vectorAdd(p, q) {
	return [p[0]+q[0], p[1]+q[1]];
}

function vectorSub(p, q) {
	return vectorAdd(p, vectorScale(q, -1))
}

// l1 & l2 are 2-element arrays of points, themselves a 2-element array
// See https://stackoverflow.com/a/565282
Terrain.prototype.collideLine = function(l1, l2) {
	var p = l1[0];
	var r = vectorSub(l1[1], p)
	var q = l2[0];
	var s = vectorSub(l2[1], q)

	var rxs = vectorCross(r, s);
	var q_pxr = vectorCross(vectorSub(q, p), r);
	var q_pxs = vectorCross(vectorSub(q, p), s);

	// Case 1: colinear
	if (rxs === 0 && q_pxr === 0) {
		var t0 = vectorDot(vectorSub(q, p), r) / vectorDot(r, r);
		var t1 = t0 + (vectorDot(s, r) / vectorDot(r, r));
		if(0 <= t0 && t0 <= 1 && 0 <= t1 && t1 <= 1) return true;
	}

	// Case 2: parallel non-intersecting
	if(rxs === 0 && q_pxr !== 0) return false;
	
	// Case 3: intersect
	var t = q_pxs / rxs;
	var u = q_pxr / rxs;
	if(rxs !==0 && 0 <= u && u <= 1 && 0 <= t && t <= 1) return true;

	// Case 4: non-parallel non-intersect
	return false;

	// default case
	return false;	
}

function testCollisionLine() {
	var f = Terrain.prototype.collideLine;

	var o = [0,0];
	var a = [-1,0];
	var b = [1,0];
	var c = [-1,-1];
	var d = [-0.5,-0.5];
	var e = [1,1];

	// Intersect at the origin
	console.assert(f([a,b], [c,e]) === true);
	console.assert(f([c,e], [a,b]) === true);

	// Don't intersect because [c,d] is too short
	console.assert(f([a,b], [c,d]) === false);
	console.assert(f([c,d], [a,b]) === false);

	// Intersect exactly at the origin
	console.assert(f([a,o], [c,o]) === true);
	console.assert(f([c,o], [a,o]) === true);

	console.log("complete");
}

// l1 is a 2-element arrays of points, themselves a 2-element array
// c is the center of the circle, r is the radius
// 1- Take the vector from the start of l1 to c
// 2- Project this onto l1 to find the closest point to c, p_close
// 3a- If p_close is not on the line, no intersect
// 3b- The circle and line intersect if the radius is larger than the length
// 		of [p_close, c]
Terrain.prototype.collideLineCircle = function(l1, c, r) {
	// l1[0] - c
	var toCenter = vectorSub(c, l1[0]);

	// l1[1] - l1[0], the relative vector for l1
	var l1_vect  = vectorSub(l1[1], l1[0]);

	// l1_vect / ||l1_vect||, the unit vector of l1
	var l1_vect_unit = vectorScale(l1_vect, 1/Math.sqrt(vectorDot(l1_vect, l1_vect)));

	// l1[0] + l1_vect_unit * (toCenter . l1_vect_unit)
  var p_close = vectorAdd(l1[0], vectorScale(l1_vect_unit, vectorDot(toCenter, l1_vect_unit)));

	// p_close - l1[0]
	var p_close_vect = vectorSub(p_close, l1[0]);
	if(vectorDot(p_close_vect, p_close_vect) > vectorDot(l1_vect, l1_vect)){
		return [false, undefined];
	}

  // p_close - c
	var vector_to_c = vectorSub(c, p_close);
  return [r >= Math.sqrt(vectorDot(vector_to_c, vector_to_c)), vector_to_c];
};

function testCollisionLineCircle() {
	var f = function(l1, c, r) { // wrap to simplify asserts below
		var [c, _] = Terrain.prototype.collideLineCircle(l1,c,r);
		return c
	};
  var r = 1;
	var o = [0,0];
	var a = [-1,0];
	var b = [1,0];
	var c = [1,1];
	var d = [2,2];
	var e = [0.5,0.5];

	// Intersect at the ends of the x-axis line (at -1 & 1)
	console.assert(f([a,b], o, r) === true);
	console.assert(f([b,a], o, r) === true);

	// Don't intersect because the circle is far away
	console.assert(f([a,b], d, r) === false);
	console.assert(f([b,a], d, r) === false);

	// Intersect exactly at (1,0) and (0,1)
	console.assert(f([a,b], c, r) === true);
	console.assert(f([b,a], c, r) === true);

	// Intersect somewhere on the x and y axes
	console.assert(f([a,b], e, r) === true);
	console.assert(f([b,a], e, r) === true);

	console.log("complete");
}
