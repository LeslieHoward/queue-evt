(function e(t, n) {
  if (typeof exports === "object" && typeof module === "object") module.exports = n(); else if (typeof define === "function" && define.amd) define([], n); else if (typeof exports === "object") exports["evt"] = n(); else t["evt"] = n();
})(window, function() {
  return function(e) {
    var t = {};
    function n(r) {
      if (t[r]) {
        return t[r].exports;
      }
      var i = t[r] = {
        i: r,
        l: false,
        exports: {}
      };
      e[r].call(i.exports, i, i.exports, n);
      i.l = true;
      return i.exports;
    }
    n.m = e;
    n.c = t;
    n.d = function(e, t, r) {
      if (!n.o(e, t)) {
        Object.defineProperty(e, t, {
          enumerable: true,
          get: r
        });
      }
    };
    n.r = function(e) {
      if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
        Object.defineProperty(e, Symbol.toStringTag, {
          value: "Module"
        });
      }
      Object.defineProperty(e, "__esModule", {
        value: true
      });
    };
    n.t = function(e, t) {
      if (t & 1) e = n(e);
      if (t & 8) return e;
      if (t & 4 && typeof e === "object" && e && e.__esModule) return e;
      var r = Object.create(null);
      n.r(r);
      Object.defineProperty(r, "default", {
        enumerable: true,
        value: e
      });
      if (t & 2 && typeof e != "string") for (var i in e) n.d(r, i, function(t) {
        return e[t];
      }.bind(null, i));
      return r;
    };
    n.n = function(e) {
      var t = e && e.__esModule ? function t() {
        return e["default"];
      } : function t() {
        return e;
      };
      n.d(t, "a", t);
      return t;
    };
    n.o = function(e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    };
    n.p = "/dist/";
    return n(n.s = 4);
  }([ function(e, t) {
    function n(e, t) {
      if (!(e instanceof t)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    e.exports = n;
  }, function(e, t) {
    function n(e, t) {
      for (var n = 0; n < t.length; n++) {
        var r = t[n];
        r.enumerable = r.enumerable || false;
        r.configurable = true;
        if ("value" in r) r.writable = true;
        Object.defineProperty(e, r.key, r);
      }
    }
    function r(e, t, r) {
      if (t) n(e.prototype, t);
      if (r) n(e, r);
      return e;
    }
    e.exports = r;
  }, function(e, t, n) {
    var r = n(5);
    var i = n(6);
    var u = n(7);
    function o(e) {
      return r(e) || i(e) || u();
    }
    e.exports = o;
  }, function(e, t, n) {
    var r = n(8);
    function i(e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = arguments[t] != null ? arguments[t] : {};
        var i = Object.keys(n);
        if (typeof Object.getOwnPropertySymbols === "function") {
          i = i.concat(Object.getOwnPropertySymbols(n).filter(function(e) {
            return Object.getOwnPropertyDescriptor(n, e).enumerable;
          }));
        }
        i.forEach(function(t) {
          r(e, t, n[t]);
        });
      }
      return e;
    }
    e.exports = i;
  }, function(e, t, n) {
    e.exports = n(9);
  }, function(e, t) {
    function n(e) {
      if (Array.isArray(e)) {
        for (var t = 0, n = new Array(e.length); t < e.length; t++) {
          n[t] = e[t];
        }
        return n;
      }
    }
    e.exports = n;
  }, function(e, t) {
    function n(e) {
      if (Symbol.iterator in Object(e) || Object.prototype.toString.call(e) === "[object Arguments]") return Array.from(e);
    }
    e.exports = n;
  }, function(e, t) {
    function n() {
      throw new TypeError("Invalid attempt to spread non-iterable instance");
    }
    e.exports = n;
  }, function(e, t) {
    function n(e, t, n) {
      if (t in e) {
        Object.defineProperty(e, t, {
          value: n,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        e[t] = n;
      }
      return e;
    }
    e.exports = n;
  }, function(e, t, n) {
    "use strict";
    n.r(t);
    var r = n(2);
    var i = n.n(r);
    var u = n(3);
    var o = n.n(u);
    var s = n(0);
    var a = n.n(s);
    var f = n(1);
    var c = n.n(f);
    var l = {
      type: function e(t) {
        return Object.prototype.toString.call(t).slice(8, -1).toLowerCase();
      },
      isNull: function e(t) {
        var n;
        for (n in t) {
          return false;
        }
        return true;
      },
      notNull: function e(t) {
        return !l.isNull(t);
      },
      isArray: function e(t) {
        return l.type(t) === "array";
      },
      isFunction: function e(t) {
        return l.type(t) === "function";
      },
      uuid: function e() {
        var t = new Date().getTime();
        var e = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(e) {
          var n = (t + Math.random() * 16) % 16 | 0;
          t = Math.floor(t / 16);
          return (e == "x" ? n : n & 3 | 8).toString(16);
        });
        return e;
      }
    };
    var h = l;
    n.d(t, "FnQueue", function() {
      return d;
    });
    n.d(t, "Signal", function() {
      return p;
    });
    var d = function() {
      function e() {
        a()(this, e);
        this.options = {
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
      c()(e, [ {
        key: "add",
        value: function e(t) {
          var n = this;
          var r = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          var i = Object.assign(this.options, r), u = i.token;
          switch (h.type(t)) {
           case "function":
            t.token = u;
            this.queue.push(t);
            break;

           case "array":
            t.map(function(e) {
              n.add(e);
            });
            break;

           default:
            return;
          }
          return this;
        }
      }, {
        key: "skip",
        value: function e(t) {
          t = h.isNull(t) ? 1 : +t;
          while (t--) {
            this.queue.shift();
          }
          return this;
        }
      }, {
        key: "next",
        value: function e() {
          var t = this.options.autoExcute;
          if (h.notNull(this.queue)) {
            var n = this.queue.shift();
            this.cursor++;
            for (var r = arguments.length, i = new Array(r), u = 0; u < r; u++) {
              i[u] = arguments[u];
            }
            n.apply(null, i);
            this.queue.push(n);
            if (this.cursor < this.queue.length && t) {
              this.next.apply(this, i);
            } else {
              this.cursor = 0;
            }
          }
        }
      }, {
        key: "fire",
        value: function e() {
          this.cursor = 0;
          return this.next.apply(this, arguments);
        }
      }, {
        key: "clear",
        value: function e() {
          this.queue = [];
          return this;
        }
      }, {
        key: "remove",
        value: function e(t) {
          var n = h.type(t);
          if (!/function|string|array|undefined/.test(n)) {
            return false;
          }
          switch (n) {
           case "undefined":
            {
              this.queue = [];
              break;
            }

           case "array":
            {
              this.queue = this.queue.filter(function(e) {
                return !t.includes(e) && !t.includes(e.name) && !t.includes(e.token);
              });
              break;
            }

           case "function":
            {
              this.queue = this.queue.filter(function(e) {
                return t !== e;
              });
              break;
            }

           case "string":
            {
              this.queue = this.queue.filter(function(e) {
                return t !== e.name && t !== e.token;
              });
              break;
            }
          }
          return this;
        }
      } ]);
      return e;
    }();
    var p = function() {
      function e(t) {
        a()(this, e);
        this.options = {
          autoExcute: true
        };
        this.stack = {};
        this.cache = {};
        this.add = this.add.bind(this);
        this.on = this.on.bind(this);
        this.emit = this.emit.bind(this);
        this.remove = this.remove.bind(this);
      }
      c()(e, [ {
        key: "add",
        value: function e(t) {
          var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
          var r = arguments.length > 2 ? arguments[2] : undefined;
          t = t && t.add ? t : new d();
          t.add(n, r);
          return t;
        }
      }, {
        key: "on",
        value: function e() {
          var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
          var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
          var r = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
          if (!/function|array/.test(h.type(n))) {
            return this;
          }
          if (!this.stack[t]) {
            this.stack[t] = {};
          }
          this.stack[t].queue = this.add(this.stack[t].queue, n, o()({}, this.options, r));
          if (this.cache[t]) {
            var u;
            (u = this.stack[t].queue).fire.apply(u, i()(this.cache[t].params));
            this.cache[t] = {};
          }
          return this;
        }
      }, {
        key: "emit",
        value: function e(t) {
          for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), i = 1; i < n; i++) {
            r[i - 1] = arguments[i];
          }
          if (this.stack[t]) {
            var u;
            (u = this.stack[t].queue).fire.apply(u, r);
          } else {
            this.cache[t] = {
              params: r
            };
          }
          return this;
        }
      }, {
        key: "remove",
        value: function e(t, n) {
          if (this.stack[t]) {
            this.stack[t].queue.remove(n);
          }
          return this;
        }
      } ]);
      return e;
    }();
  } ]);
});