function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
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

var FnQueue =
/*#__PURE__*/
function () {
  function FnQueue() {
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

  var _proto = FnQueue.prototype;

  _proto.add = function add(fns, options) {
    var _this = this;

    if (options === void 0) {
      options = {};
    }

    var _Object$assign = _extends(this.options, options),
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
  };

  _proto.skip = function skip(step) {
    step = utils.isNull(step) ? 1 : +step;

    while (step--) {
      this.queue.shift();
    }

    return this;
  };

  _proto.next = function next() {
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
  };

  _proto.fire = function fire() {
    this.cursor = 0;
    return this.next.apply(this, arguments);
  };

  _proto.clear = function clear() {
    this.queue = [];
    return this;
  };

  _proto.remove = function remove(ids) {
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
  };

  return FnQueue;
}();
/* 发布订阅 */


var Signal =
/*#__PURE__*/
function () {
  function Signal(props) {
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


  var _proto2 = Signal.prototype;

  _proto2.add = function add(queue, fns, options) {
    if (fns === void 0) {
      fns = [];
    }

    queue = queue && queue.add ? queue : new FnQueue();
    queue.add(fns, options);
    return queue;
  } // 添加订阅
  ;

  _proto2.on = function on(id, fns, options) {
    if (id === void 0) {
      id = '';
    }

    if (fns === void 0) {
      fns = [];
    }

    if (options === void 0) {
      options = {};
    }

    // 判断参数类型
    if (!/function|array/.test(utils.type(fns))) {
      return this;
    }

    if (!this.stack[id]) {
      this.stack[id] = {};
    } // 生成队列


    this.stack[id].queue = this.add(this.stack[id].queue, fns, _extends({}, this.options, options)); // 如果当前订阅的事件存在于缓存，则取出缓存中存放的信息

    if (this.cache[id]) {
      var _this$stack$id$queue;

      (_this$stack$id$queue = this.stack[id].queue).fire.apply(_this$stack$id$queue, this.cache[id].params); // 清空对应缓存


      this.cache[id] = {};
    }

    return this;
  } // 发布事件
  ;

  _proto2.emit = function emit(id) {
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
  ;

  _proto2.remove = function remove(id, items) {
    if (this.stack[id]) {
      this.stack[id].queue.remove(items);
    }

    return this;
  };

  return Signal;
}();

export { FnQueue, Signal };
