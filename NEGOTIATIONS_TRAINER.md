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

The implemented option is a sequential interactive practice flow. It keeps the backend in quarantine and turns the transcript's product idea into a working static trainer.

## Implemented Shape

The trainer at `docs/negotiations.html` has six working layers:

- simulator course: choose a scene, move lesson by lesson, answer B, unlock the next step, see resonance/trust/tension effects;
- step-by-step guide: an eight-step preparation flow tied to the Yasna phases;
- scenario setup: parties, subject, give/take, hidden layer, atmosphere, exit history;
- 12-phase Yasna map: information field through final result, with recommended phase;
- diagnostics: readiness, resonance, desonance risk, fairness, hidden risk, contradiction;
- exercises: hopes questions, 3-9 contradiction, ropes of faith, exit without residue.

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
