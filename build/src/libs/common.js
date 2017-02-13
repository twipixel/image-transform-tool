(function(global){

	/**
	 * "a.b.c"의 namespace를 가지고 { a:{ b:{ c:{} } } }; 
	 * 객체를 생성하는 함수
	 * @param  {[Object]} scope 
	 * @param  {[Array]} names 
	 * @return {[Object]}       
	 */
	function _usenamespace( scope, names ){

		if( names.length <= 0 ) return scope;

		var name = names.shift();

		if( typeof scope[name] === "undefined" )
			scope[name] = {};

		return _usenamespace( scope[name], names );
	}

	if( global.usenamespace ){

		global[ "__bak_usenamespace_" ] = global.usenamespace;
	}

	global.usenamespace = function( namespace ){

		global.nts = global.nts || {};

		return _usenamespace( global.nts, namespace.split(".") );
	}


	/**
	 * usenamespace를 이용 common namespace 생성. 
	 * common에 상속 함수 구현. 
	 * @type {[void]}
	 */
	var common = usenamespace( "common" );

	if( typeof common.extends === "undefined" ){

		common.extends = function( SuperClass, ChildClass ){

			ChildClass.prototype = Object.create( SuperClass.prototype );
			ChildClass.prototype.constructor = ChildClass;

			return ChildClass.prototype;
		}
	}


	usenamespace( "editor.util" ).loop = function( start, len, func, args, scope, update, complete ){

		var i = start,
			args = [ i, len ].concat( args );

		function exec(){

			args[0] = i;
			i = func.apply( scope, args );

			update( i, len );

			if( i < len ){
				setTimeout( exec, 10 );			
			}
			else{
				setTimeout( complete, 10, i, len );
			}
		}

		exec();
	}


	usenamespace( "editor.filter" ).MAXIMUM_PROCESS = 100000;
	usenamespace( "editor.filter" ).CONVOLUTION_DELAY = 20;


	/**
	 * Object.assign polyfill
	 */

	if (typeof Object.assign != 'function') {
	  Object.assign = function(target) {
	    'use strict';
	    if (target == null) {
	      throw new TypeError('Cannot convert undefined or null to object');
	    }

	    target = Object(target);
	    for (var index = 1; index < arguments.length; index++) {
	      var source = arguments[index];
	      if (source != null) {
	        for (var key in source) {
	          if (Object.prototype.hasOwnProperty.call(source, key)) {
	            target[key] = source[key];
	          }
	        }
	      }
	    }
	    return target;
	  };
	}




	/**
	 * Shim for "fixing" IE's lack of support (IE < 9) for applying slice
	 * on host objects like NamedNodeMap, NodeList, and HTMLCollection
	 * (technically, since host objects have been implementation-dependent,
	 * at least before ES6, IE hasn't needed to work this way).
	 * Also works on strings, fixes IE < 9 to allow an explicit undefined
	 * for the 2nd argument (as in Firefox), and prevents errors when
	 * called on other DOM objects.
	 * Array.slice 
	 */
	(function () {
	  'use strict';
	  var _slice = Array.prototype.slice;

	  try {
	    // Can't be used with DOM elements in IE < 9
	    _slice.call(document.documentElement);
	  } catch (e) { // Fails in IE < 9
	    // This will work for genuine arrays, array-like objects, 
	    // NamedNodeMap (attributes, entities, notations),
	    // NodeList (e.g., getElementsByTagName), HTMLCollection (e.g., childNodes),
	    // and will not fail on other DOM objects (as do DOM elements in IE < 9)
	    Array.prototype.slice = function(begin, end) {
	      // IE < 9 gets unhappy with an undefined end argument
	      end = (typeof end !== 'undefined') ? end : this.length;

	      // For native Array objects, we use the native slice function
	      if (Object.prototype.toString.call(this) === '[object Array]'){
	        return _slice.call(this, begin, end); 
	      }

	      // For array like object we handle it ourselves.
	      var i, cloned = [],
	        size, len = this.length;

	      // Handle negative value for "begin"
	      var start = begin || 0;
	      start = (start >= 0) ? start : Math.max(0, len + start);

	      // Handle negative value for "end"
	      var upTo = (typeof end == 'number') ? Math.min(end, len) : len;
	      if (end < 0) {
	        upTo = len + end;
	      }

	      // Actual expected size of the slice
	      size = upTo - start;

	      if (size > 0) {
	        cloned = new Array(size);
	        if (this.charAt) {
	          for (i = 0; i < size; i++) {
	            cloned[i] = this.charAt(start + i);
	          }
	        } else {
	          for (i = 0; i < size; i++) {
	            cloned[i] = this[start + i];
	          }
	        }
	      }

	      return cloned;
	    };
	  }
	}());



	/**
	 * IE10에서는 ImageData의 data 값이 CanvasPixelArray로 반환되어
	 * ArrayBuffer.set 함수가 없습니다. 
	 * ArrayBuffer.set의 polyfill 
	 * @param  {[type]} window.CanvasPixelArray [description]
	 * @return {[type]}                         [description]
	 */
	if( window.CanvasPixelArray ) {

		/**
		 * a.set(b) => a로 b 소스를 복사
		 * @param {Array||TypedArray} arr
		 * @param {uint} offset
		 */
    	CanvasPixelArray.prototype.set = function( arr, offset ) {
			
			var i = offset || 0,
				len = arr.length;

			if( i + len > this.length ) {
				throw new Error( "RangeError: Source is too large" );
			}

			var cnt = 0;

			for( ; i < len ; i++ ) {
				this[i] = arr[ cnt++ ];
			}
    	};

    	/**
    	 * a.subarray( 0, 10 ) => a의 0번부터 10번까지를 원소로 가지는 새로운 배열 반환
    	 * @param  {[type]} begin [description]
    	 * @param  {[type]} end   [description]
    	 * @return {[type]}       [description]
    	 */
		CanvasPixelArray.prototype.subarray = function (begin, end) {

			var len = end - begin;
			var arr = new Uint8Array(len);
			var cnt = 0;

			for(var i = begin; i < end ; i++ ) {
				arr[cnt++] = this[i];
			}

			return arr;
		};
	}

})(this || window);
