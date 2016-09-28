



/**
 * array일 경우 array.forEach, 
 * Object일 경우 for..in 문을 이용 iterator callback을 실행
 * iterator 반환값이 true일 경우 for loop를 빠져나온다. 
 * @param  {[type]} collection [description]
 * @param  {[type]} iterator   [description]
 * @return {[type]}            [description]
 */
export function each( collection, iterator ){

	if( collection instanceof Array ){

		collection.forEach( iterator );
	}
	else{

		for( var s in collection ){

			if( iterator( collection[s], s, collection ) ) break;
		}
	}
}

/**
 * array.every
 * @param  {[type]} collection [description]
 * @param  {[type]} iterator   [description]
 * @return {[type]}            [description]
 */
export function every( collection, iterator ){

	if( collection instanceof Array )
		return collection.every( iterator );

	for( var s in collection ){

		if( !iterator( collection[s], s, collection ) ) return false;
	}

	return true;
}

/**
 * Array.map
 * @param  {[type]} collection [description]
 * @param  {[type]} iterator   [description]
 * @return {[type]}            [description]
 */
export function map( collection, iterator ){

	let o;

	if( collection instanceof Array ){

		return collection.map( iterator );
	}
	else{

		o = {};

		each( collection, ( e, key, collection )=>{

			o[ key ] = iterator( e, key, collection );
		});
	}

	return o;
}

/**
 * Array.filter
 * @param  {[type]} collection [description]
 * @param  {[type]} iterator   [description]
 * @return {[type]}            [description]
 */
export function filter( collection, iterator ){

	if( collection instanceof Array ){

		return collection.filter( iterator );
	}
	else{

		let o = {};

		each( collection, (e, key, collection)=>{

			if( iterator( e, key, collection0) ){
				o[ key ] = e;
			}
		});
	}

	return o;
}

/**
 * array일 경우 array.reduce
 * object일 경우 pollyfill
 * @param  {[type]} collection [description]
 * @param  {[type]} iterator   [description]
 * @param  {[type]} initValue  [description]
 * @return {[type]}            [description]
 */
export function reduce( collection, iterator, initValue = null ){

	if( collection instanceof Array ){

		return collection.reduce( iterator, initValue );
	}

	let i = initValue;
	
	each( collection, (n, key)=>{

		i = iterator( n, i, key );
	});

	return i;
}

/**
 * object의 indexOf 구현. 
 * 포함된 속성이라면 key( property name )을 반환한다. 
 * @param  {[type]} collection [description]
 * @param  {[type]} element    [description]
 * @return {[type]}            [description]
 */
export function indexOf( collection, element ){

	if( collection instanceof Array ){
		return collection.indexOf( element );
	}

	let name = null;

	each( collection, (e, key)=>{

		if( e == element ){

			name = key;

			return true;
		}
	});

	return name;
}
