/* Shared page behaviors, guarded by each source script's DOM checks. */

/* tg-site/tg-site/js/main.js */
(function(){
document.documentElement.classList.add('js');
var h=document.getElementById('hdr'),b=document.getElementById('burger'),m=document.getElementById('mnav');
if(!h||!b||!m)return;
function s(){h.classList.toggle('solid',window.scrollY>20||m.classList.contains('open'))}
s();addEventListener('scroll',s,{passive:true});
b.addEventListener('click',function(){var o=m.classList.toggle('open');b.setAttribute('aria-expanded',o);b.setAttribute('aria-label',o?'Close menu':'Open menu');s()});
m.addEventListener('click',function(e){if(e.target.tagName==='A'){m.classList.remove('open');b.setAttribute('aria-expanded','false');s()}});
var els=document.querySelectorAll('[data-r]');
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});els.forEach(function(e){io.observe(e)})}
else els.forEach(function(e){e.classList.add('in')});
var y=document.getElementById('yr');if(y)y.textContent=new Date().getFullYear();
// Section 03 products progress and desktop vertical-to-horizontal pin.
var pt=document.getElementById('ptrack'),pb=document.getElementById('pbar'),ps=document.getElementById('products'),pin=ps&&ps.querySelector('.pshow-pin');
if(pt&&pb){
  function setProductProgress(value){pb.style.transform='scaleX('+Math.max(0,Math.min(1,value))+')'}
  function updateProductProgress(){var range=pt.scrollWidth-pt.clientWidth;setProductProgress(range>0?pt.scrollLeft/range:0)}
  pt.addEventListener('scroll',updateProductProgress,{passive:true});
  var desktopProducts=window.matchMedia('(min-width: 1025px)'),productsFrame=0;
  function syncProducts(){
    productsFrame=0;
    if(!desktopProducts.matches||!ps||!pin){if(ps)ps.style.height='';if(pin)pin.style.height='';updateProductProgress();return}
    var topOffset=72,travel=Math.max(0,pt.scrollWidth-pt.clientWidth),pinHeight=Math.max(1,pin.getBoundingClientRect().height);
    ps.style.height=(pinHeight+travel)+'px';
    var sectionTop=window.scrollY+ps.getBoundingClientRect().top,start=sectionTop-topOffset;
    var progress=travel?Math.max(0,Math.min(1,(window.scrollY-start)/travel)):0;
    pt.scrollLeft=progress*travel;setProductProgress(progress);
  }
  function requestProductsSync(){if(!productsFrame)productsFrame=requestAnimationFrame(syncProducts)}
  window.addEventListener('scroll',requestProductsSync,{passive:true});
  window.addEventListener('resize',requestProductsSync,{passive:true});
  if(desktopProducts.addEventListener)desktopProducts.addEventListener('change',requestProductsSync);else desktopProducts.addListener(requestProductsSync);
  requestProductsSync();
}
// application arrows
var as=document.getElementById('ascroll');
document.querySelectorAll('[data-dir]').forEach(function(a){a.addEventListener('click',function(){as.scrollBy({left:a.dataset.dir*440,behavior:'smooth'})})});
var f=document.getElementById('enqform');
if(f)f.addEventListener('submit',function(e){e.preventDefault();var d=new FormData(f),k=['name','company','email','phone','product','application','requirements','message'];
var body=k.map(function(x){return x.charAt(0).toUpperCase()+x.slice(1)+': '+(d.get(x)||'')}).join('\n');
var n=document.getElementById('enqnote');n.hidden=false;n.textContent='Opening your email app with the enquiry. If nothing opens, email contact@trivikramgraphite.com or use WhatsApp.';
location.href='mailto:contact@trivikramgraphite.com?subject='+encodeURIComponent('Enquiry from '+d.get('company'))+'&body='+encodeURIComponent(body)});
})();


/* manufacture/main.js */
/* Trivikram Graphite: shared script. */
(function () {
  'use strict';

  var WA_NUMBER = '919029422107';
  var MAIL_TO = 'contact@trivikramgraphite.com';

  /* Mobile menu */
  var toggle = document.querySelector('.navtoggle');
  if (!toggle) return;
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* Reveal cards as they scroll into view */
  var items = document.querySelectorAll('.pcard, .form, .enqleft, .cell, .mrow, .sourcetext, .step');
  if ('IntersectionObserver' in window && items.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  }

  /* Enquiry form */
  var form = document.getElementById('enqform');
  var note = document.getElementById('formnote');
  if (!form) return;

  function val(name) { return (form.elements[name].value || '').trim(); }

  function validate() {
    var ok = true;
    ['name', 'company', 'email', 'phone'].forEach(function (n) {
      var el = form.elements[n];
      var good = el.value.trim() !== '';
      if (n === 'email' && good) good = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value.trim());
      if (n === 'phone' && good) good = el.value.replace(/\D/g, '').length >= 8;
      el.parentNode.classList.toggle('bad', !good);
      if (!good) ok = false;
    });
    return ok;
  }

  function summary() {
    return [
      'Name: ' + val('name'),
      'Company: ' + val('company'),
      'Email: ' + val('email'),
      'Phone: ' + val('phone'),
      'Product: ' + val('product'),
      'Application: ' + val('application'),
      'Technical requirements: ' + val('technical'),
      'Message: ' + val('message')
    ].join('\n');
  }

  function say(text, good) {
    note.textContent = text;
    note.classList.toggle('ok', !!good);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) { say('Please fill the required fields with valid details.'); return; }
    /* Static site: opens the visitor's email app. Replace with a form service later. */
    window.location.href = 'mailto:' + MAIL_TO +
      '?subject=' + encodeURIComponent('Enquiry from ' + val('company')) +
      '&body=' + encodeURIComponent(summary());
    say('Thank you. Your email app should open with your enquiry.', true);
  });

  var wa = document.getElementById('wabtn');
  if (wa) {
    wa.addEventListener('click', function () {
      if (!validate()) { say('Please fill the required fields with valid details.'); return; }
      window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent('Hello, I have an enquiry.\n' + summary()), '_blank', 'noopener');
    });
  }

  form.addEventListener('input', function (e) {
    if (e.target.parentNode.classList) e.target.parentNode.classList.remove('bad');
  });
})();


/* both_pages/script.js */
(function(){
  var PHONE='919029422107';
  var PRODUCTS=['Modified Indutherm Graining Crucible','Stopper Rods','Continuous Casting Graphite Mandrel','Continuous Casting Dies and Mandrels for Kada and Bangle','Kada Ingot Mould','2 KG Capacity IHD Crucible'];

  // mobile menu
  var burger=document.querySelector('.burger'),menu=document.querySelector('.menu');
  if(burger&&menu){
    burger.addEventListener('click',function(){
      var o=menu.classList.toggle('open');
      burger.classList.toggle('open',o);
      burger.setAttribute('aria-expanded',o);
      burger.setAttribute('aria-label',o?'Close menu':'Open menu');
    });
    menu.addEventListener('click',function(e){if(e.target.tagName==='A'){menu.classList.remove('open');burger.classList.remove('open');burger.setAttribute('aria-expanded','false');burger.setAttribute('aria-label','Open menu');}});
  }

  // product dropdown
  document.querySelectorAll('select[name=product]').forEach(function(s){
    PRODUCTS.forEach(function(p){var o=document.createElement('option');o.value=o.textContent=p;s.appendChild(o);});
  });

  // footer year
  document.querySelectorAll('.year').forEach(function(y){y.textContent=new Date().getFullYear();});

  // forms
  document.querySelectorAll('.enquiry-form').forEach(function(form){
    function val(){
      var ok=true;
      form.querySelectorAll('[required]').forEach(function(i){
        var f=i.closest('.field'),bad=!i.value.trim();
        if(!bad&&i.type==='email')bad=!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(i.value);
        if(!bad&&i.name==='phone')bad=i.value.replace(/\D/g,'').length<10;
        f.classList.toggle('error',bad);
        if(bad)ok=false;
      });
      return ok;
    }
    function summary(){
      var d=new FormData(form),t='Enquiry from '+(d.get('name')||'')+' ('+(d.get('company')||'')+')';
      ['product','application','requirements','message'].forEach(function(k){if(d.get(k))t+='\n'+k+': '+d.get(k);});
      return t;
    }
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var msg=form.querySelector('.form-msg');
      if(!val())return;
      // TODO: connect to backend / email service
      console.log(Object.fromEntries(new FormData(form)));
      msg.textContent='Thank you. Your enquiry has been noted and our team will contact you shortly.';
      msg.classList.add('show');form.reset();
    });
    var wa=form.querySelector('.js-wa');
    if(wa)wa.addEventListener('click',function(){
      window.open('https://wa.me/'+PHONE+'?text='+encodeURIComponent(summary()),'_blank','noopener');
    });
    form.querySelectorAll('input,textarea').forEach(function(i){
      i.addEventListener('input',function(){i.closest('.field').classList.remove('error');});
    });
  });
})();
