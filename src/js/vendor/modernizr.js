/*! modernizr 3.6.0 (Custom Build) | MIT *
 * https://modernizr.com/download/?-csspositionsticky-cssvhunit-cssvwunit-overflowscrolling-touchevents-addtest-setclasses-teststyles !*/
!(function (e, n, t) {
  function r(e, n) {
    return typeof e === n;
  }
  function o() {
    var e, n, t, o, i, s, l;
    for (var a in S)
      if (S.hasOwnProperty(a)) {
        if (
          ((e = []),
          (n = S[a]),
          n.name &&
            (e.push(n.name.toLowerCase()),
            n.options && n.options.aliases && n.options.aliases.length))
        )
          for (t = 0; t < n.options.aliases.length; t++)
            e.push(n.options.aliases[t].toLowerCase());
        for (o = r(n.fn, 'function') ? n.fn() : n.fn, i = 0; i < e.length; i++)
          (s = e[i]),
            (l = s.split('.')),
            1 === l.length
              ? (Modernizr[l[0]] = o)
              : (!Modernizr[l[0]] ||
                  Modernizr[l[0]] instanceof Boolean ||
                  (Modernizr[l[0]] = new Boolean(Modernizr[l[0]])),
                (Modernizr[l[0]][l[1]] = o)),
            C.push((o ? '' : 'no-') + l.join('-'));
      }
  }
  function i(e) {
    var n = b.className,
      t = Modernizr._config.classPrefix || '';
    if ((z && (n = n.baseVal), Modernizr._config.enableJSClass)) {
      var r = new RegExp('(^|\\s)' + t + 'no-js(\\s|$)');
      n = n.replace(r, '$1' + t + 'js$2');
    }
    Modernizr._config.enableClasses &&
      ((n += ' ' + t + e.join(' ' + t)),
      z ? (b.className.baseVal = n) : (b.className = n));
  }
  function s(e, n) {
    if ('object' == typeof e) for (var t in e) T(e, t) && s(t, e[t]);
    else {
      e = e.toLowerCase();
      var r = e.split('.'),
        o = Modernizr[r[0]];
      if ((2 == r.length && (o = o[r[1]]), 'undefined' != typeof o))
        return Modernizr;
      (n = 'function' == typeof n ? n() : n),
        1 == r.length
          ? (Modernizr[r[0]] = n)
          : (!Modernizr[r[0]] ||
              Modernizr[r[0]] instanceof Boolean ||
              (Modernizr[r[0]] = new Boolean(Modernizr[r[0]])),
            (Modernizr[r[0]][r[1]] = n)),
        i([(n && 0 != n ? '' : 'no-') + r.join('-')]),
        Modernizr._trigger(e, n);
    }
    return Modernizr;
  }
  function l() {
    return 'function' != typeof n.createElement
      ? n.createElement(arguments[0])
      : z
      ? n.createElementNS.call(n, 'http://www.w3.org/2000/svg', arguments[0])
      : n.createElement.apply(n, arguments);
  }
  function a(n, t, r) {
    var o;
    if ('getComputedStyle' in e) {
      o = getComputedStyle.call(e, n, t);
      var i = e.console;
      if (null !== o) r && (o = o.getPropertyValue(r));
      else if (i) {
        var s = i.error ? 'error' : 'log';
        i[s].call(
          i,
          'getComputedStyle returning null, its possible modernizr test results are inaccurate',
        );
      }
    } else o = !t && n.currentStyle && n.currentStyle[r];
    return o;
  }
  function u(e, n) {
    return e - 1 === n || e === n || e + 1 === n;
  }
  function f() {
    var e = n.body;
    return e || ((e = l(z ? 'svg' : 'body')), (e.fake = !0)), e;
  }
  function c(e, t, r, o) {
    var i,
      s,
      a,
      u,
      c = 'modernizr',
      d = l('div'),
      p = f();
    if (parseInt(r, 10))
      for (; r--; )
        (a = l('div')), (a.id = o ? o[r] : c + (r + 1)), d.appendChild(a);
    return (
      (i = l('style')),
      (i.type = 'text/css'),
      (i.id = 's' + c),
      (p.fake ? p : d).appendChild(i),
      p.appendChild(d),
      i.styleSheet
        ? (i.styleSheet.cssText = e)
        : i.appendChild(n.createTextNode(e)),
      (d.id = c),
      p.fake &&
        ((p.style.background = ''),
        (p.style.overflow = 'hidden'),
        (u = b.style.overflow),
        (b.style.overflow = 'hidden'),
        b.appendChild(p)),
      (s = t(d, e)),
      p.fake
        ? (p.parentNode.removeChild(p), (b.style.overflow = u), b.offsetHeight)
        : d.parentNode.removeChild(d),
      !!s
    );
  }
  function d(e, n) {
    return !!~('' + e).indexOf(n);
  }
  function p(e) {
    return e
      .replace(/([a-z])-([a-z])/g, function (e, n, t) {
        return n + t.toUpperCase();
      })
      .replace(/^-/, '');
  }
  function h(e, n) {
    return function () {
      return e.apply(n, arguments);
    };
  }
  function m(e, n, t) {
    var o;
    for (var i in e)
      if (e[i] in n)
        return t === !1
          ? e[i]
          : ((o = n[e[i]]), r(o, 'function') ? h(o, t || n) : o);
    return !1;
  }
  function v(e) {
    return e
      .replace(/([A-Z])/g, function (e, n) {
        return '-' + n.toLowerCase();
      })
      .replace(/^ms-/, '-ms-');
  }
  function g(n, r) {
    var o = n.length;
    if ('CSS' in e && 'supports' in e.CSS) {
      for (; o--; ) if (e.CSS.supports(v(n[o]), r)) return !0;
      return !1;
    }
    if ('CSSSupportsRule' in e) {
      for (var i = []; o--; ) i.push('(' + v(n[o]) + ':' + r + ')');
      return (
        (i = i.join(' or ')),
        c(
          '@supports (' + i + ') { #modernizr { position: absolute; } }',
          function (e) {
            return 'absolute' == a(e, null, 'position');
          },
        )
      );
    }
    return t;
  }
  function y(e, n, o, i) {
    function s() {
      u && (delete q.style, delete q.modElem);
    }
    if (((i = r(i, 'undefined') ? !1 : i), !r(o, 'undefined'))) {
      var a = g(e, o);
      if (!r(a, 'undefined')) return a;
    }
    for (
      var u, f, c, h, m, v = ['modernizr', 'tspan', 'samp'];
      !q.style && v.length;

    )
      (u = !0), (q.modElem = l(v.shift())), (q.style = q.modElem.style);
    for (c = e.length, f = 0; c > f; f++)
      if (
        ((h = e[f]),
        (m = q.style[h]),
        d(h, '-') && (h = p(h)),
        q.style[h] !== t)
      ) {
        if (i || r(o, 'undefined')) return s(), 'pfx' == n ? h : !0;
        try {
          q.style[h] = o;
        } catch (y) {}
        if (q.style[h] != m) return s(), 'pfx' == n ? h : !0;
      }
    return s(), !1;
  }
  function _(e, n, t, o, i) {
    var s = e.charAt(0).toUpperCase() + e.slice(1),
      l = (e + ' ' + k.join(s + ' ') + s).split(' ');
    return r(n, 'string') || r(n, 'undefined')
      ? y(l, n, o, i)
      : ((l = (e + ' ' + N.join(s + ' ') + s).split(' ')), m(l, n, t));
  }
  function w(e, n, r) {
    return _(e, t, t, n, r);
  }
  var C = [],
    S = [],
    x = {
      _version: '3.6.0',
      _config: {
        classPrefix: '',
        enableClasses: !0,
        enableJSClass: !0,
        usePrefixes: !0,
      },
      _q: [],
      on: function (e, n) {
        var t = this;
        setTimeout(function () {
          n(t[e]);
        }, 0);
      },
      addTest: function (e, n, t) {
        S.push({ name: e, fn: n, options: t });
      },
      addAsyncTest: function (e) {
        S.push({ name: null, fn: e });
      },
    },
    Modernizr = function () {};
  (Modernizr.prototype = x), (Modernizr = new Modernizr());
  var T,
    b = n.documentElement,
    z = 'svg' === b.nodeName.toLowerCase();
  !(function () {
    var e = {}.hasOwnProperty;
    T =
      r(e, 'undefined') || r(e.call, 'undefined')
        ? function (e, n) {
            return n in e && r(e.constructor.prototype[n], 'undefined');
          }
        : function (n, t) {
            return e.call(n, t);
          };
  })(),
    (x._l = {}),
    (x.on = function (e, n) {
      this._l[e] || (this._l[e] = []),
        this._l[e].push(n),
        Modernizr.hasOwnProperty(e) &&
          setTimeout(function () {
            Modernizr._trigger(e, Modernizr[e]);
          }, 0);
    }),
    (x._trigger = function (e, n) {
      if (this._l[e]) {
        var t = this._l[e];
        setTimeout(function () {
          var e, r;
          for (e = 0; e < t.length; e++) (r = t[e])(n);
        }, 0),
          delete this._l[e];
      }
    }),
    Modernizr._q.push(function () {
      x.addTest = s;
    });
  var P = x._config.usePrefixes
    ? ' -webkit- -moz- -o- -ms- '.split(' ')
    : ['', ''];
  (x._prefixes = P),
    Modernizr.addTest('csspositionsticky', function () {
      var e = 'position:',
        n = 'sticky',
        t = l('a'),
        r = t.style;
      return (
        (r.cssText = e + P.join(n + ';' + e).slice(0, -e.length)),
        -1 !== r.position.indexOf(n)
      );
    });
  var j = (x.testStyles = c);
  Modernizr.addTest('touchevents', function () {
    var t;
    if ('ontouchstart' in e || (e.DocumentTouch && n instanceof DocumentTouch))
      t = !0;
    else {
      var r = [
        '@media (',
        P.join('touch-enabled),('),
        'heartz',
        ')',
        '{#modernizr{top:9px;position:absolute}}',
      ].join('');
      j(r, function (e) {
        t = 9 === e.offsetTop;
      });
    }
    return t;
  }),
    j('#modernizr { height: 50vh; }', function (n) {
      var t = parseInt(e.innerHeight / 2, 10),
        r = parseInt(a(n, null, 'height'), 10);
      Modernizr.addTest('cssvhunit', u(r, t));
    }),
    j('#modernizr { width: 50vw; }', function (n) {
      var t = parseInt(e.innerWidth / 2, 10),
        r = parseInt(a(n, null, 'width'), 10);
      Modernizr.addTest('cssvwunit', u(r, t));
    });
  var E = 'Moz O ms Webkit',
    k = x._config.usePrefixes ? E.split(' ') : [];
  x._cssomPrefixes = k;
  var N = x._config.usePrefixes ? E.toLowerCase().split(' ') : [];
  x._domPrefixes = N;
  var O = { elem: l('modernizr') };
  Modernizr._q.push(function () {
    delete O.elem;
  });
  var q = { style: O.elem.style };
  Modernizr._q.unshift(function () {
    delete q.style;
  }),
    (x.testAllProps = _),
    (x.testAllProps = w),
    Modernizr.addTest('overflowscrolling', w('overflowScrolling', 'touch', !0)),
    o(),
    i(C),
    delete x.addTest,
    delete x.addAsyncTest;
  for (var A = 0; A < Modernizr._q.length; A++) Modernizr._q[A]();
  e.Modernizr = Modernizr;
})(window, document);
