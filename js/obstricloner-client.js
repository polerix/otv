/**
 * obstricloner-client.js — OTV ↔ OBSTriCloner bridge (OTV side)
 *
 * Drop this into OTV's index.html AFTER app.js and schedule.js:
 *
 *   <script>window.OTC_HOST = 'http://localhost:9090';</script>
 *   <script src="js/obstricloner-client.js"></script>
 *
 * What this does:
 *   OTV → OBSTriCloner:
 *     - Cassette becomes active/playing → POST /api/arps/event {type:'cassette-play'}
 *     - Cassette becomes cued           → POST /api/arps/event {type:'cassette-cued'}
 *     - Schedule slot goes live         → POST /api/arps/event {type:'slot-live'}
 *     - Cassette stops                  → POST /api/arps/event {type:'cassette-stop'}
 *
 *   OBSTriCloner → OTV  (SSE stream at /api/arps/stream):
 *     - obs:program     → updates on-air badge in OTV UI
 *     - obs:preview     → shows preview scene name
 *     - playlist:item   → highlights matching cassette as active
 *     - playlist:state  → syncs running/stopped status
 *
 * Manual control via browser console:
 *   OTCBridge.postEvent({ type: 'cassette-play', id: 0, label: 'Die Hard' })
 *   OTCBridge.sync()   // push current OTV schedule to OBSTriCloner playlist
 */

/* global cassettes, scheduleState */
(function () {
  'use strict';

  const BASE     = ((window.OTC_HOST || 'http://localhost:9090')).replace(/\/$/, '');
  const POLL_MS  = 1500;   // how often to check local OTV state for changes
  const RECONNECT_MS = 5000;

  let _lastActiveCassetteId = null;
  let _lastCuedCassetteId   = null;
  let _lastLiveSlotId       = null;
  let _eventSource          = null;
  let _connected            = false;

  // ── HTTP helper ────────────────────────────────────────────────────────────

  async function postEvent(event) {
    try {
      const res = await fetch(`${BASE}/api/arps/event`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(event),
      });
      if (!res.ok) console.warn('[OTC] Event rejected:', res.status, event.type);
      return await res.json();
    } catch (err) {
      // OBSTriCloner not running — fail silently
      return null;
    }
  }

  async function fetchState() {
    try {
      const res = await fetch(`${BASE}/api/arps/state`);
      return await res.json();
    } catch (_) { return null; }
  }

  // ── Sync full OTV schedule → OBSTriCloner playlist ────────────────────────

  async function sync() {
    // Build a playlist from OTV cassettes (app.js global)
    const items = [];
    if (typeof cassettes !== 'undefined' && Array.isArray(cassettes)) {
      cassettes.forEach((c, idx) => {
        items.push({
          id:         String(c.id !== undefined ? c.id : idx),
          label:      c.label || `Cassette ${idx}`,
          sceneName:  c.sceneName || c.label || '',   // OTV can set sceneName if known
          durationMs: parseDuration(c.duration),
          startAt:    c.scheduledTime && c.scheduledTime !== 'Live'
                        ? resolveScheduledTime(c.scheduledTime)
                        : null,
        });
      });
    }
    if (items.length > 0) {
      const result = await postEvent({ type: 'playlist-sync', items });
      console.log('[OTC] Schedule synced →', result);
    }
    return items;
  }

  // ── SSE: receive state from OBSTriCloner ───────────────────────────────────

  function connectSSE() {
    if (_eventSource) { _eventSource.close(); _eventSource = null; }
    try {
      _eventSource = new EventSource(`${BASE}/api/arps/stream`);

      _eventSource.onopen = () => {
        _connected = true;
        console.log('[OTC] SSE connected to OBSTriCloner');
        updateConnectionBadge(true);
      };

      _eventSource.onmessage = (e) => {
        try { handleSSEMessage(JSON.parse(e.data)); } catch (_) {}
      };

      _eventSource.onerror = () => {
        _connected = false;
        updateConnectionBadge(false);
        _eventSource.close();
        _eventSource = null;
        setTimeout(connectSSE, RECONNECT_MS);
      };
    } catch (err) {
      console.warn('[OTC] SSE init error:', err.message);
      setTimeout(connectSSE, RECONNECT_MS);
    }
  }

  function handleSSEMessage(msg) {
    const { type } = msg;

    if (type === 'init' || type === 'obs:program') {
      const program = msg.obs && msg.obs.program;
      updateOnAirBadge(program);
      highlightActiveCassette(program);
    }

    if (type === 'playlist:item' && msg.item) {
      highlightActiveCassette(msg.item.label || msg.item.sceneName);
    }

    if (type === 'obs:transition') {
      flashTransitionIndicator();
    }
  }

  // ── Watch OTV state for changes (poll loop) ────────────────────────────────

  function watchCassettes() {
    if (typeof cassettes === 'undefined' || !Array.isArray(cassettes)) return;

    const active = cassettes.find(c => c.status === 'active' || c.status === 'playing');
    if (active && String(active.id) !== _lastActiveCassetteId) {
      _lastActiveCassetteId = String(active.id);
      postEvent({ type: 'cassette-play', id: active.id, label: active.label });
    }

    const cued = cassettes.find(c => c.status === 'cued');
    if (cued && String(cued.id) !== _lastCuedCassetteId) {
      _lastCuedCassetteId = String(cued.id);
      postEvent({ type: 'cassette-cued', id: cued.id, label: cued.label });
    }

    // If nothing active and we had one before, send stop
    if (!active && _lastActiveCassetteId !== null) {
      _lastActiveCassetteId = null;
      postEvent({ type: 'cassette-stop' });
    }
  }

  function watchSchedule() {
    // schedule.js exposes scheduleState globally (if present)
    if (typeof scheduleState === 'undefined') return;
    const days = scheduleState.days;
    if (!Array.isArray(days)) return;
    const today = days[scheduleState.todayIndex || 0];
    if (!today || !Array.isArray(today.slots)) return;

    const live = today.slots.find(s => s.status === 'live');
    if (live && live.id !== _lastLiveSlotId) {
      _lastLiveSlotId = live.id;
      postEvent({ type: 'slot-live', label: live.label, scheduledTime: live.time, duration: live.duration });
    }
  }

  // ── OTV UI updates ─────────────────────────────────────────────────────────

  function updateOnAirBadge(program) {
    let badge = document.getElementById('otc-onair-badge');
    if (!badge) {
      badge = document.createElement('div');
      badge.id = 'otc-onair-badge';
      Object.assign(badge.style, {
        position: 'fixed', top: '8px', right: '8px', zIndex: '9999',
        fontFamily: 'monospace', fontSize: '11px', letterSpacing: '1px',
        padding: '4px 10px', borderRadius: '2px', cursor: 'default',
        boxShadow: '0 0 8px rgba(200,0,0,0.6)', transition: 'background 0.3s',
      });
      document.body.appendChild(badge);
    }
    badge.textContent = program ? `ON AIR: ${program}` : 'OBS: —';
    badge.style.background = program ? '#c00' : '#333';
    badge.style.color = '#fff';
  }

  function updateConnectionBadge(connected) {
    let dot = document.getElementById('otc-conn-dot');
    if (!dot) {
      dot = document.createElement('div');
      dot.id = 'otc-conn-dot';
      Object.assign(dot.style, {
        position: 'fixed', top: '8px', right: '130px', zIndex: '9999',
        width: '8px', height: '8px', borderRadius: '50%',
        title: 'OBSTriCloner connection',
      });
      document.body.appendChild(dot);
    }
    dot.style.background    = connected ? '#0f0' : '#666';
    dot.style.boxShadow     = connected ? '0 0 6px #0f0' : 'none';
    dot.title = connected ? 'OBSTriCloner connected' : 'OBSTriCloner offline';
  }

  function highlightActiveCassette(label) {
    if (!label || typeof cassettes === 'undefined') return;
    const lower = label.toLowerCase();
    // Find cassette element and flash it
    document.querySelectorAll('[data-cassette-label]').forEach(el => {
      const elLabel = (el.dataset.cassetteLabel || '').toLowerCase();
      if (elLabel.includes(lower) || lower.includes(elLabel)) {
        el.style.outline = '2px solid #c00';
        setTimeout(() => { el.style.outline = ''; }, 2000);
      }
    });
  }

  function flashTransitionIndicator() {
    updateOnAirBadge('TRANSITION…');
    setTimeout(() => {
      // Re-fetch and restore
      fetchState().then(s => {
        if (s && s.obs) updateOnAirBadge(s.obs.program);
      });
    }, 800);
  }

  // ── Utilities ──────────────────────────────────────────────────────────────

  /** Parse OTV duration string "HH:MM:SS" → milliseconds. */
  function parseDuration(str) {
    if (!str) return 0;
    const parts = str.split(':').map(Number);
    if (parts.length === 3) return (parts[0] * 3600 + parts[1] * 60 + parts[2]) * 1000;
    if (parts.length === 2) return (parts[0] * 60 + parts[1]) * 1000;
    return 0;
  }

  /** Convert OTV "HH:MM" scheduledTime to today's ISO timestamp. */
  function resolveScheduledTime(time) {
    if (!time || time === 'Live') return null;
    const [h, m] = time.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    // If the time is in the past, assume tomorrow
    if (d.getTime() < Date.now()) d.setDate(d.getDate() + 1);
    return d.toISOString();
  }

  // ── Init ───────────────────────────────────────────────────────────────────

  function init() {
    connectSSE();
    setInterval(() => {
      watchCassettes();
      watchSchedule();
    }, POLL_MS);
    console.log(`[OTC] OBSTriCloner bridge active → ${BASE}`);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API
  window.OTCBridge = { postEvent, fetchState, sync };

})();
