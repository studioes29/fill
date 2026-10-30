// Moteur d'exécution de Svelte 5, tel que compilé dans le bundle. Ne pas modifier.
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var n = Array.isArray,
  r = Array.prototype.indexOf,
  i = Array.prototype.includes,
  a = Array.from,
  o = Object.defineProperty,
  s = Object.getOwnPropertyDescriptor,
  c = Object.getOwnPropertyDescriptors,
  l = Object.prototype,
  u = Array.prototype,
  d = Object.getPrototypeOf,
  f = Object.isExtensible,
  p = () => {};
function m(e) {
  return e();
}
function h(e) {
  for (var t = 0; t < e.length; t++) e[t]();
}
function g() {
  var e, t;
  return {
    promise: new Promise((n, r) => {
      ((e = n), (t = r));
    }),
    resolve: e,
    reject: t,
  };
}
function _(e, t, n = !1) {
  return e === void 0 ? (n ? t() : t) : e;
}
function v(e, t) {
  if (Array.isArray(e)) return e;
  if (t === void 0 || !(Symbol.iterator in e)) return Array.from(e);
  let n = [];
  for (let r of e) if ((n.push(r), n.length === t)) break;
  return n;
}
var y = 1024,
  b = 2048,
  x = 4096,
  S = 8192,
  C = 16384,
  w = 32768,
  T = 1 << 25,
  ee = 65536,
  E = 1 << 18,
  te = 1 << 19,
  D = 1 << 20,
  ne = 1 << 25,
  re = 1 << 21,
  ie = 1 << 22,
  ae = 1 << 23,
  oe = Symbol(`$state`),
  se = Symbol(`component`),
  ce = Symbol(`legacy props`),
  le = Symbol(``),
  ue = Symbol(`attributes`),
  de = Symbol(`class`),
  fe = Symbol(`style`),
  pe = Symbol(`text`),
  me = Symbol(`form reset`),
  he = new (class extends Error {
    name = `StaleReactionError`;
    message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
  })(),
  ge = !!globalThis.document?.contentType && globalThis.document.contentType.includes(`xml`),
  _e = {},
  ve = Symbol(`uninitialized`),
  ye = `http://www.w3.org/1999/xhtml`;
function be() {
  console.warn(`https://svelte.dev/e/derived_inert`);
}
function xe(e) {
  console.warn(`https://svelte.dev/e/hydration_mismatch`);
}
function Se() {
  console.warn(`https://svelte.dev/e/select_multiple_invalid_value`);
}
function Ce() {
  console.warn(`https://svelte.dev/e/svelte_boundary_reset_noop`);
}
var O = !1;
function we(e) {
  O = e;
}
var k;
function Te(e) {
  if (e === null) throw (xe(), _e);
  return (k = e);
}
function Ee() {
  return Te(fn(k));
}
function A(e) {
  if (O) {
    if (fn(k) !== null) throw (xe(), _e);
    k = e;
  }
}
function j(e = 1) {
  if (O) {
    for (var t = e, n = k; t--;) n = fn(n);
    k = n;
  }
}
function De(e = !0) {
  for (var t = 0, n = k; ;) {
    if (n.nodeType === 8) {
      var r = n.data;
      if (r === `]`) {
        if (t === 0) return n;
        --t;
      } else (r === `[` || r === `[!` || (r[0] === `[` && !isNaN(Number(r.slice(1))))) && (t += 1);
    }
    var i = fn(n);
    (e && n.remove(), (n = i));
  }
}
function Oe(e) {
  if (!e || e.nodeType !== 8) throw (xe(), _e);
  return e.data;
}
function ke(e) {
  return e === this.v;
}
function Ae(e, t) {
  return e == e ? e !== t || (typeof e == `object` && !!e) || typeof e == `function` : t == t;
}
function je(e) {
  return !Ae(e, this.v);
}
function Me() {
  throw Error(`https://svelte.dev/e/async_derived_orphan`);
}
function Ne(e, t, n) {
  throw Error(`https://svelte.dev/e/each_key_duplicate`);
}
function Pe(e) {
  throw Error(`https://svelte.dev/e/effect_in_teardown`);
}
function Fe() {
  throw Error(`https://svelte.dev/e/effect_in_unowned_derived`);
}
function Ie(e) {
  throw Error(`https://svelte.dev/e/effect_orphan`);
}
function Le() {
  throw Error(`https://svelte.dev/e/effect_update_depth_exceeded`);
}
function Re(e) {
  throw Error(`https://svelte.dev/e/props_invalid_value`);
}
function ze() {
  throw Error(`https://svelte.dev/e/state_descriptors_fixed`);
}
function Be() {
  throw Error(`https://svelte.dev/e/state_prototype_fixed`);
}
function Ve() {
  throw Error(`https://svelte.dev/e/state_unsafe_mutation`);
}
function He() {
  throw Error(`https://svelte.dev/e/svelte_boundary_reset_onerror`);
}
var Ue = !1;
function We() {
  Ue = !0;
}
var Ge = null;
function Ke(e) {
  Ge = e;
}
function qe(e, t = !1, n) {
  Ge = {
    p: Ge,
    i: !1,
    c: null,
    e: null,
    s: e,
    x: null,
    r: Xn,
    l:
      Ue && !t
        ? {
            s: null,
            u: null,
            $: [],
          }
        : null,
  };
}
function Je(e) {
  var t = Ge,
    n = t.e;
  if (n !== null) {
    t.e = null;
    for (var r of n) Tn(r);
  }
  return (e !== void 0 && (t.x = e), (t.i = !0), (Ge = t.p), Ye(e));
}
function Ye(e = {}) {
  return (
    o(e, se, {
      value: !0,
    }),
    e
  );
}
function Xe() {
  return !Ue || (Ge !== null && Ge.l === null);
}
var Ze = [];
function Qe() {
  var e = Ze;
  ((Ze = []), h(e));
}
function $e(e) {
  if (Ze.length === 0 && !Ot) {
    var t = Ze;
    queueMicrotask(() => {
      t === Ze && Qe();
    });
  }
  Ze.push(e);
}
function et() {
  for (; Ze.length > 0;) Qe();
}
var tt = ~(b | x | y);
function nt(e, t) {
  e.f = (e.f & tt) | t;
}
function rt(e) {
  e.f & 512 || e.deps === null ? nt(e, y) : nt(e, x);
}
function it(e, t) {
  (e.f & 2048 ? t.set(e, b) : e.f & 4096 && t.get(e) !== 2048 && t.set(e, x), nt(e, y));
}
function at(e) {
  O && dn(e) !== null && pn(e);
}
var ot = !1;
function st() {
  ot ||
    ((ot = !0),
    document.addEventListener(
      `reset`,
      (e) => {
        Promise.resolve().then(() => {
          if (!e.defaultPrevented) for (let t of e.target.elements) t[me]?.();
        });
      },
      {
        capture: !0,
      },
    ));
}
function ct(e) {
  var t = qn,
    n = Xn;
  (Yn(null), Zn(null));
  try {
    return e();
  } finally {
    (Yn(t), Zn(n));
  }
}
function lt(e, t, n, r = n) {
  e.addEventListener(t, () => ct(n));
  let i = e[me];
  ((e[me] = i
    ? () => {
        (i(), r(!0));
      }
    : () => r(!0)),
    st());
}
function ut(e, t, n, r) {
  let i = Xe() ? mt : _t;
  var a = e.filter((e) => !e.settled),
    o = t.map(i);
  if (n.length === 0 && a.length === 0) {
    r(o);
    return;
  }
  var s = Xn,
    c = dt(),
    l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
  function u(e) {
    if (!(s.f & 16384)) {
      c();
      try {
        r([...o, ...e]);
      } catch (e) {
        vn(e, s);
      }
      ft();
    }
  }
  var d = pt();
  if (n.length === 0) {
    l.then(() => u([])).finally(d);
    return;
  }
  function f() {
    Promise.all(n.map((e) => gt(e)))
      .then(u)
      .catch((e) => vn(e, s))
      .finally(d);
  }
  l
    ? l.then(() => {
        s.f & 16384 ? d() : (c(), f(), ft());
      })
    : f();
}
function dt() {
  var e = Xn,
    t = qn,
    n = Ge,
    r = wt;
  return function (i = !0) {
    (Zn(e), Yn(t), Ke(n), i && !(e.f & 16384) && (r?.activate(), r?.apply()));
  };
}
function ft(e = !0) {
  (Zn(null), Yn(null), Ke(null), e && wt?.deactivate());
}
function pt() {
  var e = Xn,
    t = e.b,
    n = wt,
    r = !!t?.is_rendered();
  return (
    t?.update_pending_count(1, n),
    n.increment(r, e),
    () => {
      (t?.update_pending_count(-1, n), n.decrement(r, e));
    }
  );
}
function mt(e) {
  var t = 2 | b;
  return (
    Xn !== null && (Xn.f |= te),
    {
      ctx: Ge,
      deps: null,
      effects: null,
      equals: ke,
      f: t,
      fn: e,
      reactions: null,
      rv: 0,
      v: ve,
      wv: 0,
      parent: Xn,
      ac: null,
    }
  );
}
var ht = Symbol(`obsolete`);
function gt(e, t, n) {
  let r = Xn;
  r === null && Me();
  var i = void 0,
    a = Gt(ve),
    o = !qn,
    s = new Set();
  return (
    kn(() => {
      var t = Xn,
        n = g();
      i = n.promise;
      try {
        Promise.resolve(e())
          .then(n.resolve, (e) => {
            e !== he && n.reject(e);
          })
          .finally(ft);
      } catch (e) {
        (n.reject(e), ft());
      }
      var c = wt;
      if (o) {
        if (t.f & 32768) var l = pt();
        if (r.b?.is_rendered()) c.async_deriveds.get(t)?.reject(ht);
        else for (let e of s.values()) e.reject(ht);
        (s.add(n), c.async_deriveds.set(t, n));
      }
      let u = (e, t = void 0) => {
        (l?.(),
          s.delete(n),
          t !== ht &&
            (c.activate(), t ? ((a.f |= ae), Yt(a, t)) : (a.f & 8388608 && (a.f ^= ae), Yt(a, e)), c.deactivate()));
      };
      n.promise.then(u, (e) => u(null, e || `unknown`));
    }),
    Cn(() => {
      for (let e of s) e.reject(ht);
    }),
    new Promise((e) => {
      function t(n) {
        function r() {
          n === i ? e(a) : t(i);
        }
        n.then(r, r);
      }
      t(i);
    })
  );
}
function M(e) {
  let t = mt(e);
  return ($n(t), t);
}
function _t(e) {
  let t = mt(e);
  return ((t.equals = je), t);
}
function vt(e) {
  var t = e.effects;
  if (t !== null) {
    e.effects = null;
    for (var n = 0; n < t.length; n += 1) In(t[n]);
  }
}
function yt(e) {
  var t,
    n = Xn,
    r = e.parent;
  if (!Gn && r !== null && e.v !== ve && r.f & 24576) return (be(), e.v);
  Zn(r);
  try {
    (vt(e), (t = dr(e)));
  } finally {
    Zn(n);
  }
  return t;
}
function bt(e) {
  var t = yt(e);
  !e.equals(t) &&
  ((e.wv = cr()),
  (!wt?.is_fork || e.deps === null) &&
    (wt === null ? (e.v = t) : (wt.capture(e, t, !0), Tt?.capture(e, t, !0)), e.deps === null))
    ? nt(e, y)
    : Gn || (Et === null ? rt(e) : (Sn() || wt?.is_fork) && Et.set(e, t));
}
function xt(e) {
  if (e.effects !== null)
    for (let t of e.effects)
      (t.teardown || t.ac) &&
        (t.teardown?.(),
        t.ac !== null &&
          ct(() => {
            (t.ac.abort(he), (t.ac = null));
          }),
        t.fn !== null && (t.teardown = p),
        mr(t, 0),
        Pn(t));
}
function St(e) {
  if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && hr(t);
}
var Ct = null,
  wt = null,
  Tt = null,
  Et = null,
  Dt = null,
  Ot = !1,
  kt = !1,
  At = null,
  jt = null,
  Mt = 0,
  Nt = 1,
  Pt = class e {
    id = Nt++;
    started = !1;
    linked = !0;
    prev = null;
    next = null;
    async_deriveds = new Map();
    current = new Map();
    previous = new Map();
    #e = new Set();
    #t = new Set();
    #n = 0;
    #r = new Map();
    #i = null;
    #a = [];
    #o = [];
    #s = new Map();
    #c = new Map();
    #l = new Set();
    is_fork = !1;
    #u = !1;
    constructor() {
      (Ct === null ? (Ct = this) : ((Ct.next = this), (this.prev = Ct)), (Ct = this));
    }
    #d() {
      if (this.is_fork) return !0;
      for (let e of this.#r.keys()) if (!this.#f(e)) return !0;
      return !1;
    }
    #f(e) {
      for (var t = e; t !== null; t = t.parent) if (this.#c.has(t)) return !0;
      return !1;
    }
    skip_effect(e) {
      (this.#c.has(e) ||
        this.#c.set(e, {
          d: [],
          m: [],
        }),
        this.#l.delete(e));
    }
    unskip_effect(e, t = (e) => this.schedule(e)) {
      var n = this.#c.get(e);
      if (n) {
        this.#c.delete(e);
        for (var r of n.d) (nt(r, b), t(r));
        for (r of n.m) (nt(r, x), t(r));
      }
      this.#l.add(e);
    }
    #p() {
      var e = [];
      for (let i of this.#a)
        if (!(i.f & 16384 || !(i.f & 6144))) {
          for (var t = i, n = !1; t.parent !== null;) {
            t = t.parent;
            var r = t.f;
            if (r & 96) {
              if (!(r & 1024)) {
                n = !0;
                break;
              }
              t.f ^= y;
            }
          }
          n || e.push(t);
        }
      return ((this.#a = []), e);
    }
    #m() {
      this.started = !0;
      for (let [e, t] of this.#s) (nt(e, t), this.schedule(e));
      this.apply();
      for (var t = (At = []), n = [], r = (jt = []); this.#a.length > 0;) {
        Mt++ > 1e3 && (this.#b(), It());
        for (let e of this.#p())
          try {
            this.#h(e, t, n);
          } catch (t) {
            throw (Vt(e), this.#d() || this.discard(), t);
          }
      }
      if (((wt = null), r.length > 0)) {
        var i = e.ensure();
        for (let e of r) i.schedule(e);
      }
      if (((At = null), (jt = null), this.#d())) {
        (this.#y(n), this.#y(t));
        for (let [e, t] of this.#c) Bt(e, t);
        r.length > 0 && wt.#m();
        return;
      }
      let a = this.#g();
      if (a) (this.#y(n), this.#y(t), a.#v(this));
      else {
        this.#s.clear();
        for (let e of this.#e) e(this);
        (this.#e.clear(), (Tt = this), Rt(n), Rt(t), (Tt = null), this.#i?.resolve());
        var o = wt;
        (this.#n === 0 && (this.#a.length === 0 || o !== null) && this.#b(), o !== null && (Ut.clear(), o.#m()));
      }
    }
    #h(e, t, n) {
      e.f ^= y;
      for (var r = e.first; r !== null;) {
        var i = r.f,
          a = !!(i & 96);
        if (!((a && i & 1024) || i & 8192 || this.#c.has(r)) && r.fn !== null) {
          a ? (r.f ^= y) : i & 4 ? t.push(r) : lr(r) && (i & 16 && this.add_dirty_reaction(r, x), hr(r));
          var o = r.first;
          if (o !== null) {
            r = o;
            continue;
          }
        }
        for (; r !== null;) {
          var s = r.next;
          if (s !== null) {
            r = s;
            break;
          }
          r = r.parent;
        }
      }
    }
    #g() {
      for (var e = this.prev; e !== null; e = e.prev) if (!e.is_fork && this.#_(e)) return e;
      return null;
    }
    #_(e) {
      for (let [t, [, n]] of this.current) if (!n && e.current.has(t)) return !0;
      return !1;
    }
    #v(e) {
      for (let [t, n] of e.current)
        (!this.previous.has(t) && e.previous.has(t) && this.previous.set(t, e.previous.get(t)), this.current.set(t, n));
      for (let [t, n] of e.async_deriveds) {
        let e = this.async_deriveds.get(t);
        e && n.promise.then(e.resolve).catch(e.reject);
      }
      (e.async_deriveds.clear(), this.transfer_reactions(e.#s));
      let t = (e) => {
        var n = e.reactions;
        if (n !== null && !(e.f & 2 && !(e.f & 6144)))
          for (let e of n) {
            var r = e.f;
            if (r & 2) t(e);
            else {
              var i = e;
              r & 4194320 && !this.async_deriveds.has(i) && (this.#s.delete(i), nt(i, b), this.schedule(i));
            }
          }
      };
      for (let e of this.current.keys()) t(e);
      (this.oncommit(() => e.discard()), e.#b(), (wt = this), this.#m());
    }
    #y(e) {
      for (var t = 0; t < e.length; t += 1) it(e[t], this.#s);
    }
    capture(e, t, n = !1) {
      (e.v !== ve && !this.previous.has(e) && this.previous.set(e, e.v),
        e.f & 8388608 || (this.current.set(e, [t, n]), Et?.set(e, t)),
        this.is_fork || (e.v = t));
    }
    activate() {
      wt = this;
    }
    deactivate() {
      ((wt = null), (Et = null));
    }
    flush() {
      try {
        ((kt = !0), (wt = this), this.#m());
      } finally {
        ((Mt = 0), (Dt = null), (At = null), (jt = null), (kt = !1), (wt = null), (Et = null), Ut.clear());
      }
    }
    discard() {
      for (let e of this.#t) e(this);
      this.#t.clear();
      for (let e of this.async_deriveds.values()) e.reject(ht);
      (this.#b(), this.#i?.resolve());
    }
    register_created_effect(e) {
      this.#o.push(e);
    }
    increment(e, t) {
      if (((this.#n += 1), e)) {
        let e = this.#r.get(t) ?? 0;
        this.#r.set(t, e + 1);
      }
    }
    decrement(e, t) {
      if ((--this.#n, e)) {
        let e = this.#r.get(t) ?? 0;
        e === 1 ? this.#r.delete(t) : this.#r.set(t, e - 1);
      }
      this.#u ||
        ((this.#u = !0),
        $e(() => {
          ((this.#u = !1), this.linked && this.flush());
        }));
    }
    transfer_reactions(e) {
      for (let [t, n] of e) this.add_dirty_reaction(t, n);
      e.clear();
    }
    add_dirty_reaction(e, t) {
      (t === 2048 || this.#s.get(e) !== 2048) && this.#s.set(e, t);
    }
    oncommit(e) {
      this.#e.add(e);
    }
    ondiscard(e) {
      this.#t.add(e);
    }
    settled() {
      return (this.#i ??= g()).promise;
    }
    static ensure() {
      if (wt === null) {
        let t = (wt = new e());
        !kt &&
          !Ot &&
          $e(() => {
            t.started || t.flush();
          });
      }
      return wt;
    }
    apply() {
      Et = null;
    }
    schedule(e) {
      ((Dt = e), e.b?.is_pending && e.f & 16777228 && !(e.f & 32768) ? e.b.defer_effect(e) : this.#a.push(e));
    }
    #b() {
      if (this.linked) {
        var e = this.prev,
          t = this.next;
        (e === null || (e.next = t), t === null ? (Ct = e) : (t.prev = e), (this.linked = !1));
      }
    }
  };
function Ft(e) {
  var t = Ot,
    n = Tt;
  ((Tt = null), (Ot = !0));
  try {
    var r;
    for (e && (Ft(), (r = e())); ;) {
      if ((et(), wt === null)) return r;
      wt.flush();
    }
  } finally {
    ((Ot = t), (Tt = n));
  }
}
function It() {
  try {
    Le();
  } catch (e) {
    vn(e, Dt);
  }
}
var Lt = null;
function Rt(e) {
  var t = e.length;
  if (t !== 0) {
    for (var n = 0; n < t;) {
      var r = e[n++];
      if (
        !(r.f & 24576) &&
        lr(r) &&
        ((Lt = new Set()),
        hr(r),
        r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Rn(r),
        Lt?.size > 0)
      ) {
        Ut.clear();
        for (let e of Lt) {
          if (e.f & 24576) continue;
          let t = [e],
            n = e.parent;
          for (; n !== null;) (Lt.has(n) && (Lt.delete(n), t.push(n)), (n = n.parent));
          for (let e = t.length - 1; e >= 0; e--) {
            let n = t[e];
            n.f & 24576 || hr(n);
          }
        }
        Lt.clear();
      }
    }
    Lt = null;
  }
}
function zt(e) {
  wt.schedule(e);
}
function Bt(e, t) {
  if (!(e.f & 32 && e.f & 1024)) {
    (e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), nt(e, y));
    for (var n = e.first; n !== null;) (Bt(n, t), (n = n.next));
  }
}
function Vt(e) {
  nt(e, y);
  for (var t = e.first; t !== null;) (Vt(t), (t = t.next));
}
var Ht = new Set(),
  Ut = new Map(),
  Wt = !1;
function Gt(e, t) {
  return {
    f: 0,
    v: e,
    reactions: null,
    equals: ke,
    rv: 0,
    wv: 0,
  };
}
function N(e, t) {
  let n = Gt(e, t);
  return ($n(n), n);
}
function Kt(e, t = !1, n = !0) {
  let r = Gt(e);
  return (t || (r.equals = je), Ue && n && Ge !== null && Ge.l !== null && (Ge.l.s ??= []).push(r), r);
}
function P(e, t, n = !1) {
  return (
    qn !== null && (!Jn || qn.f & 131072) && Xe() && qn.f & 4325394 && (Qn === null || !Qn.has(e)) && Ve(),
    Yt(e, n ? en(t) : t, jt)
  );
}
var qt = null,
  Jt = 0;
function Yt(e, t, n = null) {
  if (!e.equals(t)) {
    Gn ? Ut.set(e, t) : Ut.has(e) || Ut.set(e, e.v);
    var r = Pt.ensure();
    if ((r.capture(e, t), e.f & 2)) {
      let t = e;
      (e.f & 2048 && yt(t), Et === null && rt(t));
    }
    ((e.wv = cr()),
      (qt = null),
      (Jt = 0),
      $t(e, b, n),
      (qt = null),
      Xe() && Xn !== null && Xn.f & 1024 && !(Xn.f & 96) && (nr === null ? rr([e]) : nr.push(e)),
      !r.is_fork && Ht.size > 0 && !Wt && Xt());
  }
  return t;
}
function Xt() {
  Wt = !1;
  for (let e of Ht) {
    e.f & 1024 && nt(e, x);
    let t;
    try {
      t = lr(e);
    } catch {
      t = !0;
    }
    t && hr(e);
  }
  Ht.clear();
}
function Zt(e, t = 1) {
  var n = B(e),
    r = t === 1 ? n++ : n--;
  return (P(e, n), r);
}
function Qt(e) {
  P(e, e.v + 1);
}
function $t(e, t, n) {
  var r = e.reactions;
  if (r !== null) {
    var i = Xe(),
      a = r.length;
    if (((Jt += a), Jt > 1e5 && qt === null && (qt = new Set()), qt !== null)) {
      if (qt.has(e)) return;
      qt.add(e);
    }
    for (var o = 0; o < a; o++) {
      var s = r[o],
        c = s.f;
      if (i || s !== Xn) {
        var l = (c & b) === 0;
        if ((l && nt(s, t), c & 131072)) Ht.add(s);
        else if (c & 2) {
          var u = s;
          (Et?.delete(u), $t(u, x, n));
        } else if (l) {
          var d = s;
          (c & 16 && Lt !== null && Lt.add(d), n === null ? zt(d) : n.push(d));
        }
      }
    }
  }
}
function en(e) {
  if (typeof e != `object` || !e || oe in e || se in e) return e;
  let t = d(e);
  if (t !== l && t !== u) return e;
  var r = new Map(),
    i = n(e),
    a = N(0),
    o = null,
    c = or,
    f = (e) => {
      if (or === c) return e();
      var t = qn,
        n = or;
      (Yn(null), sr(c));
      var r = e();
      return (Yn(t), sr(n), r);
    };
  return (
    i && r.set(`length`, N(e.length, o)),
    new Proxy(e, {
      defineProperty(e, t, n) {
        (`value` in n && n.configurable !== !1 && n.enumerable !== !1 && n.writable !== !1) || ze();
        var i = r.get(t);
        return (
          i === void 0
            ? f(() => {
                var e = N(n.value, o);
                return (r.set(t, e), e);
              })
            : P(i, n.value, !0),
          !0
        );
      },
      deleteProperty(e, t) {
        var n = r.get(t);
        if (n === void 0) {
          if (t in e) {
            let e = f(() => N(ve, o));
            (r.set(t, e), Qt(a));
          }
        } else (P(n, ve), Qt(a));
        return !0;
      },
      get(t, n, i) {
        if (n === oe) return e;
        var a = r.get(n),
          c = n in t;
        if (
          (a === void 0 && (!c || s(t, n)?.writable) && ((a = f(() => N(en(c ? t[n] : ve), o))), r.set(n, a)),
          a !== void 0)
        ) {
          var l = B(a);
          return l === ve ? void 0 : l;
        }
        return Reflect.get(t, n, i);
      },
      getOwnPropertyDescriptor(e, t) {
        this.has?.(e, t);
        var n = Reflect.getOwnPropertyDescriptor(e, t),
          i = r.get(t);
        if (i !== void 0) {
          var a = B(i);
          if (a === ve) return;
          if (n && `value` in n) n.value = a;
          else
            return {
              enumerable: !0,
              configurable: !0,
              value: a,
              writable: !0,
            };
        }
        return n;
      },
      has(e, t) {
        if (t === oe) return !0;
        var n = r.get(t),
          i = (n !== void 0 && n.v !== ve) || Reflect.has(e, t);
        return (n !== void 0 || ((Xn !== null || qn !== null) && (!i || s(e, t)?.writable))) &&
          (n === void 0 && ((n = f(() => N(i ? en(e[t]) : ve, o))), r.set(t, n)), B(n) === ve)
          ? !1
          : i;
      },
      set(e, t, n, c) {
        var l = r.get(t),
          u = t in e;
        if (i && t === `length`)
          for (var d = n; d < l.v; d += 1) {
            var p = r.get(d + ``);
            p === void 0 ? d in e && ((p = f(() => N(ve, o))), r.set(d + ``, p)) : P(p, ve);
          }
        if (l === void 0) (!u || s(e, t)?.writable) && ((l = f(() => N(void 0, o))), P(l, en(n)), r.set(t, l));
        else {
          u = l.v !== ve;
          var m = f(() => en(n));
          P(l, m);
        }
        var h = Reflect.getOwnPropertyDescriptor(e, t);
        if ((h?.set && h.set.call(c, n), !u)) {
          if (i && typeof t == `string`) {
            var g = r.get(`length`),
              _ = Number(t);
            Number.isInteger(_) && _ >= g.v && P(g, _ + 1);
          }
          Qt(a);
        }
        return !0;
      },
      ownKeys(e) {
        B(a);
        var t = Reflect.ownKeys(e).filter((e) => {
          var t = r.get(e);
          return t === void 0 || t.v !== ve;
        });
        for (var [n, i] of r) i.v !== ve && !(n in e) && t.push(n);
        return t;
      },
      setPrototypeOf() {
        Be();
      },
    })
  );
}
function tn(e) {
  try {
    if (typeof e == `object` && e && oe in e) return e[oe];
  } catch {}
  return e;
}
function nn(e, t) {
  return Object.is(tn(e), tn(t));
}
var rn, an, on, sn, cn;
function ln() {
  if (rn === void 0) {
    ((rn = window), (an = document), (on = /Firefox/.test(navigator.userAgent)));
    var e = Element.prototype,
      t = Node.prototype,
      n = Text.prototype;
    ((sn = s(t, `firstChild`).get),
      (cn = s(t, `nextSibling`).get),
      f(e) && ((e[de] = void 0), (e[ue] = null), (e[fe] = void 0), (e.__e = void 0)),
      f(n) && (n[pe] = void 0));
  }
}
function un(e = ``) {
  return document.createTextNode(e);
}
function dn(e) {
  return sn.call(e);
}
function fn(e) {
  return cn.call(e);
}
function F(e, t) {
  if (!O) return dn(e);
  var n = dn(k);
  if (n === null) n = k.appendChild(un());
  else if (t && n.nodeType !== 3) {
    var r = un();
    return (n?.before(r), Te(r), r);
  }
  return (t && gn(n), Te(n), n);
}
function I(e, t = !1) {
  if (!O) {
    var n = dn(e);
    return n instanceof Comment && n.data === `` ? fn(n) : n;
  }
  if (t) {
    if (k?.nodeType !== 3) {
      var r = un();
      return (k?.before(r), Te(r), r);
    }
    gn(k);
  }
  return k;
}
function L(e, t = !1) {
  if (!O) return dn(e);
  var n = F(e, t);
  return (A(e), n);
}
function R(e, t = 1, n = !1) {
  let r = O ? k : e;
  for (var i; t--;) ((i = r), (r = fn(r)));
  if (!O) return r;
  if (n) {
    if (r?.nodeType !== 3) {
      var a = un();
      return (r === null ? i?.after(a) : r.before(a), Te(a), a);
    }
    gn(r);
  }
  return (Te(r), r);
}
function pn(e) {
  e.textContent = ``;
}
function mn() {
  return !1;
}
function hn(e, t, n) {
  return t == null || t === `http://www.w3.org/1999/xhtml`
    ? n
      ? document.createElement(e, {
          is: n,
        })
      : document.createElement(e)
    : n
      ? document.createElementNS(t, e, {
          is: n,
        })
      : document.createElementNS(t, e);
}
function gn(e) {
  if (e.nodeValue.length < 65536) return;
  let t = e.nextSibling;
  for (; t !== null && t.nodeType === 3;) (t.remove(), (e.nodeValue += t.nodeValue), (t = e.nextSibling));
}
function _n(e) {
  var t = Xn;
  if (t === null) return ((qn.f |= ae), e);
  if (!(t.f & 32768) && !(t.f & 4)) throw e;
  vn(e, t);
}
function vn(e, t) {
  if (e === _e) throw e;
  if (!(t !== null && t.f & 16384)) {
    for (; t !== null;) {
      if (t.f & 128 && !(t.f & 33570816)) {
        if (!(t.f & 32768)) throw e;
        try {
          t.b.error(e);
          return;
        } catch (t) {
          e = t;
        }
      }
      t = t.parent;
    }
    throw e;
  }
}
function yn(e) {
  (Xn === null && (qn === null && Ie(e), Fe()), Gn && Pe(e));
}
function bn(e, t) {
  var n = t.last;
  n === null ? (t.last = t.first = e) : ((n.next = e), (e.prev = n), (t.last = e));
}
function xn(e, t) {
  var n = Xn;
  n !== null && n.f & 8192 && (e |= S);
  var r = {
    ctx: Ge,
    deps: null,
    nodes: null,
    f: e | b | 512,
    first: null,
    fn: t,
    last: null,
    next: null,
    parent: n,
    b: n && n.b,
    prev: null,
    teardown: null,
    wv: 0,
    ac: null,
  };
  wt?.register_created_effect(r);
  var i = r;
  if (e & 4) At === null ? Pt.ensure().schedule(r) : At.push(r);
  else if (t !== null) {
    try {
      hr(r);
    } catch (e) {
      throw (In(r), e);
    }
    i.deps === null &&
      i.teardown === null &&
      i.nodes === null &&
      i.first === i.last &&
      !(i.f & 524288) &&
      ((i = i.first), e & 16 && e & 65536 && i !== null && (i.f |= ee));
  }
  if (i !== null && ((i.parent = n), n !== null && bn(i, n), qn !== null && qn.f & 2 && !(e & 64))) {
    var a = qn;
    (a.effects ??= []).push(i);
  }
  return r;
}
function Sn() {
  return qn !== null && !Jn;
}
function Cn(e) {
  let t = xn(8, null);
  return (nt(t, y), (t.teardown = e), t);
}
function wn(e) {
  yn(`$effect`);
  var t = Xn.f;
  if (!qn && t & 32 && Ge !== null && !Ge.i) {
    var n = Ge;
    (n.e ??= []).push(e);
  } else return Tn(e);
}
function Tn(e) {
  return xn(4 | D, e);
}
function En(e) {
  return (yn(`$effect.pre`), xn(8 | D, e));
}
function Dn(e) {
  Pt.ensure();
  let t = xn(64 | te, e);
  return (e = {}) =>
    new Promise((n) => {
      e.outro
        ? zn(t, () => {
            (In(t), n(void 0));
          })
        : (In(t), n(void 0));
    });
}
function On(e) {
  return xn(4, e);
}
function kn(e) {
  return xn(ie | te, e);
}
function An(e, t = 0) {
  return xn(8 | t, e);
}
function z(e, t = [], n = [], r = []) {
  ut(r, t, n, (t) => {
    xn(8, () => {
      e(...t.map(B));
    });
  });
}
function jn(e, t = 0) {
  return xn(16 | t, e);
}
function Mn(e) {
  return xn(32 | te, e);
}
function Nn(e) {
  var t = e.teardown;
  if (t !== null) {
    let n = Gn,
      r = qn;
    (Kn(!0), Yn(null));
    try {
      t.call(null);
    } catch (t) {
      vn(t, e.parent);
    } finally {
      (Kn(n), Yn(r));
    }
  }
}
function Pn(e, t = !1) {
  var n = e.first;
  for (e.first = e.last = null; n !== null;) {
    let e = n.ac;
    e !== null &&
      ct(() => {
        e.abort(he);
      });
    var r = n.next;
    (n.f & 64 ? (n.parent = null) : In(n, t), (n = r));
  }
}
function Fn(e) {
  for (var t = e.first; t !== null;) {
    var n = t.next;
    (t.f & 32 || In(t), (t = n));
  }
}
function In(e, t = !0) {
  var n = !1;
  ((t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Ln(e.nodes.start, e.nodes.end), (n = !0)),
    (e.f |= T),
    Pn(e, t && !n),
    mr(e, 0));
  var r = e.nodes && e.nodes.t;
  if (r !== null) for (let e of r) e.stop();
  (Nn(e), (e.f ^= T), (e.f |= C));
  var i = e.parent;
  (i !== null && i.first !== null && Rn(e),
    (e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null));
}
function Ln(e, t) {
  for (; e !== null;) {
    var n = e === t ? null : fn(e);
    (e.remove(), (e = n));
  }
}
function Rn(e) {
  var t = e.parent,
    n = e.prev,
    r = e.next;
  (n !== null && (n.next = r),
    r !== null && (r.prev = n),
    t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n)));
}
function zn(e, t, n = !0) {
  var r = [];
  ((e.f |= 256), Bn(e, r, !0));
  var i = () => {
      (n && In(e), t && t());
    },
    a = r.length;
  if (a > 0) {
    var o = () => --a || i();
    for (var s of r) s.out(o);
  } else i();
}
function Bn(e, t, n) {
  if (!(e.f & 8192)) {
    e.f ^= S;
    var r = e.nodes && e.nodes.t;
    if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
    for (var i = e.first; i !== null;) {
      var a = i.next;
      if (!(i.f & 64)) {
        var o = !!(i.f & 65536) || (!!(i.f & 32) && !!(e.f & 16));
        Bn(i, t, o ? n : !1);
      }
      i = a;
    }
  }
}
function Vn(e) {
  ((e.f &= -257), Hn(e, !0));
}
function Hn(e, t) {
  if (!(e.f & 256) && e.f & 8192) {
    ((e.f ^= S), e.f & 1024 || (nt(e, b), Pt.ensure().schedule(e)));
    for (var n = e.first; n !== null;) {
      var r = n.next,
        i = !!(n.f & 65536) || !!(n.f & 32);
      (Hn(n, i ? t : !1), (n = r));
    }
    var a = e.nodes && e.nodes.t;
    if (a !== null) for (let e of a) (e.is_global || t) && e.in();
  }
}
function Un(e, t) {
  if (e.nodes)
    for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
      var i = n === r ? null : fn(n);
      (t.append(n), (n = i));
    }
}
var Wn = null,
  Gn = !1;
function Kn(e) {
  Gn = e;
}
var qn = null,
  Jn = !1;
function Yn(e) {
  qn = e;
}
var Xn = null;
function Zn(e) {
  Xn = e;
}
var Qn = null;
function $n(e) {
  qn !== null && (qn.f & 2097152 || qn.f & 2) && (Qn ??= new Set()).add(e);
}
var er = null,
  tr = 0,
  nr = null;
function rr(e) {
  nr = e;
}
var ir = 1,
  ar = 0,
  or = ar;
function sr(e) {
  or = e;
}
function cr() {
  return ++ir;
}
function lr(e) {
  var t = e.f;
  if (t & 2048) return !0;
  if (t & 4096) {
    for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
      var a = n[i];
      if ((lr(a) && bt(a), a.wv > e.wv)) return !0;
    }
    t & 512 && Et === null && nt(e, y);
  }
  return !1;
}
function ur(e, t, n = !0) {
  var r = e.reactions;
  if (r !== null && !(Qn !== null && Qn.has(e)))
    for (var i = 0; i < r.length; i++) {
      var a = r[i];
      a.f & 2 ? ur(a, t, !1) : t === a && (n ? nt(a, b) : a.f & 1024 && nt(a, x), zt(a));
    }
}
function dr(e) {
  var t = er,
    n = tr,
    r = nr,
    i = qn,
    a = Qn,
    o = Ge,
    s = Jn,
    c = or,
    l = e.f;
  ((er = null),
    (tr = 0),
    (nr = null),
    (qn = l & 96 ? null : e),
    (Qn = null),
    Ke(e.ctx),
    (Jn = !1),
    (or = ++ar),
    e.ac !== null &&
      (ct(() => {
        e.ac.abort(he);
      }),
      (e.ac = null)));
  try {
    e.f |= re;
    var u = e.fn,
      d = u();
    e.f |= w;
    var f = fr(e);
    if (Xe() && nr !== null && !Jn && f !== null && !(e.f & 6146)) for (var p = 0; p < nr.length; p++) ur(nr[p], e);
    if (i !== null && i !== e) {
      if ((ar++, i.deps !== null)) for (let e = 0; e < n; e += 1) i.deps[e].rv = ar;
      if (t !== null) for (let e of t) e.rv = ar;
      nr !== null && (r === null ? (r = nr) : r.push(...nr));
    }
    return (e.f & 8388608 && (e.f ^= ae), d);
  } catch (t) {
    return (fr(e), _n(t));
  } finally {
    ((e.f ^= re), (er = t), (tr = n), (nr = r), (qn = i), (Qn = a), Ke(o), (Jn = s), (or = c));
  }
}
function fr(e) {
  var t = e.deps,
    n = wt?.is_fork;
  if (er !== null) {
    var r;
    if ((n || mr(e, tr), t !== null && tr > 0))
      for (t.length = tr + er.length, r = 0; r < er.length; r++) t[tr + r] = er[r];
    else e.deps = t = er;
    if (Sn() && e.f & 512) for (r = tr; r < t.length; r++) (t[r].reactions ??= []).push(e);
  } else !n && t !== null && tr < t.length && (mr(e, tr), (t.length = tr));
  return t;
}
function pr(e, t) {
  let n = t.reactions;
  if (n !== null) {
    var a = r.call(n, e);
    if (a !== -1) {
      var o = n.length - 1;
      o === 0 ? (n = t.reactions = null) : ((n[a] = n[o]), n.pop());
    }
  }
  if (n === null && t.f & 2 && (er === null || !i.call(er, t))) {
    var s = t;
    (s.f & 512 && (s.f ^= 512),
      s.v !== ve && rt(s),
      s.ac !== null &&
        ct(() => {
          (s.ac.abort(he), (s.ac = null), nt(s, b));
        }),
      xt(s),
      mr(s, 0));
  }
}
function mr(e, t) {
  var n = e.deps;
  if (n !== null) for (var r = t; r < n.length; r++) pr(e, n[r]);
}
function hr(e) {
  var t = e.f;
  if (!(t & 16384)) {
    nt(e, y);
    var n = Xn;
    Xn = e;
    try {
      (t & 16777232 ? Fn(e) : Pn(e), Nn(e));
      var r = dr(e);
      ((e.teardown = typeof r == `function` ? r : null), (e.wv = ir));
    } finally {
      Xn = n;
    }
  }
}
async function gr() {
  (await Promise.resolve(), Ft());
}
function B(e) {
  var t = !!(e.f & 2);
  if ((Wn?.add(e), qn !== null && !Jn && !(Xn !== null && Xn.f & 16384) && (Qn === null || !Qn.has(e)))) {
    var n = qn.deps;
    if (qn.f & 2097152)
      e.rv < ar &&
        ((e.rv = ar), er === null && n !== null && n[tr] === e ? tr++ : er === null ? (er = [e]) : er.push(e));
    else {
      ((qn.deps ??= []), i.call(qn.deps, e) || qn.deps.push(e));
      var r = e.reactions;
      r === null ? (e.reactions = [qn]) : i.call(r, qn) || r.push(qn);
    }
  }
  if (Gn && Ut.has(e)) return Ut.get(e);
  if (t) {
    var a = e;
    if (Gn) {
      var o = a.v;
      return (((!(a.f & 1024) && a.reactions !== null) || vr(a)) && (o = yt(a)), Ut.set(a, o), o);
    }
    var s = !(a.f & 512) && !Jn && qn !== null && !!(qn.f & 512),
      c = (a.f & w) === 0;
    (lr(a) && (s && (a.f |= 512), bt(a)), s && !c && (St(a), _r(a)));
  }
  if (Et?.has(e)) return Et.get(e);
  if (e.f & 8388608) throw e.v;
  return e.v;
}
function _r(e) {
  if (((e.f |= 512), e.deps !== null))
    for (let n of e.deps) {
      var t = n.reactions;
      (t === null ? (n.reactions = [e]) : i.call(t, e) || t.push(e), n.f & 2 && !(n.f & 512) && (St(n), _r(n)));
    }
}
function vr(e) {
  if (e.v === ve) return !0;
  if (e.deps === null) return !1;
  for (let t of e.deps) if (Ut.has(t) || (t.f & 2 && vr(t))) return !0;
  return !1;
}
function yr(e) {
  var t = Jn;
  try {
    return ((Jn = !0), e());
  } finally {
    Jn = t;
  }
}
function br(e) {
  if (!(typeof e != `object` || !e || e instanceof EventTarget)) {
    if (oe in e) xr(e);
    else if (!Array.isArray(e))
      for (let t in e) {
        let n = e[t];
        typeof n == `object` && n && oe in n && xr(n);
      }
  }
}
function xr(e, t = new Set()) {
  if (typeof e == `object` && e && !(e instanceof EventTarget) && !t.has(e)) {
    (t.add(e), e instanceof Date && e.getTime());
    for (let n in e)
      try {
        xr(e[n], t);
      } catch {}
    let n = d(e);
    if (
      n !== Object.prototype &&
      n !== Array.prototype &&
      n !== Map.prototype &&
      n !== Set.prototype &&
      n !== Date.prototype
    ) {
      let t = c(n);
      for (let n in t) {
        let r = t[n].get;
        if (r)
          try {
            r.call(e);
          } catch {}
      }
    }
  }
}
[
  ...`allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback`.split(
    `.`,
  ),
];
var Sr = [`touchstart`, `touchmove`];
function Cr(e) {
  return Sr.includes(e);
}
var wr = Symbol(`events`),
  Tr = new Set(),
  Er = new Set();
function Dr(e, t, n, r = {}) {
  function i(e) {
    if ((r.capture || Mr.call(t, e), !e.cancelBubble)) return ct(() => n?.call(this, e));
  }
  return (
    e.startsWith(`pointer`) || e.startsWith(`touch`) || e === `wheel`
      ? ((i.__removed = !1),
        $e(() => {
          i.__removed || t.addEventListener(e, i, r);
        }))
      : t.addEventListener(e, i, r),
    i
  );
}
function Or(e, t, n, r, i) {
  var a = {
      capture: r,
      passive: i,
    },
    o = Dr(e, t, n, a);
  (t === document.body || t === window || t === document || t instanceof HTMLMediaElement) &&
    Cn(() => {
      ((o.__removed = !0), t.removeEventListener(e, o, a));
    });
}
function V(e, t, n) {
  (t[wr] ??= {})[e] = n;
}
function kr(e) {
  for (var t = 0; t < e.length; t++) Tr.add(e[t]);
  for (var n of Er) n(e);
}
var Ar = null,
  jr = !1;
function Mr(e) {
  var t = this,
    n = t.ownerDocument,
    r = e.type,
    i = e.composedPath?.() || [],
    a = i[0] || e.target;
  ((Ar = e),
    jr ||
      ((jr = !0),
      setTimeout(() => {
        ((jr = !1), (Ar = null));
      })));
  var s = 0,
    c = Ar === e && e[wr];
  if (c) {
    var l = i.indexOf(c);
    if (l !== -1 && (t === document || t === window)) {
      e[wr] = t;
      return;
    }
    var u = i.indexOf(t);
    if (u === -1) return;
    l <= u && (s = l);
  }
  if (((a = i[s] || e.target), a !== t)) {
    o(e, `currentTarget`, {
      configurable: !0,
      get() {
        return a || n;
      },
    });
    var d = qn,
      f = Xn;
    (Yn(null), Zn(null));
    try {
      for (var p, m = []; a !== null && a !== t;) {
        try {
          var h = a[wr]?.[r];
          h == null || (a.disabled && e.target !== a) || h.call(a, e);
        } catch (e) {
          p ? m.push(e) : (p = e);
        }
        if (e.cancelBubble) break;
        (s++, (a = s < i.length ? i[s] : null));
      }
      if (p) {
        for (let e of m)
          queueMicrotask(() => {
            throw e;
          });
        throw p;
      }
    } finally {
      ((e[wr] = t), delete e.currentTarget, Yn(d), Zn(f));
    }
  }
}
var Nr =
  globalThis?.window?.trustedTypes &&
  globalThis.window.trustedTypes.createPolicy(`svelte-trusted-html`, {
    createHTML: (e) => e,
  });
function Pr(e) {
  return Nr?.createHTML(e) ?? e;
}
function Fr(e) {
  var t = hn(`template`);
  return ((t.innerHTML = Pr(e.replaceAll(`<!>`, `<!---->`))), t.content);
}
function Ir(e, t) {
  var n = Xn;
  n.nodes === null &&
    (n.nodes = {
      start: e,
      end: t,
      a: null,
      t: null,
    });
}
function H(e, t) {
  var n = !!(t & 1),
    r = !!(t & 2),
    i,
    a = !e.startsWith(`<!>`);
  return () => {
    if (O) return (Ir(k, null), k);
    i === void 0 && ((i = Fr(a ? e : `<!>` + e)), n || (i = dn(i)));
    var t = r || on ? document.importNode(i, !0) : i.cloneNode(!0);
    if (n) {
      var o = dn(t),
        s = t.lastChild;
      Ir(o, s);
    } else Ir(t, t);
    return t;
  };
}
function Lr(e, t, n = `svg`) {
  var r = !e.startsWith(`<!>`),
    i = !!(t & 1),
    a = `<${n}>${r ? e : `<!>` + e}</${n}>`,
    o;
  return () => {
    if (O) return (Ir(k, null), k);
    if (!o) {
      var e = dn(Fr(a));
      if (i) for (o = document.createDocumentFragment(); dn(e);) o.appendChild(dn(e));
      else o = dn(e);
    }
    var t = o.cloneNode(!0);
    if (i) {
      var n = dn(t),
        r = t.lastChild;
      Ir(n, r);
    } else Ir(t, t);
    return t;
  };
}
function Rr(e, t) {
  return Lr(e, t, `svg`);
}
function zr(e = ``) {
  if (!O) {
    var t = un(e + ``);
    return (Ir(t, t), t);
  }
  var n = k;
  return (n.nodeType === 3 ? gn(n) : (n.before((n = un())), Te(n)), Ir(n, n), n);
}
function Br() {
  if (O) return (Ir(k, null), k);
  var e = document.createDocumentFragment(),
    t = document.createComment(``),
    n = un();
  return (e.append(t, n), Ir(t, n), e);
}
function U(e, t) {
  if (O) {
    var n = Xn;
    ((n.f & 32768 && n.nodes.end !== null) || (n.nodes.end = k), Ee());
  } else e !== null && e.before(t);
}
function Vr(e) {
  let t = 0,
    n = Gt(0),
    r;
  return () => {
    Sn() &&
      (B(n),
      An(
        () => (
          t === 0 && (r = yr(() => e(() => Qt(n)))),
          (t += 1),
          () => {
            $e(() => {
              (--t, t === 0 && (r?.(), (r = void 0), Qt(n)));
            });
          }
        ),
      ));
  };
}
var Hr = ee | te;
function Ur(e, t, n, r) {
  new Wr(e, t, n, r);
}
var Wr = class {
  parent;
  is_pending = !1;
  transform_error;
  #e;
  #t = O ? k : null;
  #n;
  #r;
  #i;
  #a = null;
  #o = null;
  #s = null;
  #c = null;
  #l = 0;
  #u = 0;
  #d = !1;
  #f = new Map();
  #p = null;
  #m = Vr(
    () => (
      (this.#p = Gt(this.#l)),
      () => {
        this.#p = null;
      }
    ),
  );
  constructor(e, t, n, r) {
    ((this.#e = e),
      (this.#n = t),
      (this.#r = (e) => {
        var t = Xn;
        ((t.b = this), (t.f |= 128), n(e));
      }),
      (this.parent = Xn.b),
      (this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e)),
      (this.#i = jn(() => {
        if (O) {
          let e = Oe(this.#t);
          Ee();
          let t = e === `[!`;
          if (e.startsWith(`[?`)) {
            let t = JSON.parse(e.slice(2));
            this.#g(t);
          } else t ? this.#y() : this.#h();
        } else this.#b();
      }, Hr)),
      O && (this.#e = k));
  }
  #h() {
    try {
      this.#a = Mn(() => this.#r(this.#e));
    } catch (e) {
      this.error(e);
    }
  }
  #g(e) {
    let t = this.#n.failed,
      { reset: n, invoke_onerror: r } = this.#_(e);
    ($e(r),
      t &&
        (this.#s = Mn(() => {
          t(
            this.#e,
            () => e,
            () => n,
          );
        })));
  }
  #_(e) {
    var t = !1,
      n = !1;
    let r = () => {
      this.#v() ||
        (t
          ? Ce()
          : ((t = !0),
            n && He(),
            this.#s !== null &&
              zn(this.#s, () => {
                this.#s = null;
              }),
            this.#S(() => {
              this.#b();
            })));
    };
    return {
      reset: r,
      invoke_onerror: () => {
        if (!this.#v())
          try {
            ((n = !0), this.#n.onerror?.(e, r), (n = !1));
          } catch (e) {
            vn(e, this.#i && this.#i.parent);
          }
      },
    };
  }
  #v() {
    return (this.#i.f & (C | T)) !== 0;
  }
  #y() {
    let e = this.#n.pending;
    e &&
      ((this.is_pending = !0),
      (this.#o = Mn(() => e(this.#e))),
      $e(() => {
        if (!this.#v()) {
          var e = (this.#c = document.createDocumentFragment()),
            t = un(),
            n = !1;
          (e.append(t),
            (this.#a = this.#S(() => {
              try {
                return Mn(() => this.#r(t));
              } catch (e) {
                try {
                  (this.error(e), (n = !0));
                } catch (e) {
                  vn(e, this.#i.parent);
                }
                return null;
              }
            })),
            this.#a === null
              ? ((this.#c = null), n && this.#x(wt))
              : this.#u === 0 &&
                (this.#e.before(e),
                (this.#c = null),
                zn(this.#o, () => {
                  this.#o = null;
                }),
                this.#x(wt)));
        }
      }));
  }
  #b() {
    try {
      if (
        ((this.is_pending = this.has_pending_snippet()),
        (this.#u = 0),
        (this.#l = 0),
        (this.#a = Mn(() => {
          this.#r(this.#e);
        })),
        this.#u > 0)
      ) {
        var e = (this.#c = document.createDocumentFragment());
        Un(this.#a, e);
        let t = this.#n.pending;
        this.#o = Mn(() => t(this.#e));
      } else this.#x(wt);
    } catch (e) {
      this.error(e);
    }
  }
  #x(e) {
    ((this.is_pending = !1), e.transfer_reactions(this.#f));
  }
  defer_effect(e) {
    it(e, this.#f);
  }
  is_rendered() {
    return !this.is_pending && (!this.parent || this.parent.is_rendered());
  }
  has_pending_snippet() {
    return !!this.#n.pending;
  }
  #S(e) {
    var t = Xn,
      n = qn,
      r = Ge;
    (Zn(this.#i), Yn(this.#i), Ke(this.#i.ctx));
    try {
      return (Pt.ensure(), e());
    } finally {
      (Zn(t), Yn(n), Ke(r));
    }
  }
  #C(e, t) {
    this.has_pending_snippet()
      ? ((this.#u += e),
        this.#u === 0 &&
          (this.#x(t),
          this.#o &&
            zn(this.#o, () => {
              this.#o = null;
            }),
          (this.#c &&= (this.#e.before(this.#c), null))))
      : this.parent && this.parent.#C(e, t);
  }
  update_pending_count(e, t) {
    (this.#C(e, t),
      (this.#l += e),
      !(!this.#p || this.#d) &&
        ((this.#d = !0),
        $e(() => {
          ((this.#d = !1), this.#p && Yt(this.#p, this.#l));
        })));
  }
  get_effect_pending() {
    return (this.#m(), B(this.#p));
  }
  error(e) {
    if (e === _e || (!this.#n.onerror && !this.#n.failed)) throw e;
    wt?.is_fork
      ? (this.#a && wt.skip_effect(this.#a),
        this.#o && wt.skip_effect(this.#o),
        this.#s && wt.skip_effect(this.#s),
        wt.oncommit(() => {
          this.#v() || this.#w(e);
        }))
      : this.#w(e);
  }
  #w(e) {
    ((this.#a &&= (In(this.#a), null)),
      (this.#o &&= (In(this.#o), null)),
      (this.#s &&= (In(this.#s), null)),
      O && (Te(this.#t), j(), Te(De())));
    let t = this.#n.failed,
      n = (e) => {
        if (this.#v()) return;
        let { reset: n, invoke_onerror: r } = this.#_(e);
        (r(),
          t &&
            !this.#v() &&
            (this.#s = this.#S(() => {
              try {
                return Mn(() => {
                  var r = Xn;
                  ((r.b = this),
                    (r.f |= 128),
                    t(
                      this.#e,
                      () => e,
                      () => n,
                    ));
                });
              } catch (e) {
                return (vn(e, this.#i.parent), null);
              }
            })));
      };
    $e(() => {
      if (!this.#v()) {
        var t;
        try {
          t = this.transform_error(e);
        } catch (e) {
          vn(e, this.#i && this.#i.parent);
          return;
        }
        typeof t == `object` && t && typeof t.then == `function`
          ? t.then(n, (e) => vn(e, this.#i && this.#i.parent))
          : n(t);
      }
    });
  }
};
function W(e, t) {
  var n = t == null ? `` : typeof t == `object` ? `${t}` : t;
  n !== (e[pe] ??= e.nodeValue) && ((e[pe] = n), (e.nodeValue = `${n}`));
}
function Gr(e, t) {
  return qr(e, t);
}
var Kr = new Map();
function qr(e, { target: t, anchor: n, props: r = {}, events: i, context: o, intro: s = !0, transformError: c }) {
  ln();
  var l = void 0,
    u = Dn(() => {
      var s = n ?? t.appendChild(un());
      Ur(
        s,
        {
          pending: () => {},
        },
        (t) => {
          qe({});
          var n = Ge;
          if (
            (o && (n.c = o),
            i && (r.$$events = i),
            O && Ir(t, null),
            (l = e(t, r) || Ye()),
            O && ((Xn.nodes.end = k), k === null || k.nodeType !== 8 || k.data !== `]`))
          )
            throw (xe(), _e);
          Je();
        },
        c,
      );
      var u = new Set(),
        d = (e) => {
          for (var n = 0; n < e.length; n++) {
            var r = e[n];
            if (!u.has(r)) {
              u.add(r);
              var i = Cr(r);
              for (let e of [t, document]) {
                var a = Kr.get(e);
                a === void 0 && ((a = new Map()), Kr.set(e, a));
                var o = a.get(r);
                o === void 0
                  ? (e.addEventListener(r, Mr, {
                      passive: i,
                    }),
                    a.set(r, 1))
                  : a.set(r, o + 1);
              }
            }
          }
        };
      return (
        d(a(Tr)),
        Er.add(d),
        () => {
          for (var e of u)
            for (let n of [t, document]) {
              var r = Kr.get(n),
                i = r.get(e);
              --i == 0 ? (n.removeEventListener(e, Mr), r.delete(e), r.size === 0 && Kr.delete(n)) : r.set(e, i);
            }
          (Er.delete(d), s !== n && s.parentNode?.removeChild(s));
        }
      );
    });
  return (Jr.set(l, u), l);
}
var Jr = new WeakMap(),
  Yr = class {
    anchor;
    #e = new Map();
    #t = new Map();
    #n = new Map();
    #r = new Set();
    #i = !0;
    constructor(e, t = !0) {
      ((this.anchor = e), (this.#i = t));
    }
    #a = (e) => {
      if (this.#e.has(e)) {
        var t = this.#e.get(e),
          n = this.#t.get(t);
        if (n) (Vn(n), this.#r.delete(t));
        else {
          var r = this.#n.get(t);
          r &&
            (Vn(r.effect),
            this.#t.set(t, r.effect),
            this.#n.delete(t),
            r.fragment.lastChild.remove(),
            this.anchor.before(r.fragment),
            (n = r.effect));
        }
        for (let [t, n] of this.#e) {
          if ((this.#e.delete(t), t === e)) break;
          let r = this.#n.get(n);
          r && (In(r.effect), this.#n.delete(n));
        }
        for (let [e, r] of this.#t) {
          if (e === t || this.#r.has(e)) continue;
          let i = () => {
            if (Array.from(this.#e.values()).includes(e)) {
              var t = document.createDocumentFragment();
              (Un(r, t),
                t.append(un()),
                this.#n.set(e, {
                  effect: r,
                  fragment: t,
                }));
            } else In(r);
            (this.#r.delete(e), this.#t.delete(e));
          };
          this.#i || !n ? (this.#r.add(e), zn(r, i, !1)) : i();
        }
      }
    };
    #o = (e) => {
      this.#e.delete(e);
      let t = Array.from(this.#e.values());
      for (let [e, n] of this.#n) t.includes(e) || (In(n.effect), this.#n.delete(e));
    };
    ensure(e, t) {
      var n = wt,
        r = mn();
      if (t && !this.#t.has(e) && !this.#n.has(e)) {
        if (r) {
          var i = document.createDocumentFragment(),
            a = un();
          (i.append(a),
            this.#n.set(e, {
              effect: Mn(() => t(a)),
              fragment: i,
            }));
        } else
          this.#t.set(
            e,
            Mn(() => t(this.anchor)),
          );
      }
      if ((this.#e.set(n, e), r)) {
        for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
        for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
        (n.oncommit(this.#a), n.ondiscard(this.#o));
      } else (O && (this.anchor = k), this.#a(n));
    }
  };
function G(e, t, n = !1) {
  var r;
  O && ((r = k), Ee());
  var i = new Yr(e),
    a = n ? ee : 0;
  function o(e, t) {
    if (O) {
      var n = Oe(r);
      if (e !== parseInt(n.substring(1))) {
        var a = De();
        (Te(a), (i.anchor = a), we(!1), i.ensure(e, t), we(!0));
        return;
      }
    }
    i.ensure(e, t);
  }
  jn(() => {
    var e = !1;
    (t((t, n = 0) => {
      ((e = !0), o(n, t));
    }),
      e || o(-1, null));
  }, a);
}
var Xr = Symbol(`NaN`);
function Zr(e, t, n) {
  O && Ee();
  var r = new Yr(e),
    i = !Xe();
  jn(() => {
    var e = t();
    (e !== e && (e = Xr), i && typeof e == `object` && e && (e = {}), r.ensure(e, n));
  });
}
function Qr(e, t) {
  return t;
}
function $r(e, t, n) {
  for (var r = [], i = t.length, o, s = t.length, c = 0; c < i; c++) {
    let n = t[c];
    zn(
      n,
      () => {
        if (o) {
          if ((o.pending.delete(n), o.done.add(n), o.pending.size === 0)) {
            var t = e.outrogroups;
            (ei(e, a(o.done)), t.delete(o), t.size === 0 && (e.outrogroups = null));
          }
        } else --s;
      },
      !1,
    );
  }
  if (s === 0) {
    var l = r.length === 0 && n !== null && e.pending.size === 0;
    if (l) {
      var u = n,
        d = u.parentNode;
      (pn(d), d.append(u), e.items.clear());
    }
    ei(e, t, !l);
  } else
    ((o = {
      pending: new Set(t),
      done: new Set(),
    }),
      (e.outrogroups ??= new Set()).add(o));
}
function ei(e, t, n = !0) {
  var r;
  if (e.pending.size > 0) {
    r = new Set();
    for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
  }
  for (var i = 0; i < t.length; i++) {
    var a = t[i];
    r?.has(a) ? ((a.f |= ne), Un(a, document.createDocumentFragment())) : In(t[i], n);
  }
}
var ti;
function K(e, t, r, i, o, s = null) {
  var c = e,
    l = new Map();
  if (t & 4) {
    var u = e;
    c = O ? Te(dn(u)) : u.appendChild(un());
  }
  O && Ee();
  var d = null,
    f = _t(() => {
      var e = r();
      return n(e) ? e : e == null ? [] : a(e);
    }),
    p = new Map(),
    m = !0;
  function h(e) {
    if (!(_.effect.f & 16384)) {
      _.pending.delete(e);
      var n = B(f);
      ((_.fallback = d),
        ri(_, n, c, t, i),
        d !== null &&
          (n.length === 0
            ? d.f & 33554432
              ? ((d.f ^= ne), ai(d, null, c))
              : Vn(d)
            : zn(d, () => {
                d = null;
              })));
    }
  }
  function g(e) {
    _.pending.delete(e);
  }
  var _ = {
    effect: jn(() => {
      var e = B(f),
        n = e.length;
      let a = !1;
      O && (Oe(c) === `[!`) != (n === 0) && ((c = De()), Te(c), we(!1), (a = !0));
      for (var u = new Set(), _ = wt, v = mn(), y = 0; y < n; y += 1) {
        O && k.nodeType === 8 && k.data === `]` && ((c = k), (a = !0), we(!1));
        var b = e[y],
          x = i(b, y),
          S = m ? null : l.get(x);
        (S
          ? (S.v && Yt(S.v, b), S.i && Yt(S.i, y), v && _.unskip_effect(S.e))
          : ((S = ii(l, m ? c : (ti ??= un()), b, x, y, o, t, r)), m || (S.e.f |= ne), l.set(x, S)),
          u.add(x));
      }
      if (
        (n === 0 && s && !d && (m ? (d = Mn(() => s(c))) : ((d = Mn(() => s((ti ??= un())))), (d.f |= ne))),
        n > u.size && Ne(``, ``, ``),
        O && n > 0 && Te(De()),
        !m)
      ) {
        if ((p.set(_, u), v)) {
          for (let [e, t] of l) u.has(e) || _.skip_effect(t.e);
          (_.oncommit(h), _.ondiscard(g));
        } else h(_);
      }
      (a && we(!0), B(f));
    }),
    flags: t,
    items: l,
    pending: p,
    outrogroups: null,
    fallback: d,
  };
  ((m = !1), O && (c = k));
}
function ni(e) {
  for (; e !== null && !(e.f & 32);) e = e.next;
  return e;
}
function ri(e, t, n, r, i) {
  var o = !!(r & 8),
    s = t.length,
    c = e.items,
    l = ni(e.effect.first),
    u,
    d = null,
    f,
    p = [],
    m = [],
    h,
    g,
    _,
    v;
  if (o)
    for (v = 0; v < s; v += 1)
      ((h = t[v]),
        (g = i(h, v)),
        (_ = c.get(g).e),
        _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= new Set()).add(_)));
  for (v = 0; v < s; v += 1) {
    if (((h = t[v]), (g = i(h, v)), (_ = c.get(g).e), e.outrogroups !== null))
      for (let t of e.outrogroups) (t.pending.delete(_), t.done.delete(_));
    if ((_.f & 8192 && (Vn(_), o && (_.nodes?.a?.unfix(), (f ??= new Set()).delete(_))), _.f & 33554432)) {
      if (((_.f ^= ne), _ === l)) ai(_, null, n);
      else {
        var y = d ? d.next : l;
        (_ === e.effect.last && (e.effect.last = _.prev),
          _.prev && (_.prev.next = _.next),
          _.next && (_.next.prev = _.prev),
          oi(e, d, _),
          oi(e, _, y),
          ai(_, y, n),
          (d = _),
          (p = []),
          (m = []),
          (l = ni(d.next)));
        continue;
      }
    }
    if (_ !== l) {
      if (u !== void 0 && u.has(_)) {
        if (p.length < m.length) {
          var b = m[0],
            x;
          d = b.prev;
          var S = p[0],
            C = p[p.length - 1];
          for (x = 0; x < p.length; x += 1) ai(p[x], b, n);
          for (x = 0; x < m.length; x += 1) u.delete(m[x]);
          (oi(e, S.prev, C.next), oi(e, d, S), oi(e, C, b), (l = b), (d = C), --v, (p = []), (m = []));
        } else
          (u.delete(_),
            ai(_, l, n),
            oi(e, _.prev, _.next),
            oi(e, _, d === null ? e.effect.first : d.next),
            oi(e, d, _),
            (d = _));
        continue;
      }
      for (p = [], m = []; l !== null && l !== _;) ((u ??= new Set()).add(l), m.push(l), (l = ni(l.next)));
      if (l === null) continue;
    }
    (_.f & 33554432 || p.push(_), (d = _), (l = ni(_.next)));
  }
  if (e.outrogroups !== null) {
    for (let t of e.outrogroups) t.pending.size === 0 && (ei(e, a(t.done)), e.outrogroups?.delete(t));
    e.outrogroups.size === 0 && (e.outrogroups = null);
  }
  if (l !== null || u !== void 0) {
    var w = [];
    if (u !== void 0) for (_ of u) _.f & 8192 || w.push(_);
    for (; l !== null;) (!(l.f & 8192) && l !== e.fallback && w.push(l), (l = ni(l.next)));
    var T = w.length;
    if (T > 0) {
      var ee = r & 4 && s === 0 ? n : null;
      if (o) {
        for (v = 0; v < T; v += 1) w[v].nodes?.a?.measure();
        for (v = 0; v < T; v += 1) w[v].nodes?.a?.fix();
      }
      $r(e, w, ee);
    }
  }
  o &&
    $e(() => {
      if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
    });
}
function ii(e, t, n, r, i, a, o, s) {
  var c = o & 1 ? (o & 16 ? Gt(n) : Kt(n, !1, !1)) : null,
    l = o & 2 ? Gt(i) : null;
  return {
    v: c,
    i: l,
    e: Mn(
      () => (
        a(t, c ?? n, l ?? i, s),
        () => {
          e.delete(r);
        }
      ),
    ),
  };
}
function ai(e, t, n) {
  if (e.nodes)
    for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
      var o = fn(r);
      if ((a.before(r), r === i)) return;
      r = o;
    }
}
function oi(e, t, n) {
  (t === null ? (e.effect.first = n) : (t.next = n), n === null ? (e.effect.last = t) : (n.prev = t));
}
function si(e, t, ...n) {
  var r = new Yr(e);
  jn(() => {
    let e = t() ?? null;
    r.ensure(e, e && ((t) => e(t, ...n)));
  }, ee);
}
function ci(e, t) {
  let n = null,
    r = O;
  var i;
  if (O) {
    n = k;
    for (var a = dn(document.head); a !== null && (a.nodeType !== 8 || a.data !== e);) a = fn(a);
    if (a === null) we(!1);
    else {
      var o = fn(a);
      (a.remove(), Te(o));
    }
  }
  O || (i = document.head.appendChild(un()));
  try {
    jn(() => {
      var e = Mn(() => t(i));
      ((e.f |= E),
        O ||
          (e.nodes === null
            ? (e.nodes = {
                start: i,
                end: i,
                a: null,
                t: null,
              })
            : (e.nodes.end = i)));
    });
  } finally {
    r && (we(!0), Te(n));
  }
}
function li(e, t, n) {
  On(() => {
    var r = yr(() => t(e, n?.()) || {});
    if (n && r?.update) {
      var i = !1,
        a = {};
      (An(() => {
        var e = n();
        (br(e), i && Ae(a, e) && ((a = e), r.update(e)));
      }),
        (i = !0));
    }
    if (r?.destroy) return () => r.destroy();
  });
}
function ui(e) {
  var t,
    n,
    r = ``;
  if (typeof e == `string` || typeof e == `number`) r += e;
  else if (typeof e == `object`) {
    if (Array.isArray(e)) {
      var i = e.length;
      for (t = 0; t < i; t++) e[t] && (n = ui(e[t])) && (r && (r += ` `), (r += n));
    } else for (n in e) e[n] && (r && (r += ` `), (r += n));
  }
  return r;
}
function di() {
  for (var e, t, n = 0, r = ``, i = arguments.length; n < i; n++)
    (e = arguments[n]) && (t = ui(e)) && (r && (r += ` `), (r += t));
  return r;
}
function fi(e) {
  return typeof e == `object` ? di(e) : (e ?? ``);
}
var pi = [
  ...` 	
\r\f\xA0\v﻿`,
];
function mi(e, t, n) {
  var r = e == null ? `` : `` + e;
  if ((t && (r = r ? r + ` ` + t : t), n)) {
    for (var i of Object.keys(n))
      if (n[i]) r = r ? r + ` ` + i : i;
      else if (r.length)
        for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
          var s = o + a;
          (o === 0 || pi.includes(r[o - 1])) && (s === r.length || pi.includes(r[s]))
            ? (r = (o === 0 ? `` : r.substring(0, o)) + r.substring(s + 1))
            : (o = s);
        }
  }
  return r === `` ? null : r;
}
function hi(e, t = !1) {
  var n = t ? ` !important;` : `;`,
    r = ``;
  for (var i of Object.keys(e)) {
    var a = e[i];
    a != null && a !== `` && (r += ` ` + i + `: ` + a + n);
  }
  return r;
}
function gi(e) {
  return e[0] !== `-` || e[1] !== `-` ? e.toLowerCase() : e;
}
function _i(e, t) {
  if (t) {
    var n = ``,
      r,
      i;
    if ((Array.isArray(t) ? ((r = t[0]), (i = t[1])) : (r = t), e)) {
      e = String(e)
        .replaceAll(/\/\*.*?\*\//g, ``)
        .trim();
      var a = !1,
        o = 0,
        s = !1,
        c = [];
      (r && c.push(...Object.keys(r).map(gi)), i && c.push(...Object.keys(i).map(gi)));
      var l = 0,
        u = -1;
      let t = e.length;
      for (var d = 0; d < t; d++) {
        var f = e[d];
        if (
          (s
            ? f === `/` && e[d - 1] === `*` && (s = !1)
            : a
              ? a === f && (a = !1)
              : f === `/` && e[d + 1] === `*`
                ? (s = !0)
                : f === `"` || f === `'`
                  ? (a = f)
                  : f === `(`
                    ? o++
                    : f === `)` && o--,
          !s && a === !1 && o === 0)
        ) {
          if (f === `:` && u === -1) u = d;
          else if (f === `;` || d === t - 1) {
            if (u !== -1) {
              var p = gi(e.substring(l, u).trim());
              if (!c.includes(p)) {
                f !== `;` && d++;
                var m = e.substring(l, d).trim();
                n += ` ` + m + `;`;
              }
            }
            ((l = d + 1), (u = -1));
          }
        }
      }
    }
    return (r && (n += hi(r)), i && (n += hi(i, !0)), (n = n.trim()), n === `` ? null : n);
  }
  return e == null ? null : String(e);
}
function q(e, t, n, r, i, a) {
  var o = e[de];
  if (O || o !== n || o === void 0) {
    var s = mi(n, r, a);
    ((O && s === e.getAttribute(`class`)) ||
      (s == null ? e.removeAttribute(`class`) : t ? (e.className = s) : e.setAttribute(`class`, s)),
      (e[de] = n));
  } else if (a && i !== a)
    for (var c in a) {
      var l = !!a[c];
      (i == null || l !== !!i[c]) && e.classList.toggle(c, l);
    }
  return a;
}
function vi(e, t = {}, n, r) {
  for (var i in n) {
    var a = n[i];
    t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
  }
}
function yi(e, t, n, r) {
  var i = e[fe];
  if (O || i !== t) {
    var a = _i(t, r);
    ((O && a === e.getAttribute(`style`)) || (a == null ? e.removeAttribute(`style`) : (e.style.cssText = a)),
      (e[fe] = t));
  } else r && (Array.isArray(r) ? (vi(e, n?.[0], r[0]), vi(e, n?.[1], r[1], `important`)) : vi(e, n, r));
  return r;
}
function bi(e, t) {
  t ? e.hasAttribute(`selected`) || e.setAttribute(`selected`, ``) : e.removeAttribute(`selected`);
}
function xi(e, t) {
  var r = e.__defaultValue,
    i = e.multiple,
    a = i ? (r ?? []) : null;
  if (!i || n(a)) {
    var o = e.selectedIndex,
      s = t && i ? new Set(e.selectedOptions) : null;
    for (var c of e.options) {
      var l = Ti(c);
      bi(c, i ? a.includes(l) : nn(l, r));
    }
    if (t) {
      if (s !== null)
        for (c of e.options) {
          var u = s.has(c);
          c.selected !== u && (c.selected = u);
        }
      else e.selectedIndex !== o && (e.selectedIndex = o);
    }
  }
}
function Si(e, t, r = !1) {
  if (e.multiple) {
    if (t == null) return;
    if (!n(t)) return Se();
    for (var i of e.options) i.selected = t.includes(Ti(i));
  } else {
    for (i of e.options)
      if (nn(Ti(i), t)) {
        i.selected = !0;
        return;
      }
    (r && t === void 0) || (e.selectedIndex = -1);
  }
}
function Ci(e) {
  var t = new MutationObserver((t) => {
    t.every(Ei) || (`__defaultValue` in e && xi(e, !1), `__value` in e && Si(e, e.__value));
  });
  (t.observe(e, {
    childList: !0,
    subtree: !0,
    attributes: !0,
    attributeFilter: [`value`],
  }),
    Cn(() => {
      t.disconnect();
    }));
}
function wi(e, t, n = t) {
  var r = new WeakSet(),
    i = !0;
  (lt(e, `change`, (t) => {
    var i = t ? `[selected]` : `:checked`,
      a;
    if (e.multiple) a = [].map.call(e.querySelectorAll(i), Ti);
    else {
      var o = e.querySelector(i) ?? e.querySelector(`option:not([disabled])`);
      a = o && Ti(o);
    }
    (n(a), (e.__value = a), wt !== null && r.add(wt));
  }),
    On(() => {
      var a = t();
      if (e === document.activeElement) {
        var o = wt;
        if (r.has(o)) return;
      }
      if ((Si(e, a, i), i && a === void 0)) {
        var s = e.querySelector(`:checked`);
        s !== null && ((a = Ti(s)), n(a));
      }
      ((e.__value = a), (i = !1));
    }));
}
function Ti(e) {
  return `__value` in e ? e.__value : e.value;
}
function Ei(e) {
  if (e.target.closest(`selectedcontent`) !== null) return !0;
  if (e.type === `childList`) {
    var t = [...e.addedNodes, ...e.removedNodes];
    return t.length > 0 && t.every((e) => e.nodeName === `SELECTEDCONTENT`);
  }
  return !1;
}
var Di = Symbol(`is custom element`),
  Oi = Symbol(`is html`),
  ki = ge ? `link` : `LINK`,
  Ai = ge ? `progress` : `PROGRESS`;
function ji(e) {
  if (O) {
    var t = !1,
      n = () => {
        if (!t) {
          if (((t = !0), e.hasAttribute(`value`))) {
            var n = e.value;
            (J(e, `value`, null), (e.value = n));
          }
          if (e.hasAttribute(`checked`)) {
            var r = e.checked;
            (J(e, `checked`, null), (e.checked = r));
          }
        }
      };
    ((e[me] = n), $e(n), st());
  }
}
function Mi(e, t) {
  var n = Ni(e);
  n.value !== (n.value = t ?? void 0) && (e.value !== t || (t === 0 && e.nodeName === Ai)) && (e.value = t ?? ``);
}
function J(e, t, n, r) {
  var i = Ni(e);
  if (!(O && ((i[t] = e.getAttribute(t)), t === `src` || t === `srcset` || (t === `href` && e.nodeName === ki)))) {
    var a = i[t];
    a !== (i[t] = n) &&
      (t === `loading` && (e[le] = n),
      n == null
        ? e.removeAttribute(t)
        : typeof n != `string` && Fi(e).has(t)
          ? (e[t] = n)
          : (!O || (typeof n != `number` && typeof n != `boolean`) || a !== String(n)) && e.setAttribute(t, n));
  }
}
function Ni(e) {
  return (e[ue] ??= {
    [Di]: e.nodeName.includes(`-`),
    [Oi]: e.namespaceURI === ye,
  });
}
var Pi = new Map();
function Fi(e) {
  var t = e.getAttribute(`is`) || e.nodeName,
    n = Pi.get(t);
  if (n) return n;
  Pi.set(t, (n = new Set()));
  for (var r, i = e, a = Element.prototype; a !== i;) {
    for (var o in ((r = c(i)), r))
      r[o].set && o !== `innerHTML` && o !== `textContent` && o !== `innerText` && n.add(o);
    i = d(i);
  }
  return n;
}
function Ii(e, t, n = t) {
  var r = new WeakSet();
  (lt(e, `input`, async (i) => {
    var a = i ? e.defaultValue : e.value;
    if (((a = Ri(e) ? zi(a) : a), n(a), wt !== null && r.add(wt), await gr(), a !== (a = t()))) {
      var o = e.selectionStart,
        s = e.selectionEnd,
        c = e.value.length;
      if (((e.value = a ?? ``), s !== null)) {
        var l = e.value.length;
        o === s && s === c && l > c
          ? ((e.selectionStart = l), (e.selectionEnd = l))
          : ((e.selectionStart = o), (e.selectionEnd = Math.min(s, l)));
      }
    }
  }),
    ((O && e.defaultValue !== e.value) || (yr(t) == null && e.value)) &&
      (n(Ri(e) ? zi(e.value) : e.value), wt !== null && r.add(wt)),
    An(() => {
      var n = t();
      if (e === document.activeElement) {
        var i = wt;
        if (r.has(i)) return;
      }
      (Ri(e) && n === zi(e.value)) || ((e.type !== `date` || n || e.value) && n !== e.value && (e.value = n ?? ``));
    }));
}
function Li(e, t, n = t) {
  (lt(e, `change`, (t) => {
    n(t ? e.defaultChecked : e.checked);
  }),
    ((O && e.defaultChecked !== e.checked) || yr(t) == null) && n(e.checked),
    An(() => {
      e.checked = !!t();
    }));
}
function Ri(e) {
  var t = e.type;
  return t === `number` || t === `range`;
}
function zi(e) {
  return e === `` ? null : +e;
}
function Bi(e, t) {
  return e === t || e?.[oe] === t;
}
function Vi(e = Ye(), t, n, r) {
  var i = Ge.r,
    a = Xn;
  return (
    On(() => {
      var o, s;
      return (
        An(() => {
          ((o = s),
            (s = r?.() || []),
            yr(() => {
              Bi(n(...s), e) || (t(e, ...s), o && Bi(n(...o), e) && t(null, ...o));
            }));
        }),
        () => {
          let r = a;
          for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
          let o = () => {
              s && Bi(n(...s), e) && t(null, ...s);
            },
            c = r.teardown;
          r.teardown = () => {
            (o(), c?.());
          };
        }
      );
    }),
    e
  );
}
function Hi(e = !1) {
  let t = Ge,
    n = t.l.u;
  if (!n) return;
  let r = () => br(t.s);
  if (e) {
    let e = 0,
      n = {},
      i = mt(() => {
        let r = !1,
          i = t.s;
        for (let e in i) i[e] !== n[e] && ((n[e] = i[e]), (r = !0));
        return (r && e++, e);
      });
    r = () => B(i);
  }
  (n.b.length &&
    En(() => {
      (Ui(t, r), h(n.b));
    }),
    wn(() => {
      let e = yr(() => n.m.map(m));
      return () => {
        for (let t of e) typeof t == `function` && t();
      };
    }),
    n.a.length &&
      wn(() => {
        (Ui(t, r), h(n.a));
      }));
}
function Ui(e, t) {
  if (e.l.s) for (let t of e.l.s) B(t);
  t();
}
var Wi = !1;
function Gi(e) {
  var t = Wi;
  try {
    return ((Wi = !1), [e(), Wi]);
  } finally {
    Wi = t;
  }
}
function Ki(e, t, n, r) {
  var i = !Ue || !!(n & 2),
    a = !!(n & 8),
    o = !!(n & 16),
    c = r,
    l = !0,
    u = void 0,
    d = () => (o && i ? ((u ??= mt(r)), B(u)) : (l && ((l = !1), (c = o ? yr(r) : r)), c));
  let f;
  if (a) {
    var p = oe in e || ce in e;
    f = s(e, t)?.set ?? (p && t in e ? (n) => (e[t] = n) : void 0);
  }
  var m,
    h = !1;
  (a ? ([m, h] = Gi(() => e[t])) : (m = e[t]), m === void 0 && r !== void 0 && ((m = d()), f && (i && Re(t), f(m))));
  var g = i
    ? () => {
        var n = e[t];
        return n === void 0 ? d() : ((l = !0), n);
      }
    : () => {
        var n = e[t];
        return (n !== void 0 && (c = void 0), n === void 0 ? c : n);
      };
  if (i && !(n & 4)) return g;
  if (f) {
    var _ = e.$$legacy;
    return function (e, t) {
      return arguments.length > 0 ? ((!i || !t || _ || h) && f(t ? g() : e), e) : g();
    };
  }
  var v = !1,
    y = (n & 1 ? mt : _t)(() => ((v = !1), g()));
  a && B(y);
  var b = Xn;
  return function (e, t) {
    if (arguments.length > 0) {
      let n = t ? B(y) : i && a ? en(e) : e;
      return (P(y, n), (v = !0), c !== void 0 && (c = n), e);
    }
    return (Gn && v) || b.f & 16384 ? y.v : B(y);
  };
}
typeof window < `u` && ((window.__svelte ??= {}).v ??= new Set()).add(`5`);
