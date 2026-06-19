# AuraCue P0 UI rename map v4.1

Generated: 2026-06-18
Updated: 2026-06-19

## Current State

`docs/UI/小程序` now keeps only the top-level, correctly named P0 UI PNG set:

- `P0-*.png`: 14 files, verified by SHA256 before cleanup.
- Old top-level `ChatGPT Image 2026年6月16日 *.png` duplicates: removed on 2026-06-19.
- Temporary probe file `.__codex_copy_probe.png`: removed on 2026-06-19.

The old files were exact byte-for-byte duplicates of the P0 files. The P0 names are the canonical files to use.

Directories such as `backup/`, `new_backup/`, `legacy-unlock-pay-invite/`, `UI_Code/`, `ui_code_backup/`, `icon/`, and `icon.zip` were not changed by this cleanup.

## Naming Rule

Format:

`P0-<flow-order>-<page-or-state-English-name>-<Chinese-function-name>.png`

Core flow:

`Home -> Birth Aura -> Birth Aura Reveal -> Check In -> Tarot Pull -> Reading -> Result -> Activate -> Activated -> Share / My`

## Mapping

| Flow | Route / state | Canonical filename | Removed duplicate filename |
| --- | --- | --- | --- |
| P0-01 | `/home` home guardian star | `P0-01-Home-首页今日守护星.png` | `ChatGPT Image 2026年6月16日 14_42_13.png` |
| P0-02 | `/onboarding/birth-aura` birthday input | `P0-02-BirthAura-输入生日创建本命气场.png` | `ChatGPT Image 2026年6月16日 21_49_35 (2).png` |
| P0-03 | `/onboarding/birth-aura/reveal` birth aura reveal | `P0-03-BirthAuraReveal-本命气场揭示.png` | `ChatGPT Image 2026年6月16日 22_38_58.png` |
| P0-04 | `/today/check-in` check-in and scene selection | `P0-04-CheckIn-今日状态与场景选择.png` | `ChatGPT Image 2026年6月16日 17_49_05 (3).png` |
| P0-05 | `/today/draw` three-card tarot pull | `P0-05-TarotPull-三张塔罗抽卡.png` | `ChatGPT Image 2026年6月16日 17_49_06 (4).png` |
| P0-06A | `/today/reading` light generation progress | `P0-06A-Reading-轻量生成进度.png` | `ChatGPT Image 2026年6月16日 22_12_18 (1).png` |
| P0-06B | `/today/reading` full signal reading progress | `P0-06B-Reading-完整信号读取进度.png` | `ChatGPT Image 2026年6月16日 22_23_14.png` |
| P0-07 | `/result/[id]` oracle result | `P0-07-Result-今日风格神谕结果.png` | `ChatGPT Image 2026年6月16日 22_05_23.png` |
| P0-08 | `/activate/[id]` long-press aura seal | `P0-08-Activate-长按封印今日气场.png` | `ChatGPT Image 2026年6月16日 21_49_35 (8).png` |
| P0-09 | `/activated/[id]` aura sealed | `P0-09-Activated-气场已封印.png` | `ChatGPT Image 2026年6月16日 09_06_16.png` |
| P0-10 | `/share/[id]` aura share card | `P0-10-Share-今日气场分享卡.png` | `ChatGPT Image 2026年6月16日 09_05_49.png` |
| P0-12 | `/my` my aura home | `P0-12-My-我的气场首页.png` | `ChatGPT Image 2026年6月16日 17_30_13.png` |
| P0-13 | `/my/birth-aura` birth aura profile | `P0-13-MyBirthAura-本命气场资料.png` | `ChatGPT Image 2026年6月16日 17_04_50.png` |
| P0-16 | error / retry state | `P0-16-Error-生成失败重试.png` | `ChatGPT Image 2026年6月16日 22_12_19 (2).png` |

## Missing Top-Level P0 UI Images

| Flow | Route / state | Note |
| --- | --- | --- |
| P0-00 | `/` bootstrap / redirect decision | No separate UI image found. |
| P0-11 | `/saved/[id]` saved aura card | No separate UI image found. |
| P0-14 | `/legal/privacy` privacy policy | No separate UI image found. |
| P0-15 | `/legal/terms` terms of use | No separate UI image found. |
