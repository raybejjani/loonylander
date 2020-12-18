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

