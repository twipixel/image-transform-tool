import {roundoffNth} from "./number";

/**
 * a(x, y) -> b(x, y) 로 이루어진 선분과 c(x, y) -> d(x, y)로 이루어진 선분의 
 * 대략적인 충돌 여부를 검사하여 반환한다. 
 * false일 경우 두 선분은 충돌할 수 없다. 
 * 하지만, true가 반환되어도 실제 교점은 없을 수도 있다. 
 * @param  {[type]} ax [description]
 * @param  {[type]} ay [description]
 * @param  {[type]} bx [description]
 * @param  {[type]} by [description]
 * @param  {[type]} cx [description]
 * @param  {[type]} cy [description]
 * @param  {[type]} dx [description]
 * @param  {[type]} dy [description]
 * @return {[type]}    [description]
 */
export function pseudoTestLine( ax, ay, bx, by, cx, cy, dx, dy ){

	if( Math.min( ax, bx ) > Math.max( cx, dx ) ||
		Math.max( ax, bx ) < Math.min( cx, dx ) || 
		Math.min( ay, by ) > Math.max( cy, dy ) ||
		Math.max( ay, by ) < Math.min( cy, dy ) ) return false;

	return true;
}


/**
 * a(x, y) -> b(x, y) 로 이루어진 선분과 c(x, y) -> d(x, y)로 이루어진 선분의 교점을 찾아 반환한다.
 * 충돌하지 않은 경우 null을 반환한다. 
 * @param  {[type]} ax  [description]
 * @param  {[type]} ay  [description]
 * @param  {[type]} bx  [description]
 * @param  {[type]} by  [description]
 * @param  {[type]} cx  [description]
 * @param  {[type]} cy  [description]
 * @param  {[type]} dx  [description]
 * @param  {[type]} dy  [description]
 * @param  {[type]} out [description]
 * @return {[type]}     [description]
 */
export function getIntersection( ax, ay, bx, by, cx, cy, dx, dy, out = null ){

		// vector AB : a->b
	let ABx = bx - ax,
		ABy = by - ay,
		// vector CD : c->d
		CDx = dx - cx,
		CDy = dy - cy,
		// AB dot AB
		a = ABx * ABx + ABy * ABy,
		// CD dot AB 
		b = CDx * ABx + CDy * ABy,
		// AB dot CD
		c = b,
		// CD dot CD
		d = CDx * CDx + CDy * CDy,
		// 행렬식 determinant
		det = -a * d + b * c;

	if( det == 0 ) return null;

		// vector CA: c->a
	let ACx = cx - ax,
		ACy = cy - ay,
		// AC dot AB
		e = ACx * ABx + ACy * ABy,
		// AC dot CD
		f = ACx * CDx + ACy * CDy;

	// 크라메르 공식을 이용한 연립방정식 
	// as - bt = e, 
	// cs - dt = f의 해 s, t를 구한다. 
	let s = ( -e * d + b * f ) / det,
		t = ( a * f - c * e ) / det;

	// s, t 두 내분점이 0 <= n <= 1가 아니라면 선분외 충돌이기 때문에 null을 반환한다. 
	if( s < 0 || s > 1 || t < 0 || t > 1 ) return null;

	out = out || {};

	out.x = ax + s * ( bx - ax );
	out.y = ay + s * ( by - ay );

	return out;
}

/**
 * a(x, y) -> b(x, y) 로 이루어진 선분과 
 * [ line_1_ax, line_1_ay, line_1_bx, line_1_by, line_2_ax, line_2_ay, line_2_bx, line_2_by ... 
 *  ... line_n_ax, line_n_ay, line_n_bx line_n_by ] 형태의 배열에 선분들의 충돌 검사 후 첫번째로 발견되는 교점을 반환한다. 
 * @param  {[type]} ax    [description]
 * @param  {[type]} ay    [description]
 * @param  {[type]} bx    [description]
 * @param  {[type]} by    [description]
 * @param  {[type]} lines [description]
 * @return {[type]}       [description]
 */
export function getIntersectionWithlines( ax, ay, bx, by, lines ){

	let cx, cy, dx, dy, p;

	for( var i = 0, n = lines.length; i < n; i += 4 ){
		
		cx = lines[i  ];
		cy = lines[i+1];
		dx = lines[i+2];
		dy = lines[i+3];

		p = getIntersection( ax, ay, bx, by, cx, cy, dx, dy );

		if( p ) break;
	}
	
	return p;
}















