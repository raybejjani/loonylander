// l1 & l2 are 2-element arrays of points, themselves a 2-element array
// See https://stackoverflow.com/a/565282
function collideLine(l1, l2) {
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
	var f = collideLine;

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
function collideLineCircle(l1, c, r) {
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
	if(vectorDot(p_close_vect, l1_vect) < 0) return [false, undefined];
	if(vectorDot(p_close_vect, p_close_vect) > vectorDot(l1_vect, l1_vect)){
		return [false, undefined];
	}

  // c - p_close
	var vector_to_c = vectorSub(c, p_close);
  return [r >= Math.sqrt(vectorDot(vector_to_c, vector_to_c)), vector_to_c];
};

function testCollisionLineCircle() {
	var f = function(l1, c, r) { // wrap to simplify asserts below
		var [c, _] = collideLineCircle(l1,c,r);
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


// find the vector between the centers, if that length is less than the sum
// of radii, it is a collision
function collideCircleCircle(c1, r1, c2, r2) {
	var vect = vectorSub(c2, c1);
	var distance = Math.sqrt(vectorDot(vect, vect));

	return [distance <= (r1+r2), vect]
}

function testCollideCircleCircle() {
	var f = function(c1,r1,c2,r2) { // wrap to simplify asserts below
		var [c, _] = collideCircleCircle(c1,r1,c2,r2);
		return c
	};

	var c1 = [0, 0];
	var r1 = 1;
	var c2 = [0,2];
	var r2 = 1;
	var c3 = [0,3];
	var r3 = 1;

	console.assert(f(c1, r1, c2, r2) === true);
	console.assert(f(c1, r1, c3, r3) === false);
}
