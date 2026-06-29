(function(){
  // Theme toggle (persisted)
  var root = document.documentElement;
  var btn = document.getElementById('themeToggle');
  var stored = localStorage.getItem('mk-theme');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var theme = stored || (prefersDark ? 'dark' : 'light');
  setTheme(theme);
  function setTheme(t){
    root.setAttribute('data-theme', t);
    if(btn) btn.querySelector('.knob').textContent = t === 'dark' ? '☾' : '☀';
  }
  if(btn) btn.addEventListener('click', function(){
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(next); localStorage.setItem('mk-theme', next);
  });

  // Memoji hover swap + click to open About Me modal
  var memoji = document.getElementById('memoji');
  var aboutPop = document.getElementById('aboutPop');
  var aboutBackdrop = document.getElementById('aboutBackdrop');
  var aboutClose = document.getElementById('aboutClose');
  var wrap = document.getElementById('memojiWrap');
  function openAbout(){
    if(!aboutPop) return;
    aboutPop.hidden = false;
    if(aboutBackdrop) aboutBackdrop.hidden = false;
    if(wrap) wrap.setAttribute('aria-expanded','true');
  }
  function closeAbout(){
    if(!aboutPop) return;
    aboutPop.hidden = true;
    if(aboutBackdrop) aboutBackdrop.hidden = true;
    if(wrap) wrap.setAttribute('aria-expanded','false');
  }
  if(memoji && wrap){
    var base = memoji.src, hover = memoji.dataset.hover;
    wrap.addEventListener('mouseenter', function(){ memoji.src = hover; });
    wrap.addEventListener('mouseleave', function(){ memoji.src = base; });
    wrap.addEventListener('click', openAbout);
    wrap.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openAbout(); }
    });
  }
  if(aboutClose) aboutClose.addEventListener('click', closeAbout);
  if(aboutBackdrop) aboutBackdrop.addEventListener('click', closeAbout);
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeAbout(); });

  // Contact form → Formspree handler
  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if(note){
        note.hidden = false;
        note.textContent = 'Sending transmission…';
      }
      fetch('https://formspree.io/f/mleqjaor', {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function(resp){
        if(resp.ok){
          form.reset();
          if(note) note.textContent = '✓ Transmission sent. I will be in touch soon.';
        } else {
          return resp.json().then(function(data){
            throw new Error((data.errors && data.errors[0] && data.errors[0].message) || 'Something went wrong. Please try again.');
          });
        }
      }).catch(function(err){
        if(note) note.textContent = '✗ ' + (err.message || 'Failed to send. Please email me directly at 2mail2mkhan@gmail.com');
      });
    });
  }

  // Reveal on scroll
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.section, .project-card').forEach(function(el){
    el.classList.add('reveal'); io.observe(el);
  });

  // Smooth scroll for in-page nav
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var id = a.getAttribute('href');
      if(id.length > 1){
        var t = document.querySelector(id);
        if(t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth', block:'start'}); }
      }
    });
  });
  // Hidden trigger: 5 rapid clicks on the hero accent dot opens the diagnostics cache.
  var dot = document.getElementById('heroDot');
  if(dot){
    var count = 0, timer = null;
    dot.addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      count++;
      clearTimeout(timer);
      timer = setTimeout(function(){ count = 0; }, 4000);
      if(count >= 5){
        count = 0;
        window.location.href = 'assets/js/sys.html';
      }
    });
  }

  // Click anywhere on project card to open its target
  document.querySelectorAll('.project-card[data-href]').forEach(function(card){
    card.style.cursor = 'pointer';
    card.addEventListener('click', function(e){
      if(e.target.closest('a,button')) return;
      var href = card.getAttribute('data-href');
      if(!href) return;
      var target = card.getAttribute('data-target');
      if(target === '_blank') window.open(href, '_blank', 'noopener');
      else window.location.href = href;
    });
  });


  // Page transition overlay — fade between internal .html pages
  var fade = document.getElementById('pageFade');
  if(fade){
    // Reveal incoming page
    requestAnimationFrame(function(){
      fade.classList.add('in');
      requestAnimationFrame(function(){
        fade.classList.remove('in');
      });
    });
    document.addEventListener('click', function(e){
      var a = e.target.closest && e.target.closest('a[href]');
      if(!a) return;
      var href = a.getAttribute('href');
      if(!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      if(a.target === '_blank' || a.hasAttribute('download')) return;
      if(/^https?:/i.test(href) && !href.includes(location.host)) return;
      // Only animate to local html docs
      if(!/\.html(\?|#|$)/i.test(href) && href !== '/' ) return;
      e.preventDefault();
      fade.classList.add('in');
      setTimeout(function(){ window.location.href = href; }, 480);
    });
  }


  // Mobile toast: "Best Viewed on Desktop" — 2s on small screens
  if(window.innerWidth < 768){
    var t = document.createElement('div');
    t.className = 'mk-toast';
    t.textContent = 'Best Viewed on Desktop';
    document.body.appendChild(t);
    setTimeout(function(){ t.classList.add('out'); }, 2200);
    setTimeout(function(){ if(t.parentNode) t.parentNode.removeChild(t); }, 2700);
  }
})();
