# Negotiations Trainer

## Goal

Build a practical "constructor of negotiations" for `yasnaproject`: a client-side trainer that helps a user prepare a real conversation through the Yasna negotiation model without connecting old production backend resources.

## Source Analysis

The attached PDF and meeting transcript point to one product direction: not a library of manipulative techniques, but a thinking tool for successful negotiations. The model is built around:

- two meeting Yasnas: side A and side B;
- resonance, desonance, and one-sided negotiations;
- the 3-9 axis as the main game of contradiction;
- give/take calibration for both sides;
- visible goals and hidden/shadow goals;
- time, place, atmosphere, and timeliness;
- "ropes of faith" between B's hopes and A's real capacity;
- the result as future history: success, disappointment, or a clean next cycle.

## Options Considered

| Option | Strength | Weakness |
| --- | --- | --- |
| Static lesson | Easy to publish | Does not train decisions in a real case |
| Chat-only roleplay | Feels alive | Needs backend/model integration and can drift into unsafe persuasion |
| Checklist form | Useful preparation | Too flat for the Yasna 12-phase structure |
| Interactive constructor | Maps directly to the source material | Requires more UI and test coverage |

The implemented option is a thinking-first practice flow. It keeps the backend in quarantine and turns the transcript's product idea into a working static trainer.

## Implemented Shape

The trainer at `docs/negotiations.html` has six working layers:

- progressive lesson feed: explanation opens first, practice appears below after "next", debrief appears after the answer, completed lessons stay above for scrolling back;
- rebuilt first lesson: product-style onboarding explains why the entry move matters, gives a formula, anti-patterns, and a pre-answer thinking check;
- sequential trainer: the map/workbench stays hidden until the user reaches it through a completed move;
- step-by-step guide: an eight-step preparation flow tied to the Yasna phases;
- scenario setup: parties, subject, give/take, hidden layer, atmosphere, exit history;
- 12-phase Yasna map: information field through final result, with recommended phase;
- diagnostics: readiness, resonance, desonance risk, fairness, hidden risk, contradiction;
- exercises: hopes questions, 3-9 contradiction, ropes of faith, exit without residue.

## Content Logic Audit

The latest UX/content pass tightens the lesson logic around one repeatable chain:

- situation: what is really happening between A and B right now;
- signal: what the other side is protecting or testing;
- hypothesis: what may be underneath the spoken phrase;
- thinking focus: what the learner must notice before answering;
- practice: three possible A moves with different consequences;
- debrief: why the selected move helped or hurt trust;
- next step: continue the lesson or open the detailed preparation map.

The trainer now treats each answer as the visible result of a thinking loop:

1. Read the situation.
2. Notice the signal.
3. Form a hypothesis about hope, risk, status, or trust.
4. Choose the smallest ethical move.
5. Compare the consequence with the intention.

Key text decisions:

- start with everyday labels (`Начать разговор`, `Понять ожидание`, `Доказать обещание`) before introducing Yasna terms;
- keep the learner-facing language human: `вы`, `собеседник`, `ожидание`, `проверка`, `следующий шаг` instead of exposed `A/B` notation;
- avoid persuasion framing and keep the method ethical: every strong move gives the other side more clarity and a clean way to stop;
- make each lesson train one observable skill, not a broad negotiation theory block;
- add a "thinking pause" before answer selection so the user practices forming a hypothesis, not only clicking the right phrase;
- keep the detailed 12-phase map behind the first completed move so the first screen stays learnable.

## Safety Boundary

The trainer deliberately frames negotiation as ethical resonance:

- no coercion scripts;
- no pressure tactics;
- no old Telegram bot, API gateway, or Firebase realtime;
- no backend calls;
- no connection to the legacy production line.

## Runtime Files

- `docs/negotiations.html`
- `docs/negotiations.css`
- `docs/negotiations.js`
- `docs/preview/negotiations.html`

The page uses the shared `YasnaEnv` and `YasnaTheme` contracts.
