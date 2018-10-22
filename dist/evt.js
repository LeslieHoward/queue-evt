(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["evt"] = factory();
	else
		root["evt"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Signal = exports.FnQueue = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = __webpack_require__(2);

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FnQueue = function () {
  function FnQueue() {
    _classCallCheck(this, FnQueue);

    this.options = {
      // 是否自动执行
      autoExcute: false
    };
    this.queue = [];
    this.cursor = 0;
    this.add = this.add.bind(this);
    this.next = this.next.bind(this);
    this.skip = this.skip.bind(this);
    this.fire = this.fire.bind(this);
    this.clear = this.clear.bind(this);
  }

  _createClass(FnQueue, [{
    key: 'add',
    value: function add(fns) {
      var _this = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var _Object$assign = Object.assign(this.options, options),
          token = _Object$assign.token;

      switch (_utils2.default.type(fns)) {
        case 'function':
          fns.token = token;
          this.queue.push(fns);
          break;
        case 'array':
          fns.map(function (fn) {
            _this.add(fn);
          });
          break;
        default:
          return;
      }
      return this;
    }
  }, {
    key: 'skip',
    value: function skip(step) {
      step = _utils2.default.isNull(step) ? 1 : +step;
      while (step--) {
        this.queue.shift();
      }
      return this;
    }
  }, {
    key: 'next',
    value: function next() {
      var autoExcute = this.options.autoExcute;

      if (_utils2.default.notNull(this.queue)) {
        // 取出队列第一个元素
        var fn = this.queue.shift();
        // 游标+1
        this.cursor++;
        // 开始执行

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        fn.apply(null, args);
        // 执行之后添加到队列尾部
        this.queue.push(fn);
        if (this.cursor < this.queue.length && autoExcute) {
          this.next.apply(this, args);
        } else {
          this.cursor = 0;
        }
      }
    }
  }, {
    key: 'fire',
    value: function fire() {
      this.cursor = 0;
      return this.next.apply(this, arguments);
    }
  }, {
    key: 'clear',
    value: function clear() {
      this.queue = [];
      return this;
    }
  }, {
    key: 'remove',
    value: function remove(ids) {
      var type = _utils2.default.type(ids);

      if (!/function|string|array|undefined/.test(type)) {
        return false;
      }

      // 移除订阅内容
      switch (type) {
        case 'undefined':
          {
            this.queue = [];
            break;
          }
        case 'array':
          {
            this.queue = this.queue.filter(function (fn) {
              return !ids.includes(fn) && !ids.includes(fn.name) && !ids.includes(fn.token);
            });
            break;
            F;
          }
        case 'function':
          {
            this.queue = this.queue.filter(function (fn) {
              return ids !== fn;
            });
            break;
          }
        case 'string':
          {
            this.queue = this.queue.filter(function (fn) {
              return ids !== fn.name && ids !== fn.token;
            });
            break;
          }
      }

      return this;
    }
  }]);

  return FnQueue;
}();

/* 发布订阅 */


var Signal = function () {
  function Signal(props) {
    _classCallCheck(this, Signal);

    this.options = {
      // 是否自动执行
      autoExcute: true
    };
    this.stack = {};
    this.cache = {};
    this.add = this.add.bind(this);
    this.on = this.on.bind(this);
    this.emit = this.emit.bind(this);
    this.remove = this.remove.bind(this);
  }

  // 添加到目标列表


  _createClass(Signal, [{
    key: 'add',
    value: function add(queue) {
      var fns = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var options = arguments[2];

      queue = queue && queue.add ? queue : new FnQueue();
      queue.add(fns, options);
      return queue;
    }

    // 添加订阅

  }, {
    key: 'on',
    value: function on() {
      var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var fns = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      // 判断参数类型
      if (!/function|array/.test(_utils2.default.type(fns))) {
        return this;
      }

      if (!this.stack[id]) {
        this.stack[id] = {};
      }

      // 生成队列
      this.stack[id].queue = this.add(this.stack[id].queue, fns, _extends({}, this.options, options));

      // 如果当前订阅的事件存在于缓存，则取出缓存中存放的信息
      if (this.cache[id]) {
        var _stack$id$queue;

        (_stack$id$queue = this.stack[id].queue).fire.apply(_stack$id$queue, _toConsumableArray(this.cache[id].params));
        // 清空对应缓存
        this.cache[id] = {};
      }

      return this;
    }

    // 发布事件

  }, {
    key: 'emit',
    value: function emit(id) {
      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      // 1：事件存在则执行
      if (this.stack[id]) {
        var _stack$id$queue2;

        (_stack$id$queue2 = this.stack[id].queue).fire.apply(_stack$id$queue2, args);
      } else {
        // 2：事件不存在则放入缓存列表
        this.cache[id] = {
          params: args
        };
      }

      return this;
    }

    // 移除订阅

  }, {
    key: 'remove',
    value: function remove(id, items) {
      if (this.stack[id]) {
        this.stack[id].queue.remove(items);
      }
      return this;
    }
  }]);

  return Signal;
}();

exports.FnQueue = FnQueue;
exports.Signal = Signal;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var utils = {
  type: function type(o) {
    return Object.prototype.toString.call(o).slice(8, -1).toLowerCase();
  },

  isNull: function isNull(o) {
    var item = void 0;
    for (item in o) {
      return false;
    }
    return true;
  },

  notNull: function notNull(o) {
    return !utils.isNull(o);
  },

  isArray: function isArray(o) {
    return utils.type(o) === 'array';
  },

  isFunction: function isFunction(o) {
    return utils.type(o) === 'function';
  },

  uuid: function uuid() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
    });
    return uuid;
  }
};

exports.default = utils;
module.exports = exports.default;

/***/ })
/******/ ]);
});