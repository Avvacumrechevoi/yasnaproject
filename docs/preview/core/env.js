// Runtime environment contract for yasnaproject.
// Values intentionally stay empty while shared production resources are quarantined.
(function(){
  'use strict';

  function meta(name){
    var el = document.querySelector('meta[name="yasna:' + name + '"]');
    return el ? el.getAttribute('content') : '';
  }

  function clean(value){
    return String(value || '').trim();
  }

  var apiBase = clean(meta('api') || window.YASNA_LEADERBOARD_API || '');
  var telegramBot = clean(meta('tg-bot') || window.YASNA_TG_BOT || '');
  var isQuarantine = apiBase === '' && telegramBot === '';
  var realtimeDisabled = window.YASNA_DISABLE_SHARED_REALTIME === true || isQuarantine;

  window.YasnaEnv = {
    project: 'yasnaproject',
    apiBase: apiBase,
    telegramBot: telegramBot,
    isQuarantine: isQuarantine,
    realtimeDisabled: realtimeDisabled
  };

  window.YASNA_LEADERBOARD_API = apiBase;
  window.YASNA_TG_BOT = telegramBot;
  if(realtimeDisabled) window.YASNA_DISABLE_SHARED_REALTIME = true;
})();
