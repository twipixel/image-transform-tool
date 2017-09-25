(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";

require("core-js/shim");

require("regenerator-runtime/runtime");

require("core-js/fn/regexp/escape");

if (global._babelPolyfill) {
  throw new Error("only one instance of babel-polyfill is allowed");
}
global._babelPolyfill = true;

var DEFINE_PROPERTY = "defineProperty";
function define(O, key, value) {
  O[key] || Object[DEFINE_PROPERTY](O, key, {
    writable: true,
    configurable: true,
    value: value
  });
}

define(String.prototype, "padLeft", "".padStart);
define(String.prototype, "padRight", "".padEnd);

"pop,reverse,shift,keys,values,entries,indexOf,every,some,forEach,map,filter,find,findIndex,includes,join,slice,concat,push,splice,unshift,sort,lastIndexOf,reduce,reduceRight,copyWithin,fill".split(",").forEach(function (key) {
  [][key] && define(Array, key, Function.call.bind([][key]));
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"core-js/fn/regexp/escape":2,"core-js/shim":295,"regenerator-runtime/runtime":297}],2:[function(require,module,exports){
require('../../modules/core.regexp.escape');
module.exports = require('../../modules/_core').RegExp.escape;
},{"../../modules/_core":23,"../../modules/core.regexp.escape":119}],3:[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],4:[function(require,module,exports){
var cof = require('./_cof');
module.exports = function(it, msg){
  if(typeof it != 'number' && cof(it) != 'Number')throw TypeError(msg);
  return +it;
};
},{"./_cof":18}],5:[function(require,module,exports){
// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = require('./_wks')('unscopables')
  , ArrayProto  = Array.prototype;
if(ArrayProto[UNSCOPABLES] == undefined)require('./_hide')(ArrayProto, UNSCOPABLES, {});
module.exports = function(key){
  ArrayProto[UNSCOPABLES][key] = true;
};
},{"./_hide":40,"./_wks":117}],6:[function(require,module,exports){
module.exports = function(it, Constructor, name, forbiddenField){
  if(!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)){
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};
},{}],7:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./_is-object":49}],8:[function(require,module,exports){
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
'use strict';
var toObject = require('./_to-object')
  , toIndex  = require('./_to-index')
  , toLength = require('./_to-length');

module.exports = [].copyWithin || function copyWithin(target/*= 0*/, start/*= 0, end = @length*/){
  var O     = toObject(this)
    , len   = toLength(O.length)
    , to    = toIndex(target, len)
    , from  = toIndex(start, len)
    , end   = arguments.length > 2 ? arguments[2] : undefined
    , count = Math.min((end === undefined ? len : toIndex(end, len)) - from, len - to)
    , inc   = 1;
  if(from < to && to < from + count){
    inc  = -1;
    from += count - 1;
    to   += count - 1;
  }
  while(count-- > 0){
    if(from in O)O[to] = O[from];
    else delete O[to];
    to   += inc;
    from += inc;
  } return O;
};
},{"./_to-index":105,"./_to-length":108,"./_to-object":109}],9:[function(require,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
'use strict';
var toObject = require('./_to-object')
  , toIndex  = require('./_to-index')
  , toLength = require('./_to-length');
module.exports = function fill(value /*, start = 0, end = @length */){
  var O      = toObject(this)
    , length = toLength(O.length)
    , aLen   = arguments.length
    , index  = toIndex(aLen > 1 ? arguments[1] : undefined, length)
    , end    = aLen > 2 ? arguments[2] : undefined
    , endPos = end === undefined ? length : toIndex(end, length);
  while(endPos > index)O[index++] = value;
  return O;
};
},{"./_to-index":105,"./_to-length":108,"./_to-object":109}],10:[function(require,module,exports){
var forOf = require('./_for-of');

module.exports = function(iter, ITERATOR){
  var result = [];
  forOf(iter, false, result.push, result, ITERATOR);
  return result;
};

},{"./_for-of":37}],11:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject')
  , toLength  = require('./_to-length')
  , toIndex   = require('./_to-index');
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};
},{"./_to-index":105,"./_to-iobject":107,"./_to-length":108}],12:[function(require,module,exports){
// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx      = require('./_ctx')
  , IObject  = require('./_iobject')
  , toObject = require('./_to-object')
  , toLength = require('./_to-length')
  , asc      = require('./_array-species-create');
module.exports = function(TYPE, $create){
  var IS_MAP        = TYPE == 1
    , IS_FILTER     = TYPE == 2
    , IS_SOME       = TYPE == 3
    , IS_EVERY      = TYPE == 4
    , IS_FIND_INDEX = TYPE == 6
    , NO_HOLES      = TYPE == 5 || IS_FIND_INDEX
    , create        = $create || asc;
  return function($this, callbackfn, that){
    var O      = toObject($this)
      , self   = IObject(O)
      , f      = ctx(callbackfn, that, 3)
      , length = toLength(self.length)
      , index  = 0
      , result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined
      , val, res;
    for(;length > index; index++)if(NO_HOLES || index in self){
      val = self[index];
      res = f(val, index, O);
      if(TYPE){
        if(IS_MAP)result[index] = res;            // map
        else if(res)switch(TYPE){
          case 3: return true;                    // some
          case 5: return val;                     // find
          case 6: return index;                   // findIndex
          case 2: result.push(val);               // filter
        } else if(IS_EVERY)return false;          // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};
},{"./_array-species-create":15,"./_ctx":25,"./_iobject":45,"./_to-length":108,"./_to-object":109}],13:[function(require,module,exports){
var aFunction = require('./_a-function')
  , toObject  = require('./_to-object')
  , IObject   = require('./_iobject')
  , toLength  = require('./_to-length');

module.exports = function(that, callbackfn, aLen, memo, isRight){
  aFunction(callbackfn);
  var O      = toObject(that)
    , self   = IObject(O)
    , length = toLength(O.length)
    , index  = isRight ? length - 1 : 0
    , i      = isRight ? -1 : 1;
  if(aLen < 2)for(;;){
    if(index in self){
      memo = self[index];
      index += i;
      break;
    }
    index += i;
    if(isRight ? index < 0 : length <= index){
      throw TypeError('Reduce of empty array with no initial value');
    }
  }
  for(;isRight ? index >= 0 : length > index; index += i)if(index in self){
    memo = callbackfn(memo, self[index], index, O);
  }
  return memo;
};
},{"./_a-function":3,"./_iobject":45,"./_to-length":108,"./_to-object":109}],14:[function(require,module,exports){
var isObject = require('./_is-object')
  , isArray  = require('./_is-array')
  , SPECIES  = require('./_wks')('species');

module.exports = function(original){
  var C;
  if(isArray(original)){
    C = original.constructor;
    // cross-realm fallback
    if(typeof C == 'function' && (C === Array || isArray(C.prototype)))C = undefined;
    if(isObject(C)){
      C = C[SPECIES];
      if(C === null)C = undefined;
    }
  } return C === undefined ? Array : C;
};
},{"./_is-array":47,"./_is-object":49,"./_wks":117}],15:[function(require,module,exports){
// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = require('./_array-species-constructor');

module.exports = function(original, length){
  return new (speciesConstructor(original))(length);
};
},{"./_array-species-constructor":14}],16:[function(require,module,exports){
'use strict';
var aFunction  = require('./_a-function')
  , isObject   = require('./_is-object')
  , invoke     = require('./_invoke')
  , arraySlice = [].slice
  , factories  = {};

var construct = function(F, len, args){
  if(!(len in factories)){
    for(var n = [], i = 0; i < len; i++)n[i] = 'a[' + i + ']';
    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
  } return factories[len](F, args);
};

module.exports = Function.bind || function bind(that /*, args... */){
  var fn       = aFunction(this)
    , partArgs = arraySlice.call(arguments, 1);
  var bound = function(/* args... */){
    var args = partArgs.concat(arraySlice.call(arguments));
    return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
  };
  if(isObject(fn.prototype))bound.prototype = fn.prototype;
  return bound;
};
},{"./_a-function":3,"./_invoke":44,"./_is-object":49}],17:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof')
  , TAG = require('./_wks')('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function(it, key){
  try {
    return it[key];
  } catch(e){ /* empty */ }
};

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};
},{"./_cof":18,"./_wks":117}],18:[function(require,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],19:[function(require,module,exports){
'use strict';
var dP          = require('./_object-dp').f
  , create      = require('./_object-create')
  , redefineAll = require('./_redefine-all')
  , ctx         = require('./_ctx')
  , anInstance  = require('./_an-instance')
  , defined     = require('./_defined')
  , forOf       = require('./_for-of')
  , $iterDefine = require('./_iter-define')
  , step        = require('./_iter-step')
  , setSpecies  = require('./_set-species')
  , DESCRIPTORS = require('./_descriptors')
  , fastKey     = require('./_meta').fastKey
  , SIZE        = DESCRIPTORS ? '_s' : 'size';

var getEntry = function(that, key){
  // fast case
  var index = fastKey(key), entry;
  if(index !== 'F')return that._i[index];
  // frozen object case
  for(entry = that._f; entry; entry = entry.n){
    if(entry.k == key)return entry;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      anInstance(that, C, NAME, '_i');
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear(){
        for(var that = this, data = that._i, entry = that._f; entry; entry = entry.n){
          entry.r = true;
          if(entry.p)entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function(key){
        var that  = this
          , entry = getEntry(that, key);
        if(entry){
          var next = entry.n
            , prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if(prev)prev.n = next;
          if(next)next.p = prev;
          if(that._f == entry)that._f = next;
          if(that._l == entry)that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /*, that = undefined */){
        anInstance(this, C, 'forEach');
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3)
          , entry;
        while(entry = entry ? entry.n : this._f){
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while(entry && entry.r)entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key){
        return !!getEntry(this, key);
      }
    });
    if(DESCRIPTORS)dP(C.prototype, 'size', {
      get: function(){
        return defined(this[SIZE]);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var entry = getEntry(that, key)
      , prev, index;
    // change existing entry
    if(entry){
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if(!that._f)that._f = entry;
      if(prev)prev.n = entry;
      that[SIZE]++;
      // add to index
      if(index !== 'F')that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function(C, NAME, IS_MAP){
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function(iterated, kind){
      this._t = iterated;  // target
      this._k = kind;      // kind
      this._l = undefined; // previous
    }, function(){
      var that  = this
        , kind  = that._k
        , entry = that._l;
      // revert to the last existing entry
      while(entry && entry.r)entry = entry.p;
      // get next entry
      if(!that._t || !(that._l = entry = entry ? entry.n : that._t._f)){
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if(kind == 'keys'  )return step(0, entry.k);
      if(kind == 'values')return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};
},{"./_an-instance":6,"./_ctx":25,"./_defined":27,"./_descriptors":28,"./_for-of":37,"./_iter-define":53,"./_iter-step":55,"./_meta":62,"./_object-create":66,"./_object-dp":67,"./_redefine-all":86,"./_set-species":91}],20:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof = require('./_classof')
  , from    = require('./_array-from-iterable');
module.exports = function(NAME){
  return function toJSON(){
    if(classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
    return from(this);
  };
};
},{"./_array-from-iterable":10,"./_classof":17}],21:[function(require,module,exports){
'use strict';
var redefineAll       = require('./_redefine-all')
  , getWeak           = require('./_meta').getWeak
  , anObject          = require('./_an-object')
  , isObject          = require('./_is-object')
  , anInstance        = require('./_an-instance')
  , forOf             = require('./_for-of')
  , createArrayMethod = require('./_array-methods')
  , $has              = require('./_has')
  , arrayFind         = createArrayMethod(5)
  , arrayFindIndex    = createArrayMethod(6)
  , id                = 0;

// fallback for uncaught frozen keys
var uncaughtFrozenStore = function(that){
  return that._l || (that._l = new UncaughtFrozenStore);
};
var UncaughtFrozenStore = function(){
  this.a = [];
};
var findUncaughtFrozen = function(store, key){
  return arrayFind(store.a, function(it){
    return it[0] === key;
  });
};
UncaughtFrozenStore.prototype = {
  get: function(key){
    var entry = findUncaughtFrozen(this, key);
    if(entry)return entry[1];
  },
  has: function(key){
    return !!findUncaughtFrozen(this, key);
  },
  set: function(key, value){
    var entry = findUncaughtFrozen(this, key);
    if(entry)entry[1] = value;
    else this.a.push([key, value]);
  },
  'delete': function(key){
    var index = arrayFindIndex(this.a, function(it){
      return it[0] === key;
    });
    if(~index)this.a.splice(index, 1);
    return !!~index;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      anInstance(that, C, NAME, '_i');
      that._i = id++;      // collection id
      that._l = undefined; // leak store for uncaught frozen objects
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function(key){
        if(!isObject(key))return false;
        var data = getWeak(key);
        if(data === true)return uncaughtFrozenStore(this)['delete'](key);
        return data && $has(data, this._i) && delete data[this._i];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key){
        if(!isObject(key))return false;
        var data = getWeak(key);
        if(data === true)return uncaughtFrozenStore(this).has(key);
        return data && $has(data, this._i);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var data = getWeak(anObject(key), true);
    if(data === true)uncaughtFrozenStore(that).set(key, value);
    else data[that._i] = value;
    return that;
  },
  ufstore: uncaughtFrozenStore
};
},{"./_an-instance":6,"./_an-object":7,"./_array-methods":12,"./_for-of":37,"./_has":39,"./_is-object":49,"./_meta":62,"./_redefine-all":86}],22:[function(require,module,exports){
'use strict';
var global            = require('./_global')
  , $export           = require('./_export')
  , redefine          = require('./_redefine')
  , redefineAll       = require('./_redefine-all')
  , meta              = require('./_meta')
  , forOf             = require('./_for-of')
  , anInstance        = require('./_an-instance')
  , isObject          = require('./_is-object')
  , fails             = require('./_fails')
  , $iterDetect       = require('./_iter-detect')
  , setToStringTag    = require('./_set-to-string-tag')
  , inheritIfRequired = require('./_inherit-if-required');

module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
  var Base  = global[NAME]
    , C     = Base
    , ADDER = IS_MAP ? 'set' : 'add'
    , proto = C && C.prototype
    , O     = {};
  var fixMethod = function(KEY){
    var fn = proto[KEY];
    redefine(proto, KEY,
      KEY == 'delete' ? function(a){
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'has' ? function has(a){
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'get' ? function get(a){
        return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'add' ? function add(a){ fn.call(this, a === 0 ? 0 : a); return this; }
        : function set(a, b){ fn.call(this, a === 0 ? 0 : a, b); return this; }
    );
  };
  if(typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function(){
    new C().entries().next();
  }))){
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    var instance             = new C
      // early implementations not supports chaining
      , HASNT_CHAINING       = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance
      // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
      , THROWS_ON_PRIMITIVES = fails(function(){ instance.has(1); })
      // most early implementations doesn't supports iterables, most modern - not close it correctly
      , ACCEPT_ITERABLES     = $iterDetect(function(iter){ new C(iter); }) // eslint-disable-line no-new
      // for early implementations -0 and +0 not the same
      , BUGGY_ZERO = !IS_WEAK && fails(function(){
        // V8 ~ Chromium 42- fails only with 5+ elements
        var $instance = new C()
          , index     = 5;
        while(index--)$instance[ADDER](index, index);
        return !$instance.has(-0);
      });
    if(!ACCEPT_ITERABLES){ 
      C = wrapper(function(target, iterable){
        anInstance(target, C, NAME);
        var that = inheritIfRequired(new Base, target, C);
        if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    if(THROWS_ON_PRIMITIVES || BUGGY_ZERO){
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    if(BUGGY_ZERO || HASNT_CHAINING)fixMethod(ADDER);
    // weak collections should not contains .clear method
    if(IS_WEAK && proto.clear)delete proto.clear;
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F * (C != Base), O);

  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);

  return C;
};
},{"./_an-instance":6,"./_export":32,"./_fails":34,"./_for-of":37,"./_global":38,"./_inherit-if-required":43,"./_is-object":49,"./_iter-detect":54,"./_meta":62,"./_redefine":87,"./_redefine-all":86,"./_set-to-string-tag":92}],23:[function(require,module,exports){
var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],24:[function(require,module,exports){
'use strict';
var $defineProperty = require('./_object-dp')
  , createDesc      = require('./_property-desc');

module.exports = function(object, index, value){
  if(index in object)$defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};
},{"./_object-dp":67,"./_property-desc":85}],25:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
},{"./_a-function":3}],26:[function(require,module,exports){
'use strict';
var anObject    = require('./_an-object')
  , toPrimitive = require('./_to-primitive')
  , NUMBER      = 'number';

module.exports = function(hint){
  if(hint !== 'string' && hint !== NUMBER && hint !== 'default')throw TypeError('Incorrect hint');
  return toPrimitive(anObject(this), hint != NUMBER);
};
},{"./_an-object":7,"./_to-primitive":110}],27:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],28:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_fails":34}],29:[function(require,module,exports){
var isObject = require('./_is-object')
  , document = require('./_global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./_global":38,"./_is-object":49}],30:[function(require,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');
},{}],31:[function(require,module,exports){
// all enumerable object keys, includes symbols
var getKeys = require('./_object-keys')
  , gOPS    = require('./_object-gops')
  , pIE     = require('./_object-pie');
module.exports = function(it){
  var result     = getKeys(it)
    , getSymbols = gOPS.f;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = pIE.f
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
  } return result;
};
},{"./_object-gops":73,"./_object-keys":76,"./_object-pie":77}],32:[function(require,module,exports){
var global    = require('./_global')
  , core      = require('./_core')
  , hide      = require('./_hide')
  , redefine  = require('./_redefine')
  , ctx       = require('./_ctx')
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE]
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE] || (exports[PROTOTYPE] = {})
    , key, own, out, exp;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if(target)redefine(target, key, out, type & $export.U);
    // export
    if(exports[key] != out)hide(exports, key, exp);
    if(IS_PROTO && expProto[key] != out)expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;
},{"./_core":23,"./_ctx":25,"./_global":38,"./_hide":40,"./_redefine":87}],33:[function(require,module,exports){
var MATCH = require('./_wks')('match');
module.exports = function(KEY){
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch(e){
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch(f){ /* empty */ }
  } return true;
};
},{"./_wks":117}],34:[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],35:[function(require,module,exports){
'use strict';
var hide     = require('./_hide')
  , redefine = require('./_redefine')
  , fails    = require('./_fails')
  , defined  = require('./_defined')
  , wks      = require('./_wks');

module.exports = function(KEY, length, exec){
  var SYMBOL   = wks(KEY)
    , fns      = exec(defined, SYMBOL, ''[KEY])
    , strfn    = fns[0]
    , rxfn     = fns[1];
  if(fails(function(){
    var O = {};
    O[SYMBOL] = function(){ return 7; };
    return ''[KEY](O) != 7;
  })){
    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function(string, arg){ return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function(string){ return rxfn.call(string, this); }
    );
  }
};
},{"./_defined":27,"./_fails":34,"./_hide":40,"./_redefine":87,"./_wks":117}],36:[function(require,module,exports){
'use strict';
// 21.2.5.3 get RegExp.prototype.flags
var anObject = require('./_an-object');
module.exports = function(){
  var that   = anObject(this)
    , result = '';
  if(that.global)     result += 'g';
  if(that.ignoreCase) result += 'i';
  if(that.multiline)  result += 'm';
  if(that.unicode)    result += 'u';
  if(that.sticky)     result += 'y';
  return result;
};
},{"./_an-object":7}],37:[function(require,module,exports){
var ctx         = require('./_ctx')
  , call        = require('./_iter-call')
  , isArrayIter = require('./_is-array-iter')
  , anObject    = require('./_an-object')
  , toLength    = require('./_to-length')
  , getIterFn   = require('./core.get-iterator-method')
  , BREAK       = {}
  , RETURN      = {};
var exports = module.exports = function(iterable, entries, fn, that, ITERATOR){
  var iterFn = ITERATOR ? function(){ return iterable; } : getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator, result;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if(result === BREAK || result === RETURN)return result;
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    result = call(iterator, f, step.value, entries);
    if(result === BREAK || result === RETURN)return result;
  }
};
exports.BREAK  = BREAK;
exports.RETURN = RETURN;
},{"./_an-object":7,"./_ctx":25,"./_is-array-iter":46,"./_iter-call":51,"./_to-length":108,"./core.get-iterator-method":118}],38:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],39:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],40:[function(require,module,exports){
var dP         = require('./_object-dp')
  , createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./_descriptors":28,"./_object-dp":67,"./_property-desc":85}],41:[function(require,module,exports){
module.exports = require('./_global').document && document.documentElement;
},{"./_global":38}],42:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function(){
  return Object.defineProperty(require('./_dom-create')('div'), 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_descriptors":28,"./_dom-create":29,"./_fails":34}],43:[function(require,module,exports){
var isObject       = require('./_is-object')
  , setPrototypeOf = require('./_set-proto').set;
module.exports = function(that, target, C){
  var P, S = target.constructor;
  if(S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf){
    setPrototypeOf(that, P);
  } return that;
};
},{"./_is-object":49,"./_set-proto":90}],44:[function(require,module,exports){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return              fn.apply(that, args);
};
},{}],45:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./_cof":18}],46:[function(require,module,exports){
// check on default Array iterator
var Iterators  = require('./_iterators')
  , ITERATOR   = require('./_wks')('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};
},{"./_iterators":56,"./_wks":117}],47:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./_cof');
module.exports = Array.isArray || function isArray(arg){
  return cof(arg) == 'Array';
};
},{"./_cof":18}],48:[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var isObject = require('./_is-object')
  , floor    = Math.floor;
module.exports = function isInteger(it){
  return !isObject(it) && isFinite(it) && floor(it) === it;
};
},{"./_is-object":49}],49:[function(require,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],50:[function(require,module,exports){
// 7.2.8 IsRegExp(argument)
var isObject = require('./_is-object')
  , cof      = require('./_cof')
  , MATCH    = require('./_wks')('match');
module.exports = function(it){
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};
},{"./_cof":18,"./_is-object":49,"./_wks":117}],51:[function(require,module,exports){
// call something on iterator step with safe closing on error
var anObject = require('./_an-object');
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};
},{"./_an-object":7}],52:[function(require,module,exports){
'use strict';
var create         = require('./_object-create')
  , descriptor     = require('./_property-desc')
  , setToStringTag = require('./_set-to-string-tag')
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};
},{"./_hide":40,"./_object-create":66,"./_property-desc":85,"./_set-to-string-tag":92,"./_wks":117}],53:[function(require,module,exports){
'use strict';
var LIBRARY        = require('./_library')
  , $export        = require('./_export')
  , redefine       = require('./_redefine')
  , hide           = require('./_hide')
  , has            = require('./_has')
  , Iterators      = require('./_iterators')
  , $iterCreate    = require('./_iter-create')
  , setToStringTag = require('./_set-to-string-tag')
  , getPrototypeOf = require('./_object-gpo')
  , ITERATOR       = require('./_wks')('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};
},{"./_export":32,"./_has":39,"./_hide":40,"./_iter-create":52,"./_iterators":56,"./_library":58,"./_object-gpo":74,"./_redefine":87,"./_set-to-string-tag":92,"./_wks":117}],54:[function(require,module,exports){
var ITERATOR     = require('./_wks')('iterator')
  , SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR]();
    iter.next = function(){ return {done: safe = true}; };
    arr[ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};
},{"./_wks":117}],55:[function(require,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],56:[function(require,module,exports){
module.exports = {};
},{}],57:[function(require,module,exports){
var getKeys   = require('./_object-keys')
  , toIObject = require('./_to-iobject');
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};
},{"./_object-keys":76,"./_to-iobject":107}],58:[function(require,module,exports){
module.exports = false;
},{}],59:[function(require,module,exports){
// 20.2.2.14 Math.expm1(x)
var $expm1 = Math.expm1;
module.exports = (!$expm1
  // Old FF bug
  || $expm1(10) > 22025.465794806719 || $expm1(10) < 22025.4657948067165168
  // Tor Browser bug
  || $expm1(-2e-17) != -2e-17
) ? function expm1(x){
  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : Math.exp(x) - 1;
} : $expm1;
},{}],60:[function(require,module,exports){
// 20.2.2.20 Math.log1p(x)
module.exports = Math.log1p || function log1p(x){
  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
};
},{}],61:[function(require,module,exports){
// 20.2.2.28 Math.sign(x)
module.exports = Math.sign || function sign(x){
  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
};
},{}],62:[function(require,module,exports){
var META     = require('./_uid')('meta')
  , isObject = require('./_is-object')
  , has      = require('./_has')
  , setDesc  = require('./_object-dp').f
  , id       = 0;
var isExtensible = Object.isExtensible || function(){
  return true;
};
var FREEZE = !require('./_fails')(function(){
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function(it){
  setDesc(it, META, {value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  }});
};
var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add metadata
    if(!create)return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function(it, create){
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return true;
    // not necessary to add metadata
    if(!create)return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function(it){
  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY:      META,
  NEED:     false,
  fastKey:  fastKey,
  getWeak:  getWeak,
  onFreeze: onFreeze
};
},{"./_fails":34,"./_has":39,"./_is-object":49,"./_object-dp":67,"./_uid":114}],63:[function(require,module,exports){
var Map     = require('./es6.map')
  , $export = require('./_export')
  , shared  = require('./_shared')('metadata')
  , store   = shared.store || (shared.store = new (require('./es6.weak-map')));

var getOrCreateMetadataMap = function(target, targetKey, create){
  var targetMetadata = store.get(target);
  if(!targetMetadata){
    if(!create)return undefined;
    store.set(target, targetMetadata = new Map);
  }
  var keyMetadata = targetMetadata.get(targetKey);
  if(!keyMetadata){
    if(!create)return undefined;
    targetMetadata.set(targetKey, keyMetadata = new Map);
  } return keyMetadata;
};
var ordinaryHasOwnMetadata = function(MetadataKey, O, P){
  var metadataMap = getOrCreateMetadataMap(O, P, false);
  return metadataMap === undefined ? false : metadataMap.has(MetadataKey);
};
var ordinaryGetOwnMetadata = function(MetadataKey, O, P){
  var metadataMap = getOrCreateMetadataMap(O, P, false);
  return metadataMap === undefined ? undefined : metadataMap.get(MetadataKey);
};
var ordinaryDefineOwnMetadata = function(MetadataKey, MetadataValue, O, P){
  getOrCreateMetadataMap(O, P, true).set(MetadataKey, MetadataValue);
};
var ordinaryOwnMetadataKeys = function(target, targetKey){
  var metadataMap = getOrCreateMetadataMap(target, targetKey, false)
    , keys        = [];
  if(metadataMap)metadataMap.forEach(function(_, key){ keys.push(key); });
  return keys;
};
var toMetaKey = function(it){
  return it === undefined || typeof it == 'symbol' ? it : String(it);
};
var exp = function(O){
  $export($export.S, 'Reflect', O);
};

module.exports = {
  store: store,
  map: getOrCreateMetadataMap,
  has: ordinaryHasOwnMetadata,
  get: ordinaryGetOwnMetadata,
  set: ordinaryDefineOwnMetadata,
  keys: ordinaryOwnMetadataKeys,
  key: toMetaKey,
  exp: exp
};
},{"./_export":32,"./_shared":94,"./es6.map":149,"./es6.weak-map":255}],64:[function(require,module,exports){
var global    = require('./_global')
  , macrotask = require('./_task').set
  , Observer  = global.MutationObserver || global.WebKitMutationObserver
  , process   = global.process
  , Promise   = global.Promise
  , isNode    = require('./_cof')(process) == 'process';

module.exports = function(){
  var head, last, notify;

  var flush = function(){
    var parent, fn;
    if(isNode && (parent = process.domain))parent.exit();
    while(head){
      fn   = head.fn;
      head = head.next;
      try {
        fn();
      } catch(e){
        if(head)notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if(parent)parent.enter();
  };

  // Node.js
  if(isNode){
    notify = function(){
      process.nextTick(flush);
    };
  // browsers with MutationObserver
  } else if(Observer){
    var toggle = true
      , node   = document.createTextNode('');
    new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
    notify = function(){
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if(Promise && Promise.resolve){
    var promise = Promise.resolve();
    notify = function(){
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function(){
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function(fn){
    var task = {fn: fn, next: undefined};
    if(last)last.next = task;
    if(!head){
      head = task;
      notify();
    } last = task;
  };
};
},{"./_cof":18,"./_global":38,"./_task":104}],65:[function(require,module,exports){
'use strict';
// 19.1.2.1 Object.assign(target, source, ...)
var getKeys  = require('./_object-keys')
  , gOPS     = require('./_object-gops')
  , pIE      = require('./_object-pie')
  , toObject = require('./_to-object')
  , IObject  = require('./_iobject')
  , $assign  = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || require('./_fails')(function(){
  var A = {}
    , B = {}
    , S = Symbol()
    , K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function(k){ B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
  var T     = toObject(target)
    , aLen  = arguments.length
    , index = 1
    , getSymbols = gOPS.f
    , isEnum     = pIE.f;
  while(aLen > index){
    var S      = IObject(arguments[index++])
      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
  } return T;
} : $assign;
},{"./_fails":34,"./_iobject":45,"./_object-gops":73,"./_object-keys":76,"./_object-pie":77,"./_to-object":109}],66:[function(require,module,exports){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = require('./_an-object')
  , dPs         = require('./_object-dps')
  , enumBugKeys = require('./_enum-bug-keys')
  , IE_PROTO    = require('./_shared-key')('IE_PROTO')
  , Empty       = function(){ /* empty */ }
  , PROTOTYPE   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe')
    , i      = enumBugKeys.length
    , lt     = '<'
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty;
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":7,"./_dom-create":29,"./_enum-bug-keys":30,"./_html":41,"./_object-dps":68,"./_shared-key":93}],67:[function(require,module,exports){
var anObject       = require('./_an-object')
  , IE8_DOM_DEFINE = require('./_ie8-dom-define')
  , toPrimitive    = require('./_to-primitive')
  , dP             = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};
},{"./_an-object":7,"./_descriptors":28,"./_ie8-dom-define":42,"./_to-primitive":110}],68:[function(require,module,exports){
var dP       = require('./_object-dp')
  , anObject = require('./_an-object')
  , getKeys  = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties){
  anObject(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
  return O;
};
},{"./_an-object":7,"./_descriptors":28,"./_object-dp":67,"./_object-keys":76}],69:[function(require,module,exports){
// Forced replacement prototype accessors methods
module.exports = require('./_library')|| !require('./_fails')(function(){
  var K = Math.random();
  // In FF throws only define methods
  __defineSetter__.call(null, K, function(){ /* empty */});
  delete require('./_global')[K];
});
},{"./_fails":34,"./_global":38,"./_library":58}],70:[function(require,module,exports){
var pIE            = require('./_object-pie')
  , createDesc     = require('./_property-desc')
  , toIObject      = require('./_to-iobject')
  , toPrimitive    = require('./_to-primitive')
  , has            = require('./_has')
  , IE8_DOM_DEFINE = require('./_ie8-dom-define')
  , gOPD           = Object.getOwnPropertyDescriptor;

exports.f = require('./_descriptors') ? gOPD : function getOwnPropertyDescriptor(O, P){
  O = toIObject(O);
  P = toPrimitive(P, true);
  if(IE8_DOM_DEFINE)try {
    return gOPD(O, P);
  } catch(e){ /* empty */ }
  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
};
},{"./_descriptors":28,"./_has":39,"./_ie8-dom-define":42,"./_object-pie":77,"./_property-desc":85,"./_to-iobject":107,"./_to-primitive":110}],71:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require('./_to-iobject')
  , gOPN      = require('./_object-gopn').f
  , toString  = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return gOPN(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it){
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};

},{"./_object-gopn":72,"./_to-iobject":107}],72:[function(require,module,exports){
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys      = require('./_object-keys-internal')
  , hiddenKeys = require('./_enum-bug-keys').concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
  return $keys(O, hiddenKeys);
};
},{"./_enum-bug-keys":30,"./_object-keys-internal":75}],73:[function(require,module,exports){
exports.f = Object.getOwnPropertySymbols;
},{}],74:[function(require,module,exports){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = require('./_has')
  , toObject    = require('./_to-object')
  , IE_PROTO    = require('./_shared-key')('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};
},{"./_has":39,"./_shared-key":93,"./_to-object":109}],75:[function(require,module,exports){
var has          = require('./_has')
  , toIObject    = require('./_to-iobject')
  , arrayIndexOf = require('./_array-includes')(false)
  , IE_PROTO     = require('./_shared-key')('IE_PROTO');

module.exports = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};
},{"./_array-includes":11,"./_has":39,"./_shared-key":93,"./_to-iobject":107}],76:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = require('./_object-keys-internal')
  , enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};
},{"./_enum-bug-keys":30,"./_object-keys-internal":75}],77:[function(require,module,exports){
exports.f = {}.propertyIsEnumerable;
},{}],78:[function(require,module,exports){
// most Object methods by ES6 should accept primitives
var $export = require('./_export')
  , core    = require('./_core')
  , fails   = require('./_fails');
module.exports = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};
},{"./_core":23,"./_export":32,"./_fails":34}],79:[function(require,module,exports){
var getKeys   = require('./_object-keys')
  , toIObject = require('./_to-iobject')
  , isEnum    = require('./_object-pie').f;
module.exports = function(isEntries){
  return function(it){
    var O      = toIObject(it)
      , keys   = getKeys(O)
      , length = keys.length
      , i      = 0
      , result = []
      , key;
    while(length > i)if(isEnum.call(O, key = keys[i++])){
      result.push(isEntries ? [key, O[key]] : O[key]);
    } return result;
  };
};
},{"./_object-keys":76,"./_object-pie":77,"./_to-iobject":107}],80:[function(require,module,exports){
// all object keys, includes non-enumerable and symbols
var gOPN     = require('./_object-gopn')
  , gOPS     = require('./_object-gops')
  , anObject = require('./_an-object')
  , Reflect  = require('./_global').Reflect;
module.exports = Reflect && Reflect.ownKeys || function ownKeys(it){
  var keys       = gOPN.f(anObject(it))
    , getSymbols = gOPS.f;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};
},{"./_an-object":7,"./_global":38,"./_object-gopn":72,"./_object-gops":73}],81:[function(require,module,exports){
var $parseFloat = require('./_global').parseFloat
  , $trim       = require('./_string-trim').trim;

module.exports = 1 / $parseFloat(require('./_string-ws') + '-0') !== -Infinity ? function parseFloat(str){
  var string = $trim(String(str), 3)
    , result = $parseFloat(string);
  return result === 0 && string.charAt(0) == '-' ? -0 : result;
} : $parseFloat;
},{"./_global":38,"./_string-trim":102,"./_string-ws":103}],82:[function(require,module,exports){
var $parseInt = require('./_global').parseInt
  , $trim     = require('./_string-trim').trim
  , ws        = require('./_string-ws')
  , hex       = /^[\-+]?0[xX]/;

module.exports = $parseInt(ws + '08') !== 8 || $parseInt(ws + '0x16') !== 22 ? function parseInt(str, radix){
  var string = $trim(String(str), 3);
  return $parseInt(string, (radix >>> 0) || (hex.test(string) ? 16 : 10));
} : $parseInt;
},{"./_global":38,"./_string-trim":102,"./_string-ws":103}],83:[function(require,module,exports){
'use strict';
var path      = require('./_path')
  , invoke    = require('./_invoke')
  , aFunction = require('./_a-function');
module.exports = function(/* ...pargs */){
  var fn     = aFunction(this)
    , length = arguments.length
    , pargs  = Array(length)
    , i      = 0
    , _      = path._
    , holder = false;
  while(length > i)if((pargs[i] = arguments[i++]) === _)holder = true;
  return function(/* ...args */){
    var that = this
      , aLen = arguments.length
      , j = 0, k = 0, args;
    if(!holder && !aLen)return invoke(fn, pargs, that);
    args = pargs.slice();
    if(holder)for(;length > j; j++)if(args[j] === _)args[j] = arguments[k++];
    while(aLen > k)args.push(arguments[k++]);
    return invoke(fn, args, that);
  };
};
},{"./_a-function":3,"./_invoke":44,"./_path":84}],84:[function(require,module,exports){
module.exports = require('./_global');
},{"./_global":38}],85:[function(require,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],86:[function(require,module,exports){
var redefine = require('./_redefine');
module.exports = function(target, src, safe){
  for(var key in src)redefine(target, key, src[key], safe);
  return target;
};
},{"./_redefine":87}],87:[function(require,module,exports){
var global    = require('./_global')
  , hide      = require('./_hide')
  , has       = require('./_has')
  , SRC       = require('./_uid')('src')
  , TO_STRING = 'toString'
  , $toString = Function[TO_STRING]
  , TPL       = ('' + $toString).split(TO_STRING);

require('./_core').inspectSource = function(it){
  return $toString.call(it);
};

(module.exports = function(O, key, val, safe){
  var isFunction = typeof val == 'function';
  if(isFunction)has(val, 'name') || hide(val, 'name', key);
  if(O[key] === val)return;
  if(isFunction)has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if(O === global){
    O[key] = val;
  } else {
    if(!safe){
      delete O[key];
      hide(O, key, val);
    } else {
      if(O[key])O[key] = val;
      else hide(O, key, val);
    }
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString(){
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});
},{"./_core":23,"./_global":38,"./_has":39,"./_hide":40,"./_uid":114}],88:[function(require,module,exports){
module.exports = function(regExp, replace){
  var replacer = replace === Object(replace) ? function(part){
    return replace[part];
  } : replace;
  return function(it){
    return String(it).replace(regExp, replacer);
  };
};
},{}],89:[function(require,module,exports){
// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y){
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};
},{}],90:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = require('./_is-object')
  , anObject = require('./_an-object');
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = require('./_ctx')(Function.call, require('./_object-gopd').f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};
},{"./_an-object":7,"./_ctx":25,"./_is-object":49,"./_object-gopd":70}],91:[function(require,module,exports){
'use strict';
var global      = require('./_global')
  , dP          = require('./_object-dp')
  , DESCRIPTORS = require('./_descriptors')
  , SPECIES     = require('./_wks')('species');

module.exports = function(KEY){
  var C = global[KEY];
  if(DESCRIPTORS && C && !C[SPECIES])dP.f(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};
},{"./_descriptors":28,"./_global":38,"./_object-dp":67,"./_wks":117}],92:[function(require,module,exports){
var def = require('./_object-dp').f
  , has = require('./_has')
  , TAG = require('./_wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
},{"./_has":39,"./_object-dp":67,"./_wks":117}],93:[function(require,module,exports){
var shared = require('./_shared')('keys')
  , uid    = require('./_uid');
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};
},{"./_shared":94,"./_uid":114}],94:[function(require,module,exports){
var global = require('./_global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./_global":38}],95:[function(require,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject  = require('./_an-object')
  , aFunction = require('./_a-function')
  , SPECIES   = require('./_wks')('species');
module.exports = function(O, D){
  var C = anObject(O).constructor, S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};
},{"./_a-function":3,"./_an-object":7,"./_wks":117}],96:[function(require,module,exports){
var fails = require('./_fails');

module.exports = function(method, arg){
  return !!method && fails(function(){
    arg ? method.call(null, function(){}, 1) : method.call(null);
  });
};
},{"./_fails":34}],97:[function(require,module,exports){
var toInteger = require('./_to-integer')
  , defined   = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};
},{"./_defined":27,"./_to-integer":106}],98:[function(require,module,exports){
// helper for String#{startsWith, endsWith, includes}
var isRegExp = require('./_is-regexp')
  , defined  = require('./_defined');

module.exports = function(that, searchString, NAME){
  if(isRegExp(searchString))throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};
},{"./_defined":27,"./_is-regexp":50}],99:[function(require,module,exports){
var $export = require('./_export')
  , fails   = require('./_fails')
  , defined = require('./_defined')
  , quot    = /"/g;
// B.2.3.2.1 CreateHTML(string, tag, attribute, value)
var createHTML = function(string, tag, attribute, value) {
  var S  = String(defined(string))
    , p1 = '<' + tag;
  if(attribute !== '')p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
  return p1 + '>' + S + '</' + tag + '>';
};
module.exports = function(NAME, exec){
  var O = {};
  O[NAME] = exec(createHTML);
  $export($export.P + $export.F * fails(function(){
    var test = ''[NAME]('"');
    return test !== test.toLowerCase() || test.split('"').length > 3;
  }), 'String', O);
};
},{"./_defined":27,"./_export":32,"./_fails":34}],100:[function(require,module,exports){
// https://github.com/tc39/proposal-string-pad-start-end
var toLength = require('./_to-length')
  , repeat   = require('./_string-repeat')
  , defined  = require('./_defined');

module.exports = function(that, maxLength, fillString, left){
  var S            = String(defined(that))
    , stringLength = S.length
    , fillStr      = fillString === undefined ? ' ' : String(fillString)
    , intMaxLength = toLength(maxLength);
  if(intMaxLength <= stringLength || fillStr == '')return S;
  var fillLen = intMaxLength - stringLength
    , stringFiller = repeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
  if(stringFiller.length > fillLen)stringFiller = stringFiller.slice(0, fillLen);
  return left ? stringFiller + S : S + stringFiller;
};

},{"./_defined":27,"./_string-repeat":101,"./_to-length":108}],101:[function(require,module,exports){
'use strict';
var toInteger = require('./_to-integer')
  , defined   = require('./_defined');

module.exports = function repeat(count){
  var str = String(defined(this))
    , res = ''
    , n   = toInteger(count);
  if(n < 0 || n == Infinity)throw RangeError("Count can't be negative");
  for(;n > 0; (n >>>= 1) && (str += str))if(n & 1)res += str;
  return res;
};
},{"./_defined":27,"./_to-integer":106}],102:[function(require,module,exports){
var $export = require('./_export')
  , defined = require('./_defined')
  , fails   = require('./_fails')
  , spaces  = require('./_string-ws')
  , space   = '[' + spaces + ']'
  , non     = '\u200b\u0085'
  , ltrim   = RegExp('^' + space + space + '*')
  , rtrim   = RegExp(space + space + '*$');

var exporter = function(KEY, exec, ALIAS){
  var exp   = {};
  var FORCE = fails(function(){
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if(ALIAS)exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function(string, TYPE){
  string = String(defined(string));
  if(TYPE & 1)string = string.replace(ltrim, '');
  if(TYPE & 2)string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;
},{"./_defined":27,"./_export":32,"./_fails":34,"./_string-ws":103}],103:[function(require,module,exports){
module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';
},{}],104:[function(require,module,exports){
var ctx                = require('./_ctx')
  , invoke             = require('./_invoke')
  , html               = require('./_html')
  , cel                = require('./_dom-create')
  , global             = require('./_global')
  , process            = global.process
  , setTask            = global.setImmediate
  , clearTask          = global.clearImmediate
  , MessageChannel     = global.MessageChannel
  , counter            = 0
  , queue              = {}
  , ONREADYSTATECHANGE = 'onreadystatechange'
  , defer, channel, port;
var run = function(){
  var id = +this;
  if(queue.hasOwnProperty(id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function(event){
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!setTask || !clearTask){
  setTask = function setImmediate(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(require('./_cof')(process) == 'process'){
    defer = function(id){
      process.nextTick(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if(MessageChannel){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
    defer = function(id){
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if(ONREADYSTATECHANGE in cel('script')){
    defer = function(id){
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set:   setTask,
  clear: clearTask
};
},{"./_cof":18,"./_ctx":25,"./_dom-create":29,"./_global":38,"./_html":41,"./_invoke":44}],105:[function(require,module,exports){
var toInteger = require('./_to-integer')
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};
},{"./_to-integer":106}],106:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],107:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject')
  , defined = require('./_defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./_defined":27,"./_iobject":45}],108:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer')
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"./_to-integer":106}],109:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function(it){
  return Object(defined(it));
};
},{"./_defined":27}],110:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};
},{"./_is-object":49}],111:[function(require,module,exports){
'use strict';
if(require('./_descriptors')){
  var LIBRARY             = require('./_library')
    , global              = require('./_global')
    , fails               = require('./_fails')
    , $export             = require('./_export')
    , $typed              = require('./_typed')
    , $buffer             = require('./_typed-buffer')
    , ctx                 = require('./_ctx')
    , anInstance          = require('./_an-instance')
    , propertyDesc        = require('./_property-desc')
    , hide                = require('./_hide')
    , redefineAll         = require('./_redefine-all')
    , toInteger           = require('./_to-integer')
    , toLength            = require('./_to-length')
    , toIndex             = require('./_to-index')
    , toPrimitive         = require('./_to-primitive')
    , has                 = require('./_has')
    , same                = require('./_same-value')
    , classof             = require('./_classof')
    , isObject            = require('./_is-object')
    , toObject            = require('./_to-object')
    , isArrayIter         = require('./_is-array-iter')
    , create              = require('./_object-create')
    , getPrototypeOf      = require('./_object-gpo')
    , gOPN                = require('./_object-gopn').f
    , getIterFn           = require('./core.get-iterator-method')
    , uid                 = require('./_uid')
    , wks                 = require('./_wks')
    , createArrayMethod   = require('./_array-methods')
    , createArrayIncludes = require('./_array-includes')
    , speciesConstructor  = require('./_species-constructor')
    , ArrayIterators      = require('./es6.array.iterator')
    , Iterators           = require('./_iterators')
    , $iterDetect         = require('./_iter-detect')
    , setSpecies          = require('./_set-species')
    , arrayFill           = require('./_array-fill')
    , arrayCopyWithin     = require('./_array-copy-within')
    , $DP                 = require('./_object-dp')
    , $GOPD               = require('./_object-gopd')
    , dP                  = $DP.f
    , gOPD                = $GOPD.f
    , RangeError          = global.RangeError
    , TypeError           = global.TypeError
    , Uint8Array          = global.Uint8Array
    , ARRAY_BUFFER        = 'ArrayBuffer'
    , SHARED_BUFFER       = 'Shared' + ARRAY_BUFFER
    , BYTES_PER_ELEMENT   = 'BYTES_PER_ELEMENT'
    , PROTOTYPE           = 'prototype'
    , ArrayProto          = Array[PROTOTYPE]
    , $ArrayBuffer        = $buffer.ArrayBuffer
    , $DataView           = $buffer.DataView
    , arrayForEach        = createArrayMethod(0)
    , arrayFilter         = createArrayMethod(2)
    , arraySome           = createArrayMethod(3)
    , arrayEvery          = createArrayMethod(4)
    , arrayFind           = createArrayMethod(5)
    , arrayFindIndex      = createArrayMethod(6)
    , arrayIncludes       = createArrayIncludes(true)
    , arrayIndexOf        = createArrayIncludes(false)
    , arrayValues         = ArrayIterators.values
    , arrayKeys           = ArrayIterators.keys
    , arrayEntries        = ArrayIterators.entries
    , arrayLastIndexOf    = ArrayProto.lastIndexOf
    , arrayReduce         = ArrayProto.reduce
    , arrayReduceRight    = ArrayProto.reduceRight
    , arrayJoin           = ArrayProto.join
    , arraySort           = ArrayProto.sort
    , arraySlice          = ArrayProto.slice
    , arrayToString       = ArrayProto.toString
    , arrayToLocaleString = ArrayProto.toLocaleString
    , ITERATOR            = wks('iterator')
    , TAG                 = wks('toStringTag')
    , TYPED_CONSTRUCTOR   = uid('typed_constructor')
    , DEF_CONSTRUCTOR     = uid('def_constructor')
    , ALL_CONSTRUCTORS    = $typed.CONSTR
    , TYPED_ARRAY         = $typed.TYPED
    , VIEW                = $typed.VIEW
    , WRONG_LENGTH        = 'Wrong length!';

  var $map = createArrayMethod(1, function(O, length){
    return allocate(speciesConstructor(O, O[DEF_CONSTRUCTOR]), length);
  });

  var LITTLE_ENDIAN = fails(function(){
    return new Uint8Array(new Uint16Array([1]).buffer)[0] === 1;
  });

  var FORCED_SET = !!Uint8Array && !!Uint8Array[PROTOTYPE].set && fails(function(){
    new Uint8Array(1).set({});
  });

  var strictToLength = function(it, SAME){
    if(it === undefined)throw TypeError(WRONG_LENGTH);
    var number = +it
      , length = toLength(it);
    if(SAME && !same(number, length))throw RangeError(WRONG_LENGTH);
    return length;
  };

  var toOffset = function(it, BYTES){
    var offset = toInteger(it);
    if(offset < 0 || offset % BYTES)throw RangeError('Wrong offset!');
    return offset;
  };

  var validate = function(it){
    if(isObject(it) && TYPED_ARRAY in it)return it;
    throw TypeError(it + ' is not a typed array!');
  };

  var allocate = function(C, length){
    if(!(isObject(C) && TYPED_CONSTRUCTOR in C)){
      throw TypeError('It is not a typed array constructor!');
    } return new C(length);
  };

  var speciesFromList = function(O, list){
    return fromList(speciesConstructor(O, O[DEF_CONSTRUCTOR]), list);
  };

  var fromList = function(C, list){
    var index  = 0
      , length = list.length
      , result = allocate(C, length);
    while(length > index)result[index] = list[index++];
    return result;
  };

  var addGetter = function(it, key, internal){
    dP(it, key, {get: function(){ return this._d[internal]; }});
  };

  var $from = function from(source /*, mapfn, thisArg */){
    var O       = toObject(source)
      , aLen    = arguments.length
      , mapfn   = aLen > 1 ? arguments[1] : undefined
      , mapping = mapfn !== undefined
      , iterFn  = getIterFn(O)
      , i, length, values, result, step, iterator;
    if(iterFn != undefined && !isArrayIter(iterFn)){
      for(iterator = iterFn.call(O), values = [], i = 0; !(step = iterator.next()).done; i++){
        values.push(step.value);
      } O = values;
    }
    if(mapping && aLen > 2)mapfn = ctx(mapfn, arguments[2], 2);
    for(i = 0, length = toLength(O.length), result = allocate(this, length); length > i; i++){
      result[i] = mapping ? mapfn(O[i], i) : O[i];
    }
    return result;
  };

  var $of = function of(/*...items*/){
    var index  = 0
      , length = arguments.length
      , result = allocate(this, length);
    while(length > index)result[index] = arguments[index++];
    return result;
  };

  // iOS Safari 6.x fails here
  var TO_LOCALE_BUG = !!Uint8Array && fails(function(){ arrayToLocaleString.call(new Uint8Array(1)); });

  var $toLocaleString = function toLocaleString(){
    return arrayToLocaleString.apply(TO_LOCALE_BUG ? arraySlice.call(validate(this)) : validate(this), arguments);
  };

  var proto = {
    copyWithin: function copyWithin(target, start /*, end */){
      return arrayCopyWithin.call(validate(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
    },
    every: function every(callbackfn /*, thisArg */){
      return arrayEvery(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    fill: function fill(value /*, start, end */){ // eslint-disable-line no-unused-vars
      return arrayFill.apply(validate(this), arguments);
    },
    filter: function filter(callbackfn /*, thisArg */){
      return speciesFromList(this, arrayFilter(validate(this), callbackfn,
        arguments.length > 1 ? arguments[1] : undefined));
    },
    find: function find(predicate /*, thisArg */){
      return arrayFind(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    findIndex: function findIndex(predicate /*, thisArg */){
      return arrayFindIndex(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    forEach: function forEach(callbackfn /*, thisArg */){
      arrayForEach(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    indexOf: function indexOf(searchElement /*, fromIndex */){
      return arrayIndexOf(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    includes: function includes(searchElement /*, fromIndex */){
      return arrayIncludes(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    join: function join(separator){ // eslint-disable-line no-unused-vars
      return arrayJoin.apply(validate(this), arguments);
    },
    lastIndexOf: function lastIndexOf(searchElement /*, fromIndex */){ // eslint-disable-line no-unused-vars
      return arrayLastIndexOf.apply(validate(this), arguments);
    },
    map: function map(mapfn /*, thisArg */){
      return $map(validate(this), mapfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    reduce: function reduce(callbackfn /*, initialValue */){ // eslint-disable-line no-unused-vars
      return arrayReduce.apply(validate(this), arguments);
    },
    reduceRight: function reduceRight(callbackfn /*, initialValue */){ // eslint-disable-line no-unused-vars
      return arrayReduceRight.apply(validate(this), arguments);
    },
    reverse: function reverse(){
      var that   = this
        , length = validate(that).length
        , middle = Math.floor(length / 2)
        , index  = 0
        , value;
      while(index < middle){
        value         = that[index];
        that[index++] = that[--length];
        that[length]  = value;
      } return that;
    },
    some: function some(callbackfn /*, thisArg */){
      return arraySome(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    sort: function sort(comparefn){
      return arraySort.call(validate(this), comparefn);
    },
    subarray: function subarray(begin, end){
      var O      = validate(this)
        , length = O.length
        , $begin = toIndex(begin, length);
      return new (speciesConstructor(O, O[DEF_CONSTRUCTOR]))(
        O.buffer,
        O.byteOffset + $begin * O.BYTES_PER_ELEMENT,
        toLength((end === undefined ? length : toIndex(end, length)) - $begin)
      );
    }
  };

  var $slice = function slice(start, end){
    return speciesFromList(this, arraySlice.call(validate(this), start, end));
  };

  var $set = function set(arrayLike /*, offset */){
    validate(this);
    var offset = toOffset(arguments[1], 1)
      , length = this.length
      , src    = toObject(arrayLike)
      , len    = toLength(src.length)
      , index  = 0;
    if(len + offset > length)throw RangeError(WRONG_LENGTH);
    while(index < len)this[offset + index] = src[index++];
  };

  var $iterators = {
    entries: function entries(){
      return arrayEntries.call(validate(this));
    },
    keys: function keys(){
      return arrayKeys.call(validate(this));
    },
    values: function values(){
      return arrayValues.call(validate(this));
    }
  };

  var isTAIndex = function(target, key){
    return isObject(target)
      && target[TYPED_ARRAY]
      && typeof key != 'symbol'
      && key in target
      && String(+key) == String(key);
  };
  var $getDesc = function getOwnPropertyDescriptor(target, key){
    return isTAIndex(target, key = toPrimitive(key, true))
      ? propertyDesc(2, target[key])
      : gOPD(target, key);
  };
  var $setDesc = function defineProperty(target, key, desc){
    if(isTAIndex(target, key = toPrimitive(key, true))
      && isObject(desc)
      && has(desc, 'value')
      && !has(desc, 'get')
      && !has(desc, 'set')
      // TODO: add validation descriptor w/o calling accessors
      && !desc.configurable
      && (!has(desc, 'writable') || desc.writable)
      && (!has(desc, 'enumerable') || desc.enumerable)
    ){
      target[key] = desc.value;
      return target;
    } else return dP(target, key, desc);
  };

  if(!ALL_CONSTRUCTORS){
    $GOPD.f = $getDesc;
    $DP.f   = $setDesc;
  }

  $export($export.S + $export.F * !ALL_CONSTRUCTORS, 'Object', {
    getOwnPropertyDescriptor: $getDesc,
    defineProperty:           $setDesc
  });

  if(fails(function(){ arrayToString.call({}); })){
    arrayToString = arrayToLocaleString = function toString(){
      return arrayJoin.call(this);
    }
  }

  var $TypedArrayPrototype$ = redefineAll({}, proto);
  redefineAll($TypedArrayPrototype$, $iterators);
  hide($TypedArrayPrototype$, ITERATOR, $iterators.values);
  redefineAll($TypedArrayPrototype$, {
    slice:          $slice,
    set:            $set,
    constructor:    function(){ /* noop */ },
    toString:       arrayToString,
    toLocaleString: $toLocaleString
  });
  addGetter($TypedArrayPrototype$, 'buffer', 'b');
  addGetter($TypedArrayPrototype$, 'byteOffset', 'o');
  addGetter($TypedArrayPrototype$, 'byteLength', 'l');
  addGetter($TypedArrayPrototype$, 'length', 'e');
  dP($TypedArrayPrototype$, TAG, {
    get: function(){ return this[TYPED_ARRAY]; }
  });

  module.exports = function(KEY, BYTES, wrapper, CLAMPED){
    CLAMPED = !!CLAMPED;
    var NAME       = KEY + (CLAMPED ? 'Clamped' : '') + 'Array'
      , ISNT_UINT8 = NAME != 'Uint8Array'
      , GETTER     = 'get' + KEY
      , SETTER     = 'set' + KEY
      , TypedArray = global[NAME]
      , Base       = TypedArray || {}
      , TAC        = TypedArray && getPrototypeOf(TypedArray)
      , FORCED     = !TypedArray || !$typed.ABV
      , O          = {}
      , TypedArrayPrototype = TypedArray && TypedArray[PROTOTYPE];
    var getter = function(that, index){
      var data = that._d;
      return data.v[GETTER](index * BYTES + data.o, LITTLE_ENDIAN);
    };
    var setter = function(that, index, value){
      var data = that._d;
      if(CLAMPED)value = (value = Math.round(value)) < 0 ? 0 : value > 0xff ? 0xff : value & 0xff;
      data.v[SETTER](index * BYTES + data.o, value, LITTLE_ENDIAN);
    };
    var addElement = function(that, index){
      dP(that, index, {
        get: function(){
          return getter(this, index);
        },
        set: function(value){
          return setter(this, index, value);
        },
        enumerable: true
      });
    };
    if(FORCED){
      TypedArray = wrapper(function(that, data, $offset, $length){
        anInstance(that, TypedArray, NAME, '_d');
        var index  = 0
          , offset = 0
          , buffer, byteLength, length, klass;
        if(!isObject(data)){
          length     = strictToLength(data, true)
          byteLength = length * BYTES;
          buffer     = new $ArrayBuffer(byteLength);
        } else if(data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER){
          buffer = data;
          offset = toOffset($offset, BYTES);
          var $len = data.byteLength;
          if($length === undefined){
            if($len % BYTES)throw RangeError(WRONG_LENGTH);
            byteLength = $len - offset;
            if(byteLength < 0)throw RangeError(WRONG_LENGTH);
          } else {
            byteLength = toLength($length) * BYTES;
            if(byteLength + offset > $len)throw RangeError(WRONG_LENGTH);
          }
          length = byteLength / BYTES;
        } else if(TYPED_ARRAY in data){
          return fromList(TypedArray, data);
        } else {
          return $from.call(TypedArray, data);
        }
        hide(that, '_d', {
          b: buffer,
          o: offset,
          l: byteLength,
          e: length,
          v: new $DataView(buffer)
        });
        while(index < length)addElement(that, index++);
      });
      TypedArrayPrototype = TypedArray[PROTOTYPE] = create($TypedArrayPrototype$);
      hide(TypedArrayPrototype, 'constructor', TypedArray);
    } else if(!$iterDetect(function(iter){
      // V8 works with iterators, but fails in many other cases
      // https://code.google.com/p/v8/issues/detail?id=4552
      new TypedArray(null); // eslint-disable-line no-new
      new TypedArray(iter); // eslint-disable-line no-new
    }, true)){
      TypedArray = wrapper(function(that, data, $offset, $length){
        anInstance(that, TypedArray, NAME);
        var klass;
        // `ws` module bug, temporarily remove validation length for Uint8Array
        // https://github.com/websockets/ws/pull/645
        if(!isObject(data))return new Base(strictToLength(data, ISNT_UINT8));
        if(data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER){
          return $length !== undefined
            ? new Base(data, toOffset($offset, BYTES), $length)
            : $offset !== undefined
              ? new Base(data, toOffset($offset, BYTES))
              : new Base(data);
        }
        if(TYPED_ARRAY in data)return fromList(TypedArray, data);
        return $from.call(TypedArray, data);
      });
      arrayForEach(TAC !== Function.prototype ? gOPN(Base).concat(gOPN(TAC)) : gOPN(Base), function(key){
        if(!(key in TypedArray))hide(TypedArray, key, Base[key]);
      });
      TypedArray[PROTOTYPE] = TypedArrayPrototype;
      if(!LIBRARY)TypedArrayPrototype.constructor = TypedArray;
    }
    var $nativeIterator   = TypedArrayPrototype[ITERATOR]
      , CORRECT_ITER_NAME = !!$nativeIterator && ($nativeIterator.name == 'values' || $nativeIterator.name == undefined)
      , $iterator         = $iterators.values;
    hide(TypedArray, TYPED_CONSTRUCTOR, true);
    hide(TypedArrayPrototype, TYPED_ARRAY, NAME);
    hide(TypedArrayPrototype, VIEW, true);
    hide(TypedArrayPrototype, DEF_CONSTRUCTOR, TypedArray);

    if(CLAMPED ? new TypedArray(1)[TAG] != NAME : !(TAG in TypedArrayPrototype)){
      dP(TypedArrayPrototype, TAG, {
        get: function(){ return NAME; }
      });
    }

    O[NAME] = TypedArray;

    $export($export.G + $export.W + $export.F * (TypedArray != Base), O);

    $export($export.S, NAME, {
      BYTES_PER_ELEMENT: BYTES,
      from: $from,
      of: $of
    });

    if(!(BYTES_PER_ELEMENT in TypedArrayPrototype))hide(TypedArrayPrototype, BYTES_PER_ELEMENT, BYTES);

    $export($export.P, NAME, proto);

    setSpecies(NAME);

    $export($export.P + $export.F * FORCED_SET, NAME, {set: $set});

    $export($export.P + $export.F * !CORRECT_ITER_NAME, NAME, $iterators);

    $export($export.P + $export.F * (TypedArrayPrototype.toString != arrayToString), NAME, {toString: arrayToString});

    $export($export.P + $export.F * fails(function(){
      new TypedArray(1).slice();
    }), NAME, {slice: $slice});

    $export($export.P + $export.F * (fails(function(){
      return [1, 2].toLocaleString() != new TypedArray([1, 2]).toLocaleString()
    }) || !fails(function(){
      TypedArrayPrototype.toLocaleString.call([1, 2]);
    })), NAME, {toLocaleString: $toLocaleString});

    Iterators[NAME] = CORRECT_ITER_NAME ? $nativeIterator : $iterator;
    if(!LIBRARY && !CORRECT_ITER_NAME)hide(TypedArrayPrototype, ITERATOR, $iterator);
  };
} else module.exports = function(){ /* empty */ };
},{"./_an-instance":6,"./_array-copy-within":8,"./_array-fill":9,"./_array-includes":11,"./_array-methods":12,"./_classof":17,"./_ctx":25,"./_descriptors":28,"./_export":32,"./_fails":34,"./_global":38,"./_has":39,"./_hide":40,"./_is-array-iter":46,"./_is-object":49,"./_iter-detect":54,"./_iterators":56,"./_library":58,"./_object-create":66,"./_object-dp":67,"./_object-gopd":70,"./_object-gopn":72,"./_object-gpo":74,"./_property-desc":85,"./_redefine-all":86,"./_same-value":89,"./_set-species":91,"./_species-constructor":95,"./_to-index":105,"./_to-integer":106,"./_to-length":108,"./_to-object":109,"./_to-primitive":110,"./_typed":113,"./_typed-buffer":112,"./_uid":114,"./_wks":117,"./core.get-iterator-method":118,"./es6.array.iterator":130}],112:[function(require,module,exports){
'use strict';
var global         = require('./_global')
  , DESCRIPTORS    = require('./_descriptors')
  , LIBRARY        = require('./_library')
  , $typed         = require('./_typed')
  , hide           = require('./_hide')
  , redefineAll    = require('./_redefine-all')
  , fails          = require('./_fails')
  , anInstance     = require('./_an-instance')
  , toInteger      = require('./_to-integer')
  , toLength       = require('./_to-length')
  , gOPN           = require('./_object-gopn').f
  , dP             = require('./_object-dp').f
  , arrayFill      = require('./_array-fill')
  , setToStringTag = require('./_set-to-string-tag')
  , ARRAY_BUFFER   = 'ArrayBuffer'
  , DATA_VIEW      = 'DataView'
  , PROTOTYPE      = 'prototype'
  , WRONG_LENGTH   = 'Wrong length!'
  , WRONG_INDEX    = 'Wrong index!'
  , $ArrayBuffer   = global[ARRAY_BUFFER]
  , $DataView      = global[DATA_VIEW]
  , Math           = global.Math
  , RangeError     = global.RangeError
  , Infinity       = global.Infinity
  , BaseBuffer     = $ArrayBuffer
  , abs            = Math.abs
  , pow            = Math.pow
  , floor          = Math.floor
  , log            = Math.log
  , LN2            = Math.LN2
  , BUFFER         = 'buffer'
  , BYTE_LENGTH    = 'byteLength'
  , BYTE_OFFSET    = 'byteOffset'
  , $BUFFER        = DESCRIPTORS ? '_b' : BUFFER
  , $LENGTH        = DESCRIPTORS ? '_l' : BYTE_LENGTH
  , $OFFSET        = DESCRIPTORS ? '_o' : BYTE_OFFSET;

// IEEE754 conversions based on https://github.com/feross/ieee754
var packIEEE754 = function(value, mLen, nBytes){
  var buffer = Array(nBytes)
    , eLen   = nBytes * 8 - mLen - 1
    , eMax   = (1 << eLen) - 1
    , eBias  = eMax >> 1
    , rt     = mLen === 23 ? pow(2, -24) - pow(2, -77) : 0
    , i      = 0
    , s      = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0
    , e, m, c;
  value = abs(value)
  if(value != value || value === Infinity){
    m = value != value ? 1 : 0;
    e = eMax;
  } else {
    e = floor(log(value) / LN2);
    if(value * (c = pow(2, -e)) < 1){
      e--;
      c *= 2;
    }
    if(e + eBias >= 1){
      value += rt / c;
    } else {
      value += rt * pow(2, 1 - eBias);
    }
    if(value * c >= 2){
      e++;
      c /= 2;
    }
    if(e + eBias >= eMax){
      m = 0;
      e = eMax;
    } else if(e + eBias >= 1){
      m = (value * c - 1) * pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * pow(2, eBias - 1) * pow(2, mLen);
      e = 0;
    }
  }
  for(; mLen >= 8; buffer[i++] = m & 255, m /= 256, mLen -= 8);
  e = e << mLen | m;
  eLen += mLen;
  for(; eLen > 0; buffer[i++] = e & 255, e /= 256, eLen -= 8);
  buffer[--i] |= s * 128;
  return buffer;
};
var unpackIEEE754 = function(buffer, mLen, nBytes){
  var eLen  = nBytes * 8 - mLen - 1
    , eMax  = (1 << eLen) - 1
    , eBias = eMax >> 1
    , nBits = eLen - 7
    , i     = nBytes - 1
    , s     = buffer[i--]
    , e     = s & 127
    , m;
  s >>= 7;
  for(; nBits > 0; e = e * 256 + buffer[i], i--, nBits -= 8);
  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for(; nBits > 0; m = m * 256 + buffer[i], i--, nBits -= 8);
  if(e === 0){
    e = 1 - eBias;
  } else if(e === eMax){
    return m ? NaN : s ? -Infinity : Infinity;
  } else {
    m = m + pow(2, mLen);
    e = e - eBias;
  } return (s ? -1 : 1) * m * pow(2, e - mLen);
};

var unpackI32 = function(bytes){
  return bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
};
var packI8 = function(it){
  return [it & 0xff];
};
var packI16 = function(it){
  return [it & 0xff, it >> 8 & 0xff];
};
var packI32 = function(it){
  return [it & 0xff, it >> 8 & 0xff, it >> 16 & 0xff, it >> 24 & 0xff];
};
var packF64 = function(it){
  return packIEEE754(it, 52, 8);
};
var packF32 = function(it){
  return packIEEE754(it, 23, 4);
};

var addGetter = function(C, key, internal){
  dP(C[PROTOTYPE], key, {get: function(){ return this[internal]; }});
};

var get = function(view, bytes, index, isLittleEndian){
  var numIndex = +index
    , intIndex = toInteger(numIndex);
  if(numIndex != intIndex || intIndex < 0 || intIndex + bytes > view[$LENGTH])throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b
    , start = intIndex + view[$OFFSET]
    , pack  = store.slice(start, start + bytes);
  return isLittleEndian ? pack : pack.reverse();
};
var set = function(view, bytes, index, conversion, value, isLittleEndian){
  var numIndex = +index
    , intIndex = toInteger(numIndex);
  if(numIndex != intIndex || intIndex < 0 || intIndex + bytes > view[$LENGTH])throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b
    , start = intIndex + view[$OFFSET]
    , pack  = conversion(+value);
  for(var i = 0; i < bytes; i++)store[start + i] = pack[isLittleEndian ? i : bytes - i - 1];
};

var validateArrayBufferArguments = function(that, length){
  anInstance(that, $ArrayBuffer, ARRAY_BUFFER);
  var numberLength = +length
    , byteLength   = toLength(numberLength);
  if(numberLength != byteLength)throw RangeError(WRONG_LENGTH);
  return byteLength;
};

if(!$typed.ABV){
  $ArrayBuffer = function ArrayBuffer(length){
    var byteLength = validateArrayBufferArguments(this, length);
    this._b       = arrayFill.call(Array(byteLength), 0);
    this[$LENGTH] = byteLength;
  };

  $DataView = function DataView(buffer, byteOffset, byteLength){
    anInstance(this, $DataView, DATA_VIEW);
    anInstance(buffer, $ArrayBuffer, DATA_VIEW);
    var bufferLength = buffer[$LENGTH]
      , offset       = toInteger(byteOffset);
    if(offset < 0 || offset > bufferLength)throw RangeError('Wrong offset!');
    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
    if(offset + byteLength > bufferLength)throw RangeError(WRONG_LENGTH);
    this[$BUFFER] = buffer;
    this[$OFFSET] = offset;
    this[$LENGTH] = byteLength;
  };

  if(DESCRIPTORS){
    addGetter($ArrayBuffer, BYTE_LENGTH, '_l');
    addGetter($DataView, BUFFER, '_b');
    addGetter($DataView, BYTE_LENGTH, '_l');
    addGetter($DataView, BYTE_OFFSET, '_o');
  }

  redefineAll($DataView[PROTOTYPE], {
    getInt8: function getInt8(byteOffset){
      return get(this, 1, byteOffset)[0] << 24 >> 24;
    },
    getUint8: function getUint8(byteOffset){
      return get(this, 1, byteOffset)[0];
    },
    getInt16: function getInt16(byteOffset /*, littleEndian */){
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
    },
    getUint16: function getUint16(byteOffset /*, littleEndian */){
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return bytes[1] << 8 | bytes[0];
    },
    getInt32: function getInt32(byteOffset /*, littleEndian */){
      return unpackI32(get(this, 4, byteOffset, arguments[1]));
    },
    getUint32: function getUint32(byteOffset /*, littleEndian */){
      return unpackI32(get(this, 4, byteOffset, arguments[1])) >>> 0;
    },
    getFloat32: function getFloat32(byteOffset /*, littleEndian */){
      return unpackIEEE754(get(this, 4, byteOffset, arguments[1]), 23, 4);
    },
    getFloat64: function getFloat64(byteOffset /*, littleEndian */){
      return unpackIEEE754(get(this, 8, byteOffset, arguments[1]), 52, 8);
    },
    setInt8: function setInt8(byteOffset, value){
      set(this, 1, byteOffset, packI8, value);
    },
    setUint8: function setUint8(byteOffset, value){
      set(this, 1, byteOffset, packI8, value);
    },
    setInt16: function setInt16(byteOffset, value /*, littleEndian */){
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setUint16: function setUint16(byteOffset, value /*, littleEndian */){
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setInt32: function setInt32(byteOffset, value /*, littleEndian */){
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setUint32: function setUint32(byteOffset, value /*, littleEndian */){
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setFloat32: function setFloat32(byteOffset, value /*, littleEndian */){
      set(this, 4, byteOffset, packF32, value, arguments[2]);
    },
    setFloat64: function setFloat64(byteOffset, value /*, littleEndian */){
      set(this, 8, byteOffset, packF64, value, arguments[2]);
    }
  });
} else {
  if(!fails(function(){
    new $ArrayBuffer;     // eslint-disable-line no-new
  }) || !fails(function(){
    new $ArrayBuffer(.5); // eslint-disable-line no-new
  })){
    $ArrayBuffer = function ArrayBuffer(length){
      return new BaseBuffer(validateArrayBufferArguments(this, length));
    };
    var ArrayBufferProto = $ArrayBuffer[PROTOTYPE] = BaseBuffer[PROTOTYPE];
    for(var keys = gOPN(BaseBuffer), j = 0, key; keys.length > j; ){
      if(!((key = keys[j++]) in $ArrayBuffer))hide($ArrayBuffer, key, BaseBuffer[key]);
    };
    if(!LIBRARY)ArrayBufferProto.constructor = $ArrayBuffer;
  }
  // iOS Safari 7.x bug
  var view = new $DataView(new $ArrayBuffer(2))
    , $setInt8 = $DataView[PROTOTYPE].setInt8;
  view.setInt8(0, 2147483648);
  view.setInt8(1, 2147483649);
  if(view.getInt8(0) || !view.getInt8(1))redefineAll($DataView[PROTOTYPE], {
    setInt8: function setInt8(byteOffset, value){
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    },
    setUint8: function setUint8(byteOffset, value){
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    }
  }, true);
}
setToStringTag($ArrayBuffer, ARRAY_BUFFER);
setToStringTag($DataView, DATA_VIEW);
hide($DataView[PROTOTYPE], $typed.VIEW, true);
exports[ARRAY_BUFFER] = $ArrayBuffer;
exports[DATA_VIEW] = $DataView;
},{"./_an-instance":6,"./_array-fill":9,"./_descriptors":28,"./_fails":34,"./_global":38,"./_hide":40,"./_library":58,"./_object-dp":67,"./_object-gopn":72,"./_redefine-all":86,"./_set-to-string-tag":92,"./_to-integer":106,"./_to-length":108,"./_typed":113}],113:[function(require,module,exports){
var global = require('./_global')
  , hide   = require('./_hide')
  , uid    = require('./_uid')
  , TYPED  = uid('typed_array')
  , VIEW   = uid('view')
  , ABV    = !!(global.ArrayBuffer && global.DataView)
  , CONSTR = ABV
  , i = 0, l = 9, Typed;

var TypedArrayConstructors = (
  'Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array'
).split(',');

while(i < l){
  if(Typed = global[TypedArrayConstructors[i++]]){
    hide(Typed.prototype, TYPED, true);
    hide(Typed.prototype, VIEW, true);
  } else CONSTR = false;
}

module.exports = {
  ABV:    ABV,
  CONSTR: CONSTR,
  TYPED:  TYPED,
  VIEW:   VIEW
};
},{"./_global":38,"./_hide":40,"./_uid":114}],114:[function(require,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],115:[function(require,module,exports){
var global         = require('./_global')
  , core           = require('./_core')
  , LIBRARY        = require('./_library')
  , wksExt         = require('./_wks-ext')
  , defineProperty = require('./_object-dp').f;
module.exports = function(name){
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
};
},{"./_core":23,"./_global":38,"./_library":58,"./_object-dp":67,"./_wks-ext":116}],116:[function(require,module,exports){
exports.f = require('./_wks');
},{"./_wks":117}],117:[function(require,module,exports){
var store      = require('./_shared')('wks')
  , uid        = require('./_uid')
  , Symbol     = require('./_global').Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;
},{"./_global":38,"./_shared":94,"./_uid":114}],118:[function(require,module,exports){
var classof   = require('./_classof')
  , ITERATOR  = require('./_wks')('iterator')
  , Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};
},{"./_classof":17,"./_core":23,"./_iterators":56,"./_wks":117}],119:[function(require,module,exports){
// https://github.com/benjamingr/RexExp.escape
var $export = require('./_export')
  , $re     = require('./_replacer')(/[\\^$*+?.()|[\]{}]/g, '\\$&');

$export($export.S, 'RegExp', {escape: function escape(it){ return $re(it); }});

},{"./_export":32,"./_replacer":88}],120:[function(require,module,exports){
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
var $export = require('./_export');

$export($export.P, 'Array', {copyWithin: require('./_array-copy-within')});

require('./_add-to-unscopables')('copyWithin');
},{"./_add-to-unscopables":5,"./_array-copy-within":8,"./_export":32}],121:[function(require,module,exports){
'use strict';
var $export = require('./_export')
  , $every  = require('./_array-methods')(4);

$export($export.P + $export.F * !require('./_strict-method')([].every, true), 'Array', {
  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
  every: function every(callbackfn /* , thisArg */){
    return $every(this, callbackfn, arguments[1]);
  }
});
},{"./_array-methods":12,"./_export":32,"./_strict-method":96}],122:[function(require,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
var $export = require('./_export');

$export($export.P, 'Array', {fill: require('./_array-fill')});

require('./_add-to-unscopables')('fill');
},{"./_add-to-unscopables":5,"./_array-fill":9,"./_export":32}],123:[function(require,module,exports){
'use strict';
var $export = require('./_export')
  , $filter = require('./_array-methods')(2);

$export($export.P + $export.F * !require('./_strict-method')([].filter, true), 'Array', {
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: function filter(callbackfn /* , thisArg */){
    return $filter(this, callbackfn, arguments[1]);
  }
});
},{"./_array-methods":12,"./_export":32,"./_strict-method":96}],124:[function(require,module,exports){
'use strict';
// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var $export = require('./_export')
  , $find   = require('./_array-methods')(6)
  , KEY     = 'findIndex'
  , forced  = true;
// Shouldn't skip holes
if(KEY in [])Array(1)[KEY](function(){ forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn/*, that = undefined */){
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./_add-to-unscopables')(KEY);
},{"./_add-to-unscopables":5,"./_array-methods":12,"./_export":32}],125:[function(require,module,exports){
'use strict';
// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = require('./_export')
  , $find   = require('./_array-methods')(5)
  , KEY     = 'find'
  , forced  = true;
// Shouldn't skip holes
if(KEY in [])Array(1)[KEY](function(){ forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn/*, that = undefined */){
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./_add-to-unscopables')(KEY);
},{"./_add-to-unscopables":5,"./_array-methods":12,"./_export":32}],126:[function(require,module,exports){
'use strict';
var $export  = require('./_export')
  , $forEach = require('./_array-methods')(0)
  , STRICT   = require('./_strict-method')([].forEach, true);

$export($export.P + $export.F * !STRICT, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: function forEach(callbackfn /* , thisArg */){
    return $forEach(this, callbackfn, arguments[1]);
  }
});
},{"./_array-methods":12,"./_export":32,"./_strict-method":96}],127:[function(require,module,exports){
'use strict';
var ctx            = require('./_ctx')
  , $export        = require('./_export')
  , toObject       = require('./_to-object')
  , call           = require('./_iter-call')
  , isArrayIter    = require('./_is-array-iter')
  , toLength       = require('./_to-length')
  , createProperty = require('./_create-property')
  , getIterFn      = require('./core.get-iterator-method');

$export($export.S + $export.F * !require('./_iter-detect')(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = toObject(arrayLike)
      , C       = typeof this == 'function' ? this : Array
      , aLen    = arguments.length
      , mapfn   = aLen > 1 ? arguments[1] : undefined
      , mapping = mapfn !== undefined
      , index   = 0
      , iterFn  = getIterFn(O)
      , length, result, step, iterator;
    if(mapping)mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for(result = new C(length); length > index; index++){
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

},{"./_create-property":24,"./_ctx":25,"./_export":32,"./_is-array-iter":46,"./_iter-call":51,"./_iter-detect":54,"./_to-length":108,"./_to-object":109,"./core.get-iterator-method":118}],128:[function(require,module,exports){
'use strict';
var $export       = require('./_export')
  , $indexOf      = require('./_array-includes')(false)
  , $native       = [].indexOf
  , NEGATIVE_ZERO = !!$native && 1 / [1].indexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !require('./_strict-method')($native)), 'Array', {
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: function indexOf(searchElement /*, fromIndex = 0 */){
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? $native.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments[1]);
  }
});
},{"./_array-includes":11,"./_export":32,"./_strict-method":96}],129:[function(require,module,exports){
// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
var $export = require('./_export');

$export($export.S, 'Array', {isArray: require('./_is-array')});
},{"./_export":32,"./_is-array":47}],130:[function(require,module,exports){
'use strict';
var addToUnscopables = require('./_add-to-unscopables')
  , step             = require('./_iter-step')
  , Iterators        = require('./_iterators')
  , toIObject        = require('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./_iter-define')(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');
},{"./_add-to-unscopables":5,"./_iter-define":53,"./_iter-step":55,"./_iterators":56,"./_to-iobject":107}],131:[function(require,module,exports){
'use strict';
// 22.1.3.13 Array.prototype.join(separator)
var $export   = require('./_export')
  , toIObject = require('./_to-iobject')
  , arrayJoin = [].join;

// fallback for not array-like strings
$export($export.P + $export.F * (require('./_iobject') != Object || !require('./_strict-method')(arrayJoin)), 'Array', {
  join: function join(separator){
    return arrayJoin.call(toIObject(this), separator === undefined ? ',' : separator);
  }
});
},{"./_export":32,"./_iobject":45,"./_strict-method":96,"./_to-iobject":107}],132:[function(require,module,exports){
'use strict';
var $export       = require('./_export')
  , toIObject     = require('./_to-iobject')
  , toInteger     = require('./_to-integer')
  , toLength      = require('./_to-length')
  , $native       = [].lastIndexOf
  , NEGATIVE_ZERO = !!$native && 1 / [1].lastIndexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !require('./_strict-method')($native)), 'Array', {
  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
  lastIndexOf: function lastIndexOf(searchElement /*, fromIndex = @[*-1] */){
    // convert -0 to +0
    if(NEGATIVE_ZERO)return $native.apply(this, arguments) || 0;
    var O      = toIObject(this)
      , length = toLength(O.length)
      , index  = length - 1;
    if(arguments.length > 1)index = Math.min(index, toInteger(arguments[1]));
    if(index < 0)index = length + index;
    for(;index >= 0; index--)if(index in O)if(O[index] === searchElement)return index || 0;
    return -1;
  }
});
},{"./_export":32,"./_strict-method":96,"./_to-integer":106,"./_to-iobject":107,"./_to-length":108}],133:[function(require,module,exports){
'use strict';
var $export = require('./_export')
  , $map    = require('./_array-methods')(1);

$export($export.P + $export.F * !require('./_strict-method')([].map, true), 'Array', {
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: function map(callbackfn /* , thisArg */){
    return $map(this, callbackfn, arguments[1]);
  }
});
},{"./_array-methods":12,"./_export":32,"./_strict-method":96}],134:[function(require,module,exports){
'use strict';
var $export        = require('./_export')
  , createProperty = require('./_create-property');

// WebKit Array.of isn't generic
$export($export.S + $export.F * require('./_fails')(function(){
  function F(){}
  return !(Array.of.call(F) instanceof F);
}), 'Array', {
  // 22.1.2.3 Array.of( ...items)
  of: function of(/* ...args */){
    var index  = 0
      , aLen   = arguments.length
      , result = new (typeof this == 'function' ? this : Array)(aLen);
    while(aLen > index)createProperty(result, index, arguments[index++]);
    result.length = aLen;
    return result;
  }
});
},{"./_create-property":24,"./_export":32,"./_fails":34}],135:[function(require,module,exports){
'use strict';
var $export = require('./_export')
  , $reduce = require('./_array-reduce');

$export($export.P + $export.F * !require('./_strict-method')([].reduceRight, true), 'Array', {
  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
  reduceRight: function reduceRight(callbackfn /* , initialValue */){
    return $reduce(this, callbackfn, arguments.length, arguments[1], true);
  }
});
},{"./_array-reduce":13,"./_export":32,"./_strict-method":96}],136:[function(require,module,exports){
'use strict';
var $export = require('./_export')
  , $reduce = require('./_array-reduce');

$export($export.P + $export.F * !require('./_strict-method')([].reduce, true), 'Array', {
  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
  reduce: function reduce(callbackfn /* , initialValue */){
    return $reduce(this, callbackfn, arguments.length, arguments[1], false);
  }
});
},{"./_array-reduce":13,"./_export":32,"./_strict-method":96}],137:[function(require,module,exports){
'use strict';
var $export    = require('./_export')
  , html       = require('./_html')
  , cof        = require('./_cof')
  , toIndex    = require('./_to-index')
  , toLength   = require('./_to-length')
  , arraySlice = [].slice;

// fallback for not array-like ES3 strings and DOM objects
$export($export.P + $export.F * require('./_fails')(function(){
  if(html)arraySlice.call(html);
}), 'Array', {
  slice: function slice(begin, end){
    var len   = toLength(this.length)
      , klass = cof(this);
    end = end === undefined ? len : end;
    if(klass == 'Array')return arraySlice.call(this, begin, end);
    var start  = toIndex(begin, len)
      , upTo   = toIndex(end, len)
      , size   = toLength(upTo - start)
      , cloned = Array(size)
      , i      = 0;
    for(; i < size; i++)cloned[i] = klass == 'String'
      ? this.charAt(start + i)
      : this[start + i];
    return cloned;
  }
});
},{"./_cof":18,"./_export":32,"./_fails":34,"./_html":41,"./_to-index":105,"./_to-length":108}],138:[function(require,module,exports){
'use strict';
var $export = require('./_export')
  , $some   = require('./_array-methods')(3);

$export($export.P + $export.F * !require('./_strict-method')([].some, true), 'Array', {
  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
  some: function some(callbackfn /* , thisArg */){
    return $some(this, callbackfn, arguments[1]);
  }
});
},{"./_array-methods":12,"./_export":32,"./_strict-method":96}],139:[function(require,module,exports){
'use strict';
var $export   = require('./_export')
  , aFunction = require('./_a-function')
  , toObject  = require('./_to-object')
  , fails     = require('./_fails')
  , $sort     = [].sort
  , test      = [1, 2, 3];

$export($export.P + $export.F * (fails(function(){
  // IE8-
  test.sort(undefined);
}) || !fails(function(){
  // V8 bug
  test.sort(null);
  // Old WebKit
}) || !require('./_strict-method')($sort)), 'Array', {
  // 22.1.3.25 Array.prototype.sort(comparefn)
  sort: function sort(comparefn){
    return comparefn === undefined
      ? $sort.call(toObject(this))
      : $sort.call(toObject(this), aFunction(comparefn));
  }
});
},{"./_a-function":3,"./_export":32,"./_fails":34,"./_strict-method":96,"./_to-object":109}],140:[function(require,module,exports){
require('./_set-species')('Array');
},{"./_set-species":91}],141:[function(require,module,exports){
// 20.3.3.1 / 15.9.4.4 Date.now()
var $export = require('./_export');

$export($export.S, 'Date', {now: function(){ return new Date().getTime(); }});
},{"./_export":32}],142:[function(require,module,exports){
'use strict';
// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
var $export = require('./_export')
  , fails   = require('./_fails')
  , getTime = Date.prototype.getTime;

var lz = function(num){
  return num > 9 ? num : '0' + num;
};

// PhantomJS / old WebKit has a broken implementations
$export($export.P + $export.F * (fails(function(){
  return new Date(-5e13 - 1).toISOString() != '0385-07-25T07:06:39.999Z';
}) || !fails(function(){
  new Date(NaN).toISOString();
})), 'Date', {
  toISOString: function toISOString(){
    if(!isFinite(getTime.call(this)))throw RangeError('Invalid time value');
    var d = this
      , y = d.getUTCFullYear()
      , m = d.getUTCMilliseconds()
      , s = y < 0 ? '-' : y > 9999 ? '+' : '';
    return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) +
      '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) +
      'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) +
      ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
  }
});
},{"./_export":32,"./_fails":34}],143:[function(require,module,exports){
'use strict';
var $export     = require('./_export')
  , toObject    = require('./_to-object')
  , toPrimitive = require('./_to-primitive');

$export($export.P + $export.F * require('./_fails')(function(){
  return new Date(NaN).toJSON() !== null || Date.prototype.toJSON.call({toISOString: function(){ return 1; }}) !== 1;
}), 'Date', {
  toJSON: function toJSON(key){
    var O  = toObject(this)
      , pv = toPrimitive(O);
    return typeof pv == 'number' && !isFinite(pv) ? null : O.toISOString();
  }
});
},{"./_export":32,"./_fails":34,"./_to-object":109,"./_to-primitive":110}],144:[function(require,module,exports){
var TO_PRIMITIVE = require('./_wks')('toPrimitive')
  , proto        = Date.prototype;

if(!(TO_PRIMITIVE in proto))require('./_hide')(proto, TO_PRIMITIVE, require('./_date-to-primitive'));
},{"./_date-to-primitive":26,"./_hide":40,"./_wks":117}],145:[function(require,module,exports){
var DateProto    = Date.prototype
  , INVALID_DATE = 'Invalid Date'
  , TO_STRING    = 'toString'
  , $toString    = DateProto[TO_STRING]
  , getTime      = DateProto.getTime;
if(new Date(NaN) + '' != INVALID_DATE){
  require('./_redefine')(DateProto, TO_STRING, function toString(){
    var value = getTime.call(this);
    return value === value ? $toString.call(this) : INVALID_DATE;
  });
}
},{"./_redefine":87}],146:[function(require,module,exports){
// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
var $export = require('./_export');

$export($export.P, 'Function', {bind: require('./_bind')});
},{"./_bind":16,"./_export":32}],147:[function(require,module,exports){
'use strict';
var isObject       = require('./_is-object')
  , getPrototypeOf = require('./_object-gpo')
  , HAS_INSTANCE   = require('./_wks')('hasInstance')
  , FunctionProto  = Function.prototype;
// 19.2.3.6 Function.prototype[@@hasInstance](V)
if(!(HAS_INSTANCE in FunctionProto))require('./_object-dp').f(FunctionProto, HAS_INSTANCE, {value: function(O){
  if(typeof this != 'function' || !isObject(O))return false;
  if(!isObject(this.prototype))return O instanceof this;
  // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
  while(O = getPrototypeOf(O))if(this.prototype === O)return true;
  return false;
}});
},{"./_is-object":49,"./_object-dp":67,"./_object-gpo":74,"./_wks":117}],148:[function(require,module,exports){
var dP         = require('./_object-dp').f
  , createDesc = require('./_property-desc')
  , has        = require('./_has')
  , FProto     = Function.prototype
  , nameRE     = /^\s*function ([^ (]*)/
  , NAME       = 'name';

var isExtensible = Object.isExtensible || function(){
  return true;
};

// 19.2.4.2 name
NAME in FProto || require('./_descriptors') && dP(FProto, NAME, {
  configurable: true,
  get: function(){
    try {
      var that = this
        , name = ('' + that).match(nameRE)[1];
      has(that, NAME) || !isExtensible(that) || dP(that, NAME, createDesc(5, name));
      return name;
    } catch(e){
      return '';
    }
  }
});
},{"./_descriptors":28,"./_has":39,"./_object-dp":67,"./_property-desc":85}],149:[function(require,module,exports){
'use strict';
var strong = require('./_collection-strong');

// 23.1 Map Objects
module.exports = require('./_collection')('Map', function(get){
  return function Map(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key){
    var entry = strong.getEntry(this, key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value){
    return strong.def(this, key === 0 ? 0 : key, value);
  }
}, strong, true);
},{"./_collection":22,"./_collection-strong":19}],150:[function(require,module,exports){
// 20.2.2.3 Math.acosh(x)
var $export = require('./_export')
  , log1p   = require('./_math-log1p')
  , sqrt    = Math.sqrt
  , $acosh  = Math.acosh;

$export($export.S + $export.F * !($acosh
  // V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
  && Math.floor($acosh(Number.MAX_VALUE)) == 710
  // Tor Browser bug: Math.acosh(Infinity) -> NaN 
  && $acosh(Infinity) == Infinity
), 'Math', {
  acosh: function acosh(x){
    return (x = +x) < 1 ? NaN : x > 94906265.62425156
      ? Math.log(x) + Math.LN2
      : log1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
  }
});
},{"./_export":32,"./_math-log1p":60}],151:[function(require,module,exports){
// 20.2.2.5 Math.asinh(x)
var $export = require('./_export')
  , $asinh  = Math.asinh;

function asinh(x){
  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : Math.log(x + Math.sqrt(x * x + 1));
}

// Tor Browser bug: Math.asinh(0) -> -0 
$export($export.S + $export.F * !($asinh && 1 / $asinh(0) > 0), 'Math', {asinh: asinh});
},{"./_export":32}],152:[function(require,module,exports){
// 20.2.2.7 Math.atanh(x)
var $export = require('./_export')
  , $atanh  = Math.atanh;

// Tor Browser bug: Math.atanh(-0) -> 0 
$export($export.S + $export.F * !($atanh && 1 / $atanh(-0) < 0), 'Math', {
  atanh: function atanh(x){
    return (x = +x) == 0 ? x : Math.log((1 + x) / (1 - x)) / 2;
  }
});
},{"./_export":32}],153:[function(require,module,exports){
// 20.2.2.9 Math.cbrt(x)
var $export = require('./_export')
  , sign    = require('./_math-sign');

$export($export.S, 'Math', {
  cbrt: function cbrt(x){
    return sign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
  }
});
},{"./_export":32,"./_math-sign":61}],154:[function(require,module,exports){
// 20.2.2.11 Math.clz32(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  clz32: function clz32(x){
    return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32;
  }
});
},{"./_export":32}],155:[function(require,module,exports){
// 20.2.2.12 Math.cosh(x)
var $export = require('./_export')
  , exp     = Math.exp;

$export($export.S, 'Math', {
  cosh: function cosh(x){
    return (exp(x = +x) + exp(-x)) / 2;
  }
});
},{"./_export":32}],156:[function(require,module,exports){
// 20.2.2.14 Math.expm1(x)
var $export = require('./_export')
  , $expm1  = require('./_math-expm1');

$export($export.S + $export.F * ($expm1 != Math.expm1), 'Math', {expm1: $expm1});
},{"./_export":32,"./_math-expm1":59}],157:[function(require,module,exports){
// 20.2.2.16 Math.fround(x)
var $export   = require('./_export')
  , sign      = require('./_math-sign')
  , pow       = Math.pow
  , EPSILON   = pow(2, -52)
  , EPSILON32 = pow(2, -23)
  , MAX32     = pow(2, 127) * (2 - EPSILON32)
  , MIN32     = pow(2, -126);

var roundTiesToEven = function(n){
  return n + 1 / EPSILON - 1 / EPSILON;
};


$export($export.S, 'Math', {
  fround: function fround(x){
    var $abs  = Math.abs(x)
      , $sign = sign(x)
      , a, result;
    if($abs < MIN32)return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
    a = (1 + EPSILON32 / EPSILON) * $abs;
    result = a - (a - $abs);
    if(result > MAX32 || result != result)return $sign * Infinity;
    return $sign * result;
  }
});
},{"./_export":32,"./_math-sign":61}],158:[function(require,module,exports){
// 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
var $export = require('./_export')
  , abs     = Math.abs;

$export($export.S, 'Math', {
  hypot: function hypot(value1, value2){ // eslint-disable-line no-unused-vars
    var sum  = 0
      , i    = 0
      , aLen = arguments.length
      , larg = 0
      , arg, div;
    while(i < aLen){
      arg = abs(arguments[i++]);
      if(larg < arg){
        div  = larg / arg;
        sum  = sum * div * div + 1;
        larg = arg;
      } else if(arg > 0){
        div  = arg / larg;
        sum += div * div;
      } else sum += arg;
    }
    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
  }
});
},{"./_export":32}],159:[function(require,module,exports){
// 20.2.2.18 Math.imul(x, y)
var $export = require('./_export')
  , $imul   = Math.imul;

// some WebKit versions fails with big numbers, some has wrong arity
$export($export.S + $export.F * require('./_fails')(function(){
  return $imul(0xffffffff, 5) != -5 || $imul.length != 2;
}), 'Math', {
  imul: function imul(x, y){
    var UINT16 = 0xffff
      , xn = +x
      , yn = +y
      , xl = UINT16 & xn
      , yl = UINT16 & yn;
    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
  }
});
},{"./_export":32,"./_fails":34}],160:[function(require,module,exports){
// 20.2.2.21 Math.log10(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  log10: function log10(x){
    return Math.log(x) / Math.LN10;
  }
});
},{"./_export":32}],161:[function(require,module,exports){
// 20.2.2.20 Math.log1p(x)
var $export = require('./_export');

$export($export.S, 'Math', {log1p: require('./_math-log1p')});
},{"./_export":32,"./_math-log1p":60}],162:[function(require,module,exports){
// 20.2.2.22 Math.log2(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  log2: function log2(x){
    return Math.log(x) / Math.LN2;
  }
});
},{"./_export":32}],163:[function(require,module,exports){
// 20.2.2.28 Math.sign(x)
var $export = require('./_export');

$export($export.S, 'Math', {sign: require('./_math-sign')});
},{"./_export":32,"./_math-sign":61}],164:[function(require,module,exports){
// 20.2.2.30 Math.sinh(x)
var $export = require('./_export')
  , expm1   = require('./_math-expm1')
  , exp     = Math.exp;

// V8 near Chromium 38 has a problem with very small numbers
$export($export.S + $export.F * require('./_fails')(function(){
  return !Math.sinh(-2e-17) != -2e-17;
}), 'Math', {
  sinh: function sinh(x){
    return Math.abs(x = +x) < 1
      ? (expm1(x) - expm1(-x)) / 2
      : (exp(x - 1) - exp(-x - 1)) * (Math.E / 2);
  }
});
},{"./_export":32,"./_fails":34,"./_math-expm1":59}],165:[function(require,module,exports){
// 20.2.2.33 Math.tanh(x)
var $export = require('./_export')
  , expm1   = require('./_math-expm1')
  , exp     = Math.exp;

$export($export.S, 'Math', {
  tanh: function tanh(x){
    var a = expm1(x = +x)
      , b = expm1(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
  }
});
},{"./_export":32,"./_math-expm1":59}],166:[function(require,module,exports){
// 20.2.2.34 Math.trunc(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  trunc: function trunc(it){
    return (it > 0 ? Math.floor : Math.ceil)(it);
  }
});
},{"./_export":32}],167:[function(require,module,exports){
'use strict';
var global            = require('./_global')
  , has               = require('./_has')
  , cof               = require('./_cof')
  , inheritIfRequired = require('./_inherit-if-required')
  , toPrimitive       = require('./_to-primitive')
  , fails             = require('./_fails')
  , gOPN              = require('./_object-gopn').f
  , gOPD              = require('./_object-gopd').f
  , dP                = require('./_object-dp').f
  , $trim             = require('./_string-trim').trim
  , NUMBER            = 'Number'
  , $Number           = global[NUMBER]
  , Base              = $Number
  , proto             = $Number.prototype
  // Opera ~12 has broken Object#toString
  , BROKEN_COF        = cof(require('./_object-create')(proto)) == NUMBER
  , TRIM              = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function(argument){
  var it = toPrimitive(argument, false);
  if(typeof it == 'string' && it.length > 2){
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0)
      , third, radix, maxCode;
    if(first === 43 || first === 45){
      third = it.charCodeAt(2);
      if(third === 88 || third === 120)return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if(first === 48){
      switch(it.charCodeAt(1)){
        case 66 : case 98  : radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79 : case 111 : radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default : return +it;
      }
      for(var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++){
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if(code < 48 || code > maxCode)return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if(!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')){
  $Number = function Number(value){
    var it = arguments.length < 1 ? 0 : value
      , that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function(){ proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
  };
  for(var keys = require('./_descriptors') ? gOPN(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys.length > j; j++){
    if(has(Base, key = keys[j]) && !has($Number, key)){
      dP($Number, key, gOPD(Base, key));
    }
  }
  $Number.prototype = proto;
  proto.constructor = $Number;
  require('./_redefine')(global, NUMBER, $Number);
}
},{"./_cof":18,"./_descriptors":28,"./_fails":34,"./_global":38,"./_has":39,"./_inherit-if-required":43,"./_object-create":66,"./_object-dp":67,"./_object-gopd":70,"./_object-gopn":72,"./_redefine":87,"./_string-trim":102,"./_to-primitive":110}],168:[function(require,module,exports){
// 20.1.2.1 Number.EPSILON
var $export = require('./_export');

$export($export.S, 'Number', {EPSILON: Math.pow(2, -52)});
},{"./_export":32}],169:[function(require,module,exports){
// 20.1.2.2 Number.isFinite(number)
var $export   = require('./_export')
  , _isFinite = require('./_global').isFinite;

$export($export.S, 'Number', {
  isFinite: function isFinite(it){
    return typeof it == 'number' && _isFinite(it);
  }
});
},{"./_export":32,"./_global":38}],170:[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var $export = require('./_export');

$export($export.S, 'Number', {isInteger: require('./_is-integer')});
},{"./_export":32,"./_is-integer":48}],171:[function(require,module,exports){
// 20.1.2.4 Number.isNaN(number)
var $export = require('./_export');

$export($export.S, 'Number', {
  isNaN: function isNaN(number){
    return number != number;
  }
});
},{"./_export":32}],172:[function(require,module,exports){
// 20.1.2.5 Number.isSafeInteger(number)
var $export   = require('./_export')
  , isInteger = require('./_is-integer')
  , abs       = Math.abs;

$export($export.S, 'Number', {
  isSafeInteger: function isSafeInteger(number){
    return isInteger(number) && abs(number) <= 0x1fffffffffffff;
  }
});
},{"./_export":32,"./_is-integer":48}],173:[function(require,module,exports){
// 20.1.2.6 Number.MAX_SAFE_INTEGER
var $export = require('./_export');

$export($export.S, 'Number', {MAX_SAFE_INTEGER: 0x1fffffffffffff});
},{"./_export":32}],174:[function(require,module,exports){
// 20.1.2.10 Number.MIN_SAFE_INTEGER
var $export = require('./_export');

$export($export.S, 'Number', {MIN_SAFE_INTEGER: -0x1fffffffffffff});
},{"./_export":32}],175:[function(require,module,exports){
var $export     = require('./_export')
  , $parseFloat = require('./_parse-float');
// 20.1.2.12 Number.parseFloat(string)
$export($export.S + $export.F * (Number.parseFloat != $parseFloat), 'Number', {parseFloat: $parseFloat});
},{"./_export":32,"./_parse-float":81}],176:[function(require,module,exports){
var $export   = require('./_export')
  , $parseInt = require('./_parse-int');
// 20.1.2.13 Number.parseInt(string, radix)
$export($export.S + $export.F * (Number.parseInt != $parseInt), 'Number', {parseInt: $parseInt});
},{"./_export":32,"./_parse-int":82}],177:[function(require,module,exports){
'use strict';
var $export      = require('./_export')
  , toInteger    = require('./_to-integer')
  , aNumberValue = require('./_a-number-value')
  , repeat       = require('./_string-repeat')
  , $toFixed     = 1..toFixed
  , floor        = Math.floor
  , data         = [0, 0, 0, 0, 0, 0]
  , ERROR        = 'Number.toFixed: incorrect invocation!'
  , ZERO         = '0';

var multiply = function(n, c){
  var i  = -1
    , c2 = c;
  while(++i < 6){
    c2 += n * data[i];
    data[i] = c2 % 1e7;
    c2 = floor(c2 / 1e7);
  }
};
var divide = function(n){
  var i = 6
    , c = 0;
  while(--i >= 0){
    c += data[i];
    data[i] = floor(c / n);
    c = (c % n) * 1e7;
  }
};
var numToString = function(){
  var i = 6
    , s = '';
  while(--i >= 0){
    if(s !== '' || i === 0 || data[i] !== 0){
      var t = String(data[i]);
      s = s === '' ? t : s + repeat.call(ZERO, 7 - t.length) + t;
    }
  } return s;
};
var pow = function(x, n, acc){
  return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
};
var log = function(x){
  var n  = 0
    , x2 = x;
  while(x2 >= 4096){
    n += 12;
    x2 /= 4096;
  }
  while(x2 >= 2){
    n  += 1;
    x2 /= 2;
  } return n;
};

$export($export.P + $export.F * (!!$toFixed && (
  0.00008.toFixed(3) !== '0.000' ||
  0.9.toFixed(0) !== '1' ||
  1.255.toFixed(2) !== '1.25' ||
  1000000000000000128..toFixed(0) !== '1000000000000000128'
) || !require('./_fails')(function(){
  // V8 ~ Android 4.3-
  $toFixed.call({});
})), 'Number', {
  toFixed: function toFixed(fractionDigits){
    var x = aNumberValue(this, ERROR)
      , f = toInteger(fractionDigits)
      , s = ''
      , m = ZERO
      , e, z, j, k;
    if(f < 0 || f > 20)throw RangeError(ERROR);
    if(x != x)return 'NaN';
    if(x <= -1e21 || x >= 1e21)return String(x);
    if(x < 0){
      s = '-';
      x = -x;
    }
    if(x > 1e-21){
      e = log(x * pow(2, 69, 1)) - 69;
      z = e < 0 ? x * pow(2, -e, 1) : x / pow(2, e, 1);
      z *= 0x10000000000000;
      e = 52 - e;
      if(e > 0){
        multiply(0, z);
        j = f;
        while(j >= 7){
          multiply(1e7, 0);
          j -= 7;
        }
        multiply(pow(10, j, 1), 0);
        j = e - 1;
        while(j >= 23){
          divide(1 << 23);
          j -= 23;
        }
        divide(1 << j);
        multiply(1, 1);
        divide(2);
        m = numToString();
      } else {
        multiply(0, z);
        multiply(1 << -e, 0);
        m = numToString() + repeat.call(ZERO, f);
      }
    }
    if(f > 0){
      k = m.length;
      m = s + (k <= f ? '0.' + repeat.call(ZERO, f - k) + m : m.slice(0, k - f) + '.' + m.slice(k - f));
    } else {
      m = s + m;
    } return m;
  }
});
},{"./_a-number-value":4,"./_export":32,"./_fails":34,"./_string-repeat":101,"./_to-integer":106}],178:[function(require,module,exports){
'use strict';
var $export      = require('./_export')
  , $fails       = require('./_fails')
  , aNumberValue = require('./_a-number-value')
  , $toPrecision = 1..toPrecision;

$export($export.P + $export.F * ($fails(function(){
  // IE7-
  return $toPrecision.call(1, undefined) !== '1';
}) || !$fails(function(){
  // V8 ~ Android 4.3-
  $toPrecision.call({});
})), 'Number', {
  toPrecision: function toPrecision(precision){
    var that = aNumberValue(this, 'Number#toPrecision: incorrect invocation!');
    return precision === undefined ? $toPrecision.call(that) : $toPrecision.call(that, precision); 
  }
});
},{"./_a-number-value":4,"./_export":32,"./_fails":34}],179:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $export = require('./_export');

$export($export.S + $export.F, 'Object', {assign: require('./_object-assign')});
},{"./_export":32,"./_object-assign":65}],180:[function(require,module,exports){
var $export = require('./_export')
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', {create: require('./_object-create')});
},{"./_export":32,"./_object-create":66}],181:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', {defineProperties: require('./_object-dps')});
},{"./_descriptors":28,"./_export":32,"./_object-dps":68}],182:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', {defineProperty: require('./_object-dp').f});
},{"./_descriptors":28,"./_export":32,"./_object-dp":67}],183:[function(require,module,exports){
// 19.1.2.5 Object.freeze(O)
var isObject = require('./_is-object')
  , meta     = require('./_meta').onFreeze;

require('./_object-sap')('freeze', function($freeze){
  return function freeze(it){
    return $freeze && isObject(it) ? $freeze(meta(it)) : it;
  };
});
},{"./_is-object":49,"./_meta":62,"./_object-sap":78}],184:[function(require,module,exports){
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject                 = require('./_to-iobject')
  , $getOwnPropertyDescriptor = require('./_object-gopd').f;

require('./_object-sap')('getOwnPropertyDescriptor', function(){
  return function getOwnPropertyDescriptor(it, key){
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});
},{"./_object-gopd":70,"./_object-sap":78,"./_to-iobject":107}],185:[function(require,module,exports){
// 19.1.2.7 Object.getOwnPropertyNames(O)
require('./_object-sap')('getOwnPropertyNames', function(){
  return require('./_object-gopn-ext').f;
});
},{"./_object-gopn-ext":71,"./_object-sap":78}],186:[function(require,module,exports){
// 19.1.2.9 Object.getPrototypeOf(O)
var toObject        = require('./_to-object')
  , $getPrototypeOf = require('./_object-gpo');

require('./_object-sap')('getPrototypeOf', function(){
  return function getPrototypeOf(it){
    return $getPrototypeOf(toObject(it));
  };
});
},{"./_object-gpo":74,"./_object-sap":78,"./_to-object":109}],187:[function(require,module,exports){
// 19.1.2.11 Object.isExtensible(O)
var isObject = require('./_is-object');

require('./_object-sap')('isExtensible', function($isExtensible){
  return function isExtensible(it){
    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
  };
});
},{"./_is-object":49,"./_object-sap":78}],188:[function(require,module,exports){
// 19.1.2.12 Object.isFrozen(O)
var isObject = require('./_is-object');

require('./_object-sap')('isFrozen', function($isFrozen){
  return function isFrozen(it){
    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
  };
});
},{"./_is-object":49,"./_object-sap":78}],189:[function(require,module,exports){
// 19.1.2.13 Object.isSealed(O)
var isObject = require('./_is-object');

require('./_object-sap')('isSealed', function($isSealed){
  return function isSealed(it){
    return isObject(it) ? $isSealed ? $isSealed(it) : false : true;
  };
});
},{"./_is-object":49,"./_object-sap":78}],190:[function(require,module,exports){
// 19.1.3.10 Object.is(value1, value2)
var $export = require('./_export');
$export($export.S, 'Object', {is: require('./_same-value')});
},{"./_export":32,"./_same-value":89}],191:[function(require,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = require('./_to-object')
  , $keys    = require('./_object-keys');

require('./_object-sap')('keys', function(){
  return function keys(it){
    return $keys(toObject(it));
  };
});
},{"./_object-keys":76,"./_object-sap":78,"./_to-object":109}],192:[function(require,module,exports){
// 19.1.2.15 Object.preventExtensions(O)
var isObject = require('./_is-object')
  , meta     = require('./_meta').onFreeze;

require('./_object-sap')('preventExtensions', function($preventExtensions){
  return function preventExtensions(it){
    return $preventExtensions && isObject(it) ? $preventExtensions(meta(it)) : it;
  };
});
},{"./_is-object":49,"./_meta":62,"./_object-sap":78}],193:[function(require,module,exports){
// 19.1.2.17 Object.seal(O)
var isObject = require('./_is-object')
  , meta     = require('./_meta').onFreeze;

require('./_object-sap')('seal', function($seal){
  return function seal(it){
    return $seal && isObject(it) ? $seal(meta(it)) : it;
  };
});
},{"./_is-object":49,"./_meta":62,"./_object-sap":78}],194:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = require('./_export');
$export($export.S, 'Object', {setPrototypeOf: require('./_set-proto').set});
},{"./_export":32,"./_set-proto":90}],195:[function(require,module,exports){
'use strict';
// 19.1.3.6 Object.prototype.toString()
var classof = require('./_classof')
  , test    = {};
test[require('./_wks')('toStringTag')] = 'z';
if(test + '' != '[object z]'){
  require('./_redefine')(Object.prototype, 'toString', function toString(){
    return '[object ' + classof(this) + ']';
  }, true);
}
},{"./_classof":17,"./_redefine":87,"./_wks":117}],196:[function(require,module,exports){
var $export     = require('./_export')
  , $parseFloat = require('./_parse-float');
// 18.2.4 parseFloat(string)
$export($export.G + $export.F * (parseFloat != $parseFloat), {parseFloat: $parseFloat});
},{"./_export":32,"./_parse-float":81}],197:[function(require,module,exports){
var $export   = require('./_export')
  , $parseInt = require('./_parse-int');
// 18.2.5 parseInt(string, radix)
$export($export.G + $export.F * (parseInt != $parseInt), {parseInt: $parseInt});
},{"./_export":32,"./_parse-int":82}],198:[function(require,module,exports){
'use strict';
var LIBRARY            = require('./_library')
  , global             = require('./_global')
  , ctx                = require('./_ctx')
  , classof            = require('./_classof')
  , $export            = require('./_export')
  , isObject           = require('./_is-object')
  , aFunction          = require('./_a-function')
  , anInstance         = require('./_an-instance')
  , forOf              = require('./_for-of')
  , speciesConstructor = require('./_species-constructor')
  , task               = require('./_task').set
  , microtask          = require('./_microtask')()
  , PROMISE            = 'Promise'
  , TypeError          = global.TypeError
  , process            = global.process
  , $Promise           = global[PROMISE]
  , process            = global.process
  , isNode             = classof(process) == 'process'
  , empty              = function(){ /* empty */ }
  , Internal, GenericPromiseCapability, Wrapper;

var USE_NATIVE = !!function(){
  try {
    // correct subclassing with @@species support
    var promise     = $Promise.resolve(1)
      , FakePromise = (promise.constructor = {})[require('./_wks')('species')] = function(exec){ exec(empty, empty); };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch(e){ /* empty */ }
}();

// helpers
var sameConstructor = function(a, b){
  // with library wrapper special case
  return a === b || a === $Promise && b === Wrapper;
};
var isThenable = function(it){
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var newPromiseCapability = function(C){
  return sameConstructor($Promise, C)
    ? new PromiseCapability(C)
    : new GenericPromiseCapability(C);
};
var PromiseCapability = GenericPromiseCapability = function(C){
  var resolve, reject;
  this.promise = new C(function($$resolve, $$reject){
    if(resolve !== undefined || reject !== undefined)throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject  = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject  = aFunction(reject);
};
var perform = function(exec){
  try {
    exec();
  } catch(e){
    return {error: e};
  }
};
var notify = function(promise, isReject){
  if(promise._n)return;
  promise._n = true;
  var chain = promise._c;
  microtask(function(){
    var value = promise._v
      , ok    = promise._s == 1
      , i     = 0;
    var run = function(reaction){
      var handler = ok ? reaction.ok : reaction.fail
        , resolve = reaction.resolve
        , reject  = reaction.reject
        , domain  = reaction.domain
        , result, then;
      try {
        if(handler){
          if(!ok){
            if(promise._h == 2)onHandleUnhandled(promise);
            promise._h = 1;
          }
          if(handler === true)result = value;
          else {
            if(domain)domain.enter();
            result = handler(value);
            if(domain)domain.exit();
          }
          if(result === reaction.promise){
            reject(TypeError('Promise-chain cycle'));
          } else if(then = isThenable(result)){
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch(e){
        reject(e);
      }
    };
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if(isReject && !promise._h)onUnhandled(promise);
  });
};
var onUnhandled = function(promise){
  task.call(global, function(){
    var value = promise._v
      , abrupt, handler, console;
    if(isUnhandled(promise)){
      abrupt = perform(function(){
        if(isNode){
          process.emit('unhandledRejection', value, promise);
        } else if(handler = global.onunhandledrejection){
          handler({promise: promise, reason: value});
        } else if((console = global.console) && console.error){
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if(abrupt)throw abrupt.error;
  });
};
var isUnhandled = function(promise){
  if(promise._h == 1)return false;
  var chain = promise._a || promise._c
    , i     = 0
    , reaction;
  while(chain.length > i){
    reaction = chain[i++];
    if(reaction.fail || !isUnhandled(reaction.promise))return false;
  } return true;
};
var onHandleUnhandled = function(promise){
  task.call(global, function(){
    var handler;
    if(isNode){
      process.emit('rejectionHandled', promise);
    } else if(handler = global.onrejectionhandled){
      handler({promise: promise, reason: promise._v});
    }
  });
};
var $reject = function(value){
  var promise = this;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if(!promise._a)promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function(value){
  var promise = this
    , then;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if(promise === value)throw TypeError("Promise can't be resolved itself");
    if(then = isThenable(value)){
      microtask(function(){
        var wrapper = {_w: promise, _d: false}; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch(e){
    $reject.call({_w: promise, _d: false}, e); // wrap
  }
};

// constructor polyfill
if(!USE_NATIVE){
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor){
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch(err){
      $reject.call(this, err);
    }
  };
  Internal = function Promise(executor){
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = require('./_redefine-all')($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var reaction    = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok     = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail   = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if(this._a)this._a.push(reaction);
      if(this._s)notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
  PromiseCapability = function(){
    var promise  = new Internal;
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject  = ctx($reject, promise, 1);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: $Promise});
require('./_set-to-string-tag')($Promise, PROMISE);
require('./_set-species')(PROMISE);
Wrapper = require('./_core')[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    var capability = newPromiseCapability(this)
      , $$reject   = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
    if(x instanceof $Promise && sameConstructor(x.constructor, this))return x;
    var capability = newPromiseCapability(this)
      , $$resolve  = capability.resolve;
    $$resolve(x);
    return capability.promise;
  }
});
$export($export.S + $export.F * !(USE_NATIVE && require('./_iter-detect')(function(iter){
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , resolve    = capability.resolve
      , reject     = capability.reject;
    var abrupt = perform(function(){
      var values    = []
        , index     = 0
        , remaining = 1;
      forOf(iterable, false, function(promise){
        var $index        = index++
          , alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function(value){
          if(alreadyCalled)return;
          alreadyCalled  = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , reject     = capability.reject;
    var abrupt = perform(function(){
      forOf(iterable, false, function(promise){
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  }
});
},{"./_a-function":3,"./_an-instance":6,"./_classof":17,"./_core":23,"./_ctx":25,"./_export":32,"./_for-of":37,"./_global":38,"./_is-object":49,"./_iter-detect":54,"./_library":58,"./_microtask":64,"./_redefine-all":86,"./_set-species":91,"./_set-to-string-tag":92,"./_species-constructor":95,"./_task":104,"./_wks":117}],199:[function(require,module,exports){
// 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
var $export   = require('./_export')
  , aFunction = require('./_a-function')
  , anObject  = require('./_an-object')
  , rApply    = (require('./_global').Reflect || {}).apply
  , fApply    = Function.apply;
// MS Edge argumentsList argument is optional
$export($export.S + $export.F * !require('./_fails')(function(){
  rApply(function(){});
}), 'Reflect', {
  apply: function apply(target, thisArgument, argumentsList){
    var T = aFunction(target)
      , L = anObject(argumentsList);
    return rApply ? rApply(T, thisArgument, L) : fApply.call(T, thisArgument, L);
  }
});
},{"./_a-function":3,"./_an-object":7,"./_export":32,"./_fails":34,"./_global":38}],200:[function(require,module,exports){
// 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
var $export    = require('./_export')
  , create     = require('./_object-create')
  , aFunction  = require('./_a-function')
  , anObject   = require('./_an-object')
  , isObject   = require('./_is-object')
  , fails      = require('./_fails')
  , bind       = require('./_bind')
  , rConstruct = (require('./_global').Reflect || {}).construct;

// MS Edge supports only 2 arguments and argumentsList argument is optional
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
var NEW_TARGET_BUG = fails(function(){
  function F(){}
  return !(rConstruct(function(){}, [], F) instanceof F);
});
var ARGS_BUG = !fails(function(){
  rConstruct(function(){});
});

$export($export.S + $export.F * (NEW_TARGET_BUG || ARGS_BUG), 'Reflect', {
  construct: function construct(Target, args /*, newTarget*/){
    aFunction(Target);
    anObject(args);
    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
    if(ARGS_BUG && !NEW_TARGET_BUG)return rConstruct(Target, args, newTarget);
    if(Target == newTarget){
      // w/o altered newTarget, optimization for 0-4 arguments
      switch(args.length){
        case 0: return new Target;
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (bind.apply(Target, $args));
    }
    // with altered newTarget, not support built-in constructors
    var proto    = newTarget.prototype
      , instance = create(isObject(proto) ? proto : Object.prototype)
      , result   = Function.apply.call(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});
},{"./_a-function":3,"./_an-object":7,"./_bind":16,"./_export":32,"./_fails":34,"./_global":38,"./_is-object":49,"./_object-create":66}],201:[function(require,module,exports){
// 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
var dP          = require('./_object-dp')
  , $export     = require('./_export')
  , anObject    = require('./_an-object')
  , toPrimitive = require('./_to-primitive');

// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
$export($export.S + $export.F * require('./_fails')(function(){
  Reflect.defineProperty(dP.f({}, 1, {value: 1}), 1, {value: 2});
}), 'Reflect', {
  defineProperty: function defineProperty(target, propertyKey, attributes){
    anObject(target);
    propertyKey = toPrimitive(propertyKey, true);
    anObject(attributes);
    try {
      dP.f(target, propertyKey, attributes);
      return true;
    } catch(e){
      return false;
    }
  }
});
},{"./_an-object":7,"./_export":32,"./_fails":34,"./_object-dp":67,"./_to-primitive":110}],202:[function(require,module,exports){
// 26.1.4 Reflect.deleteProperty(target, propertyKey)
var $export  = require('./_export')
  , gOPD     = require('./_object-gopd').f
  , anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  deleteProperty: function deleteProperty(target, propertyKey){
    var desc = gOPD(anObject(target), propertyKey);
    return desc && !desc.configurable ? false : delete target[propertyKey];
  }
});
},{"./_an-object":7,"./_export":32,"./_object-gopd":70}],203:[function(require,module,exports){
'use strict';
// 26.1.5 Reflect.enumerate(target)
var $export  = require('./_export')
  , anObject = require('./_an-object');
var Enumerate = function(iterated){
  this._t = anObject(iterated); // target
  this._i = 0;                  // next index
  var keys = this._k = []       // keys
    , key;
  for(key in iterated)keys.push(key);
};
require('./_iter-create')(Enumerate, 'Object', function(){
  var that = this
    , keys = that._k
    , key;
  do {
    if(that._i >= keys.length)return {value: undefined, done: true};
  } while(!((key = keys[that._i++]) in that._t));
  return {value: key, done: false};
});

$export($export.S, 'Reflect', {
  enumerate: function enumerate(target){
    return new Enumerate(target);
  }
});
},{"./_an-object":7,"./_export":32,"./_iter-create":52}],204:[function(require,module,exports){
// 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
var gOPD     = require('./_object-gopd')
  , $export  = require('./_export')
  , anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey){
    return gOPD.f(anObject(target), propertyKey);
  }
});
},{"./_an-object":7,"./_export":32,"./_object-gopd":70}],205:[function(require,module,exports){
// 26.1.8 Reflect.getPrototypeOf(target)
var $export  = require('./_export')
  , getProto = require('./_object-gpo')
  , anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  getPrototypeOf: function getPrototypeOf(target){
    return getProto(anObject(target));
  }
});
},{"./_an-object":7,"./_export":32,"./_object-gpo":74}],206:[function(require,module,exports){
// 26.1.6 Reflect.get(target, propertyKey [, receiver])
var gOPD           = require('./_object-gopd')
  , getPrototypeOf = require('./_object-gpo')
  , has            = require('./_has')
  , $export        = require('./_export')
  , isObject       = require('./_is-object')
  , anObject       = require('./_an-object');

function get(target, propertyKey/*, receiver*/){
  var receiver = arguments.length < 3 ? target : arguments[2]
    , desc, proto;
  if(anObject(target) === receiver)return target[propertyKey];
  if(desc = gOPD.f(target, propertyKey))return has(desc, 'value')
    ? desc.value
    : desc.get !== undefined
      ? desc.get.call(receiver)
      : undefined;
  if(isObject(proto = getPrototypeOf(target)))return get(proto, propertyKey, receiver);
}

$export($export.S, 'Reflect', {get: get});
},{"./_an-object":7,"./_export":32,"./_has":39,"./_is-object":49,"./_object-gopd":70,"./_object-gpo":74}],207:[function(require,module,exports){
// 26.1.9 Reflect.has(target, propertyKey)
var $export = require('./_export');

$export($export.S, 'Reflect', {
  has: function has(target, propertyKey){
    return propertyKey in target;
  }
});
},{"./_export":32}],208:[function(require,module,exports){
// 26.1.10 Reflect.isExtensible(target)
var $export       = require('./_export')
  , anObject      = require('./_an-object')
  , $isExtensible = Object.isExtensible;

$export($export.S, 'Reflect', {
  isExtensible: function isExtensible(target){
    anObject(target);
    return $isExtensible ? $isExtensible(target) : true;
  }
});
},{"./_an-object":7,"./_export":32}],209:[function(require,module,exports){
// 26.1.11 Reflect.ownKeys(target)
var $export = require('./_export');

$export($export.S, 'Reflect', {ownKeys: require('./_own-keys')});
},{"./_export":32,"./_own-keys":80}],210:[function(require,module,exports){
// 26.1.12 Reflect.preventExtensions(target)
var $export            = require('./_export')
  , anObject           = require('./_an-object')
  , $preventExtensions = Object.preventExtensions;

$export($export.S, 'Reflect', {
  preventExtensions: function preventExtensions(target){
    anObject(target);
    try {
      if($preventExtensions)$preventExtensions(target);
      return true;
    } catch(e){
      return false;
    }
  }
});
},{"./_an-object":7,"./_export":32}],211:[function(require,module,exports){
// 26.1.14 Reflect.setPrototypeOf(target, proto)
var $export  = require('./_export')
  , setProto = require('./_set-proto');

if(setProto)$export($export.S, 'Reflect', {
  setPrototypeOf: function setPrototypeOf(target, proto){
    setProto.check(target, proto);
    try {
      setProto.set(target, proto);
      return true;
    } catch(e){
      return false;
    }
  }
});
},{"./_export":32,"./_set-proto":90}],212:[function(require,module,exports){
// 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
var dP             = require('./_object-dp')
  , gOPD           = require('./_object-gopd')
  , getPrototypeOf = require('./_object-gpo')
  , has            = require('./_has')
  , $export        = require('./_export')
  , createDesc     = require('./_property-desc')
  , anObject       = require('./_an-object')
  , isObject       = require('./_is-object');

function set(target, propertyKey, V/*, receiver*/){
  var receiver = arguments.length < 4 ? target : arguments[3]
    , ownDesc  = gOPD.f(anObject(target), propertyKey)
    , existingDescriptor, proto;
  if(!ownDesc){
    if(isObject(proto = getPrototypeOf(target))){
      return set(proto, propertyKey, V, receiver);
    }
    ownDesc = createDesc(0);
  }
  if(has(ownDesc, 'value')){
    if(ownDesc.writable === false || !isObject(receiver))return false;
    existingDescriptor = gOPD.f(receiver, propertyKey) || createDesc(0);
    existingDescriptor.value = V;
    dP.f(receiver, propertyKey, existingDescriptor);
    return true;
  }
  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
}

$export($export.S, 'Reflect', {set: set});
},{"./_an-object":7,"./_export":32,"./_has":39,"./_is-object":49,"./_object-dp":67,"./_object-gopd":70,"./_object-gpo":74,"./_property-desc":85}],213:[function(require,module,exports){
var global            = require('./_global')
  , inheritIfRequired = require('./_inherit-if-required')
  , dP                = require('./_object-dp').f
  , gOPN              = require('./_object-gopn').f
  , isRegExp          = require('./_is-regexp')
  , $flags            = require('./_flags')
  , $RegExp           = global.RegExp
  , Base              = $RegExp
  , proto             = $RegExp.prototype
  , re1               = /a/g
  , re2               = /a/g
  // "new" creates a new object, old webkit buggy here
  , CORRECT_NEW       = new $RegExp(re1) !== re1;

if(require('./_descriptors') && (!CORRECT_NEW || require('./_fails')(function(){
  re2[require('./_wks')('match')] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
}))){
  $RegExp = function RegExp(p, f){
    var tiRE = this instanceof $RegExp
      , piRE = isRegExp(p)
      , fiU  = f === undefined;
    return !tiRE && piRE && p.constructor === $RegExp && fiU ? p
      : inheritIfRequired(CORRECT_NEW
        ? new Base(piRE && !fiU ? p.source : p, f)
        : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f)
      , tiRE ? this : proto, $RegExp);
  };
  var proxy = function(key){
    key in $RegExp || dP($RegExp, key, {
      configurable: true,
      get: function(){ return Base[key]; },
      set: function(it){ Base[key] = it; }
    });
  };
  for(var keys = gOPN(Base), i = 0; keys.length > i; )proxy(keys[i++]);
  proto.constructor = $RegExp;
  $RegExp.prototype = proto;
  require('./_redefine')(global, 'RegExp', $RegExp);
}

require('./_set-species')('RegExp');
},{"./_descriptors":28,"./_fails":34,"./_flags":36,"./_global":38,"./_inherit-if-required":43,"./_is-regexp":50,"./_object-dp":67,"./_object-gopn":72,"./_redefine":87,"./_set-species":91,"./_wks":117}],214:[function(require,module,exports){
// 21.2.5.3 get RegExp.prototype.flags()
if(require('./_descriptors') && /./g.flags != 'g')require('./_object-dp').f(RegExp.prototype, 'flags', {
  configurable: true,
  get: require('./_flags')
});
},{"./_descriptors":28,"./_flags":36,"./_object-dp":67}],215:[function(require,module,exports){
// @@match logic
require('./_fix-re-wks')('match', 1, function(defined, MATCH, $match){
  // 21.1.3.11 String.prototype.match(regexp)
  return [function match(regexp){
    'use strict';
    var O  = defined(this)
      , fn = regexp == undefined ? undefined : regexp[MATCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
  }, $match];
});
},{"./_fix-re-wks":35}],216:[function(require,module,exports){
// @@replace logic
require('./_fix-re-wks')('replace', 2, function(defined, REPLACE, $replace){
  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
  return [function replace(searchValue, replaceValue){
    'use strict';
    var O  = defined(this)
      , fn = searchValue == undefined ? undefined : searchValue[REPLACE];
    return fn !== undefined
      ? fn.call(searchValue, O, replaceValue)
      : $replace.call(String(O), searchValue, replaceValue);
  }, $replace];
});
},{"./_fix-re-wks":35}],217:[function(require,module,exports){
// @@search logic
require('./_fix-re-wks')('search', 1, function(defined, SEARCH, $search){
  // 21.1.3.15 String.prototype.search(regexp)
  return [function search(regexp){
    'use strict';
    var O  = defined(this)
      , fn = regexp == undefined ? undefined : regexp[SEARCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
  }, $search];
});
},{"./_fix-re-wks":35}],218:[function(require,module,exports){
// @@split logic
require('./_fix-re-wks')('split', 2, function(defined, SPLIT, $split){
  'use strict';
  var isRegExp   = require('./_is-regexp')
    , _split     = $split
    , $push      = [].push
    , $SPLIT     = 'split'
    , LENGTH     = 'length'
    , LAST_INDEX = 'lastIndex';
  if(
    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
    ''[$SPLIT](/.?/)[LENGTH]
  ){
    var NPCG = /()??/.exec('')[1] === undefined; // nonparticipating capturing group
    // based on es5-shim implementation, need to rework it
    $split = function(separator, limit){
      var string = String(this);
      if(separator === undefined && limit === 0)return [];
      // If `separator` is not a regex, use native split
      if(!isRegExp(separator))return _split.call(string, separator, limit);
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      var splitLimit = limit === undefined ? 4294967295 : limit >>> 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var separator2, match, lastIndex, lastLength, i;
      // Doesn't need flags gy, but they don't hurt
      if(!NPCG)separator2 = new RegExp('^' + separatorCopy.source + '$(?!\\s)', flags);
      while(match = separatorCopy.exec(string)){
        // `separatorCopy.lastIndex` is not reliable cross-browser
        lastIndex = match.index + match[0][LENGTH];
        if(lastIndex > lastLastIndex){
          output.push(string.slice(lastLastIndex, match.index));
          // Fix browsers whose `exec` methods don't consistently return `undefined` for NPCG
          if(!NPCG && match[LENGTH] > 1)match[0].replace(separator2, function(){
            for(i = 1; i < arguments[LENGTH] - 2; i++)if(arguments[i] === undefined)match[i] = undefined;
          });
          if(match[LENGTH] > 1 && match.index < string[LENGTH])$push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if(output[LENGTH] >= splitLimit)break;
        }
        if(separatorCopy[LAST_INDEX] === match.index)separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
      }
      if(lastLastIndex === string[LENGTH]){
        if(lastLength || !separatorCopy.test(''))output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    };
  // Chakra, V8
  } else if('0'[$SPLIT](undefined, 0)[LENGTH]){
    $split = function(separator, limit){
      return separator === undefined && limit === 0 ? [] : _split.call(this, separator, limit);
    };
  }
  // 21.1.3.17 String.prototype.split(separator, limit)
  return [function split(separator, limit){
    var O  = defined(this)
      , fn = separator == undefined ? undefined : separator[SPLIT];
    return fn !== undefined ? fn.call(separator, O, limit) : $split.call(String(O), separator, limit);
  }, $split];
});
},{"./_fix-re-wks":35,"./_is-regexp":50}],219:[function(require,module,exports){
'use strict';
require('./es6.regexp.flags');
var anObject    = require('./_an-object')
  , $flags      = require('./_flags')
  , DESCRIPTORS = require('./_descriptors')
  , TO_STRING   = 'toString'
  , $toString   = /./[TO_STRING];

var define = function(fn){
  require('./_redefine')(RegExp.prototype, TO_STRING, fn, true);
};

// 21.2.5.14 RegExp.prototype.toString()
if(require('./_fails')(function(){ return $toString.call({source: 'a', flags: 'b'}) != '/a/b'; })){
  define(function toString(){
    var R = anObject(this);
    return '/'.concat(R.source, '/',
      'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
  });
// FF44- RegExp#toString has a wrong name
} else if($toString.name != TO_STRING){
  define(function toString(){
    return $toString.call(this);
  });
}
},{"./_an-object":7,"./_descriptors":28,"./_fails":34,"./_flags":36,"./_redefine":87,"./es6.regexp.flags":214}],220:[function(require,module,exports){
'use strict';
var strong = require('./_collection-strong');

// 23.2 Set Objects
module.exports = require('./_collection')('Set', function(get){
  return function Set(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value){
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);
},{"./_collection":22,"./_collection-strong":19}],221:[function(require,module,exports){
'use strict';
// B.2.3.2 String.prototype.anchor(name)
require('./_string-html')('anchor', function(createHTML){
  return function anchor(name){
    return createHTML(this, 'a', 'name', name);
  }
});
},{"./_string-html":99}],222:[function(require,module,exports){
'use strict';
// B.2.3.3 String.prototype.big()
require('./_string-html')('big', function(createHTML){
  return function big(){
    return createHTML(this, 'big', '', '');
  }
});
},{"./_string-html":99}],223:[function(require,module,exports){
'use strict';
// B.2.3.4 String.prototype.blink()
require('./_string-html')('blink', function(createHTML){
  return function blink(){
    return createHTML(this, 'blink', '', '');
  }
});
},{"./_string-html":99}],224:[function(require,module,exports){
'use strict';
// B.2.3.5 String.prototype.bold()
require('./_string-html')('bold', function(createHTML){
  return function bold(){
    return createHTML(this, 'b', '', '');
  }
});
},{"./_string-html":99}],225:[function(require,module,exports){
'use strict';
var $export = require('./_export')
  , $at     = require('./_string-at')(false);
$export($export.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: function codePointAt(pos){
    return $at(this, pos);
  }
});
},{"./_export":32,"./_string-at":97}],226:[function(require,module,exports){
// 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])
'use strict';
var $export   = require('./_export')
  , toLength  = require('./_to-length')
  , context   = require('./_string-context')
  , ENDS_WITH = 'endsWith'
  , $endsWith = ''[ENDS_WITH];

$export($export.P + $export.F * require('./_fails-is-regexp')(ENDS_WITH), 'String', {
  endsWith: function endsWith(searchString /*, endPosition = @length */){
    var that = context(this, searchString, ENDS_WITH)
      , endPosition = arguments.length > 1 ? arguments[1] : undefined
      , len    = toLength(that.length)
      , end    = endPosition === undefined ? len : Math.min(toLength(endPosition), len)
      , search = String(searchString);
    return $endsWith
      ? $endsWith.call(that, search, end)
      : that.slice(end - search.length, end) === search;
  }
});
},{"./_export":32,"./_fails-is-regexp":33,"./_string-context":98,"./_to-length":108}],227:[function(require,module,exports){
'use strict';
// B.2.3.6 String.prototype.fixed()
require('./_string-html')('fixed', function(createHTML){
  return function fixed(){
    return createHTML(this, 'tt', '', '');
  }
});
},{"./_string-html":99}],228:[function(require,module,exports){
'use strict';
// B.2.3.7 String.prototype.fontcolor(color)
require('./_string-html')('fontcolor', function(createHTML){
  return function fontcolor(color){
    return createHTML(this, 'font', 'color', color);
  }
});
},{"./_string-html":99}],229:[function(require,module,exports){
'use strict';
// B.2.3.8 String.prototype.fontsize(size)
require('./_string-html')('fontsize', function(createHTML){
  return function fontsize(size){
    return createHTML(this, 'font', 'size', size);
  }
});
},{"./_string-html":99}],230:[function(require,module,exports){
var $export        = require('./_export')
  , toIndex        = require('./_to-index')
  , fromCharCode   = String.fromCharCode
  , $fromCodePoint = String.fromCodePoint;

// length should be 1, old FF problem
$export($export.S + $export.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
  // 21.1.2.2 String.fromCodePoint(...codePoints)
  fromCodePoint: function fromCodePoint(x){ // eslint-disable-line no-unused-vars
    var res  = []
      , aLen = arguments.length
      , i    = 0
      , code;
    while(aLen > i){
      code = +arguments[i++];
      if(toIndex(code, 0x10ffff) !== code)throw RangeError(code + ' is not a valid code point');
      res.push(code < 0x10000
        ? fromCharCode(code)
        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
      );
    } return res.join('');
  }
});
},{"./_export":32,"./_to-index":105}],231:[function(require,module,exports){
// 21.1.3.7 String.prototype.includes(searchString, position = 0)
'use strict';
var $export  = require('./_export')
  , context  = require('./_string-context')
  , INCLUDES = 'includes';

$export($export.P + $export.F * require('./_fails-is-regexp')(INCLUDES), 'String', {
  includes: function includes(searchString /*, position = 0 */){
    return !!~context(this, searchString, INCLUDES)
      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});
},{"./_export":32,"./_fails-is-regexp":33,"./_string-context":98}],232:[function(require,module,exports){
'use strict';
// B.2.3.9 String.prototype.italics()
require('./_string-html')('italics', function(createHTML){
  return function italics(){
    return createHTML(this, 'i', '', '');
  }
});
},{"./_string-html":99}],233:[function(require,module,exports){
'use strict';
var $at  = require('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./_iter-define')(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});
},{"./_iter-define":53,"./_string-at":97}],234:[function(require,module,exports){
'use strict';
// B.2.3.10 String.prototype.link(url)
require('./_string-html')('link', function(createHTML){
  return function link(url){
    return createHTML(this, 'a', 'href', url);
  }
});
},{"./_string-html":99}],235:[function(require,module,exports){
var $export   = require('./_export')
  , toIObject = require('./_to-iobject')
  , toLength  = require('./_to-length');

$export($export.S, 'String', {
  // 21.1.2.4 String.raw(callSite, ...substitutions)
  raw: function raw(callSite){
    var tpl  = toIObject(callSite.raw)
      , len  = toLength(tpl.length)
      , aLen = arguments.length
      , res  = []
      , i    = 0;
    while(len > i){
      res.push(String(tpl[i++]));
      if(i < aLen)res.push(String(arguments[i]));
    } return res.join('');
  }
});
},{"./_export":32,"./_to-iobject":107,"./_to-length":108}],236:[function(require,module,exports){
var $export = require('./_export');

$export($export.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: require('./_string-repeat')
});
},{"./_export":32,"./_string-repeat":101}],237:[function(require,module,exports){
'use strict';
// B.2.3.11 String.prototype.small()
require('./_string-html')('small', function(createHTML){
  return function small(){
    return createHTML(this, 'small', '', '');
  }
});
},{"./_string-html":99}],238:[function(require,module,exports){
// 21.1.3.18 String.prototype.startsWith(searchString [, position ])
'use strict';
var $export     = require('./_export')
  , toLength    = require('./_to-length')
  , context     = require('./_string-context')
  , STARTS_WITH = 'startsWith'
  , $startsWith = ''[STARTS_WITH];

$export($export.P + $export.F * require('./_fails-is-regexp')(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /*, position = 0 */){
    var that   = context(this, searchString, STARTS_WITH)
      , index  = toLength(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length))
      , search = String(searchString);
    return $startsWith
      ? $startsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});
},{"./_export":32,"./_fails-is-regexp":33,"./_string-context":98,"./_to-length":108}],239:[function(require,module,exports){
'use strict';
// B.2.3.12 String.prototype.strike()
require('./_string-html')('strike', function(createHTML){
  return function strike(){
    return createHTML(this, 'strike', '', '');
  }
});
},{"./_string-html":99}],240:[function(require,module,exports){
'use strict';
// B.2.3.13 String.prototype.sub()
require('./_string-html')('sub', function(createHTML){
  return function sub(){
    return createHTML(this, 'sub', '', '');
  }
});
},{"./_string-html":99}],241:[function(require,module,exports){
'use strict';
// B.2.3.14 String.prototype.sup()
require('./_string-html')('sup', function(createHTML){
  return function sup(){
    return createHTML(this, 'sup', '', '');
  }
});
},{"./_string-html":99}],242:[function(require,module,exports){
'use strict';
// 21.1.3.25 String.prototype.trim()
require('./_string-trim')('trim', function($trim){
  return function trim(){
    return $trim(this, 3);
  };
});
},{"./_string-trim":102}],243:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var global         = require('./_global')
  , has            = require('./_has')
  , DESCRIPTORS    = require('./_descriptors')
  , $export        = require('./_export')
  , redefine       = require('./_redefine')
  , META           = require('./_meta').KEY
  , $fails         = require('./_fails')
  , shared         = require('./_shared')
  , setToStringTag = require('./_set-to-string-tag')
  , uid            = require('./_uid')
  , wks            = require('./_wks')
  , wksExt         = require('./_wks-ext')
  , wksDefine      = require('./_wks-define')
  , keyOf          = require('./_keyof')
  , enumKeys       = require('./_enum-keys')
  , isArray        = require('./_is-array')
  , anObject       = require('./_an-object')
  , toIObject      = require('./_to-iobject')
  , toPrimitive    = require('./_to-primitive')
  , createDesc     = require('./_property-desc')
  , _create        = require('./_object-create')
  , gOPNExt        = require('./_object-gopn-ext')
  , $GOPD          = require('./_object-gopd')
  , $DP            = require('./_object-dp')
  , $keys          = require('./_object-keys')
  , gOPD           = $GOPD.f
  , dP             = $DP.f
  , gOPN           = gOPNExt.f
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , PROTOTYPE      = 'prototype'
  , HIDDEN         = wks('_hidden')
  , TO_PRIMITIVE   = wks('toPrimitive')
  , isEnum         = {}.propertyIsEnumerable
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , OPSymbols      = shared('op-symbols')
  , ObjectProto    = Object[PROTOTYPE]
  , USE_NATIVE     = typeof $Symbol == 'function'
  , QObject        = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(dP({}, 'a', {
    get: function(){ return dP(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = gOPD(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  dP(it, key, D);
  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
  return typeof it == 'symbol';
} : function(it){
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D){
  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if(has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  it  = toIObject(it);
  key = toPrimitive(key, true);
  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
  var D = gOPD(it, key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = gOPN(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var IS_OP  = it === ObjectProto
    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if(!USE_NATIVE){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function(value){
      if(this === ObjectProto)$set.call(OPSymbols, value);
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f   = $defineProperty;
  require('./_object-gopn').f = gOPNExt.f = $getOwnPropertyNames;
  require('./_object-pie').f  = $propertyIsEnumerable;
  require('./_object-gops').f = $getOwnPropertySymbols;

  if(DESCRIPTORS && !require('./_library')){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function(name){
    return wrap(wks(name));
  }
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

for(var symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    if(isSymbol(key))return keyOf(SymbolRegistry, key);
    throw TypeError(key + ' is not a symbol!');
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it){
    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
    var args = [it]
      , i    = 1
      , replacer, $replacer;
    while(arguments.length > i)args.push(arguments[i++]);
    replacer = args[1];
    if(typeof replacer == 'function')$replacer = replacer;
    if($replacer || !isArray(replacer))replacer = function(key, value){
      if($replacer)value = $replacer.call(this, key, value);
      if(!isSymbol(value))return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || require('./_hide')($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);
},{"./_an-object":7,"./_descriptors":28,"./_enum-keys":31,"./_export":32,"./_fails":34,"./_global":38,"./_has":39,"./_hide":40,"./_is-array":47,"./_keyof":57,"./_library":58,"./_meta":62,"./_object-create":66,"./_object-dp":67,"./_object-gopd":70,"./_object-gopn":72,"./_object-gopn-ext":71,"./_object-gops":73,"./_object-keys":76,"./_object-pie":77,"./_property-desc":85,"./_redefine":87,"./_set-to-string-tag":92,"./_shared":94,"./_to-iobject":107,"./_to-primitive":110,"./_uid":114,"./_wks":117,"./_wks-define":115,"./_wks-ext":116}],244:[function(require,module,exports){
'use strict';
var $export      = require('./_export')
  , $typed       = require('./_typed')
  , buffer       = require('./_typed-buffer')
  , anObject     = require('./_an-object')
  , toIndex      = require('./_to-index')
  , toLength     = require('./_to-length')
  , isObject     = require('./_is-object')
  , ArrayBuffer  = require('./_global').ArrayBuffer
  , speciesConstructor = require('./_species-constructor')
  , $ArrayBuffer = buffer.ArrayBuffer
  , $DataView    = buffer.DataView
  , $isView      = $typed.ABV && ArrayBuffer.isView
  , $slice       = $ArrayBuffer.prototype.slice
  , VIEW         = $typed.VIEW
  , ARRAY_BUFFER = 'ArrayBuffer';

$export($export.G + $export.W + $export.F * (ArrayBuffer !== $ArrayBuffer), {ArrayBuffer: $ArrayBuffer});

$export($export.S + $export.F * !$typed.CONSTR, ARRAY_BUFFER, {
  // 24.1.3.1 ArrayBuffer.isView(arg)
  isView: function isView(it){
    return $isView && $isView(it) || isObject(it) && VIEW in it;
  }
});

$export($export.P + $export.U + $export.F * require('./_fails')(function(){
  return !new $ArrayBuffer(2).slice(1, undefined).byteLength;
}), ARRAY_BUFFER, {
  // 24.1.4.3 ArrayBuffer.prototype.slice(start, end)
  slice: function slice(start, end){
    if($slice !== undefined && end === undefined)return $slice.call(anObject(this), start); // FF fix
    var len    = anObject(this).byteLength
      , first  = toIndex(start, len)
      , final  = toIndex(end === undefined ? len : end, len)
      , result = new (speciesConstructor(this, $ArrayBuffer))(toLength(final - first))
      , viewS  = new $DataView(this)
      , viewT  = new $DataView(result)
      , index  = 0;
    while(first < final){
      viewT.setUint8(index++, viewS.getUint8(first++));
    } return result;
  }
});

require('./_set-species')(ARRAY_BUFFER);
},{"./_an-object":7,"./_export":32,"./_fails":34,"./_global":38,"./_is-object":49,"./_set-species":91,"./_species-constructor":95,"./_to-index":105,"./_to-length":108,"./_typed":113,"./_typed-buffer":112}],245:[function(require,module,exports){
var $export = require('./_export');
$export($export.G + $export.W + $export.F * !require('./_typed').ABV, {
  DataView: require('./_typed-buffer').DataView
});
},{"./_export":32,"./_typed":113,"./_typed-buffer":112}],246:[function(require,module,exports){
require('./_typed-array')('Float32', 4, function(init){
  return function Float32Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":111}],247:[function(require,module,exports){
require('./_typed-array')('Float64', 8, function(init){
  return function Float64Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":111}],248:[function(require,module,exports){
require('./_typed-array')('Int16', 2, function(init){
  return function Int16Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":111}],249:[function(require,module,exports){
require('./_typed-array')('Int32', 4, function(init){
  return function Int32Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":111}],250:[function(require,module,exports){
require('./_typed-array')('Int8', 1, function(init){
  return function Int8Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":111}],251:[function(require,module,exports){
require('./_typed-array')('Uint16', 2, function(init){
  return function Uint16Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":111}],252:[function(require,module,exports){
require('./_typed-array')('Uint32', 4, function(init){
  return function Uint32Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":111}],253:[function(require,module,exports){
require('./_typed-array')('Uint8', 1, function(init){
  return function Uint8Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":111}],254:[function(require,module,exports){
require('./_typed-array')('Uint8', 1, function(init){
  return function Uint8ClampedArray(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
}, true);
},{"./_typed-array":111}],255:[function(require,module,exports){
'use strict';
var each         = require('./_array-methods')(0)
  , redefine     = require('./_redefine')
  , meta         = require('./_meta')
  , assign       = require('./_object-assign')
  , weak         = require('./_collection-weak')
  , isObject     = require('./_is-object')
  , getWeak      = meta.getWeak
  , isExtensible = Object.isExtensible
  , uncaughtFrozenStore = weak.ufstore
  , tmp          = {}
  , InternalMap;

var wrapper = function(get){
  return function WeakMap(){
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
};

var methods = {
  // 23.3.3.3 WeakMap.prototype.get(key)
  get: function get(key){
    if(isObject(key)){
      var data = getWeak(key);
      if(data === true)return uncaughtFrozenStore(this).get(key);
      return data ? data[this._i] : undefined;
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function set(key, value){
    return weak.def(this, key, value);
  }
};

// 23.3 WeakMap Objects
var $WeakMap = module.exports = require('./_collection')('WeakMap', wrapper, methods, weak, true, true);

// IE11 WeakMap frozen keys fix
if(new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7){
  InternalMap = weak.getConstructor(wrapper);
  assign(InternalMap.prototype, methods);
  meta.NEED = true;
  each(['delete', 'has', 'get', 'set'], function(key){
    var proto  = $WeakMap.prototype
      , method = proto[key];
    redefine(proto, key, function(a, b){
      // store frozen objects on internal weakmap shim
      if(isObject(a) && !isExtensible(a)){
        if(!this._f)this._f = new InternalMap;
        var result = this._f[key](a, b);
        return key == 'set' ? this : result;
      // store all the rest on native weakmap
      } return method.call(this, a, b);
    });
  });
}
},{"./_array-methods":12,"./_collection":22,"./_collection-weak":21,"./_is-object":49,"./_meta":62,"./_object-assign":65,"./_redefine":87}],256:[function(require,module,exports){
'use strict';
var weak = require('./_collection-weak');

// 23.4 WeakSet Objects
require('./_collection')('WeakSet', function(get){
  return function WeakSet(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.4.3.1 WeakSet.prototype.add(value)
  add: function add(value){
    return weak.def(this, value, true);
  }
}, weak, false, true);
},{"./_collection":22,"./_collection-weak":21}],257:[function(require,module,exports){
'use strict';
// https://github.com/tc39/Array.prototype.includes
var $export   = require('./_export')
  , $includes = require('./_array-includes')(true);

$export($export.P, 'Array', {
  includes: function includes(el /*, fromIndex = 0 */){
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

require('./_add-to-unscopables')('includes');
},{"./_add-to-unscopables":5,"./_array-includes":11,"./_export":32}],258:[function(require,module,exports){
// https://github.com/rwaldron/tc39-notes/blob/master/es6/2014-09/sept-25.md#510-globalasap-for-enqueuing-a-microtask
var $export   = require('./_export')
  , microtask = require('./_microtask')()
  , process   = require('./_global').process
  , isNode    = require('./_cof')(process) == 'process';

$export($export.G, {
  asap: function asap(fn){
    var domain = isNode && process.domain;
    microtask(domain ? domain.bind(fn) : fn);
  }
});
},{"./_cof":18,"./_export":32,"./_global":38,"./_microtask":64}],259:[function(require,module,exports){
// https://github.com/ljharb/proposal-is-error
var $export = require('./_export')
  , cof     = require('./_cof');

$export($export.S, 'Error', {
  isError: function isError(it){
    return cof(it) === 'Error';
  }
});
},{"./_cof":18,"./_export":32}],260:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = require('./_export');

$export($export.P + $export.R, 'Map', {toJSON: require('./_collection-to-json')('Map')});
},{"./_collection-to-json":20,"./_export":32}],261:[function(require,module,exports){
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  iaddh: function iaddh(x0, x1, y0, y1){
    var $x0 = x0 >>> 0
      , $x1 = x1 >>> 0
      , $y0 = y0 >>> 0;
    return $x1 + (y1 >>> 0) + (($x0 & $y0 | ($x0 | $y0) & ~($x0 + $y0 >>> 0)) >>> 31) | 0;
  }
});
},{"./_export":32}],262:[function(require,module,exports){
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  imulh: function imulh(u, v){
    var UINT16 = 0xffff
      , $u = +u
      , $v = +v
      , u0 = $u & UINT16
      , v0 = $v & UINT16
      , u1 = $u >> 16
      , v1 = $v >> 16
      , t  = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >> 16);
  }
});
},{"./_export":32}],263:[function(require,module,exports){
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  isubh: function isubh(x0, x1, y0, y1){
    var $x0 = x0 >>> 0
      , $x1 = x1 >>> 0
      , $y0 = y0 >>> 0;
    return $x1 - (y1 >>> 0) - ((~$x0 & $y0 | ~($x0 ^ $y0) & $x0 - $y0 >>> 0) >>> 31) | 0;
  }
});
},{"./_export":32}],264:[function(require,module,exports){
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  umulh: function umulh(u, v){
    var UINT16 = 0xffff
      , $u = +u
      , $v = +v
      , u0 = $u & UINT16
      , v0 = $v & UINT16
      , u1 = $u >>> 16
      , v1 = $v >>> 16
      , t  = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >>> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >>> 16);
  }
});
},{"./_export":32}],265:[function(require,module,exports){
'use strict';
var $export         = require('./_export')
  , toObject        = require('./_to-object')
  , aFunction       = require('./_a-function')
  , $defineProperty = require('./_object-dp');

// B.2.2.2 Object.prototype.__defineGetter__(P, getter)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __defineGetter__: function __defineGetter__(P, getter){
    $defineProperty.f(toObject(this), P, {get: aFunction(getter), enumerable: true, configurable: true});
  }
});
},{"./_a-function":3,"./_descriptors":28,"./_export":32,"./_object-dp":67,"./_object-forced-pam":69,"./_to-object":109}],266:[function(require,module,exports){
'use strict';
var $export         = require('./_export')
  , toObject        = require('./_to-object')
  , aFunction       = require('./_a-function')
  , $defineProperty = require('./_object-dp');

// B.2.2.3 Object.prototype.__defineSetter__(P, setter)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __defineSetter__: function __defineSetter__(P, setter){
    $defineProperty.f(toObject(this), P, {set: aFunction(setter), enumerable: true, configurable: true});
  }
});
},{"./_a-function":3,"./_descriptors":28,"./_export":32,"./_object-dp":67,"./_object-forced-pam":69,"./_to-object":109}],267:[function(require,module,exports){
// https://github.com/tc39/proposal-object-values-entries
var $export  = require('./_export')
  , $entries = require('./_object-to-array')(true);

$export($export.S, 'Object', {
  entries: function entries(it){
    return $entries(it);
  }
});
},{"./_export":32,"./_object-to-array":79}],268:[function(require,module,exports){
// https://github.com/tc39/proposal-object-getownpropertydescriptors
var $export        = require('./_export')
  , ownKeys        = require('./_own-keys')
  , toIObject      = require('./_to-iobject')
  , gOPD           = require('./_object-gopd')
  , createProperty = require('./_create-property');

$export($export.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object){
    var O       = toIObject(object)
      , getDesc = gOPD.f
      , keys    = ownKeys(O)
      , result  = {}
      , i       = 0
      , key;
    while(keys.length > i)createProperty(result, key = keys[i++], getDesc(O, key));
    return result;
  }
});
},{"./_create-property":24,"./_export":32,"./_object-gopd":70,"./_own-keys":80,"./_to-iobject":107}],269:[function(require,module,exports){
'use strict';
var $export                  = require('./_export')
  , toObject                 = require('./_to-object')
  , toPrimitive              = require('./_to-primitive')
  , getPrototypeOf           = require('./_object-gpo')
  , getOwnPropertyDescriptor = require('./_object-gopd').f;

// B.2.2.4 Object.prototype.__lookupGetter__(P)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __lookupGetter__: function __lookupGetter__(P){
    var O = toObject(this)
      , K = toPrimitive(P, true)
      , D;
    do {
      if(D = getOwnPropertyDescriptor(O, K))return D.get;
    } while(O = getPrototypeOf(O));
  }
});
},{"./_descriptors":28,"./_export":32,"./_object-forced-pam":69,"./_object-gopd":70,"./_object-gpo":74,"./_to-object":109,"./_to-primitive":110}],270:[function(require,module,exports){
'use strict';
var $export                  = require('./_export')
  , toObject                 = require('./_to-object')
  , toPrimitive              = require('./_to-primitive')
  , getPrototypeOf           = require('./_object-gpo')
  , getOwnPropertyDescriptor = require('./_object-gopd').f;

// B.2.2.5 Object.prototype.__lookupSetter__(P)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __lookupSetter__: function __lookupSetter__(P){
    var O = toObject(this)
      , K = toPrimitive(P, true)
      , D;
    do {
      if(D = getOwnPropertyDescriptor(O, K))return D.set;
    } while(O = getPrototypeOf(O));
  }
});
},{"./_descriptors":28,"./_export":32,"./_object-forced-pam":69,"./_object-gopd":70,"./_object-gpo":74,"./_to-object":109,"./_to-primitive":110}],271:[function(require,module,exports){
// https://github.com/tc39/proposal-object-values-entries
var $export = require('./_export')
  , $values = require('./_object-to-array')(false);

$export($export.S, 'Object', {
  values: function values(it){
    return $values(it);
  }
});
},{"./_export":32,"./_object-to-array":79}],272:[function(require,module,exports){
'use strict';
// https://github.com/zenparsing/es-observable
var $export     = require('./_export')
  , global      = require('./_global')
  , core        = require('./_core')
  , microtask   = require('./_microtask')()
  , OBSERVABLE  = require('./_wks')('observable')
  , aFunction   = require('./_a-function')
  , anObject    = require('./_an-object')
  , anInstance  = require('./_an-instance')
  , redefineAll = require('./_redefine-all')
  , hide        = require('./_hide')
  , forOf       = require('./_for-of')
  , RETURN      = forOf.RETURN;

var getMethod = function(fn){
  return fn == null ? undefined : aFunction(fn);
};

var cleanupSubscription = function(subscription){
  var cleanup = subscription._c;
  if(cleanup){
    subscription._c = undefined;
    cleanup();
  }
};

var subscriptionClosed = function(subscription){
  return subscription._o === undefined;
};

var closeSubscription = function(subscription){
  if(!subscriptionClosed(subscription)){
    subscription._o = undefined;
    cleanupSubscription(subscription);
  }
};

var Subscription = function(observer, subscriber){
  anObject(observer);
  this._c = undefined;
  this._o = observer;
  observer = new SubscriptionObserver(this);
  try {
    var cleanup      = subscriber(observer)
      , subscription = cleanup;
    if(cleanup != null){
      if(typeof cleanup.unsubscribe === 'function')cleanup = function(){ subscription.unsubscribe(); };
      else aFunction(cleanup);
      this._c = cleanup;
    }
  } catch(e){
    observer.error(e);
    return;
  } if(subscriptionClosed(this))cleanupSubscription(this);
};

Subscription.prototype = redefineAll({}, {
  unsubscribe: function unsubscribe(){ closeSubscription(this); }
});

var SubscriptionObserver = function(subscription){
  this._s = subscription;
};

SubscriptionObserver.prototype = redefineAll({}, {
  next: function next(value){
    var subscription = this._s;
    if(!subscriptionClosed(subscription)){
      var observer = subscription._o;
      try {
        var m = getMethod(observer.next);
        if(m)return m.call(observer, value);
      } catch(e){
        try {
          closeSubscription(subscription);
        } finally {
          throw e;
        }
      }
    }
  },
  error: function error(value){
    var subscription = this._s;
    if(subscriptionClosed(subscription))throw value;
    var observer = subscription._o;
    subscription._o = undefined;
    try {
      var m = getMethod(observer.error);
      if(!m)throw value;
      value = m.call(observer, value);
    } catch(e){
      try {
        cleanupSubscription(subscription);
      } finally {
        throw e;
      }
    } cleanupSubscription(subscription);
    return value;
  },
  complete: function complete(value){
    var subscription = this._s;
    if(!subscriptionClosed(subscription)){
      var observer = subscription._o;
      subscription._o = undefined;
      try {
        var m = getMethod(observer.complete);
        value = m ? m.call(observer, value) : undefined;
      } catch(e){
        try {
          cleanupSubscription(subscription);
        } finally {
          throw e;
        }
      } cleanupSubscription(subscription);
      return value;
    }
  }
});

var $Observable = function Observable(subscriber){
  anInstance(this, $Observable, 'Observable', '_f')._f = aFunction(subscriber);
};

redefineAll($Observable.prototype, {
  subscribe: function subscribe(observer){
    return new Subscription(observer, this._f);
  },
  forEach: function forEach(fn){
    var that = this;
    return new (core.Promise || global.Promise)(function(resolve, reject){
      aFunction(fn);
      var subscription = that.subscribe({
        next : function(value){
          try {
            return fn(value);
          } catch(e){
            reject(e);
            subscription.unsubscribe();
          }
        },
        error: reject,
        complete: resolve
      });
    });
  }
});

redefineAll($Observable, {
  from: function from(x){
    var C = typeof this === 'function' ? this : $Observable;
    var method = getMethod(anObject(x)[OBSERVABLE]);
    if(method){
      var observable = anObject(method.call(x));
      return observable.constructor === C ? observable : new C(function(observer){
        return observable.subscribe(observer);
      });
    }
    return new C(function(observer){
      var done = false;
      microtask(function(){
        if(!done){
          try {
            if(forOf(x, false, function(it){
              observer.next(it);
              if(done)return RETURN;
            }) === RETURN)return;
          } catch(e){
            if(done)throw e;
            observer.error(e);
            return;
          } observer.complete();
        }
      });
      return function(){ done = true; };
    });
  },
  of: function of(){
    for(var i = 0, l = arguments.length, items = Array(l); i < l;)items[i] = arguments[i++];
    return new (typeof this === 'function' ? this : $Observable)(function(observer){
      var done = false;
      microtask(function(){
        if(!done){
          for(var i = 0; i < items.length; ++i){
            observer.next(items[i]);
            if(done)return;
          } observer.complete();
        }
      });
      return function(){ done = true; };
    });
  }
});

hide($Observable.prototype, OBSERVABLE, function(){ return this; });

$export($export.G, {Observable: $Observable});

require('./_set-species')('Observable');
},{"./_a-function":3,"./_an-instance":6,"./_an-object":7,"./_core":23,"./_export":32,"./_for-of":37,"./_global":38,"./_hide":40,"./_microtask":64,"./_redefine-all":86,"./_set-species":91,"./_wks":117}],273:[function(require,module,exports){
var metadata                  = require('./_metadata')
  , anObject                  = require('./_an-object')
  , toMetaKey                 = metadata.key
  , ordinaryDefineOwnMetadata = metadata.set;

metadata.exp({defineMetadata: function defineMetadata(metadataKey, metadataValue, target, targetKey){
  ordinaryDefineOwnMetadata(metadataKey, metadataValue, anObject(target), toMetaKey(targetKey));
}});
},{"./_an-object":7,"./_metadata":63}],274:[function(require,module,exports){
var metadata               = require('./_metadata')
  , anObject               = require('./_an-object')
  , toMetaKey              = metadata.key
  , getOrCreateMetadataMap = metadata.map
  , store                  = metadata.store;

metadata.exp({deleteMetadata: function deleteMetadata(metadataKey, target /*, targetKey */){
  var targetKey   = arguments.length < 3 ? undefined : toMetaKey(arguments[2])
    , metadataMap = getOrCreateMetadataMap(anObject(target), targetKey, false);
  if(metadataMap === undefined || !metadataMap['delete'](metadataKey))return false;
  if(metadataMap.size)return true;
  var targetMetadata = store.get(target);
  targetMetadata['delete'](targetKey);
  return !!targetMetadata.size || store['delete'](target);
}});
},{"./_an-object":7,"./_metadata":63}],275:[function(require,module,exports){
var Set                     = require('./es6.set')
  , from                    = require('./_array-from-iterable')
  , metadata                = require('./_metadata')
  , anObject                = require('./_an-object')
  , getPrototypeOf          = require('./_object-gpo')
  , ordinaryOwnMetadataKeys = metadata.keys
  , toMetaKey               = metadata.key;

var ordinaryMetadataKeys = function(O, P){
  var oKeys  = ordinaryOwnMetadataKeys(O, P)
    , parent = getPrototypeOf(O);
  if(parent === null)return oKeys;
  var pKeys  = ordinaryMetadataKeys(parent, P);
  return pKeys.length ? oKeys.length ? from(new Set(oKeys.concat(pKeys))) : pKeys : oKeys;
};

metadata.exp({getMetadataKeys: function getMetadataKeys(target /*, targetKey */){
  return ordinaryMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
}});
},{"./_an-object":7,"./_array-from-iterable":10,"./_metadata":63,"./_object-gpo":74,"./es6.set":220}],276:[function(require,module,exports){
var metadata               = require('./_metadata')
  , anObject               = require('./_an-object')
  , getPrototypeOf         = require('./_object-gpo')
  , ordinaryHasOwnMetadata = metadata.has
  , ordinaryGetOwnMetadata = metadata.get
  , toMetaKey              = metadata.key;

var ordinaryGetMetadata = function(MetadataKey, O, P){
  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
  if(hasOwn)return ordinaryGetOwnMetadata(MetadataKey, O, P);
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryGetMetadata(MetadataKey, parent, P) : undefined;
};

metadata.exp({getMetadata: function getMetadata(metadataKey, target /*, targetKey */){
  return ordinaryGetMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
}});
},{"./_an-object":7,"./_metadata":63,"./_object-gpo":74}],277:[function(require,module,exports){
var metadata                = require('./_metadata')
  , anObject                = require('./_an-object')
  , ordinaryOwnMetadataKeys = metadata.keys
  , toMetaKey               = metadata.key;

metadata.exp({getOwnMetadataKeys: function getOwnMetadataKeys(target /*, targetKey */){
  return ordinaryOwnMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
}});
},{"./_an-object":7,"./_metadata":63}],278:[function(require,module,exports){
var metadata               = require('./_metadata')
  , anObject               = require('./_an-object')
  , ordinaryGetOwnMetadata = metadata.get
  , toMetaKey              = metadata.key;

metadata.exp({getOwnMetadata: function getOwnMetadata(metadataKey, target /*, targetKey */){
  return ordinaryGetOwnMetadata(metadataKey, anObject(target)
    , arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
}});
},{"./_an-object":7,"./_metadata":63}],279:[function(require,module,exports){
var metadata               = require('./_metadata')
  , anObject               = require('./_an-object')
  , getPrototypeOf         = require('./_object-gpo')
  , ordinaryHasOwnMetadata = metadata.has
  , toMetaKey              = metadata.key;

var ordinaryHasMetadata = function(MetadataKey, O, P){
  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
  if(hasOwn)return true;
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryHasMetadata(MetadataKey, parent, P) : false;
};

metadata.exp({hasMetadata: function hasMetadata(metadataKey, target /*, targetKey */){
  return ordinaryHasMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
}});
},{"./_an-object":7,"./_metadata":63,"./_object-gpo":74}],280:[function(require,module,exports){
var metadata               = require('./_metadata')
  , anObject               = require('./_an-object')
  , ordinaryHasOwnMetadata = metadata.has
  , toMetaKey              = metadata.key;

metadata.exp({hasOwnMetadata: function hasOwnMetadata(metadataKey, target /*, targetKey */){
  return ordinaryHasOwnMetadata(metadataKey, anObject(target)
    , arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
}});
},{"./_an-object":7,"./_metadata":63}],281:[function(require,module,exports){
var metadata                  = require('./_metadata')
  , anObject                  = require('./_an-object')
  , aFunction                 = require('./_a-function')
  , toMetaKey                 = metadata.key
  , ordinaryDefineOwnMetadata = metadata.set;

metadata.exp({metadata: function metadata(metadataKey, metadataValue){
  return function decorator(target, targetKey){
    ordinaryDefineOwnMetadata(
      metadataKey, metadataValue,
      (targetKey !== undefined ? anObject : aFunction)(target),
      toMetaKey(targetKey)
    );
  };
}});
},{"./_a-function":3,"./_an-object":7,"./_metadata":63}],282:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = require('./_export');

$export($export.P + $export.R, 'Set', {toJSON: require('./_collection-to-json')('Set')});
},{"./_collection-to-json":20,"./_export":32}],283:[function(require,module,exports){
'use strict';
// https://github.com/mathiasbynens/String.prototype.at
var $export = require('./_export')
  , $at     = require('./_string-at')(true);

$export($export.P, 'String', {
  at: function at(pos){
    return $at(this, pos);
  }
});
},{"./_export":32,"./_string-at":97}],284:[function(require,module,exports){
'use strict';
// https://tc39.github.io/String.prototype.matchAll/
var $export     = require('./_export')
  , defined     = require('./_defined')
  , toLength    = require('./_to-length')
  , isRegExp    = require('./_is-regexp')
  , getFlags    = require('./_flags')
  , RegExpProto = RegExp.prototype;

var $RegExpStringIterator = function(regexp, string){
  this._r = regexp;
  this._s = string;
};

require('./_iter-create')($RegExpStringIterator, 'RegExp String', function next(){
  var match = this._r.exec(this._s);
  return {value: match, done: match === null};
});

$export($export.P, 'String', {
  matchAll: function matchAll(regexp){
    defined(this);
    if(!isRegExp(regexp))throw TypeError(regexp + ' is not a regexp!');
    var S     = String(this)
      , flags = 'flags' in RegExpProto ? String(regexp.flags) : getFlags.call(regexp)
      , rx    = new RegExp(regexp.source, ~flags.indexOf('g') ? flags : 'g' + flags);
    rx.lastIndex = toLength(regexp.lastIndex);
    return new $RegExpStringIterator(rx, S);
  }
});
},{"./_defined":27,"./_export":32,"./_flags":36,"./_is-regexp":50,"./_iter-create":52,"./_to-length":108}],285:[function(require,module,exports){
'use strict';
// https://github.com/tc39/proposal-string-pad-start-end
var $export = require('./_export')
  , $pad    = require('./_string-pad');

$export($export.P, 'String', {
  padEnd: function padEnd(maxLength /*, fillString = ' ' */){
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
  }
});
},{"./_export":32,"./_string-pad":100}],286:[function(require,module,exports){
'use strict';
// https://github.com/tc39/proposal-string-pad-start-end
var $export = require('./_export')
  , $pad    = require('./_string-pad');

$export($export.P, 'String', {
  padStart: function padStart(maxLength /*, fillString = ' ' */){
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
  }
});
},{"./_export":32,"./_string-pad":100}],287:[function(require,module,exports){
'use strict';
// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
require('./_string-trim')('trimLeft', function($trim){
  return function trimLeft(){
    return $trim(this, 1);
  };
}, 'trimStart');
},{"./_string-trim":102}],288:[function(require,module,exports){
'use strict';
// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
require('./_string-trim')('trimRight', function($trim){
  return function trimRight(){
    return $trim(this, 2);
  };
}, 'trimEnd');
},{"./_string-trim":102}],289:[function(require,module,exports){
require('./_wks-define')('asyncIterator');
},{"./_wks-define":115}],290:[function(require,module,exports){
require('./_wks-define')('observable');
},{"./_wks-define":115}],291:[function(require,module,exports){
// https://github.com/ljharb/proposal-global
var $export = require('./_export');

$export($export.S, 'System', {global: require('./_global')});
},{"./_export":32,"./_global":38}],292:[function(require,module,exports){
var $iterators    = require('./es6.array.iterator')
  , redefine      = require('./_redefine')
  , global        = require('./_global')
  , hide          = require('./_hide')
  , Iterators     = require('./_iterators')
  , wks           = require('./_wks')
  , ITERATOR      = wks('iterator')
  , TO_STRING_TAG = wks('toStringTag')
  , ArrayValues   = Iterators.Array;

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = global[NAME]
    , proto      = Collection && Collection.prototype
    , key;
  if(proto){
    if(!proto[ITERATOR])hide(proto, ITERATOR, ArrayValues);
    if(!proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    for(key in $iterators)if(!proto[key])redefine(proto, key, $iterators[key], true);
  }
}
},{"./_global":38,"./_hide":40,"./_iterators":56,"./_redefine":87,"./_wks":117,"./es6.array.iterator":130}],293:[function(require,module,exports){
var $export = require('./_export')
  , $task   = require('./_task');
$export($export.G + $export.B, {
  setImmediate:   $task.set,
  clearImmediate: $task.clear
});
},{"./_export":32,"./_task":104}],294:[function(require,module,exports){
// ie9- setTimeout & setInterval additional parameters fix
var global     = require('./_global')
  , $export    = require('./_export')
  , invoke     = require('./_invoke')
  , partial    = require('./_partial')
  , navigator  = global.navigator
  , MSIE       = !!navigator && /MSIE .\./.test(navigator.userAgent); // <- dirty ie9- check
var wrap = function(set){
  return MSIE ? function(fn, time /*, ...args */){
    return set(invoke(
      partial,
      [].slice.call(arguments, 2),
      typeof fn == 'function' ? fn : Function(fn)
    ), time);
  } : set;
};
$export($export.G + $export.B + $export.F * MSIE, {
  setTimeout:  wrap(global.setTimeout),
  setInterval: wrap(global.setInterval)
});
},{"./_export":32,"./_global":38,"./_invoke":44,"./_partial":83}],295:[function(require,module,exports){
require('./modules/es6.symbol');
require('./modules/es6.object.create');
require('./modules/es6.object.define-property');
require('./modules/es6.object.define-properties');
require('./modules/es6.object.get-own-property-descriptor');
require('./modules/es6.object.get-prototype-of');
require('./modules/es6.object.keys');
require('./modules/es6.object.get-own-property-names');
require('./modules/es6.object.freeze');
require('./modules/es6.object.seal');
require('./modules/es6.object.prevent-extensions');
require('./modules/es6.object.is-frozen');
require('./modules/es6.object.is-sealed');
require('./modules/es6.object.is-extensible');
require('./modules/es6.object.assign');
require('./modules/es6.object.is');
require('./modules/es6.object.set-prototype-of');
require('./modules/es6.object.to-string');
require('./modules/es6.function.bind');
require('./modules/es6.function.name');
require('./modules/es6.function.has-instance');
require('./modules/es6.parse-int');
require('./modules/es6.parse-float');
require('./modules/es6.number.constructor');
require('./modules/es6.number.to-fixed');
require('./modules/es6.number.to-precision');
require('./modules/es6.number.epsilon');
require('./modules/es6.number.is-finite');
require('./modules/es6.number.is-integer');
require('./modules/es6.number.is-nan');
require('./modules/es6.number.is-safe-integer');
require('./modules/es6.number.max-safe-integer');
require('./modules/es6.number.min-safe-integer');
require('./modules/es6.number.parse-float');
require('./modules/es6.number.parse-int');
require('./modules/es6.math.acosh');
require('./modules/es6.math.asinh');
require('./modules/es6.math.atanh');
require('./modules/es6.math.cbrt');
require('./modules/es6.math.clz32');
require('./modules/es6.math.cosh');
require('./modules/es6.math.expm1');
require('./modules/es6.math.fround');
require('./modules/es6.math.hypot');
require('./modules/es6.math.imul');
require('./modules/es6.math.log10');
require('./modules/es6.math.log1p');
require('./modules/es6.math.log2');
require('./modules/es6.math.sign');
require('./modules/es6.math.sinh');
require('./modules/es6.math.tanh');
require('./modules/es6.math.trunc');
require('./modules/es6.string.from-code-point');
require('./modules/es6.string.raw');
require('./modules/es6.string.trim');
require('./modules/es6.string.iterator');
require('./modules/es6.string.code-point-at');
require('./modules/es6.string.ends-with');
require('./modules/es6.string.includes');
require('./modules/es6.string.repeat');
require('./modules/es6.string.starts-with');
require('./modules/es6.string.anchor');
require('./modules/es6.string.big');
require('./modules/es6.string.blink');
require('./modules/es6.string.bold');
require('./modules/es6.string.fixed');
require('./modules/es6.string.fontcolor');
require('./modules/es6.string.fontsize');
require('./modules/es6.string.italics');
require('./modules/es6.string.link');
require('./modules/es6.string.small');
require('./modules/es6.string.strike');
require('./modules/es6.string.sub');
require('./modules/es6.string.sup');
require('./modules/es6.date.now');
require('./modules/es6.date.to-json');
require('./modules/es6.date.to-iso-string');
require('./modules/es6.date.to-string');
require('./modules/es6.date.to-primitive');
require('./modules/es6.array.is-array');
require('./modules/es6.array.from');
require('./modules/es6.array.of');
require('./modules/es6.array.join');
require('./modules/es6.array.slice');
require('./modules/es6.array.sort');
require('./modules/es6.array.for-each');
require('./modules/es6.array.map');
require('./modules/es6.array.filter');
require('./modules/es6.array.some');
require('./modules/es6.array.every');
require('./modules/es6.array.reduce');
require('./modules/es6.array.reduce-right');
require('./modules/es6.array.index-of');
require('./modules/es6.array.last-index-of');
require('./modules/es6.array.copy-within');
require('./modules/es6.array.fill');
require('./modules/es6.array.find');
require('./modules/es6.array.find-index');
require('./modules/es6.array.species');
require('./modules/es6.array.iterator');
require('./modules/es6.regexp.constructor');
require('./modules/es6.regexp.to-string');
require('./modules/es6.regexp.flags');
require('./modules/es6.regexp.match');
require('./modules/es6.regexp.replace');
require('./modules/es6.regexp.search');
require('./modules/es6.regexp.split');
require('./modules/es6.promise');
require('./modules/es6.map');
require('./modules/es6.set');
require('./modules/es6.weak-map');
require('./modules/es6.weak-set');
require('./modules/es6.typed.array-buffer');
require('./modules/es6.typed.data-view');
require('./modules/es6.typed.int8-array');
require('./modules/es6.typed.uint8-array');
require('./modules/es6.typed.uint8-clamped-array');
require('./modules/es6.typed.int16-array');
require('./modules/es6.typed.uint16-array');
require('./modules/es6.typed.int32-array');
require('./modules/es6.typed.uint32-array');
require('./modules/es6.typed.float32-array');
require('./modules/es6.typed.float64-array');
require('./modules/es6.reflect.apply');
require('./modules/es6.reflect.construct');
require('./modules/es6.reflect.define-property');
require('./modules/es6.reflect.delete-property');
require('./modules/es6.reflect.enumerate');
require('./modules/es6.reflect.get');
require('./modules/es6.reflect.get-own-property-descriptor');
require('./modules/es6.reflect.get-prototype-of');
require('./modules/es6.reflect.has');
require('./modules/es6.reflect.is-extensible');
require('./modules/es6.reflect.own-keys');
require('./modules/es6.reflect.prevent-extensions');
require('./modules/es6.reflect.set');
require('./modules/es6.reflect.set-prototype-of');
require('./modules/es7.array.includes');
require('./modules/es7.string.at');
require('./modules/es7.string.pad-start');
require('./modules/es7.string.pad-end');
require('./modules/es7.string.trim-left');
require('./modules/es7.string.trim-right');
require('./modules/es7.string.match-all');
require('./modules/es7.symbol.async-iterator');
require('./modules/es7.symbol.observable');
require('./modules/es7.object.get-own-property-descriptors');
require('./modules/es7.object.values');
require('./modules/es7.object.entries');
require('./modules/es7.object.define-getter');
require('./modules/es7.object.define-setter');
require('./modules/es7.object.lookup-getter');
require('./modules/es7.object.lookup-setter');
require('./modules/es7.map.to-json');
require('./modules/es7.set.to-json');
require('./modules/es7.system.global');
require('./modules/es7.error.is-error');
require('./modules/es7.math.iaddh');
require('./modules/es7.math.isubh');
require('./modules/es7.math.imulh');
require('./modules/es7.math.umulh');
require('./modules/es7.reflect.define-metadata');
require('./modules/es7.reflect.delete-metadata');
require('./modules/es7.reflect.get-metadata');
require('./modules/es7.reflect.get-metadata-keys');
require('./modules/es7.reflect.get-own-metadata');
require('./modules/es7.reflect.get-own-metadata-keys');
require('./modules/es7.reflect.has-metadata');
require('./modules/es7.reflect.has-own-metadata');
require('./modules/es7.reflect.metadata');
require('./modules/es7.asap');
require('./modules/es7.observable');
require('./modules/web.timers');
require('./modules/web.immediate');
require('./modules/web.dom.iterable');
module.exports = require('./modules/_core');
},{"./modules/_core":23,"./modules/es6.array.copy-within":120,"./modules/es6.array.every":121,"./modules/es6.array.fill":122,"./modules/es6.array.filter":123,"./modules/es6.array.find":125,"./modules/es6.array.find-index":124,"./modules/es6.array.for-each":126,"./modules/es6.array.from":127,"./modules/es6.array.index-of":128,"./modules/es6.array.is-array":129,"./modules/es6.array.iterator":130,"./modules/es6.array.join":131,"./modules/es6.array.last-index-of":132,"./modules/es6.array.map":133,"./modules/es6.array.of":134,"./modules/es6.array.reduce":136,"./modules/es6.array.reduce-right":135,"./modules/es6.array.slice":137,"./modules/es6.array.some":138,"./modules/es6.array.sort":139,"./modules/es6.array.species":140,"./modules/es6.date.now":141,"./modules/es6.date.to-iso-string":142,"./modules/es6.date.to-json":143,"./modules/es6.date.to-primitive":144,"./modules/es6.date.to-string":145,"./modules/es6.function.bind":146,"./modules/es6.function.has-instance":147,"./modules/es6.function.name":148,"./modules/es6.map":149,"./modules/es6.math.acosh":150,"./modules/es6.math.asinh":151,"./modules/es6.math.atanh":152,"./modules/es6.math.cbrt":153,"./modules/es6.math.clz32":154,"./modules/es6.math.cosh":155,"./modules/es6.math.expm1":156,"./modules/es6.math.fround":157,"./modules/es6.math.hypot":158,"./modules/es6.math.imul":159,"./modules/es6.math.log10":160,"./modules/es6.math.log1p":161,"./modules/es6.math.log2":162,"./modules/es6.math.sign":163,"./modules/es6.math.sinh":164,"./modules/es6.math.tanh":165,"./modules/es6.math.trunc":166,"./modules/es6.number.constructor":167,"./modules/es6.number.epsilon":168,"./modules/es6.number.is-finite":169,"./modules/es6.number.is-integer":170,"./modules/es6.number.is-nan":171,"./modules/es6.number.is-safe-integer":172,"./modules/es6.number.max-safe-integer":173,"./modules/es6.number.min-safe-integer":174,"./modules/es6.number.parse-float":175,"./modules/es6.number.parse-int":176,"./modules/es6.number.to-fixed":177,"./modules/es6.number.to-precision":178,"./modules/es6.object.assign":179,"./modules/es6.object.create":180,"./modules/es6.object.define-properties":181,"./modules/es6.object.define-property":182,"./modules/es6.object.freeze":183,"./modules/es6.object.get-own-property-descriptor":184,"./modules/es6.object.get-own-property-names":185,"./modules/es6.object.get-prototype-of":186,"./modules/es6.object.is":190,"./modules/es6.object.is-extensible":187,"./modules/es6.object.is-frozen":188,"./modules/es6.object.is-sealed":189,"./modules/es6.object.keys":191,"./modules/es6.object.prevent-extensions":192,"./modules/es6.object.seal":193,"./modules/es6.object.set-prototype-of":194,"./modules/es6.object.to-string":195,"./modules/es6.parse-float":196,"./modules/es6.parse-int":197,"./modules/es6.promise":198,"./modules/es6.reflect.apply":199,"./modules/es6.reflect.construct":200,"./modules/es6.reflect.define-property":201,"./modules/es6.reflect.delete-property":202,"./modules/es6.reflect.enumerate":203,"./modules/es6.reflect.get":206,"./modules/es6.reflect.get-own-property-descriptor":204,"./modules/es6.reflect.get-prototype-of":205,"./modules/es6.reflect.has":207,"./modules/es6.reflect.is-extensible":208,"./modules/es6.reflect.own-keys":209,"./modules/es6.reflect.prevent-extensions":210,"./modules/es6.reflect.set":212,"./modules/es6.reflect.set-prototype-of":211,"./modules/es6.regexp.constructor":213,"./modules/es6.regexp.flags":214,"./modules/es6.regexp.match":215,"./modules/es6.regexp.replace":216,"./modules/es6.regexp.search":217,"./modules/es6.regexp.split":218,"./modules/es6.regexp.to-string":219,"./modules/es6.set":220,"./modules/es6.string.anchor":221,"./modules/es6.string.big":222,"./modules/es6.string.blink":223,"./modules/es6.string.bold":224,"./modules/es6.string.code-point-at":225,"./modules/es6.string.ends-with":226,"./modules/es6.string.fixed":227,"./modules/es6.string.fontcolor":228,"./modules/es6.string.fontsize":229,"./modules/es6.string.from-code-point":230,"./modules/es6.string.includes":231,"./modules/es6.string.italics":232,"./modules/es6.string.iterator":233,"./modules/es6.string.link":234,"./modules/es6.string.raw":235,"./modules/es6.string.repeat":236,"./modules/es6.string.small":237,"./modules/es6.string.starts-with":238,"./modules/es6.string.strike":239,"./modules/es6.string.sub":240,"./modules/es6.string.sup":241,"./modules/es6.string.trim":242,"./modules/es6.symbol":243,"./modules/es6.typed.array-buffer":244,"./modules/es6.typed.data-view":245,"./modules/es6.typed.float32-array":246,"./modules/es6.typed.float64-array":247,"./modules/es6.typed.int16-array":248,"./modules/es6.typed.int32-array":249,"./modules/es6.typed.int8-array":250,"./modules/es6.typed.uint16-array":251,"./modules/es6.typed.uint32-array":252,"./modules/es6.typed.uint8-array":253,"./modules/es6.typed.uint8-clamped-array":254,"./modules/es6.weak-map":255,"./modules/es6.weak-set":256,"./modules/es7.array.includes":257,"./modules/es7.asap":258,"./modules/es7.error.is-error":259,"./modules/es7.map.to-json":260,"./modules/es7.math.iaddh":261,"./modules/es7.math.imulh":262,"./modules/es7.math.isubh":263,"./modules/es7.math.umulh":264,"./modules/es7.object.define-getter":265,"./modules/es7.object.define-setter":266,"./modules/es7.object.entries":267,"./modules/es7.object.get-own-property-descriptors":268,"./modules/es7.object.lookup-getter":269,"./modules/es7.object.lookup-setter":270,"./modules/es7.object.values":271,"./modules/es7.observable":272,"./modules/es7.reflect.define-metadata":273,"./modules/es7.reflect.delete-metadata":274,"./modules/es7.reflect.get-metadata":276,"./modules/es7.reflect.get-metadata-keys":275,"./modules/es7.reflect.get-own-metadata":278,"./modules/es7.reflect.get-own-metadata-keys":277,"./modules/es7.reflect.has-metadata":279,"./modules/es7.reflect.has-own-metadata":280,"./modules/es7.reflect.metadata":281,"./modules/es7.set.to-json":282,"./modules/es7.string.at":283,"./modules/es7.string.match-all":284,"./modules/es7.string.pad-end":285,"./modules/es7.string.pad-start":286,"./modules/es7.string.trim-left":287,"./modules/es7.string.trim-right":288,"./modules/es7.symbol.async-iterator":289,"./modules/es7.symbol.observable":290,"./modules/es7.system.global":291,"./modules/web.dom.iterable":292,"./modules/web.immediate":293,"./modules/web.timers":294}],296:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],297:[function(require,module,exports){
(function (process,global){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    if (typeof process === "object" && process.domain) {
      invoke = process.domain.bind(invoke);
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          if (method === "return" ||
              (method === "throw" && delegate.iterator[method] === undefined)) {
            // A return or throw (when the delegate iterator has no throw
            // method) always terminates the yield* loop.
            context.delegate = null;

            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            var returnMethod = delegate.iterator["return"];
            if (returnMethod) {
              var record = tryCatch(returnMethod, delegate.iterator, arg);
              if (record.type === "throw") {
                // If the return method threw an exception, let that
                // exception prevail over the original return or throw.
                method = "throw";
                arg = record.arg;
                continue;
              }
            }

            if (method === "return") {
              // Continue with the outer return, now that the delegate
              // iterator has been terminated.
              continue;
            }
          }

          var record = tryCatch(
            delegate.iterator[method],
            delegate.iterator,
            arg
          );

          if (record.type === "throw") {
            context.delegate = null;

            // Like returning generator.throw(uncaught), but without the
            // overhead of an extra function call.
            method = "throw";
            arg = record.arg;
            continue;
          }

          // Delegate generator ran and handled its own exceptions so
          // regardless of what the method was, we continue as if it is
          // "next" with an undefined arg.
          method = "next";
          arg = undefined;

          var info = record.arg;
          if (info.done) {
            context[delegate.resultName] = info.value;
            context.next = delegate.nextLoc;
          } else {
            state = GenStateSuspendedYield;
            return info;
          }

          context.delegate = null;
        }

        if (method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = arg;

        } else if (method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw arg;
          }

          if (context.dispatchException(arg)) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            method = "next";
            arg = undefined;
          }

        } else if (method === "return") {
          context.abrupt("return", arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          var info = {
            value: record.arg,
            done: context.done
          };

          if (record.arg === ContinueSentinel) {
            if (context.delegate && method === "next") {
              // Deliberately forget the last sent value so that we don't
              // accidentally pass it on to the delegate.
              arg = undefined;
            }
          } else {
            return info;
          }

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(arg) call above.
          method = "throw";
          arg = record.arg;
        }
      }
    };
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;
        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.next = finallyEntry.finallyLoc;
      } else {
        this.complete(record);
      }

      return ContinueSentinel;
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = record.arg;
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":296}],298:[function(require,module,exports){
'use strict';

require('babel-polyfill');

var _Mouse = require('./nts/editor/utils/Mouse');

var _Mouse2 = _interopRequireDefault(_Mouse);

var _Config = require('./nts/editor/config/Config');

var _Config2 = _interopRequireDefault(_Config);

var _Calculator = require('./nts/editor/utils/Calculator');

var _StickerMain = require('./nts/editor/sticker/StickerMain');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stage, stickerMain, rootLayer, stickerLayer, canvas, context, renderer;

window.onload = initailize.bind(undefined);

function initailize() {
    canvas = document.getElementById('canvas');

    renderer = new PIXI.CanvasRenderer(canvas.width, canvas.height, {
        view: canvas,
        autoResize: true,
        backgroundColor: 0x673AB7
    });

    /*renderer = new PIXI.WebGLRenderer(canvas.width, canvas.height, {
        view: canvas,
        autoResize: true,
        backgroundColor: 0x673AB7
    });*/

    // 위치가 정수가 아닐경우 흐릿하게 보이는 문제가 있어
    // 렌더러의 위치를 정수로 연산될 수 있도록 한다.
    renderer.roundPixels = true;

    _Config2.default.renderer = renderer;
    _Mouse2.default.renderer = renderer;
    _Mouse2.default.mouse = _Config2.default.instance.desktop ? _Mouse2.default.DESKTOP_MOUSE : _Mouse2.default.MOBILE_MOUSE;

    stage = new PIXI.Container(0xE6E9EC);
    rootLayer = new PIXI.Container(0xE6E9EC);
    stickerLayer = new PIXI.Container(0xE6E9EC);

    // 컨테이너에 scale과 rotation 이 있을 때를 고려해서 만들었습니다
    //stickerLayer.scale = {x: 1.2, y: 1.2};
    // stickerLayer.rotation = Calc.toRadians(40);

    stage.addChild(stickerLayer);
    stage.addChild(rootLayer);

    stickerMain = new _StickerMain.StickerMain(renderer, rootLayer, stickerLayer);

    updateLoop();
    resizeWindow();
}

function updateLoop(ms) {
    update(ms);
    requestAnimFrame(updateLoop.bind(this));
}

function update(ms) {
    renderer.render(stage);
}

function resizeWindow() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    /**
     * 캔버스 사이즈와 디스플레이 사이즈 설정
     * 레티나 그래픽 지원 코드
     */
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    /**
     * PIXI renderer 리사이즈
     * PIXI 에게 viewport 사이즈 변경 알림
     */
    renderer.resize(width, height);

    if (stickerMain) stickerMain.resize();
}

},{"./nts/editor/config/Config":299,"./nts/editor/sticker/StickerMain":300,"./nts/editor/utils/Calculator":305,"./nts/editor/utils/Mouse":306,"babel-polyfill":1}],299:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var singleton = Symbol();
var singletonEnforcer = Symbol();

var Config = function (_PIXI$utils$EventEmit) {
    _inherits(Config, _PIXI$utils$EventEmit);

    _createClass(Config, null, [{
        key: 'renderer',
        set: function set(value) {
            this._renderer = value;
        },
        get: function get() {
            return this._renderer;
        }

        /**
         * PIXI.RENDERER_TYPE.WEBGL
         * PIXI.RENDERER_TYPE.CANVAS
         * @returns {*}
         */

    }, {
        key: 'renderType',
        get: function get() {
            if (this._renderer) {
                return this._renderer.type;
            }
            return null;
        }
    }]);

    function Config(enforcer) {
        _classCallCheck(this, Config);

        var _this = _possibleConstructorReturn(this, _PIXI$utils$EventEmit.call(this));

        if (enforcer !== singletonEnforcer) {
            throw new Error('Cannot construct singleton');
        }

        _this._init();
        _this.checkOS();
        return _this;
    }

    Config.prototype._init = function _init() {}
    //


    //--------------------------------------------------------------------------
    //
    //    OS 체크
    //
    //--------------------------------------------------------------------------


    /**
     * Phaser.Device 코드
     * http://phaser.io/docs/2.4.2/Phaser.Device.html
     */
    ;

    Config.prototype.checkOS = function checkOS() {
        this.desktop = false;

        var ua = navigator.userAgent;

        if (/Playstation Vita/.test(ua)) {
            this.vita = true;
        } else if (/Kindle/.test(ua) || /\bKF[A-Z][A-Z]+/.test(ua) || /Silk.*Mobile Safari/.test(ua)) {
            this.kindle = true;
            // This will NOT detect early generations of Kindle Fire, I think there is no reliable way...
            // E.g. "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_3; en-us; Silk/1.1.0-80) AppleWebKit/533.16 (KHTML, like Gecko) Version/5.0 Safari/533.16 Silk-Accelerated=true"
        } else if (/Android/.test(ua)) {
            this.android = true;
        } else if (/CrOS/.test(ua)) {
            this.chromeOS = true;
        } else if (/iP[ao]d|iPhone/i.test(ua)) {
            this.iOS = true;
            navigator.appVersion.match(/OS (\d+)/);
            this.iOSVersion = parseInt(RegExp.$1, 10);
        } else if (/Linux/.test(ua)) {
            this.linux = true;
        } else if (/Mac OS/.test(ua)) {
            this.macOS = true;
        } else if (/Windows/.test(ua)) {
            this.windows = true;
        }

        if (/Windows Phone/i.test(ua) || /IEMobile/i.test(ua)) {
            this.android = false;
            this.iOS = false;
            this.macOS = false;
            this.windows = true;
            this.windowsPhone = true;
        }

        var silk = /Silk/.test(ua); // detected in browsers

        if (this.windows || this.macOS || this.linux && !silk || this.chromeOS) {
            this.desktop = true;
        }

        //  Windows Phone / Table reset
        if (this.windowsPhone || /Windows NT/i.test(ua) && /Touch/i.test(ua)) {
            this.desktop = false;
        }
    };

    _createClass(Config, null, [{
        key: 'instance',
        get: function get() {
            if (!this[singleton]) {
                this[singleton] = new Config(singletonEnforcer);
            }
            return this[singleton];
        }
    }]);

    return Config;
}(PIXI.utils.EventEmitter);

exports.default = Config;

},{}],300:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.StickerMain = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Calculator = require('../utils/Calculator');

var _Painter = require('./../utils/Painter');

var _VectorContainer = require('../view/VectorContainer');

var _TransformTool = require('../transform/TransformTool');

var _Mouse = require('./../utils/Mouse');

var _Mouse2 = _interopRequireDefault(_Mouse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StickerMain = exports.StickerMain = function (_PIXI$utils$EventEmit) {
    _inherits(StickerMain, _PIXI$utils$EventEmit);

    _createClass(StickerMain, null, [{
        key: 'DELETED',
        get: function get() {
            return 'deleted';
        }
    }, {
        key: 'SELECTED',
        get: function get() {
            return 'selected';
        }
    }, {
        key: 'DESELECTED',
        get: function get() {
            return 'deselected';
        }
    }]);

    function StickerMain(renderer, stageLayer, stickerLayer) {
        _classCallCheck(this, StickerMain);

        var _this = _possibleConstructorReturn(this, _PIXI$utils$EventEmit.call(this));

        _this.renderer = renderer;
        _this.stageLayer = stageLayer;
        _this.stickerLayer = stickerLayer;

        _this.initialize();
        _this.addDebug();
        // this.initGUI();
        // this.testCreateStickers();

        _this.startGuide();
        return _this;
    }

    StickerMain.prototype.tapOrClick = function tapOrClick(event) {
        this.stopGuide();
        window.removeEventListener('mouseup', this._tapOrClickListener, false);
        window.removeEventListener('touchend', this._tapOrClickListener, false);

        this.loadingText = _Painter.Painter.getText('LOADING...', 0x1b1b1b, 0xf1c40f);
        this.loadingText.x = this.renderer.view.width / 2;
        this.loadingText.y = this.renderer.view.height / 2;
        this.stickerLayer.addChild(this.loadingText);

        setTimeout(this.delayTestStart.bind(this), 100);
    };

    StickerMain.prototype.delayTestStart = function delayTestStart() {
        this.initGUI();
        this.testCreateStickers();
    };

    StickerMain.prototype.initialize = function initialize() {
        this.stickers = [];
        this.isDemoMode = true;
        this.isRestore = false;
        this._cursorArea = false;
        this.stickerLayer.updateTransform();
        var options = { deleteButtonOffsetY: 0 };
        this.canvas = document.getElementById('canvas');
        this.transformTool = new _TransformTool.TransformTool(this.stageLayer, this.stickerLayer, options);
    };

    StickerMain.prototype.initGUI = function initGUI() {
        var gui = new dat.GUI();
        var title = gui.addFolder('커서 영역 화면에 표시');
        title.add(this, 'cursorArea');
        title.open();
        //gui.close();
    };

    StickerMain.prototype.createSticker = function createSticker(url, x, y, width, height) {
        var visible = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;

        var sticker = new _VectorContainer.VectorContainer();
        sticker.visible = visible;
        window['s' + this.stickers.length] = sticker;
        this.stickerLayer.addChild(sticker);
        this.stickers.push(sticker);
        sticker.pivot = { x: width / 2, y: height / 2 };
        sticker.x = x;
        sticker.y = y;
        sticker.rotation = -this.stickerLayer.rotation;
        sticker._stickerMouseDownListener = this.onStickerMouseDown.bind(this);
        sticker._stickerDeleteListener = this.onStickerDelete.bind(this);
        sticker._stickerSelectListener = this.onStickerSelect.bind(this);
        sticker._stickerDeselectListener = this.onStickerDeselect.bind(this);
        sticker._stickerLoadCompleteListener = this.onLoadComplete.bind(this);
        sticker.on('mousedown', sticker._stickerMouseDownListener);
        sticker.on('touchstart', sticker._stickerMouseDownListener);
        sticker.on(_TransformTool.TransformTool.DELETE, sticker._stickerDeleteListener);
        sticker.on(_TransformTool.TransformTool.SELECT, sticker._stickerSelectListener);
        sticker.on(_TransformTool.TransformTool.DESELECT, sticker._stickerDeselectListener);
        sticker.on(_VectorContainer.VectorContainer.LOAD_COMPLETE, sticker._stickerLoadCompleteListener);
        sticker.load(url, 0, 0, width, height);
        return sticker;
    };

    StickerMain.prototype.deleteSticker = function deleteSticker(target) {
        if (target === null) return;

        target.off('mousedown', target._stickerMouseDownListener);
        target.off('touchstart', target._stickerMouseDownListener);
        target.off(_TransformTool.TransformTool.DELETE, target._stickerDeleteListener);
        target.off(_TransformTool.TransformTool.SELECT, target._stickerSelectListener);
        target.off(_TransformTool.TransformTool.DESELECT, target._stickerDeselectListener);
        target.off(_VectorContainer.VectorContainer.LOAD_COMPLETE, target._stickerLoadCompleteListener);
        target._stickerMouseDownListener = null;
        target._stickerDeleteListener = null;
        target._stickerSelectListener = null;
        target._stickerDeselectListener = null;
        target._stickerLoadCompleteListener = null;

        for (var i = 0; i < this.stickers.length; i++) {
            var sticker = this.stickers[i];
            if (sticker === target) {
                this.stickers.splice(i, 1);
                this.stickerLayer.removeChild(sticker);
                this.transformTool.releaseTarget();
                sticker.delete();
                sticker = null;
            }
        }
    };

    StickerMain.prototype.restore = function restore(snapshot) {
        if (!snapshot) return;

        this.stickers = null;
        this.stickers = [];
        this.isRestore = true;
        this.restoreCount = 0;
        this.restoreTotal = snapshot.length;

        for (var i = 0; i < snapshot.length; i++) {
            var vo = snapshot[i];
            var sticker = new _VectorContainer.VectorContainer();
            this.stickerLayer.addChild(sticker);
            this.stickers.push(sticker);

            var transform = vo.transform;
            sticker.x = transform.x;
            sticker.y = transform.y;
            sticker.scale.x = transform.scaleX;
            sticker.scale.y = transform.scaleY;
            sticker.rotation = transform.rotation;
            sticker.childIndex = vo.childIndex;
            sticker._stickerMouseDownListener = this.onStickerMouseDown.bind(this);
            sticker._stickerDeleteListener = this.onStickerDelete.bind(this);
            sticker._stickerSelectListener = this.onStickerSelect.bind(this);
            sticker._stickerDeselectListener = this.onStickerDeselect.bind(this);
            sticker._stickerLoadCompleteListener = this.onLoadComplete.bind(this);
            sticker.on('mousedown', sticker._stickerMouseDownListener);
            sticker.on('touchstart', sticker._stickerMouseDownListener);
            sticker.on(_TransformTool.TransformTool.DELETE, sticker._stickerDeleteListener);
            sticker.on(_TransformTool.TransformTool.SELECT, sticker._stickerSelectListener);
            sticker.on(_TransformTool.TransformTool.DESELECT, sticker._stickerDeselectListener);
            sticker.on(_VectorContainer.VectorContainer.LOAD_COMPLETE, sticker._stickerLoadCompleteListener);
            sticker.load(vo.url, vo.x, vo.y, vo.width, vo.height);
        }
    };

    StickerMain.prototype.updateTransformTool = function updateTransformTool() {

        this.transformTool.updateGraphics();
    };

    StickerMain.prototype.releaseTarget = function releaseTarget() {
        this.transformTool.releaseTarget();
    };

    StickerMain.prototype.show = function show() {
        for (var i = 0; i < this.stickers.length; i++) {
            this.stickers[i].visible = true;
        }this.transformTool.show();
    };

    StickerMain.prototype.hide = function hide() {
        for (var i = 0; i < this.stickers.length; i++) {
            this.stickers[i].visible = false;
        }this.transformTool.hide();
    };

    StickerMain.prototype.clear = function clear() {
        var cloneStickers = this.stickers.slice(0);
        for (var i = 0; i < cloneStickers.length; i++) {
            this.deleteSticker(cloneStickers[i]);
        }
    };

    StickerMain.prototype.update = function update() {
        this.transformTool.update();
    };

    StickerMain.prototype.resize = function resize() {};

    StickerMain.prototype.onLoadComplete = function onLoadComplete(e) {
        if (this.isDemoMode) return;

        if (this.isRestore === false) {
            this.stickerLayer.updateTransform();
            this.transformTool.activeTarget(e.target);
        } else {
            if (++this.restoreCount == this.restoreTotal) this.isRestore = false;
        }
    };

    StickerMain.prototype.onStickerClick = function onStickerClick(e) {
        var target = e.target;
        this.stickerLayer.setChildIndex(target, this.stickerLayer.children.length - 1);
        this.transformTool.setTarget(e);
    };

    StickerMain.prototype.onStickerMouseDown = function onStickerMouseDown(e) {
        var target = e.target;
        //if (target.checkAlphaPoint(Mouse.global)) return;
        e.stopPropagation();
        this.onStickerClick(e);
    };

    StickerMain.prototype.onStickerDelete = function onStickerDelete(target) {
        this.deleteSticker(target);
        this.emit(StickerMain.DELETED, target);
    };

    StickerMain.prototype.onStickerSelect = function onStickerSelect(target) {
        this.emit(StickerMain.SELECTED, target);
    };

    StickerMain.prototype.onStickerDeselect = function onStickerDeselect(target) {
        this.emit(StickerMain.DESELECTED, target);
    };

    StickerMain.prototype.onKeyUp = function onKeyUp(e) {
        switch (e.keyCode) {
            case 27:
                //consts.KeyCode.ESC:
                this.clear();
                break;
            case 32:
                //consts.KeyCode.SPACE:
                this.testCreateStickers();
                break;
            case 49:
                //consts.KeyCode.NUM_1:
                this.deleteSticker(this.target);
                break;
            case 50:
                //consts.KeyCode.NUM_2:
                break;
            case 51:
                //consts.KeyCode.NUM_3:
                break;
            case 52:
                //consts.KeyCode.NUM_4:
                break;
            case 53:
                //consts.KeyCode.NUM_5:
                break;
            case 54:
                //consts.KeyCode.NUM_6:
                break;
        }
    };

    StickerMain.prototype.addDebug = function addDebug() {
        this.svgs = ['./../img/svg/airplane.svg', './../img/svg/bank.svg', './../img/svg/beacon.svg', './../img/svg/beats.svg', './../img/svg/bell.svg', './../img/svg/bicycle.svg', './../img/svg/box.svg', './../img/svg/browser.svg', './../img/svg/bulb.svg', './../img/svg/casino.svg', './../img/svg/chair.svg', './../img/svg/config.svg', './../img/svg/cup.svg', './../img/svg/folder.svg', './../img/svg/football.svg', './../img/svg/headphones.svg', './../img/svg/heart.svg', './../img/svg/laptop.svg', './../img/svg/letter.svg', './../img/svg/like.svg', './../img/svg/map.svg', './../img/svg/medal.svg', './../img/svg/mic.svg', './../img/svg/milk.svg', './../img/svg/pencil.svg', './../img/svg/picture.svg', './../img/svg/polaroid.svg', './../img/svg/printer.svg', './../img/svg/search.svg', './../img/svg/shoppingbag.svg', './../img/svg/speed.svg', './../img/svg/stopwatch.svg', './../img/svg/tweet.svg', './../img/svg/watch.svg'];

        window.document.addEventListener('keyup', this.onKeyUp.bind(this));
    };

    StickerMain.prototype.testCreateStickers = function testCreateStickers() {
        if (this.stickers.length !== 0) return;

        var stickers = [];
        var defaultSize = 100;
        var defaultSticker = 3;
        var canvasWidth = this.canvas.width;
        var canvasHeight = this.canvas.height;
        // var totalSticker = defaultSticker + parseInt(Math.random() * (this.svgs.length - defaultSticker));
        var totalSticker = defaultSticker;

        for (var i = 0; i < totalSticker; i++) {
            var stickerSize = defaultSize + parseInt(Math.random() * 40);
            var direction = Math.random() < 0.5 ? -1 : 1;
            var rotation = _Calculator.Calc.toRadians(Math.random() * 360) * direction;
            var randomIndex = parseInt(Math.random() * this.svgs.length);
            var url = this.svgs.splice(randomIndex, 1)[0];
            var randomX = stickerSize + parseInt(Math.random() * (canvasWidth - stickerSize * 2));
            var randomY = stickerSize + parseInt(Math.random() * (canvasHeight - stickerSize * 2));
            randomX = Math.round(randomX);
            randomY = Math.round(randomY);

            var sticker = this.createSticker(url, randomX, randomY, stickerSize, stickerSize, false);
            sticker.scale.x = sticker.scale.y = 0;

            var stickerVO = {
                sticker: sticker,
                scale: 1,
                rotation: rotation,
                animationTime: 60
            };

            stickers.push(stickerVO);
        }

        this.addStickerWithMotion(stickers);
    };

    StickerMain.prototype.addStickerWithMotion = function addStickerWithMotion() {
        var stickerVOList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        if (stickerVOList != null) this.addStickerVOList = stickerVOList;
        if (!this.addStickerVOList || this.addStickerVOList.length <= 0) return;

        var displayTime = 4;
        var displayDuration = displayTime * this.addStickerVOList.length;

        cancelAnimFrame(this.addAniId);
        this.addAniId = animationLoop(this.startAddTween.bind(this, displayTime, stickerVOList), displayDuration, 'linear', function progress() {}, function complete() {}, this);

        /*var stickerVO = this.addStickerVOList.shift();
         stickerVO.sticker.visible = true;
         cancelAnimFrame(this.addAniId);
         this.addAniId =
         animationLoop(
         this.addTween.bind(this, stickerVO), 60, 'easeOutElastic',
         function progressHandler() {},
         this.addStickerWithMotion.bind(this),
         this
         );*/
    };

    StickerMain.prototype.roundPixelSticker = function roundPixelSticker(sticker) {
        sticker.scale.x = sticker.scale.y = 1;
    };

    StickerMain.prototype.activeLastTarget = function activeLastTarget(sticker) {
        this.transformTool.activeTarget(sticker);
        this.stickerLayer.setChildIndex(sticker, this.stickerLayer.children.length - 1);
    };

    StickerMain.prototype.startAddTween = function startAddTween(displayTime, stickerVOList, easeDecimal, stepDecimal, currentStep) {

        if (currentStep % displayTime == 0) {

            this.removeLoadingText();

            var stickerVO = stickerVOList.shift();
            var sticker = stickerVO.sticker;

            var completeCallBack = function completeCallBack() {};

            if (stickerVOList.length == 1) completeCallBack = this.activeLastTarget.bind(this, sticker);

            sticker.visible = true;

            animationLoop(this.addTween.bind(this, stickerVO), stickerVO.animationTime, 'easeOutElastic', function progress() {}, completeCallBack, this);
        }
    };

    StickerMain.prototype.addTween = function addTween(stickerVO, easeDecimal, stepDecimal, currentStep) {
        var vo = stickerVO;
        var sticker = vo.sticker;
        var scale = 0 + (vo.scale - 0) * easeDecimal;
        var rotation = 0 + (vo.rotation - 0) * easeDecimal;
        sticker.scale.x = sticker.scale.y = scale;
        sticker.rotation = rotation;

        if (currentStep == vo.animationTime) {
            sticker.scale.x = sticker.scale.y = vo.scale;
            // sticker.emit(TransformTool.TRANSFORM_COMPLETE);
        }
    };

    StickerMain.prototype.startGuide = function startGuide() {
        var _this2 = this;

        var delayTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 800;

        this.isGuide = false;
        this._guideId = setInterval(function () {
            _this2.doGuide();
        }, delayTime);

        this._tapOrClickListener = this.tapOrClick.bind(this);
        window.addEventListener('mouseup', this._tapOrClickListener, false);
        window.addEventListener('touchend', this._tapOrClickListener, false);
    };

    StickerMain.prototype.stopGuide = function stopGuide() {
        clearInterval(this._guideId);
        if (this.guideText) this.stickerLayer.removeChild(this.guideText);
    };

    StickerMain.prototype.removeLoadingText = function removeLoadingText() {
        if (this.loadingText) this.stickerLayer.removeChild(this.loadingText);
    };

    StickerMain.prototype.doGuide = function doGuide() {
        if (this.isGuide === false) {
            this.isGuide = true;

            if (!this.guideText) {
                this.guideText = _Painter.Painter.getText('TOUCH SCREEN', 0x1b1b1b, 0xf1c40f);
                // this.guideText = Painter.getText('TOUCH SCREEN', 0xFFFFFF, 0x9b59b6);
            }

            this.guideText.x = this.renderer.view.width / 2;
            this.guideText.y = this.renderer.view.height / 2;
            this.stickerLayer.addChild(this.guideText);
        } else {
            this.isGuide = false;
            if (this.guideText) this.stickerLayer.removeChild(this.guideText);
        }
    };

    _createClass(StickerMain, [{
        key: 'cursorArea',
        set: function set(value) {
            this._cursorArea = value;
            this.transformTool.visibleCursorArea(value);
        },
        get: function get() {
            return this._cursorArea;
        }
    }, {
        key: 'snapshot',
        get: function get() {
            var snapshot = [];
            for (var i = 0; i < this.stickers.length; i++) {
                var vo = this.stickers[i].snapshot;
                vo.childIndex = this.stickerLayer.getChildIndex(this.stickers[i]);
                snapshot[i] = vo;
            }

            snapshot.sort(function (a, b) {
                return a.childIndex < b.childIndex ? -1 : a.childIndex > b.childIndex ? 1 : 0;
            });

            return snapshot;
        }
    }, {
        key: 'modified',
        get: function get() {
            return this.stickers.length !== 0;
        }
    }, {
        key: 'lastSticker',
        get: function get() {

            if (this.stickers.length === 0) return null;

            var children = this.stickerLayer.children;

            for (var i = children.length; i--;) {

                if (this.stickers.indexOf(children[i]) != -1) return children[i];
            }

            return null;
        }
    }, {
        key: 'target',
        get: function get() {
            return this.transformTool.target;
        }
    }]);

    return StickerMain;
}(PIXI.utils.EventEmitter);

},{"../transform/TransformTool":304,"../utils/Calculator":305,"../view/VectorContainer":310,"./../utils/Mouse":306,"./../utils/Painter":307}],301:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RotationControlType = exports.RotationControlType = function () {
    function RotationControlType() {
        _classCallCheck(this, RotationControlType);
    }

    _createClass(RotationControlType, null, [{
        key: 'NONE',
        get: function get() {
            return 'rotationNone';
        }
    }, {
        key: 'DELETE',
        get: function get() {
            return 'rotationDelete';
        }
    }, {
        key: 'TOP_LEFT',
        get: function get() {
            return 'rotationTopLeft';
        }
    }, {
        key: 'TOP_CENTER',
        get: function get() {
            return 'rotationTopCenter';
        }
    }, {
        key: 'TOP_RIGHT',
        get: function get() {
            return 'rotationTopRight';
        }
    }, {
        key: 'MIDDLE_LEFT',
        get: function get() {
            return 'rotationMiddleLeft';
        }
    }, {
        key: 'MIDDLE_RIGHT',
        get: function get() {
            return 'rotationMiddleRight';
        }
    }, {
        key: 'BOTTOM_LEFT',
        get: function get() {
            return 'rotationBottomLeft';
        }
    }, {
        key: 'BOTTOM_CENTER',
        get: function get() {
            return 'rotationBottomCenter';
        }
    }, {
        key: 'BOTTOM_RIGHT',
        get: function get() {
            return 'rotationBottomRight';
        }
    }]);

    return RotationControlType;
}();

},{}],302:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.ToolControl = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Mouse = require('./../utils/Mouse');

var _Mouse2 = _interopRequireDefault(_Mouse);

var _Calculator = require('./../utils/Calculator');

var _ToolControlType = require('./ToolControlType');

var _RotationControlType = require('./RotationControlType');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ToolControl = exports.ToolControl = function (_PIXI$Sprite) {
    _inherits(ToolControl, _PIXI$Sprite);

    _createClass(ToolControl, null, [{
        key: 'DELETE',
        get: function get() {
            return 'delete';
        }
    }, {
        key: 'MOVE_START',
        get: function get() {
            return 'moveStart';
        }
    }, {
        key: 'MOVE',
        get: function get() {
            return 'move';
        }
    }, {
        key: 'MOVE_END',
        get: function get() {
            return 'moveEnd';
        }
    }, {
        key: 'ROTATE_START',
        get: function get() {
            return 'rotateStart';
        }
    }, {
        key: 'ROTATE',
        get: function get() {
            return 'rotate';
        }
    }, {
        key: 'ROTATE_END',
        get: function get() {
            return 'rotateEnd';
        }
    }, {
        key: 'CHANGE_ROTATION_CURSOR',
        get: function get() {
            return 'changeRotationCursor';
        }
    }, {
        key: 'DBCLICK',
        get: function get() {
            return 'dbClick';
        }
    }, {
        key: 'DBCLICK_TIME',
        get: function get() {
            return 200;
        }
    }]);

    function ToolControl(type) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var rotationControlType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _RotationControlType.RotationControlType.NONE;

        _classCallCheck(this, ToolControl);

        var _this = _possibleConstructorReturn(this, _PIXI$Sprite.call(this));

        _this.type = type;
        _this.options = options;
        _this.rotationControlType = rotationControlType;
        _this.rotationCursorList = options.rotationCursorList;
        _this._cursorIndex = _this.getCursorIndex();

        _this.currentRadian = 0;
        _this.currentRotation = 0;

        _this.buttonMode = true;
        _this.interactive = true;
        _this.defaultCursor = 'inherit';
        _this._localPoint = new PIXI.Point();
        _this.drawAlpha = 0.0;

        _this.initialize();
        _this.render();
        _this.addCursorEvent();
        _this.addMouseDownEvent();
        return _this;
    }

    ToolControl.prototype.initialize = function initialize() {
        this.g = this.graphics = new PIXI.Graphics();
        this.addChild(this.graphics);
    };

    ToolControl.prototype.render = function render() {
        switch (this.type) {
            case _ToolControlType.ToolControlType.TOP_LEFT:
            case _ToolControlType.ToolControlType.TOP_CENTER:
            case _ToolControlType.ToolControlType.TOP_RIGHT:
            case _ToolControlType.ToolControlType.MIDDLE_LEFT:
            case _ToolControlType.ToolControlType.MIDDLE_RIGHT:
            case _ToolControlType.ToolControlType.BOTTOM_LEFT:
            case _ToolControlType.ToolControlType.BOTTOM_CENTER:
            case _ToolControlType.ToolControlType.BOTTOM_RIGHT:
                this.drawControl();
                break;

            case _ToolControlType.ToolControlType.MIDDLE_CENTER:
                this.drawControl();
                break;

            case _ToolControlType.ToolControlType.ROTATION:
                this.drawRotation();
                break;

            case _ToolControlType.ToolControlType.DELETE:
                this.drawDeleteButton();
                break;
        }
    };

    ToolControl.prototype.drawControl = function drawControl() {
        var innerRectSize = 3;
        var innerRectHalf = innerRectSize / 2;
        var outerRectSize = 5;
        var outerRectHalf = outerRectSize / 2;
        var buttonRectSize = 10;
        var buttonRectHalf = buttonRectSize / 2;

        this.g.clear();
        this.g.beginFill(0xFF33FF, this.drawAlpha);
        this.g.drawRect(-buttonRectHalf, -buttonRectHalf, buttonRectSize, buttonRectSize);
        this.g.beginFill(0xFFFFFF, 1);
        this.g.drawRect(-outerRectHalf, -outerRectHalf, outerRectSize, outerRectSize);
        this.g.beginFill(0x000000, 1);
        this.g.drawRect(-innerRectHalf, -innerRectHalf, innerRectSize, innerRectSize);
        this.g.endFill();
    };

    ToolControl.prototype.drawCenter = function drawCenter(rotation, width, height) {
        this.rotation = rotation;
        this.g.clear();
        this.g.beginFill(0xFF33FF, this.drawAlpha);
        this.g.drawRect(-(width / 2), -(height / 2), width, height);
        this.g.endFill();
    };

    ToolControl.prototype.drawRotation = function drawRotation() {
        var buttonRectSize = 22;
        var buttonRectHalf = buttonRectSize / 2;
        this.g.clear();
        this.g.beginFill(0xFF3300, this.drawAlpha);
        this.g.drawRect(-buttonRectHalf, -buttonRectHalf, buttonRectSize, buttonRectSize);
        this.g.endFill();
    };

    ToolControl.prototype.drawDeleteButton = function drawDeleteButton() {
        this.deleteTexture = PIXI.Texture.fromImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAbCAYAAACN1PRVAAAB2UlEQVRIie2VTUsqYRTHj2M4MhHUIKLDCC58QxHdulHEnWsXfYco0kUUVHKDXqgJLtw2fYC+haDixpUgA8KIgsj4Hm1qTCf03EW3W9xL40yCtPC/eRbnPOd3Dvyf8+gA4AYWpJU/5/0CWCZiAZC/WsKWsK/DotEoPZlMjg0Gg25WIURMzwXLZrMPLpfrajQaHVutVoMSiCTJk7lgAAD1ev05Fov9arVaB6FQaP1jLBKJ0IiYttlsF7Is49wwgNcJE4nEbaFQ2Ha73dQbKJfLbdM0fSqK4lhNHR287kZV64plWbLZbO47nc7LWq22ZzabzwaDwYuauwBgWpmd8y5RFMcEQfxAxHQymbzTAAIAjdYPh8MbiJj2+/3XHMdtqnGpZpjRaCTsdrsxn8/v+Hw+rlKpPAWDwZ/D4fDQ4/GsEoS6nvUAEAeAoVJSPB43F4vFXYvFct5oNEaICP1+X65Wq7VMJrPF83xVEIQnREVDUjMNQlEUIUnSEcMw551OR/43HggE1kqlUtLr9XKCICg1rfyfsSxLSpJ05HA4Lnu93n8gAIByufyo1+tPeJ7fTaVSTqV6mqyvJIZhyG63O55Op5+laLO+ktrt9syH/X22/hL2LWFvbjQtAvYb9NC0/9Sr3AYAAAAASUVORK5CYII=');
        this.deleteOverTexture = PIXI.Texture.fromImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAbCAYAAACN1PRVAAABCElEQVRIie3UvWrDMBDA8VNtD8EfIojYwlPA0Rrw4HcIef9XyRAh9O/SlgaaWC4htGDBLcdJP4HupEQEedF6exW0Yiv2jzDnnIQQJMuy2YMgbVx5FMYYYozUdX23BiDLsofnfMRsAc45Yozs9/ub/OFwAEBrnQKlYSLCOI5479ntdjfQZrNJhdIxEUFrTYwRYwwAZVkugZZh39/odDot3rcIG4YBAGst1+s1tSmWYXmes91uAei6DqUU1lq897Rti1LqedjxeASgqqqb/DRNeO8ZxzEVfFxQFAXA3Tnr+54QwleX/hrTWgNgjJm9+eVy4Xw+P78bf4qmaWYvpD7FV6y/8+uv2Iq9A1yTczX16ka0AAAAAElFTkSuQmCC');
        this.texture = this.deleteTexture;
    };

    ToolControl.prototype.hideAllRotationCursor = function hideAllRotationCursor() {
        if (this.type !== _ToolControlType.ToolControlType.ROTATION) return;

        var n = this.rotationCursorList.length;
        for (var i = 0; i < n; i++) {
            this.rotationCursorList[i].visible = false;
        }
    };

    ToolControl.prototype.addCursorEvent = function addCursorEvent() {
        this.mouseover = this.onMouseOver.bind(this);
        this.mouseout = this.onMouseOut.bind(this);
        this.mousemove = this.onMouseOverMove.bind(this);

        this.touchmove = this.onMouseOverMove.bind(this);
    };

    ToolControl.prototype.addMouseDownEvent = function addMouseDownEvent() {
        this._mouseDownListener = this.onMouseDown.bind(this);
        this.on('mousedown', this._mouseDownListener);
        this.on('touchstart', this._mouseDownListener);
    };

    ToolControl.prototype.removeMouseDownEvent = function removeMouseDownEvent() {
        this.off('mousedown', this._mouseDownListener);
        this.off('touchstart', this._mouseDownListener);
    };

    ToolControl.prototype.addMouseMoveEvent = function addMouseMoveEvent() {
        this._mouseMoveListener = this.onMouseMove.bind(this);
        this._mouseUpListener = this.onMouseUp.bind(this);

        window.document.addEventListener('mousemove', this._mouseMoveListener);
        window.document.addEventListener('touchmove', this._mouseMoveListener);
    };

    ToolControl.prototype.removeMouseMoveEvent = function removeMouseMoveEvent() {
        window.document.removeEventListener('mousemove', this._mouseMoveListener);
        window.document.removeEventListener('mouseup', this._mouseUpListener);

        window.document.removeEventListener('touchmove', this._mouseMoveListener);
        window.document.removeEventListener('touchend', this._mouseUpListener);
    };

    ToolControl.prototype.onMouseDown = function onMouseDown(e) {
        e.stopPropagation();

        var globalPoint = { x: _Mouse2.default.global.x, y: _Mouse2.default.global.y };

        this.prevMousePoint = this.currentMousePoint = globalPoint;
        this.targetPrevMousePoint = this.targetCurrentMousePoint = this.targetLayer.toLocal(globalPoint);

        var time = new Date().getTime();

        if (this.startTime && this.type == _ToolControlType.ToolControlType.MIDDLE_CENTER && this.downTarget && this.downTarget == this.target) {
            if (time - this.startTime < ToolControl.DBCLICK_TIME) {
                this.emit(ToolControl.DBCLICK);
                this.startTime = null;
                this.downTarget = null;
                return;
            }
        }
        this.startTime = time;
        this.downTarget = this.target;

        if (this.type === _ToolControlType.ToolControlType.ROTATION) {
            this.prevRotation = this.currentRotation = _Calculator.Calc.getRotation(this.centerPoint.globalPoint, {
                x: _Mouse2.default.global.x,
                y: _Mouse2.default.global.y
            });
            this.currentRadian = _Calculator.Calc.toRadians(this.currentRotation);

            this.emit(ToolControl.ROTATE_START, {
                target: this,
                type: this.type,
                currentRadian: this.currentRadian,
                currentRotation: this.currentRotation,
                currentMousePoint: this.currentMousePoint
            });
        } else {
            this.emit(ToolControl.MOVE_START, {
                target: this,
                type: this.type,
                currentMousePoint: this.currentMousePoint,
                targetCurrentMousePoint: this.targetCurrentMousePoint
            });
        }

        this.addMouseMoveEvent();
        window.document.addEventListener('mouseup', this._mouseUpListener);
        window.document.addEventListener('touchend', this._mouseUpListener);
        // this.removeMouseDownEvent();

        this.prevMousePoint = this.targetPrevMousePoint = null;
    };

    /**
     * mouse point p를 imageRect와 충돌 검사한다.
     * 1. 충돌하지 않은 경우 p가 어느쪽에 있는지 확인 후
     *    p0 -> p의 선분과 boundary를 이루는 4개의 선분의 교점을 찾아 반환한다.
     * 2. 충돌한 경우 p를 그대로 반환한다.
     * @param  {[type]} p  [description]
     * @param  {[type]} p0 [description]
     * @return {[type]}    [description]
     */
    ToolControl.prototype.hitTest = function hitTest(p, p0) {

        if (hitTestWithBoundary(p.x, p.y, ToolControl.imageRect)) return p;

        return getIntersectionWithlines(p0.x, p0.y, p.x, p.y, _lines) || p;
    };

    ToolControl.prototype.onMouseMove = function onMouseMove(e) {

        var globalPoint = _Mouse2.default.global;
        this.currentMousePoint = globalPoint;
        this.targetCurrentMousePoint = this.targetLayer.toLocal(globalPoint);

        this.prevMousePoint = this.prevMousePoint || this.currentMousePoint;
        this.targetPrevMousePoint = this.targetPrevMousePoint || this.targetCurrentMousePoint;

        //this.targetCurrentMousePoint = this.hitTest( this.targetCurrentMousePoint, ToolControl.imageRect.center );

        this.changeMovement = {
            x: this.currentMousePoint.x - this.prevMousePoint.x,
            y: this.currentMousePoint.y - this.prevMousePoint.y
        };

        this.targetChangeMovement = {
            x: this.targetCurrentMousePoint.x - this.targetPrevMousePoint.x,
            y: this.targetCurrentMousePoint.y - this.targetPrevMousePoint.y
        };

        this.moveRotationCursor();

        if (this.type === _ToolControlType.ToolControlType.ROTATION) {
            this.currentRotation = _Calculator.Calc.getRotation(this.centerPoint.globalPoint, _Mouse2.default.global);

            this.changeRotation = this.currentRotation - this.prevRotation;
            this.absChangeRotation = this.changeRotation < 0 ? this.changeRotation * -1 : this.changeRotation;

            if (this.absChangeRotation < 100) {
                this.emit(ToolControl.ROTATE, {
                    prevRotation: this.prevRotation,
                    changeRotation: this.changeRotation,
                    currentRotation: this.currentRotation,
                    currentRadian: _Calculator.Calc.toRadians(this.currentRotation),
                    changeRadian: _Calculator.Calc.toRadians(this.changeRotation)
                });
            }

            this.emit(ToolControl.CHANGE_ROTATION_CURSOR, this.getRotationCursor());
        } else {
            this.emit(ToolControl.MOVE, {
                target: this,
                type: this.type,
                prevMousePoint: this.prevMousePoint,
                changeMovement: this.changeMovement,
                currentMousePoint: this.currentMousePoint,
                targetPrevMousePoint: this.targetPrevMousePoint,
                targetChangeMovement: this.targetChangeMovement,
                targetCurrentMousePoint: this.targetCurrentMousePoint
            });
        }

        this.prevRotation = this.currentRotation;
        this.prevMousePoint = this.currentMousePoint;
        this.targetPrevMousePoint = this.targetCurrentMousePoint;
    };

    ToolControl.prototype.onMouseUp = function onMouseUp(e) {
        var globalPoint = _Mouse2.default.global;
        this.currentMousePoint = globalPoint;
        this.targetCurrentMousePoint = this.targetLayer.toLocal(globalPoint);

        this.prevMousePoint = this.prevMousePoint || this.currentMousePoint;
        this.targetPrevMousePoint = this.targetPrevMousePoint || this.targetCurrentMousePoint;

        this.changeMovement = {
            x: this.currentMousePoint.x - this.prevMousePoint.x,
            y: this.currentMousePoint.y - this.prevMousePoint.y
        };

        this.targetChangeMovement = {
            x: this.targetCurrentMousePoint.x - this.targetPrevMousePoint.x,
            y: this.targetCurrentMousePoint.y - this.targetPrevMousePoint.y
        };

        this.moveRotationCursor();

        if (this.type === _ToolControlType.ToolControlType.ROTATION) {

            this.currentRotation = _Calculator.Calc.getRotation(this.centerPoint.globalPoint, _Mouse2.default.global);

            this.changeRotation = this.currentRotation - this.prevRotation;
            this.absChangeRotation = this.changeRotation < 0 ? this.changeRotation * -1 : this.changeRotation;

            if (this.absChangeRotation < 100) {
                this.emit(ToolControl.ROTATE_END, {
                    target: this,
                    type: this.type,
                    prevRotation: this.prevRotation,
                    changeRotation: this.changeRotation,
                    currentRotation: this.currentRotation,
                    currentRadian: _Calculator.Calc.toRadians(this.currentRotation),
                    changeRadian: _Calculator.Calc.toRadians(this.changeRotation)
                });
            }
        } else {
            this.emit(ToolControl.MOVE_END, {
                target: this,
                type: this.type,
                prevMousePoint: this.prevMousePoint,
                changeMovement: this.changeMovement,
                currentMousePoint: this.currentMousePoint,
                targetPrevMousePoint: this.targetPrevMousePoint,
                targetChangeMovement: this.targetChangeMovement,
                targetCurrentMousePoint: this.targetCurrentMousePoint
            });
        }

        // this.addMouseDownEvent();
        this.removeMouseMoveEvent();
    };

    ToolControl.prototype.onMouseOver = function onMouseOver() {
        this.defaultCursor = this.getCursor();
        if (this.type === _ToolControlType.ToolControlType.DELETE) this.texture = this.deleteOverTexture;
        if (this.type === _ToolControlType.ToolControlType.ROTATION) {
            this.rotationCursor = this.rotationCursorList[this.cursorIndex];
            this.rotationCursorHalfWidth = this.rotationCursor.width / 2;
            this.rotationCursorHalfHeight = this.rotationCursor.height / 2;
            this.moveRotationCursor();
            this.rotationCursor.visible = true;
        }
    };

    ToolControl.prototype.onMouseOut = function onMouseOut() {
        if (this.type === _ToolControlType.ToolControlType.DELETE) this.texture = this.deleteTexture;

        if (_Mouse2.default.defaultCursor !== 'none') {
            this.rotationCursor = null;
            this.hideAllRotationCursor();
        }
    };

    ToolControl.prototype.onMouseOverMove = function onMouseOverMove() {
        if (this.type === _ToolControlType.ToolControlType.ROTATION) this.moveRotationCursor();
    };

    ToolControl.prototype.moveRotationCursor = function moveRotationCursor() {
        if (!this.rotationCursor || this.rotationCursor === null) return;

        var cursor = this.rotationCursorList[this.cursorIndex];

        if (this.rotationCursor !== cursor) {
            this.rotationCursor.visible = false;
            this.rotationCursor = cursor;
            this.rotationCursor.visible = true;
        }

        this.rotationCursor.x = _Mouse2.default.globalX;
        this.rotationCursor.y = _Mouse2.default.globalY;
    };

    ToolControl.prototype.getAngleIndex = function getAngleIndex() {
        var angle = this.angle;
        if (angle > 337.5 && angle <= 22.5) {
            return 0;
        } else if (angle > 22.5 && angle <= 67.5) {
            return 1;
        } else if (angle > 67.5 && angle <= 112.5) {
            return 2;
        } else if (angle > 112.5 && angle <= 157.5) {
            return 3;
        } else if (angle > 157.5 && angle <= 202.5) {
            return 4;
        } else if (angle > 202.5 && angle <= 247.5) {
            return 5;
        } else if (angle > 247.5 && angle <= 292.5) {
            return 6;
        } else if (angle > 292.5 && angle <= 337.5) {
            return 7;
        } else {
            return 0;
        }
    };

    ToolControl.prototype.getCursor = function getCursor() {
        switch (this.type) {
            case _ToolControlType.ToolControlType.TOP_LEFT:
            case _ToolControlType.ToolControlType.TOP_CENTER:
            case _ToolControlType.ToolControlType.TOP_RIGHT:
            case _ToolControlType.ToolControlType.MIDDLE_LEFT:
            case _ToolControlType.ToolControlType.MIDDLE_RIGHT:
            case _ToolControlType.ToolControlType.BOTTOM_LEFT:
            case _ToolControlType.ToolControlType.BOTTOM_CENTER:
            case _ToolControlType.ToolControlType.BOTTOM_RIGHT:
                return this.getScaleCursor();
            case _ToolControlType.ToolControlType.ROTATION:
                return this.getRotationCursor();
            case _ToolControlType.ToolControlType.DELETE:
                return 'pointer';
            case _ToolControlType.ToolControlType.MIDDLE_CENTER:
                return 'move';
        }
    };

    ToolControl.prototype.getScaleCursor = function getScaleCursor() {
        switch (this.cursorIndex) {
            case 0:
                // 337.5-22.5, TOP_CENTER
                return 'ns-resize';
            case 1:
                // 22.5-67.5, TOP_RIGHT
                return 'nesw-resize';
            case 2:
                // 67.5-112.5, MIDDLE_RIGHT
                return 'ew-resize';
            case 3:
                // 112.5-157.5, BOTTOM_RIGHT
                return 'nwse-resize';
            case 4:
                // 157.5-202.5, BOTTOM_CENTER
                return 'ns-resize';
            case 5:
                // 202.5-247.5, BOTTOM_LEFT
                return 'nesw-resize';
            case 6:
                // 247.5-292.5, MIDDLE_LEFT
                return 'ew-resize';
            case 7:
                // 292.5-337.5, TOP_LEFT
                return 'nwse-resize';
        }
    };

    ToolControl.prototype.getRotationCursor = function getRotationCursor() {
        return 'none';

        /*switch (this.cursorIndex) {
            case 0: // 337.5-22.5, TOP_CENTER
                return "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAOCAYAAAA8E3wEAAAAAXNSR0IArs4c6QAAAyRJREFUOBGNVF1IU2EY9pz9z9YkRdaPIfhHiV4V3Sy80S4jijLqwvDGO/Uq6KLLqBtpN+G9SndJmSBZlDYbNjeGLWSW2CQxt0E65+bmfk7Pc/I7HRdELzx7v/d7f7/3fc+kiv8jSWemPyu6e/1Zd334qHemhrJwFDryctCWRNtyiHvyv0gflEohC0PKMmDQcZFcJCpBVwQEF/e40uLxjqQwmAggJ5PJ85AZnDACZsAK2IBKwK5DuWyBjvb0EzEY8xxkfR41IQ3MhULBt7y8fBHnI8BR4FhLS8uJ2dnZqxsbG4/hPJnNZkPAJ2BxZ2dnKhaLPfH7/bc7OztP0x5wACymErpr+Xz+Gc4mgDnUDjI7q7JDGUqn03PT09OXqqurTwaDwTu7u7tvw+Hw68HBwZnW1tavJpMpB1vFaDTmUcxqb2/vnM/newW/D5FIZKC9vf0U9LVLS0s39/b2/Llc7jlkdog5JDEjCpb9/X1vV1eXPDExkYbhWiKRqO3p6XEFAoEzkiQpCPYFSLhcrlw8HjejG1ULCwtni8Wiob6+/vvo6Gikra0tH41G39TV1V3v6+uTR0ZG4na7/Rbis9ACoPaXvXciySK40tHR8dnj8bwzGAwFh8ORHBoamkqlUu/R8nHYPALuAQ8hP81kMnNjY2OTNTU1Cfr29/d7Nzc3PzY1Na01NzdH0aFJ3LPNbKvWUias4mzAxZYpbrc7vLW15UWyBysrK43QcQ4cgQa85jiS3gW83d3d8/Q3m81q23UJuQ9qQjqSmKTEtqnSwY/NZitYLJYKVPyysbExSpsyKGhlDC3zYF7jw8PDRXQkhdHwASTlICb9tNh8prY0BwrtlZhpAAFmtre3ud5qS8D1JGNhrmBjZxoaGr5Bofnihavo2gvccWnULWUAgi81YPjzoVDoh6IoamBWhzmWEKgSlbPqAdwFwTWC7WUI97FEP9fX1/P0Ff7wkeCbxWbfgA3/HNTAomoZs3KjIhmJ1TskU6xWawmfAD8DIqNPiMCs+gKWxwBIhN4f4yjJspx2Op0sUn25SFbOoT9ENCYJ/lv68/svf72P8gunF5KUe/EFxQAAAABJRU5ErkJggg==') 14 7, auto";
            case 1: // 22.5-67.5, TOP_RIGHT
                return "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyppVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1Rjc3NTE3RDZEQTcxMUU2OTkwNzk1ODBGOTZCN0JBOSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1Rjc3NTE3RTZEQTcxMUU2OTkwNzk1ODBGOTZCN0JBOSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjVGNzc1MTdCNkRBNzExRTY5OTA3OTU4MEY5NkI3QkE5IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjVGNzc1MTdDNkRBNzExRTY5OTA3OTU4MEY5NkI3QkE5Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+bXt2owAAA1tJREFUeNqsVt1LWmEY99XjR7ZNZ8yGC0YrG2ODddXNBjXGrlpjH25rhKj76Cbovqv9A4PddN9N7kLYYNiFoMyltmBusUqIIHJCzTJD0yzNr/1e9xrH0wfH2gsPnvfjPL/3eZ7f7zkSycFBJIePsuSEQ3oIAGHr0kKh8Ix3hkj+w6g652DKTCbzulQq+fEsh8lOAyIVRECdyTc2Nmy5XM5cLBbpvoKtS5mRegGlghTJV1dXX+bz+RddXV2XkS66pmJA1YhkvHdIvZHI1tfXLYSQp52dndfw3IR0Kbxe752RkRED9ht4gJwATFQtuGQyORiNRr16vT5GmaRQKHJjY2OeQCDgTqVS37HvmJ2d7W9vb7+A/XMMVM7LxvEgqMFV5P9nT0/PL0bVGuM4Lt/b2/tjfn6eAjodDsdtrJ+HNYoFqqQqHo8/3tra8uGmv6ljjUaTDIfDkx6Px2Wz2fxqtXqbrpvN5m+IanpmZsaMeZNYoP2iI12mRCLhp0BarTYBhk0vLS09B51H0+m0b3h4+AsFovubm5tTDEgHU7M6ETEaUaDgT2hEYFcILPOz3Csikcj1vb09u9vtnkC9shQI56bHx8dvYV9DtSVGT/sRIe8Pd3d3fWDXJLthRSNOp1MNoPcul2uCRmS1WgM4+7m1tbWZpY0TRQLmUJbNZh+Uy2WvQEuEAX0YGhqie+VQKOQJBoP9eNayaKRiKV0xgNwVaKFyibW1tRuIwKdSqTJ9fX1BSm9GgobTtqAaNiLSUYvF4qP0pjoCKYxYPyNgGpGIDe2QzwAB4yYHBgbSaD0c9JM0mUw3GQDH63WVs5xY70gdvaWJNk2wjsD5pY6ODtpiJKA5uYeB34vQUwFWVCqVJUjgE6SQFA2CnrYNoLhMJnuLQkfn5uY40L0Smd1u1+/s7EgxrhiNxkJ3d3cz2PkOAKnqDY81IRZlHYT5ta2tLSxsPy0tLX9isZh/ZWXFyprpPxLUC0JfRFd4RAULoEgVwGAwRMG6qcXFxTeYn2XdWnpSkIpgaWeotiAaAeaBhYWFQaYXVQ2V6wSpaUG019GI0MV9y8vLr1h7UfG6RAWEHOGIX/DjBEtTdx8+GnU63UfMi8z4tToxiETwCSZCx/y/UNwplF8+4v/YgVv/FWAAZA0E5twGSyUAAAAASUVORK5CYII=') 12.5 12.5, auto";
            case 2: // 67.5-112.5, MIDDLE_RIGHT
                return "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAcCAYAAABRVo5BAAAAAXNSR0IArs4c6QAAAztJREFUOBF9VN9rUnEU915NS5BV2JRqa7CYkOAeEgqmSTF7jC2IPfU22Nvajzehl6CHHmR/xN6FbCP6icsZgYrDLXFzNFcgONlQNyf+urfP+d77vdwN6sC53+/3nPM53/PrewWDQoK60qLf01mmj0ra3gQBNxTVPZ25jOwlMAE4iK0EJCKQEUxnYjoT9VTuqisHMyPh+PjYZ7ValyRJEsCiLMsCiD6cm41GY76vry9J3kDMgVipVB6mUqlVVUBCxoFAIAvA+vb2th+yC2AeibLp9XoC3QKFRgD9jEajjUQi8crlcm1oCnXDczwvN0xOTlZarVZ5YmJiC0p9wWgvs6uNRiPLhdDBYHDD5/NtLS4u+pFCfzwefwwxXUDFOxOViOIEMpnMO4BSp6en8aOjo3WbzVbzer25k5OTLwj1OkA28Jk8hWaz+aBer39tt9uxQqFwH45eh8Ph9zCUNzc3P62trT3F/gr4Ili7Weh0On4UZ71arXqhMO3u7t4G+BvaIc3NzcVKpdIS5NfAVtKDlZABukusCkho7Ha7kdHR0bzb7S7UarUVyBxgHq7AigPPaWIotB6iRQWPx1PZ2dkZtFgsN6AjhxprDYXwPNWcTmcLaZih4HkpIULwP6Dt4ODAbDKZaE7ZiOlWBYj8yCMnFg56ewujdnl4ePgPql2CUv9KlAGA8B7AT7BSBEKxWOyH8WAymbwzNjZWQrt+qUAOVgxRQbrxJQaawCa73f48EolUUSDj9PR0Y39//zvk/InxsA1sAMrl8gcMQezw8HCepgfgytDQ0G84S4yPjw8CSK2gQml1YSOXTqdXkM8exi0xNTX1AwYyJuZjPp9/gf1V8CUwry628KB/j5jROmTy7OxsHJO0il7exFl/G2sJu1b/HjFqNjS8HQqFzCjS52w22waQisILw3LU4oVCI7xDMx6yY2Bg4Fkul3sEhVYQbsQeMm6QEKIwMjKyBwXrI9pjmJmZEZeXlxdQuI7D4Xir6pgTZoQh9uJnFULIIjFASh6iKGEQJFEUe6j0G/ysUurtzICBIaCK8ZdOKZBnYuofjZ0+T/Vd6aYeBtwRtoy4A/2qAcmChafY/vNLYEZ/ARukibLGcoOhAAAAAElFTkSuQmCC') 7 14, auto";
            case 3: // 112.5-157.5, BOTTOM_RIGHT
                return "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAAXNSR0IArs4c6QAAA71JREFUSA2lVUlPU1EYhU6UYi1qJIGwYlghsIGVkQ0JG8QRg4YgjVNMmhB/gQv+gAsXpCtcgFEjJgoaQouFUuwCIYHCCoSSME9lKnR+nvPoNWD7kMYvOX33ft+999xvuk1P+z9JV9guHderjk9SHJOAUK2vrxfjq+Y4rlMih/nsIh+O5dqNjY070Wh0dHt7+xnmGYAGEGQYHk3kQQo/wgPN8vLyTa1W+6K6ulp9eHj4YHV19RHO0QH0SqxL4eijpX88wIF3fT7fUFFRkRcmKScnZ21paWlwcXHRgnkmkOARdGcSkqh3d3dv7ezsOAUBdEy0IBpAjp5jztAJjzA8u6QHAoEbCI2zsrLSYzKZfMA2tks6nS5oNBr3SLy1tTXo9/ufQJ86iSRJ1YAjFosNhsPhoWAw6J6bmxskSXt7ux0Hj+ICbtiGscYViUQaYKP3KYnICeOdOTMz02C323sxllwul83hcNRjfAnIArSAXGX8SVUY/xgQzc3NvdbZ2Zml0WgiZWVlpr6+vgnog0A4vuZEU0KXXBCec39ZZG/m5+dL9vb2nAaDwV9bW/sTffIB6y4AekDkQjFUNMgAwXXAHJ/jc6Tv7u42hEKhzpaWlu/QSR6PxzY+Pn4fYyPAMCkeDptsZAjVrCIQjCB5bDBBrIoTvLLZbD3QS01NTT9Q0t2oqsuYGwDmS5GEBhJo0WS3EYoBt9v9BdXyOL5RvbKycgUevO3t7e1ByQZYrgiTu6ur6yrWnAfY7TwjKYkg0LGT2WiFhYVzVqv1G8hebm5u3sPhr3Fjp8ViceAQiQTQD4+NjTVhzlyILj+VQIu3qJ5PBQjmeVBra6vd6/XaUDVfm5ubnXq93k+92Wx24SLuOEFCyWJNgpBZzRDFnwqZADr5qRBflGm4rq5uZHJy0g6PPnd0dDBEF4ETPYF5gjBJlHQkOQshSUPCWR2y1NTUTDQ2Nq4hNFJpaWk2utg7PT39qby83IFOD2AR+4GIAuJSGCaK7AnUmbOzs4+RE1deXt4y5lJbW1s/Xlar0+msR7nyj4mhyQZ4+6T/HdAniPCEt4gWFBR8nJqa0iDWDysqKiSVShU7ODjwVFVV9cMubix3O+bcwzGFY0VhuQk36XKwpKTkPXLzBkS/iouLI+joCPQMDZ+LEHCcTOyF+t/CkJGQnvFZMC4sLJjxtzqGPniKOfOkWP+wnSrHw8WFdJ83jeXn57/b398PZWRksP6pT+nWWK8o9Eh4xUdODU/YaEKvuPE0Azcnk2T6U5Ob7BCh+w13D8jLwsORsAAAAABJRU5ErkJggg==') 12.5 12.5, auto";
            case 4: // 157.5-202.5, BOTTOM_CENTER
                return "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAOCAYAAAA8E3wEAAAAAXNSR0IArs4c6QAAAy1JREFUOBF9VE1IG1EQdpNs/jQNiAlW0h8UYkEIWCN4EQ/V3irFXgoFLd682PRorz3YS6iXHjwK4qktLRWkhlKtqWColcSSotEmXiS2KElM1MRkt9+87ixbKX3wMfPmzcw3M5mNVPfnSJokYdTZrGoKS7az5BiWbGfJcSo7kJTy+XyXoij15XLZRJ5ms1m12+2KxWJRNdRgXpMkiaQ4qqp2VatVJyARzs7OTLVaTeTleJfLFYWzQgEWQJBBmp1O55Pd3V378fGxqAiJVYLP55O9Xm8jfJ4ayXAXB8VMnp6eVhBbApkJRQhCiu3s7LwMpx7NVZDSoxlwoLq3fr//B3QiFGhra0sXCoWlUql0FzbROaTxSLlcLlipVJYGBga+4EGPJf38/HwD0glwc6JDujQg6TsQpsmRgFEUjo6OPh8eHj7G3QoQoagekg/dLalUqufk5GQFpESgk+LnieN+CZABE1dMQTwKkdBqtVYwWtfY2JjZ4XAMFYvFUDqd9sJP+JI/Y2dn53pzc/MdJK/DaKl4/Wjj/atQSkDsLiSdR4eZ9vb2TDabXRsfH1+BXW1qavo1Ozs7jw6iWIw5JJ4EJoBnuL9GYZ/C4fACJpLHolSnpqY+9vX1faNY+FCHbkBMiMgIVJUNCeeGh4e909PTyt7e3svW1tZb8XhcHhkZuZHJZK4gWa27uzuJgnLoqLy/v29PJBIewE+dBIPB7zMzM1mPx/PTZrNdGxwcrI9EIgqm1Yv8ZaAK6IQOVPMGI4klk8n7sHsDgYBve3v7EX7bVZz3o6OjUVoq6gLvqizL5Y6OjlQoFFra3NyMYEIf1tfXH2LbWxYXF28jLnphacRPSB3Slsp4fHVwcHAPer0GF2Rjf3//1Vgs9gBvL7CxC9jmOJAANvDtzqPT58vLy0PovIX8AVqShq2trV6MfBU6jZM4JB6pkPThu93ur3jgQxWRI42cfmfSeVmg6ttI3xd1zaA/BtrUOuS8iZz650JEdC5K4azZ6Y2JWIoCYef1JwIiZcnxMInDd/2vjR8uSmMhTMKSfZnUKOmNScifdb0zDv6fZHLyMep6MtiN+j9z/Qasm4fFL/kTlgAAAABJRU5ErkJggg==') 14 7, auto";
            case 5: // 202.5-247.5, BOTTOM_LEFT
                return "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAAXNSR0IArs4c6QAAA6lJREFUSA2lVUlLW1EUNiZGY4zGxhoiIggqQqtLEVqo0KVYOqTowqYKHRFcdeOy/oFuCl260S5EkFYLYtLGTKTUKg3RhSixLpI4GzXikOH1+0KuxDHRHji8e84993xnuvfJss4n2Tlq6RxdRirFKSvhnF/BdC4AxPfUscvF7JRt4ZQ6gis3Nzfbtra2HmAtB4t9LK9GIhPhQADk+nw+YywWe65UKrOCwaDcYDB8heto0v21MiIIo80Da2dnZ1+vrKw4y8vLA1VVVX+RjQPyE+zlgBkI7a9EPMCDSrBmbm7u5fLysqusrCwIOdEPAm1vb9sB9gg6UTosM6fjLPx+f+fq6qqDGeB4AkB8q6urfbu7uxMHBwfs0ZUyoXEik3A43KpSqd7ZbLaV+fl5RTwezx4eHi4ZHx+v7+3t/a7X64/q6+ujjY2NBpx5L5PJRvHNiBKND4VChXK5XIVIP9XW1sorKioU+fn5deA4QLJMJpOk0+l+KhQKP4ZBgm2JJEkFAApnhAIjkQ1rzcaqwMV2u93ocrnGsZYA9G1jY+Mp1gxK2GOZGbHhYhzjWMfAHNPI0NCQp66uTovoowMDAxq1Wn0vxVacgerqxCiZEbPRoYyDLS0tk3l5eXs7Ozt2TN1t6FNHOJEVSncfepEhv2mJTnLB2snJybaZmRkL1lJXV5f16Ojo88jISD7kVIfZALEmp44BpgYB8XyiA9ZeXVlZqUcGXzo6OpyQpbGxsVEAfUgC0RmZk2jb39+3w/Yh5IwuLEEYEbMp6u/vv4OL6OaFxBNzYDabCTSwtLR0C/u8wKpIJOJoaGjw8sImXwbq02YksmFpbkxPTz/DdLkIBFnq7u7+gXG37+3tfVxYWGg9PDx0a7XaLfEE4a0zwi5tRgRhJDRUg3UAMmEQ3O3t7W7IEu5QuLOz02GxWMYWFxdtRUVFIerFE7S+vv4YMitCXxfSaaDiwcHBu6j7iNfrNTc3N//GeEdw+sTzQ7mpqekPLu3U2tpaDeRLQYieCsSxLkSkNz0eTxvHGz345XQ6zX19fRb06xD7Umlp6SrKNYH9V5DF5cXychJAPMCGsk8acHFPT0+N1Wo1ojdTGo1mlwCBQGACzX+LfQ5O2nLB5pgIlArGXvHfUwDWYXwT0wcAG17yLugYCINKO2GwOUOpYIySmakxwi78qm3owRvILGvayYJNRkRAAuXgMjpRshdYs0TXzgBnz5DISh6NRluxS0DymRLR8H/oovMnXul/F7SWjoEFkdEAAAAASUVORK5CYII=') 12.5 12.5, auto";
            case 6: // 247.5-292.5, MIDDLE_LEFT
                return "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAcCAYAAABRVo5BAAAAAXNSR0IArs4c6QAAAz9JREFUOBFtVN9LU3EU997b7nJrG+hkYWKGOEFBIhdIWFHMFx+iN4NASv+A8EXfetxTkD304rNo0INgVhhkybURbmuwcDCnDRNxOtT9cIr7cW+f83Xf23XswNn5nvP9fs4538/33Al1F0W46Nb0NIpeMmwRqFr5Nh3mSjHNCKQAAUUoxaWKTzEVWoaWKlavyCplMplei8UyoaqqVC6XRVhKUicIgiZJkkp6cnLiczgcQV6R2hAQ+LW3tzdjt9snhoeH1UgkcpWAENbm/Px8zOVyWeFTIV3IoUSWaDT65ODgwN/R0bEFn99NCwQCn5LJ5EPERNYKFkYRurq6lra3t98ripKUZblg3ORrDmR3RJB8saenR25ra/P6fL4CRLbZbDkCVO5KHehCQGKxHtqwvr7+Ynl5+QvW2tDQ0M/Dw8Mf7e3tiVAotJDL5e4jzguyhYyAzev1tubzeT8q/nU6nSmwqOC+Y9ls9juIWzw9Pb2Hc1SI/VC1y9CG1dXVp36/fxFrbXp6euH4+HgcaxnJHmuaFigWi3fh60Bik2huQta3IyMjK3izEqqtJBIJehJ2dwAfQe/AZ0JoE9QGdaGlz263+09fX1+kVCrNIMYnCEu0oWnks0wE5CqC/ubNzc3Wzs7ONKZni85WFAYHBYFG7z87FKMARABAwoTQ+2VZpMaPTiv2eOayyWQq7O7umhFz1MCwEJHCAcyenZ3t4I5XMKdNIMiNfX4Nut8tQqHdEK9IIOpdBe3xgYGBHQDdeDPnxsbGDcSldDrdC/sGhFlgBSOQvrlSPB5XRkdHi8guTE1N5XHX54h58Lm9wtQUAORc4Pg5SexJwGYzHv2rx+OJYkYzR0dHCk0PJioUDoc/VI8cZdFnFTP5bG1tbYmGoL+//zdaD2NfCwaDH1Op1INKIZhzAqhtmld7Y2Pjtf39/XeTk5Pf4OvkGb/HC/8A/NDs7Gy32Wy+Pjc3R9NUUzhQ34zFYjdbWlpeDg4OWvFpdesbWBi/R84QWQF/VretVutrMFpPrHIlgCiKKlQDUWMgTeFASkxruieRRJ2QZQMNy54Klv89qtVAVhkHeBIsmegEwaMk+mCz3SrfmJT2CcxF+wduL3Nt3V5HIgAAAABJRU5ErkJggg==') 7 14, auto";
            case 7: // 292.5-337.5, TOP_LEFT
                return "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAAXNSR0IArs4c6QAAA5hJREFUSA2lVklMU1EUtb/fTlIpihgIG2TYOCxYsGFDYsIGMYoTCVaKGKNpQly4YeOCuHehG5Yk6IKEhaKGUBT6EZtQJRJgQUgaSJgqQylQZvo9p/aZ30mmm9z8++5775x777vv5etOHE90Sbar8T4p3nGIcYRgeXnZhj3EodInFOZfOQ4JESSj0Vi1trZ2D/ZJqEwfNIboqCQCRNra2tKbzebnU1NT1QA3QkkWQ3QYkn/AURA9vvL6+rrkdrv9BoOhfmxsjEQm+qFcH5GDkGjBCcxIDVBGbQKJPD4+LhcXF+enp6c7RkdHWTrOcW1k734kgiASdXSzGV9LQ0NDtqIoVy0Wy+VwOCyhXNkgupCZmWn3+Xy3NSQwUwsJGAQjt0DT8/Lyznu93mp0VNvKyspAf39/V0tLi6u8vHwI82xdNTc3d2Z+fl5ZWlq6j3FM2TCOES3BKcycaW1tLQXw+5GRke7KykqvLMs78EeAtd+CgoKJYDCoBAKBm/CLksGMlXiCs4ODg3Zs9Dgcjm9YqppMplBtba3S1dX1aWJiwtXU1NRNPwkA3jc7O8tyabsslgEjkjBN1j4DBA8WFxf7CYCx6nQ6e5CRsr29/Rr+O6urqy+am5s/FxYW+piB3++/hXVsDJaaWAkisuCi0+3t7aWov4cEaNHNzs7OjwB/Nzc3dwnzkWbY2Nio93g8H0DWGy3RfzMgo8jCAuBziLjDbrd/h191uVwkeNXR0cEmEFHqdnd3H6qq6t3c3LwOP4nFHMzkQhJGYh0aGqoeHh52wVbRrl9B8DZKwDVUig4EDug12hrlXIKIBYyENzaDbVpRUfED92ANpVAmJycvwp8QJQjSEtCSOLQEPIu0xsbGIhziANu0rq6uLxQKvYFfe5gikyRwiS5GRuEm2iyVEZfrCkoVRL3lmpqaEFqyD/4D1RvrEoStegJgdyVJcu7t7UmwJTwThra2tgDn8vPzzTk5Oc92dnacer1e1el0Ybhf4vuF8wcVZqFHSR7hKXCzXa1W6ypadgt+FY/ess1mC5SUlAyjXZVoFx2qXAwkQoKvEW/Ok5mZGXdWVtZvEgglMS8aWvoGfCzbkUh4HpFbPj097QRRryAiAZ+K6E3e96IBJ6UwMnHwFgA+xWH3lJWV/WIGsPkWabsrJdB+E4KIGRlxTx6jEX4uLCxUYXysDOKJBRHrLuOMivA9cusKcILGSzIf1yT8T8VvTDX+A7nQiRk9jngZAAAAAElFTkSuQmCC') 12.5 12.5, auto";
        }*/
    };

    ToolControl.prototype.getCursorIndex = function getCursorIndex() {
        if (this.type === _ToolControlType.ToolControlType.ROTATION) return this.getRotationCursorIndex();

        var scaleSingX = this.target ? this.target.scaleSignX : 1;
        var scaleSingY = this.target ? this.target.scaleSignY : 1;

        if (scaleSingX === 1 && scaleSingY === 1) {
            switch (this.type) {
                case _ToolControlType.ToolControlType.TOP_CENTER:
                    return 0;
                case _ToolControlType.ToolControlType.TOP_RIGHT:
                    return 1;
                case _ToolControlType.ToolControlType.MIDDLE_RIGHT:
                    return 2;
                case _ToolControlType.ToolControlType.BOTTOM_RIGHT:
                    return 3;
                case _ToolControlType.ToolControlType.BOTTOM_CENTER:
                    return 4;
                case _ToolControlType.ToolControlType.BOTTOM_LEFT:
                    return 5;
                case _ToolControlType.ToolControlType.MIDDLE_LEFT:
                    return 6;
                case _ToolControlType.ToolControlType.TOP_LEFT:
                    return 7;
            }
        } else if (scaleSingX === 1 && scaleSingY === -1) {
            switch (this.type) {
                case _ToolControlType.ToolControlType.TOP_CENTER:
                    return 4;
                case _ToolControlType.ToolControlType.TOP_RIGHT:
                    return 3;
                case _ToolControlType.ToolControlType.MIDDLE_RIGHT:
                    return 2;
                case _ToolControlType.ToolControlType.BOTTOM_RIGHT:
                    return 1;
                case _ToolControlType.ToolControlType.BOTTOM_CENTER:
                    return 0;
                case _ToolControlType.ToolControlType.BOTTOM_LEFT:
                    return 7;
                case _ToolControlType.ToolControlType.MIDDLE_LEFT:
                    return 6;
                case _ToolControlType.ToolControlType.TOP_LEFT:
                    return 5;
            }
        } else if (scaleSingX === -1 && scaleSingY === -1) {
            switch (this.type) {
                case _ToolControlType.ToolControlType.TOP_CENTER:
                    return 4;
                case _ToolControlType.ToolControlType.TOP_RIGHT:
                    return 5;
                case _ToolControlType.ToolControlType.MIDDLE_RIGHT:
                    return 6;
                case _ToolControlType.ToolControlType.BOTTOM_RIGHT:
                    return 7;
                case _ToolControlType.ToolControlType.BOTTOM_CENTER:
                    return 0;
                case _ToolControlType.ToolControlType.BOTTOM_LEFT:
                    return 1;
                case _ToolControlType.ToolControlType.MIDDLE_LEFT:
                    return 2;
                case _ToolControlType.ToolControlType.TOP_LEFT:
                    return 3;
            }
        } else {
            switch (this.type) {
                case _ToolControlType.ToolControlType.TOP_CENTER:
                    return 0;
                case _ToolControlType.ToolControlType.TOP_RIGHT:
                    return 7;
                case _ToolControlType.ToolControlType.MIDDLE_RIGHT:
                    return 6;
                case _ToolControlType.ToolControlType.BOTTOM_RIGHT:
                    return 5;
                case _ToolControlType.ToolControlType.BOTTOM_CENTER:
                    return 4;
                case _ToolControlType.ToolControlType.BOTTOM_LEFT:
                    return 3;
                case _ToolControlType.ToolControlType.MIDDLE_LEFT:
                    return 2;
                case _ToolControlType.ToolControlType.TOP_LEFT:
                    return 1;
            }
        }
    };

    ToolControl.prototype.getRotationCursorIndex = function getRotationCursorIndex() {
        var scaleSingX = this.target ? this.target.scaleSignX : 1;
        var scaleSingY = this.target ? this.target.scaleSignY : 1;

        if (scaleSingX === 1 && scaleSingY === 1) {
            switch (this.rotationControlType) {
                case _RotationControlType.RotationControlType.TOP_CENTER:
                    return 0;
                case _RotationControlType.RotationControlType.TOP_RIGHT:
                    return 1;
                case _RotationControlType.RotationControlType.MIDDLE_RIGHT:
                    return 2;
                case _RotationControlType.RotationControlType.BOTTOM_RIGHT:
                    return 3;
                case _RotationControlType.RotationControlType.BOTTOM_CENTER:
                    return 4;
                case _RotationControlType.RotationControlType.BOTTOM_LEFT:
                    return 5;
                case _RotationControlType.RotationControlType.MIDDLE_LEFT:
                    return 6;
                case _RotationControlType.RotationControlType.TOP_LEFT:
                case _RotationControlType.RotationControlType.DELETE:
                    return 7;
            }
        } else if (scaleSingX === 1 && scaleSingY === -1) {
            switch (this.rotationControlType) {
                case _RotationControlType.RotationControlType.TOP_CENTER:
                    return 4;
                case _RotationControlType.RotationControlType.TOP_RIGHT:
                    return 3;
                case _RotationControlType.RotationControlType.MIDDLE_RIGHT:
                    return 2;
                case _RotationControlType.RotationControlType.BOTTOM_RIGHT:
                    return 1;
                case _RotationControlType.RotationControlType.BOTTOM_CENTER:
                    return 0;
                case _RotationControlType.RotationControlType.BOTTOM_LEFT:
                    return 7;
                case _RotationControlType.RotationControlType.MIDDLE_LEFT:
                    return 6;
                case _RotationControlType.RotationControlType.TOP_LEFT:
                case _RotationControlType.RotationControlType.DELETE:
                    return 5;
            }
        } else if (scaleSingX === -1 && scaleSingY === -1) {
            switch (this.rotationControlType) {
                case _RotationControlType.RotationControlType.TOP_CENTER:
                    return 4;
                case _RotationControlType.RotationControlType.TOP_RIGHT:
                    return 5;
                case _RotationControlType.RotationControlType.MIDDLE_RIGHT:
                    return 6;
                case _RotationControlType.RotationControlType.BOTTOM_RIGHT:
                    return 7;
                case _RotationControlType.RotationControlType.BOTTOM_CENTER:
                    return 0;
                case _RotationControlType.RotationControlType.BOTTOM_LEFT:
                    return 1;
                case _RotationControlType.RotationControlType.MIDDLE_LEFT:
                    return 2;
                case _RotationControlType.RotationControlType.TOP_LEFT:
                case _RotationControlType.RotationControlType.DELETE:
                    return 3;
            }
        } else {
            switch (this.rotationControlType) {
                case _RotationControlType.RotationControlType.TOP_CENTER:
                    return 0;
                case _RotationControlType.RotationControlType.TOP_RIGHT:
                    return 7;
                case _RotationControlType.RotationControlType.MIDDLE_RIGHT:
                    return 6;
                case _RotationControlType.RotationControlType.BOTTOM_RIGHT:
                    return 5;
                case _RotationControlType.RotationControlType.BOTTOM_CENTER:
                    return 4;
                case _RotationControlType.RotationControlType.BOTTOM_LEFT:
                    return 3;
                case _RotationControlType.RotationControlType.MIDDLE_LEFT:
                    return 2;
                case _RotationControlType.RotationControlType.TOP_LEFT:
                case _RotationControlType.RotationControlType.DELETE:
                    return 1;
            }
        }
    };

    _createClass(ToolControl, [{
        key: 'target',
        set: function set(value) {
            this._target = value;
        },
        get: function get() {
            return this._target;
        }
    }, {
        key: 'transform',
        set: function set(value) {
            this._transform = value;
        },
        get: function get() {
            return this._transform;
        }
    }, {
        key: 'localPoint',
        set: function set(value) {
            this._localPoint = value;
        },
        get: function get() {
            return this._localPoint;
        }
    }, {
        key: 'globalPoint',
        get: function get() {
            return this.transform.apply(this._localPoint);
        }
    }, {
        key: 'centerPoint',
        set: function set(value) {
            this._centerPoint = value;
        },
        get: function get() {
            return this._centerPoint;
        }
    }, {
        key: 'angle',
        get: function get() {
            var angle = _Calculator.Calc.getSkewX(this.target.worldTransform);
            angle = angle < 0 ? angle + 360 : angle;
            return angle;
        }
    }, {
        key: 'cursorIndex',
        get: function get() {
            return (this.getAngleIndex() + this.getCursorIndex()) % 8;
        }
    }, {
        key: 'targetLayer',
        set: function set(value) {
            this._targetLayer = value;
        },
        get: function get() {
            return this._targetLayer;
        }
    }]);

    return ToolControl;
}(PIXI.Sprite);

},{"./../utils/Calculator":305,"./../utils/Mouse":306,"./RotationControlType":301,"./ToolControlType":303}],303:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ToolControlType = exports.ToolControlType = function () {
    _createClass(ToolControlType, null, [{
        key: 'DELETE',
        get: function get() {
            return 'delete';
        }
    }, {
        key: 'ROTATION',
        get: function get() {
            return 'rotation';
        }
    }, {
        key: 'TOP_LEFT',
        get: function get() {
            return 'topLeft';
        }
    }, {
        key: 'TOP_CENTER',
        get: function get() {
            return 'topCenter';
        }
    }, {
        key: 'TOP_RIGHT',
        get: function get() {
            return 'topRight';
        }
    }, {
        key: 'MIDDLE_LEFT',
        get: function get() {
            return 'middleLeft';
        }
    }, {
        key: 'MIDDLE_CENTER',
        get: function get() {
            return 'middleCenter';
        }
    }, {
        key: 'MIDDLE_RIGHT',
        get: function get() {
            return 'middleRight';
        }
    }, {
        key: 'BOTTOM_LEFT',
        get: function get() {
            return 'bottomLeft';
        }
    }, {
        key: 'BOTTOM_CENTER',
        get: function get() {
            return 'bottomCenter';
        }
    }, {
        key: 'BOTTOM_RIGHT',
        get: function get() {
            return 'bottomRight';
        }
    }]);

    function ToolControlType() {
        _classCallCheck(this, ToolControlType);
    }

    return ToolControlType;
}();

},{}],304:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.TransformTool = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Mouse = require('./../utils/Mouse');

var _Mouse2 = _interopRequireDefault(_Mouse);

var _Calculator = require('./../utils/Calculator');

var _PointUtil = require('./../utils/PointUtil');

var _ToolControl = require('./ToolControl');

var _ToolControlType = require('./ToolControlType');

var _RotationControlType = require('./RotationControlType');

var _VectorContainer = require('./../view/VectorContainer');

var _lambda = require('../utils/lambda');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _collection = {

    tl: null,
    tr: null,
    tc: null,
    bl: null,
    br: null,
    bc: null,
    ml: null,
    mr: null,
    mc: null,

    rtl: null,
    rtc: null,
    rtr: null,
    rml: null,
    rmr: null,
    rbl: null,
    rbc: null,
    rbr: null
};

var _dragRange = 10;

var TransformTool = exports.TransformTool = function (_PIXI$utils$EventEmit) {
    _inherits(TransformTool, _PIXI$utils$EventEmit);

    _createClass(TransformTool, null, [{
        key: 'DELETE',
        get: function get() {
            return 'delete';
        }
    }, {
        key: 'SET_TARGET',
        get: function get() {

            return 'setTarget';
        }
    }, {
        key: 'TRANSFORM_COMPLETE',
        get: function get() {
            return 'transformComplete';
        }
    }, {
        key: 'SELECT',
        get: function get() {
            return 'select';
        }
    }, {
        key: 'DESELECT',
        get: function get() {
            return 'deselect';
        }
    }, {
        key: 'REQ_INPUT',
        get: function get() {
            return 'requestInput';
        }
    }, {
        key: 'DBCLICK',
        get: function get() {
            return 'dbClick';
        }
    }]);

    function TransformTool(stageLayer, targetLayer, options) {
        _classCallCheck(this, TransformTool);

        var _this = _possibleConstructorReturn(this, _PIXI$utils$EventEmit.call(this));

        _this.stageLayer = stageLayer;
        _this.targetLayer = targetLayer;

        _this.options = options || { deleteButtonOffsetY: 0, useSnap: true, snapAngle: 2 };
        _this.deleteButtonSize = 28;
        _this.deleteButtonOffsetY = options.deleteButtonOffsetY;
        _this.useSnap = options.useSnap || true;
        _this.snapAngle = options.snapAngle || 5;

        _this.initialize();
        _this.addEvent();

        _this._px = 0;
        _this._py = 0;
        return _this;
    }

    TransformTool.prototype.initialize = function initialize() {
        this.target = null;
        this.transform = new PIXI.Matrix();
        this.invertTransform = new PIXI.Matrix();

        this.g = this.graphics = new PIXI.Graphics();
        this.stageLayer.addChild(this.graphics);

        /**
         * 커서 생성
         * 0: TOP_CENTER
         * 1: TOP_RIGHT
         * 2: MIDDLE_RIGHT
         * 3: BOTTOM_RIGHT
         * 4: BOTTOM_CENTER
         * 5: BOTTOM_LEFT
         * 6: MIDDLE_LEFT
         * 7: TOP_LEFT
         */
        this.rotationCursorList = [new PIXI.Sprite.fromImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAOCAYAAAA8E3wEAAAAAXNSR0IArs4c6QAAAyRJREFUOBGNVF1IU2EY9pz9z9YkRdaPIfhHiV4V3Sy80S4jijLqwvDGO/Uq6KLLqBtpN+G9SndJmSBZlDYbNjeGLWSW2CQxt0E65+bmfk7Pc/I7HRdELzx7v/d7f7/3fc+kiv8jSWemPyu6e/1Zd334qHemhrJwFDryctCWRNtyiHvyv0gflEohC0PKMmDQcZFcJCpBVwQEF/e40uLxjqQwmAggJ5PJ85AZnDACZsAK2IBKwK5DuWyBjvb0EzEY8xxkfR41IQ3MhULBt7y8fBHnI8BR4FhLS8uJ2dnZqxsbG4/hPJnNZkPAJ2BxZ2dnKhaLPfH7/bc7OztP0x5wACymErpr+Xz+Gc4mgDnUDjI7q7JDGUqn03PT09OXqqurTwaDwTu7u7tvw+Hw68HBwZnW1tavJpMpB1vFaDTmUcxqb2/vnM/newW/D5FIZKC9vf0U9LVLS0s39/b2/Llc7jlkdog5JDEjCpb9/X1vV1eXPDExkYbhWiKRqO3p6XEFAoEzkiQpCPYFSLhcrlw8HjejG1ULCwtni8Wiob6+/vvo6Gikra0tH41G39TV1V3v6+uTR0ZG4na7/Rbis9ACoPaXvXciySK40tHR8dnj8bwzGAwFh8ORHBoamkqlUu/R8nHYPALuAQ8hP81kMnNjY2OTNTU1Cfr29/d7Nzc3PzY1Na01NzdH0aFJ3LPNbKvWUias4mzAxZYpbrc7vLW15UWyBysrK43QcQ4cgQa85jiS3gW83d3d8/Q3m81q23UJuQ9qQjqSmKTEtqnSwY/NZitYLJYKVPyysbExSpsyKGhlDC3zYF7jw8PDRXQkhdHwASTlICb9tNh8prY0BwrtlZhpAAFmtre3ud5qS8D1JGNhrmBjZxoaGr5Bofnihavo2gvccWnULWUAgi81YPjzoVDoh6IoamBWhzmWEKgSlbPqAdwFwTWC7WUI97FEP9fX1/P0Ff7wkeCbxWbfgA3/HNTAomoZs3KjIhmJ1TskU6xWawmfAD8DIqNPiMCs+gKWxwBIhN4f4yjJspx2Op0sUn25SFbOoT9ENCYJ/lv68/svf72P8gunF5KUe/EFxQAAAABJRU5ErkJggg=='), new PIXI.Sprite.fromImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyppVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1Rjc3NTE3RDZEQTcxMUU2OTkwNzk1ODBGOTZCN0JBOSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1Rjc3NTE3RTZEQTcxMUU2OTkwNzk1ODBGOTZCN0JBOSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjVGNzc1MTdCNkRBNzExRTY5OTA3OTU4MEY5NkI3QkE5IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjVGNzc1MTdDNkRBNzExRTY5OTA3OTU4MEY5NkI3QkE5Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+bXt2owAAA1tJREFUeNqsVt1LWmEY99XjR7ZNZ8yGC0YrG2ODddXNBjXGrlpjH25rhKj76Cbovqv9A4PddN9N7kLYYNiFoMyltmBusUqIIHJCzTJD0yzNr/1e9xrH0wfH2gsPnvfjPL/3eZ7f7zkSycFBJIePsuSEQ3oIAGHr0kKh8Ix3hkj+w6g652DKTCbzulQq+fEsh8lOAyIVRECdyTc2Nmy5XM5cLBbpvoKtS5mRegGlghTJV1dXX+bz+RddXV2XkS66pmJA1YhkvHdIvZHI1tfXLYSQp52dndfw3IR0Kbxe752RkRED9ht4gJwATFQtuGQyORiNRr16vT5GmaRQKHJjY2OeQCDgTqVS37HvmJ2d7W9vb7+A/XMMVM7LxvEgqMFV5P9nT0/PL0bVGuM4Lt/b2/tjfn6eAjodDsdtrJ+HNYoFqqQqHo8/3tra8uGmv6ljjUaTDIfDkx6Px2Wz2fxqtXqbrpvN5m+IanpmZsaMeZNYoP2iI12mRCLhp0BarTYBhk0vLS09B51H0+m0b3h4+AsFovubm5tTDEgHU7M6ETEaUaDgT2hEYFcILPOz3Csikcj1vb09u9vtnkC9shQI56bHx8dvYV9DtSVGT/sRIe8Pd3d3fWDXJLthRSNOp1MNoPcul2uCRmS1WgM4+7m1tbWZpY0TRQLmUJbNZh+Uy2WvQEuEAX0YGhqie+VQKOQJBoP9eNayaKRiKV0xgNwVaKFyibW1tRuIwKdSqTJ9fX1BSm9GgobTtqAaNiLSUYvF4qP0pjoCKYxYPyNgGpGIDe2QzwAB4yYHBgbSaD0c9JM0mUw3GQDH63WVs5xY70gdvaWJNk2wjsD5pY6ODtpiJKA5uYeB34vQUwFWVCqVJUjgE6SQFA2CnrYNoLhMJnuLQkfn5uY40L0Smd1u1+/s7EgxrhiNxkJ3d3cz2PkOAKnqDY81IRZlHYT5ta2tLSxsPy0tLX9isZh/ZWXFyprpPxLUC0JfRFd4RAULoEgVwGAwRMG6qcXFxTeYn2XdWnpSkIpgaWeotiAaAeaBhYWFQaYXVQ2V6wSpaUG019GI0MV9y8vLr1h7UfG6RAWEHOGIX/DjBEtTdx8+GnU63UfMi8z4tToxiETwCSZCx/y/UNwplF8+4v/YgVv/FWAAZA0E5twGSyUAAAAASUVORK5CYII='), new PIXI.Sprite.fromImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAcCAYAAABRVo5BAAAAAXNSR0IArs4c6QAAAztJREFUOBF9VN9rUnEU915NS5BV2JRqa7CYkOAeEgqmSTF7jC2IPfU22Nvajzehl6CHHmR/xN6FbCP6icsZgYrDLXFzNFcgONlQNyf+urfP+d77vdwN6sC53+/3nPM53/PrewWDQoK60qLf01mmj0ra3gQBNxTVPZ25jOwlMAE4iK0EJCKQEUxnYjoT9VTuqisHMyPh+PjYZ7ValyRJEsCiLMsCiD6cm41GY76vry9J3kDMgVipVB6mUqlVVUBCxoFAIAvA+vb2th+yC2AeibLp9XoC3QKFRgD9jEajjUQi8crlcm1oCnXDczwvN0xOTlZarVZ5YmJiC0p9wWgvs6uNRiPLhdDBYHDD5/NtLS4u+pFCfzwefwwxXUDFOxOViOIEMpnMO4BSp6en8aOjo3WbzVbzer25k5OTLwj1OkA28Jk8hWaz+aBer39tt9uxQqFwH45eh8Ph9zCUNzc3P62trT3F/gr4Ili7Weh0On4UZ71arXqhMO3u7t4G+BvaIc3NzcVKpdIS5NfAVtKDlZABukusCkho7Ha7kdHR0bzb7S7UarUVyBxgHq7AigPPaWIotB6iRQWPx1PZ2dkZtFgsN6AjhxprDYXwPNWcTmcLaZih4HkpIULwP6Dt4ODAbDKZaE7ZiOlWBYj8yCMnFg56ewujdnl4ePgPql2CUv9KlAGA8B7AT7BSBEKxWOyH8WAymbwzNjZWQrt+qUAOVgxRQbrxJQaawCa73f48EolUUSDj9PR0Y39//zvk/InxsA1sAMrl8gcMQezw8HCepgfgytDQ0G84S4yPjw8CSK2gQml1YSOXTqdXkM8exi0xNTX1AwYyJuZjPp9/gf1V8CUwry628KB/j5jROmTy7OxsHJO0il7exFl/G2sJu1b/HjFqNjS8HQqFzCjS52w22waQisILw3LU4oVCI7xDMx6yY2Bg4Fkul3sEhVYQbsQeMm6QEKIwMjKyBwXrI9pjmJmZEZeXlxdQuI7D4Xir6pgTZoQh9uJnFULIIjFASh6iKGEQJFEUe6j0G/ysUurtzICBIaCK8ZdOKZBnYuofjZ0+T/Vd6aYeBtwRtoy4A/2qAcmChafY/vNLYEZ/ARukibLGcoOhAAAAAElFTkSuQmCC'), new PIXI.Sprite.fromImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAAXNSR0IArs4c6QAAA71JREFUSA2lVUlPU1EYhU6UYi1qJIGwYlghsIGVkQ0JG8QRg4YgjVNMmhB/gQv+gAsXpCtcgFEjJgoaQouFUuwCIYHCCoSSME9lKnR+nvPoNWD7kMYvOX33ft+999xvuk1P+z9JV9guHderjk9SHJOAUK2vrxfjq+Y4rlMih/nsIh+O5dqNjY070Wh0dHt7+xnmGYAGEGQYHk3kQQo/wgPN8vLyTa1W+6K6ulp9eHj4YHV19RHO0QH0SqxL4eijpX88wIF3fT7fUFFRkRcmKScnZ21paWlwcXHRgnkmkOARdGcSkqh3d3dv7ezsOAUBdEy0IBpAjp5jztAJjzA8u6QHAoEbCI2zsrLSYzKZfMA2tks6nS5oNBr3SLy1tTXo9/ufQJ86iSRJ1YAjFosNhsPhoWAw6J6bmxskSXt7ux0Hj+ICbtiGscYViUQaYKP3KYnICeOdOTMz02C323sxllwul83hcNRjfAnIArSAXGX8SVUY/xgQzc3NvdbZ2Zml0WgiZWVlpr6+vgnog0A4vuZEU0KXXBCec39ZZG/m5+dL9vb2nAaDwV9bW/sTffIB6y4AekDkQjFUNMgAwXXAHJ/jc6Tv7u42hEKhzpaWlu/QSR6PxzY+Pn4fYyPAMCkeDptsZAjVrCIQjCB5bDBBrIoTvLLZbD3QS01NTT9Q0t2oqsuYGwDmS5GEBhJo0WS3EYoBt9v9BdXyOL5RvbKycgUevO3t7e1ByQZYrgiTu6ur6yrWnAfY7TwjKYkg0LGT2WiFhYVzVqv1G8hebm5u3sPhr3Fjp8ViceAQiQTQD4+NjTVhzlyILj+VQIu3qJ5PBQjmeVBra6vd6/XaUDVfm5ubnXq93k+92Wx24SLuOEFCyWJNgpBZzRDFnwqZADr5qRBflGm4rq5uZHJy0g6PPnd0dDBEF4ETPYF5gjBJlHQkOQshSUPCWR2y1NTUTDQ2Nq4hNFJpaWk2utg7PT39qby83IFOD2AR+4GIAuJSGCaK7AnUmbOzs4+RE1deXt4y5lJbW1s/Xlar0+msR7nyj4mhyQZ4+6T/HdAniPCEt4gWFBR8nJqa0iDWDysqKiSVShU7ODjwVFVV9cMubix3O+bcwzGFY0VhuQk36XKwpKTkPXLzBkS/iouLI+joCPQMDZ+LEHCcTOyF+t/CkJGQnvFZMC4sLJjxtzqGPniKOfOkWP+wnSrHw8WFdJ83jeXn57/b398PZWRksP6pT+nWWK8o9Eh4xUdODU/YaEKvuPE0Azcnk2T6U5Ob7BCh+w13D8jLwsORsAAAAABJRU5ErkJggg=='), new PIXI.Sprite.fromImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAOCAYAAAA8E3wEAAAAAXNSR0IArs4c6QAAAy1JREFUOBF9VE1IG1EQdpNs/jQNiAlW0h8UYkEIWCN4EQ/V3irFXgoFLd682PRorz3YS6iXHjwK4qktLRWkhlKtqWColcSSotEmXiS2KElM1MRkt9+87ixbKX3wMfPmzcw3M5mNVPfnSJokYdTZrGoKS7az5BiWbGfJcSo7kJTy+XyXoij15XLZRJ5ms1m12+2KxWJRNdRgXpMkiaQ4qqp2VatVJyARzs7OTLVaTeTleJfLFYWzQgEWQJBBmp1O55Pd3V378fGxqAiJVYLP55O9Xm8jfJ4ayXAXB8VMnp6eVhBbApkJRQhCiu3s7LwMpx7NVZDSoxlwoLq3fr//B3QiFGhra0sXCoWlUql0FzbROaTxSLlcLlipVJYGBga+4EGPJf38/HwD0glwc6JDujQg6TsQpsmRgFEUjo6OPh8eHj7G3QoQoagekg/dLalUqufk5GQFpESgk+LnieN+CZABE1dMQTwKkdBqtVYwWtfY2JjZ4XAMFYvFUDqd9sJP+JI/Y2dn53pzc/MdJK/DaKl4/Wjj/atQSkDsLiSdR4eZ9vb2TDabXRsfH1+BXW1qavo1Ozs7jw6iWIw5JJ4EJoBnuL9GYZ/C4fACJpLHolSnpqY+9vX1faNY+FCHbkBMiMgIVJUNCeeGh4e909PTyt7e3svW1tZb8XhcHhkZuZHJZK4gWa27uzuJgnLoqLy/v29PJBIewE+dBIPB7zMzM1mPx/PTZrNdGxwcrI9EIgqm1Yv8ZaAK6IQOVPMGI4klk8n7sHsDgYBve3v7EX7bVZz3o6OjUVoq6gLvqizL5Y6OjlQoFFra3NyMYEIf1tfXH2LbWxYXF28jLnphacRPSB3Slsp4fHVwcHAPer0GF2Rjf3//1Vgs9gBvL7CxC9jmOJAANvDtzqPT58vLy0PovIX8AVqShq2trV6MfBU6jZM4JB6pkPThu93ur3jgQxWRI42cfmfSeVmg6ttI3xd1zaA/BtrUOuS8iZz650JEdC5K4azZ6Y2JWIoCYef1JwIiZcnxMInDd/2vjR8uSmMhTMKSfZnUKOmNScifdb0zDv6fZHLyMep6MtiN+j9z/Qasm4fFL/kTlgAAAABJRU5ErkJggg=='), new PIXI.Sprite.fromImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAAXNSR0IArs4c6QAAA6lJREFUSA2lVUlLW1EUNiZGY4zGxhoiIggqQqtLEVqo0KVYOqTowqYKHRFcdeOy/oFuCl260S5EkFYLYtLGTKTUKg3RhSixLpI4GzXikOH1+0KuxDHRHji8e84993xnuvfJss4n2Tlq6RxdRirFKSvhnF/BdC4AxPfUscvF7JRt4ZQ6gis3Nzfbtra2HmAtB4t9LK9GIhPhQADk+nw+YywWe65UKrOCwaDcYDB8heto0v21MiIIo80Da2dnZ1+vrKw4y8vLA1VVVX+RjQPyE+zlgBkI7a9EPMCDSrBmbm7u5fLysqusrCwIOdEPAm1vb9sB9gg6UTosM6fjLPx+f+fq6qqDGeB4AkB8q6urfbu7uxMHBwfs0ZUyoXEik3A43KpSqd7ZbLaV+fl5RTwezx4eHi4ZHx+v7+3t/a7X64/q6+ujjY2NBpx5L5PJRvHNiBKND4VChXK5XIVIP9XW1sorKioU+fn5deA4QLJMJpOk0+l+KhQKP4ZBgm2JJEkFAApnhAIjkQ1rzcaqwMV2u93ocrnGsZYA9G1jY+Mp1gxK2GOZGbHhYhzjWMfAHNPI0NCQp66uTovoowMDAxq1Wn0vxVacgerqxCiZEbPRoYyDLS0tk3l5eXs7Ozt2TN1t6FNHOJEVSncfepEhv2mJTnLB2snJybaZmRkL1lJXV5f16Ojo88jISD7kVIfZALEmp44BpgYB8XyiA9ZeXVlZqUcGXzo6OpyQpbGxsVEAfUgC0RmZk2jb39+3w/Yh5IwuLEEYEbMp6u/vv4OL6OaFxBNzYDabCTSwtLR0C/u8wKpIJOJoaGjw8sImXwbq02YksmFpbkxPTz/DdLkIBFnq7u7+gXG37+3tfVxYWGg9PDx0a7XaLfEE4a0zwi5tRgRhJDRUg3UAMmEQ3O3t7W7IEu5QuLOz02GxWMYWFxdtRUVFIerFE7S+vv4YMitCXxfSaaDiwcHBu6j7iNfrNTc3N//GeEdw+sTzQ7mpqekPLu3U2tpaDeRLQYieCsSxLkSkNz0eTxvHGz345XQ6zX19fRb06xD7Umlp6SrKNYH9V5DF5cXychJAPMCGsk8acHFPT0+N1Wo1ojdTGo1mlwCBQGACzX+LfQ5O2nLB5pgIlArGXvHfUwDWYXwT0wcAG17yLugYCINKO2GwOUOpYIySmakxwi78qm3owRvILGvayYJNRkRAAuXgMjpRshdYs0TXzgBnz5DISh6NRluxS0DymRLR8H/oovMnXul/F7SWjoEFkdEAAAAASUVORK5CYII='), new PIXI.Sprite.fromImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAcCAYAAABRVo5BAAAAAXNSR0IArs4c6QAAAz9JREFUOBFtVN9LU3EU997b7nJrG+hkYWKGOEFBIhdIWFHMFx+iN4NASv+A8EXfetxTkD304rNo0INgVhhkybURbmuwcDCnDRNxOtT9cIr7cW+f83Xf23XswNn5nvP9fs4538/33Al1F0W46Nb0NIpeMmwRqFr5Nh3mSjHNCKQAAUUoxaWKTzEVWoaWKlavyCplMplei8UyoaqqVC6XRVhKUicIgiZJkkp6cnLiczgcQV6R2hAQ+LW3tzdjt9snhoeH1UgkcpWAENbm/Px8zOVyWeFTIV3IoUSWaDT65ODgwN/R0bEFn99NCwQCn5LJ5EPERNYKFkYRurq6lra3t98ripKUZblg3ORrDmR3RJB8saenR25ra/P6fL4CRLbZbDkCVO5KHehCQGKxHtqwvr7+Ynl5+QvW2tDQ0M/Dw8Mf7e3tiVAotJDL5e4jzguyhYyAzev1tubzeT8q/nU6nSmwqOC+Y9ls9juIWzw9Pb2Hc1SI/VC1y9CG1dXVp36/fxFrbXp6euH4+HgcaxnJHmuaFigWi3fh60Bik2huQta3IyMjK3izEqqtJBIJehJ2dwAfQe/AZ0JoE9QGdaGlz263+09fX1+kVCrNIMYnCEu0oWnks0wE5CqC/ubNzc3Wzs7ONKZni85WFAYHBYFG7z87FKMARABAwoTQ+2VZpMaPTiv2eOayyWQq7O7umhFz1MCwEJHCAcyenZ3t4I5XMKdNIMiNfX4Nut8tQqHdEK9IIOpdBe3xgYGBHQDdeDPnxsbGDcSldDrdC/sGhFlgBSOQvrlSPB5XRkdHi8guTE1N5XHX54h58Lm9wtQUAORc4Pg5SexJwGYzHv2rx+OJYkYzR0dHCk0PJioUDoc/VI8cZdFnFTP5bG1tbYmGoL+//zdaD2NfCwaDH1Op1INKIZhzAqhtmld7Y2Pjtf39/XeTk5Pf4OvkGb/HC/8A/NDs7Gy32Wy+Pjc3R9NUUzhQ34zFYjdbWlpeDg4OWvFpdesbWBi/R84QWQF/VretVutrMFpPrHIlgCiKKlQDUWMgTeFASkxruieRRJ2QZQMNy54Klv89qtVAVhkHeBIsmegEwaMk+mCz3SrfmJT2CcxF+wduL3Nt3V5HIgAAAABJRU5ErkJggg=='), new PIXI.Sprite.fromImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAAXNSR0IArs4c6QAAA5hJREFUSA2lVklMU1EUtb/fTlIpihgIG2TYOCxYsGFDYsIGMYoTCVaKGKNpQly4YeOCuHehG5Yk6IKEhaKGUBT6EZtQJRJgQUgaSJgqQylQZvo9p/aZ30mmm9z8++5775x777vv5etOHE90Sbar8T4p3nGIcYRgeXnZhj3EodInFOZfOQ4JESSj0Vi1trZ2D/ZJqEwfNIboqCQCRNra2tKbzebnU1NT1QA3QkkWQ3QYkn/AURA9vvL6+rrkdrv9BoOhfmxsjEQm+qFcH5GDkGjBCcxIDVBGbQKJPD4+LhcXF+enp6c7RkdHWTrOcW1k734kgiASdXSzGV9LQ0NDtqIoVy0Wy+VwOCyhXNkgupCZmWn3+Xy3NSQwUwsJGAQjt0DT8/Lyznu93mp0VNvKyspAf39/V0tLi6u8vHwI82xdNTc3d2Z+fl5ZWlq6j3FM2TCOES3BKcycaW1tLQXw+5GRke7KykqvLMs78EeAtd+CgoKJYDCoBAKBm/CLksGMlXiCs4ODg3Zs9Dgcjm9YqppMplBtba3S1dX1aWJiwtXU1NRNPwkA3jc7O8tyabsslgEjkjBN1j4DBA8WFxf7CYCx6nQ6e5CRsr29/Rr+O6urqy+am5s/FxYW+piB3++/hXVsDJaaWAkisuCi0+3t7aWov4cEaNHNzs7OjwB/Nzc3dwnzkWbY2Nio93g8H0DWGy3RfzMgo8jCAuBziLjDbrd/h191uVwkeNXR0cEmEFHqdnd3H6qq6t3c3LwOP4nFHMzkQhJGYh0aGqoeHh52wVbRrl9B8DZKwDVUig4EDug12hrlXIKIBYyENzaDbVpRUfED92ANpVAmJycvwp8QJQjSEtCSOLQEPIu0xsbGIhziANu0rq6uLxQKvYFfe5gikyRwiS5GRuEm2iyVEZfrCkoVRL3lmpqaEFqyD/4D1RvrEoStegJgdyVJcu7t7UmwJTwThra2tgDn8vPzzTk5Oc92dnacer1e1el0Ybhf4vuF8wcVZqFHSR7hKXCzXa1W6ypadgt+FY/ess1mC5SUlAyjXZVoFx2qXAwkQoKvEW/Ok5mZGXdWVtZvEgglMS8aWvoGfCzbkUh4HpFbPj097QRRryAiAZ+K6E3e96IBJ6UwMnHwFgA+xWH3lJWV/WIGsPkWabsrJdB+E4KIGRlxTx6jEX4uLCxUYXysDOKJBRHrLuOMivA9cusKcILGSzIf1yT8T8VvTDX+A7nQiRk9jngZAAAAAElFTkSuQmCC')];

        for (var i = 0; i < this.rotationCursorList.length; i++) {
            var cursor = this.rotationCursorList[i];
            cursor.visible = false;
            cursor.anchor = { x: 0.5, y: 0.5 };
            this.stageLayer.addChild(cursor);
        }

        var controlOptions = {};
        var rotationOptions = {
            rotationCursorList: this.rotationCursorList
        };
        var deleteButtonOptions = {};

        this.c = this.controls = {
            de: new _ToolControl.ToolControl(_ToolControlType.ToolControlType.DELETE, deleteButtonOptions),
            tl: new _ToolControl.ToolControl(_ToolControlType.ToolControlType.TOP_LEFT, controlOptions),
            tc: new _ToolControl.ToolControl(_ToolControlType.ToolControlType.TOP_CENTER, controlOptions),
            tr: new _ToolControl.ToolControl(_ToolControlType.ToolControlType.TOP_RIGHT, controlOptions),
            ml: new _ToolControl.ToolControl(_ToolControlType.ToolControlType.MIDDLE_LEFT, controlOptions),
            mr: new _ToolControl.ToolControl(_ToolControlType.ToolControlType.MIDDLE_RIGHT, controlOptions),
            bl: new _ToolControl.ToolControl(_ToolControlType.ToolControlType.BOTTOM_LEFT, controlOptions),
            bc: new _ToolControl.ToolControl(_ToolControlType.ToolControlType.BOTTOM_CENTER, controlOptions),
            br: new _ToolControl.ToolControl(_ToolControlType.ToolControlType.BOTTOM_RIGHT, controlOptions),
            mc: new _ToolControl.ToolControl(_ToolControlType.ToolControlType.MIDDLE_CENTER, controlOptions),
            rde: new _ToolControl.ToolControl(_ToolControlType.ToolControlType.ROTATION, rotationOptions, _RotationControlType.RotationControlType.DELETE),
            rtl: new _ToolControl.ToolControl(_ToolControlType.ToolControlType.ROTATION, rotationOptions, _RotationControlType.RotationControlType.TOP_LEFT),
            rtc: new _ToolControl.ToolControl(_ToolControlType.ToolControlType.ROTATION, rotationOptions, _RotationControlType.RotationControlType.TOP_CENTER),
            rtr: new _ToolControl.ToolControl(_ToolControlType.ToolControlType.ROTATION, rotationOptions, _RotationControlType.RotationControlType.TOP_RIGHT),
            rml: new _ToolControl.ToolControl(_ToolControlType.ToolControlType.ROTATION, rotationOptions, _RotationControlType.RotationControlType.MIDDLE_LEFT),
            rmr: new _ToolControl.ToolControl(_ToolControlType.ToolControlType.ROTATION, rotationOptions, _RotationControlType.RotationControlType.MIDDLE_RIGHT),
            rbl: new _ToolControl.ToolControl(_ToolControlType.ToolControlType.ROTATION, rotationOptions, _RotationControlType.RotationControlType.BOTTOM_LEFT),
            rbc: new _ToolControl.ToolControl(_ToolControlType.ToolControlType.ROTATION, rotationOptions, _RotationControlType.RotationControlType.BOTTOM_CENTER),
            rbr: new _ToolControl.ToolControl(_ToolControlType.ToolControlType.ROTATION, rotationOptions, _RotationControlType.RotationControlType.BOTTOM_RIGHT)
        };

        // 맨 아래에 위치시킵니다.
        this.stageLayer.addChild(this.c.mc);
        this.c.mc.on(_ToolControl.ToolControl.MOVE_START, this.onControlMoveStart.bind(this));
        this.c.mc.on(_ToolControl.ToolControl.MOVE, this.onControlMove.bind(this));
        this.c.mc.on(_ToolControl.ToolControl.MOVE_END, this.onControlMoveEnd.bind(this));
        this.c.mc.on(_ToolControl.ToolControl.DBCLICK, this.onControlDBClick.bind(this));

        this.stageLayer.addChild(this.c.rde);
        this.stageLayer.addChild(this.c.rtl);
        this.stageLayer.addChild(this.c.rtc);
        this.stageLayer.addChild(this.c.rtr);
        this.stageLayer.addChild(this.c.rml);
        this.stageLayer.addChild(this.c.rmr);
        this.stageLayer.addChild(this.c.rbl);
        this.stageLayer.addChild(this.c.rbc);
        this.stageLayer.addChild(this.c.rbr);

        for (var prop in this.controls) {
            var control = this.controls[prop];
            control.visible = false;
            control.centerPoint = this.controls.mc;
            control.targetLayer = this.targetLayer;

            switch (control.type) {
                case _ToolControlType.ToolControlType.DELETE:
                    this.stageLayer.addChild(control);
                    control.on('click', this.onDelete.bind(this));
                    break;

                case _ToolControlType.ToolControlType.ROTATION:
                    //this.stageLayer.addChild(control);
                    control.on(_ToolControl.ToolControl.ROTATE_START, this.onRotateStart.bind(this));
                    control.on(_ToolControl.ToolControl.ROTATE, this.onRotate.bind(this));
                    control.on(_ToolControl.ToolControl.ROTATE_END, this.onRotateEnd.bind(this));
                    control.on(_ToolControl.ToolControl.CHANGE_ROTATION_CURSOR, this.onChangeRotationCursor.bind(this));
                    break;

                case _ToolControlType.ToolControlType.TOP_LEFT:
                case _ToolControlType.ToolControlType.TOP_RIGHT:
                case _ToolControlType.ToolControlType.TOP_CENTER:
                case _ToolControlType.ToolControlType.MIDDLE_LEFT:
                case _ToolControlType.ToolControlType.MIDDLE_RIGHT:
                case _ToolControlType.ToolControlType.BOTTOM_LEFT:
                case _ToolControlType.ToolControlType.BOTTOM_RIGHT:
                case _ToolControlType.ToolControlType.BOTTOM_CENTER:
                    this.stageLayer.addChild(control);
                    control.on(_ToolControl.ToolControl.MOVE_START, this.onControlMoveStart.bind(this));
                    control.on(_ToolControl.ToolControl.MOVE, this.onControlMove.bind(this));
                    control.on(_ToolControl.ToolControl.MOVE_END, this.onControlMoveEnd.bind(this));
                    break;
            }
        }
    };

    TransformTool.prototype.addEvent = function addEvent() {

        this.stageLayer.on(TransformTool.SET_TARGET, this.onSetTarget.bind(this));
        //this.stageLayer.root.on( "mousedown", this.onMouseDown, this );
        //this.stageLayer.root.on( 'mouseup', this.onMouseUp, this );

        window.document.addEventListener('mousedown', this.onMouseDown.bind(this));
        window.document.addEventListener('mouseup', this.onMouseUp.bind(this));

        window.document.addEventListener('touchstart', this.onMouseDown.bind(this));
        window.document.addEventListener('touchend', this.onMouseUp.bind(this));
        this.downCnt = 0;
    };

    TransformTool.prototype.onMouseDown = function onMouseDown(e) {

        //if( e.data.originalEvent.target != this.stageLayer.renderer.view ) return;

        this._px = _Mouse2.default.global.x;
        this._py = _Mouse2.default.global.y;
    };

    TransformTool.prototype.onMouseUp = function onMouseUp(e) {

        //if( e.data.originalEvent.target != this.stageLayer.renderer.view ) return;

        this.downCnt--;

        if (this.downCnt < 0 && this.target) {

            var dx = _Mouse2.default.globalX - this._px,
                dy = _Mouse2.default.globalX - this._py;

            if (dx * dx + dy * dy <= _dragRange * _dragRange) {

                this.target.emit(TransformTool.DESELECT);
                this.target.visible = true;
                this.releaseTarget();
            }
        }

        this.downCnt = 0;
    };

    TransformTool.prototype.show = function show() {

        if (!this.controls || this.g.visible) return;

        this.g.visible = true;

        (0, _lambda.each)(this.controls, function (e) {
            return e.visible = true;
        });
    };

    TransformTool.prototype.hide = function hide() {
        if (!this.controls || this.g.visible === false) return;

        this.g.visible = false;

        (0, _lambda.each)(this.controls, function (e) {
            return e.visible = false;
        });
    };

    TransformTool.prototype.activeTarget = function activeTarget(target) {
        this.target = target;
        this.removeTextureUpdateEvent();
        this.addTextureUpdateEvent();

        this.update();
        this.c.mc.drawCenter(this.target.rotation, this.width, this.height);
        this.target.emit(TransformTool.SELECT, target);
        this.stageLayer.emit(TransformTool.SET_TARGET, target);
    };

    TransformTool.prototype.setTarget = function setTarget(e) {
        var pixiSprite = e.target;
        pixiSprite.emit(TransformTool.SET_TARGET, pixiSprite);
        this.activeTarget(pixiSprite);
        this.c.mc.emit('mousedown', e);
    };

    TransformTool.prototype.releaseTarget = function releaseTarget() {
        if (this.target === null) return;
        this.hide();
        this.removeTextureUpdateEvent();
        this.target = null;
    };

    TransformTool.prototype.addTextureUpdateEvent = function addTextureUpdateEvent() {
        this.target._targetTextureUpdateListener = this.onTextureUpdate.bind(this);
        this.target.on(_VectorContainer.VectorContainer.TEXTURE_UPDATE, this.target._targetTextureUpdateListener);
    };

    TransformTool.prototype.removeTextureUpdateEvent = function removeTextureUpdateEvent() {
        if (this.target !== null && this.target._targetTextureUpdateListener !== null) {
            this.target.off(_VectorContainer.VectorContainer.TEXTURE_UPDATE, this.target._targetTextureUpdateListener);
            this.target._targetTextureUpdateListener = null;
        }
    };

    TransformTool.prototype.update = function update() {
        if (this.target === null) return;
        this.setControls();
        this.updateTransform();
        this.draw();
        this.updatePrevTargetLt();
    };

    TransformTool.prototype.visibleCursorArea = function visibleCursorArea(isVisiable) {
        var drawAlpha = isVisiable ? 0.3 : 0.0;

        for (var prop in this.controls) {
            var control = this.controls[prop];
            control.drawAlpha = drawAlpha;
            control.render();
        }
    };

    TransformTool.prototype.setControls = function setControls() {
        var scaleSignX = this.target.scaleSignX;
        var scaleSignY = this.target.scaleSignY;
        var localBounds = this.target.getLocalBounds();
        var w = localBounds.width * scaleSignX;
        var h = localBounds.height * scaleSignY;
        var deleteButtonOffsetY = this.deleteButtonOffsetY * scaleSignY;
        //var rotationLineLength = this.rotationLineLength * scaleSignY;

        this.c.tl.localPoint = new PIXI.Point(0, 0);
        this.c.tr.localPoint = new PIXI.Point(w, 0);
        this.c.tc.localPoint = _PointUtil.PointUtil.interpolate(this.c.tr.localPoint, this.c.tl.localPoint, .5);
        this.c.bl.localPoint = new PIXI.Point(0, h);
        this.c.br.localPoint = new PIXI.Point(w, h);
        this.c.bc.localPoint = _PointUtil.PointUtil.interpolate(this.c.br.localPoint, this.c.bl.localPoint, .5);
        this.c.ml.localPoint = _PointUtil.PointUtil.interpolate(this.c.bl.localPoint, this.c.tl.localPoint, .5);
        this.c.mr.localPoint = _PointUtil.PointUtil.interpolate(this.c.br.localPoint, this.c.tr.localPoint, .5);
        this.c.mc.localPoint = _PointUtil.PointUtil.interpolate(this.c.bc.localPoint, this.c.tc.localPoint, .5);
        this.c.de.localPoint = _PointUtil.PointUtil.add(this.c.tl.localPoint.clone(), new PIXI.Point(0, deleteButtonOffsetY));
        //this.c.ro.localPoint = PointUtil.add(this.c.tc.localPoint.clone(), new PIXI.Point(0, rotationLineLength));

        var c = this.c;
        this.c.rde.localPoint = new PIXI.Point(c.de.localPoint.x, c.de.localPoint.y);
        this.c.rtl.localPoint = new PIXI.Point(c.tl.localPoint.x, c.tl.localPoint.y);
        this.c.rtc.localPoint = new PIXI.Point(c.tc.localPoint.x, c.tc.localPoint.y);
        this.c.rtr.localPoint = new PIXI.Point(c.tr.localPoint.x, c.tr.localPoint.y);
        this.c.rml.localPoint = new PIXI.Point(c.ml.localPoint.x, c.ml.localPoint.y);
        this.c.rmr.localPoint = new PIXI.Point(c.mr.localPoint.x, c.mr.localPoint.y);
        this.c.rbl.localPoint = new PIXI.Point(c.bl.localPoint.x, c.bl.localPoint.y);
        this.c.rbc.localPoint = new PIXI.Point(c.bc.localPoint.x, c.bc.localPoint.y);
        this.c.rbr.localPoint = new PIXI.Point(c.br.localPoint.x, c.br.localPoint.y);

        for (var prop in this.controls) {
            var control = this.controls[prop];
            control.target = this.target;
        }
    };

    TransformTool.prototype.updateTransform = function updateTransform() {
        this.transform = this.target.worldTransform.clone();
        this.invertTransform = this.transform.clone();
        this.invertTransform.invert();

        for (var prop in this.controls) {
            var control = this.controls[prop];
            control.transform = this.transform;
        }
    };

    TransformTool.prototype.updatePrevTargetLt = function updatePrevTargetLt() {
        if (this.target === null) return;
        this.prevLtX = this.lt.x;
        this.prevLtY = this.lt.y;
    };

    TransformTool.prototype.scaleCorner = function scaleCorner(e) {
        var currentControl = e.target;
        var currentMousePoint = e.currentMousePoint;

        var currentPoint = this.invertTransform.apply(currentMousePoint);
        var startPoint = this.invertTransform.apply(this.startMousePoint);
        var vector = _PointUtil.PointUtil.subtract(currentPoint, startPoint);

        var currentControl = this.invertTransform.apply(currentControl.globalPoint);
        var centerPoint = this.invertTransform.apply(this.c.mc.globalPoint);
        var wh = _PointUtil.PointUtil.subtract(currentControl, centerPoint);

        var w = wh.x * 2;
        var h = wh.y * 2;
        var scaleX = 1 + vector.x / w;
        var scaleY = 1 + vector.y / h;

        var abs_scalex = Math.abs(scaleX);
        var abs_scaley = Math.abs(scaleY);

        var op_scalex = scaleX > 0 ? 1 : -1;
        var op_scaley = scaleY > 0 ? 1 : -1;

        if (abs_scalex > abs_scaley) scaleY = abs_scalex * op_scaley;else scaleX = abs_scaley * op_scalex;

        this.target.scale = { x: scaleX, y: scaleY };
    };

    TransformTool.prototype.scaleMiddle = function scaleMiddle(e) {
        var isScaleHorizontal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        var currentControl = e.target;
        var currentMousePoint = e.currentMousePoint;

        var scaleX = 1;
        var scaleY = 1;

        var currentPoint = this.invertTransform.apply(currentMousePoint);
        var startPoint = this.invertTransform.apply(this.startMousePoint);
        var vector = _PointUtil.PointUtil.subtract(currentPoint, startPoint);

        var currentControl = this.invertTransform.apply(currentControl.globalPoint);
        var centerPoint = this.invertTransform.apply(this.c.mc.globalPoint);
        var wh = _PointUtil.PointUtil.subtract(currentControl, centerPoint);

        var w = wh.x * 2;
        var h = wh.y * 2;

        if (isScaleHorizontal) scaleX = 1 + vector.x / w;else scaleY = 1 + vector.y / h;

        this.target.scale = { x: scaleX, y: scaleY };
    };

    /**
     * 타겟 객체 이동
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */


    TransformTool.prototype.move = function move(e) {

        var change = e.targetChangeMovement;

        this.target.x += change.x;
        this.target.y += change.y;
    };

    TransformTool.prototype.doTransform = function doTransform(e) {
        var control = e.target;
        switch (control.type) {
            case _ToolControlType.ToolControlType.TOP_LEFT:
            case _ToolControlType.ToolControlType.TOP_RIGHT:
            case _ToolControlType.ToolControlType.BOTTOM_LEFT:
            case _ToolControlType.ToolControlType.BOTTOM_RIGHT:
                this.scaleCorner(e);
                break;

            case _ToolControlType.ToolControlType.MIDDLE_LEFT:
            case _ToolControlType.ToolControlType.MIDDLE_RIGHT:
                this.scaleMiddle(e, true);
                break;

            case _ToolControlType.ToolControlType.TOP_CENTER:
            case _ToolControlType.ToolControlType.BOTTOM_CENTER:
                this.scaleMiddle(e, false);
                break;

            case _ToolControlType.ToolControlType.MIDDLE_CENTER:
                this.move(e);
                break;
        }
    };

    TransformTool.prototype.draw = function draw() {

        this.stageLayer.updateTransform();

        var g = this.g;
        g.visible = true;
        var transform = this.target.worldTransform.clone();
        var globalPoints = {
            de: this.deleteButtonPosition,
            //ro: this.rotateControlPosition,
            tl: transform.apply(this.c.tl.localPoint),
            tr: transform.apply(this.c.tr.localPoint),
            tc: transform.apply(this.c.tc.localPoint),
            bl: transform.apply(this.c.bl.localPoint),
            br: transform.apply(this.c.br.localPoint),
            bc: transform.apply(this.c.bc.localPoint),
            ml: transform.apply(this.c.ml.localPoint),
            mr: transform.apply(this.c.mr.localPoint),
            mc: transform.apply(this.c.mc.localPoint),
            rde: this.deleteButtonPosition,
            rtl: transform.apply(this.c.rtl.localPoint),
            rtc: transform.apply(this.c.rtc.localPoint),
            rtr: transform.apply(this.c.rtr.localPoint),
            rml: transform.apply(this.c.rml.localPoint),
            rmr: transform.apply(this.c.rmr.localPoint),
            rbl: transform.apply(this.c.rbl.localPoint),
            rbc: transform.apply(this.c.rbc.localPoint),
            rbr: transform.apply(this.c.rbr.localPoint)
        };

        g.clear();
        // g.lineStyle(0.5, 0xFFFFFF);
        g.lineStyle(1, 0xFFFFFF);

        this.drawRect(g, globalPoints);

        for (var prop in this.controls) {
            var p = globalPoints[prop];
            var c = this.controls[prop];
            c.x = p.x;
            c.y = p.y;
            c.visible = true;
        }
    };

    /**
     * 트랜스폼 툴의 선과 컨트롤 객체 위치를 업데이트한다.
     * 1. target이 있는 경우에만 업데이트한다.
     * 2. target의 worldTransform을 통해 global 좌표를 계산한다.
     * @return {[type]} [description]
     */


    TransformTool.prototype.updateGraphics = function updateGraphics() {

        if (!this.target) return;

        this.stageLayer.updateTransform();

        this.g.visible = true;

        var locals = this.c,
            transform = this.target.worldTransform,
            globals = (0, _lambda.map)(_collection, function (e, key) {
            return transform.apply(locals[key].localPoint);
        });

        globals.de = globals.rde = this.deleteButtonPosition;

        this.g.clear();
        this.g.lineStyle(0.5, 0xFFFFFF);

        this.drawRect(this.g, globals);

        (0, _lambda.each)(this.controls, function (e, key) {

            e.x = globals[key].x;
            e.y = globals[key].y;

            e.visible = true;
        });
    };

    /**
     * 주어진 graphics 객체를 사용하여 사각형을 그린다.
     * 1. points 객체에 좌상단(tl), 우상단(tr), 우하단(br), 좌하단(bl) 4개의 points가 있다.
     * @param  {[type]} g      [description]
     * @param  {[type]} points [description]
     * @return {[type]}        [description]
     */


    TransformTool.prototype.drawRect = function drawRect(g, points) {

        g.moveTo(points.tl.x, points.tl.y);
        g.lineTo(points.tr.x, points.tr.y);
        g.lineTo(points.br.x, points.br.y);
        g.lineTo(points.bl.x, points.bl.y);
        g.lineTo(points.tl.x, points.tl.y);
    };

    TransformTool.prototype.setPivotByLocalPoint = function setPivotByLocalPoint(localPoint) {
        this.target.setPivot(localPoint);
        this.target.pivot = localPoint;
        this.adjustPosition();
    };

    TransformTool.prototype.setPivotByControl = function setPivotByControl(control) {
        this.pivot = this.getPivot(control);
        this.target.setPivot(this.pivot.localPoint);
        this.adjustPosition();
    };

    TransformTool.prototype.adjustPosition = function adjustPosition() {
        var offsetX = this.lt.x - this.prevLtX;
        var offsetY = this.lt.y - this.prevLtY;
        var noScaleOffsetX = offsetX / this.diffScaleX;
        var noScaleOffsetY = offsetY / this.diffScaleY;
        var pivotOffsetX = offsetX - noScaleOffsetX;
        var pivotOffsetY = offsetY - noScaleOffsetY;
        this.target.x = this.target.x - offsetX + pivotOffsetX;
        this.target.y = this.target.y - offsetY + pivotOffsetY;
        this.updatePrevTargetLt();
    };

    TransformTool.prototype.getPivot = function getPivot(control) {
        switch (control.type) {
            case _ToolControlType.ToolControlType.DELETE:
                return this.c.mc;
            case _ToolControlType.ToolControlType.ROTATION:
                return this.c.mc;
            case _ToolControlType.ToolControlType.TOP_LEFT:
                return this.c.br;
            case _ToolControlType.ToolControlType.TOP_CENTER:
                return this.c.bc;
            case _ToolControlType.ToolControlType.TOP_RIGHT:
                return this.c.bl;
            case _ToolControlType.ToolControlType.MIDDLE_LEFT:
                return this.c.mr;
            case _ToolControlType.ToolControlType.MIDDLE_RIGHT:
                return this.c.ml;
            case _ToolControlType.ToolControlType.BOTTOM_LEFT:
                return this.c.tr;
            case _ToolControlType.ToolControlType.BOTTOM_CENTER:
                return this.c.tc;
            case _ToolControlType.ToolControlType.BOTTOM_RIGHT:
                return this.c.tl;
            case _ToolControlType.ToolControlType.MIDDLE_CENTER:
                return this.c.mc;
        }
    };

    //////////////////////////////////////////////////////////////////////////
    // Cursor
    //////////////////////////////////////////////////////////////////////////


    TransformTool.prototype.enableCurrentStyleCursor = function enableCurrentStyleCursor() {
        if (this.target === null) return;

        this.target.buttonMode = false;
        this.target.interactive = false;
        this.target.defaultCursor = 'inherit';

        for (var prop in this.c) {
            var c = this.c[prop];
            c.buttonMode = false;
            c.interactive = false;
            c.defaultCursor = 'inherit';
        }

        this.stageLayer.buttonMode = true;
        this.stageLayer.interactive = true;
        this.stageLayer.defaultCursor = _Mouse2.default.currentCursorStyle;
    };

    TransformTool.prototype.disableCurrentStyleCursor = function disableCurrentStyleCursor() {
        if (this.target === null) return;

        this.target.buttonMode = true;
        this.target.interactive = true;
        this.target.defaultCursor = 'inherit';

        for (var prop in this.c) {
            var c = this.c[prop];
            c.buttonMode = true;
            c.interactive = true;
            c.defaultCursor = 'inherit';
        }

        this.stageLayer.buttonMode = false;
        this.stageLayer.interactive = false;
        this.stageLayer.defaultCursor = 'inherit';
    };

    TransformTool.prototype.onSetTarget = function onSetTarget(target) {
        if (this.target !== target) this.releaseTarget();
    };

    TransformTool.prototype.onDelete = function onDelete(e) {
        if (!this.target) return;
        this.target.emit(TransformTool.DELETE, this.target);
    };

    TransformTool.prototype.onRotateStart = function onRotateStart(e) {
        if (!this.target) return;
        this.downCnt++;
        this.target._rotation = this.target.rotation;
        this.setPivotByControl(e.target);
        this.enableCurrentStyleCursor();
    };

    TransformTool.prototype.onRotate = function onRotate(e) {
        if (!this.target) return;

        if (this.useSnap) {
            var rotation = this.target._rotation + e.changeRadian;
            var angle = _Calculator.Calc.toDegrees(rotation);
            var absAngle = Math.round(Math.abs(angle) % 90);

            if (absAngle < this._startSnapAngle || absAngle > this._endSnapAngle) {
                this.target.rotation = _Calculator.Calc.toRadians(_Calculator.Calc.snapTo(angle, 90));
            } else {
                this.target.rotation = rotation;
            }

            this.target._rotation = rotation;
        } else {
            this.target.rotation += e.changeRadian;
            this.target._rotation = this.target.rotation;
        }

        this.draw();
        this.updatePrevTargetLt();
    };

    TransformTool.prototype.onRotateEnd = function onRotateEnd(e) {
        if (!this.target) return;
        this.update();
        this.c.mc.drawCenter(this.target.rotation, this.width, this.height);
        this.disableCurrentStyleCursor();
    };

    TransformTool.prototype.onControlMoveStart = function onControlMoveStart(e) {
        if (!this.target) return;
        this.downCnt++;
        this.startMousePoint = { x: e.currentMousePoint.x, y: e.currentMousePoint.y };
        this.setPivotByControl(e.target);
        this.updatePrevTargetLt();
        this.enableCurrentStyleCursor();
    };

    TransformTool.prototype.onControlMove = function onControlMove(e) {
        if (!this.target) return;
        this.doTransform(e);
        this.draw();
        this.updatePrevTargetLt();
    };

    TransformTool.prototype.onControlMoveEnd = function onControlMoveEnd(e) {
        if (!this.target) return;
        this.target.emit(TransformTool.TRANSFORM_COMPLETE);
        this.disableCurrentStyleCursor();
    };

    TransformTool.prototype.onControlDBClick = function onControlDBClick(e) {
        if (!this.target) return;
        this.target.emit(TransformTool.DBCLICK, { target: this.target });
    };

    TransformTool.prototype.onChangeRotationCursor = function onChangeRotationCursor(cursor) {
        this.stageLayer.defaultCursor = cursor;
    };

    TransformTool.prototype.onTextureUpdate = function onTextureUpdate(e) {
        var target = e.target;
        var width = target.width;
        var height = target.height;
        this.setPivotByLocalPoint({ x: 0, y: 0 });
        this.update();
        this.c.mc.drawCenter(this.target.rotation, this.width, this.height);
    };

    _createClass(TransformTool, [{
        key: 'lt',
        get: function get() {
            this.target.displayObjectUpdateTransform();
            var transform = this.target.worldTransform.clone();
            transform.rotate(-this.targetLayer.rotation);
            return transform.apply({ x: 0, y: 0 });
        }
    }, {
        key: 'deleteButtonPosition',
        get: function get() {
            if (!this.c) return new PIXI.Point(0, 0);

            var transform = this.target.worldTransform.clone();
            var tl = transform.apply(this.c.tl.localPoint);
            var ml = transform.apply(this.c.ml.localPoint);
            //return PointUtil.getAddedInterpolate(tl, ml, this.deleteButtonOffsetY);
            return _PointUtil.PointUtil.add(_PointUtil.PointUtil.getAddedInterpolate(tl, ml, this.deleteButtonOffsetY), new PIXI.Point(-this.deleteButtonSize, -this.deleteButtonSize));
        }

        /**
         * NOT USE
         * 회전 컨트롤이 모든 컨트롤 뒤에 배치되도록 변경되어 사용하지 않습니다.
         * @returns {*}
         */

    }, {
        key: 'rotateControlPosition',
        get: function get() {
            if (!this.c) return new PIXI.Point(0, 0);

            var transform = this.target.worldTransform.clone();
            var tc = transform.apply(this.c.tc.localPoint);
            var ro = transform.apply(this.c.ro.localPoint);
            return _PointUtil.PointUtil.getAddedInterpolate(tc, ro, this.rotationLineLength);
        }
    }, {
        key: 'diffScaleX',
        get: function get() {
            var matrix = this.target.worldTransform;
            return Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b);
        }
    }, {
        key: 'diffScaleY',
        get: function get() {
            var matrix = this.target.worldTransform;
            return Math.sqrt(matrix.c * matrix.c + matrix.d * matrix.d);
        }
    }, {
        key: 'width',
        get: function get() {
            return this.target.width * this.diffScaleX;
        }
    }, {
        key: 'height',
        get: function get() {
            return this.target.height * this.diffScaleY;
        }
    }, {
        key: 'useSnap',
        set: function set(value) {
            this._useSnap = value;
        },
        get: function get() {
            return this._useSnap;
        }
    }, {
        key: 'snapAngle',
        set: function set(value) {
            this._snapAngle = value;
            this._startSnapAngle = value;
            this._endSnapAngle = 90 - value;
        },
        get: function get() {
            return this._snapAngle;
        }
    }]);

    return TransformTool;
}(PIXI.utils.EventEmitter);

},{"../utils/lambda":309,"./../utils/Calculator":305,"./../utils/Mouse":306,"./../utils/PointUtil":308,"./../view/VectorContainer":310,"./RotationControlType":301,"./ToolControl":302,"./ToolControlType":303}],305:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Calc = exports.Calc = function () {
    Calc.toRadians = function toRadians(degree) {
        return degree * Calc.DEG_TO_RAD;
    };

    Calc.toDegrees = function toDegrees(radians) {
        return radians * Calc.RAD_TO_DEG;
    };

    Calc.getRotation = function getRotation(centerPoint, mousePoint) {
        var dx = mousePoint.x - centerPoint.x;
        var dy = mousePoint.y - centerPoint.y;
        var radians = Math.atan2(dy, dx);
        return Calc.toDegrees(radians);
    };

    Calc.deltaTransformPoint = function deltaTransformPoint(matrix, point) {
        var dx = point.x * matrix.a + point.y * matrix.c + 0;
        var dy = point.x * matrix.b + point.y * matrix.d + 0;
        return { x: dx, y: dy };
    };

    Calc.getSkewX = function getSkewX(matrix) {
        var px = Calc.deltaTransformPoint(matrix, { x: 0, y: 1 });
        return 180 / Math.PI * Math.atan2(px.y, px.x) - 90;
    };

    Calc.getSkewY = function getSkewY(matrix) {
        var py = Calc.deltaTransformPoint(matrix, { x: 1, y: 0 });
        return 180 / Math.PI * Math.atan2(py.y, py.x);
    };

    Calc.snapTo = function snapTo(num, snap) {
        return Math.round(num / snap) * snap;
    };

    //////////////////////////////////////////////////////////////////////////
    // Utils
    //////////////////////////////////////////////////////////////////////////


    Calc.digit = function digit(convertNumber) {
        var digitNumber = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

        if (digitNumber === 0) digitNumber = 1;

        var pow = Math.pow(10, digitNumber);
        return parseInt(convertNumber * pow) / pow;
    };

    Calc.leadingZero = function leadingZero(number) {
        var digits = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

        var zero = '';
        number = number.toString();

        if (number.length < digits) {
            for (var i = 0; i < digits - number.length; i++) {
                zero += '0';
            }
        }
        return zero + number;
    };

    Calc.trace = function trace(number) {
        return Calc.leadingZero(parseInt(number));
    };

    _createClass(Calc, null, [{
        key: 'DEG_TO_RAD',
        get: function get() {
            if (!this._DEG_TO_RAD) this._DEG_TO_RAD = Math.PI / 180;
            return this._DEG_TO_RAD;
        }
    }, {
        key: 'RAD_TO_DEG',
        get: function get() {
            if (!this._RAD_TO_DEG) this._RAD_TO_DEG = 180 / Math.PI;
            return this._RAD_TO_DEG;
        }
    }]);

    function Calc() {
        _classCallCheck(this, Calc);
    }

    return Calc;
}();

},{}],306:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mouse = function () {
    function Mouse() {
        _classCallCheck(this, Mouse);
    }

    /**
     * 이동 거리가 5px 이하이고 500ms 안에 두번 클릭하면 더블 클릭으로 인정
     * @param prevPoint 이전좌표
     * @param currentPoint 현재좌표
     * @param prevTime 이전 클릭 타임
     * @param currentTime 현재 클릭 타임
     * @returns {boolean} 더블 클릭 여부
     */
    Mouse.isDoubleClick = function isDoubleClick(prevPoint, currentPoint, prevTime, currentTime) {
        var diffX = currentPoint.x - prevPoint.x;

        if (diffX < 0) {
            diffX = diffX * -1;
        }

        var diffY = currentPoint.y - prevPoint.y;

        if (diffY < 0) {
            diffY = diffY * -1;
        }

        if (diffX > 5 || diffY > 5) {
            return false;
        }

        if (currentTime - prevTime > 500) {
            return false;
        }

        return true;
    };

    _createClass(Mouse, null, [{
        key: "DESKTOP_MOUSE",
        get: function get() {
            return this.renderer.plugins.interaction.mouse;
        }
    }, {
        key: "MOBILE_MOUSE",
        get: function get() {
            return this.renderer.plugins.interaction.pointer;
        }

        /**
         * PIXI.Application.renderer
         * 랜더러에서 interaction 객체를 참조할 수 있어서 사용하려면 렌더러를 셋팅해야 합니다.
         * @param value {PIXI.WebGLRenderrer|PIXI.CanvasRenderer}
         */

    }, {
        key: "renderer",
        set: function set(value) {
            this._renderer = value;
        },
        get: function get() {
            return this._renderer;
        }

        /**
         * 모바일 대응을 위해서
         * PC 버전에서는 mouse 객체를, 모바일 버전에서는 pointer 객체를 셋팅하면
         * global 객체에서 참조해서 좌표값을 전달하도록 합니다.
         *
         * 만약 설정하지 않으면 기본 PC만 대응하도록 mouse 객체를 설정합니다.
         *
         * Desktop : Mouse.renderer.plugins.interaction.mouse
         * Mobile : Mouse.renderer.plugins.interaction.pointer
         * @param value
         */

    }, {
        key: "mouse",
        set: function set(value) {
            this._mouse = value;
        },
        get: function get() {
            if (!this._mouse) {
                this._mouse = this.DESKTOP_MOUSE;
            }
            return this._mouse;
        }
    }, {
        key: "global",
        get: function get() {
            return this.mouse.global;
        }
    }, {
        key: "globalX",
        get: function get() {
            return this.mouse.global.x;
        }
    }, {
        key: "globalY",
        get: function get() {
            return this.mouse.global.y;
        }
    }, {
        key: "currentCursorStyle",
        set: function set(value) {
            Mouse.renderer.plugins.interaction.currentCursorStyle = value;
        },
        get: function get() {
            return Mouse.renderer.plugins.interaction.currentCursorStyle;
        }
    }, {
        key: "currentTime",
        get: function get() {
            return new Date().getTime();
        }
    }]);

    return Mouse;
}();

exports.default = Mouse;

},{}],307:[function(require,module,exports){
"use strict";

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Painter = exports.Painter = function () {
    function Painter() {
        _classCallCheck(this, Painter);
    }

    Painter.getRect = function getRect() {
        var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 4;
        var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0xFF3300;
        var alpha = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

        var half = size / 2;
        var rect = new PIXI.Graphics();
        rect.beginFill(color, alpha);
        rect.drawRect(-half, -half, size, size);
        rect.endFill();
        return rect;
    };

    Painter.getCircle = function getCircle() {
        var radius = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2;
        var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0xFF3300;
        var alpha = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

        var cicle = new PIXI.Graphics();
        cicle.beginFill(color, alpha);
        cicle.drawCircle(0, 0, radius);
        cicle.endFill();
        return cicle;
    };

    Painter.drawBounds = function drawBounds(graphics, bounds) {
        var initClear = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
        var thickness = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
        var color = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0xFF3300;
        var alpha = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0.7;

        if (initClear) graphics.clear();

        graphics.lineStyle(thickness, color, alpha);
        graphics.drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
        graphics.endFill();
    };

    Painter.drawPoints = function drawPoints(graphics, points) {
        var initClear = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
        var thickness = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
        var color = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0xFF3300;
        var alpha = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0.7;

        if (initClear) graphics.clear();

        var lt = points.lt;
        var rt = points.rt;
        var rb = points.rb;
        var lb = points.lb;

        graphics.lineStyle(thickness, color, alpha);
        graphics.moveTo(lt.x, lt.y);
        graphics.lineTo(rt.x, rt.y);
        graphics.lineTo(rb.x, rb.y);
        graphics.lineTo(lb.x, lb.y);
        graphics.lineTo(lt.x, lt.y);
        graphics.endFill();
    };

    Painter.drawCircle = function drawCircle(graphics, point) {
        var radius = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 5;
        var color = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0xFF3300;
        var alpha = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0.7;
        var initClear = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

        if (initClear) graphics.clear();

        graphics.beginFill(color, alpha);
        graphics.drawCircle(point.x, point.y, radius);
        graphics.endFill();
    };

    Painter.drawGrid = function drawGrid(graphics, width, height) {
        var lightLineAlpha = 0.1;
        var heavyLineAlpha = 0.3;

        for (var x = 0.5; x < width; x += 10) {
            if ((x - 0.5) % 50 === 0) graphics.lineStyle(1, 0x999999, heavyLineAlpha);else graphics.lineStyle(1, 0xdddddd, lightLineAlpha);

            graphics.moveTo(x, 0);
            graphics.lineTo(x, height);
        }

        for (var y = 0.5; y < height; y += 10) {
            if ((y - 0.5) % 50 === 0) graphics.lineStyle(1, 0x999999, heavyLineAlpha);else graphics.lineStyle(1, 0xdddddd, lightLineAlpha);

            graphics.moveTo(0, y);
            graphics.lineTo(width, y);
        }

        graphics.endFill();
    };

    Painter.drawDistToSegment = function drawDistToSegment(graphics, point, lineA, lineB, distancePoint) {
        // 1. 라인 그리기
        // 2. distancePoint -> point 연결하기
        // 3. distancePoint -> returnPoint 연결하기

        var radius = 3;
        var lineAlpha = 0.1;
        var shapeAlpha = 0.2;

        // 1
        graphics.beginFill(0x00CC33, shapeAlpha);
        graphics.lineStyle(1, 0x009933, lineAlpha);
        graphics.moveTo(lineA.x, lineA.y);
        graphics.lineTo(lineB.x, lineB.y);
        graphics.drawCircle(lineA.x, lineA.y, radius);
        graphics.drawCircle(lineB.x, lineB.y, radius);

        // 2
        /*graphics.beginFill(0xCCCCFF, shapeAlpha);
         graphics.lineStyle(1, 0x660099, 0.1);
         graphics.moveTo(distancePoint.x, distancePoint.y);
         graphics.lineTo(point.x, point.y);
         graphics.drawCircle(point.x, point.y, radius);
         graphics.beginFill(0xFF3300, 0.4);
         graphics.drawCircle(distancePoint.x, distancePoint.y, radius);*/

        // 3
        graphics.beginFill(0xFFCCFF, shapeAlpha);
        graphics.lineStyle(1, 0xCC99CC, lineAlpha);
        graphics.moveTo(point.x, point.y);
        graphics.lineTo(point.x, distancePoint.y);
        graphics.lineTo(distancePoint.x, distancePoint.y);
        graphics.drawCircle(point.x, point.y, radius);
        graphics.drawCircle(distancePoint.x, distancePoint.y, radius);

        graphics.endFill();
    };

    Painter.drawLine = function drawLine(graphics, p1, p2) {
        var thickness = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
        var color = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0xFF3300;
        var alpha = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;

        //graphics.beginFill(color, alpha);
        graphics.lineStyle(thickness, color, alpha);
        graphics.moveTo(p1.x, p1.y);
        graphics.lineTo(p2.x, p2.y);
        //graphics.endFill();
    };

    Painter.drawTriagle = function drawTriagle(graphics, p0, p1, p2) {
        var thickness = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
        var color = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0xFF3300;
        var alpha = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 1;
        var isFill = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : false;

        if (isFill) graphics.beginFill(color, alpha);

        graphics.lineStyle(thickness, color, alpha);
        graphics.moveTo(p0.x, p0.y);
        graphics.lineTo(p1.x, p1.y);
        graphics.lineTo(p2.x, p2.y);
        graphics.lineTo(p0.x, p0.y);

        if (isFill) graphics.endFill();
    };

    Painter.getText = function getText(str) {
        var textColor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0xFFFFFF;
        var backgroundColor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0xFFFFFF;

        var container = new PIXI.Sprite();

        var text = new PIXI.Text(str, { fontSize: 14, fill: textColor });
        text.x = -text.width / 2;
        text.y = -text.height / 2;

        var bg = new PIXI.Graphics();
        bg.beginFill(backgroundColor);
        bg.drawRect(text.x, text.y, text.width, text.height);
        bg.endFill();

        container.addChild(bg);
        container.addChild(text);

        return container;
    };

    return Painter;
}();

},{}],308:[function(require,module,exports){
"use strict";

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PointUtil = exports.PointUtil = function () {
    function PointUtil() {
        _classCallCheck(this, PointUtil);
    }

    PointUtil.add = function add(point1, point2) {
        return new PIXI.Point(point1.x + point2.x, point1.y + point2.y);
    };

    PointUtil.subtract = function subtract(point1, point2) {
        return new PIXI.Point(point1.x - point2.x, point1.y - point2.y);
    };

    PointUtil.distance = function distance(point1, point2) {
        return Math.sqrt((point1.x - point2.x) * (point1.x - point2.x) + (point1.y - point2.y) * (point1.y - point2.y));
    };

    /**
     * interpolate 보간법에 addLength 만큼의 거리를 더한 값을 반환합니다.
     * @param point1
     * @param point2
     * @param addLength
     * @returns {PIXI.Point|*}
     */


    PointUtil.getAddedInterpolate = function getAddedInterpolate(point1, point2, addLength) {
        var distance = PointUtil.distance(point1, point2);
        var f = (distance + addLength) / distance;
        return PointUtil.interpolate(point1, point2, f);
    };

    /**
     * factor에 의해 point1과 point2를 잇는 선분의 한점을 반환합니다.
     * @param point1
     * @param point2
     * @param f 0이면 point2값이 1이면 point1값이 나옵니다. 1.5이면 두점을 지나 1.5배 먼 거리값이 나옵니다.
     * @returns {PIXI.Point|*}
     */


    PointUtil.interpolate = function interpolate(point1, point2, f) {
        return new PIXI.Point(point2.x + f * (point1.x - point2.x), point2.y + f * (point1.y - point2.y));
    };

    return PointUtil;
}();

},{}],309:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports.each = each;
exports.every = every;
exports.map = map;
exports.filter = filter;
exports.reduce = reduce;
exports.indexOf = indexOf;


/**
 * array일 경우 array.forEach, 
 * Object일 경우 for..in 문을 이용 iterator callback을 실행
 * iterator 반환값이 true일 경우 for loop를 빠져나온다. 
 * @param  {[type]} collection [description]
 * @param  {[type]} iterator   [description]
 * @return {[type]}            [description]
 */
function each(collection, iterator) {

	if (collection instanceof Array) {

		collection.forEach(iterator);
	} else {

		for (var s in collection) {

			if (iterator(collection[s], s, collection)) break;
		}
	}
}

/**
 * array.every
 * @param  {[type]} collection [description]
 * @param  {[type]} iterator   [description]
 * @return {[type]}            [description]
 */
function every(collection, iterator) {

	if (collection instanceof Array) return collection.every(iterator);

	for (var s in collection) {

		if (!iterator(collection[s], s, collection)) return false;
	}

	return true;
}

/**
 * Array.map
 * @param  {[type]} collection [description]
 * @param  {[type]} iterator   [description]
 * @return {[type]}            [description]
 */
function map(collection, iterator) {

	var o = void 0;

	if (collection instanceof Array) {

		return collection.map(iterator);
	} else {

		o = {};

		each(collection, function (e, key, collection) {

			o[key] = iterator(e, key, collection);
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
function filter(collection, iterator) {

	if (collection instanceof Array) {

		return collection.filter(iterator);
	} else {
		(function () {

			var o = {};

			each(collection, function (e, key, collection) {

				if (iterator(e, key, collection0)) {
					o[key] = e;
				}
			});
		})();
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
function reduce(collection, iterator) {
	var initValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;


	if (collection instanceof Array) {

		return collection.reduce(iterator, initValue);
	}

	var i = initValue;

	each(collection, function (n, key) {

		i = iterator(n, i, key);
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
function indexOf(collection, element) {

	if (collection instanceof Array) {
		return collection.indexOf(element);
	}

	var name = null;

	each(collection, function (e, key) {

		if (e == element) {

			name = key;

			return true;
		}
	});

	return name;
}

},{}],310:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.VectorContainer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Config = require('./../config/Config');

var _Config2 = _interopRequireDefault(_Config);

var _Calculator = require('./../utils/Calculator');

var _TransformTool = require('./../transform/TransformTool');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VectorContainer = exports.VectorContainer = function (_PIXI$Container) {
    _inherits(VectorContainer, _PIXI$Container);

    _createClass(VectorContainer, null, [{
        key: 'MAX_WIDTH',


        /**
         * VectorContainer 최대 넓이와 높이
         * 캔버스 최대 사이즈가 IE Mobile 에서는 4,096 픽셀이며 IE 에서는 8,192 픽셀입니다.
         */
        get: function get() {
            return 4000;
        }
    }, {
        key: 'MAX_HEIGHT',
        get: function get() {
            return 4000;
        }

        /**
         * Vector가 처음 로드 되었을 때 이벤트
         * @returns {string}
         * @constructor
         */

    }, {
        key: 'LOAD_COMPLETE',
        get: function get() {
            return 'drawComplete';
        }

        /**
         * 처음 이후 업데이트 되었을 때 이벤트
         * @returns {string}
         * @constructor
         */

    }, {
        key: 'TEXTURE_UPDATE',
        get: function get() {
            return 'textureUpdate';
        }
    }]);

    function VectorContainer() {
        _classCallCheck(this, VectorContainer);

        var _this = _possibleConstructorReturn(this, _PIXI$Container.call(this));

        _this.initialize();
        _this.addEvent();
        return _this;
    }

    VectorContainer.prototype.initialize = function initialize() {
        this.image = null;
        this.scaleSignX = 1;
        this.scaleSignY = 1;
        this.interactive = true;
        this.isFirstLoad = true;
        this.renderableObject = true;

        this.canvgCanvas = document.createElement('canvas');
        this.canvgCanvas.id = 'canvgCanvas';
        this.canvgContext = this.canvgCanvas.getContext('2d');

        this.setpixelated(this.canvgContext);
    };

    VectorContainer.prototype.setpixelated = function setpixelated(context) {
        context['imageSmoothingEnabled'] = false;
        /* standard */
        context['mozImageSmoothingEnabled'] = false;
        /* Firefox */
        context['oImageSmoothingEnabled'] = false;
        /* Opera */
        context['webkitImageSmoothingEnabled'] = false;
        /* Safari */
        context['msImageSmoothingEnabled'] = false;
        /* IE */
    };

    VectorContainer.prototype.addEvent = function addEvent() {
        this.drawCompleteListener = this.onDrawComplete.bind(this);
        this.transformCompleteListener = this.onTransformComplete.bind(this);
        this.on(_TransformTool.TransformTool.TRANSFORM_COMPLETE, this.transformCompleteListener);
    };

    VectorContainer.prototype.removeEvent = function removeEvent() {
        this.off(_TransformTool.TransformTool.TRANSFORM_COMPLETE, this.transformCompleteListener);
        this.drawCompleteListener = null;
        this.transformCompleteListener = null;
    };

    VectorContainer.prototype.load = function load(url) {
        var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var width = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 100;
        var height = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 100;

        this.url = url;
        this.originW = width;
        this.originH = height;
        this.drawSvg(x, y, width, height);
    };

    VectorContainer.prototype.setSVG = function setSVG(dom) {
        var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var width = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 100;
        var height = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 100;

        this.svg = dom;
        this.originW = width;
        this.originH = height;
        this.drawSvg(x, y, width, height);
    };

    VectorContainer.prototype.setPivot = function setPivot(localPoint) {
        this.pivot = localPoint;
    };

    VectorContainer.prototype.drawSvg = function drawSvg(x, y, width, height) {
        var _this2 = this;

        this.drawX = x;
        this.drawY = y;
        this.drawWidth = width;
        this.drawHeight = height;

        var signX = width < 0 ? -1 : 1;
        var signY = height < 0 ? -1 : 1;
        this.scaleSignX = this.scaleSignX * signX;
        this.scaleSignY = this.scaleSignY * signY;
        width = Math.abs(width);
        height = Math.abs(height);
        width = width > VectorContainer.MAX_WIDTH ? VectorContainer.MAX_WIDTH : width;
        height = height > VectorContainer.MAX_HEIGHT ? VectorContainer.MAX_HEIGHT : height;
        this.canvgCanvas.width = width;
        this.canvgCanvas.height = height;
        this.canvgContext.drawSvg(this.url || this.svg, x, y, width, height, {
            renderCallback: function renderCallback() {
                /**
                 * ####################### 매우 중요 #######################
                 * 여기서 약간의 Delay 를 주지 않으면 WebGL 에서는 텍스쳐가 안보입니다.
                 * #######################################################
                 */
                setTimeout(_this2.drawCompleteListener.call(_this2), 1);
            }
        });
        // this.canvgContext.drawSvg(this.url || this.svg, x, y, width, height);
        //
        // if(this.image === null) {
        //     this.image = new PIXI.Sprite(new PIXI.Texture.fromCanvas(this.canvgCanvas));
        //     this.image.renderableObject = true;
        //     this.addChild(this.image);
        //     this.emit(VectorContainer.LOAD_COMPLETE, {target: this});
        // }
    };

    VectorContainer.prototype.delete = function _delete() {
        this.removeEvent();
        this.interactive = false;

        if (this.image !== null) {
            this.image.texture.destroy();
            this.image.texture = null;
            this.removeChild(this.image);
            this.image.renderableObject = false;
            this.image.destroy();
            this.image = null;
        }

        this.destroy();
        if (this.svg && this.svg.parentNode) {
            this.svg.parentNode.removeChild(this.svg);
        }
        this.svg = null;
        this.canvgCanvas.svg = null;
        this.canvgCanvas = null;
        this.canvgContext = null;
        this.drawCompleteListener = null;
        this.transformCompleteListener = null;
    };

    VectorContainer.prototype.checkAlphaPoint = function checkAlphaPoint(globalMPoint) {
        var point = this.worldTransform.applyInverse(globalMPoint);
        var data = this.canvgContext.getImageData(point.x, point.y, 1, 1);

        if (data.data[3] == 0) {
            return true;
        }
        return false;
    };

    VectorContainer.prototype.onTransformComplete = function onTransformComplete(e) {
        this.drawSvg(0, 0, this.width, this.height);
    };

    VectorContainer.prototype.onDrawComplete = function onDrawComplete() {
        if (this.isFirstLoad === true) {
            this.isFirstLoad = false;
            this.image = new PIXI.Sprite(new PIXI.Texture.fromCanvas(this.canvgCanvas));
            this.image.renderableObject = true;
            this.addChild(this.image);
            this.emit(VectorContainer.LOAD_COMPLETE, { target: this });
        } else {
            this.scale = { x: 1, y: 1 };
            this.image.scale = { x: this.scaleSignX, y: this.scaleSignY };
            this.image.texture.update();
            this.image.updateTransform();
            this.emit(VectorContainer.TEXTURE_UPDATE, {
                target: this,
                scaleSignX: this.scaleSignX,
                scaleSignY: this.scaleSignY
            });
        }
    };

    //     this.scale = {x: 1, y: 1};
    //     this.image.scale = {x: this.scaleSignX, y: this.scaleSignY};
    //     this.image.texture.update();
    //     this.image.updateTransform();
    //     this.emit(VectorContainer.TEXTURE_UPDATE, {
    //         target: this,
    //         scaleSignX: this.scaleSignX,
    //         scaleSignY: this.scaleSignY
    //     });
    // }


    VectorContainer.prototype.toString = function toString() {
        console.log('');
        var localBounds = this.getLocalBounds();
        var imageLocalBounds = this.image.getLocalBounds();
        console.log('wh[' + _Calculator.Calc.digit(this.width) + ', ' + _Calculator.Calc.digit(this.height) + '], localBounds[' + localBounds.width + ', ' + localBounds.height + ']');
        console.log('image wh[' + _Calculator.Calc.digit(this.image.width), ', ' + _Calculator.Calc.digit(this.image.height) + '], localBounds[' + imageLocalBounds.width + ', ' + imageLocalBounds.height + ']');
    };

    _createClass(VectorContainer, [{
        key: 'ID',
        get: function get() {
            return this._id;
        },
        set: function set(id) {
            this._id = id;
        }
    }, {
        key: 'scaleForOrigin',
        get: function get() {
            return { x: this.width / this.originW, y: this.height / this.originH };
        }
    }, {
        key: 'snapshot',
        get: function get() {
            return {
                url: this.url, svg: this.svg,
                x: this.drawX, y: this.drawY, width: this.drawWidth, height: this.drawHeight,
                transform: {
                    x: this.x,
                    y: this.y,
                    scaleX: this.scale.x,
                    scaleY: this.scale.y,
                    rotation: this.rotation,
                    childIndex: this.parent.getChildIndex(this)
                }
            };
        }
    }]);

    return VectorContainer;
}(PIXI.Container);

},{"./../config/Config":299,"./../transform/TransformTool":304,"./../utils/Calculator":305}]},{},[298]);
