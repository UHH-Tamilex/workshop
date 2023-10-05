var k = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function B(m) {
  return m && m.__esModule && Object.prototype.hasOwnProperty.call(m, "default") ? m.default : m;
}
var N = { exports: {} };
(function(m, A) {
  (function(w, C) {
    C(A);
  })(k, function(w) {
    const C = "0.5.7";
    function i(t, n) {
      t || (t = {}), n || (n = (e) => e.children), Object.assign(this, {
        _guid: R(),
        id: t.id || "",
        data: t,
        depth: t.depth || 0,
        height: t.height || 0,
        length: t.length || 0,
        parent: t.parent || null,
        children: n(t) || [],
        value: t.value || 1,
        respresenting: 1
      });
    }
    function R() {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (t) => (t ^ Math.random() * 16 >> t / 4).toString(16));
    }
    i.prototype.addChild = function(t) {
      let n;
      return t instanceof i ? (n = t, n.parent = this) : (t || (t = {}), n = new i(
        Object.assign(t, {
          parent: this
        })
      )), this.children.push(n), n;
    }, i.prototype.addParent = function(t, n) {
      n || (n = []);
      let e;
      return t instanceof i ? e = t : (t || (t = {}), e = new i(Object.assign(t))), n.forEach((r) => r.setParent(e)), e.children = [this].concat(n), this.parent = e, this;
    }, i.prototype.ancestors = function() {
      return this.getAncestors(!0);
    }, i.prototype.clone = function() {
      return S(this.toObject());
    }, i.prototype.consolidate = function() {
      return this.eachAfter((t) => {
        t.isRoot() || t.length >= 5e-4 || (t.parent.id == "" ? t.parent.id = t.id : t.parent.id += "+" + t.id, t.excise());
      }).fixDistances();
    }, i.prototype.copy = function() {
      let t = S(JSON.stringify(this));
      return t.parent = null, t.fixDistances();
    }, i.prototype.count = function() {
      return this.sum(() => 1);
    }, i.prototype.descendants = function() {
      return this.getDescendants(!0);
    }, i.prototype.depthOf = function(t) {
      let n = 0;
      if (typeof t == "string" && (t = this.getDescendant(t)), typeof t > "u")
        throw Error("Cannot compute depth of undefined descendant!");
      let e = t;
      for (; e != this; )
        n += e.length, e = e.parent;
      return n;
    }, i.prototype.distanceBetween = function(t, n) {
      let e = t.getMRCA(n);
      return e.depthOf(t) + e.depthOf(n);
    }, i.prototype.distanceTo = function(t) {
      let n = this.getMRCA(t);
      return n.depthOf(this) + n.depthOf(t);
    }, i.prototype.each = function(t) {
      let n = this, e = [n], r;
      for (; e.length; )
        for (r = e.reverse(), e = []; n = r.pop(); )
          t(n), n.eachChild((s) => e.push(s));
      return this;
    }, i.prototype.eachAfter = function(t) {
      return this.eachChild((n) => n.eachAfter(t)), t(this), this;
    }, i.prototype.eachBefore = function(t) {
      return t(this), this.eachChild((n) => n.eachBefore(t)), this;
    }, i.prototype.eachChild = function(t) {
      return this.children.forEach(t), this;
    }, i.prototype.excise = function() {
      if (this.isRoot() && this.children.length > 1)
        throw new Error("Cannot excise a root Branch with multiple children.");
      return this.eachChild((t) => {
        t.length += this.length, t.parent = this.parent, this.isRoot() || this.parent.children.push(t);
      }), this.parent.children.splice(this.parent.children.indexOf(this), 1), this.parent.representing++, this.parent;
    }, i.prototype.fixDistances = function() {
      let t = 0, n = this.getRoot();
      return n.depth = 0, this.eachBefore((e) => {
        e.isRoot() || (e.depth = e.parent.depth + 1, e.depth > t && (t = e.depth));
      }).eachAfter((e) => {
        e.height = t - e.depth, e.value = e.value + e.children.reduce((r, s) => r + s.value, 0);
      }), this;
    }, i.prototype.fixParenthood = function(t) {
      return this.children.forEach((n) => {
        n.parent || (n.parent = this), n.parent !== this && (n.parent = this), !t && n.children.length > 0 && n.fixParenthood();
      }), this;
    }, i.prototype.flip = function() {
      return this.each((t) => t.rotate());
    }, i.prototype.getAncestors = function(t) {
      let n = t ? [this] : [], e = this;
      for (; e = e.parent; )
        n.push(e);
      return n;
    }, i.prototype.getChild = function(t) {
      if (!1 == "string")
        throw Error("childID is not a String!");
      return this.children.find((n) => n.id === t);
    }, i.prototype.getDescendant = function(t) {
      if (this.id === t)
        return this;
      let n = this.children, e = n.length;
      if (n)
        for (let r = 0; r < e; r++) {
          let s = n[r].getDescendant(t);
          if (s)
            return s;
        }
    }, i.prototype.getDescendants = function(t) {
      let n = t ? [this] : [];
      return this.isLeaf() || this.children.forEach((e) => {
        e.getDescendants(!0).forEach((r) => n.push(r));
      }), n;
    }, i.prototype.getLeafs = function() {
      return this.getLeaves();
    }, i.prototype.getLeaves = function() {
      if (this.isLeaf())
        return [this];
      {
        let t = [];
        return this.children.forEach((n) => {
          n.getLeaves().forEach((e) => t.push(e));
        }), t;
      }
    }, i.prototype.getMRCA = function(t) {
      let n = this;
      for (; !n.hasDescendant(t); ) {
        if (n.isRoot())
          throw Error(
            "Branch and cousin do not appear to share a common ancestor!"
          );
        n = n.parent;
      }
      return n;
    }, i.prototype.getRoot = function() {
      let t = this;
      for (; !t.isRoot(); )
        t = t.parent;
      return t;
    }, i.prototype.hasChild = function(t) {
      if (t instanceof i)
        return this.children.includes(t);
      if (typeof t == "string")
        return this.children.some((n) => n.id === t);
      throw Error(
        `Unknown type of child (${typeof t}) passed to Branch.hasChild!`
      );
    }, i.prototype.hasDescendant = function(t) {
      let n = this.getDescendants();
      if (t instanceof i)
        return n.some((e) => e === t);
      if (typeof t == "string")
        return n.some((e) => e.id === t);
      throw Error("Unknown type of descendant passed to Branch.hasDescendant!");
    }, i.prototype.hasLeaf = function(t) {
      let n = this.getleaves();
      if (t instanceof i)
        return n.includes(t);
      if (typeof t == "string")
        return n.some((e) => e.id === t);
      throw Error("Unknown type of leaf passed to Branch.hasLeaf.");
    }, i.prototype.invert = function() {
      let t = this.parent;
      if (t) {
        let n = this.parent.length;
        this.parent.length = this.length, this.length = n, this.parent = t.parent, this.children.push(t), t.parent = this, t.children.splice(t.children.indexOf(this), 1);
      } else
        throw Error("Cannot invert root node!");
      return this;
    }, i.prototype.isChildOf = function(t) {
      if (t instanceof i)
        return this.parent === t;
      if (typeof t == "string")
        return this.parent.id === t;
      throw Error("Unknown parent type passed to Branch.isChildOf");
    }, i.prototype.isConsistent = function() {
      return !this.isRoot() && !this.parent.children.includes(this) ? !1 : this.isLeaf() ? !0 : this.children.some((t) => t.parent !== this) ? !1 : this.children.every((t) => t.isConsistent());
    }, i.prototype.isDescendantOf = function(t) {
      return !t || !this.parent ? !1 : this.parent === t || this.parent.id === t ? !0 : this.parent.isDescendantOf(t);
    }, i.prototype.isLeaf = function() {
      return this.children.length === 0;
    }, i.prototype.isolate = function() {
      let t = this.parent.children.indexOf(this);
      return this.parent.children.splice(t, 1), this.setParent(null), this;
    }, i.prototype.isRoot = function() {
      return this.parent === null;
    }, i.prototype.leafs = function() {
      return this.getLeaves();
    }, i.prototype.leaves = function() {
      return this.getLeaves();
    }, i.prototype.links = function() {
      let t = [];
      return this.each((n) => {
        n.isRoot() || t.push({
          source: n.parent,
          target: n
        });
      }), t;
    }, i.prototype.normalize = function(t, n) {
      typeof n != "number" && (n = 1), typeof t != "number" && (t = 0);
      let e = 1 / 0, r = -1 / 0;
      this.each((o) => {
        o.value < e && (e = o.value), o.value > r && (r = o.value);
      });
      let s = (n - t) / (r - e);
      return this.each((o) => o.value = (o.value - e) * s + t);
    }, i.prototype.path = function(t) {
      let n = this, e = [this], r = this.getMRCA(t);
      for (; n !== r; )
        n = n.parent, e.push(n);
      let s = e.length;
      for (n = t; n !== r; )
        e.splice(s, 0, n), n = n.parent;
      return e;
    }, i.prototype.remove = function() {
      let t = this.getRoot();
      return this.isolate(), t;
    }, i.prototype.replace = function(t) {
      let n = this.getRoot();
      this.parent;
      let e = this.parent.children.indexOf(this);
      return this.parent.children.splice(e, 1, t), n;
    }, i.prototype.reroot = function() {
      let t = this, n = [];
      for (; !t.isRoot(); )
        n.push(t), t = t.parent;
      return n.reverse().forEach((e) => e.invert()), this.fixDistances();
    }, i.prototype.rotate = function(t) {
      return this.children ? (this.children.reverse(), this) : this;
    }, i.prototype.setLength = function(t) {
      return this.length = t, this;
    }, i.prototype.setParent = function(t) {
      if (!t instanceof i && t !== null)
        throw Error("Cannot set parent to non-Branch object!");
      return this.parent = t, this;
    }, i.prototype.simplify = function() {
      return this.eachAfter((t) => {
        if (t.children.length == 1) {
          let n = t.children[0];
          n.id == "" ? n.id = t.id : n.id = t.id + "+" + n.id, t.excise();
        }
      }), this.fixDistances();
    }, i.prototype.sort = function(t) {
      return t || (t = (n, e) => n.value - e.value), this.eachBefore((n) => n.children.sort(t));
    }, i.prototype.sources = function(t) {
      let n = this.getMRCA(t);
      return n.depthOf(this) < n.depthOf(t);
    }, i.prototype.sum = function(t) {
      return t || (t = (n) => n.value), this.eachAfter(
        (n) => n.value = t(n) + n.children.reduce((e, r) => e + r.value, 0)
      );
    }, i.prototype.targets = function(t) {
      return t.sources(this);
    }, i.prototype.toJSON = function() {
      return this.toObject();
    }, i.prototype.toMatrix = function() {
      let t = this.getLeaves(), n = t.length, e = new Array(n);
      for (let r = 0; r < n; r++) {
        e[r] = new Array(n), e[r][r] = 0;
        for (let s = 0; s < r; s++) {
          let o = t[r].distanceTo(t[s]);
          e[r][s] = o, e[s][r] = o;
        }
      }
      return {
        matrix: e,
        ids: t.map((r) => r.id)
      };
    }, i.prototype.toNewick = function(t) {
      let n = "";
      return this.isLeaf() || (n += "(" + this.children.map((e) => e.toNewick(!0)).join(",") + ")"), n += this.id, this.length && (n += ":" + M(this.length)), t || (n += ";"), n;
    };
    function M(t) {
      let n = String(t);
      if (Math.abs(t) < 1) {
        let e = parseInt(t.toString().split("e-")[1]);
        if (e) {
          let r = t < 0;
          r && (t *= -1), t *= Math.pow(10, e - 1), n = "0." + new Array(e).join("0") + t.toString().substring(2), r && (n = "-" + n);
        }
      } else {
        let e = parseInt(t.toString().split("+")[1]);
        e > 20 && (e -= 20, t /= Math.pow(10, e), n = t.toString() + new Array(e + 1).join("0"));
      }
      return n;
    }
    i.prototype.toObject = function() {
      let t = {
        id: this.id,
        length: this.length
      };
      return this.children.length > 0 && (t.children = this.children.map((n) => n.toObject())), t;
    }, i.prototype.toString = function(t, n) {
      return t || (t = null), n || (n = 0), JSON.stringify(this, t, n);
    };
    function S(t, n, e, r) {
      n || (n = "id"), e || (e = "length"), r || (r = "children"), typeof t == "string" && (t = JSON.parse(t));
      let s = new i({
        id: t[n],
        length: t[e]
      });
      return t[r] instanceof Array && t[r].forEach((o) => {
        s.addChild(S(o));
      }), s.fixDistances();
    }
    function E(t, n) {
      let e = {}, r = e.N = t.length;
      n || (n = [...Array(r).keys()]), e.cN = e.N, e.D = t, e.labels = n, e.labelToTaxon = {}, e.currIndexToLabel = new Array(r), e.rowChange = new Array(r), e.newRow = new Array(r), e.labelToNode = new Array(2 * r), e.nextIndex = r, e.I = new Array(e.N), e.S = new Array(e.N);
      for (let l = 0; l < e.N; l++) {
        let x = O(e.D[l], l);
        e.S[l] = x, e.I[l] = x.sortIndices;
      }
      e.removedIndices = /* @__PURE__ */ new Set(), e.indicesLeft = /* @__PURE__ */ new Set();
      for (let l = 0; l < r; l++)
        e.currIndexToLabel[l] = l, e.indicesLeft.add(l);
      e.rowSumMax = 0, e.PNewick = "";
      let s, o, f, u, p, d, a, g, y;
      function h(l, x) {
        let D;
        return l < e.N ? (D = new i({ id: e.labels[l], length: x }), e.labelToNode[l] = D) : (D = e.labelToNode[l], D.setLength(x)), D;
      }
      e.rowSums = T(e.D);
      for (let l = 0; l < e.cN; l++)
        e.rowSums[l] > e.rowSumMax && (e.rowSumMax = e.rowSums[l]);
      for (; e.cN > 2; ) {
        ({ minI: s, minJ: o } = L(e)), f = 0.5 * e.D[s][o] + (e.rowSums[s] - e.rowSums[o]) / (2 * e.cN - 4), u = e.D[s][o] - f, p = e.currIndexToLabel[s], d = e.currIndexToLabel[o], a = h(p, f), g = h(d, u), y = new i({ children: [a, g] }), I(e, s, o);
        let l = O(e.D[o], o);
        e.S[o] = l, e.I[o] = l.sortIndices, e.S[s] = e.I[s] = [], e.cN--, e.labelToNode[e.nextIndex] = y, e.currIndexToLabel[s] = -1, e.currIndexToLabel[o] = e.nextIndex++;
      }
      let c = e.indicesLeft.values();
      s = c.next().value, o = c.next().value, p = e.currIndexToLabel[s], d = e.currIndexToLabel[o], f = u = e.D[s][o] / 2, a = h(p, f), g = h(d, u);
      let v = new i({ children: [a, g] });
      return v.fixParenthood(), v.fixDistances();
    }
    function L(t) {
      let n = 1 / 0, e = t.D, r = t.cN, s = r - 2, o = t.S, f = t.I, u = t.rowSums, p = t.removedIndices, d = t.rowSumMax, a, g = -1, y = -1, h;
      for (let c = 0; c < t.N; c++)
        p.has(c) || (h = f[c][0], !p.has(h) && (a = e[c][h] * s - u[c] - u[h], a < n && (n = a, g = c, y = h)));
      for (let c = 0; c < t.N; c++)
        if (!p.has(c)) {
          for (let v = 0; v < o[c].length; v++)
            if (h = f[c][v], !p.has(h)) {
              if (o[c][v] * s - u[c] - d > n)
                break;
              a = e[c][h] * s - u[c] - u[h], a < n && (n = a, g = c, y = h);
            }
        }
      return { minI: g, minJ: y };
    }
    function I(t, n, e) {
      let r = t.D, s = r.length, o = 0, f, u, p = t.removedIndices, d = t.rowSums, a = t.newRow, g = t.rowChange, y = 0;
      p.add(n);
      for (let h = 0; h < s; h++)
        p.has(h) || (f = r[n][h] + r[e][h], u = r[n][e], a[h] = 0.5 * (f - u), o += a[h], g[h] = -0.5 * (f + u));
      for (let h = 0; h < s; h++)
        r[n][h] = -1, r[h][n] = -1, !p.has(h) && (r[e][h] = a[h], r[h][e] = a[h], d[h] += g[h], d[h] > y && (y = d[h]));
      d[n] = 0, d[e] = o, o > y && (y = o), t.rowSumMax = y, t.indicesLeft.delete(n);
    }
    function T(t) {
      let n = t.length, e = new Array(n);
      for (let r = 0; r < n; r++) {
        let s = 0;
        for (let o = 0; o < n; o++)
          typeof parseFloat(t[r][o]) == "number" && (s += t[r][o]);
        e[r] = s;
      }
      return e;
    }
    function O(t, n) {
      typeof n > "u" && (n = -1);
      let e = t.length, r = new Array(e), s = new Array(e), o = 0;
      for (let f = 0; f < e; f++)
        t[f] === -1 || f === n || (r[o] = f, s[o++] = t[f]);
      r.length = o, s.length = o, r.sort((f, u) => t[f] - t[u]), s.sortIndices = r;
      for (let f = 0; f < o; f++)
        s[f] = t[r[f]];
      return s;
    }
    function b(t) {
      let n = [], e = new i(), r = t.split(/\s*(;|\(|\)|,|:)\s*/), s = r.length;
      for (let o = 0; o < s; o++) {
        let f = r[o], u;
        switch (f) {
          case "(":
            u = e.addChild(), n.push(e), e = u;
            break;
          case ",":
            u = n[n.length - 1].addChild(), e = u;
            break;
          case ")":
            e = n.pop();
            break;
          case ":":
            break;
          default:
            let p = r[o - 1];
            p == ")" || p == "(" || p == "," ? e.id = f : p == ":" && (e.length = parseFloat(f));
        }
      }
      return e.fixDistances();
    }
    w.Branch = i, w.parseJSON = S, w.parseMatrix = E, w.parseNewick = b, w.version = C, Object.defineProperty(w, "__esModule", { value: !0 });
  });
})(N, N.exports);
var P = N.exports;
const J = /* @__PURE__ */ B(P);
export {
  J as default
};
