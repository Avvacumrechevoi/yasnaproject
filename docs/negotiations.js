(function(){
  'use strict';

  var STORAGE_KEY = 'yasna_negotiations_trainer_v1';
  var DRILL_KEY = 'yasna_negotiations_drill_v1';

  var stations = [
    { id: 0, title: 'Информационное поле', short: 'История', color: '#6f6a5a', body: 'Память, опыт, прежний осадок и сведения до встречи. Здесь важно не идти вслепую.', prompts: ['Что уже известно о B и о прошлых последствиях?', 'Какой осадок нельзя повторить?', 'Какие факты нужно проверить до разговора?'] },
    { id: 1, title: 'Хочу / не хочу', short: 'Вход', color: '#ba7517', body: 'Бинарный вход в переговоры. Если B не хочет разговора, давление только усилит десонанс.', prompts: ['Есть ли у B настоящий интерес входить в контакт?', 'Что сделает вход безопасным и коротким?', 'Где лучше остановиться, если интереса нет?'] },
    { id: 2, title: 'Привлечь и заинтересовать', short: 'Интерес', color: '#0f8b8d', body: 'Момент обаяния, внимания и первого совпадения. Не обещать лишнего, а найти живую надежду B.', prompts: ['Какая надежда B звучит первой?', 'Какая деталь покажет, что вы его услышали?', 'Что не надо продавать, пока нет интереса?'] },
    { id: 3, title: 'Открытие позиции', short: 'Позиция', color: '#0071e3', body: 'Формальное "зачем" и "почему": причина, предложение, ожидание и первый контур обмена.', prompts: ['Сформулирована ли позиция A без тумана?', 'Что B услышит как выгоду, а что как давление?', 'Как сказать позицию одним честным предложением?'] },
    { id: 4, title: 'Резонирование', short: 'Резонанс', color: '#248a3d', body: 'Подстройка двух Ясн: общий словарь, темп, обстоятельства, место и своевременность.', prompts: ['Где уже есть общий опыт или ценность?', 'Что в атмосфере мешает слышать друг друга?', 'Какая маленькая проверка покажет совпадение?'] },
    { id: 5, title: 'Ограничения и контр', short: 'Контр', color: '#ba7517', body: 'Цифры, рамки, условия, невозможности. Здесь вера проходит первую прочную проверку.', prompts: ['Какие ограничения реальны, а какие являются торгом?', 'Что A не должен обещать?', 'Какой контр-вариант честно сохраняет интерес B?'] },
    { id: 6, title: 'Противостояние A и B', short: '3-9', color: '#d70015', body: 'Пик противоречия. Суть не в победе над B, а в ясном назывании разных надежд.', prompts: ['Мы хотим одно, B хочет другое: что именно?', 'Какая часть конфликта статусная, а какая предметная?', 'Что можно признать без сдачи позиции?'] },
    { id: 7, title: 'Обоюдное понимание', short: 'Понимание', color: '#248a3d', body: 'Вместилище общего понимания: стороны не только поняли, но и приняли круг надежд.', prompts: ['Что каждая сторона повторит словами другой?', 'Какие надежды реальны, а какие нет?', 'Что должно быть зафиксировано прямо сейчас?'] },
    { id: 8, title: 'Недопонимание', short: 'Мираж', color: '#a15c1a', body: 'Опасная зона "кажется, договорились". Нужно отделить понял от принял.', prompts: ['Где B кивнул, но не принял?', 'Какая фраза двусмысленна?', 'Как проверить понимание без обвинения?'] },
    { id: 9, title: 'Десонанс / срыв', short: 'Срыв', color: '#d70015', body: 'Разрыв резонанса или односторонние переговоры. Иногда лучший ход - не давить, а корректно выйти.', prompts: ['Что показывает, что переговоры стали односторонними?', 'Какой минимальный мост можно оставить?', 'Как завершить без разрушительного следа?'] },
    { id: 10, title: 'Точечный удар', short: 'Точка', color: '#0f8b8d', body: 'Концентрация на одной решающей точке. Использовать только этично: как ясность, а не манипуляцию.', prompts: ['Какая одна точка действительно решает вопрос?', 'Почему она важна для B, а не только для A?', 'Как сказать это без унижения и нажима?'] },
    { id: 11, title: 'Итог: успех / неудача', short: 'Итог', color: '#0071e3', body: 'Ритуал завершения: договоренность, отказ или перенос. Здесь создается история следующего цикла.', prompts: ['Что изменилось после разговора?', 'Какой следующий уровень отношений открыт?', 'Что останется в памяти B через неделю?'] }
  ];

  var presets = [
    {
      id: 'blank',
      title: 'Пустой',
      subtitle: 'с нуля',
      values: {}
    },
    {
      id: 'hiring',
      title: 'Найм',
      subtitle: 'идея или деньги',
      values: {
        subject: 'Найм сильного кандидата в проект, где важно понять: ему интересна идея или только оплата.',
        partyA: 'Команда Ясны',
        partyB: 'Кандидат',
        aTake: 'Компетентность, надежность, включенность в смысл проекта.',
        aGive: 'Роль, развитие, честная оплата по результату, доступ к сильной задаче.',
        bTake: 'Деньги, статус, ясные условия, интересная работа без хаоса.',
        bVisible: 'B должен поверить, что проект живой, условия честные, а ожидания не размыты.',
        bHidden: 'Может проверять статус и устойчивость команды; может бояться неопределенности.',
        placeTime: 'Короткая встреча с понятной рамкой, без давления и длинной презентации.',
        fairExit: 'Даже при отказе оставить уважение и возможность вернуться к разговору позже.',
        bInterest: 68,
        sharedGround: 58,
        contradiction: 52,
        fairness: 62,
        atmosphere: 70,
        hiddenRisk: 48,
        activeStation: 4
      }
    },
    {
      id: 'sale',
      title: 'Продажа',
      subtitle: 'ценность без нажима',
      values: {
        subject: 'Продать продукт или участие в проекте так, чтобы B не чувствовал, что его продавили.',
        partyA: 'Продавец / инициатор',
        partyB: 'Партнер / покупатель',
        aTake: 'Сделка, доверие, следующий шаг, долгосрочное отношение.',
        aGive: 'Понятную ценность, снижение риска, честное обещание только по реальным возможностям.',
        bTake: 'Пользу, безопасность, подтверждение статуса решения, понятные последствия.',
        bVisible: 'B должен поверить, что выгода реальна и не обернется скрытыми потерями.',
        bHidden: 'Может защищать статус или бояться выглядеть ошибшимся перед своей командой.',
        placeTime: 'Дать пространство сравнить варианты, не ускорять искусственно.',
        fairExit: 'Если сейчас не подходит, оставить ясный критерий возврата и добрую историю.',
        bInterest: 55,
        sharedGround: 50,
        contradiction: 64,
        fairness: 58,
        atmosphere: 60,
        hiddenRisk: 58,
        activeStation: 5
      }
    },
    {
      id: 'manager',
      title: 'Руководитель',
      subtitle: 'статус и уважение',
      values: {
        subject: 'Разговор руководителя и сотрудника, где есть статусное противоречие и риск обиды.',
        partyA: 'Руководитель',
        partyB: 'Сотрудник',
        aTake: 'Ответственность, результат, соблюдение договоренностей.',
        aGive: 'Уважение, ясные критерии, защиту от хаоса и понятную поддержку.',
        bTake: 'Признание, автономию, справедливость, понятные границы.',
        bVisible: 'B должен поверить, что требование не унижает и не отменяет уважения.',
        bHidden: 'Главный слой может быть статусным: меня слышат или мной распоряжаются.',
        placeTime: 'Лучше один на один, без публичного давления.',
        fairExit: 'Закончить на ясных шагах и сохраненном достоинстве обеих сторон.',
        bInterest: 60,
        sharedGround: 46,
        contradiction: 72,
        fairness: 55,
        atmosphere: 54,
        hiddenRisk: 63,
        activeStation: 6
      }
    },
    {
      id: 'cold',
      title: 'Холодный вход',
      subtitle: 'проверка хочу',
      values: {
        subject: 'Первый контакт с человеком, который пока не просил предложения.',
        partyA: 'Инициатор',
        partyB: 'Новый контакт',
        aTake: 'Разрешение на короткий разговор и проверку интереса.',
        aGive: 'Короткую гипотезу ценности и право быстро отказаться.',
        bTake: 'Понимание, зачем тратить внимание, и отсутствие давления.',
        bVisible: 'B должен поверить, что его время уважают.',
        bHidden: 'Может быть усталость от предложений и защита внимания.',
        placeTime: 'Коротко, письменно или в заранее согласованном окне.',
        fairExit: 'Если нет интереса, поблагодарить и не спорить с отказом.',
        bInterest: 32,
        sharedGround: 28,
        contradiction: 38,
        fairness: 70,
        atmosphere: 52,
        hiddenRisk: 45,
        activeStation: 1
      }
    }
  ];

  var drills = [
    {
      id: 'hopes',
      title: '3 вопроса надежд',
      prompt: 'Сформулируйте три вопроса, которые раскрывают не позицию B, а его надежду.',
      items: [
        'Что для вас будет признаком хорошего исхода через месяц?',
        'Что в этой ситуации для вас точно не должно случиться?',
        'Если убрать цену, что останется самым важным?'
      ]
    },
    {
      id: 'contradiction',
      title: 'Ось 3-9',
      prompt: 'Назовите противоречие без обвинения: A хочет..., B хочет..., честная точка игры...',
      items: [
        'Отделите предметное противоречие от статусного.',
        'Скажите, с чем вы согласны в позиции B.',
        'Сформулируйте один вопрос, который переводит спор в проверку реальности.'
      ]
    },
    {
      id: 'faith',
      title: 'Веревки веры',
      prompt: 'Свяжите надежду B с реальной способностью A. Не обещайте то, что не выдержит проверку.',
      items: [
        'Надежда B: что он хочет получить или защитить?',
        'Способность A: что реально можно подтвердить?',
        'Проверка: какой маленький факт покажет, что вера не фантазия?'
      ]
    },
    {
      id: 'archaeology',
      title: 'Выход без осадка',
      prompt: 'Подготовьте финальную фразу для успеха, отказа и переноса так, чтобы следующая встреча оставалась возможной.',
      items: [
        'Успех: зафиксировать следующий шаг и ответственность.',
        'Отказ: поблагодарить, назвать уважительную причину и не спорить.',
        'Перенос: оставить конкретную точку возврата.'
      ]
    }
  ];

  var defaults = {
    preset: 'blank',
    activeStation: 0,
    activeDrill: 'hopes',
    subject: '',
    partyA: '',
    partyB: '',
    aTake: '',
    aGive: '',
    bTake: '',
    bVisible: '',
    bHidden: '',
    placeTime: '',
    fairExit: '',
    bInterest: 50,
    sharedGround: 45,
    contradiction: 50,
    fairness: 50,
    atmosphere: 60,
    hiddenRisk: 40
  };

  var state = loadState();
  var drillAnswers = loadDrillAnswers();
  var els = {};

  function clamp(value, min, max){
    return Math.max(min, Math.min(max, value));
  }

  function round(value){
    return Math.round(clamp(value, 0, 100));
  }

  function clean(value){
    return String(value || '').trim();
  }

  function esc(value){
    return clean(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function avg(values){
    var sum = values.reduce(function(acc, value){ return acc + Number(value || 0); }, 0);
    return values.length ? sum / values.length : 0;
  }

  function textScore(fields){
    var total = fields.length;
    var filled = fields.filter(function(field){
      return clean(state[field]).length >= 12;
    }).length;
    return total ? (filled / total) * 100 : 0;
  }

  function loadState(){
    try {
      var parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return Object.assign({}, defaults, parsed);
    } catch(_) {
      return Object.assign({}, defaults);
    }
  }

  function saveState(){
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch(_) {}
  }

  function loadDrillAnswers(){
    try {
      return JSON.parse(localStorage.getItem(DRILL_KEY) || '{}');
    } catch(_) {
      return {};
    }
  }

  function saveDrillAnswers(){
    try {
      localStorage.setItem(DRILL_KEY, JSON.stringify(drillAnswers));
    } catch(_) {}
  }

  function metrics(){
    var completeness = textScore(['subject', 'partyA', 'partyB', 'aTake', 'aGive', 'bTake', 'bVisible', 'bHidden', 'placeTime', 'fairExit']);
    var exchangeText = textScore(['aTake', 'aGive', 'bTake', 'bVisible']);
    var fairness = avg([Number(state.fairness), exchangeText]);
    var resonance = avg([
      state.bInterest,
      state.sharedGround,
      fairness,
      state.atmosphere,
      100 - state.hiddenRisk
    ]) - (Number(state.contradiction) * 0.12);
    var desonance = avg([
      100 - state.bInterest,
      state.contradiction,
      state.hiddenRisk,
      100 - state.sharedGround,
      100 - fairness
    ]);
    var readiness = avg([
      completeness,
      resonance,
      fairness,
      100 - desonance
    ]);

    return {
      completeness: round(completeness),
      fairness: round(fairness),
      resonance: round(resonance),
      desonance: round(desonance),
      readiness: round(readiness),
      recommendedStation: recommendStation({
        completeness: completeness,
        fairness: fairness,
        resonance: resonance,
        desonance: desonance
      })
    };
  }

  function recommendStation(m){
    if(m.completeness < 42) return 0;
    if(state.bInterest < 38) return 1;
    if(state.sharedGround < 42) return 2;
    if(state.hiddenRisk > 70) return 8;
    if(state.contradiction > 70) return 6;
    if(m.fairness < 50) return 5;
    if(state.atmosphere < 45) return 4;
    if(m.resonance >= 72 && m.fairness >= 62) return 7;
    if(m.readiness >= 76) return 11;
    return 3;
  }

  function nextMove(m){
    var station = stations[m.recommendedStation];
    if(m.completeness < 42) {
      return {
        title: 'Сначала восстановить информационное поле',
        body: 'В ситуации пока мало опор. Не начинайте с убеждения: заполните кто, зачем, надежды, обмен и историю.',
        steps: ['Назовите предмет переговоров одним предложением.', 'Разделите, что A берет и что A дает.', 'Запишите возможный скрытый слой B.']
      };
    }
    if(state.bInterest < 38) {
      return {
        title: 'Проверить вход без давления',
        body: 'Сейчас высокий риск односторонних переговоров. Лучший ход - коротко проверить "хочу / не хочу" B.',
        steps: ['Дайте B право быстро отказаться.', 'Сформулируйте ценность в одном вопросе.', 'Если интереса нет, оставьте хороший след и выйдите.']
      };
    }
    if(state.contradiction > 70) {
      return {
        title: 'Назвать ось 3-9',
        body: 'Противоречие уже стало главным полем игры. Не прячьте его, но отделите факт от статуса.',
        steps: ['Скажите, что хочет A.', 'Скажите, что хочет B, без карикатуры.', 'Предложите проверку реальности вместо спора характеров.']
      };
    }
    if(state.hiddenRisk > 70) {
      return {
        title: 'Проверить тень и недопонимание',
        body: 'Есть риск, что явная позиция не совпадает с настоящей причиной. Нужны вопросы про статус, страх и прошлый осадок.',
        steps: ['Спросите, что не должно случиться.', 'Проверьте, что B не только понял, но и принял.', 'Не закрывайте сделку до прояснения скрытого риска.']
      };
    }
    if(m.fairness < 50) {
      return {
        title: 'Выравнять дать / взять',
        body: 'Обмен выглядит недостаточно взаимным. Если результат будет нечестным, он вернется последствиями.',
        steps: ['Покажите, что получает B.', 'Уберите обещания, которые не выдержат проверки.', 'Сделайте контр-вариант, где обе стороны сохраняют достоинство.']
      };
    }
    if(m.resonance >= 72) {
      return {
        title: 'Фиксировать обоюдное понимание',
        body: 'Резонанс достаточный. Переходите к формулировке общего круга надежд и следующему уровню отношений.',
        steps: ['Попросите B повторить итог своими словами.', 'Назовите реальные и нереальные надежды.', 'Зафиксируйте следующий шаг, срок и ответственность.']
      };
    }
    return {
      title: 'Открыть позицию через фазу "' + station.title + '"',
      body: 'Ситуация готова для аккуратного движения вперед, но еще требует проверки резонанса.',
      steps: station.prompts.slice(0, 3)
    };
  }

  function questions(m){
    var result = [];
    if(state.bInterest < 45) result.push('Вам сейчас вообще интересно обсуждать это, если уложиться в короткий формат?');
    if(state.sharedGround < 50) result.push('Где вы видите совпадение наших интересов, а где его точно нет?');
    if(state.contradiction > 58) result.push('Правильно ли я понимаю, что главное противоречие сейчас в разных ожиданиях от результата?');
    if(state.hiddenRisk > 55) result.push('Что в этой договоренности может оказаться для вас неприятным позже?');
    if(m.fairness < 58) result.push('Что должно измениться в предложении, чтобы обмен выглядел честным для обеих сторон?');
    result.push('Какой итог через неделю вы назовете хорошим следом от этой встречи?');
    return result.slice(0, 5);
  }

  function stationById(id){
    return stations.find(function(station){ return station.id === Number(id); }) || stations[0];
  }

  function renderPresets(){
    els.presets.innerHTML = presets.map(function(preset){
      return '<button class="np-preset" type="button" data-preset="' + preset.id + '" aria-pressed="' + (state.preset === preset.id ? 'true' : 'false') + '">' +
        esc(preset.title) + '<span>' + esc(preset.subtitle) + '</span></button>';
    }).join('');
  }

  function renderStationGrid(m){
    els.stationGrid.innerHTML = stations.map(function(station){
      var active = Number(state.activeStation) === station.id;
      var recommended = m.recommendedStation === station.id;
      return '<button class="np-station-button' + (recommended ? ' is-recommended' : '') + '" type="button" role="listitem" data-station="' + station.id + '" aria-pressed="' + (active ? 'true' : 'false') + '" style="--np-station-color:' + station.color + '">' +
        '<strong>' + station.id + '. ' + esc(station.short) + '</strong>' +
        '<span>' + esc(station.title) + '</span>' +
      '</button>';
    }).join('');
  }

  function renderCompass(m){
    var cx = 320;
    var cy = 320;
    var radius = 220;
    var nodeRadius = 25;
    var resonanceArc = Math.max(8, m.resonance / 100 * 360);
    var dash = (resonanceArc / 360) * (2 * Math.PI * 172);
    var gap = (2 * Math.PI * 172) - dash;
    var lines = [
      '<circle class="np-compass-ring" cx="' + cx + '" cy="' + cy + '" r="172"></circle>',
      '<circle class="np-compass-ring" cx="' + cx + '" cy="' + cy + '" r="245"></circle>',
      '<circle class="np-compass-metric" cx="' + cx + '" cy="' + cy + '" r="172" stroke-dasharray="' + dash.toFixed(2) + ' ' + gap.toFixed(2) + '" transform="rotate(-90 ' + cx + ' ' + cy + ')"></circle>',
      '<line class="np-compass-line" x1="' + cx + '" y1="70" x2="' + cx + '" y2="570"></line>',
      '<line class="np-compass-line" x1="70" y1="' + cy + '" x2="570" y2="' + cy + '"></line>',
      '<line class="np-compass-line" x1="143" y1="143" x2="497" y2="497"></line>',
      '<line class="np-compass-line" x1="497" y1="143" x2="143" y2="497"></line>'
    ];
    var nodes = stations.map(function(station){
      var angle = (-90 + station.id * 30) * Math.PI / 180;
      var x = cx + Math.cos(angle) * radius;
      var y = cy + Math.sin(angle) * radius;
      var active = Number(state.activeStation) === station.id;
      var recommended = m.recommendedStation === station.id;
      return '<g class="np-node' + (active ? ' is-active' : '') + (recommended ? ' is-recommended' : '') + '" tabindex="0" role="button" aria-label="' + station.id + '. ' + esc(station.title) + '" data-station="' + station.id + '" style="--np-node-stroke:' + station.color + '">' +
        '<circle cx="' + x.toFixed(2) + '" cy="' + y.toFixed(2) + '" r="' + nodeRadius + '"></circle>' +
        '<text x="' + x.toFixed(2) + '" y="' + (y + 4).toFixed(2) + '" text-anchor="middle">' + station.id + '</text>' +
      '</g>';
    });
    els.compassLayer.innerHTML = lines.concat(nodes).join('');
  }

  function renderPhase(m){
    var station = stationById(state.activeStation);
    var recommended = stationById(m.recommendedStation);
    els.phaseTitle.textContent = station.id + '. ' + station.title;
    els.phaseBody.textContent = station.body + (station.id === recommended.id ? ' Это сейчас рекомендованная точка внимания.' : ' Рекомендованная точка сейчас: ' + recommended.title + '.');
    els.phasePrompts.innerHTML = station.prompts.map(function(prompt){
      return '<div class="np-prompt">' + esc(prompt) + '</div>';
    }).join('');
  }

  function renderInputs(){
    document.querySelectorAll('[data-field]').forEach(function(input){
      var field = input.getAttribute('data-field');
      if(!(field in state)) return;
      if(input.type === 'range') {
        input.value = Number(state[field]);
      } else {
        input.value = state[field] || '';
      }
    });
    document.querySelectorAll('[data-output]').forEach(function(out){
      var field = out.getAttribute('data-output');
      out.textContent = String(Number(state[field] || 0));
    });
  }

  function renderOutput(m){
    var move = nextMove(m);
    els.nextMove.innerHTML = '<h3>' + esc(move.title) + '</h3>' +
      '<p>' + esc(move.body) + '</p>' +
      '<ul>' + move.steps.map(function(step){ return '<li>' + esc(step) + '</li>'; }).join('') + '</ul>';
    els.questions.innerHTML = questions(m).map(function(question){
      return '<li>' + esc(question) + '</li>';
    }).join('');
    els.readiness.textContent = String(m.readiness);
    els.resonance.textContent = String(m.resonance);
    els.desonance.textContent = String(m.desonance);
  }

  function renderDrills(){
    els.drillTabs.innerHTML = drills.map(function(drill){
      var selected = state.activeDrill === drill.id;
      return '<button class="np-drill-tab" type="button" role="tab" data-drill="' + drill.id + '" aria-selected="' + (selected ? 'true' : 'false') + '">' + esc(drill.title) + '</button>';
    }).join('');

    var active = drills.find(function(drill){ return drill.id === state.activeDrill; }) || drills[0];
    var answer = drillAnswers[active.id] || '';
    els.drillBody.innerHTML = '<div class="np-drill-card">' +
      '<h3>' + esc(active.title) + '</h3>' +
      '<p>' + esc(active.prompt) + '</p>' +
      '<textarea data-drill-answer="' + active.id + '" placeholder="Запишите формулировку для своей встречи.">' + esc(answer) + '</textarea>' +
      '</div>' +
      '<div class="np-drill-card">' +
      '<h3>Проверочные точки</h3>' +
      '<ul class="np-drill-list">' + active.items.map(function(item){ return '<li>' + esc(item) + '</li>'; }).join('') + '</ul>' +
      '</div>';
  }

  function render(){
    var m = metrics();
    renderInputs();
    renderPresets();
    renderStationGrid(m);
    renderCompass(m);
    renderPhase(m);
    renderOutput(m);
    renderDrills();
    saveState();
  }

  function applyPreset(id){
    var preset = presets.find(function(item){ return item.id === id; }) || presets[0];
    state = Object.assign({}, defaults, preset.values, { preset: preset.id });
    render();
    showToast('Сценарий применен');
  }

  function setStation(id){
    state.activeStation = Number(id);
    state.preset = state.preset || 'blank';
    render();
  }

  function focusRecommended(){
    state.activeStation = metrics().recommendedStation;
    render();
    showToast('Фаза выбрана');
  }

  function resetAll(){
    state = Object.assign({}, defaults);
    render();
    showToast('Тренажер очищен');
  }

  function buildBrief(){
    var m = metrics();
    var station = stationById(m.recommendedStation);
    var move = nextMove(m);
    return [
      'Ясна переговоров - снимок',
      '',
      'Предмет: ' + clean(state.subject),
      'A: ' + clean(state.partyA) + ' | берет: ' + clean(state.aTake) + ' | дает: ' + clean(state.aGive),
      'B: ' + clean(state.partyB) + ' | берет: ' + clean(state.bTake),
      'Веревка веры: ' + clean(state.bVisible),
      'Тень: ' + clean(state.bHidden),
      'Атмосфера: ' + clean(state.placeTime),
      'Выход: ' + clean(state.fairExit),
      '',
      'Готовность: ' + m.readiness + ' / Резонанс: ' + m.resonance + ' / Риск срыва: ' + m.desonance,
      'Рекомендованная фаза: ' + station.id + '. ' + station.title,
      'Следующий ход: ' + move.title,
      move.body
    ].join('\n');
  }

  function copyBrief(){
    var text = buildBrief();
    if(navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function(){
        showToast('Снимок скопирован');
      }).catch(function(){
        showToast('Снимок готов в консоли');
        console.log(text);
      });
    } else {
      showToast('Снимок готов в консоли');
      console.log(text);
    }
  }

  function showToast(message){
    if(!els.toast) return;
    els.toast.textContent = message;
    els.toast.classList.add('is-visible');
    window.clearTimeout(showToast._timer);
    showToast._timer = window.setTimeout(function(){
      els.toast.classList.remove('is-visible');
    }, 1800);
  }

  function bind(){
    document.addEventListener('input', function(event){
      var input = event.target.closest('[data-field]');
      if(input) {
        var field = input.getAttribute('data-field');
        if(input.type === 'range') state[field] = Number(input.value);
        else state[field] = input.value;
        if(field !== 'preset') state.preset = 'custom';
        render();
      }

      var answer = event.target.closest('[data-drill-answer]');
      if(answer) {
        drillAnswers[answer.getAttribute('data-drill-answer')] = answer.value;
        saveDrillAnswers();
      }
    });

    document.addEventListener('click', function(event){
      var preset = event.target.closest('[data-preset]');
      if(preset) {
        applyPreset(preset.getAttribute('data-preset'));
        return;
      }

      var station = event.target.closest('[data-station]');
      if(station) {
        setStation(station.getAttribute('data-station'));
        return;
      }

      var drill = event.target.closest('[data-drill]');
      if(drill) {
        state.activeDrill = drill.getAttribute('data-drill');
        render();
        return;
      }

      var action = event.target.closest('[data-action]');
      if(!action) return;
      var name = action.getAttribute('data-action');
      if(name === 'reset') resetAll();
      if(name === 'focus-recommended') focusRecommended();
      if(name === 'copy-brief') copyBrief();
    });

    document.addEventListener('keydown', function(event){
      var station = event.target.closest('.np-node');
      if(station && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        setStation(station.getAttribute('data-station'));
      }
    });
  }

  function init(){
    els.presets = document.getElementById('np-presets');
    els.form = document.getElementById('np-form');
    els.compassLayer = document.getElementById('np-compass-layer');
    els.stationGrid = document.getElementById('np-station-grid');
    els.phaseTitle = document.getElementById('np-phase-title');
    els.phaseBody = document.getElementById('np-phase-body');
    els.phasePrompts = document.getElementById('np-phase-prompts');
    els.nextMove = document.getElementById('np-next-move');
    els.questions = document.getElementById('np-questions');
    els.readiness = document.getElementById('np-readiness');
    els.resonance = document.getElementById('np-resonance');
    els.desonance = document.getElementById('np-desonance');
    els.drillTabs = document.getElementById('np-drill-tabs');
    els.drillBody = document.getElementById('np-drill-body');
    els.toast = document.getElementById('np-toast');
    bind();
    render();

    window.YasnaNegotiationsTrainer = {
      project: 'yasnaproject',
      version: '1.0.0',
      stations: stations,
      presets: presets.map(function(preset){ return { id: preset.id, title: preset.title }; }),
      getState: function(){ return Object.assign({}, state); },
      analyze: metrics,
      applyPreset: applyPreset,
      buildBrief: buildBrief
    };
  }

  if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
