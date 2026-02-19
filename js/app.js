/* ═══════════════════════════════════════════════════
   app.js — Interactions principales
   ─ Curseur custom
   ─ Terminal typewriter
   ─ Scroll reveal
   ─ Barres de compétences
   ─ Nav active
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── CURSEUR CUSTOM ─────────────────────────────── */
  const curEl  = document.getElementById('cur');
  const curR   = document.getElementById('cur-r');
  let mx=0, my=0, rx=0, ry=0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function loopCursor() {
    curEl.style.left = mx + 'px';
    curEl.style.top  = my + 'px';
    rx += (mx - rx) * .13;
    ry += (my - ry) * .13;
    curR.style.left = rx + 'px';
    curR.style.top  = ry + 'px';
    requestAnimationFrame(loopCursor);
  })();

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      curR.style.width       = '50px';
      curR.style.height      = '50px';
      curR.style.borderColor = 'rgba(0,255,65,.8)';
    });
    el.addEventListener('mouseleave', () => {
      curR.style.width       = '';
      curR.style.height      = '';
      curR.style.borderColor = '';
    });
  });


  /* ── TERMINAL TYPEWRITER ────────────────────────── */
  /*
    Pour personnaliser le terminal : modifier le tableau LINES ci-dessous.
    Types disponibles :
      'prompt' → ligne de commande  (p = chemin, c = commande)
      'out'    → output standard    (txt = texte, peut contenir du HTML)
      'code'   → ligne de code      (kw = mot-clé coloré, rest = suite)
  */
  const LINES = [
    { t: 'prompt', p: '~/portfolio', c: ' python3 needleman.py',  d: 0    },
    { t: 'out',    txt: '> Loading sequences...  n=1024',          d: 900  },
    { t: 'code',   kw: 'def ',  rest: 'nw(s1, s2, gap=-1):',      d: 600  },
    { t: 'out',    txt: '  init DP matrix  →  O(nm)',              d: 500  },
    { t: 'out',    txt: '  filling table ██████ ✓',                d: 800  },
    { t: 'out',    txt: '  traceback done',                        d: 500  },
    { t: 'out',    txt: '> Score : <span style="color:#00ff41">147.3</span>  ✓', d: 600 },
    { t: 'prompt', p: '~/portfolio', c: ' _', d: 400, cur: true   },
  ];

  const termBody = document.getElementById('t-body');
  if (termBody) {
    let li = 0;
    function typeNext() {
      if (li >= LINES.length) return;
      const l   = LINES[li++];
      const div = document.createElement('div');

      if (l.t === 'prompt') {
        div.innerHTML = `<span class="t-prompt">${l.p} $</span><span class="t-cmd">${l.c}</span>${l.cur ? '<span class="t-cursor"></span>' : ''}`;
      } else if (l.t === 'code') {
        div.innerHTML = `  <span class="t-kw">${l.kw}</span>${l.rest}`;
      } else {
        div.innerHTML = `<span class="t-out">${l.txt}</span>`;
      }

      termBody.appendChild(div);
      termBody.scrollTop = termBody.scrollHeight;
      if (li < LINES.length) setTimeout(typeNext, l.d || 400);
    }
    setTimeout(typeNext, 2600);
  }


  /* ── SCROLL REVEAL ──────────────────────────────── */
  const revObs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) setTimeout(() => e.target.classList.add('on'), i * 80);
    });
  }, { threshold: .1 });

  document.querySelectorAll('.rv, .rv-l').forEach(el => revObs.observe(el));


  /* ── BARRES DE COMPÉTENCES ──────────────────────── */
  const barObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.skill-fill, .sm-bar-fill').forEach(b => b.classList.add('go'));
      }
    });
  }, { threshold: .2 });

  document.querySelectorAll('#sbars, #smosaic').forEach(el => barObs.observe(el));


  /* ── NAV ACTIVE AU SCROLL ───────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 300) current = s.id;
    });
    navLinks.forEach(a => {
      const isActive = a.getAttribute('href') === '#' + current;
      a.classList.toggle('active', isActive);
    });
  }, { passive: true });

});
