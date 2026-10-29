/* ==========================================================================
   Mis Simuladores · motor compartido
   Sin dependencias. Funciona abriendo los archivos con doble clic (file://).
   ========================================================================== */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var TAU = Math.PI * 2;
  var FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI Variable Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function map(v, a, b, c, d) { return c + (d - c) * ((v - a) / (b - a)); }
  function fmt(v, d) { d = d == null ? 2 : d; var n = Math.abs(v) < 1e-9 ? 0 : v; return n.toFixed(d); }
  function rand(a, b) { a = a == null ? 0 : a; b = b == null ? 1 : b; return a + Math.random() * (b - a); }
  function font(size, weight) { return (weight || 500) + ' ' + size + 'px ' + FONT; }

  /* ------------------------------------------------------------------ paleta */
  function pal(dark) {
    if (dark) return {
      dark: true,
      bg: '#0b0b0d', bg2: '#111114', card: '#1c1c1e',
      ink: '#f5f5f7', dim: '#98989d', faint: '#48484a',
      grid: 'rgba(255,255,255,.075)', track: 'rgba(120,120,128,.24)', line: 'rgba(255,255,255,.13)',
      blue: '#0a84ff', green: '#30d158', orange: '#ff9f0a', purple: '#bf5af2',
      teal: '#64d2ff', pink: '#ff375f', yellow: '#ffd60a', indigo: '#5e5ce6',
      red: '#ff453a', glass: 'rgba(28,28,30,.74)'
    };
    return {
      dark: false,
      bg: '#ffffff', bg2: '#f7f7fa', card: '#ffffff',
      ink: '#1d1d1f', dim: '#6e6e73', faint: '#aeaeb2',
      grid: 'rgba(0,0,0,.07)', track: 'rgba(120,120,128,.12)', line: 'rgba(0,0,0,.1)',
      blue: '#0a84ff', green: '#30d158', orange: '#ff9f0a', purple: '#bf5af2',
      teal: '#64d2ff', pink: '#ff375f', yellow: '#ffd60a', indigo: '#5e5ce6',
      red: '#ff453a', glass: 'rgba(255,255,255,.78)'
    };
  }

  var palette = pal(false);
  var themeSubs = [];
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function themePref() {
    try { return localStorage.getItem('simTheme') || 'auto'; } catch (e) { return 'auto'; }
  }
  function isDark() {
    var t = themePref();
    return t === 'dark' || (t === 'auto' && !!mq && mq.matches);
  }
  function applyTheme() {
    var t = themePref();
    var dark = t === 'dark' || (t === 'auto' && !!mq && mq.matches);
    root.setAttribute('data-theme', t);
    root.setAttribute('data-resolved', dark ? 'dark' : 'light');
    palette = pal(dark);
    var meta = doc.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#000000' : '#f5f5f7');
    paintThemeBtn();
    themeSubs.forEach(function (fn) {
      try { fn(dark, palette); } catch (err) { console.error(err); }
    });
  }
  function onTheme(fn) { themeSubs.push(fn); }

  /* ------------------------------------------------------------------ sonido */
  var soundOn = true;
  try { soundOn = localStorage.getItem('simSound') !== '0'; } catch (e) {}
  var actx = null;

  function audioCtx() {
    if (!soundOn) return null;
    try {
      if (!actx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        actx = new AC();
      }
      if (actx.state === 'suspended') actx.resume();
      return actx;
    } catch (e) { return null; }
  }
  function beep(freq, dur, type, vol) {
    var a = audioCtx();
    if (!a) return;
    try {
      var o = a.createOscillator();
      var g = a.createGain();
      o.type = type || 'sine';
      o.frequency.value = freq || 660;
      var t = a.currentTime;
      var d = dur || 0.09;
      var v = vol == null ? 0.055 : vol;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(v, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g);
      g.connect(a.destination);
      o.start(t);
      o.stop(t + d + 0.03);
    } catch (e) {}
  }
  function chord(freqs, dur, gap) {
    (freqs || [523.25, 659.25, 783.99]).forEach(function (f, i) {
      setTimeout(function () { beep(f, dur || 0.16, 'sine', 0.048); }, i * (gap == null ? 85 : gap));
    });
  }

  /* ------------------------------------------------------------------ iconos */
  var ICON = {
    sound: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5v5h3.2L12 18V6L7.2 9.5H4z"/><path d="M15.5 9a4.2 4.2 0 0 1 0 6"/><path d="M18 6.8a7.4 7.4 0 0 1 0 10.4"/></svg>',
    mute: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5v5h3.2L12 18V6L7.2 9.5H4z"/><path d="M16 10l4 4M20 10l-4 4"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4.1"/><path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4L17 7M7 17l-1.6 1.6"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.2 8.2 0 1 0 10.2 10.2z"/></svg>',
    auto: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8.2"/><path d="M12 3.8v16.4" /><path d="M12 3.8a8.2 8.2 0 0 1 0 16.4z" fill="currentColor" stroke="none"/></svg>',
    full: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5"/></svg>',
    exit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M4 9h5V4M20 9h-5V4M4 15h5v5M20 15h-5v5"/></svg>'
  };

  /* ------------------------------------------------------------------ barra */
  function paintThemeBtn() {
    var b = doc.getElementById('btnTheme');
    if (!b) return;
    var t = themePref();
    b.innerHTML = t === 'dark' ? ICON.moon : (t === 'light' ? ICON.sun : ICON.auto);
    b.title = 'Tema: ' + (t === 'auto' ? 'automático' : (t === 'dark' ? 'oscuro' : 'claro')) + ' · clic para cambiar';
    b.setAttribute('aria-label', b.title);
  }
  function paintSoundBtn() {
    var b = doc.getElementById('btnSound');
    if (!b) return;
    b.innerHTML = soundOn ? ICON.sound : ICON.mute;
    b.title = soundOn ? 'Sonido activado' : 'Sonido desactivado';
    b.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
    b.setAttribute('aria-label', b.title);
  }
  function paintFullBtn() {
    var b = doc.getElementById('btnFull');
    if (!b) return;
    var on = !!doc.fullscreenElement;
    b.innerHTML = on ? ICON.exit : ICON.full;
    b.title = on ? 'Salir de pantalla completa' : 'Pantalla completa (F)';
    b.setAttribute('aria-label', b.title);
  }
  function toggleFull() {
    try {
      if (!doc.fullscreenElement) {
        var p = root.requestFullscreen && root.requestFullscreen();
        if (p && p.catch) p.catch(function () {});
      } else if (doc.exitFullscreen) {
        doc.exitFullscreen();
      }
    } catch (e) {}
  }

  var helpEl = null;
  function help(html) {
    var stage = doc.querySelector('.stage');
    if (!stage) return;
    if (helpEl) helpEl.parentNode && helpEl.parentNode.removeChild(helpEl);
    helpEl = doc.createElement('div');
    helpEl.className = 'helpcard';
    helpEl.innerHTML =
      '<div class="inner"><h2>¿Cómo funciona?</h2><div class="hc">' + html + '</div>' +
      '<button class="btn primary" type="button">Entendido</button></div>';
    stage.appendChild(helpEl);
    helpEl.querySelector('button').addEventListener('click', function () { closeHelp(); });
    helpEl.addEventListener('click', function (e) { if (e.target === helpEl) closeHelp(); });
  }
  function toggleHelp() {
    if (!helpEl) return;
    helpEl.classList.toggle('show');
    if (helpEl.classList.contains('show')) beep(600, 0.06, 'sine', 0.03);
  }
  function closeHelp() { if (helpEl) helpEl.classList.remove('show'); }

  var hintTimer = 0;
  function hint(text, ms) {
    var stage = doc.querySelector('.stage');
    if (!stage) return;
    var el = stage.querySelector('.hint');
    if (!el) {
      el = doc.createElement('div');
      el.className = 'hint';
      stage.appendChild(el);
    }
    el.textContent = text;
    void el.offsetWidth;
    el.classList.add('show');
    clearTimeout(hintTimer);
    hintTimer = setTimeout(function () { el.classList.remove('show'); }, ms == null ? 7500 : ms);
  }

  function initBar() {
    var bHelp = doc.getElementById('btnHelp');
    if (bHelp) bHelp.addEventListener('click', toggleHelp);

    var bTheme = doc.getElementById('btnTheme');
    if (bTheme) bTheme.addEventListener('click', function () {
      var seq = ['auto', 'light', 'dark'];
      var cur = themePref();
      var next = seq[(seq.indexOf(cur) + 1) % 3];
      try { localStorage.setItem('simTheme', next); } catch (e) {}
      applyTheme();
      beep(520, 0.05, 'sine', 0.028);
    });

    var bSound = doc.getElementById('btnSound');
    if (bSound) bSound.addEventListener('click', function () {
      soundOn = !soundOn;
      try { localStorage.setItem('simSound', soundOn ? '1' : '0'); } catch (e) {}
      paintSoundBtn();
      if (soundOn) chord([640, 890], 0.07, 45);
    });

    var bFull = doc.getElementById('btnFull');
    if (bFull) bFull.addEventListener('click', toggleFull);

    doc.addEventListener('keydown', function (e) {
      var tag = e.target && e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'f' || e.key === 'F') { toggleFull(); }
      else if (e.key === '?' || e.key === '¿') { e.preventDefault(); toggleHelp(); }
      else if (e.key === 'Escape') { closeHelp(); }
    });
    doc.addEventListener('fullscreenchange', paintFullBtn);
    doc.addEventListener('webkitfullscreenchange', paintFullBtn);

    paintThemeBtn();
    paintSoundBtn();
    paintFullBtn();
  }

  /* ------------------------------------------------------------------ canvas */
  function view(canvas, draw) {
    var v = {
      canvas: canvas,
      ctx: canvas.getContext('2d'),
      w: 0,
      h: 0,
      dpr: 1
    };
    v.render = function () {
      if (!v.w) return;
      var ctx = v.ctx;
      ctx.setTransform(v.dpr, 0, 0, v.dpr, 0, 0);
      try {
        draw(ctx, v.w, v.h, v);
      } catch (err) {
        console.error(err);
      }
    };
    function size() {
      var parent = canvas.parentElement;
      var r = parent.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      var w = Math.max(1, Math.round(r.width));
      var h = Math.max(1, Math.round(r.height));
      if (w === v.w && h === v.h && dpr === v.dpr) { v.render(); return; }
      v.w = w;
      v.h = h;
      v.dpr = dpr;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      if (v.onResize) v.onResize(w, h);
      v.render();
    }
    v.size = size;
    if (window.ResizeObserver) {
      new ResizeObserver(size).observe(canvas.parentElement);
    } else {
      window.addEventListener('resize', size);
    }
    size();
    return v;
  }

  function loop(fn) {
    var last = performance.now();
    var raf = 0;
    var dead = false;
    function tick(now) {
      if (dead) return;
      var dt = (now - last) / 1000;
      last = now;
      if (!(dt > 0)) dt = 0;
      if (dt > 1 / 20) dt = 1 / 20;
      try {
        fn(dt);
      } catch (err) {
        console.error(err);
        dead = true;
        return;
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return {
      stop: function () { dead = true; cancelAnimationFrame(raf); }
    };
  }

  /* ------------------------------------------------------------------ dibujo */
  function rr(ctx, x, y, w, h, r) {
    r = Math.min(r == null ? 8 : r, Math.abs(w) / 2, Math.abs(h) / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function arrow(ctx, x1, y1, x2, y2, o) {
    o = o || {};
    var dx = x2 - x1, dy = y2 - y1;
    var len = Math.hypot(dx, dy);
    if (len < 0.6) return len;
    var head = Math.min(o.head || 9, len * 0.52);
    var ang = Math.atan2(dy, dx);
    ctx.save();
    ctx.strokeStyle = o.color || palette.ink;
    ctx.fillStyle = o.color || palette.ink;
    ctx.lineWidth = o.width || 2.4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2 - Math.cos(ang) * head * 0.72, y2 - Math.sin(ang) * head * 0.72);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - Math.cos(ang - 0.42) * head, y2 - Math.sin(ang - 0.42) * head);
    ctx.lineTo(x2 - Math.cos(ang + 0.42) * head, y2 - Math.sin(ang + 0.42) * head);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    return len;
  }

  function tag(ctx, text, x, y, o) {
    o = o || {};
    var size = o.size || 10.5;
    ctx.save();
    ctx.font = font(size, o.weight || 650);
    var padX = o.padX == null ? 6.5 : o.padX;
    var h = size + 9;
    var w = ctx.measureText(text).width + padX * 2;
    var tx = x - w / 2;
    if (o.align === 'left') tx = x;
    else if (o.align === 'right') tx = x - w;
    var ty = y - h / 2;
    ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
    rr(ctx, tx, ty, w, h, h / 2);
    ctx.fillStyle = o.bg || palette.card;
    ctx.fill();
    if (o.stroke !== false) {
      ctx.strokeStyle = o.line || palette.line;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.fillStyle = o.color || palette.ink;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, tx + w / 2, ty + h / 2 + 0.5);
    ctx.restore();
    return w;
  }

  /* ------------------------------------------------------------------ puntero */
  function pointer(canvas, h) {
    var active = false;
    var pid = null;
    var lx = 0, ly = 0;
    function pos(e) {
      var r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }
    canvas.addEventListener('pointerdown', function (e) {
      var p = pos(e);
      lx = p.x; ly = p.y;
      if (h.down) {
        var keep = h.down(p.x, p.y, e);
        if (keep === false) return;
      }
      active = true;
      pid = e.pointerId;
      try { canvas.setPointerCapture(pid); } catch (err) {}
      e.preventDefault();
    });
    canvas.addEventListener('pointermove', function (e) {
      var p = pos(e);
      lx = p.x; ly = p.y;
      if (active) {
        if (h.move) h.move(p.x, p.y, e);
        e.preventDefault();
      } else if (h.hover) {
        h.hover(p.x, p.y, e);
      }
    });
    function end(e) {
      if (!active) return;
      active = false;
      var p = pos(e);
      if (h.up) h.up(p.x, p.y, e);
      try { canvas.releasePointerCapture(pid); } catch (err) {}
      pid = null;
    }
    canvas.addEventListener('pointerup', end);
    canvas.addEventListener('pointercancel', end);
    canvas.addEventListener('pointerleave', function (e) {
      if (!active && h.leave) h.leave(e);
    });
    return {
      isActive: function () { return active; },
      pos: function () { return { x: lx, y: ly }; }
    };
  }

  /* ------------------------------------------------------------------ confeti */
  function fx() {
    var ps = [];
    return {
      burst: function (x, y, o) {
        o = o || {};
        var n = o.n || 38;
        var colors = o.colors || [palette.blue, palette.green, palette.orange, palette.pink, palette.purple, palette.yellow];
        var speed = o.speed == null ? 300 : o.speed;
        for (var i = 0; i < n; i++) {
          var a = rand(0, TAU);
          var sp = rand(0.25, 1) * speed;
          ps.push({
            x: x, y: y,
            vx: Math.cos(a) * sp,
            vy: Math.sin(a) * sp - (o.up == null ? 70 : o.up),
            life: rand(0.55, 1.2),
            age: 0,
            size: rand(2.5, 6.5),
            color: colors[(Math.random() * colors.length) | 0],
            rot: rand(0, TAU),
            vr: rand(-9, 9),
            shape: Math.random() < 0.42 ? 'rect' : 'dot'
          });
        }
      },
      update: function (dt) {
        for (var i = ps.length - 1; i >= 0; i--) {
          var p = ps[i];
          p.age += dt;
          if (p.age >= p.life) { ps.splice(i, 1); continue; }
          p.vy += 560 * dt;
          p.vx *= (1 - 0.85 * dt);
          p.vy *= (1 - 0.15 * dt);
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.rot += p.vr * dt;
        }
      },
      draw: function (ctx) {
        for (var i = 0; i < ps.length; i++) {
          var p = ps[i];
          var k = 1 - p.age / p.life;
          ctx.globalAlpha = Math.max(0, Math.min(1, k * 1.6));
          ctx.fillStyle = p.color;
          if (p.shape === 'rect') {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.45);
            ctx.restore();
          } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 0.5, 0, TAU);
            ctx.fill();
          }
        }
        ctx.globalAlpha = 1;
      },
      clear: function () { ps.length = 0; },
      count: function () { return ps.length; }
    };
  }

  /* ------------------------------------------------------------------ gráficas */
  function chart(canvas, o) {
    o = o || {};
    var opts = {
      window: o.window == null ? 10 : o.window,
      series: o.series || [],
      yFmt: o.yFmt || function (v) {
        var a = Math.abs(v);
        if (a >= 100) return v.toFixed(0);
        if (a >= 10) return v.toFixed(1);
        return v.toFixed(2);
      },
      autoZero: o.autoZero !== false,
      minSpan: o.minSpan == null ? 1 : o.minSpan,
      yMin: o.yMin,
      yMax: o.yMax
    };
    var ctx = canvas.getContext('2d');
    var data = [];
    var lastT = 0;

    var api = {
      push: function (t, vals) {
        lastT = t;
        var arr = Array.isArray(vals) ? vals : [vals];
        data.push({ t: t, v: arr });
        var cutoff = t - opts.window * 2 - 1;
        while (data.length && data[0].t < cutoff) data.shift();
      },
      clear: function () {
        data.length = 0;
        lastT = 0;
        api.render();
      },
      series: opts.series,
      setWindow: function (w) { opts.window = w; },
      last: function () { return lastT; },
      render: function () {
        var dpr = Math.min(window.devicePixelRatio || 1, 2.5);
        var cw = canvas.clientWidth || 300;
        var ch = canvas.clientHeight || 128;
        if (canvas.width !== Math.round(cw * dpr) || canvas.height !== Math.round(ch * dpr)) {
          canvas.width = Math.round(cw * dpr);
          canvas.height = Math.round(ch * dpr);
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, cw, ch);

        var padL = 34, padR = 9, padT = 14, padB = 15;
        var x0 = padL, x1 = cw - padR, y0 = padT, y1 = ch - padB;

        var tEnd = Math.max(lastT, opts.window);
        var tStart = tEnd - opts.window;

        var lo = Infinity, hi = -Infinity;
        for (var i = 0; i < data.length; i++) {
          if (data[i].t < tStart) continue;
          for (var j = 0; j < opts.series.length; j++) {
            var val = data[i].v[j];
            if (typeof val !== 'number' || !isFinite(val)) continue;
            if (val < lo) lo = val;
            if (val > hi) hi = val;
          }
        }
        if (!isFinite(lo)) { lo = 0; hi = 1; }
        if (opts.yMin != null) lo = opts.yMin;
        if (opts.yMax != null) hi = opts.yMax;
        if (opts.autoZero) {
          if (lo > 0) lo = 0;
          if (hi < 0) hi = 0;
        }
        if (hi - lo < opts.minSpan) {
          var mid = (lo + hi) / 2;
          lo = mid - opts.minSpan / 2;
          hi = mid + opts.minSpan / 2;
        }
        var span = hi - lo;
        lo -= span * 0.1;
        hi += span * 0.1;

        function px(t) { return x0 + ((t - tStart) / (tEnd - tStart)) * (x1 - x0); }
        function py(v) { return y1 - ((v - lo) / (hi - lo)) * (y1 - y0); }

        ctx.font = font(9, 500);
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'right';
        ctx.lineWidth = 1;

        for (var g = 0; g <= 3; g++) {
          var valY = lo + (hi - lo) * (g / 3);
          var yy = py(valY);
          ctx.strokeStyle = palette.grid;
          ctx.beginPath();
          ctx.moveTo(x0, yy + 0.5);
          ctx.lineTo(x1, yy + 0.5);
          ctx.stroke();
          ctx.fillStyle = palette.dim;
          ctx.fillText(opts.yFmt(valY), x0 - 5, yy);
        }

        if (lo < 0 && hi > 0) {
          ctx.strokeStyle = palette.line;
          ctx.beginPath();
          ctx.moveTo(x0, py(0) + 0.5);
          ctx.lineTo(x1, py(0) + 0.5);
          ctx.stroke();
        }

        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        for (var k = 0; k <= 2; k++) {
          var tv = tStart + (tEnd - tStart) * (k / 2);
          ctx.fillStyle = palette.dim;
          ctx.fillText((Math.round(tv * 10) / 10).toFixed(tv >= 10 ? 0 : 1) + ' s', px(tv), ch - 3);
        }

        ctx.save();
        ctx.beginPath();
        ctx.rect(x0, y0 - 2, x1 - x0, y1 - y0 + 4);
        ctx.clip();
        for (var s = 0; s < opts.series.length; s++) {
          var ser = opts.series[s];
          var color = palette[ser.color] || ser.color || palette.blue;
          var started = false;
          ctx.beginPath();
          for (var n = 0; n < data.length; n++) {
            if (data[n].t < tStart) continue;
            var vv = data[n].v[s];
            if (typeof vv !== 'number' || !isFinite(vv)) { started = false; continue; }
            var xx = px(data[n].t);
            var yv = py(vv);
            if (!started) { ctx.moveTo(xx, yv); started = true; }
            else { ctx.lineTo(xx, yv); }
          }
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.9;
          ctx.lineJoin = 'round';
          ctx.lineCap = 'round';
          ctx.stroke();
          if (data.length === 1) {
            var only = data[0].v[s];
            if (typeof only === 'number') {
              ctx.beginPath();
              ctx.arc(px(data[0].t), py(only), 2.2, 0, TAU);
              ctx.fillStyle = color;
              ctx.fill();
            }
          }
        }
        ctx.restore();

        var lx = x0 + 3;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.font = font(9, 650);
        for (var q = 0; q < opts.series.length; q++) {
          var sq = opts.series[q];
          var cq = palette[sq.color] || sq.color || palette.blue;
          ctx.fillStyle = cq;
          ctx.beginPath();
          ctx.arc(lx + 3, y0 + 2, 3, 0, TAU);
          ctx.fill();
          ctx.fillStyle = palette.dim;
          ctx.fillText(sq.label, lx + 9, y0 + 2.5);
          lx += 9 + ctx.measureText(sq.label).width + 12;
        }
      }
    };
    onTheme(function () { api.render(); });
    return api;
  }

  /* ------------------------------------------------------------------ UI panel */
  function el(tag, cls, html) {
    var n = doc.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function panelRoot(parent) { return parent || doc.getElementById('panel') || doc.body; }

  function sec(parent, title) {
    var s = el('div', 'psec');
    if (title) s.appendChild(el('h3', null, title));
    panelRoot(parent).appendChild(s);
    return s;
  }

  function slider(parent, o) {
    var row = el('div', 'ctl');
    var head = el('div', 'ctlhead');
    var lab = el('label', null, o.label || '');
    var out = el('output');
    head.appendChild(lab);
    head.appendChild(out);
    var inp = el('input');
    inp.type = 'range';
    inp.min = o.min;
    inp.max = o.max;
    inp.step = o.step == null ? 1 : o.step;
    inp.value = o.value;
    inp.setAttribute('aria-label', o.label || '');
    row.appendChild(head);
    row.appendChild(inp);
    (parent || panelRoot()).appendChild(row);

    var digits = o.digits == null ? ((+o.step && +o.step < 1) ? 1 : 0) : o.digits;
    function paint() {
      var pc = ((+inp.value - +inp.min) / (+inp.max - +inp.min)) * 100;
      inp.style.setProperty('--p', clamp(pc, 0, 100).toFixed(2) + '%');
      out.textContent = o.fmt ? o.fmt(+inp.value) : (+inp.value).toFixed(digits) + (o.unit ? ' ' + o.unit : '');
    }
    inp.addEventListener('input', function () {
      paint();
      if (o.onInput) o.onInput(+inp.value);
    });
    paint();
    return {
      row: row,
      input: inp,
      get: function () { return +inp.value; },
      set: function (v, silent) {
        inp.value = v;
        paint();
        if (!silent && o.onInput) o.onInput(+inp.value);
      },
      disable: function (d) {
        inp.disabled = !!d;
        row.style.opacity = d ? '.42' : '';
      }
    };
  }

  function seg(parent, o) {
    var wrap = el('div', 'seg');
    var btns = [];
    var current = o.value != null ? String(o.value) : String((o.options[0] || [])[0]);
    (o.options || []).forEach(function (pair) {
      var val = String(pair[0]);
      var b = el('button', null, pair[1]);
      b.type = 'button';
      b.dataset.v = val;
      b.classList.toggle('on', val === current);
      b.addEventListener('click', function () {
        current = val;
        btns.forEach(function (x) { x.classList.toggle('on', x === b); });
        beep(470, 0.045, 'triangle', 0.024);
        if (o.onChange) o.onChange(val);
      });
      wrap.appendChild(b);
      btns.push(b);
    });
    (parent || panelRoot()).appendChild(wrap);
    return {
      el: wrap,
      get: function () { return current; },
      set: function (v) {
        current = String(v);
        btns.forEach(function (x) { x.classList.toggle('on', x.dataset.v === current); });
      }
    };
  }

  function toggle(parent, o) {
    var lab = el('label', 'switch');
    var inp = el('input');
    inp.type = 'checkbox';
    inp.checked = o.value !== false;
    var tr = el('span', 'tr');
    var em = el('em', null, o.label || '');
    lab.appendChild(inp);
    lab.appendChild(tr);
    lab.appendChild(em);
    (parent || panelRoot()).appendChild(lab);
    inp.addEventListener('change', function () {
      beep(inp.checked ? 640 : 420, 0.04, 'triangle', 0.024);
      if (o.onChange) o.onChange(inp.checked);
    });
    return {
      el: lab,
      get: function () { return inp.checked; },
      set: function (v) { inp.checked = !!v; }
    };
  }

  function button(parent, label, onClick, o) {
    o = o || {};
    var b = el('button', 'btn' + (o.primary ? ' primary' : '') + (o.ghost ? ' ghost' : ''), label);
    b.type = 'button';
    if (o.title) b.title = o.title;
    b.addEventListener('click', function () {
      try { onClick(); } catch (err) { console.error(err); }
    });
    (parent || panelRoot()).appendChild(b);
    return b;
  }
  function btnrow(parent) {
    var r = el('div', 'btnrow');
    (parent || panelRoot()).appendChild(r);
    return r;
  }

  function reads(parent, items) {
    var wrap = el('div', 'reads');
    var map = {};
    items.forEach(function (item) {
      var id, label, wide;
      if (Array.isArray(item)) {
        id = item[0];
        label = item[1];
        wide = item[2] && item[2].wide;
      }
      else { id = item.id; label = item.label; wide = item.wide; }
      var r = el('div', 'read' + (wide ? ' wide' : ''));
      var s = el('span', null, label);
      var v = el('strong', null, '—');
      r.appendChild(s);
      r.appendChild(v);
      wrap.appendChild(r);
      map[id] = { v: v, r: r };
    });
    (parent || panelRoot()).appendChild(wrap);
    return {
      el: wrap,
      set: function (id, val, cls) {
        var n = map[id];
        if (!n) return;
        n.v.textContent = val;
        n.r.className = 'read' + (cls ? ' ' + cls : '');
      },
      setMany: function (obj) {
        for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k)) {
          var n = map[k];
          if (n) n.v.textContent = obj[k];
        }
      }
    };
  }

  /* ------------------------------------------------------------------ API */
  var Sim = {
    TAU: TAU,
    font: font,
    fmt: fmt,
    clamp: clamp,
    lerp: lerp,
    map: map,
    rand: rand,
    rr: rr,
    arrow: arrow,
    tag: tag,
    view: view,
    loop: loop,
    pointer: pointer,
    fx: fx,
    chart: chart,
    sec: sec,
    slider: slider,
    seg: seg,
    toggle: toggle,
    button: button,
    btnrow: btnrow,
    reads: reads,
    beep: beep,
    chord: chord,
    hint: hint,
    help: help,
    onTheme: onTheme,
    toggleFull: toggleFull,
    isDark: isDark,
    sound: function () { return soundOn; },
    theme: function () { return themePref(); },
    get C() { return palette; }
  };
  Object.defineProperty(Sim, 'C', { get: function () { return palette; } });

  window.Sim = Sim;

  if (mq) {
    if (mq.addEventListener) mq.addEventListener('change', applyTheme);
    else if (mq.addListener) mq.addListener(applyTheme);
  }

  initBar();
  applyTheme();
})();
