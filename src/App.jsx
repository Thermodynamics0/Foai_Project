import { useState, useRef, useEffect, useCallback } from "react";

const style = document.createElement("style");
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Josefin+Sans:wght@300;400;600&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy-deep: #060910;
    --navy: #05172f;
    --navy-mid: #182a3a;
    --navy-light: #2d3c4c;
    --gold: #c2a072;
    --gold-bright: #d6bb80;
    --gold-dim: #a08348;
    --gold-glow: rgba(194,160,114,0.12);
    --teal: #3ecfb0;
    --teal-dim: rgba(62,207,176,0.15);
    --rose: #e87b6c;
    --smoke: #7a7e74;
    --smoke-light: #9a9e96;
    --slate: #364049;
    --cream: #f0e8d8;
    --cream-dim: rgba(240,232,216,0.65);
    --text-muted: rgba(194,160,114,0.4);
    --border: rgba(194,160,114,0.16);
    --border-bright: rgba(194,160,114,0.38);
    --r: 6px;
    --r-lg: 14px;
    --r-xl: 20px;
    --sw: 228px;
  }

  .cs-app {
    font-family: 'Josefin Sans', sans-serif;
    display: flex; width: 100%; height: 100vh;
    background: var(--navy-deep);
    color: var(--cream);
    -webkit-font-smoothing: antialiased;
    overflow: hidden;
  }

  .cs-app ::-webkit-scrollbar { width: 3px; }
  .cs-app ::-webkit-scrollbar-track { background: transparent; }
  .cs-app ::-webkit-scrollbar-thumb { background: var(--gold-dim); border-radius: 2px; }

  /* SIDEBAR */
  .sidebar {
    width: var(--sw);
    background: linear-gradient(175deg, var(--navy) 0%, #040c1a 100%);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    flex-shrink: 0; padding: 32px 0 26px;
    position: relative; overflow: hidden;
  }
  .sidebar::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold-dim), transparent);
  }
  .sidebar::after {
    content: '';
    position: absolute; bottom: 0; left: 0; right: 0; height: 200px;
    background: radial-gradient(ellipse at bottom center, rgba(62,207,176,0.04) 0%, transparent 70%);
    pointer-events: none;
  }

  .brand { padding: 0 20px 34px; border-bottom: 1px solid var(--border); margin-bottom: 8px; }
  .brand-eyebrow {
    font-family: 'Space Mono', monospace;
    font-size: 0.5rem; letter-spacing: 0.26em;
    text-transform: uppercase; color: var(--teal);
    opacity: 0.7; margin-bottom: 9px; display: block;
  }
  .brand-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.65rem; font-weight: 600;
    color: var(--gold-bright); line-height: 1; letter-spacing: 0.02em;
  }
  .brand-name em { font-style: italic; color: var(--cream); font-weight: 300; }
  .brand-rule { width: 28px; height: 1px; background: linear-gradient(90deg, var(--gold), transparent); margin-top: 11px; }

  .nav { display: flex; flex-direction: column; gap: 1px; padding: 14px 12px; flex: 1; }
  .nav-section-label {
    font-family: 'Space Mono', monospace;
    font-size: 0.45rem; letter-spacing: 0.24em; text-transform: uppercase;
    color: rgba(62,207,176,0.35); padding: 10px 10px 4px; margin-top: 4px;
  }
  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 11px; border-radius: var(--r);
    color: var(--text-muted);
    font-family: 'Josefin Sans', sans-serif;
    font-size: 0.7rem; font-weight: 400;
    letter-spacing: 0.12em; text-transform: uppercase;
    cursor: pointer; border: 1px solid transparent;
    background: none; width: 100%; text-align: left;
    transition: all 0.2s ease;
  }
  .nav-item:hover { color: var(--gold); background: var(--gold-glow); border-color: var(--border); }
  .nav-item.active {
    color: var(--navy-deep);
    background: linear-gradient(135deg, var(--gold-bright), var(--gold));
    border-color: transparent; font-weight: 600;
  }
  .nav-item.active svg { color: var(--navy-deep); }
  .nav-item.active .nav-num { opacity: 0.5; }
  .nav-item.active-teal {
    color: #050e1a;
    background:linear-gradient(135deg, var(--gold-bright), var(--gold));
    border-color: transparent; font-weight: 600;
  }
  .nav-item.active-teal svg { color: #050e1a; }
  .nav-num { margin-left: auto; font-size: 0.52rem; opacity: 0.45; font-weight: 300; font-family: 'Space Mono', monospace; }

  .sidebar-footer { margin-top: auto; padding: 18px 20px 0; border-top: 1px solid var(--border); }
  .stats-row { display: flex; gap: 26px; }
  .stat-item { display: flex; flex-direction: column; gap: 3px; }
  .stat-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.75rem; font-weight: 600;
    color: var(--gold-bright); line-height: 1;
  }
  .stat-label { font-size: 0.52rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.16em; font-family: 'Space Mono', monospace; }

  /* MAIN */
  .main {
    flex: 1; overflow-y: auto;
    background: linear-gradient(155deg, #0a121c 0%, var(--navy-deep) 55%);
    position: relative;
  }
  .main::before {
    content: '';
    position: fixed; top: 0; right: 0;
    width: 480px; height: 480px;
    background: radial-gradient(ellipse at top right, rgba(194,160,114,0.04) 0%, transparent 60%);
    pointer-events: none;
  }

  .view { padding: 42px 46px; max-width: 1260px; animation: csSlideUp 0.35s ease-out; }

  @keyframes csSlideUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* VIEW HEADER */
  .view-header {
    display: flex; align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 38px; padding-bottom: 22px;
    border-bottom: 1px solid var(--border);
    position: relative;
  }
  .view-header::after {
    content: ''; position: absolute; bottom: -1px; left: 0;
    width: 72px; height: 1px; background: var(--gold);
  }
  .view-eyebrow {
    font-family: 'Space Mono', monospace;
    font-size: 0.52rem; letter-spacing: 0.24em;
    text-transform: uppercase; color: var(--teal); opacity: 0.75; margin-bottom: 7px;
  }
  .view-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.8rem; font-weight: 300;
    color: var(--cream); letter-spacing: -0.01em; line-height: 1;
  }
  .view-title em { font-style: italic; color: var(--gold-bright); font-weight: 300; }

  /* BUTTONS */
  .btn-primary {
    background: linear-gradient(135deg, var(--gold-bright), var(--gold));
    color: var(--navy-deep); border: none; border-radius: var(--r);
    padding: 10px 22px;
    font-family: 'Josefin Sans', sans-serif;
    font-size: 0.66rem; font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase;
    cursor: pointer; transition: all 0.2s;
    box-shadow: 0 4px 18px rgba(194,160,114,0.22);
  }
  .btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 26px rgba(194,160,114,0.32); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-teal {
    background: linear-gradient(135deg, #5ddfc8, var(--teal));
    color: #050e1a; border: none; border-radius: var(--r);
    padding: 10px 22px;
    font-family: 'Josefin Sans', sans-serif;
    font-size: 0.66rem; font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase;
    cursor: pointer; transition: all 0.2s;
    box-shadow: 0 4px 18px rgba(62,207,176,0.2);
  }
  .btn-teal:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 26px rgba(62,207,176,0.32); }
  .btn-teal:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-ghost {
    background: transparent; color: var(--gold);
    border: 1px solid var(--border-bright); border-radius: var(--r);
    padding: 8px 15px;
    font-family: 'Josefin Sans', sans-serif;
    font-size: 0.63rem; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase;
    cursor: pointer; transition: all 0.15s;
  }
  .btn-ghost:hover:not(:disabled) { background: var(--gold-glow); border-color: var(--gold); }
  .btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }
  .btn-sm-teal {
    background: transparent; color: var(--teal);
    border: 1px solid rgba(62,207,176,0.3); border-radius: var(--r);
    padding: 6px 12px;
    font-family: 'Space Mono', monospace;
    font-size: 0.54rem; font-weight: 400;
    letter-spacing: 0.08em; text-transform: uppercase;
    cursor: pointer; transition: all 0.15s;
  }
  .btn-sm-teal:hover { background: var(--teal-dim); border-color: var(--teal); }

  /* STUDIO */
  .studio-layout { display: grid; grid-template-columns: 330px 1fr; gap: 18px; align-items: start; }
  .brief-panel, .output-panel {
    background: linear-gradient(175deg, var(--navy-mid) 0%, var(--navy) 100%);
    border: 1px solid var(--border);
    border-radius: var(--r-xl); overflow: hidden;
    box-shadow: 0 8px 36px rgba(0,0,0,0.45);
  }
  .panel-label {
    padding: 14px 20px;
    font-family: 'Space Mono', monospace;
    font-size: 0.5rem; letter-spacing: 0.22em;
    text-transform: uppercase; color: var(--text-muted);
    border-bottom: 1px solid var(--border);
    background: rgba(0,0,0,0.18);
  }
  .field-group { padding: 13px 19px; border-bottom: 1px solid var(--border); }
  .field-row { display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid var(--border); }
  .field-row .field-group { border-bottom: none; }
  .field-row .field-group:first-child { border-right: 1px solid var(--border); }
  .field-label {
    display: block;
    font-family: 'Space Mono', monospace;
    font-size: 0.5rem; letter-spacing: 0.16em;
    text-transform: uppercase; color: var(--gold-dim); margin-bottom: 7px;
  }
  .field-input {
    width: 100%; background: rgba(0,0,0,0.28);
    border: 1px solid var(--border); border-radius: var(--r);
    color: var(--cream);
    font-family: 'Josefin Sans', sans-serif;
    font-size: 0.8rem; font-weight: 300;
    padding: 8px 10px; transition: border-color 0.15s; appearance: none;
  }
  .field-input:focus { outline: none; border-color: var(--gold-dim); }
  .field-input::placeholder { color: var(--text-muted); }
  option { background: var(--navy-mid); color: var(--cream); }
  .field-textarea {
    width: 100%; background: rgba(0,0,0,0.28);
    border: 1px solid var(--border); border-radius: var(--r);
    color: var(--cream);
    font-family: 'Josefin Sans', sans-serif;
    font-size: 0.8rem; font-weight: 300;
    padding: 8px 10px; resize: vertical; min-height: 72px;
    transition: border-color 0.15s;
  }
  .field-textarea:focus { outline: none; border-color: var(--gold-dim); }
  .field-textarea::placeholder { color: var(--text-muted); }

  .channels { display: flex; flex-wrap: wrap; gap: 5px; }
  .channel-chip {
    display: flex; align-items: center; gap: 6px;
    font-family: 'Josefin Sans', sans-serif;
    font-size: 0.66rem; letter-spacing: 0.06em;
    color: var(--cream-dim); background: rgba(0,0,0,0.22);
    border: 1px solid var(--border); border-radius: 20px;
    padding: 5px 11px; cursor: pointer; transition: all 0.15s;
  }
  .channel-chip:hover { border-color: var(--gold-dim); color: var(--gold); }
  .channel-chip input { accent-color: var(--gold); cursor: pointer; }

  .slider-row { display: flex; align-items: center; gap: 11px; }
  .slider-row input[type=range] {
    flex: 1; appearance: none;
    background: rgba(0,0,0,0.28); height: 2px; border-radius: 2px; outline: none;
  }
  .slider-row input[type=range]::-webkit-slider-thumb {
    appearance: none; width: 12px; height: 12px;
    background: var(--gold); border-radius: 50%; cursor: pointer;
    box-shadow: 0 0 7px rgba(194,160,114,0.5);
  }
  .slider-val {
    font-family: 'Space Mono', monospace;
    font-size: 0.6rem; color: var(--gold); min-width: 36px; letter-spacing: 0.05em;
  }

  /* OUTPUT */
  .output-tabs { display: flex; border-bottom: 1px solid var(--border); background: rgba(0,0,0,0.18); }
  .tab {
    background: none; border: none; border-bottom: 2px solid transparent;
    color: var(--text-muted);
    font-family: 'Space Mono', monospace;
    font-size: 0.54rem; letter-spacing: 0.12em; text-transform: uppercase;
    padding: 13px 17px; cursor: pointer; margin-bottom: -1px; transition: all 0.15s;
  }
  .tab:hover { color: var(--gold); }
  .tab.active { color: var(--gold-bright); border-bottom-color: var(--gold); font-weight: 700; }

  .output-area { position: relative; min-height: 380px; display: flex; flex-direction: column; }
  .output-placeholder {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 12px; padding: 48px; text-align: center;
  }
  .ph-big {
    font-family: 'Cormorant Garamond', serif;
    font-size: 5rem; font-weight: 300; font-style: italic;
    color: rgba(194,160,114,0.07);
    letter-spacing: -0.02em; line-height: 1;
  }
  .output-placeholder p { font-size: 0.76rem; color: var(--text-muted); letter-spacing: 0.06em; }
  .output-body {
    flex: 1; padding: 20px; font-size: 0.86rem; line-height: 1.85;
    color: var(--cream-dim); max-height: 380px; overflow-y: auto;
    white-space: pre-wrap; font-weight: 300;
  }
  .social-cards { padding: 15px 18px; display: flex; flex-direction: column; gap: 9px; max-height: 380px; overflow-y: auto; }
  .social-card {
    background: rgba(0,0,0,0.28); border: 1px solid var(--border);
    border-radius: var(--r-lg); padding: 13px 15px; transition: border-color 0.15s;
  }
  .social-card:hover { border-color: var(--border-bright); }
  .sc-platform {
    font-family: 'Space Mono', monospace;
    font-size: 0.5rem; font-weight: 700;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--gold-dim); margin-bottom: 7px;
  }
  .sc-text { font-size: 0.82rem; line-height: 1.65; color: var(--cream-dim); font-weight: 300; }
  .output-actions {
    padding: 13px 19px; border-top: 1px solid var(--border);
    display: flex; align-items: center; gap: 9px; background: rgba(0,0,0,0.18);
    flex-wrap: wrap;
  }
  .status-badge {
    font-family: 'Space Mono', monospace;
    font-size: 0.48rem; font-weight: 700;
    letter-spacing: 0.15em; text-transform: uppercase;
    margin-left: auto; padding: 3px 11px; border-radius: 20px;
  }
  .status-badge.review { background: rgba(194,160,114,0.12); color: var(--gold); border: 1px solid var(--border-bright); }
  .status-badge.approved { background: linear-gradient(135deg, var(--gold-bright), var(--gold)); color: var(--navy-deep); }

  /* GENERATING */
  .gen-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(155deg, var(--navy) 0%, var(--navy-deep) 100%);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 14px; z-index: 10;
  }
  .gen-word {
    font-family: 'Cormorant Garamond', serif;
    font-size: 3.2rem; font-weight: 300; font-style: italic;
    color: var(--gold-bright); letter-spacing: 0.02em; line-height: 1;
    animation: fade-word 0.45s ease-in-out;
  }
  @keyframes fade-word { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .gen-label { font-family: 'Space Mono', monospace; font-size: 0.58rem; color: var(--text-muted); letter-spacing: 0.18em; text-transform: uppercase; }
  .gen-steps { display: flex; flex-direction: column; gap: 3px; align-items: center; font-family: 'Space Mono', monospace; font-size: 0.54rem; color: var(--text-muted); letter-spacing: 0.05em; }

  /* KANBAN */
  .kanban { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  .kanban-col { display: flex; flex-direction: column; gap: 10px; }
  .kanban-header {
    display: flex; align-items: center; gap: 6px;
    font-family: 'Space Mono', monospace;
    font-size: 0.52rem; font-weight: 700; letter-spacing: 0.16em;
    text-transform: uppercase; color: var(--text-muted); padding: 2px 0 8px;
    border-bottom: 1px solid var(--border);
  }
  .k-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
  .k-dot.draft { background: var(--smoke); }
  .k-dot.review { background: var(--gold); }
  .k-dot.approved { background: var(--teal); }
  .k-dot.published { background: var(--rose); }
  .k-count { margin-left: auto; font-size: 0.58rem; opacity: 0.5; }
  .kanban-cards { display: flex; flex-direction: column; gap: 8px; }
  .kanban-card {
    background: linear-gradient(175deg, var(--navy-mid), var(--navy));
    border: 1px solid var(--border); border-radius: var(--r-lg);
    padding: 13px 15px;
    box-shadow: 0 4px 18px rgba(0,0,0,0.35);
    transition: border-color 0.15s, transform 0.15s;
  }
  .kanban-card:hover { border-color: var(--border-bright); transform: translateY(-1px); }
  .kanban-card.published { opacity: 0.6; }
  .kc-type {
    display: inline-block;
    font-family: 'Space Mono', monospace;
    font-size: 0.44rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
    padding: 2px 8px; border-radius: 3px; margin-bottom: 9px;
  }
  .kc-type.blog { background: rgba(194,160,114,0.12); color: var(--gold); }
  .kc-type.social { background: var(--teal-dim); color: var(--teal); }
  .kc-type.newsletter { background: rgba(232,123,108,0.12); color: var(--rose); }
  .kc-title { font-size: 0.78rem; font-weight: 400; color: var(--cream-dim); line-height: 1.5; margin-bottom: 8px; }
  .kc-meta { font-family: 'Space Mono', monospace; font-size: 0.48rem; color: var(--text-muted); letter-spacing: 0.05em; margin-bottom: 10px; }
  .kc-footer { display: flex; align-items: center; justify-content: space-between; }
  .kc-time { font-family: 'Space Mono', monospace; font-size: 0.46rem; color: var(--text-muted); }
  .kc-btn {
    background: transparent; border: 1px solid var(--border-bright);
    color: var(--gold); border-radius: var(--r);
    font-family: 'Space Mono', monospace; font-size: 0.48rem; letter-spacing: 0.06em;
    padding: 4px 9px; cursor: pointer; transition: all 0.15s;
  }
  .kc-btn:hover { background: var(--gold-glow); }

  /* CALENDAR */
  .calendar-grid {
    display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; margin-bottom: 20px;
  }
  .cal-day-name {
    font-family: 'Space Mono', monospace;
    font-size: 0.52rem; font-weight: 700; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--text-muted);
    text-align: center; padding: 8px 0 12px;
  }
  .cal-day {
    min-height: 76px; padding: 9px;
    background: linear-gradient(175deg, var(--navy-mid) 0%, var(--navy) 100%);
    border: 1px solid var(--border); border-radius: var(--r-lg);
    font-family: 'Space Mono', monospace; font-size: 0.6rem;
    color: var(--cream-dim); position: relative; transition: border-color 0.15s;
  }
  .cal-day:hover:not(.empty) { border-color: var(--border-bright); }
  .cal-day.empty { background: transparent; border-color: transparent; }
  .cal-day.today { border-color: var(--gold-dim); }
  .cal-day.today::after { content: ''; position: absolute; top: 7px; right: 7px; width: 4px; height: 4px; border-radius: 50%; background: var(--gold); }
  .cal-event {
    margin-top: 8px; padding: 3px 7px; border-radius: 4px;
    font-family: 'Space Mono', monospace; font-size: 0.44rem; letter-spacing: 0.06em;
  }
  .cal-event.blog { background: rgba(194,160,114,0.12); color: var(--gold); }
  .cal-event.social { background: var(--teal-dim); color: var(--teal); }
  .cal-event.newsletter { background: rgba(232,123,108,0.12); color: var(--rose); }
  .cal-legend { display: flex; gap: 20px; }
  .cal-leg {
    font-family: 'Space Mono', monospace;
    font-size: 0.5rem; letter-spacing: 0.1em; text-transform: uppercase;
    padding: 4px 12px; border-radius: 4px;
  }
  .cal-leg.blog { background: rgba(194,160,114,0.12); color: var(--gold); }
  .cal-leg.social { background: var(--teal-dim); color: var(--teal); }
  .cal-leg.newsletter { background: rgba(232,123,108,0.12); color: var(--rose); }
  .cal-nav { display: flex; gap: 8px; }

  /* BRAND */
  .brand-layout { display: flex; flex-direction: column; gap: 18px; }
  .brand-section {
    background: linear-gradient(175deg, var(--navy-mid), var(--navy));
    border: 1px solid var(--border); border-radius: var(--r-xl);
    padding: 24px 26px; box-shadow: 0 4px 18px rgba(0,0,0,0.3);
  }
  .brand-section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.2rem; font-weight: 300; color: var(--cream);
    margin-bottom: 18px; padding-bottom: 12px; border-bottom: 1px solid var(--border);
  }
  .tone-sliders { display: flex; flex-direction: column; gap: 14px; }
  .tone-row { display: flex; align-items: center; gap: 12px; }
  .tone-label-l, .tone-label-r {
    font-family: 'Space Mono', monospace;
    font-size: 0.54rem; color: var(--text-muted); letter-spacing: 0.08em;
    min-width: 64px;
  }
  .tone-label-r { text-align: right; }
  .tone-row input[type=range] {
    flex: 1; appearance: none; height: 2px; border-radius: 2px; outline: none; cursor: pointer;
  }
  .tone-row input[type=range]::-webkit-slider-thumb {
    appearance: none; width: 12px; height: 12px;
    background: var(--gold); border-radius: 50%; cursor: pointer;
    box-shadow: 0 0 7px rgba(194,160,114,0.5);
  }
  .vocab-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .vocab-header {
    font-family: 'Space Mono', monospace;
    font-size: 0.52rem; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--teal); margin-bottom: 10px;
  }
  .vocab-header.avoid { color: var(--rose); }
  .vocab-tags { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 10px; min-height: 28px; }
  .vocab-tag {
    font-family: 'Space Mono', monospace; font-size: 0.56rem; letter-spacing: 0.04em;
    padding: 3px 10px; border-radius: 20px; cursor: pointer; transition: all 0.15s;
  }
  .vocab-tag.use { background: var(--teal-dim); color: var(--teal); border: 1px solid rgba(62,207,176,0.2); }
  .vocab-tag.use:hover { background: rgba(62,207,176,0.25); }
  .vocab-tag.avoid { background: rgba(232,123,108,0.1); color: var(--rose); border: 1px solid rgba(232,123,108,0.2); }
  .vocab-tag.avoid:hover { background: rgba(232,123,108,0.2); }
  .vocab-input {
    width: 100%; background: rgba(0,0,0,0.28);
    border: 1px solid var(--border); border-radius: var(--r);
    color: var(--cream);
    font-family: 'Space Mono', monospace; font-size: 0.6rem;
    padding: 7px 10px;
  }
  .vocab-input:focus { outline: none; border-color: var(--gold-dim); }
  .vocab-input::placeholder { color: var(--text-muted); }

  /* ── IMAGE STUDIO ── */
  .img-studio-layout {
    display: grid;
    grid-template-columns: 340px 1fr;
    gap: 18px;
    align-items: start;
  }

  .img-config-panel {
    background: linear-gradient(175deg, var(--navy-mid) 0%, var(--navy) 100%);
    border: 1px solid var(--border);
    border-radius: var(--r-xl); overflow: hidden;
    box-shadow: 0 8px 36px rgba(0,0,0,0.45);
  }

  .img-output-panel {
    background: linear-gradient(175deg, var(--navy-mid) 0%, var(--navy) 100%);
    border: 1px solid var(--border);
    border-radius: var(--r-xl); overflow: hidden;
    box-shadow: 0 8px 36px rgba(0,0,0,0.45);
    min-height: 560px;
    display: flex; flex-direction: column;
  }

  .img-preview-area {
    flex: 1; position: relative;
    display: flex; align-items: center; justify-content: center;
    min-height: 400px;
    background: rgba(0,0,0,0.2);
    overflow: hidden;
  }

  .img-canvas {
    width: 100%; height: 100%; position: absolute; inset: 0;
  }

  .img-placeholder {
    display: flex; flex-direction: column; align-items: center;
    gap: 14px; padding: 48px; text-align: center; position: relative; z-index: 1;
  }
  .img-ph-icon {
    width: 72px; height: 72px;
    border: 1px solid var(--border);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    background: rgba(62,207,176,0.05);
  }
  .img-ph-icon svg { color: var(--teal); opacity: 0.4; }
  .img-placeholder p { font-size: 0.76rem; color: var(--text-muted); letter-spacing: 0.06em; }
  .img-placeholder span {
    font-family: 'Space Mono', monospace;
    font-size: 0.5rem; color: rgba(62,207,176,0.35); letter-spacing: 0.18em; text-transform: uppercase;
  }

  .generated-image-wrapper {
    width: 100%; height: 100%; position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .generated-image-wrapper img {
    width: 100%; height: 100%; object-fit: cover;
  }

  /* SVG Art Image */
  .svg-art-container {
    width: 100%; height: 400px; position: relative; overflow: hidden;
  }

  /* Caption Cards Below Image */
  .caption-strip {
    border-top: 1px solid var(--border);
    padding: 18px;
    background: rgba(0,0,0,0.18);
  }
  .caption-strip-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 14px;
  }
  .caption-strip-title {
    font-family: 'Space Mono', monospace;
    font-size: 0.5rem; letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--teal); opacity: 0.8;
  }
  .caption-tabs { display: flex; gap: 6px; }
  .caption-tab {
    font-family: 'Space Mono', monospace;
    font-size: 0.48rem; letter-spacing: 0.1em; text-transform: uppercase;
    padding: 4px 10px; border-radius: 20px; cursor: pointer;
    border: 1px solid var(--border); background: transparent;
    color: var(--text-muted); transition: all 0.15s;
  }
  .caption-tab.active { background: var(--teal-dim); color: var(--teal); border-color: rgba(62,207,176,0.3); }
  .caption-tab:hover:not(.active) { border-color: var(--gold-dim); color: var(--gold); }

  .caption-content {
    font-size: 0.84rem; line-height: 1.75; color: var(--cream-dim); font-weight: 300;
    min-height: 60px; padding: 10px 0;
    white-space: pre-wrap;
  }
  .caption-actions {
    display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap;
  }

  /* Image generating overlay */
  .img-gen-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(155deg, rgba(5,23,47,0.97) 0%, rgba(6,9,16,0.97) 100%);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 18px; z-index: 20;
  }
  .img-gen-progress {
    width: 180px; height: 1px; background: rgba(62,207,176,0.1); border-radius: 1px; overflow: hidden;
  }
  .img-gen-bar {
    height: 100%; background: linear-gradient(90deg, var(--teal), var(--gold));
    border-radius: 1px; transition: width 0.6s ease;
  }
  .img-gen-status {
    font-family: 'Space Mono', monospace;
    font-size: 0.58rem; color: var(--teal); letter-spacing: 0.16em; text-transform: uppercase;
    opacity: 0.8;
  }
  .img-gen-word {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.6rem; font-weight: 300; font-style: italic;
    color: var(--teal); letter-spacing: 0.02em; line-height: 1;
    animation: fade-word 0.45s ease-in-out;
  }

  /* Style selector chips */
  .style-chips { display: flex; flex-wrap: wrap; gap: 5px; }
  .style-chip {
    font-family: 'Space Mono', monospace;
    font-size: 0.5rem; letter-spacing: 0.08em;
    padding: 5px 11px; border-radius: 20px; cursor: pointer;
    border: 1px solid var(--border); background: transparent;
    color: var(--cream-dim); transition: all 0.15s;
  }
  .style-chip:hover { border-color: var(--teal); color: var(--teal); }
  .style-chip.selected { background: var(--teal-dim); color: var(--teal); border-color: rgba(62,207,176,0.4); }

  /* Aspect ratio selector */
  .aspect-chips { display: flex; gap: 5px; }
  .aspect-chip {
    flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px;
    font-family: 'Space Mono', monospace; font-size: 0.48rem; letter-spacing: 0.06em;
    padding: 8px 6px; border-radius: var(--r); cursor: pointer;
    border: 1px solid var(--border); background: transparent;
    color: var(--cream-dim); transition: all 0.15s;
  }
  .aspect-chip:hover { border-color: var(--gold-dim); color: var(--gold); }
  .aspect-chip.selected { background: var(--gold-glow); color: var(--gold-bright); border-color: var(--gold-dim); }
  .aspect-chip-preview { border: 1px solid currentColor; opacity: 0.6; }

  /* Post preview overlay */
  .post-preview-overlay {
    position: absolute; inset: 0; z-index: 5;
    display: flex; flex-direction: column;
    pointer-events: none;
  }
  .post-preview-grad {
    margin-top: auto;
    background: linear-gradient(to top, rgba(5,9,15,0.88) 0%, transparent 100%);
    padding: 24px 22px 18px;
  }
  .post-preview-caption {
    font-family: 'Josefin Sans', sans-serif;
    font-size: 0.82rem; font-weight: 300; line-height: 1.6;
    color: rgba(240,232,216,0.9);
    letter-spacing: 0.02em;
    display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
  }
  .post-preview-tags {
    margin-top: 6px;
    font-family: 'Space Mono', monospace; font-size: 0.52rem;
    color: var(--teal); letter-spacing: 0.04em;
    opacity: 0.8;
  }

  /* Platform preview badge */
  .platform-badge {
    position: absolute; top: 14px; left: 14px;
    font-family: 'Space Mono', monospace; font-size: 0.48rem; letter-spacing: 0.12em;
    text-transform: uppercase; padding: 4px 10px; border-radius: 20px;
    background: rgba(6,9,16,0.7); border: 1px solid rgba(240,232,216,0.15);
    color: rgba(240,232,216,0.6); z-index: 6;
    backdrop-filter: blur(4px);
  }

  /* Regenerate shimmer effect */
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  .loading-shimmer {
    background: linear-gradient(90deg, rgba(62,207,176,0.05) 25%, rgba(62,207,176,0.12) 50%, rgba(62,207,176,0.05) 75%);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }
`;
document.head.appendChild(style);

// ─── ICONS ───
const icons = {
  Studio: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  Pipeline: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>,
  Calendar: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
  Brand: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/></svg>,
  Image: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>,
  Copy: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>,
  Download: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Refresh: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>,
};

// ─── GROQ API CALL (FREE & FAST) ───
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

async function callLLM(systemPrompt, userPrompt) {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",  // Fast, free, high-quality
        max_tokens: 2000,
        temperature: 0.7,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Groq API Error:", errorData);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content || !content.trim()) {
      throw new Error("Empty response from API");
    }
    
    return content;
  } catch (error) {
    console.error("Groq API Error:", error);
    // Return a helpful error message instead of failing silently
    return `[AI Generation Error] ${error.message}. Please check your internet connection and try again.\n\nRequested prompt: ${userPrompt.substring(0, 200)}...`;
  }
}

// ─── STUDIO VIEW ───
function StudioView() {
  const topicRef = useRef();
  const audienceRef = useRef();
  const [wordCount, setWordCount] = useState(600);
  const [tab, setTab] = useState('blog');
  const [generating, setGenerating] = useState(false);
  const [content, setContent] = useState(null);
  const [status, setStatus] = useState({ blog: '', social: '', email: '' });
  const [copied, setCopied] = useState('');
  const [genWord, setGenWord] = useState('');
  const [genSteps, setGenSteps] = useState([]);

  async function generate() {
    const topic = topicRef.current?.value || 'AI in Content Marketing';
    const audience = audienceRef.current?.value || 'Marketing teams';
    
    if (!topic.trim()) {
      alert("Please enter a topic");
      return;
    }
    
    setGenerating(true); 
    setContent(null); 
    setGenSteps([]);
    
    const words = ['Crafting', 'Weaving', 'Sculpting', 'Distilling', 'Composing'];
    let wi = 0;
    const wInt = setInterval(() => { 
      setGenWord(words[wi % words.length]); 
      wi++; 
    }, 800);
    
    const steps = ['Analyzing brief...', 'Building narrative arc...', 'Adapting for channels...'];
    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 900));
      setGenSteps(p => [...p, steps[i]]);
    }
    
    try {
      const [blog, social, email] = await Promise.all([
        callLLM('You are an expert content writer. Write a blog post. Be concise and professional. Include a title at the beginning.', `Write a ${wordCount}-word blog post about "${topic}" for ${audience}. Use clear paragraphs and an engaging tone.`),
        callLLM('You are a social media expert. Respond ONLY with JSON, no markdown, no extra text.', `Create 3 platform-specific social captions about "${topic}" for ${audience}. Return ONLY valid JSON in this exact format: {"captions":[{"platform":"LinkedIn","text":"caption here"},{"platform":"Instagram","text":"caption here"},{"platform":"Twitter/X","text":"caption here"}]}`),
        callLLM('You are an email newsletter writer. Be engaging and direct.', `Write a newsletter snippet about "${topic}" for ${audience}. Start with a subject line in brackets like [Subject: ...], then write the email body. Keep it under 250 words.`),
      ]);
      
      let socialParsed;
      try { 
        const cleanJson = social.replace(/```json|```/g, '').trim();
        const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
        const validJson = jsonMatch ? jsonMatch[0] : cleanJson;
        socialParsed = JSON.parse(validJson).captions; 
      } catch (err) { 
        console.error("Failed to parse social JSON:", err);
        socialParsed = [
          { platform: 'LinkedIn', text: `📊 ${topic}\n\nWhat's your take on this trend? Let's discuss in the comments. #${topic.replace(/\s/g, '')}` },
          { platform: 'Instagram', text: `✨ ${topic} ✨\n\nThe future is here. Double tap if you agree! 💫\n\n#${topic.replace(/\s/g, '')} #Innovation` },
          { platform: 'Twitter/X', text: `${topic} is changing everything. Here's what you need to know. 🧵 #${topic.replace(/\s/g, '')}` }
        ]; 
      }
      
      clearInterval(wInt); 
      setGenerating(false);
      setContent({ blog, social: socialParsed, email });
    } catch (err) {
      console.error("Generation error:", err);
      clearInterval(wInt); 
      setGenerating(false);
      setContent({ 
        blog: `# ${topic}\n\nI apologize, but I'm having trouble generating content right now. Please check your internet connection and try again.\n\nError: ${err.message}\n\nYou can still use this space to write your own content.`, 
        social: [{ platform: 'LinkedIn', text: 'Unable to generate captions. Please try again.' }], 
        email: `[Subject: ${topic}]\n\nUnable to generate newsletter content. Please check your connection and try again.` 
      });
    }
  }

  function approve(key) { setStatus(prev => ({ ...prev, [key]: prev[key] === '' ? 'review' : 'approved' })); }
  function copy(text, key) { navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(''), 1500); }
  const approveLabel = (s) => s === '' ? 'Mark for Review' : s === 'review' ? 'Mark Approved' : 'Published ✓';

  return (
    <div className="view">
      <div className="view-header">
        <div><div className="view-eyebrow">Marketing Tools</div><h1 className="view-title">Content <em>Studio</em></h1></div>
        <button className="btn-primary" onClick={generate} disabled={generating}>Generate →</button>
      </div>
      <div className="studio-layout">
        <div className="brief-panel">
          <div className="panel-label">Your Brief</div>
          <div className="field-group">
            <label className="field-label">Topic</label>
            <input ref={topicRef} className="field-input" type="text" placeholder="e.g. AI in Education for EdTech founders" />
          </div>
          <div className="field-row">
            <div className="field-group">
              <label className="field-label">Audience</label>
              <input ref={audienceRef} className="field-input" type="text" placeholder="EdTech founders" />
            </div>
            <div className="field-group">
              <label className="field-label">Tone</label>
              <select className="field-input">
                <option>Professional</option><option>Authoritative</option>
                <option>Conversational</option><option>Inspirational</option><option>Playful</option>
              </select>
            </div>
          </div>
          <div className="field-group">
            <label className="field-label">Channels</label>
            <div className="channels">
              {['Blog Post', 'LinkedIn', 'Instagram', 'Twitter/X', 'Newsletter'].map(ch => (
                <label key={ch} className="channel-chip"><input type="checkbox" defaultChecked={ch !== 'Twitter/X'} />{ch}</label>
              ))}
            </div>
          </div>
          <div className="field-group">
            <label className="field-label">Blog Length</label>
            <div className="slider-row">
              <input type="range" min={300} max={1500} value={wordCount} step={100} onChange={e => setWordCount(Number(e.target.value))}
                style={{ background: `linear-gradient(to right, var(--gold) ${((wordCount-300)/1200)*100}%, rgba(194,160,114,0.1) ${((wordCount-300)/1200)*100}%)` }} />
              <span className="slider-val">{wordCount}w</span>
            </div>
          </div>
          <div className="field-group">
            <label className="field-label">Notes</label>
            <textarea className="field-textarea" placeholder="Any specific points, examples, or references…" />
          </div>
        </div>
        <div className="output-panel">
          <div className="output-tabs">
            {['blog', 'social', 'email'].map(t => (
              <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                {t === 'blog' ? 'Blog Post' : t === 'social' ? 'Social' : 'Newsletter'}
              </button>
            ))}
          </div>
          <div className="output-area">
            {generating && (
              <div className="gen-overlay">
                <div className="gen-word">{genWord}</div>
                <p className="gen-label">crafting your content…</p>
                <div className="gen-steps">{genSteps.map((s, i) => <div key={i}>{s}</div>)}</div>
              </div>
            )}
            {tab === 'blog' && !generating && (!content ? (
              <div className="output-placeholder"><div className="ph-big">Blog</div><p>Your blog post appears here after generation</p></div>
            ) : (<><div className="output-body">{content.blog}</div><div className="output-actions">
              <button className="btn-ghost" onClick={() => copy(content.blog, 'blog')}>{copied === 'blog' ? 'Copied!' : 'Copy'}</button>
              <button className="btn-ghost" onClick={() => approve('blog')} disabled={status.blog === 'approved'}>{approveLabel(status.blog)}</button>
              {status.blog && <span className={`status-badge ${status.blog}`}>{status.blog === 'review' ? 'In Review' : 'Approved'}</span>}
            </div></>))}
            {tab === 'social' && !generating && (!content ? (
              <div className="output-placeholder"><div className="ph-big">Social</div><p>Social captions appear here</p></div>
            ) : (<><div className="social-cards">{content.social.map((p, i) => (
              <div key={i} className="social-card"><div className="sc-platform">{p.platform}</div><div className="sc-text">{p.text}</div></div>
            ))}</div><div className="output-actions">
              <button className="btn-ghost" onClick={() => copy(content.social.map(p => `${p.platform}:\n${p.text}`).join('\n\n'), 'social')}>{copied === 'social' ? 'Copied!' : 'Copy All'}</button>
              <button className="btn-ghost" onClick={() => approve('social')} disabled={status.social === 'approved'}>{approveLabel(status.social)}</button>
              {status.social && <span className={`status-badge ${status.social}`}>{status.social === 'review' ? 'In Review' : 'Approved'}</span>}
            </div></>))}
            {tab === 'email' && !generating && (!content ? (
              <div className="output-placeholder"><div className="ph-big">Email</div><p>Your newsletter snippet appears here</p></div>
            ) : (<><div className="output-body">{content.email}</div><div className="output-actions">
              <button className="btn-ghost" onClick={() => copy(content.email, 'email')}>{copied === 'email' ? 'Copied!' : 'Copy'}</button>
              <button className="btn-ghost" onClick={() => approve('email')} disabled={status.email === 'approved'}>{approveLabel(status.email)}</button>
              {status.email && <span className={`status-badge ${status.email}`}>{status.email === 'review' ? 'In Review' : 'Approved'}</span>}
            </div></>))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── IMAGE STUDIO VIEW ───
const IMAGE_STYLES = ['Abstract', 'Minimalist', 'Gradient', 'Geometric', 'Dark Luxury', 'Neon Glow', 'Watercolor', 'Typographic'];
const PLATFORMS_IMG = [
  { id: 'instagram', label: 'Instagram', w: 800, h: 800, ratio: '1:1' },
  { id: 'linkedin', label: 'LinkedIn', w: 800, h: 418, ratio: '16:9' },
  { id: 'story', label: 'Story', w: 450, h: 800, ratio: '9:16' },
  { id: 'twitter', label: 'Twitter', w: 800, h: 600, ratio: '4:3' },
];

// ── Seeded pseudo-random so same topic → same image ──
function seededRand(seed) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}
function strToSeed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return Math.abs(h) || 1;
}

// ── Palettes per style ──
const PALETTES = {
  'Gradient':    { bg: ['#071525','#0e2340'], acc: ['#c2a072','#3ecfb0','#d6bb80'], dark: true },
  'Neon Glow':   { bg: ['#06030f','#120824'], acc: ['#e040fb','#00e5ff','#ff6b6b'], dark: true },
  'Minimalist':  { bg: ['#f5f0eb','#ede5d8'], acc: ['#1a1a2e','#c2a072','#3a3a5c'], dark: false },
  'Geometric':   { bg: ['#0f1923','#1e2f42'], acc: ['#e67e22','#f39c12','#e74c3c'], dark: true },
  'Dark Luxury': { bg: ['#080808','#141414'], acc: ['#d4af37','#c0a882','#a08348'], dark: true },
  'Abstract':    { bg: ['#0a0616','#160a28'], acc: ['#9b59b6','#3498db','#e91e63'], dark: true },
  'Watercolor':  { bg: ['#fef6ee','#f5e6d3'], acc: ['#c78b6e','#8fc4b7','#e8a87c'], dark: false },
  'Typographic': { bg: ['#08080f','#12121e'], acc: ['#e94560','#16213e','#f5f5f5'], dark: true },
};

// ── Canvas art engine ──
function drawArt(canvas, style, topicStr, platformId) {
  const plat = PLATFORMS_IMG.find(p => p.id === platformId);
  canvas.width = plat.w; canvas.height = plat.h;
  const W = canvas.width, H = canvas.height;
  const ctx = canvas.getContext('2d');
  const pal = PALETTES[style] || PALETTES['Gradient'];
  const rng = seededRand(strToSeed(topicStr + style + platformId));

  // ── BG gradient ──
  const bg = ctx.createLinearGradient(0, 0, W * 0.7, H);
  bg.addColorStop(0, pal.bg[0]); bg.addColorStop(1, pal.bg[1]);
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  const hex2rgba = (hex, a) => {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return `rgba(${r},${g},${b},${a})`;
  };

  if (style === 'Gradient') {
    // Mesh gradient blobs
    for (let i = 0; i < 5; i++) {
      const x = rng() * W, y = rng() * H, r = 150 + rng() * 280;
      const col = pal.acc[i % pal.acc.length];
      const gr = ctx.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, hex2rgba(col, 0.28 + rng() * 0.18));
      gr.addColorStop(1, hex2rgba(col, 0));
      ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.fill();
    }
    // Thin lines
    ctx.lineWidth = 0.6;
    for (let i = 0; i < 12; i++) {
      const x1=rng()*W, y1=rng()*H, x2=rng()*W, y2=rng()*H;
      ctx.strokeStyle = hex2rgba(pal.acc[i%pal.acc.length], 0.15);
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
    }
    // Rings
    for (let i = 0; i < 4; i++) {
      const x=W*0.3+rng()*W*0.4, y=H*0.3+rng()*H*0.4, r=60+rng()*180;
      ctx.strokeStyle = hex2rgba(pal.acc[i%pal.acc.length], 0.2);
      ctx.lineWidth = 0.8; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.stroke();
    }
  }

  else if (style === 'Neon Glow') {
    // Dark bg + electric glow orbs
    for (let i = 0; i < 4; i++) {
      const x=rng()*W, y=rng()*H, r=80+rng()*200, col=pal.acc[i%pal.acc.length];
      const gr=ctx.createRadialGradient(x,y,0,x,y,r);
      gr.addColorStop(0, hex2rgba(col, 0.5)); gr.addColorStop(0.4, hex2rgba(col, 0.2)); gr.addColorStop(1, hex2rgba(col, 0));
      ctx.fillStyle=gr; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
    }
    // Grid
    ctx.lineWidth=0.4;
    for (let x=0; x<=W; x+=W/16) {
      ctx.strokeStyle=hex2rgba(pal.acc[0],0.08); ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke();
    }
    for (let y=0; y<=H; y+=H/16) {
      ctx.strokeStyle=hex2rgba(pal.acc[1],0.08); ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke();
    }
    // Bright scanline
    ctx.lineWidth=1.5;
    for (let i=0; i<3; i++) {
      const y=rng()*H; ctx.strokeStyle=hex2rgba(pal.acc[i],0.35);
      ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke();
    }
  }

  else if (style === 'Minimalist') {
    // Light bg, single off-center circle + minimal lines
    ctx.strokeStyle = hex2rgba(pal.acc[0], 0.12);
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      const y = (i / 8) * H;
      ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke();
    }
    const cx=W*0.6, cy=H*0.4, cr=Math.min(W,H)*0.28;
    const gr=ctx.createRadialGradient(cx,cy,0,cx,cy,cr);
    gr.addColorStop(0, hex2rgba(pal.acc[1], 0.18)); gr.addColorStop(1, hex2rgba(pal.acc[1], 0));
    ctx.fillStyle=gr; ctx.beginPath(); ctx.arc(cx,cy,cr,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle=hex2rgba(pal.acc[0],0.2); ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.arc(cx,cy,cr*0.6,0,Math.PI*2); ctx.stroke();
    // Corner accent
    ctx.fillStyle=pal.acc[0]; ctx.fillRect(32, H-6, W*0.18, 2);
  }

  else if (style === 'Geometric') {
    // Triangles + hexagons
    const drawTri = (x,y,s,col,a) => {
      ctx.fillStyle=hex2rgba(col,a); ctx.beginPath();
      ctx.moveTo(x,y-s); ctx.lineTo(x+s*0.866,y+s*0.5); ctx.lineTo(x-s*0.866,y+s*0.5); ctx.closePath(); ctx.fill();
    };
    for (let i=0; i<14; i++) {
      drawTri(rng()*W, rng()*H, 30+rng()*120, pal.acc[i%pal.acc.length], 0.08+rng()*0.18);
    }
    // Outline tris
    ctx.lineWidth=1;
    for (let i=0; i<8; i++) {
      const x=rng()*W, y=rng()*H, s=40+rng()*90;
      ctx.strokeStyle=hex2rgba(pal.acc[i%pal.acc.length],0.25);
      ctx.beginPath(); ctx.moveTo(x,y-s); ctx.lineTo(x+s*0.866,y+s*0.5); ctx.lineTo(x-s*0.866,y+s*0.5); ctx.closePath(); ctx.stroke();
    }
    // Big diagonal slash
    ctx.strokeStyle=hex2rgba(pal.acc[0],0.18); ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(0,H); ctx.lineTo(W,0); ctx.stroke();
  }

  else if (style === 'Dark Luxury') {
    // Subtle gold noise + concentric arcs
    for (let i=6; i>=1; i--) {
      const r=i*(Math.min(W,H)/7);
      const gr=ctx.createRadialGradient(W/2,H/2,r*0.5,W/2,H/2,r);
      gr.addColorStop(0,hex2rgba(pal.acc[0],0)); gr.addColorStop(1,hex2rgba(pal.acc[0],0.04));
      ctx.fillStyle=gr; ctx.beginPath(); ctx.arc(W/2,H/2,r,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle=hex2rgba(pal.acc[0],0.08+i*0.015); ctx.lineWidth=0.6;
      ctx.beginPath(); ctx.arc(W/2,H/2,r,0,Math.PI*2); ctx.stroke();
    }
    // Gold diagonal lines
    ctx.lineWidth=0.5;
    for (let i=-H; i<W+H; i+=24) {
      ctx.strokeStyle=hex2rgba(pal.acc[0],0.06);
      ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i+H,H); ctx.stroke();
    }
    // Center cross
    ctx.strokeStyle=hex2rgba(pal.acc[0],0.15); ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(W/2,H*0.2); ctx.lineTo(W/2,H*0.8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W*0.2,H/2); ctx.lineTo(W*0.8,H/2); ctx.stroke();
    // Corner marks
    [[0,0],[W,0],[0,H],[W,H]].forEach(([cx,cy]) => {
      const dx=cx===0?1:-1, dy=cy===0?1:-1;
      ctx.strokeStyle=hex2rgba(pal.acc[0],0.3); ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(cx+dx*16,cy); ctx.lineTo(cx+dx*36,cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx,cy+dy*16); ctx.lineTo(cx,cy+dy*36); ctx.stroke();
    });
  }

  else if (style === 'Abstract') {
    // Organic blobs
    const blob = (x,y,r,col,a) => {
      const gr=ctx.createRadialGradient(x,y,0,x,y,r);
      gr.addColorStop(0,hex2rgba(col,a)); gr.addColorStop(1,hex2rgba(col,0));
      ctx.fillStyle=gr; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
    };
    for (let i=0;i<7;i++) blob(rng()*W, rng()*H, 80+rng()*200, pal.acc[i%pal.acc.length], 0.22+rng()*0.2);
    // Wavy curves
    ctx.lineWidth=1.2;
    for (let i=0;i<5;i++) {
      const y0=rng()*H;
      ctx.strokeStyle=hex2rgba(pal.acc[i%pal.acc.length],0.2);
      ctx.beginPath(); ctx.moveTo(0,y0);
      for (let x=0;x<W;x+=20) ctx.quadraticCurveTo(x+10, y0+(rng()-0.5)*80, x+20, y0+(rng()-0.5)*60);
      ctx.stroke();
    }
  }

  else if (style === 'Watercolor') {
    // Soft wash layers
    for (let i=0;i<6;i++) {
      const x=rng()*W, y=rng()*H, rx=100+rng()*180, ry=80+rng()*160;
      const col=pal.acc[i%pal.acc.length];
      const gr=ctx.createRadialGradient(x,y,0,x,y,Math.max(rx,ry));
      gr.addColorStop(0,hex2rgba(col,0.22+rng()*0.15)); gr.addColorStop(0.6,hex2rgba(col,0.08)); gr.addColorStop(1,hex2rgba(col,0));
      ctx.fillStyle=gr;
      ctx.save(); ctx.translate(x,y); ctx.scale(rx/Math.max(rx,ry),ry/Math.max(rx,ry)); ctx.beginPath(); ctx.arc(0,0,Math.max(rx,ry),0,Math.PI*2); ctx.restore(); ctx.fill();
    }
    // Paper texture dots
    for (let i=0;i<400;i++) {
      ctx.fillStyle=`rgba(180,140,100,${rng()*0.03})`;
      ctx.fillRect(rng()*W, rng()*H, 1, 1);
    }
    // Ink strokes
    ctx.lineWidth=1.5;
    for (let i=0;i<4;i++) {
      const x=rng()*W, y=rng()*H;
      ctx.strokeStyle=hex2rgba(pal.acc[0],0.25); ctx.beginPath();
      ctx.moveTo(x,y); ctx.bezierCurveTo(x+rng()*60,y-40, x+60+rng()*60,y+40, x+120,y); ctx.stroke();
    }
  }

  else if (style === 'Typographic') {
    // High-contrast dark + bold accent slashes
    ctx.fillStyle=hex2rgba(pal.acc[0],0.06); ctx.fillRect(0,0,W,H*0.45);
    // Big diagonal block
    ctx.fillStyle=hex2rgba(pal.acc[0],0.1);
    ctx.beginPath(); ctx.moveTo(0,H*0.3); ctx.lineTo(W,0); ctx.lineTo(W,H*0.25); ctx.lineTo(0,H*0.55); ctx.closePath(); ctx.fill();
    // Ruled lines
    ctx.lineWidth=0.5;
    for (let i=0;i<20;i++) {
      const y=H*0.6+i*18; ctx.strokeStyle=hex2rgba(pal.acc[2],0.06);
      ctx.beginPath(); ctx.moveTo(32,y); ctx.lineTo(W-32,y); ctx.stroke();
    }
    // Accent bar
    ctx.fillStyle=pal.acc[0]; ctx.fillRect(32,H*0.55,W*0.2,3);
    // Dot grid
    for (let x=48;x<W;x+=36) for (let y=48;y<H*0.5;y+=36) {
      ctx.fillStyle=hex2rgba(pal.acc[2],0.12);
      ctx.beginPath(); ctx.arc(x,y,1.2,0,Math.PI*2); ctx.fill();
    }
  }

  // ── Topic text overlay (always) ──
  const words = topicStr.trim().split(/\s+/);
  const displayWord = words[0].toUpperCase();
  ctx.save();
  const fontSize = Math.min(W, H) * 0.22;
  ctx.font = `300 ${fontSize}px 'Cormorant Garamond', serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = pal.dark ? 'rgba(240,232,216,0.04)' : 'rgba(10,13,21,0.05)';
  ctx.fillText(displayWord, W/2, H/2);
  ctx.restore();

  // ── Vignette ──
  const vig=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*0.3,W/2,H/2,Math.max(W,H)*0.75);
  vig.addColorStop(0,'rgba(0,0,0,0)'); vig.addColorStop(1,'rgba(0,0,0,0.45)');
  ctx.fillStyle=vig; ctx.fillRect(0,0,W,H);
}

// ── HF token from Vite env (set in .env.local) ──
const HF_TOKEN = import.meta.env.VITE_HF_TOKEN;

async function generateHFImage(prompt) {
  if (!HF_TOKEN) throw new Error('Missing VITE_HF_TOKEN in .env.local');

  const response = await fetch(
    'https://router.huggingface.co/together/v1/images/generations',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'black-forest-labs/FLUX.1-schnell',
        prompt,
        n: 1,
        width: 1024,
        height: 1024,
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text().catch(() => response.statusText);
    throw new Error(`HF image API error ${response.status}: ${errText}`);
  }

  const json = await response.json();
  const imageUrl = json?.data?.[0]?.url;
  if (!imageUrl) throw new Error('No image URL in response: ' + JSON.stringify(json));
  return imageUrl;
}

function ImageStudioView() {
  const [topic, setTopic] = useState('');
  const [mood, setMood] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('Gradient');
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [captionPlatform, setCaptionPlatform] = useState('instagram');
  const [generating, setGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [genStatus, setGenStatus] = useState('');
  const [genWord, setGenWord] = useState('');
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [imgError, setImgError] = useState(null);

  const platform = PLATFORMS_IMG.find(p => p.id === selectedPlatform);

  async function generatePost() {
    if (!topic.trim()) return;
    setGenerating(true); setGenProgress(0); setResult(null);
    setImageUrl(null); setImgError(null);
    const words = ['Imagining', 'Painting', 'Rendering', 'Composing', 'Illuminating'];
    let wi = 0;
    const wInt = setInterval(() => { setGenWord(words[wi % words.length]); wi++; }, 800);

    try {
      // Build a rich prompt combining topic, mood and style
      setGenStatus('Sending to Stable Diffusion…'); setGenProgress(10);
      const imagePrompt = `${topic}${
        mood ? `, ${mood} mood` : ''
      }, ${selectedStyle} visual style, high quality, detailed, 4k, professional social media post`;

      // Run image generation + captions in parallel
      setGenProgress(20); setGenStatus('Generating image & captions…');
      const [url, captionRaw] = await Promise.all([
        generateHFImage(imagePrompt),
        callLLM(
          'You are an expert social media copywriter. Respond ONLY with valid JSON. No markdown, no code fences, no extra text before or after.',
          `Write engaging post captions for the topic: "${topic}". Mood/vibe: "${mood || 'professional and inspiring'}". Visual style: ${selectedStyle}.

Return this exact JSON structure:
{"instagram":"...caption with emojis and 4-6 hashtags...","linkedin":"...professional 2-3 line hook + insight...","twitter":"...punchy under 260 chars with 2-3 hashtags...","story":"...ultra-short bold 1-liner..."}`
        ),
      ]);

      setGenProgress(85); setGenStatus('Processing results…');

      let captions;
      try {
        const clean = captionRaw.replace(/```[\w]*\n?|```/g, '').trim();
        const jsonMatch = clean.match(/\{[\s\S]*\}/);
        const validJson = jsonMatch ? jsonMatch[0] : clean;
        captions = JSON.parse(validJson);
      } catch (err) {
        console.error('Failed to parse captions JSON:', err);
        captions = {
          instagram: `✨ ${topic}\n\nThe future is here. Are you ready?\n\n#${topic.split(' ')[0]} #ContentMarketing #Digital #Growth #Innovation`,
          linkedin: `The conversation around ${topic} is evolving rapidly.\n\nHere's what forward-thinking teams are doing differently — and why it matters for your strategy.`,
          twitter: `${topic} is reshaping how we think about content. Here's the thread you need. 🧵 #${topic.split(' ')[0]} #Marketing`,
          story: `${topic.toUpperCase()}\nThe shift is happening now.`,
        };
      }

      setGenProgress(100); setGenStatus('Done!');
      await new Promise(r => setTimeout(r, 200));
      clearInterval(wInt);
      setGenerating(false);
      setImageUrl(url);
      setResult({ captions });

    } catch (err) {
      console.error('Generation error:', err);
      clearInterval(wInt);
      setGenerating(false);
      setImgError(err.message);
      // Still provide fallback captions so the UI stays usable
      setResult({
        captions: {
          instagram: `✨ ${topic}\n\nThe future is here.\n\n#ContentMarketing #Digital #Growth`,
          linkedin: `Sharing thoughts on ${topic}. What's your take?`,
          twitter: `${topic} — the conversation that matters. #Marketing`,
          story: `${topic.toUpperCase()}\nStart now.`,
        }
      });
    }
  }

  function copyCaption(text) {
    navigator.clipboard.writeText(text);
    setCopied(captionPlatform);
    setTimeout(() => setCopied(''), 1500);
  }

  async function downloadImage() {
    if (!imageUrl) return;
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const localUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = localUrl;
      a.download = `post-${topic.replace(/\s+/g, '-')}-${selectedPlatform}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(localUrl), 5000);
    } catch {
      window.open(imageUrl, '_blank');
    }
  }

  const currentCaption = result?.captions?.[captionPlatform] || '';

  return (
    <div className="view">
      <div className="view-header">
        <div><div className="view-eyebrow">Visual Content</div><h1 className="view-title">Image <em>Studio</em></h1></div>
        <button className="btn-teal" onClick={generatePost} disabled={generating || !topic.trim()}>
          {generating ? 'Generating…' : '✦ Generate Post →'}
        </button>
      </div>

      <div className="img-studio-layout">
        {/* LEFT: Config Panel */}
        <div className="img-config-panel">
          <div className="panel-label">Post Configuration</div>

          <div className="field-group">
            <label className="field-label">Post Topic / Theme</label>
            <input className="field-input" type="text" value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. Future of AI in 2025" />
          </div>

          <div className="field-group">
            <label className="field-label">Mood / Vibe</label>
            <input className="field-input" type="text" value={mood}
              onChange={e => setMood(e.target.value)}
              placeholder="e.g. inspiring, bold, calm, futuristic" />
          </div>

          <div className="field-group">
            <label className="field-label">Visual Style</label>
            <div className="style-chips">
              {IMAGE_STYLES.map(s => (
                <button key={s} className={`style-chip ${selectedStyle === s ? 'selected' : ''}`}
                  onClick={() => setSelectedStyle(s)}>{s}</button>
              ))}
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Platform Format</label>
            <div className="aspect-chips">
              {PLATFORMS_IMG.map(p => (
                <button key={p.id} className={`aspect-chip ${selectedPlatform === p.id ? 'selected' : ''}`}
                  onClick={() => { setSelectedPlatform(p.id); setCaptionPlatform(p.id); }}>
                  <div className="aspect-chip-preview" style={{
                    width: p.id === 'story' ? '12px' : p.id === 'linkedin' ? '22px' : p.id === 'twitter' ? '18px' : '16px',
                    height: p.id === 'story' ? '20px' : p.id === 'linkedin' ? '12px' : p.id === 'twitter' ? '14px' : '16px',
                  }} />
                  <span>{p.label}</span>
                  <span style={{ opacity: 0.5, fontSize: '0.4rem' }}>{p.ratio}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="field-group" style={{ borderBottom: 'none' }}>
            <label className="field-label">Additional Context</label>
            <textarea className="field-textarea" style={{ minHeight: '60px' }}
              placeholder="Brand colors, key message, call-to-action…" />
          </div>
        </div>

        {/* RIGHT: Output Panel */}
        <div className="img-output-panel">
          {/* Image Preview */}
          <div className="img-preview-area" style={{ minHeight: 320, background: '#060910' }}>
            {generating && (
              <div className="img-gen-overlay">
                <div className="img-gen-word">{genWord}</div>
                <p className="img-gen-status">{genStatus}</p>
                <div className="img-gen-progress">
                  <div className="img-gen-bar" style={{ width: `${genProgress}%` }} />
                </div>
              </div>
            )}

            {!generating && !result && !imgError && (
              <div className="img-placeholder">
                <div className="img-ph-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="M21 15l-5-5L5 21"/>
                  </svg>
                </div>
                <span>Visual Post Studio</span>
                <p>Configure your post and click Generate<br/>to create an AI-generated image via Stable Diffusion</p>
              </div>
            )}

            {/* Error state */}
            {!generating && imgError && (
              <div className="img-placeholder">
                <div className="img-ph-icon" style={{ borderColor: 'rgba(232,123,108,0.4)' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </div>
                <span style={{ color: 'var(--rose)', fontSize: '0.72rem' }}>Image generation failed</span>
                <p style={{ fontSize: '0.64rem', color: 'var(--text-muted)', maxWidth: 260 }}>{imgError}</p>
                <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Captions were still generated below ↓</p>
              </div>
            )}

            {/* Real HF generated image */}
            {!generating && imageUrl && (
              <div style={{ width: '100%', position: 'relative' }}>
                <img
                  src={imageUrl}
                  alt={topic}
                  style={{
                    width: '100%',
                    display: 'block',
                    maxHeight: 420,
                    objectFit: 'contain',
                  }}
                />
                {result && (
                  <div className="post-preview-overlay">
                    <div className="platform-badge">
                      {PLATFORMS_IMG.find(p => p.id === selectedPlatform)?.label} · {PLATFORMS_IMG.find(p => p.id === selectedPlatform)?.ratio}
                    </div>
                    <div className="post-preview-grad">
                      <div className="post-preview-caption">{currentCaption.split('\n')[0]}</div>
                      <div className="post-preview-tags">{currentCaption.match(/#\w+/g)?.slice(0,4).join(' ') || ''}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Caption Area */}
          <div className="caption-strip">
            <div className="caption-strip-header">
              <span className="caption-strip-title">✦ AI-Generated Captions</span>
              <div className="caption-tabs">
                {PLATFORMS_IMG.map(p => (
                  <button key={p.id}
                    className={`caption-tab ${captionPlatform === p.id ? 'active' : ''}`}
                    onClick={() => setCaptionPlatform(p.id)}>{p.label}</button>
                ))}
              </div>
            </div>

            <div className={`caption-content ${generating ? 'loading-shimmer' : ''}`}>
              {result
                ? currentCaption
                : generating
                  ? ''
                  : <span style={{ color: 'var(--text-muted)', fontSize: '0.76rem' }}>Captions will appear here once generated…</span>}
            </div>

            {result && (
              <div className="caption-actions">
                <button className="btn-sm-teal" onClick={() => copyCaption(currentCaption)}>
                  <icons.Copy /> {copied === captionPlatform ? ' Copied!' : ' Copy Caption'}
                </button>
                {imageUrl && (
                  <button className="btn-sm-teal" onClick={downloadImage}>
                    <icons.Download /> Download PNG
                  </button>
                )}
                <button className="btn-sm-teal" onClick={generatePost}>
                  <icons.Refresh /> Regenerate
                </button>
                <button className="btn-sm-teal" onClick={() => {
                  const all = PLATFORMS_IMG.map(p => `=== ${p.label} ===\n${result.captions[p.id]}`).join('\n\n');
                  navigator.clipboard.writeText(all); setCopied('all'); setTimeout(() => setCopied(''), 1500);
                }}>{copied === 'all' ? '✓ Copied!' : 'Copy All Captions'}</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PIPELINE ───
const INIT_CARDS = [
  { id: 1, type: 'blog', title: 'AI in Education: What EdTech Founders Need to Know', meta: '600w · LinkedIn, Newsletter', time: '2h ago', stage: 'draft' },
  { id: 2, type: 'social', title: '3 captions for "Future of Remote Work"', meta: 'Instagram · Twitter · LinkedIn', time: '5h ago', stage: 'draft' },
  { id: 3, type: 'newsletter', title: 'Monthly digest: Product launches & updates', meta: 'Newsletter · 450w', time: '1d ago', stage: 'draft' },
  { id: 4, type: 'blog', title: 'Scaling Your SaaS: Lessons from 100 Founders', meta: '800w · Blog', time: '1d ago', stage: 'review' },
  { id: 5, type: 'social', title: 'Product Hunt launch announcement pack', meta: 'Twitter · LinkedIn', time: '3d ago', stage: 'review' },
  { id: 6, type: 'newsletter', title: 'Welcome series: Onboarding email #1', meta: 'Newsletter · 380w', time: '4d ago', stage: 'approved' },
  { id: 7, type: 'blog', title: 'The Definitive Guide to Content Marketing in 2025', meta: '1200w · All channels', time: 'Published', stage: 'published' },
];
const STAGES = [
  { id: 'draft', label: 'Draft', next: 'review', nextLabel: '→ Review' },
  { id: 'review', label: 'In Review', next: 'approved', nextLabel: '✓ Approve' },
  { id: 'approved', label: 'Approved', next: 'published', nextLabel: '↑ Publish' },
  { id: 'published', label: 'Published', next: null, nextLabel: '' },
];

function PipelineView({ onPublish }) {
  const [cards, setCards] = useState(INIT_CARDS);
  function moveCard(id, next) {
    setCards(prev => prev.map(c => c.id === id ? { ...c, stage: next } : c));
    if (next === 'published') onPublish();
  }
  return (
    <div className="view">
      <div className="view-header">
        <div><div className="view-eyebrow">Workflow</div><h1 className="view-title">Review <em>Pipeline</em></h1></div>
      </div>
      <div className="kanban">
        {STAGES.map(stage => {
          const sc = cards.filter(c => c.stage === stage.id);
          return (
            <div key={stage.id} className="kanban-col">
              <div className="kanban-header"><span className={`k-dot ${stage.id}`}/>{stage.label}<span className="k-count">{sc.length}</span></div>
              <div className="kanban-cards">
                {sc.map(card => (
                  <div key={card.id} className={`kanban-card ${card.stage === 'published' ? 'published' : ''}`}>
                    <div className={`kc-type ${card.type}`}>{card.type}</div>
                    <p className="kc-title">{card.title}</p>
                    <div className="kc-meta">{card.meta}</div>
                    <div className="kc-footer">
                      <span className="kc-time">{card.time}</span>
                      {stage.next && <button className="kc-btn" onClick={() => moveCard(card.id, stage.next)}>{stage.nextLabel}</button>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── CALENDAR ───
const CAL_DAYS = [
  { day: null }, { day: 1 }, { day: 2, event: { type: 'blog', label: 'Blog post' } },
  { day: 3 }, { day: 4, event: { type: 'social', label: '3× Social' } }, { day: 5 }, { day: 6 },
  { day: 7, event: { type: 'newsletter', label: 'Newsletter' } }, { day: 8 }, { day: 9 },
  { day: 10, event: { type: 'blog', label: 'Blog post' } }, { day: 11 },
  { day: 12, event: { type: 'social', label: '2× Social' } }, { day: 13 },
  { day: 14, today: true }, { day: 15 }, { day: 16, event: { type: 'blog', label: 'Blog post' } },
  { day: 17 }, { day: 18 }, { day: 19, event: { type: 'newsletter', label: 'Newsletter' } }, { day: 20 },
  { day: 21, event: { type: 'social', label: '4× Social' } }, { day: 22 }, { day: 23 },
  { day: 24, event: { type: 'blog', label: 'Blog post' } }, { day: 25 }, { day: 26 }, { day: 27 }, { day: 28 },
  { day: 29, event: { type: 'newsletter', label: 'Newsletter' } }, { day: 30 }, { day: null },
];

function CalendarView() {
  return (
    <div className="view">
      <div className="view-header">
        <div><div className="view-eyebrow">Schedule</div><h1 className="view-title">Content <em>Calendar</em></h1></div>
        <div className="cal-nav"><button className="btn-ghost">← Prev</button><button className="btn-ghost">Next →</button></div>
      </div>
      <div className="calendar-grid">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <div key={d} className="cal-day-name">{d}</div>)}
        {CAL_DAYS.map((d, i) => (
          <div key={i} className={`cal-day ${d.day === null ? 'empty' : ''} ${d.today ? 'today' : ''}`}>
            {d.day}
            {d.event && <div className={`cal-event ${d.event.type}`}>{d.event.label}</div>}
          </div>
        ))}
      </div>
      <div className="cal-legend">
        <span className="cal-leg blog">Blog</span>
        <span className="cal-leg social">Social</span>
        <span className="cal-leg newsletter">Newsletter</span>
      </div>
    </div>
  );
}

// ─── BRAND ───
const TONES = [
  { left: 'Formal', right: 'Casual', default: 60 },
  { left: 'Serious', right: 'Playful', default: 40 },
  { left: 'Concise', right: 'Elaborate', default: 70 },
  { left: 'Traditional', right: 'Innovative', default: 30 },
];

function BrandView() {
  const [tones, setTones] = useState(TONES.map(t => t.default));
  const [useWords, setUseWords] = useState(['empower', 'streamline', 'insight', 'scalable', 'founder']);
  const [avoidWords, setAvoidWords] = useState(['synergy', 'leverage', 'disrupt', 'guru']);
  const [useInput, setUseInput] = useState('');
  const [avoidInput, setAvoidInput] = useState('');
  const [saved, setSaved] = useState(false);

  function addWord(type, val) {
    if (!val.trim()) return;
    if (type === 'use') { setUseWords(w => [...w, val.trim()]); setUseInput(''); }
    else { setAvoidWords(w => [...w, val.trim()]); setAvoidInput(''); }
  }

  return (
    <div className="view">
      <div className="view-header">
        <div><div className="view-eyebrow">Identity</div><h1 className="view-title">Brand <em>Voice</em></h1></div>
        <button className="btn-primary" style={saved ? { opacity: 0.8 } : {}}
          onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}>
          {saved ? 'Saved ✓' : 'Save Guidelines →'}
        </button>
      </div>
      <div className="brand-layout">
        <div className="brand-section">
          <h3 className="brand-section-title">Tone Sliders</h3>
          <div className="tone-sliders">
            {TONES.map((t, i) => (
              <div key={t.left} className="tone-row">
                <span className="tone-label-l">{t.left}</span>
                <input type="range" min={0} max={100} value={tones[i]} step={1}
                  style={{ background: `linear-gradient(to right, var(--gold) ${tones[i]}%, rgba(194,160,114,0.1) ${tones[i]}%)` }}
                  onChange={e => setTones(prev => prev.map((v, j) => j === i ? Number(e.target.value) : v))} />
                <span className="tone-label-r">{t.right}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="brand-section">
          <h3 className="brand-section-title">Vocabulary</h3>
          <div className="vocab-cols">
            <div>
              <div className="vocab-header">✓ Use these words</div>
              <div className="vocab-tags">{useWords.map(w => <span key={w} className="vocab-tag use" onClick={() => setUseWords(p => p.filter(x => x !== w))}>{w}</span>)}</div>
              <input className="vocab-input" type="text" placeholder="Add word + Enter" value={useInput} onChange={e => setUseInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addWord('use', useInput)} />
            </div>
            <div>
              <div className="vocab-header avoid">✗ Avoid these words</div>
              <div className="vocab-tags">{avoidWords.map(w => <span key={w} className="vocab-tag avoid" onClick={() => setAvoidWords(p => p.filter(x => x !== w))}>{w}</span>)}</div>
              <input className="vocab-input" type="text" placeholder="Add word + Enter" value={avoidInput} onChange={e => setAvoidInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addWord('avoid', avoidInput)} />
            </div>
          </div>
        </div>
        <div className="brand-section">
          <h3 className="brand-section-title">Style Guidelines</h3>
          <textarea className="field-textarea" style={{ height: '110px', background: 'rgba(0,0,0,0.28)', border: '1px solid var(--border)', color: 'var(--cream-dim)' }}
            placeholder="e.g. Always use Oxford commas. Avoid passive voice. Address the reader as 'you'…" />
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ───
export default function App() {
  const [activeView, setActiveView] = useState('studio');
  const [publishedCount, setPublishedCount] = useState(47);
  const [draftCount, setDraftCount] = useState(3);

  const navItems = [
    { id: 'studio', label: 'Studio', num: '01', icon: <icons.Studio /> },
    { id: 'image', label: 'Image Studio', num: '02', icon: <icons.Image />, teal: true },
    { id: 'pipeline', label: 'Pipeline', num: '03', icon: <icons.Pipeline /> },
    { id: 'calendar', label: 'Calendar', num: '04', icon: <icons.Calendar /> },
    { id: 'brand', label: 'Brand Voice', num: '05', icon: <icons.Brand /> },
  ];

  return (
    <div className="cs-app">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-eyebrow">// Content Studio</span>
          <div className="brand-name">Content<em>AI</em></div>
          <div className="brand-rule" />
        </div>
        <nav className="nav">
          <div className="nav-section-label">— Tools</div>
          {navItems.map(item => (
            <button key={item.id}
              className={`nav-item ${activeView === item.id ? (item.teal ? 'active-teal' : 'active') : ''}`}
              onClick={() => setActiveView(item.id)}>
              {item.icon}{item.label}<span className="nav-num">{item.num}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="stats-row">
            <div className="stat-item"><span className="stat-num">{draftCount}</span><span className="stat-label">Drafts</span></div>
            <div className="stat-item"><span className="stat-num">{publishedCount}</span><span className="stat-label">Live</span></div>
          </div>
        </div>
      </aside>
      <main className="main">
        {activeView === 'studio' && <StudioView />}
        {activeView === 'image' && <ImageStudioView />}
        {activeView === 'pipeline' && <PipelineView onPublish={() => { setPublishedCount(c => c + 1); setDraftCount(c => Math.max(0, c - 1)); }} />}
        {activeView === 'calendar' && <CalendarView />}
        {activeView === 'brand' && <BrandView />}
      </main>
    </div>
  );
}