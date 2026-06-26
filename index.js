(function(){
  var _hs=document.querySelector('.photo-img');
  if(_hs){ var _hf=function(){_hs.remove();}; if(_hs.complete && _hs.naturalWidth===0) _hf(); else _hs.addEventListener('error',_hf); }

  document.getElementById('yr').textContent = new Date().getFullYear();
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----- language toggle (EN ⇄ Traditional Chinese) ----- */
  var langNodes = Array.prototype.slice.call(document.querySelectorAll('[data-zh]'));
  var enHTML = langNodes.map(function(el){ return el.innerHTML; });   // capture English once
  var toggle = document.getElementById('lang-toggle');
  function setLang(lang){
    var zh = lang === 'zh';
    document.documentElement.lang = zh ? 'zh-Hant' : 'en';
    langNodes.forEach(function(el,i){
      el.innerHTML = zh ? el.getAttribute('data-zh') : enHTML[i];
    });
    toggle.textContent = zh ? 'EN' : '中文';
    toggle.setAttribute('aria-label', zh ? 'Switch to English' : '切換為繁體中文');
    try{ localStorage.setItem('lang', lang); }catch(e){}
  }
  toggle.addEventListener('click', function(){
    setLang(document.documentElement.lang === 'zh-Hant' ? 'en' : 'zh');
  });
  try{ if(localStorage.getItem('lang') === 'zh') setLang('zh'); }catch(e){}

  var nav = document.getElementById('nav');
  var fcta = document.getElementById('floatcta');
  function onScroll(){
    var y = window.scrollY;
    nav.classList.toggle('scrolled', y > 12);
    if(fcta){
      var nearBottom = (y + window.innerHeight) > (document.documentElement.scrollHeight - 280);
      fcta.classList.toggle('show', !nearBottom);
    }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', onScroll, {passive:true});
  onScroll();

  var els = Array.prototype.slice.call(document.querySelectorAll('.rv'));
  if(reduce || !('IntersectionObserver' in window)){
    els.forEach(function(el){ el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        var sibs = Array.prototype.slice.call(e.target.parentNode.children).filter(function(n){return n.classList.contains('rv')});
        var i = sibs.indexOf(e.target);
        e.target.style.transitionDelay = (Math.max(0,i)*70) + 'ms';
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  },{threshold:.14, rootMargin:'0px 0px -8% 0px'});
  els.forEach(function(el){ io.observe(el); });

  /* failsafe: if anything is still hidden shortly after load, reveal it */
  window.addEventListener('load', function(){
    setTimeout(function(){
      els.forEach(function(el){ if(!el.classList.contains('in')){ el.classList.add('in'); } });
    }, 2200);
  });
})();
