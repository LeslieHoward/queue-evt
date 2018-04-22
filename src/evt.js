const Utils = {
	type(o) {
		return Object.prototype.toString.call(o).slice(8, -1).toLowerCase();
	}
};

export class FnQueue {
	constructor(options) {
		this.queue = [];
		this.stack = [];
		this.add = this.add.bind(this);
		this.next = this.next.bind(this);
		this.skip = this.skip.bind(this);
		this.fire = this.fire.bind(this);
		this.clear = this.clear.bind(this);
	}

	add(fns) {
		switch (Utils.type(fns)) {
			case 'function':
				this.queue.push(fns);
				this.stack.push(fns);
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
		step = Number(step) || 1;
		while (step--) {
			this.queue.shift();
		}
		return this;
	}

	cycle() {
		this.queue = Object.assign([], this.stack);
		return this;
	}

	next() {
		Array.prototype.unshift.call(arguments, this);
		return this.queue.shift().apply(undefined, arguments);
	}

	fire() {
		return this.next(...arguments);
	}

	clear() {
		this.queue = this.stack = [];
		return this;
	}

	remove(ids) {
		const type = Utils.type(ids);

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
					return !ids.includes(fn) && !ids.includes(fn.name);
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
					return ids !== fn.name;
				});
				break;
			}
		}

		return this;
	}
}

export class Signal {
	constructor() {
		this.stack = {};
		this.cache = {};
		this.add = this.add.bind(this);
		this.on = this.on.bind(this);
		this.emit = this.emit.bind(this);
		this.remove = this.remove.bind(this);
	}

	// 添加到目标列表
	add(queue, fns) {
		queue = queue && queue.add ? queue : new FnQueue();
		queue.add(fns);
		return queue;
	}

	// 添加订阅
	on(id, fns) {
		// 判断参数类型
		if (!/function|array/.test(Utils.type(fns))) {
			return false;
		}

		if (!this.stack[id]) {
			this.stack[id] = {};
		}

		this.stack[id].queue = this.add(this.stack[id].queue, fns);

		// 如果当前订阅的事件存在于缓存，则取出缓存中存放的信息
		if (this.cache[id]) {
			this.stack[id].queue.fire(...this.cache[id].params);
			// 清空对应缓存
			this.cache[id] = {};
		}

		return this;
	}

	// 发布事件
	emit() {
		// 获取订阅名称
		const id = Array.prototype.shift.call(arguments);

		// 1：事件存在则执行
		if (this.stack[id]) {
			this.stack[id].queue.fire(...arguments);
		} else {
			// 2：事件不存在则放入缓存列表
			this.cache[id] = {
				params: arguments
			};
		}

		return this;
	}

	// 移除订阅
	remove(id, items) {
		if (!this.stack[id]) {
			return false;
		}
		this.stack[id].queue.remove(items);
		return this;
	}
}
