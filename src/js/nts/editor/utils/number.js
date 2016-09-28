
/**
 * n의 부호를 반환한다. 
 * @param  {[type]} n [description]
 * @return {[type]}   [description]
 */
export function sign( n ){

	return n < 0 ? -1 : ( n ? 1 : 0 );
}

/**
 * 소수점 nth까지 t를 기준으로 반올림한 숫자를 반환한다. 
 * @param  {[type]} number [description]
 * @param  {[type]} nth    [description]
 * @param  {Number} t      [description]
 * @return {[type]}        [description]
 */
export function roundoffNth( number, nth, t = 0.5 ){

	let n = Math.pow( 10, nth );

	return ( number * n + t | 0 ) / n;
}