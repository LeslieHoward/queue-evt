(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.evt = {}));
}(this, (function (exports) { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var utils = {
    type: function type(o) {
      return Object.prototype.toString.call(o).slice(8, -1).toLowerCase();
    },
    isNull: function isNull(o) {
      var item;

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

  var FnQueue = /*#__PURE__*/function () {
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
      key: "add",
      value: function add(fns) {
        var _this = this;

        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var _Object$assign = Object.assign(this.options, options),
            token = _Object$assign.token;

        switch (utils.type(fns)) {
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
      key: "skip",
      value: function skip(step) {
        step = utils.isNull(step) ? 1 : +step;

        while (step--) {
          this.queue.shift();
        }

        return this;
      }
    }, {
      key: "next",
      value: function next() {
        var autoExcute = this.options.autoExcute;

        if (utils.notNull(this.queue)) {
          // 取出队列第一个元素
          var fn = this.queue.shift(); // 游标+1

          this.cursor++; // 开始执行

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          fn.apply(null, args); // 执行之后添加到队列尾部

          this.queue.push(fn);

          if (this.cursor < this.queue.length && autoExcute) {
            this.next.apply(this, args);
          } else {
            this.cursor = 0;
          }
        }
      }
    }, {
      key: "fire",
      value: function fire() {
        this.cursor = 0;
        return this.next.apply(this, arguments);
      }
    }, {
      key: "clear",
      value: function clear() {
        this.queue = [];
        return this;
      }
    }, {
      key: "remove",
      value: function remove(ids) {
        var type = utils.type(ids);

        if (!/function|string|array|undefined/.test(type)) {
          return false;
        } // 移除订阅内容


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


  var Signal = /*#__PURE__*/function () {
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
    } // 添加到目标列表


    _createClass(Signal, [{
      key: "add",
      value: function add(queue) {
        var fns = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        var options = arguments.length > 2 ? arguments[2] : undefined;
        queue = queue && queue.add ? queue : new FnQueue();
        queue.add(fns, options);
        return queue;
      } // 添加订阅

    }, {
      key: "on",
      value: function on() {
        var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var fns = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        // 判断参数类型
        if (!/function|array/.test(utils.type(fns))) {
          return this;
        }

        if (!this.stack[id]) {
          this.stack[id] = {};
        } // 生成队列


        this.stack[id].queue = this.add(this.stack[id].queue, fns, _objectSpread2(_objectSpread2({}, this.options), options)); // 如果当前订阅的事件存在于缓存，则取出缓存中存放的信息

        if (this.cache[id]) {
          var _this$stack$id$queue;

          (_this$stack$id$queue = this.stack[id].queue).fire.apply(_this$stack$id$queue, _toConsumableArray(this.cache[id].params)); // 清空对应缓存


          this.cache[id] = null;
        }

        return this;
      } // 发布事件

    }, {
      key: "emit",
      value: function emit(id) {
        for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }

        // 1：事件存在则执行
        if (this.stack[id]) {
          var _this$stack$id$queue2;

          (_this$stack$id$queue2 = this.stack[id].queue).fire.apply(_this$stack$id$queue2, args);
        } else {
          // 2：事件不存在则放入缓存列表
          this.cache[id] = {
            params: args
          };
        }

        return this;
      } // 移除订阅

    }, {
      key: "remove",
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

  Object.defineProperty(exports, '__esModule', { value: true });

})));
