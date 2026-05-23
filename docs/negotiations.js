(function(){
  'use strict';

  var STORAGE_KEY = 'yasna_negotiations_trainer_v2';
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

  var guideSteps = [
    {
      id: 'frame',
      title: 'Кто, зачем и о чем',
      station: 0,
      fields: ['subject', 'partyA', 'partyB'],
      goal: 'Собрать рамку встречи до любых аргументов.',
      exercise: 'Опишите предмет переговоров, сторону A и сторону B так, чтобы это понял внешний наблюдатель.',
      check: 'Можно ли одним предложением сказать, что должно измениться после встречи?',
      focus: 'subject',
      fill: ['Предмет переговоров', 'Сторона A', 'Сторона B']
    },
    {
      id: 'history',
      title: 'Информационное поле',
      station: 0,
      fields: ['bHidden', 'fairExit'],
      goal: 'Увидеть прошлый опыт, осадок, репутацию и возможную тень.',
      exercise: 'Запишите, что B уже знает, чего опасается и какой след нельзя оставить.',
      check: 'Есть ли в подготовке место для прошлой истории, а не только для будущей сделки?',
      focus: 'bHidden',
      fill: ['Тень / скрытый слой', 'История после встречи']
    },
    {
      id: 'entry',
      title: 'Вход: хочу / не хочу',
      station: 1,
      fields: ['bInterest', 'placeTime'],
      goal: 'Проверить, есть ли у B настоящий вход в разговор.',
      exercise: 'Оцените интерес B и задайте формат, где отказ допустим без потери лица.',
      check: 'Если B не хочет разговора, сможете ли вы остановиться без давления?',
      focus: 'placeTime',
      fill: ['Интерес B', 'Место, время, атмосфера']
    },
    {
      id: 'hopes',
      title: 'Надежды и обмен',
      station: 3,
      fields: ['aTake', 'aGive', 'bTake', 'bVisible'],
      goal: 'Развести взять/дать и связать предложение A с надеждой B.',
      exercise: 'Заполните, что A хочет взять, что реально дает, что B хочет взять и чему должен поверить.',
      check: 'Видно ли, почему B должен считать обмен честным?',
      focus: 'aTake',
      fill: ['A хочет взять', 'A готов дать', 'B хочет взять', 'B должен поверить']
    },
    {
      id: 'resonance',
      title: 'Резонанс и атмосфера',
      station: 4,
      fields: ['sharedGround', 'atmosphere'],
      goal: 'Найти общий словарь, место, темп и своевременность.',
      exercise: 'Оцените общую зону и атмосферу, затем уберите один фактор, который мешает слышать друг друга.',
      check: 'Есть ли хоть одна общая ценность или общий опыт, с которого можно начать?',
      focus: 'placeTime',
      fill: ['Общая зона', 'Атмосфера']
    },
    {
      id: 'contradiction',
      title: 'Ось 3-9',
      station: 6,
      fields: ['contradiction', 'bHidden'],
      goal: 'Назвать главное противоречие без унижения и борьбы за правоту.',
      exercise: 'Сформулируйте: A хочет одно, B хочет другое, а честная точка игры находится здесь.',
      check: 'Отделено ли предметное противоречие от статусного?',
      focus: 'bHidden',
      fill: ['Противоречие 3-9', 'Тень / скрытый слой']
    },
    {
      id: 'faith',
      title: 'Веревки веры',
      station: 7,
      fields: ['bVisible', 'fairness'],
      goal: 'Проверить, выдержит ли надежда B реальные возможности A.',
      exercise: 'Уберите лишние обещания и оставьте только то, что можно подтвердить действием.',
      check: 'Есть ли маленькая проверка, которая докажет, что вера не фантазия?',
      focus: 'bVisible',
      fill: ['B должен поверить', 'Честный обмен']
    },
    {
      id: 'exit',
      title: 'Итог и история',
      station: 11,
      fields: ['fairExit'],
      goal: 'Подготовить успех, отказ или перенос так, чтобы следующий цикл оставался возможным.',
      exercise: 'Напишите финальную фразу для хорошего итога и отдельную фразу для корректного отказа.',
      check: 'Что останется в памяти B через неделю?',
      focus: 'fairExit',
      fill: ['История после встречи']
    }
  ];

  var simScenes = [
    {
      id: 'hiring',
      title: 'Найм кандидата',
      preset: 'hiring',
      startScores: { resonance: 52, trust: 54, tension: 42 },
      turns: [
        {
          station: 1,
          title: 'Вход: хочу / не хочу',
          bLine: 'У меня мало времени. Коротко: почему мне вообще стоит это обсуждать?',
          hint: 'Не убеждайте. Откройте маленькую проверку, в которой B сохраняет право быстро сказать "нет".',
          choices: [
            { text: 'Давайте не продавать друг другу лишнее. За 10 минут проверим: что для вас будет хорошим проектом, где мы реально можем быть полезны и есть ли смысл продолжать. Если не совпадет - остановимся.', label: 'Проверить совпадение', effect: { resonance: 10, trust: 8, tension: -6 }, note: 'Вы открыли короткую проверку и сохранили B право не входить дальше.', lesson: 'Резонанс начинается не с аргумента, а с безопасного входа.' },
            { text: 'У нас сильный проект, такие возможности редко бывают. Надо просто попробовать.', label: 'Сразу убеждать', effect: { resonance: -6, trust: -8, tension: 10 }, note: 'Вы начали доказывать ценность до того, как B согласился входить в разговор.', lesson: 'Если B еще не вошел, аргументы становятся шумом.' },
            { text: 'Понимаю, тогда, наверное, лучше как-нибудь потом созвониться, когда будет удобнее.', label: 'Уйти в туман', effect: { resonance: -3, trust: -2, tension: 1 }, note: 'Вы не давите, но и не создаете понятной причины остаться в контакте.', lesson: 'Мягкость без формы не открывает переговоры.' }
          ]
        },
        {
          station: 2,
          title: 'Надежда B',
          bLine: 'Для меня важны не только деньги. Я хочу понять, будет ли здесь рост и нормальная команда.',
          hint: 'Услышьте надежду до предложения.',
          choices: [
            { text: 'Слышу две надежды: рост и среда. Давайте отдельно проверим задачи, людей и критерии успеха.', label: 'Отразить надежду', effect: { resonance: 12, trust: 10, tension: -4 }, note: 'B видит, что его не свели к цене.', lesson: 'Надежда становится мостом, когда ее называют.' },
            { text: 'Деньги тоже будут нормальные, а рост приложится, если хорошо работать.', label: 'Сместить к деньгам', effect: { resonance: -4, trust: -5, tension: 5 }, note: 'Вы ответили не на главный слой.', lesson: 'Скрытый мотив нельзя закрыть чужим аргументом.' },
            { text: 'У нас все растут, команда сильная, проблем обычно нет.', label: 'Общее обещание', effect: { resonance: 0, trust: -4, tension: 3 }, note: 'Слишком общо: веревка веры пока не держится.', lesson: 'Вера требует факта, а не красивого тумана.' }
          ]
        },
        {
          station: 3,
          title: 'Позиция A',
          bLine: 'Что конкретно вы от меня хотите в первые два месяца?',
          hint: 'Откройте позицию A без тумана.',
          choices: [
            { text: 'Нам нужен человек, который возьмет участок, покажет первые результаты за 6 недель и честно обозначит, где система не работает.', label: 'Ясная позиция', effect: { resonance: 9, trust: 8, tension: -2 }, note: 'Позиция конкретна и не обещает легкости.', lesson: 'Открытие позиции снижает туман.' },
            { text: 'Нам нужен сильный универсальный человек, который поможет везде, где потребуется.', label: 'Размытая роль', effect: { resonance: -5, trust: -6, tension: 7 }, note: 'B слышит риск хаоса.', lesson: 'Неясная роль увеличивает скрытую цену.' },
            { text: 'Пока посмотрим по ситуации. Главное, чтобы был общий настрой.', label: 'Уйти от рамки', effect: { resonance: -7, trust: -7, tension: 6 }, note: 'Вы не ответили на вопрос о реальности.', lesson: 'Настрой не заменяет рамку ответственности.' }
          ]
        },
        {
          station: 6,
          title: 'Ось 3-9',
          bLine: 'Похоже, вы хотите много неопределенности, а я хочу понятные границы.',
          hint: 'Назовите противоречие, не спорьте с ним.',
          choices: [
            { text: 'Да, это главное противоречие: нам нужна гибкость, вам нужны границы. Давайте найдем минимальные правила, которые удержат обе стороны.', label: 'Назвать противоречие', effect: { resonance: 10, trust: 9, tension: -8 }, note: 'Вы не прячете конфликт и переводите его в конструкцию.', lesson: '3-9 не надо побеждать, его надо увидеть.' },
            { text: 'Без неопределенности стартапы не работают. Если нужны гарантии, возможно, это не ваш формат.', label: 'Жесткий отбор', effect: { resonance: -7, trust: -8, tension: 14 }, note: 'Иногда это честно, но сейчас звучит как срыв.', lesson: 'Резкость быстро переводит игру в десонанс.' },
            { text: 'Нет, у нас все достаточно понятно, просто надо включиться.', label: 'Отрицать конфликт', effect: { resonance: -10, trust: -10, tension: 12 }, note: 'B назвал риск, а вы его отменили.', lesson: 'Непринятый риск возвращается позже.' }
          ]
        },
        {
          station: 7,
          title: 'Веревка веры',
          bLine: 'Как я пойму, что обещания про рост и адекватную команду не просто слова?',
          hint: 'Свяжите надежду B с проверяемым действием.',
          choices: [
            { text: 'Дадим тестовую задачу и встречу с будущими коллегами. После нее вы сами оцените рост, стиль команды и риски.', label: 'Проверка веры', effect: { resonance: 12, trust: 12, tension: -6 }, note: 'Вы превращаете обещание в проверку.', lesson: 'Веревка веры держится на маленьком подтверждении.' },
            { text: 'Можете мне поверить: я сам не люблю токсичные команды.', label: 'Просить поверить', effect: { resonance: 1, trust: -5, tension: 4 }, note: 'Личное обещание полезно, но без проверки слабое.', lesson: 'Вера без факта остается просьбой.' },
            { text: 'Если сомневаетесь, давайте не будем тратить время.', label: 'Оборвать сомнение', effect: { resonance: -8, trust: -9, tension: 10 }, note: 'Сомнение B стало поводом для срыва.', lesson: 'Сомнение часто просит не давления, а проверки.' }
          ]
        },
        {
          station: 11,
          title: 'Итог',
          bLine: 'Хорошо. Что предлагаете как следующий шаг?',
          hint: 'Завершите так, чтобы осталась хорошая история.',
          choices: [
            { text: 'Фиксируем короткую тестовую задачу, встречу с командой и дату решения. Если не совпадет, честно разойдемся без взаимных претензий.', label: 'Чистый итог', effect: { resonance: 8, trust: 10, tension: -7 }, note: 'Есть действие, срок и уважительный выход.', lesson: 'Хороший итог создает следующий цикл, а не осадок.' },
            { text: 'Давайте скорее оформляться, детали решим по ходу.', label: 'Ускорить закрытие', effect: { resonance: -5, trust: -8, tension: 9 }, note: 'Слишком раннее закрытие ломает веру.', lesson: 'Итог должен выдерживать надежды, а не торопить их.' },
            { text: 'Я напишу потом, когда будет время.', label: 'Размытый выход', effect: { resonance: -4, trust: -5, tension: 2 }, note: 'Контакт не разрушен, но энергия потеряна.', lesson: 'Без следующего шага результат быстро уходит в туман.' }
          ]
        }
      ]
    },
    {
      id: 'sale',
      title: 'Продажа без нажима',
      preset: 'sale',
      startScores: { resonance: 46, trust: 48, tension: 48 },
      turns: [
        {
          station: 1,
          title: 'Вход',
          bLine: 'Мне уже много всего продавали. Чем это отличается?',
          hint: 'Сначала снимите защиту внимания.',
          choices: [
            { text: 'Не буду продавать вслепую. За 5 минут проверим, есть ли у вас задача, которую мы реально можем решить.', label: 'Проверка вместо продажи', effect: { resonance: 10, trust: 9, tension: -8 }, note: 'Вы уважаете отказ и снижаете защиту.', lesson: 'Вход начинается с права не покупать.' },
            { text: 'Отличается качеством и подходом, у нас правда сильное решение.', label: 'Сразу хвалить продукт', effect: { resonance: -3, trust: -5, tension: 5 }, note: 'B слышит привычный паттерн продажи.', lesson: 'До надежды B сильный продукт звучит как шум.' },
            { text: 'Тогда просто посмотрите презентацию, там все понятно.', label: 'Передать презентацию', effect: { resonance: -5, trust: -4, tension: 2 }, note: 'Вы уходите от живого контакта.', lesson: 'Файл редко заменяет резонанс.' }
          ]
        },
        {
          station: 4,
          title: 'Резонанс',
          bLine: 'Главная боль - мы теряем время на согласованиях, но я не хочу внедрять еще одну сложную систему.',
          hint: 'Найдите общий страх и общий результат.',
          choices: [
            { text: 'То есть цель - ускорить согласования без новой сложности. Тогда проверяем только этот критерий, не весь продукт.', label: 'Сузить к критерию', effect: { resonance: 12, trust: 8, tension: -5 }, note: 'Вы перевели разговор в измеримый результат.', lesson: 'Резонанс растет, когда B слышит свой критерий.' },
            { text: 'Сложность только кажется, на самом деле система простая.', label: 'Спорить с страхом', effect: { resonance: -6, trust: -6, tension: 8 }, note: 'Вы спорите с опытом B.', lesson: 'Страх не исчезает от заверения.' },
            { text: 'Давайте тогда пока не обсуждать внедрение.', label: 'Обойти риск', effect: { resonance: -2, trust: 0, tension: 1 }, note: 'Вы снизили давление, но не решили тревогу.', lesson: 'Обход риска не создает веру.' }
          ]
        },
        {
          station: 5,
          title: 'Ограничения',
          bLine: 'Бюджет ограничен. Я не готов платить за эксперимент.',
          hint: 'Контр-вариант должен сохранять честный обмен.',
          choices: [
            { text: 'Тогда делаем маленький пилот с критерием успеха: если согласования не ускоряются, не масштабируем.', label: 'Пилот по результату', effect: { resonance: 10, trust: 10, tension: -6 }, note: 'Вы уважаете ограничение и снижаете риск.', lesson: 'Ограничение можно превратить в проверку.' },
            { text: 'Если хотите качество, за него надо платить.', label: 'Давить ценой', effect: { resonance: -8, trust: -8, tension: 12 }, note: 'Это может быть правда, но сейчас звучит как столкновение.', lesson: 'Цена без надежды вызывает защиту.' },
            { text: 'Можем дать большую скидку.', label: 'Сразу уступить', effect: { resonance: 1, trust: -4, tension: -2 }, note: 'Вы снизили цену, но могли снизить ценность.', lesson: 'Скидка не заменяет честный критерий.' }
          ]
        }
      ]
    }
  ];

  var defaults = {
    preset: 'blank',
    activeStation: 0,
    activeDrill: 'hopes',
    activeGuideStep: 0,
    activeSimScene: 'hiring',
    activeSimTurn: 0,
    activeFlowStage: 'learn',
    flowDepth: 0,
    flowMapRevealed: false,
    simMode: 'learn',
    simSelectedChoice: null,
    simFinished: false,
    simScores: { resonance: 52, trust: 54, tension: 42 },
    simHistory: [],
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

  var thinkingModels = {
    1: {
      name: 'Урок 1. Вход: хочу / не хочу',
      lens: 'Цель первого хода - не убедить B, а открыть право на разговор. Если B не видит безопасный короткий вход, дальше будут не переговоры, а сопротивление.',
      observe: ['Есть ли у B ясный повод дать вам 5-10 минут?', 'Понимает ли B, что может быстро остановить разговор?', 'Вы предлагаете проверку совпадения или уже продаете решение?'],
      skill: 'Сформулировать вход как маленькую честную проверку интереса B.',
      why: 'Первые секунды решают, будет ли у встречи живое поле. Хороший вход не продает, не оправдывается и не отступает в туман. Он предлагает B безопасно проверить: есть ли здесь смысл разговаривать.',
      principle: 'Формула входа: короткая рамка + критерий проверки + право остановиться.',
      formula: [
        { title: 'Снять давление', body: 'Не продаем вслепую и не требуем доверия заранее.' },
        { title: 'Дать формат', body: 'Ограничиваем разговор 5-10 минутами и одним понятным критерием.' },
        { title: 'Вернуть контроль B', body: 'Если совпадения нет, спокойно останавливаемся без осадка.' }
      ],
      practiceCheck: ['В ответе есть короткий формат?', 'B понимает, что может сказать "нет"?', 'Вы проверяете интерес B, а не доказываете свою ценность?'],
      avoid: ['Доказывать, что проект сильный', 'Просить "просто попробовать"', 'Уходить в неопределенное "созвонимся потом"'],
      takeaway: 'Хороший вход создает маленький договор о проверке. Только после него у аргументов появляется место.'
    },
    2: {
      name: 'Надежда до аргумента',
      lens: 'До предложения надо услышать, что B хочет взять: выгоду, статус, спокойствие, рост или удовольствие.',
      observe: ['Какая надежда звучит явно?', 'Что может быть скрытой тенью?', 'Как не свести B только к цене?'],
      skill: 'Назвать надежду B и не подменить ее своим аргументом.'
    },
    3: {
      name: 'Позиция A без тумана',
      lens: 'A должен понимать, что берет, что дает и зачем встреча вообще нужна.',
      observe: ['Что A хочет взять?', 'Что A реально дает?', 'Можно ли сказать позицию одним честным предложением?'],
      skill: 'Сформулировать ясную позицию без общего обещания.'
    },
    4: {
      name: 'Резонанс и атмосфера',
      lens: 'Резонанс появляется, когда стороны нашли общие обстоятельства, язык и темп.',
      observe: ['Где есть общее поле?', 'Что в атмосфере мешает слышать?', 'Какой маленький тест покажет совпадение?'],
      skill: 'Сузить разговор до критерия B и общей зоны.'
    },
    5: {
      name: 'Ограничения как проверка',
      lens: 'Ограничения не надо продавливать. Их надо превратить в честный контр-вариант.',
      observe: ['Какой риск реальный?', 'Что нельзя обещать?', 'Как сохранить обмен равновесным?'],
      skill: 'Предложить маленькую проверку вместо спора или скидки.'
    },
    6: {
      name: 'Ось 3-9',
      lens: 'Противоречие надо увидеть и назвать: A хочет одно, B хочет другое, решение ищется по линии единства.',
      observe: ['Где предметный конфликт?', 'Где статусный конфликт?', 'Что можно признать без сдачи позиции?'],
      skill: 'Назвать противоречие без нападения.'
    },
    7: {
      name: 'Веревка веры',
      lens: 'Надежда B должна быть связана с реальной способностью A. Иначе вера не выдержит.',
      observe: ['Какая надежда требует доказательства?', 'Что A может подтвердить фактом?', 'Какую маленькую проверку можно дать?'],
      skill: 'Связать обещание с проверяемым действием.'
    },
    11: {
      name: 'Итог без осадка',
      lens: 'Результат должен оставлять историю, а не пепел и золу: успех, отказ или перенос должны быть равновесными.',
      observe: ['Что изменилось после встречи?', 'Какой следующий шаг честен?', 'Что B вспомнит через неделю?'],
      skill: 'Закрыть встречу так, чтобы следующий цикл оставался возможным.'
    }
  };

  var flowStages = [
    {
      id: 'learn',
      title: 'Объяснение',
      label: 'понять схему',
      hint: 'Сначала смотрим на переговоры как на поле: A/B, время, тень, надежды и обмен.'
    },
    {
      id: 'practice',
      title: 'Отработка',
      label: 'сделать ход',
      hint: 'Теперь выбираем ответ A и тренируем конкретный навык мышления.'
    },
    {
      id: 'debrief',
      title: 'Разбор',
      label: 'увидеть последствия',
      hint: 'После ответа смотрим, что произошло с резонансом, доверием и напряжением.'
    },
    {
      id: 'map',
      title: 'Карта',
      label: 'собрать ситуацию',
      hint: 'После первого хода можно открыть подробную подготовку, 12 фаз и упражнения.'
    }
  ];

  var state = loadState();
  normalizeSimState();
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

  function simSceneById(id){
    return simScenes.find(function(scene){ return scene.id === id; }) || simScenes[0];
  }

  function currentSimScene(){
    return simSceneById(state.activeSimScene);
  }

  function currentSimTurn(){
    var scene = currentSimScene();
    return scene.turns[clamp(Number(state.activeSimTurn || 0), 0, scene.turns.length - 1)] || scene.turns[0];
  }

  function flowStageById(id){
    return flowStages.find(function(stage){ return stage.id === id; }) || flowStages[0];
  }

  function flowStageIndex(id){
    var index = flowStages.findIndex(function(stage){ return stage.id === id; });
    return index < 0 ? 0 : index;
  }

  function currentFlowDepth(){
    var depth = Number(state.flowDepth || 0);
    if(!Number.isFinite(depth)) depth = 0;
    return clamp(depth, 0, flowStageIndex('debrief'));
  }

  function isFlowStageUnlocked(id){
    if(id === 'map') {
      return !!state.flowMapRevealed || completedSimTurns(currentSimScene()) > 0 || state.simFinished;
    }
    return flowStageIndex(id) <= currentFlowDepth();
  }

  function syncFlowToSim(){
    if(state.activeFlowStage === 'learn') state.simMode = 'learn';
    if(state.activeFlowStage === 'practice') state.simMode = 'practice';
    if(state.activeFlowStage === 'debrief') state.simMode = 'practice';
  }

  function thinkingModelForTurn(turn){
    return thinkingModels[turn.station] || {
      name: stationById(turn.station).title,
      lens: stationById(turn.station).body,
      observe: stationById(turn.station).prompts,
      skill: 'Увидеть параметр встречи до выбора переговорного действия.'
    };
  }

  function simStage(){
    if(state.simFinished) return 'final';
    if(currentFlowDepth() < flowStageIndex('practice')) return 'learn';
    if(state.simSelectedChoice != null && currentFlowDepth() >= flowStageIndex('debrief')) return 'debrief';
    return 'practice';
  }

  function simChoiceIndex(scene, turnIndex){
    var entry = state.simHistory[turnIndex];
    var turn = scene.turns[turnIndex];
    if(!entry || !turn) return null;
    if(entry.choiceIndex != null && Number.isFinite(Number(entry.choiceIndex)) && turn.choices[Number(entry.choiceIndex)]) return Number(entry.choiceIndex);
    var byLabel = turn.choices.findIndex(function(choice){ return choice.label === entry.choice; });
    return byLabel >= 0 ? byLabel : null;
  }

  function completedSimTurns(scene){
    var count = 0;
    for(var i = 0; i < scene.turns.length; i += 1) {
      if(simChoiceIndex(scene, i) == null) break;
      count += 1;
    }
    return count;
  }

  function maxUnlockedSimTurn(scene){
    return clamp(completedSimTurns(scene), 0, scene.turns.length - 1);
  }

  function recomputeSimScores(){
    var scene = currentSimScene();
    var scores = Object.assign({}, scene.startScores);
    var lastTurn = state.simFinished ? scene.turns.length - 1 : Number(state.activeSimTurn || 0);
    for(var i = 0; i <= lastTurn; i += 1) {
      var choiceIndex = simChoiceIndex(scene, i);
      if(choiceIndex == null) continue;
      var effect = scene.turns[i].choices[choiceIndex].effect || {};
      scores.resonance = round(Number(scores.resonance) + Number(effect.resonance || 0));
      scores.trust = round(Number(scores.trust) + Number(effect.trust || 0));
      scores.tension = round(Number(scores.tension) + Number(effect.tension || 0));
    }
    state.simScores = scores;
  }

  function normalizeSimState(){
    var scene = simSceneById(state.activeSimScene || defaults.activeSimScene);
    state.activeSimScene = scene.id;
    state.activeSimTurn = clamp(Number(state.activeSimTurn || 0), 0, scene.turns.length - 1);
    state.simSelectedChoice = state.simSelectedChoice == null ? null : Number(state.simSelectedChoice);
    if(state.simSelectedChoice != null && !Number.isFinite(state.simSelectedChoice)) state.simSelectedChoice = null;
    state.flowDepth = currentFlowDepth();
    state.flowMapRevealed = !!state.flowMapRevealed;
    if(state.simSelectedChoice != null) state.flowDepth = Math.max(state.flowDepth, flowStageIndex('debrief'));
    state.simMode = state.simMode === 'practice' ? 'practice' : 'learn';
    state.activeFlowStage = flowStageById(state.activeFlowStage).id;
    if(state.activeFlowStage === 'map' && isFlowStageUnlocked('map')) state.flowMapRevealed = true;
    if(!isFlowStageUnlocked(state.activeFlowStage)) state.activeFlowStage = flowStages[currentFlowDepth()].id;
    syncFlowToSim();
    state.simScores = Object.assign({}, scene.startScores, state.simScores || {});
    state.simHistory = Array.isArray(state.simHistory) ? state.simHistory : [];
    state.simHistory = state.simHistory.slice(0, scene.turns.length).map(function(entry, index){
      if(!entry) return entry;
      var copy = Object.assign({}, entry);
      if(copy.choiceIndex == null) {
        var found = scene.turns[index].choices.findIndex(function(choice){ return choice.label === copy.choice; });
        if(found >= 0) copy.choiceIndex = found;
      }
      return copy;
    });
    state.simFinished = !!state.simFinished;
    if(state.simSelectedChoice != null && !scene.turns[state.activeSimTurn].choices[state.simSelectedChoice]) {
      state.simSelectedChoice = null;
    }
    recomputeSimScores();
  }

  function syncSimToDiagnostics(){
    state.sharedGround = round(state.simScores.resonance);
    state.bInterest = round(state.simScores.trust);
    state.contradiction = round(state.simScores.tension);
    state.hiddenRisk = round(state.simScores.tension);
  }

  function setSimScene(id){
    var scene = simSceneById(id);
    state.activeSimScene = scene.id;
    state.activeSimTurn = 0;
    state.simSelectedChoice = null;
    state.simFinished = false;
    state.simScores = Object.assign({}, scene.startScores);
    state.simHistory = [];
    state.simMode = 'learn';
    state.activeFlowStage = 'learn';
    state.flowDepth = 0;
    state.flowMapRevealed = false;
    var linked = presets.find(function(preset){ return preset.id === scene.preset; });
    if(linked) state = Object.assign({}, state, linked.values, { preset: linked.id });
    state.activeStation = scene.turns[0].station;
    syncSimToDiagnostics();
    render();
    showToast('Сцена выбрана');
  }

  function selectSimChoice(index){
    normalizeSimState();
    var turn = currentSimTurn();
    var choice = turn.choices[Number(index)];
    if(!choice || state.simFinished) return;
    state.simSelectedChoice = Number(index);
    state.activeStation = turn.station;
    state.simMode = 'practice';
    state.activeFlowStage = 'debrief';
    state.flowDepth = Math.max(currentFlowDepth(), flowStageIndex('debrief'));
    state.simHistory[state.activeSimTurn] = {
      turn: turn.title,
      choice: choice.label,
      choiceIndex: Number(index),
      note: choice.note,
      scores: {}
    };
    recomputeSimScores();
    state.simHistory[state.activeSimTurn].scores = Object.assign({}, state.simScores);
    syncSimToDiagnostics();
    render();
    scrollFlowStage('debrief');
  }

  function setSimTurn(index){
    normalizeSimState();
    var scene = currentSimScene();
    var next = clamp(Number(index), 0, scene.turns.length - 1);
    if(next > maxUnlockedSimTurn(scene) && !state.simFinished) {
      showToast('Урок откроется после ответа');
      return;
    }
    state.simFinished = false;
    state.activeSimTurn = next;
    state.simSelectedChoice = simChoiceIndex(scene, next);
    state.flowDepth = state.simSelectedChoice == null ? 0 : flowStageIndex('debrief');
    state.simMode = state.simSelectedChoice == null ? 'learn' : 'practice';
    state.activeFlowStage = state.simSelectedChoice == null ? 'learn' : 'debrief';
    state.activeStation = currentSimTurn().station;
    recomputeSimScores();
    syncSimToDiagnostics();
    render();
    scrollFlowStage(state.activeFlowStage);
  }

  function nextSimTurn(){
    normalizeSimState();
    var scene = currentSimScene();
    if(state.simSelectedChoice == null && !state.simFinished) {
      showToast('Сначала выберите ответ');
      return;
    }
    if(Number(state.activeSimTurn) >= scene.turns.length - 1) {
      state.simFinished = true;
      state.flowMapRevealed = true;
      state.activeFlowStage = 'map';
      render();
      return;
    }
    state.activeSimTurn = Number(state.activeSimTurn) + 1;
    state.simSelectedChoice = simChoiceIndex(scene, state.activeSimTurn);
    state.flowDepth = state.simSelectedChoice == null ? 0 : flowStageIndex('debrief');
    state.simMode = state.simSelectedChoice == null ? 'learn' : 'practice';
    state.activeFlowStage = state.simSelectedChoice == null ? 'learn' : 'debrief';
    state.activeStation = currentSimTurn().station;
    recomputeSimScores();
    syncSimToDiagnostics();
    render();
    scrollFlowStage(state.activeFlowStage);
  }

  function restartSim(){
    setSimScene(state.activeSimScene);
    showToast('Симуляция начата заново');
  }

  function setSimMode(mode){
    if(state.simFinished) return;
    if(mode === 'practice') {
      startSimPractice();
      return;
    }
    state.simMode = 'learn';
    state.activeFlowStage = 'learn';
    render();
    scrollFlowStage('learn');
  }

  function startSimPractice(){
    if(state.simFinished) return;
    state.simMode = 'practice';
    state.activeFlowStage = 'practice';
    state.flowDepth = Math.max(currentFlowDepth(), flowStageIndex('practice'));
    render();
    scrollFlowStage('practice');
    showToast('Теперь отрабатываем навык');
  }

  function openMapStage(){
    state.flowMapRevealed = true;
    state.activeFlowStage = 'map';
    if(state.simSelectedChoice != null) state.simMode = 'practice';
    render();
    scrollFlowStage('map');
    showToast('Карта и рабочее поле открыты ниже');
  }

  function scrollFlowStage(id){
    window.setTimeout(function(){
      var selector = id === 'map' ? '.np-guide' : '[data-flow-block="' + id + '"]';
      var target = document.querySelector(selector) || document.querySelector('.np-sim');
      if(target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 20);
  }

  function setFlowStage(id){
    var stage = flowStageById(id);
    if(stage.id === 'practice' && !isFlowStageUnlocked('practice')) {
      startSimPractice();
      return;
    }
    if(stage.id === 'map' && !state.flowMapRevealed && isFlowStageUnlocked('map')) {
      openMapStage();
      return;
    }
    if(!isFlowStageUnlocked(stage.id)) {
      showToast(stage.id === 'map' ? 'Сначала сделайте первый ход' : 'Сначала выберите ответ');
      return;
    }
    state.activeFlowStage = stage.id;
    if(stage.id === 'learn') state.simMode = 'learn';
    if(stage.id === 'practice' || stage.id === 'debrief') state.simMode = 'practice';
    render();
    scrollFlowStage(stage.id);
  }

  function renderSim(){
    if(!els.simCard) return;
    normalizeSimState();
    var scene = currentSimScene();
    var turn = currentSimTurn();
    var selected = state.simSelectedChoice == null ? null : turn.choices[state.simSelectedChoice];
    var finalText = finalSimText();
    var completed = completedSimTurns(scene);
    var progressPercent = state.simFinished ? 100 : Math.round(completed / scene.turns.length * 100);
    var unlocked = maxUnlockedSimTurn(scene);
    var model = thinkingModelForTurn(turn);
    var stage = simStage();

    els.simScenes.innerHTML = simScenes.map(function(sceneItem){
      return '<button class="np-sim-scene" type="button" data-sim-scene="' + sceneItem.id + '" aria-pressed="' + (sceneItem.id === scene.id ? 'true' : 'false') + '">' + esc(sceneItem.title) + '</button>';
    }).join('');
    els.simMode.innerHTML =
      '<button class="np-mode-tab" type="button" role="tab" data-sim-mode="learn" aria-selected="' + (stage === 'learn' ? 'true' : 'false') + '"><strong>1. Объяснение</strong><span>понять схему</span></button>' +
      '<button class="np-mode-tab" type="button" role="tab" data-sim-mode="practice" aria-selected="' + (stage !== 'learn' ? 'true' : 'false') + '"><strong>2. Тренажер</strong><span>сделать ход</span></button>';
    els.thinkingMap.innerHTML =
      '<div class="np-thinking-axis np-thinking-axis--time"><span>будущее: надежды</span><span>прошлое: осадок</span></div>' +
      '<div class="np-thinking-axis np-thinking-axis--shadow"><span>явь: сказано</span><span>тень: скрыто</span></div>' +
      '<div class="np-thinking-core">' +
        '<span class="np-thinking-side">A<br/><small>дать / взять</small></span>' +
        '<strong>' + esc(model.name) + '</strong>' +
        '<span class="np-thinking-side">B<br/><small>взять / поверить</small></span>' +
      '</div>' +
      '<div class="np-thinking-focus"><span>Фокус мышления</span><p>' + esc(model.lens) + '</p></div>';
    els.courseProgressLabel.textContent = state.simFinished
      ? 'Курс завершен: ' + scene.turns.length + ' из ' + scene.turns.length
      : 'Урок ' + (Number(state.activeSimTurn) + 1) + ' из ' + scene.turns.length + ' · завершено ' + completed;
    els.courseProgressFill.style.width = progressPercent + '%';
    els.simResonance.textContent = String(round(state.simScores.resonance));
    els.simTrust.textContent = String(round(state.simScores.trust));
    els.simTension.textContent = String(round(state.simScores.tension));
    if(els.simPractice) {
      els.simPractice.hidden = state.simFinished || stage !== 'learn';
    }
    if(els.simNext) {
      els.simNext.disabled = state.simFinished || state.simSelectedChoice == null;
      els.simNext.textContent = state.simFinished
        ? 'Курс завершен'
        : (Number(state.activeSimTurn) >= scene.turns.length - 1 ? 'Завершить курс' : 'Следующий урок');
    }

    if(state.simFinished) {
      els.simCard.innerHTML =
        '<div class="np-sim-meta"><span>Финал</span><span>' + esc(scene.title) + '</span><span>Фаза 11: Итог</span></div>' +
        '<div class="np-sim-dialog"><span class="np-sim-person">Разбор</span><p class="np-sim-line">' + esc(finalText.title) + '</p><p class="np-sim-hint">' + esc(finalText.body) + '</p></div>' +
        '<div class="np-sim-feedback"><strong>Следующая тренировка</strong><p>' + esc(finalText.next) + '</p></div>';
    } else {
      var activeTurnIndex = Number(state.activeSimTurn);
      var lessonHtml = [];
      for(var lessonIndex = 0; lessonIndex <= activeTurnIndex; lessonIndex += 1) {
        var lessonTurn = scene.turns[lessonIndex];
        var lessonModel = thinkingModelForTurn(lessonTurn);
        var isCurrentLesson = lessonIndex === activeTurnIndex;
        var lessonChoiceIndex = isCurrentLesson ? state.simSelectedChoice : simChoiceIndex(scene, lessonIndex);
        var lessonChoice = lessonChoiceIndex == null ? null : lessonTurn.choices[lessonChoiceIndex];
        var lessonDepth = isCurrentLesson ? currentFlowDepth() : flowStageIndex('debrief');
        var practiceVisible = lessonDepth >= flowStageIndex('practice') || lessonChoice != null;
        var debriefVisible = lessonDepth >= flowStageIndex('debrief') && lessonChoice != null;
        var status = lessonChoice ? 'Пройдено' : (isCurrentLesson ? 'Сейчас' : 'Открыто');

        lessonHtml.push(
          '<section class="np-lesson-block' + (isCurrentLesson ? ' is-current' : ' is-complete') + '" data-lesson-index="' + lessonIndex + '">' +
            '<div class="np-sim-meta"><span>Урок ' + (lessonIndex + 1) + ' из ' + scene.turns.length + '</span><span>Фаза ' + lessonTurn.station + ': ' + esc(stationById(lessonTurn.station).short) + '</span><span>' + status + '</span></div>' +
            '<div class="np-flow-block" data-flow-block="' + (isCurrentLesson ? 'learn' : 'done-learn-' + lessonIndex) + '" data-testid="learning-mode">' +
              '<div class="np-flow-block-head"><span class="np-flow-badge">1. Объяснение</span><strong>' + esc(lessonModel.name) + '</strong></div>' +
              '<div class="np-learning-card">' +
                '<div><span class="np-sim-person">Что держать в голове</span><h3>' + esc(lessonModel.name) + '</h3><p>' + esc(lessonModel.lens) + '</p></div>' +
                renderMethodCard(lessonModel) +
                '<div class="np-learning-grid">' +
                  '<div><strong>Наблюдать</strong><ul>' + lessonModel.observe.map(function(item){ return '<li>' + esc(item) + '</li>'; }).join('') + '</ul></div>' +
                  '<div><strong>Навык</strong><p>' + esc(lessonModel.skill) + '</p></div>' +
                  '<div><strong>Сейчас B скажет</strong><p>' + esc(lessonTurn.bLine) + '</p></div>' +
                '</div>' +
              '</div>' +
              (isCurrentLesson && !practiceVisible ? '<div class="np-flow-block-actions"><button class="ys-button ys-button--primary np-mini-button" type="button" data-action="sim-start-practice">Далее: к отработке</button></div>' : '') +
            '</div>' +
            (practiceVisible ? '<div class="np-flow-block" data-flow-block="' + (isCurrentLesson ? 'practice' : 'done-practice-' + lessonIndex) + '" data-testid="practice-mode">' +
              '<div class="np-flow-block-head"><span class="np-flow-badge">2. Тренажер</span><strong>' + esc(lessonModel.skill) + '</strong></div>' +
              '<div class="np-course-lesson"><span>Мысленная задача</span><h3>' + esc(lessonModel.skill) + '</h3><p>' + esc(lessonModel.lens) + '</p></div>' +
              renderPracticeCheck(lessonModel) +
              '<div class="np-sim-dialog"><span class="np-sim-person">B говорит</span><p class="np-sim-line">' + esc(lessonTurn.bLine) + '</p><p class="np-sim-hint">' + esc(lessonTurn.hint) + '</p></div>' +
              '<div class="np-sim-practice-label">Практика: выберите ответ A</div>' +
              '<div class="np-sim-choices">' + lessonTurn.choices.map(function(choice, choiceIndex){
                var canAnswer = isCurrentLesson && !state.simFinished;
                return '<button class="np-sim-choice' + (Number(lessonChoiceIndex) === choiceIndex ? ' is-selected' : '') + '" type="button" ' + (canAnswer ? 'data-sim-choice="' + choiceIndex + '"' : 'disabled aria-disabled="true"') + '>' +
                  '<strong>' + esc(choice.label) + '</strong><span>' + esc(choice.text) + '</span></button>';
              }).join('') + '</div>' +
            '</div>' : '') +
            (debriefVisible ? '<div class="np-flow-block np-flow-block--debrief" data-flow-block="' + (isCurrentLesson ? 'debrief' : 'done-debrief-' + lessonIndex) + '" data-testid="debrief-mode">' +
              '<div class="np-flow-block-head"><span class="np-flow-badge">3. Разбор</span><strong>Что произошло с переговорами</strong></div>' +
              '<div class="np-sim-feedback"><strong>' + esc(lessonChoice.note) + '</strong><p>' + esc(lessonChoice.lesson) + '</p></div>' +
              renderMethodTakeaway(lessonModel) +
              '<div class="np-result-grid">' +
                '<div><span>Резонанс</span><strong>' + esc((state.simHistory[lessonIndex] && state.simHistory[lessonIndex].scores && state.simHistory[lessonIndex].scores.resonance) || state.simScores.resonance) + '</strong></div>' +
                '<div><span>Доверие</span><strong>' + esc((state.simHistory[lessonIndex] && state.simHistory[lessonIndex].scores && state.simHistory[lessonIndex].scores.trust) || state.simScores.trust) + '</strong></div>' +
                '<div><span>Напряжение</span><strong>' + esc((state.simHistory[lessonIndex] && state.simHistory[lessonIndex].scores && state.simHistory[lessonIndex].scores.tension) || state.simScores.tension) + '</strong></div>' +
              '</div>' +
              (isCurrentLesson ? '<div class="np-flow-block-actions"><button class="ys-button np-mini-button" type="button" data-action="flow-open-map">Открыть карту ниже</button><button class="ys-button ys-button--primary np-mini-button" type="button" data-action="sim-next">' + (lessonIndex >= scene.turns.length - 1 ? 'Завершить курс' : 'Далее: следующий урок') + '</button></div>' : '') +
            '</div>' : '') +
          '</section>'
        );
      }
      els.simCard.innerHTML = '<div class="np-lesson-feed">' + lessonHtml.join('') + '</div>';
    }

    els.simTrack.innerHTML = scene.turns.map(function(item, index){
      var done = index < Number(state.activeSimTurn) || (index === Number(state.activeSimTurn) && state.simSelectedChoice != null) || state.simFinished;
      var current = index === Number(state.activeSimTurn) && !state.simFinished;
      var locked = index > unlocked && !state.simFinished;
      var status = locked ? 'Закрыт' : (done ? 'Навык' : (stage === 'learn' && current ? 'Объяснение' : 'Тренировка'));
      return '<button class="np-sim-turn' + (done ? ' is-done' : '') + (current ? ' is-current' : '') + (locked ? ' is-locked' : '') + '" type="button" data-sim-turn="' + index + '" ' + (locked ? 'disabled aria-disabled="true"' : '') + '>' +
        '<span class="np-sim-turn-num">' + (index + 1) + '</span>' +
        '<span><strong>' + esc(item.title) + '</strong><span>Урок · фаза ' + item.station + '</span></span>' +
        '<span class="np-sim-turn-state">' + esc(status) + '</span>' +
      '</button>';
    }).join('');

    els.simLog.innerHTML = '<h3>Журнал ходов</h3>' + (state.simHistory.length
      ? '<ul>' + state.simHistory.map(function(item){ return '<li><strong>' + esc(item.turn) + ':</strong> ' + esc(item.choice) + '</li>'; }).join('') + '</ul>'
      : '<p>Выберите первый ответ. После каждого хода здесь появится короткая история решений.</p>');
  }

  function renderFlow(){
    if(!els.flowSteps) return;
    var active = flowStageById(state.activeFlowStage);
    var depth = currentFlowDepth();
    els.flowHint.textContent = active.hint;
    els.flowSteps.innerHTML = flowStages.map(function(stage, index){
      var revealed = stage.id === 'map' ? !!state.flowMapRevealed : index <= depth;
      var unlocked = isFlowStageUnlocked(stage.id) || (stage.id === 'practice' && depth < flowStageIndex('practice'));
      var selected = stage.id === active.id;
      var stateText = selected ? 'Сейчас' : (revealed ? 'Открыт' : (unlocked ? 'Доступен' : 'Закрыт'));
      return '<button class="np-flow-step' + (selected ? ' is-current' : '') + (unlocked ? ' is-unlocked' : ' is-locked') + '" type="button" role="tab" data-flow-stage="' + stage.id + '" aria-selected="' + (selected ? 'true' : 'false') + '" ' + (unlocked ? '' : 'disabled aria-disabled="true"') + '>' +
        '<span class="np-flow-step-num">' + (index + 1) + '</span>' +
        '<span class="np-flow-step-copy"><strong>' + esc(stage.title) + '</strong><span>' + esc(stage.label) + '</span></span>' +
        '<span class="np-flow-step-state">' + stateText + '</span>' +
      '</button>';
    }).join('');
    els.flowSections.forEach(function(section){
      var stages = (section.getAttribute('data-flow-section') || '').split(/\s+/);
      var visible = stages.some(function(stageId){
        if(stageId === 'map') return !!state.flowMapRevealed;
        return flowStageIndex(stageId) <= depth;
      });
      section.classList.toggle('is-active-flow', visible);
      section.hidden = !visible;
    });
  }

  function finalSimText(){
    var resonance = Number(state.simScores.resonance);
    var trust = Number(state.simScores.trust);
    var tension = Number(state.simScores.tension);
    if(resonance >= 70 && trust >= 70 && tension <= 45) {
      return {
        title: 'Получились полноценные переговоры',
        body: 'Вы удержали интерес B, проверили надежды и вышли к следующему шагу без давления.',
        next: 'Теперь можно перейти ниже к карте 12 фаз и разобрать, где именно возник резонанс.'
      };
    }
    if(tension >= 68) {
      return {
        title: 'Переговоры ушли в десонанс',
        body: 'Напряжение стало сильнее доверия. Вернитесь к входу, надеждам B и честному обмену.',
        next: 'Повторите сцену и попробуйте ответы, где сначала признается риск B.'
      };
    }
    return {
      title: 'Есть контакт, но веревка веры еще слабая',
      body: 'Стороны слышат друг друга частично. Нужна проверка обещаний и более ясный следующий шаг.',
      next: 'Пройдите ход заново и выбирайте ответы, где обещание превращается в проверяемое действие.'
    };
  }

  function renderMethodCard(model){
    if(!model || (!model.why && !model.principle && !model.formula && !model.avoid)) return '';
    return '<div class="np-method-card">' +
      (model.why ? '<div class="np-method-intro"><strong>Зачем этот урок</strong><p>' + esc(model.why) + '</p></div>' : '') +
      (model.principle ? '<div class="np-method-rule"><strong>' + esc(model.principle) + '</strong></div>' : '') +
      (model.formula ? '<div class="np-method-grid">' + model.formula.map(function(item){
        return '<div><span>' + esc(item.title) + '</span><p>' + esc(item.body) + '</p></div>';
      }).join('') + '</div>' : '') +
      (model.avoid ? '<div class="np-method-avoid"><strong>Не делать</strong><ul>' + model.avoid.map(function(item){
        return '<li>' + esc(item) + '</li>';
      }).join('') + '</ul></div>' : '') +
    '</div>';
  }

  function renderPracticeCheck(model){
    if(!model || !model.practiceCheck) return '';
    return '<div class="np-practice-check"><strong>Перед выбором проверьте</strong><ol>' + model.practiceCheck.map(function(item){
      return '<li>' + esc(item) + '</li>';
    }).join('') + '</ol></div>';
  }

  function renderMethodTakeaway(model){
    if(!model || !model.takeaway) return '';
    return '<div class="np-method-takeaway"><strong>Методический вывод</strong><p>' + esc(model.takeaway) + '</p></div>';
  }

  function isFieldComplete(field){
    if(['bInterest', 'sharedGround', 'contradiction', 'fairness', 'atmosphere', 'hiddenRisk'].includes(field)) {
      return Number(state[field]) > 0;
    }
    return clean(state[field]).length >= 12;
  }

  function guideCompletion(step){
    var done = step.fields.filter(isFieldComplete).length;
    return {
      done: done,
      total: step.fields.length,
      complete: done === step.fields.length,
      percent: step.fields.length ? Math.round(done / step.fields.length * 100) : 0
    };
  }

  function guideProgress(){
    var complete = guideSteps.filter(function(step){
      return guideCompletion(step).complete;
    }).length;
    return {
      complete: complete,
      total: guideSteps.length,
      percent: Math.round(complete / guideSteps.length * 100)
    };
  }

  function activeGuideStep(){
    return guideSteps[clamp(Number(state.activeGuideStep || 0), 0, guideSteps.length - 1)] || guideSteps[0];
  }

  function renderGuide(){
    if(!els.guideCard || !els.guideRail) return;
    var step = activeGuideStep();
    var stepState = guideCompletion(step);
    var progress = guideProgress();
    var station = stationById(step.station);
    els.guideProgressLabel.textContent = progress.complete + ' из ' + progress.total;
    els.guideProgressFill.style.width = progress.percent + '%';
    els.guideCard.innerHTML =
      '<div class="np-guide-meta">' +
        '<span>Шаг ' + (Number(state.activeGuideStep) + 1) + ' из ' + guideSteps.length + '</span>' +
        '<span>Фаза ' + station.id + ': ' + esc(station.short) + '</span>' +
        '<span>' + stepState.done + ' / ' + stepState.total + ' заполнено</span>' +
      '</div>' +
      '<h3>' + esc(step.title) + '</h3>' +
      '<p>' + esc(step.goal) + '</p>' +
      '<div class="np-guide-grid">' +
        '<div class="np-guide-block"><strong>Задание</strong><ul><li>' + esc(step.exercise) + '</li></ul></div>' +
        '<div class="np-guide-block"><strong>Заполнить</strong><ul>' + step.fill.map(function(item){ return '<li>' + esc(item) + '</li>'; }).join('') + '</ul></div>' +
        '<div class="np-guide-block"><strong>Проверка</strong><ul><li>' + esc(step.check) + '</li></ul></div>' +
      '</div>' +
      '<div class="np-guide-status' + (stepState.complete ? ' is-complete' : '') + '">' + (stepState.complete ? 'Шаг готов' : 'Шаг требует заполнения') + '</div>';

    els.guideRail.innerHTML = guideSteps.map(function(item, index){
      var itemState = guideCompletion(item);
      var selected = index === Number(state.activeGuideStep);
      return '<button class="np-guide-step' + (itemState.complete ? ' is-complete' : '') + '" type="button" role="tab" data-guide-step="' + index + '" aria-selected="' + (selected ? 'true' : 'false') + '">' +
        '<span class="np-guide-step-num">' + (index + 1) + '</span>' +
        '<span class="np-guide-step-copy"><strong>' + esc(item.title) + '</strong><span>Фаза ' + item.station + '</span></span>' +
        '<span class="np-guide-step-state">' + (itemState.complete ? 'OK' : itemState.done + '/' + itemState.total) + '</span>' +
      '</button>';
    }).join('');
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
    normalizeSimState();
    var m = metrics();
    renderInputs();
    renderFlow();
    renderSim();
    renderGuide();
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
    var linkedScene = simScenes.find(function(scene){ return scene.preset === preset.id; });
    state = Object.assign({}, defaults, preset.values, { preset: preset.id });
    if(linkedScene) {
      state.activeSimScene = linkedScene.id;
      state.activeSimTurn = 0;
      state.activeFlowStage = 'learn';
      state.flowDepth = 0;
      state.flowMapRevealed = false;
      state.simMode = 'learn';
      state.simSelectedChoice = null;
      state.simFinished = false;
      state.simScores = Object.assign({}, linkedScene.startScores);
      state.simHistory = [];
    }
    normalizeSimState();
    render();
    showToast('Сценарий применен');
  }

  function setStation(id){
    state.activeStation = Number(id);
    state.preset = state.preset || 'blank';
    render();
  }

  function setGuideStep(index, options){
    var next = clamp(Number(index), 0, guideSteps.length - 1);
    state.activeGuideStep = next;
    state.activeStation = guideSteps[next].station;
    render();
    if(options && options.scroll) {
      document.querySelector('.np-guide')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function focusGuideFields(){
    var step = activeGuideStep();
    var target = document.querySelector('[data-field="' + step.focus + '"]');
    if(target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      window.setTimeout(function(){ target.focus(); }, 250);
    }
    state.activeStation = step.station;
    render();
  }

  function focusRecommended(){
    state.activeStation = metrics().recommendedStation;
    render();
    showToast('Фаза выбрана');
  }

  function resetAll(){
    state = Object.assign({}, defaults);
    normalizeSimState();
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

      var simScene = event.target.closest('[data-sim-scene]');
      if(simScene) {
        setSimScene(simScene.getAttribute('data-sim-scene'));
        return;
      }

      var simChoice = event.target.closest('[data-sim-choice]');
      if(simChoice) {
        selectSimChoice(simChoice.getAttribute('data-sim-choice'));
        return;
      }

      var simMode = event.target.closest('[data-sim-mode]');
      if(simMode) {
        setSimMode(simMode.getAttribute('data-sim-mode'));
        return;
      }

      var simTurn = event.target.closest('[data-sim-turn]');
      if(simTurn) {
        setSimTurn(simTurn.getAttribute('data-sim-turn'));
        return;
      }

      var flowStage = event.target.closest('[data-flow-stage]');
      if(flowStage) {
        setFlowStage(flowStage.getAttribute('data-flow-stage'));
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

      var guideStep = event.target.closest('[data-guide-step]');
      if(guideStep) {
        setGuideStep(guideStep.getAttribute('data-guide-step'), { scroll: true });
        return;
      }

      var action = event.target.closest('[data-action]');
      if(!action) return;
      var name = action.getAttribute('data-action');
      if(name === 'reset') resetAll();
      if(name === 'focus-recommended') focusRecommended();
      if(name === 'copy-brief') copyBrief();
      if(name === 'sim-restart') restartSim();
      if(name === 'sim-start-practice') startSimPractice();
      if(name === 'sim-next') nextSimTurn();
      if(name === 'flow-open-map') openMapStage();
      if(name === 'guide-prev') setGuideStep(Number(state.activeGuideStep) - 1, { scroll: true });
      if(name === 'guide-next') setGuideStep(Number(state.activeGuideStep) + 1, { scroll: true });
      if(name === 'guide-focus') focusGuideFields();
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
    els.flowSteps = document.getElementById('np-flow-steps');
    els.flowHint = document.getElementById('np-flow-hint');
    els.flowSections = document.querySelectorAll('[data-flow-section]');
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
    els.simScenes = document.getElementById('np-sim-scenes');
    els.simMode = document.getElementById('np-sim-mode');
    els.thinkingMap = document.getElementById('np-thinking-map');
    els.simCard = document.getElementById('np-sim-card');
    els.simResonance = document.getElementById('np-sim-resonance');
    els.simTrust = document.getElementById('np-sim-trust');
    els.simTension = document.getElementById('np-sim-tension');
    els.simTrack = document.getElementById('np-sim-track');
    els.simLog = document.getElementById('np-sim-log');
    els.courseProgressLabel = document.getElementById('np-course-progress-label');
    els.courseProgressFill = document.getElementById('np-course-progress-fill');
    els.simPractice = document.getElementById('np-sim-practice');
    els.simNext = document.getElementById('np-sim-next');
    els.guideCard = document.getElementById('np-guide-card');
    els.guideRail = document.getElementById('np-guide-rail');
    els.guideProgressLabel = document.getElementById('np-guide-progress-label');
    els.guideProgressFill = document.getElementById('np-guide-progress-fill');
    els.drillTabs = document.getElementById('np-drill-tabs');
    els.drillBody = document.getElementById('np-drill-body');
    els.toast = document.getElementById('np-toast');
    bind();
    render();

    window.YasnaNegotiationsTrainer = {
      project: 'yasnaproject',
      version: '1.0.0',
      stations: stations,
      simScenes: simScenes.map(function(scene){ return { id: scene.id, title: scene.title, turns: scene.turns.length }; }),
      guideSteps: guideSteps.map(function(step){ return { id: step.id, title: step.title, station: step.station }; }),
      presets: presets.map(function(preset){ return { id: preset.id, title: preset.title }; }),
      getState: function(){ return Object.assign({}, state); },
      analyze: metrics,
      setSimScene: setSimScene,
      selectSimChoice: selectSimChoice,
      nextSimTurn: nextSimTurn,
      setSimTurn: setSimTurn,
      setSimMode: setSimMode,
      setFlowStage: setFlowStage,
      guideProgress: guideProgress,
      setGuideStep: setGuideStep,
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
