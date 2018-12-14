import utils from './utils';

class FnQueue {
  constructor() {
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

  add(fns, options = {}) {
    let { token } = Object.assign(this.options, options);

    switch (utils.type(fns)) {
      case 'function':
        fns.token = token;
        this.queue.push(fns);
        break;
      case 'array':
        fns.map(fn => {
          this.add(fn);
        });
        break;
      default:
        return;
    }
    return this;
  }

  skip(step) {
    step = utils.isNull(step) ? 1 : +step;
    while (step--) {
      this.queue.shift();
    }
    return this;
  }

  next(...args) {
    const {
      options: { autoExcute }
    } = this;
    if (utils.notNull(this.queue)) {
      // 取出队列第一个元素
      const fn = this.queue.shift();
      // 游标+1
      this.cursor++;
      // 开始执行
      fn.apply(null, args);
      // 执行之后添加到队列尾部
      this.queue.push(fn);
      if (this.cursor < this.queue.length && autoExcute) {
        this.next(...args);
      } else {
        this.cursor = 0;
      }
    }
  }

  fire(...args) {
    this.cursor = 0;
    return this.next(...args);
  }

  clear() {
    this.queue = [];
    return this;
  }

  remove(ids) {
    const type = utils.type(ids);

    if (!/function|string|array|undefined/.test(type)) {
      return false;
    }

    // 移除订阅内容
    switch (type) {
      case 'undefined': {
        this.queue = [];
        break;
      }
      case 'array': {
        this.queue = this.queue.filter(fn => {
          return !ids.includes(fn) && !ids.includes(fn.name) && !ids.includes(fn.token);
        });
        break;
      }
      case 'function': {
        this.queue = this.queue.filter(fn => {
          return ids !== fn;
        });
        break;
      }
      case 'string': {
        this.queue = this.queue.filter(fn => {
          return ids !== fn.name && ids !== fn.token;
        });
        break;
      }
    }

    return this;
  }
}

/* 发布订阅 */
class Signal {
  constructor(props) {
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
  add(queue, fns = [], options) {
    queue = queue && queue.add ? queue : new FnQueue();
    queue.add(fns, options);
    return queue;
  }

  // 添加订阅
  on(id = '', fns = [], options = {}) {
    // 判断参数类型
    if (!/function|array/.test(utils.type(fns))) {
      return this;
    }

    if (!this.stack[id]) {
      this.stack[id] = {};
    }

    // 生成队列
    this.stack[id].queue = this.add(this.stack[id].queue, fns, { ...this.options, ...options });

    // 如果当前订阅的事件存在于缓存，则取出缓存中存放的信息
    if (this.cache[id]) {
      this.stack[id].queue.fire(...this.cache[id].params);
      // 清空对应缓存
      this.cache[id] = {};
    }

    return this;
  }

  // 发布事件
  emit(id, ...args) {
    // 1：事件存在则执行
    if (this.stack[id]) {
      this.stack[id].queue.fire(...args);
    } else {
      // 2：事件不存在则放入缓存列表
      this.cache[id] = {
        params: args
      };
    }

    return this;
  }

  // 移除订阅
  remove(id, items) {
    if (this.stack[id]) {
      this.stack[id].queue.remove(items);
    }
    return this;
  }
}

export { FnQueue, Signal };
