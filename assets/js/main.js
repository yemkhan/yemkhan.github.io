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

  // Contact form → mailto handler (static site)
  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var data = new FormData(form);
      var subject = encodeURIComponent(data.get('subject') || 'New transmission');
      var body = encodeURIComponent(
        'From: ' + (data.get('name')||'') + ' <' + (data.get('email')||'') + '>\n\n' +
        (data.get('message')||'')
      );
      window.location.href = 'mailto:2mail2mkhan@gmail.com?subject=' + subject + '&body=' + body;
      if(note){
        note.hidden = false;
        note.textContent = '✓ Opening your email app… if nothing happens, write me at 2mail2mkhan@gmail.com';
      }
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
  // Hidden trigger: 10 rapid clicks on the hero accent dot opens the secret vault.
  // The vault HTML is base64-inlined so there's no discoverable URL in source.
  var dot = document.getElementById('heroDot');
  if(dot){
    var count = 0, timer = null;
    var V = "PCFkb2N0eXBlIGh0bWw+CjxodG1sIGxhbmc9ImVuIj4KPGhlYWQ+CjxtZXRhIGNoYXJzZXQ9InV0Zi04IiAvPgo8bWV0YSBuYW1lPSJ2aWV3cG9ydCIgY29udGVudD0id2lkdGg9ZGV2aWNlLXdpZHRoLGluaXRpYWwtc2NhbGU9MSIgLz4KPG1ldGEgbmFtZT0icm9ib3RzIiBjb250ZW50PSJub2luZGV4LG5vZm9sbG93IiAvPgo8dGl0bGU+U3lzdGVtIENhY2hlPC90aXRsZT4KPHN0eWxlPgogIDpyb290ey0tYmc6IzBiMGIwZTstLWNhcmQ6IzE2MTYxYjstLWluazojZjJmMmY1Oy0tbXV0ZWQ6Izg4ODstLWFjY2VudDojZmYzYjMwOy0tYm9yZGVyOiMyYTJhMzB9CiAgKntib3gtc2l6aW5nOmJvcmRlci1ib3g7bWFyZ2luOjA7cGFkZGluZzowO2ZvbnQtZmFtaWx5Oi1hcHBsZS1zeXN0ZW0sQmxpbmtNYWNTeXN0ZW1Gb250LCJTRiBQcm8gVGV4dCIsc2Fucy1zZXJpZn0KICBib2R5e2JhY2tncm91bmQ6dmFyKC0tYmcpO2NvbG9yOnZhcigtLWluayk7bWluLWhlaWdodDoxMDB2aDtkaXNwbGF5OmdyaWQ7cGxhY2UtaXRlbXM6Y2VudGVyO3BhZGRpbmc6MjRweH0KICAud3JhcHt3aWR0aDoxMDAlO21heC13aWR0aDozODBweH0KICAuY2FyZHtiYWNrZ3JvdW5kOnZhcigtLWNhcmQpO2JvcmRlcjoxcHggc29saWQgdmFyKC0tYm9yZGVyKTtib3JkZXItcmFkaXVzOjE4cHg7cGFkZGluZzoyOHB4O2JveC1zaGFkb3c6MCAzMHB4IDgwcHggLTEwcHggcmdiYSgwLDAsMCwuNyl9CiAgaDF7Zm9udC1zaXplOjE0cHg7bGV0dGVyLXNwYWNpbmc6LjNlbTt0ZXh0LXRyYW5zZm9ybTp1cHBlcmNhc2U7Y29sb3I6dmFyKC0tYWNjZW50KTttYXJnaW4tYm90dG9tOjZweDt0ZXh0LWFsaWduOmNlbnRlcn0KICAuc3Vie2ZvbnQtc2l6ZToxMnB4O2NvbG9yOnZhcigtLW11dGVkKTt0ZXh0LWFsaWduOmNlbnRlcjttYXJnaW4tYm90dG9tOjI0cHh9CiAgLnBpbntkaXNwbGF5OmZsZXg7Z2FwOjhweDtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO21hcmdpbi1ib3R0b206MTRweH0KICAucGluIGlucHV0e3dpZHRoOjM2cHg7aGVpZ2h0OjQ2cHg7dGV4dC1hbGlnbjpjZW50ZXI7YmFja2dyb3VuZDojMGIwYjBlO2NvbG9yOnZhcigtLWluayk7CiAgICBib3JkZXI6MXB4IHNvbGlkIHZhcigtLWJvcmRlcik7Ym9yZGVyLXJhZGl1czoxMHB4O2ZvbnQtc2l6ZToxOHB4O2ZvbnQtd2VpZ2h0OjYwMDsKICAgIC1tb3otYXBwZWFyYW5jZTp0ZXh0ZmllbGR9CiAgLnBpbiBpbnB1dDo6LXdlYmtpdC1vdXRlci1zcGluLWJ1dHRvbiwucGluIGlucHV0Ojotd2Via2l0LWlubmVyLXNwaW4tYnV0dG9uey13ZWJraXQtYXBwZWFyYW5jZTpub25lO21hcmdpbjowfQogIC5waW4gaW5wdXQ6Zm9jdXN7b3V0bGluZTpub25lO2JvcmRlci1jb2xvcjp2YXIoLS1hY2NlbnQpfQogIC5lcnJ7Y29sb3I6dmFyKC0tYWNjZW50KTtmb250LXNpemU6MTJweDt0ZXh0LWFsaWduOmNlbnRlcjttaW4taGVpZ2h0OjE2cHg7bGV0dGVyLXNwYWNpbmc6LjFlbX0KICAubGlzdHtkaXNwbGF5Om5vbmU7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDoxMHB4fQogIC5jb250YWN0e2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47CiAgICBiYWNrZ3JvdW5kOiMwYjBiMGU7Ym9yZGVyOjFweCBzb2xpZCB2YXIoLS1ib3JkZXIpO2JvcmRlci1yYWRpdXM6MTRweDtwYWRkaW5nOjE0cHggMTZweDsKICAgIHRleHQtZGVjb3JhdGlvbjpub25lO2NvbG9yOnZhcigtLWluayk7dHJhbnNpdGlvbjpib3JkZXIgLjJzLHRyYW5zZm9ybSAuMnN9CiAgLmNvbnRhY3Q6aG92ZXJ7Ym9yZGVyLWNvbG9yOnZhcigtLWFjY2VudCk7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLTFweCl9CiAgLmNvbnRhY3QgLm5hbWV7Zm9udC13ZWlnaHQ6NjAwO2ZvbnQtc2l6ZToxNXB4fQogIC5jb250YWN0IC5udW17Zm9udC1zaXplOjEycHg7Y29sb3I6dmFyKC0tbXV0ZWQpO2xldHRlci1zcGFjaW5nOi4wNWVtfQogIC5oZWFke2ZvbnQtc2l6ZToxMXB4O2xldHRlci1zcGFjaW5nOi4zZW07dGV4dC10cmFuc2Zvcm06dXBwZXJjYXNlO2NvbG9yOnZhcigtLW11dGVkKTsKICAgIHRleHQtYWxpZ246Y2VudGVyO21hcmdpbi1ib3R0b206MTRweH0KICAuZm9vdHtmb250LXNpemU6MTBweDtjb2xvcjp2YXIoLS1tdXRlZCk7dGV4dC1hbGlnbjpjZW50ZXI7bWFyZ2luLXRvcDoxOHB4O2xldHRlci1zcGFjaW5nOi4yZW19Cjwvc3R5bGU+CjwvaGVhZD4KPGJvZHk+CjxkaXYgY2xhc3M9IndyYXAiPgogIDxkaXYgY2xhc3M9ImNhcmQiIGlkPSJnYXRlIj4KICAgIDxoMT7il48gUmVzdHJpY3RlZDwvaDE+CiAgICA8cCBjbGFzcz0ic3ViIj5FbnRlciA2LWRpZ2l0IHBpbiB0byBjb250aW51ZTwvcD4KICAgIDxkaXYgY2xhc3M9InBpbiIgaWQ9InBpblJvdyI+CiAgICAgIDxpbnB1dCB0eXBlPSJwYXNzd29yZCIgaW5wdXRtb2RlPSJudW1lcmljIiBtYXhsZW5ndGg9IjEiIC8+CiAgICAgIDxpbnB1dCB0eXBlPSJwYXNzd29yZCIgaW5wdXRtb2RlPSJudW1lcmljIiBtYXhsZW5ndGg9IjEiIC8+CiAgICAgIDxpbnB1dCB0eXBlPSJwYXNzd29yZCIgaW5wdXRtb2RlPSJudW1lcmljIiBtYXhsZW5ndGg9IjEiIC8+CiAgICAgIDxpbnB1dCB0eXBlPSJwYXNzd29yZCIgaW5wdXRtb2RlPSJudW1lcmljIiBtYXhsZW5ndGg9IjEiIC8+CiAgICAgIDxpbnB1dCB0eXBlPSJwYXNzd29yZCIgaW5wdXRtb2RlPSJudW1lcmljIiBtYXhsZW5ndGg9IjEiIC8+CiAgICAgIDxpbnB1dCB0eXBlPSJwYXNzd29yZCIgaW5wdXRtb2RlPSJudW1lcmljIiBtYXhsZW5ndGg9IjEiIC8+CiAgICA8L2Rpdj4KICAgIDxwIGNsYXNzPSJlcnIiIGlkPSJlcnIiPiZuYnNwOzwvcD4KICA8L2Rpdj4KCiAgPGRpdiBjbGFzcz0iY2FyZCBsaXN0IiBpZD0ibGlzdCI+CiAgICA8cCBjbGFzcz0iaGVhZCI+RW1lcmdlbmN5IMK3IFNwZWVkIGRpYWw8L3A+CiAgICA8ZGl2IGlkPSJjb250YWN0cyI+PC9kaXY+CiAgICA8cCBjbGFzcz0iZm9vdCI+VGFwIGEgbmFtZSB0byBjYWxsPC9wPgogIDwvZGl2Pgo8L2Rpdj4KCjxzY3JpcHQ+CihmdW5jdGlvbigpewogIC8vIENvbnRhY3RzIFhPUi1vYmZ1c2NhdGVkIHdpdGggdGhlIHBpbiBzbyB0aGV5J3JlIG5vdCByZWFkYWJsZSBpbiBzb3VyY2UuCiAgLy8gRm9ybWF0IHBlciBlbnRyeTogIk5hbWV8KzkxOTk5OTk5OTk5OSIKICAvLyBFbmNvZGVkIHdpdGggcGluICI4ODgwMDAiIHVzaW5nIFhPUiArIGJhc2U2NC4gUmVwbGFjZSBFTkNbXSB3aXRoIHlvdXIgb3duCiAgLy8gZW5jb2RlZCBsaXN0ICh1c2UgdGhlIGVuY29kZXIgaW4gd2luZG93Ll9fZW5jIGhlbHBlciBiZWxvdyBpbiBkZXZ0b29scykuCiAgdmFyIEVOQyA9IFsKICAgICJkVmRWVEJzSkNRRUlBQUFBQ0FnSUFBQT0iLAogICAgImZGbGNUQnNKQ1FFSUFBRUNDd3dOQmdjPSIsCiAgICAiZWtwWFJGaFZTa1FUQ1FFSkNBZ0tCQVlKQ1FzTSIsCiAgICAiYTFGTFJGVkNSQk1CQVFrQUNBc1BBQU1IQ0FrPSIsCiAgICAiZWwxTFJCQjJTbEZkWGxSTUV3RUpDUUFBREFFTENBSUdBQT09IiwKICAgICJmRmRiUkY5Q1JCTUJBUWtBQ0E0SkJ3SUlDdzA9IiwKICAgICJkRmxQU1ZWQ1JCTUJBUWtBQ0E4TUFBY0VDQW89IiwKICAgICJkbDFSVjFoU1YwcEVHd2tCQVFnSUNBWUVDUUVPQ1E9PSIsCiAgICAiZTFkTlExbGVSQk1CQVFrQUNBRUFCd1lGQ3c0PSIsCiAgICAiZWxkTFEwd2JBUWtCQUFFQkNRa0pBUUFEIiwKICAgICJmVlZkUWxkVlZsdEJUQnNKQ1FFSUFRSUREQTBPQndBPSIKICBdOwoKICBmdW5jdGlvbiB4b3Ioc3RyLCBrZXkpewogICAgdmFyIG91dCA9ICIiOwogICAgZm9yICh2YXIgaT0wO2k8c3RyLmxlbmd0aDtpKyspewogICAgICBvdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShzdHIuY2hhckNvZGVBdChpKSBeIGtleS5jaGFyQ29kZUF0KGkgJSBrZXkubGVuZ3RoKSk7CiAgICB9CiAgICByZXR1cm4gb3V0OwogIH0KICBmdW5jdGlvbiBkZWNvZGUoZW5jLCBwaW4pewogICAgdHJ5IHsgcmV0dXJuIHhvcihhdG9iKGVuYyksIHBpbik7IH0gY2F0Y2goZSl7IHJldHVybiAiIjsgfQogIH0KICAvLyBIZWxwZXIgdG8gKHJlKWVuY29kZSBlbnRyaWVzIGluIGRldnRvb2xzOiB3aW5kb3cuX19lbmMoIk1vbXwrOTF4eHgiLCI4ODgwMDAiKQogIHdpbmRvdy5fX2VuYyA9IGZ1bmN0aW9uKHBsYWluLCBwaW4peyByZXR1cm4gYnRvYSh4b3IocGxhaW4sIHBpbikpOyB9OwoKICB2YXIgaW5wdXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI3BpblJvdyBpbnB1dCcpOwogIHZhciBlcnIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXJyJyk7CiAgaW5wdXRzLmZvckVhY2goZnVuY3Rpb24oaW5wLCBpZHgpewogICAgaW5wLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZnVuY3Rpb24oKXsKICAgICAgaW5wLnZhbHVlID0gaW5wLnZhbHVlLnJlcGxhY2UoL1xEL2csJycpLnNsaWNlKDAsMSk7CiAgICAgIGlmKGlucC52YWx1ZSAmJiBpZHggPCBpbnB1dHMubGVuZ3RoLTEpIGlucHV0c1tpZHgrMV0uZm9jdXMoKTsKICAgICAgdHJ5VW5sb2NrKCk7CiAgICB9KTsKICAgIGlucC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZnVuY3Rpb24oZSl7CiAgICAgIGlmKGUua2V5ID09PSAnQmFja3NwYWNlJyAmJiAhaW5wLnZhbHVlICYmIGlkeD4wKSBpbnB1dHNbaWR4LTFdLmZvY3VzKCk7CiAgICB9KTsKICB9KTsKICBpbnB1dHNbMF0uZm9jdXMoKTsKCiAgZnVuY3Rpb24gdHJ5VW5sb2NrKCl7CiAgICB2YXIgcGluID0gQXJyYXkuZnJvbShpbnB1dHMpLm1hcChmdW5jdGlvbihpKXtyZXR1cm4gaS52YWx1ZX0pLmpvaW4oJycpOwogICAgaWYocGluLmxlbmd0aCA8IDYpIHsgZXJyLnRleHRDb250ZW50ID0gJyc7IHJldHVybjsgfQogICAgdmFyIGZpcnN0ID0gZGVjb2RlKEVOQ1swXSwgcGluKTsKICAgIGlmKGZpcnN0LmluZGV4T2YoJ3wnKSA9PT0gLTEpewogICAgICBlcnIudGV4dENvbnRlbnQgPSAn4pyXIFdyb25nIHBpbic7CiAgICAgIGlucHV0cy5mb3JFYWNoKGZ1bmN0aW9uKGkpe2kudmFsdWU9Jyd9KTsgaW5wdXRzWzBdLmZvY3VzKCk7CiAgICAgIHJldHVybjsKICAgIH0KICAgIHZhciBsaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3QnKTsKICAgIHZhciBnYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhdGUnKTsKICAgIHZhciBib3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGFjdHMnKTsKICAgIEVOQy5mb3JFYWNoKGZ1bmN0aW9uKGVuYyl7CiAgICAgIHZhciBwID0gZGVjb2RlKGVuYywgcGluKTsKICAgICAgdmFyIHBhcnRzID0gcC5zcGxpdCgnfCcpOwogICAgICBpZihwYXJ0cy5sZW5ndGggPT09IDIpewogICAgICAgIHZhciBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpOwogICAgICAgIGEuY2xhc3NOYW1lID0gJ2NvbnRhY3QnOwogICAgICAgIGEuaHJlZiA9ICd0ZWw6JyArIHBhcnRzWzFdLnJlcGxhY2UoL1xzL2csJycpOwogICAgICAgIGEuaW5uZXJIVE1MID0gJzxzcGFuIGNsYXNzPSJuYW1lIj4nICsgcGFydHNbMF0gKyAnPC9zcGFuPjxzcGFuIGNsYXNzPSJudW0iPicgKyBwYXJ0c1sxXSArICc8L3NwYW4+JzsKICAgICAgICBib3guYXBwZW5kQ2hpbGQoYSk7CiAgICAgIH0KICAgIH0pOwogICAgZ2F0ZS5zdHlsZS5kaXNwbGF5PSdub25lJzsKICAgIGxpc3Quc3R5bGUuZGlzcGxheT0nZmxleCc7CiAgfQp9KSgpOwo8L3NjcmlwdD4KPC9ib2R5Pgo8L2h0bWw+Cg==";
    dot.addEventListener('click', function(e){
      e.preventDefault();
      count++;
      clearTimeout(timer);
      timer = setTimeout(function(){ count = 0; }, 4000);
      if(count >= 5){
        count = 0;
        try {
          var w = window.open('', '_blank');
          if(w){
            w.document.open();
            w.document.write(atob(V));
            w.document.close();
          } else {
            window.location.href = 'data:text/html;base64,' + V;
          }
        } catch(err){
          window.location.href = 'data:text/html;base64,' + V;
        }
      }
    });
  }
})();
