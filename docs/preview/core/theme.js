// Public theme runtime for yasnaproject.
// Applies a stable html[data-yasna-theme] contract and keeps legacy dark CSS working.
(function(){
  'use strict';

  var STORAGE_KEY = 'yasna_theme_mode';
  var LEGACY_DARK_KEY = 'yasna_theme_vk_dark';
  var BODY_DARK_CLASS = 'theme-vk-dark';
  var LIGHT = 'light';
  var DARK = 'dark';
  var THEME_COLORS = {
    light: '#0071e3',
    dark: '#151515'
  };

  function meta(name){
    var el = document.querySelector('meta[name="yasna:' + name + '"]');
    return el ? String(el.getAttribute('content') || '').trim() : '';
  }

  function normalize(mode){
    return mode === DARK ? DARK : LIGHT;
  }

  function storedMode(){
    try {
      var explicit = localStorage.getItem(STORAGE_KEY);
      if(explicit === DARK || explicit === LIGHT) return explicit;
      if(localStorage.getItem(LEGACY_DARK_KEY) === '1') return DARK;
    } catch(_){}
    return normalize(meta('theme') || LIGHT);
  }

  function persist(mode){
    try {
      localStorage.setItem(STORAGE_KEY, mode);
      localStorage.setItem(LEGACY_DARK_KEY, mode === DARK ? '1' : '0');
    } catch(_){}
  }

  function updateThemeColor(mode){
    var tag = document.querySelector('meta[name="theme-color"]');
    if(tag) tag.setAttribute('content', THEME_COLORS[mode] || THEME_COLORS.light);
  }

  function updateButtons(mode){
    var isDark = mode === DARK;
    document.querySelectorAll('.dp-theme-toggle').forEach(function(btn){
      var icon = btn.querySelector('.dp-theme-toggle-icon');
      var label = btn.querySelector('.dp-theme-toggle-label');
      if(icon) icon.textContent = isDark ? 'L' : 'D';
      if(label) label.textContent = isDark ? 'Light' : 'Dark';
      btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      btn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
      btn.title = isDark ? 'Switch to light theme' : 'Switch to dark theme';
    });
  }

  function apply(mode, options){
    var next = normalize(mode);
    document.documentElement.dataset.yasnaTheme = next;
    if(document.body) document.body.classList.toggle(BODY_DARK_CLASS, next === DARK);
    updateThemeColor(next);
    updateButtons(next);
    if(!options || options.persist !== false) persist(next);
    return next;
  }

  function current(){
    return normalize(document.documentElement.dataset.yasnaTheme || storedMode());
  }

  function set(mode){
    return apply(mode);
  }

  function toggle(){
    return apply(current() === DARK ? LIGHT : DARK);
  }

  function makeButton(variant){
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'dp-theme-toggle' + (variant ? ' dp-theme-toggle--' + variant : '');
    btn.innerHTML = '<span class="dp-theme-toggle-icon" aria-hidden="true"></span>';
    btn.addEventListener('click', toggle);
    return btn;
  }

  function mountButton(){
    var changed = false;
    var host = document.querySelector('.hdr-btns') || document.querySelector('.dp-header-auth');
    if(host && !host.querySelector(':scope > .dp-theme-toggle')){
      var btn = makeButton('header');
      var profileBtn = host.querySelector(':scope > .hdr-btn-profile') || host.querySelector(':scope > .dp-help-btn');
      if(profileBtn) host.insertBefore(btn, profileBtn);
      else host.insertBefore(btn, host.firstChild);
      changed = true;
    }

    if(!host && !document.querySelector('body > .dp-theme-toggle--floating')){
      document.body.appendChild(makeButton('floating'));
      changed = true;
    }

    if(host){
      document.querySelectorAll('body > .dp-theme-toggle--floating').forEach(function(btn){
        btn.remove();
        changed = true;
      });
    }
    if(changed) updateButtons(current());
  }

  function startObserver(){
    mountButton();
    var obs = new MutationObserver(function(){
      mountButton();
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  window.YasnaTheme = {
    project: 'yasnaproject',
    storageKey: STORAGE_KEY,
    bodyDarkClass: BODY_DARK_CLASS,
    current: current,
    set: set,
    toggle: toggle,
    apply: apply,
    mount: mountButton
  };

  apply(storedMode(), { persist: false });

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', startObserver);
  } else if(document.body) {
    startObserver();
  }
})();
