(function(){
  document.getElementById('yr').textContent = new Date().getFullYear();
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isZh = function(){ return document.documentElement.lang === 'zh-Hant'; };

  /* ----- language toggle (EN ⇄ Traditional Chinese) — same mechanism as home ----- */
  var langNodes = Array.prototype.slice.call(document.querySelectorAll('[data-zh]'));
  var enHTML = langNodes.map(function(el){ return el.innerHTML; });
  var toggle = document.getElementById('lang-toggle');
  function setLang(lang){
    var zh = lang === 'zh';
    document.documentElement.lang = zh ? 'zh-Hant' : 'en';
    langNodes.forEach(function(el,i){ el.innerHTML = zh ? el.getAttribute('data-zh') : enHTML[i]; });
    toggle.textContent = zh ? 'EN' : '中文';
    toggle.setAttribute('aria-label', zh ? 'Switch to English' : '切換為繁體中文');
    try{ localStorage.setItem('lang', lang); }catch(e){}
  }
  toggle.addEventListener('click', function(){ setLang(isZh() ? 'en' : 'zh'); });
  try{ if(localStorage.getItem('lang') === 'zh') setLang('zh'); }catch(e){}

  /* ----- nav border on scroll ----- */
  var nav = document.getElementById('nav');
  window.addEventListener('scroll', function(){ nav.classList.toggle('scrolled', window.scrollY > 12); }, {passive:true});

  /* ----- back to top ----- */
  var totop = document.getElementById('totop');
  window.addEventListener('scroll', function(){ totop.classList.toggle('show', window.scrollY > 600); }, {passive:true});
  totop.addEventListener('click', function(){ window.scrollTo({top:0, behavior: reduce ? 'auto' : 'smooth'}); });

  /* ----- missing-image placeholder (language-neutral) ----- */
  window.ph = function(img){
    var d = document.createElement('div'); d.className = 'ph';
    var g = document.createElement('div'); g.className = 'g'; g.textContent = (img.dataset.label || 'Image');
    var c = document.createElement('code'); c.textContent = img.getAttribute('src');
    d.appendChild(g); d.appendChild(c); img.replaceWith(d);
  };

  Array.prototype.slice.call(document.querySelectorAll('img.zoom')).forEach(function(i){
      if(i.complete && i.naturalWidth===0) window.ph(i);
      else i.addEventListener('error', function(){ window.ph(i); });
    });

    /* ----- slideshow ----- */
  (function(){
    var r = document.getElementById('ocac'); if(!r) return;
    var s = Array.prototype.slice.call(r.querySelectorAll('.slide'));
    var dw = r.querySelector('.dots'); var i = 0;
    s.forEach(function(_, x){ var b = document.createElement('button'); b.type='button';
      b.setAttribute('aria-label','Go to slide '+(x+1)); b.addEventListener('click', function(){ go(x); }); dw.appendChild(b); });
    var d = Array.prototype.slice.call(dw.children);
    function go(n){ i = (n + s.length) % s.length;
      s.forEach(function(e,x){ e.classList.toggle('on', x===i); });
      d.forEach(function(e,x){ e.classList.toggle('on', x===i); }); }
    r.querySelector('.r').addEventListener('click', function(){ go(i+1); });
    r.querySelector('.l').addEventListener('click', function(){ go(i-1); });
    go(0);
    var st = r.querySelector('.stage'), sx = 0;
    st.addEventListener('touchstart', function(e){ sx = e.touches[0].clientX; }, {passive:true});
    st.addEventListener('touchend', function(e){ var dx = e.changedTouches[0].clientX - sx; if(Math.abs(dx) > 40) go(dx < 0 ? i+1 : i-1); });
  })();

  /* ----- lightbox ----- */
  (function(){
    var lb = document.getElementById('lb'), im = document.getElementById('lb-img'), cap = document.getElementById('lb-cap');
    var opener = null, idx = 0;
    function pics(){ return Array.prototype.slice.call(document.querySelectorAll('img.zoom')); }
    function paint(){ var a = pics(); if(!a.length) return; idx = (idx + a.length) % a.length;
      var p = a[idx]; im.src = p.currentSrc || p.src; im.alt = p.alt || '';
      cap.textContent = (isZh() ? p.dataset.capZh : p.dataset.cap) || ''; }
    function open(p){ opener = document.activeElement; idx = pics().indexOf(p);
      lb.classList.add('open'); document.body.classList.add('lb-open'); lb.setAttribute('aria-hidden','false');
      paint(); lb.querySelector('.lb-close').focus(); }
    function close(){ lb.classList.remove('open'); document.body.classList.remove('lb-open');
      lb.setAttribute('aria-hidden','true'); im.src = ''; if(opener && opener.focus) opener.focus(); }
    document.addEventListener('click', function(e){ var p = e.target.closest && e.target.closest('img.zoom'); if(p) open(p); });
    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelector('.lb-prev').addEventListener('click', function(e){ e.stopPropagation(); idx--; paint(); });
    lb.querySelector('.lb-next').addEventListener('click', function(e){ e.stopPropagation(); idx++; paint(); });
    lb.addEventListener('click', function(e){ if(e.target === lb || e.target.tagName === 'FIGURE') close(); });
    document.addEventListener('keydown', function(e){ if(!lb.classList.contains('open')) return;
      if(e.key === 'Escape') close(); else if(e.key === 'ArrowRight'){ idx++; paint(); } else if(e.key === 'ArrowLeft'){ idx--; paint(); } });
  })();

  /* ----- scroll reveal (keep last; default state is visible) ----- */
  var els = Array.prototype.slice.call(document.querySelectorAll('.rv'));
  if(reduce || !('IntersectionObserver' in window)){ els.forEach(function(el){ el.classList.add('in'); }); return; }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        var sibs = Array.prototype.slice.call(e.target.parentNode.children).filter(function(n){ return n.classList.contains('rv'); });
        e.target.style.transitionDelay = (Math.max(0, sibs.indexOf(e.target)) * 70) + 'ms';
        e.target.classList.add('in'); io.unobserve(e.target);
      }
    });
  }, {threshold:.14, rootMargin:'0px 0px -8% 0px'});
  els.forEach(function(el){ io.observe(el); });
  window.addEventListener('load', function(){ setTimeout(function(){ els.forEach(function(el){ if(!el.classList.contains('in')) el.classList.add('in'); }); }, 2200); });
})();
