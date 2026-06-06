# AuraCue Owner Scenario Matrix

Persona: first-time AuraCue user, 18-34, opening the mini-program before going out and testing whether the generated Lucky Aura Card is worth saving, sharing, or unlocking.

| Scenario ID | Step ID | Persona Goal | Preconditions | Exact Click/Action | Expected UI/Route | Expected API | Expected DB Readback | Screenshot/Trace Target | Status | Blocker |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCN-001 | 01 | Understand product fast | clean anonymous session | Open mini-program home | `/` renders UI-01 | API-010 `page_view_home` | `analytics_events` has page view | `traces/T24/SCN-001-01.json` | PLANNED |  |
| SCN-001 | 02 | Start generation | home visible | Click `Start My 30-Second Card` | navigates to `/create/scene` | API-010 `click_generate_start` | analytics readback | `traces/T24/SCN-001-02.json` | PLANNED |  |
| SCN-002 | 01 | Choose today's scene | `/create/scene` | Click each scene card once; settle on `Date` | selected scene state | API-010 `select_scene` | analytics readback | `traces/T24/SCN-002-01.json` | PLANNED |  |
| SCN-002 | 02 | Continue after valid scene | scene selected | Click `Continue` | `/create/energy` | none or API-010 | local state persisted | `traces/T24/SCN-002-02.json` | PLANNED |  |
| SCN-003 | 01 | Validate incomplete state | missing energy or scene fixture | Click Generate while incomplete | disabled or validation state UI-04 | no generation job | no new job row | `traces/T24/SCN-003-01.json` | PLANNED |  |
| SCN-003 | 02 | Choose energy and generate | scene selected | Click `Confidence`, then `Generate My Lucky Aura Card` | `/create/loading` UI-05 | API-001 create job; API-010 select/generation events | `generation_jobs` created | `traces/T24/SCN-003-02.json` | PLANNED |  |
| SCN-004 | 01 | Wait through ritual | job pending | Let local mock complete | UI-05 then `/result/:id` | API-002 poll/read job | `generation_jobs.status=success`, `aura_cards` created | `traces/T24/SCN-004-01.json` | PLANNED |  |
| SCN-005 | 01 | Review free preview | card locked | View `/result/:id` | UI-06 locked preview | API-003 `view=free` | `aura_cards` read | `traces/T24/SCN-005-01.json` | PLANNED |  |
| SCN-006 | 01 | Open unlock options | free preview | Click `Unlock Full Card` | `/unlock/:id` UI-07 | API-010 `click_unlock` | analytics readback | `traces/T24/SCN-006-01.json` | PLANNED |  |
| SCN-007 | 01 | Try invite unlock | unlock page | Click `Invite 3 friends instead` | `/invite/:id` UI-08 | API-006 invite_started | `share_events` has invite start | `traces/T24/SCN-007-01.json` | PLANNED |  |
| SCN-007 | 02 | Invite progress | invite page | Click `Invite Friends`, `Copy`, `Invite Again`, `How it works?` | UI-09 progress and explainer | API-006 progress, API-008 share/copy where applicable | invite/share readback | `traces/T24/SCN-007-02.json` | PLANNED |  |
| SCN-008 | 01 | Friend accepts invite | valid invite code | Open `/invite/landing/:code`, click `Generate My Lucky Aura Card` | UI-10 then home/create | API-006 friend event | invite progress increments once | `traces/T24/SCN-008-01.json` | PLANNED |  |
| SCN-009 | 01 | Try paid unlock | unlock page | Click paid unlock, then `Confirm Unlock $1.99` | UI-11 confirm | API-005 create mock order | `payment_orders.status=pending` | `traces/T24/SCN-009-01.json` | PLANNED |  |
| SCN-010 | 01 | Recover failed payment | forced failure | Click `Try Again`, `Restore Purchase`, `Invite 3 Friends Instead`, `Contact Support` | UI-12 and recovery actions | API-005 failed order; API-004 restore if fixture has entitlement | failed order readback; no accidental entitlement unless restore fixture | `traces/T24/SCN-010-01.json` | PLANNED |  |
| SCN-011 | 01 | Complete mock payment | mock success | Confirm payment success, click `View Full Card` | UI-13 then `/result/:id/full` | API-005 complete; API-004 unlock | entitlement true readback | `traces/T24/SCN-011-01.json` | PLANNED |  |
| SCN-012 | 01 | Read full result | unlocked card | Scroll/read full page; click `Save Card`, `Share Story`, `More Sharing Options`, `View 7-Day Trend` | UI-14; P1 trend disabled/explained | API-003 full; API-007 save; API-008 share | card saved/share events readback | `traces/T24/SCN-012-01.json` | PLANNED |  |
| SCN-013 | 01 | Share card | full result or share route | Open `/share/:id`, click save/share/channel options/cancel | UI-15/UI-16 | API-009 render; API-008 share | rendered asset/share readback | `traces/T24/SCN-013-01.json` | PLANNED |  |
| SCN-014 | 01 | Confirm save | saved route | Click `Share Now`, then return and `Back Home` | UI-17 then `/share/:id` and `/` | API-007 save; API-010 events | saved card + events readback | `traces/T24/SCN-014-01.json` | PLANNED |  |
| SCN-015 | 01 | Recover network/generation failure | forced generation failure | See UI-18, click `Try Again`, then `Change Scene` | retry loading or scene route | API-001/API-002 failure and retry | failed then retried job readback | `traces/T24/SCN-015-01.json` | PLANNED |  |
| SCN-016 | 01 | Keep MVP focused | full result page has P1 trend prompt | Click P1-only trend/account/history affordance if visible | disabled/toast/coming-later, no P1 page implementation | API-010 optional event | no P1 data mutation | `traces/T24/SCN-016-01.json` | PLANNED |  |

## Exact-Click Completion Rule
T24 cannot report a clean verdict unless every row above has route/state evidence, API evidence where applicable, DB readback where applicable, and a visible UI trace or screenshot target.
