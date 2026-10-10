/* Chapitre 2 — HABITUDE. Sauvegarde propre au niveau ; aucune dépendance à la V1. */
'use strict';
(() => {
  const W = 56, H = 40, SAVE_KEY = 'otherPlayerChapter2SaveV2', BACKUP_KEY = SAVE_KEY + '_backup';
  const CAMPAIGN_KEY = 'otherPlayerCampaignV2_1';
  const canvas = document.getElementById('world'), ctx = canvas.getContext('2d', { alpha: false });
  const mapCanvas = document.getElementById('minimap'), mapCtx = mapCanvas.getContext('2d', { alpha: false });
  const $ = id => document.getElementById(id), index = (x, y) => y * W + x;
  const grid = new Uint8Array(W * H).fill(1);
  const rooms = [
    { label: 'RENCONTRE', x: 2, y: 14, w: 10, h: 12 },
    { label: 'LE CARREFOUR', x: 14, y: 14, w: 12, h: 12 },
    { label: 'BRANCHE NORD', x: 29, y: 2, w: 21, h: 15 },
    { label: 'BRANCHE SUD', x: 29, y: 23, w: 21, h: 15 },
    { label: 'SALLE DES SYMBOLES', x: 46, y: 14, w: 9, h: 12 }
  ];
  function floor(x, y) { if (x > 0 && y > 0 && x < W - 1 && y < H - 1) grid[index(x, y)] = 0; }
  function carveRoom(r) { for (let y = r.y + 1; y < r.y + r.h - 1; y++) for (let x = r.x + 1; x < r.x + r.w - 1; x++) floor(x, y); }
  function carveSegment(a, b, radius = 1) {
    let x = a[0], y = a[1]; const dx = Math.sign(b[0] - x), dy = Math.sign(b[1] - y);
    const stamp = () => { for (let oy = -radius; oy <= radius; oy++) for (let ox = -radius; ox <= radius; ox++) floor(x + ox, y + oy); };
    while (x !== b[0] || y !== b[1]) { stamp(); if (x !== b[0]) x += dx; else if (y !== b[1]) y += dy; }
    stamp();
  }
  function carveRoute(points) { for (let i = 1; i < points.length; i++) carveSegment(points[i - 1], points[i]); }
  rooms.forEach(carveRoom);
  [
    [[10, 19], [15, 19]],
    [[24, 16], [27, 16], [27, 9], [34, 9]],
    [[36, 9], [39, 9], [39, 5], [46, 5], [46, 16], [48, 16]],
    [[24, 22], [27, 22], [27, 30], [30, 30]],
    [[40, 30], [44, 30], [46, 30], [46, 22], [48, 22]]
  ].forEach(carveRoute);
  // Une cloison traverse la branche nord : porte à durée limitée, détour permanent en dessous.
  for (let y = 4; y <= 14; y++) grid[index(35, y)] = 1;
  for (let y = 8; y <= 10; y++) floor(35, y);
  floor(35, 12); floor(35, 13);

  const start = { x: 7.5, y: 19.5 }, otherStart = { x: 8.5, y: 20.5 };
  const branchNorth = { x: 31.5, y: 9.5 }, branchSouth = { x: 31.5, y: 30.5 };
  const sun = { x: 49.5, y: 17.5 }, moon = { x: 49.5, y: 21.5 };
  const secretNiche = { x: 47.5, y: 5.5 }, exit = { x: 52.5, y: 19.5 };
  const state = {
    player: { ...start }, other: { ...otherStart }, branch: '', correctSymbol: '', gateOpen: false,
    secretFound: false, doorTriggered: false, doorUntil: 0, complete: false, paused: true,
    explored: new Uint8Array(W * H), events: [], frame: 0, elapsed: 0, lastSave: 0, toastUntil: 0
  };
  let input = { x: 0, y: 0 }, held = new Map(), pointer = null, lastFrame = 0;
  let viewW = 1, viewH = 1, dpr = 1, camera = { x: 0, y: 0 }, otherPath = [], pathTarget = '', pathTimer = 0;
  let drawerOpen = false, drawerWasPaused = false, restartWasPaused = true, restartFocusReturn = null;
  let completedCampaignChapters = [];
  const neighbors = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  function checksum(text) { let h = 2166136261; for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(16); }
  function passable(x, y, at = Date.now()) {
    const cx = Math.floor(x), cy = Math.floor(y);
    if (cx < 1 || cy < 1 || cx >= W - 1 || cy >= H - 1) return false;
    if (!state.gateOpen && cx === 51 && cy >= 15 && cy <= 24) return false;
    if (state.doorUntil > at && cx === 35 && cy >= 8 && cy <= 10) return false;
    return grid[index(cx, cy)] === 0;
  }
  function validPosition(p) { const r = .22; return [[0, 0], [-r, 0], [r, 0], [0, -r], [0, r]].every(([dx, dy]) => passable(p.x + dx, p.y + dy)); }
  function encodeSave() {
    const payload = JSON.stringify({ v: 1, player: state.player, other: state.other, branch: state.branch, correctSymbol: state.correctSymbol,
      gateOpen: state.gateOpen, secretFound: state.secretFound, doorTriggered: state.doorTriggered, complete: state.complete,
      explored: Array.from(state.explored), events: state.events.slice(-30) });
    return JSON.stringify({ version: 1, payload, checksum: checksum(payload) });
  }
  function decodeSave(raw) {
    try { const box = JSON.parse(raw); if (box?.version !== 1 || typeof box.payload !== 'string' || checksum(box.payload) !== box.checksum) return null;
      const d = JSON.parse(box.payload); return d?.v === 1 && d.player && d.other ? d : null; } catch { return null; }
  }
  function readSave(key) { try { const raw = localStorage.getItem(key); return raw ? decodeSave(raw) : null; } catch { return null; } }
  function loadSave() {
    const d = readSave(SAVE_KEY) || readSave(BACKUP_KEY); if (!d) return false;
    state.branch = d.branch === 'NORD' || d.branch === 'SUD' ? d.branch : '';
    state.correctSymbol = d.correctSymbol === 'SOLEIL' || d.correctSymbol === 'LUNE' ? d.correctSymbol : '';
    state.gateOpen = !!d.gateOpen; state.secretFound = !!d.secretFound; state.doorTriggered = !!d.doorTriggered; state.complete = !!d.complete;
    if (state.secretFound) revealSecretShortcut();
    if (validPosition(d.player)) state.player = d.player; if (validPosition(d.other)) state.other = d.other;
    if (Array.isArray(d.explored) && d.explored.length === W * H) state.explored = Uint8Array.from(d.explored, n => n ? 1 : 0);
    state.events = Array.isArray(d.events) ? d.events.slice(-30) : []; return true;
  }
  function save(force = false) {
    const now = Date.now(); if (!force && now - state.lastSave < 1100) return; state.lastSave = now;
    try { const previous = localStorage.getItem(SAVE_KEY); if (previous && decodeSave(previous)) localStorage.setItem(BACKUP_KEY, previous); localStorage.setItem(SAVE_KEY, encodeSave()); }
    catch { toast('Sauvegarde du chapitre indisponible dans ce navigateur.'); }
  }
  function remember(type) { state.events.push({ type, time: Date.now(), branch: state.branch }); if (state.events.length > 30) state.events.shift(); save(true); }
  function toast(message, duration = 2600) { $('toast').textContent = message; $('toast').classList.add('visible'); state.toastUntil = performance.now() + duration; }
  function near(a, b, radius) { return Math.hypot(a.x - b.x, a.y - b.y) <= radius; }
  function revealSecretShortcut() { for (let y = 14; y <= 25; y++) for (let x = 40; x <= 42; x++) floor(x, y); }
  function loadCampaign() {
    try { const d = JSON.parse(localStorage.getItem(CAMPAIGN_KEY) || '{}'); if (d.version === 1 && Array.isArray(d.completed)) completedCampaignChapters = [...new Set(d.completed.filter(n => Number.isInteger(n) && n >= 1 && n <= 36))]; } catch { completedCampaignChapters = []; }
  }
  function markComplete(){ window.v2MarkCampaignChapterComplete?.(2); }
  function updateHud() {
    $('branchCount').textContent = state.branch ? `CHOIX · ${state.branch}` : 'CHOIX · NON FAIT';
    $('gateStatus').textContent = state.gateOpen ? 'PORTE : OUVERTE' : 'PORTE : VERROUILLÉE';
    if (state.complete) $('objective').textContent = `CHAPITRE TERMINÉ · BRANCHE ${state.branch} · ${state.correctSymbol}`;
    else if (state.gateOpen) $('objective').textContent = 'Le symbole a ouvert la porte. Retrouve l’Autre et rejoignez la sortie.';
    else if (state.branch) $('objective').textContent = `Branche ${state.branch} mémorisée. Active le symbole correspondant dans la salle de l’est.`;
    else $('objective').textContent = 'Choisis une branche, puis active dans la salle de l’est le symbole correspondant. L’Autre observe ton choix.';
    $('otherStatus').textContent = near(state.player, state.other, 1.6) ? 'L’AUTRE : AVEC TOI' : state.branch ? `L’AUTRE : A RETENU ${state.branch}` : 'L’AUTRE : EN EXPLORATION';
    $('drawerObjective').textContent = $('objective').textContent;
    $('drawerObjectiveState').textContent = state.complete ? 'TERMINÉ' : state.gateOpen ? 'SYMBOLE VALIDÉ · PORTE OUVERTE' : state.branch ? `BRANCHE ${state.branch} MÉMORISÉE` : 'EN COURS';
    $('drawerOtherStatus').textContent = $('otherStatus').textContent; $('drawerGateStatus').textContent = $('gateStatus').textContent;
    $('drawerProgress').textContent = `CHOIX : ${state.branch || 'AUCUNE BRANCHE'} · NICHE : ${state.secretFound ? 'DÉCOUVERTE' : 'À TROUVER'}`;
    $('drawerJourney').textContent = state.complete ? 'PARCOURS : SYMBOLE CONFIRMÉ, SORTIE REJOINTE' : state.branch ? `PARCOURS : L’AUTRE SE SOUVIENT DU ${state.branch}` : 'PARCOURS : À DÉCOUVRIR';
  }
  function chooseBranch(branch) {
    if (state.branch) return;
    state.branch = branch; remember(`chose_${branch.toLowerCase()}_branch`); updateHud();
    toast(`Tu as choisi le ${branch.toLowerCase()}. L’Autre s’en souviendra.`);
  }
  function unlockGate(symbol) {
    state.correctSymbol = symbol; state.gateOpen = true; remember(`validated_${symbol.toLowerCase()}_symbol`);
    updateHud(); toast(`Le ${symbol.toLowerCase()} correspond à ton choix. La porte s’ouvre.`);
  }
  function interact() {
    if (state.paused || state.complete) return;
    if (near(state.player, sun, 1.5) || near(state.player, moon, 1.5)) {
      const symbol = near(state.player, sun, 1.5) ? 'SOLEIL' : 'LUNE';
      if (!state.branch) { toast('Le carrefour attend ton choix. Explore d’abord le nord ou le sud.'); return; }
      const expected = state.branch === 'NORD' ? 'SOLEIL' : 'LUNE';
      if (symbol !== expected) { remember(`rejected_${symbol.toLowerCase()}_symbol`); toast(`Ce symbole ne correspond pas à la branche ${state.branch}. Tu peux essayer l’autre.`); return; }
      if (state.gateOpen) toast('Le symbole est déjà validé. Rejoins l’Autre près de la sortie.'); else unlockGate(symbol);
    } else if (near(state.player, secretNiche, 1.65)) {
      if (!state.secretFound) { state.secretFound = true; revealSecretShortcut(); remember('revealed_secret_shortcut'); toast('Un passage secret s’ouvre entre les deux branches.'); }
      else toast('Le passage secret entre les branches est ouvert.');
    } else if (near(state.player, exit, 1.5)) toast(state.gateOpen ? 'La sortie attend que l’Autre te rejoigne.' : 'La porte est scellée. Trouve le symbole correspondant à ton premier choix.');
    else toast('Explore le carrefour, puis cherche le symbole correspondant à ta branche.');
  }

  function nearestFree(x, y) {
    const sx = Math.floor(x), sy = Math.floor(y); if (passable(sx + .5, sy + .5)) return index(sx, sy);
    for (let r = 1; r <= 5; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
      if (Math.abs(dx) !== r && Math.abs(dy) !== r) continue; const nx = sx + dx, ny = sy + dy;
      if (passable(nx + .5, ny + .5)) return index(nx, ny);
    } return -1;
  }
  function findPath(from, to) {
    const begin = nearestFree(from.x, from.y), goal = nearestFree(to.x, to.y); if (begin < 0 || goal < 0 || begin === goal) return [];
    const cost = new Float32Array(W * H); cost.fill(Infinity); const came = new Int32Array(W * H); came.fill(-1);
    const closed = new Uint8Array(W * H), open = [{ id: begin, f: 0 }], gx = goal % W, gy = Math.floor(goal / W); cost[begin] = 0;
    const heuristic = (x, y) => Math.abs(x - gx) + Math.abs(y - gy);
    while (open.length) {
      open.sort((a, b) => a.f - b.f); const id = open.shift().id; if (closed[id]) continue; if (id === goal) break; closed[id] = 1;
      const x = id % W, y = Math.floor(id / W);
      for (const [dx, dy] of neighbors) { const nx = x + dx, ny = y + dy, ni = index(nx, ny); if (!passable(nx + .5, ny + .5) || closed[ni]) continue;
        const next = cost[id] + 1; if (next < cost[ni]) { cost[ni] = next; came[ni] = id; open.push({ id: ni, f: next + heuristic(nx, ny) }); } }
    }
    if (came[goal] < 0) return []; const path = [];
    for (let id = goal; id !== begin && id >= 0; id = came[id]) path.push({ x: id % W + .5, y: Math.floor(id / W) + .5 });
    return path.reverse();
  }
  function moveActor(actor, dx, dy, amount) {
    const m = Math.hypot(dx, dy); if (m > 1) { dx /= m; dy /= m; }
    const sx = dx * amount, sy = dy * amount, r = .22;
    const blocked = (x, y) => [[0, 0], [-r, 0], [r, 0], [0, -r], [0, r]].some(([ox, oy]) => !passable(x + ox, y + oy));
    if (!blocked(actor.x + sx, actor.y)) actor.x += sx; if (!blocked(actor.x, actor.y + sy)) actor.y += sy;
  }
  function updateOther(dt) {
    pathTimer -= dt; const dist = Math.hypot(state.player.x - state.other.x, state.player.y - state.other.y);
    if (dist < 1.35) { otherPath = []; pathTimer = .2; return; }
    const key = `${Math.floor(state.player.x)}:${Math.floor(state.player.y)}`;
    if (key !== pathTarget || pathTimer <= 0 || !otherPath.length) { otherPath = findPath(state.other, state.player); pathTarget = key; pathTimer = .5; }
    while (otherPath.length && Math.hypot(otherPath[0].x - state.other.x, otherPath[0].y - state.other.y) < .24) otherPath.shift();
    if (otherPath.length) moveActor(state.other, otherPath[0].x - state.other.x, otherPath[0].y - state.other.y, 3.4 * dt);
  }
  function resize() {
    const r = canvas.getBoundingClientRect(); dpr = Math.min(window.devicePixelRatio || 1, 1.5); viewW = Math.max(1, r.width); viewH = Math.max(1, r.height);
    const w = Math.round(viewW * dpr), h = Math.round(viewH * dpr); if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); mapCanvas.width = Math.round(mapCanvas.clientWidth * dpr); mapCanvas.height = Math.round(mapCanvas.clientHeight * dpr); mapCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function reveal() { for (const [p, radius] of [[state.player, 8], [state.other, 5]]) { const ax = Math.floor(p.x), ay = Math.floor(p.y);
    for (let y = ay - radius; y <= ay + radius; y++) for (let x = ax - radius; x <= ax + radius; x++) if (x > 0 && y > 0 && x < W - 1 && y < H - 1 && Math.hypot(x + .5 - p.x, y + .5 - p.y) <= radius) state.explored[index(x, y)] = 1; } }
  function update(dt) {
    state.elapsed += dt; const frameDt = Math.min(dt, .05), steps = Math.max(1, Math.ceil(frameDt / .025));
    for (let i = 0; i < steps; i++) moveActor(state.player, input.x, input.y, 4.6 * frameDt / steps);
    if (!state.branch && near(state.player, branchNorth, 1.2)) chooseBranch('NORD');
    else if (!state.branch && near(state.player, branchSouth, 1.2)) chooseBranch('SUD');
    if (!state.doorTriggered && state.player.x > 36 && Math.abs(state.player.y - 9.5) < 2) {
      state.doorTriggered = true; state.doorUntil = Date.now() + 4200; remember('north_door_closed_temporarily'); toast('La porte nord se referme derrière toi. Le détour inférieur reste ouvert.');
    }
    if (state.doorUntil && state.doorUntil <= Date.now()) { state.doorUntil = 0; toast('La porte nord s’est rouverte.'); }
    updateOther(frameDt); reveal(); updateHud();
    if (state.gateOpen && near(state.player, exit, .8) && near(state.other, exit, 2.2)) {
      state.complete = true; input = { x: 0, y: 0 }; held.clear(); remember('chapter2_complete'); markComplete();
      $('completeSummary').textContent = `Vous avez choisi la branche ${state.branch} et le symbole ${state.correctSymbol}. ${state.secretFound ? 'Le passage secret a aussi été découvert.' : 'Le passage secret reste à découvrir.'}`;
      $('completeOverlay').classList.add('active'); $('completeOverlay').setAttribute('aria-hidden', 'false'); updateHud();
    }
    if (state.frame % 90 === 0) save(); if (performance.now() > state.toastUntil) $('toast').classList.remove('visible');
  }
  function worldToScreen(x, y) { return { x: x * 22 - camera.x, y: y * 22 - camera.y }; }
  function drawMarker(p, color, label, radius = 8) { const q = worldToScreen(p.x, p.y); ctx.beginPath(); ctx.arc(q.x, q.y, radius, 0, Math.PI * 2); ctx.fillStyle = color + '38'; ctx.fill(); ctx.beginPath(); ctx.arc(q.x, q.y, radius * .55, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill(); ctx.font = '700 9px system-ui'; ctx.textAlign = 'center'; ctx.fillStyle = color; ctx.fillText(label, q.x, q.y - 12); }
  function drawActor(p, color, label, phase) { const q = worldToScreen(p.x, p.y), bob = Math.sin(state.elapsed * 3 + phase) * 1.4; ctx.beginPath(); ctx.arc(q.x, q.y + bob, 9, 0, Math.PI * 2); ctx.fillStyle = color + '30'; ctx.fill(); ctx.beginPath(); ctx.arc(q.x, q.y + bob, 5.5, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill(); ctx.font = '600 10px system-ui'; ctx.textAlign = 'center'; ctx.fillStyle = color; ctx.fillText(label, q.x, q.y - 11 + bob); }
  function drawMap() { const cw = mapCanvas.clientWidth, ch = mapCanvas.clientHeight; if (!cw || mapCanvas.hidden) return; mapCtx.setTransform(dpr, 0, 0, dpr, 0, 0); mapCtx.fillStyle = '#071014'; mapCtx.fillRect(0, 0, cw, ch); const cell = Math.min(cw / W, ch / H), ox = (cw - W * cell) / 2, oy = (ch - H * cell) / 2;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (state.explored[index(x, y)]) { mapCtx.fillStyle = grid[index(x, y)] ? '#5a6a6f' : '#15252a'; mapCtx.fillRect(ox + x * cell, oy + y * cell, Math.ceil(cell), Math.ceil(cell)); }
    for (const [p, color] of [[state.player, '#82edaa'], [state.other, '#ff8996']]) if (state.explored[index(Math.floor(p.x), Math.floor(p.y))]) { mapCtx.fillStyle = color; mapCtx.beginPath(); mapCtx.arc(ox + p.x * cell, oy + p.y * cell, Math.max(2, cell * .8), 0, Math.PI * 2); mapCtx.fill(); } }
  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.fillStyle = '#05090c'; ctx.fillRect(0, 0, viewW, viewH);
    const tile = 22, worldW = W * tile, worldH = H * tile; camera.x = Math.max(0, Math.min(worldW - viewW, state.player.x * tile - viewW / 2)); camera.y = Math.max(0, Math.min(worldH - viewH, state.player.y * tile - viewH / 2));
    const x0 = Math.max(0, Math.floor(camera.x / tile) - 1), x1 = Math.min(W - 1, Math.ceil((camera.x + viewW) / tile) + 1), y0 = Math.max(0, Math.floor(camera.y / tile) - 1), y1 = Math.min(H - 1, Math.ceil((camera.y + viewH) / tile) + 1);
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { const seen = state.explored[index(x, y)], p = worldToScreen(x, y); ctx.fillStyle = seen ? (grid[index(x, y)] ? '#35454a' : '#11191d') : '#05090c'; ctx.fillRect(p.x, p.y, tile + .4, tile + .4); }
    if (state.doorUntil > Date.now()) for (let y = 8; y <= 10; y++) { const p = worldToScreen(35, y); ctx.fillStyle = '#db7f5a'; ctx.fillRect(p.x + 2, p.y + 2, tile - 4, tile - 4); }
    if (!state.gateOpen) for (let y = 15; y <= 24; y++) { const p = worldToScreen(51, y); ctx.fillStyle = '#647579'; ctx.fillRect(p.x, p.y, tile, tile); }
    if (state.explored[index(Math.floor(branchNorth.x), Math.floor(branchNorth.y))]) drawMarker(branchNorth, state.branch === 'NORD' ? '#82edaa' : '#f3ce83', 'NORD');
    if (state.explored[index(Math.floor(branchSouth.x), Math.floor(branchSouth.y))]) drawMarker(branchSouth, state.branch === 'SUD' ? '#82edaa' : '#f3ce83', 'SUD');
    if (state.explored[index(Math.floor(sun.x), Math.floor(sun.y))]) drawMarker(sun, state.correctSymbol === 'SOLEIL' ? '#82edaa' : '#f3ce83', 'SOLEIL');
    if (state.explored[index(Math.floor(moon.x), Math.floor(moon.y))]) drawMarker(moon, state.correctSymbol === 'LUNE' ? '#82edaa' : '#aeb9ef', 'LUNE');
    if (state.explored[index(Math.floor(secretNiche.x), Math.floor(secretNiche.y))]) drawMarker(secretNiche, '#91d8e0', state.secretFound ? 'RACCOURCI' : 'NICHE', 7);
    if (state.explored[index(Math.floor(exit.x), Math.floor(exit.y))]) { const p = worldToScreen(exit.x, exit.y); ctx.strokeStyle = state.gateOpen ? '#82edaa' : '#76858a'; ctx.lineWidth = 3; ctx.strokeRect(p.x - 10, p.y - 13, 20, 26); ctx.font = '700 9px system-ui'; ctx.textAlign = 'center'; ctx.fillStyle = '#d5e0e0'; ctx.fillText('SORTIE', p.x, p.y + 24); }
    for (const r of rooms) { const x = r.x + r.w / 2, y = r.y + r.h / 2; if (!state.explored[index(Math.floor(x), Math.floor(y))]) continue; const p = worldToScreen(x, y); ctx.font = '600 8px system-ui'; ctx.textAlign = 'center'; ctx.fillStyle = '#aebdc044'; ctx.fillText(r.label, p.x, p.y); }
    drawActor(state.other, '#ff8996', 'L’AUTRE', 1); drawActor(state.player, '#82edaa', 'TOI', 0); drawMap();
  }
  function setPaused(value) { state.paused = !!value; $('pauseButton').textContent = state.paused ? 'REPRENDRE' : 'PAUSE'; $('pauseButton').setAttribute('aria-pressed', String(state.paused)); $('pauseOverlay').classList.toggle('active', state.paused); $('pauseOverlay').setAttribute('aria-hidden', String(!state.paused)); if (state.paused) { held.clear(); releaseJoystick(); } lastFrame = performance.now(); }
  function setDrawer(open) { if (open === drawerOpen) return; drawerOpen = open; $('sideDrawer').classList.toggle('open', open); $('drawerScrim').classList.toggle('open', open); $('sideDrawer').setAttribute('aria-hidden', String(!open)); $('drawerScrim').setAttribute('aria-hidden', String(!open)); $('menuButton').setAttribute('aria-expanded', String(open));
    if (open) { drawerWasPaused = state.paused; state.paused = true; $('pauseOverlay').classList.remove('active'); $('pauseOverlay').setAttribute('aria-hidden', 'true'); held.clear(); releaseJoystick(); updateHud(); $('drawerClose').focus(); }
    else { if (!drawerWasPaused && !state.complete) { state.paused = false; $('pauseButton').textContent = 'PAUSE'; $('pauseButton').setAttribute('aria-pressed', 'false'); } else if (drawerWasPaused) { $('pauseOverlay').classList.add('active'); $('pauseOverlay').setAttribute('aria-hidden', 'false'); } drawerWasPaused = false; } lastFrame = performance.now(); }
  function toggleMap() { mapCanvas.hidden = !mapCanvas.hidden; $('mapToggle').setAttribute('aria-expanded', String(!mapCanvas.hidden)); resize(); draw(); }
  function showIntro() { const progressed = !!(state.branch || state.secretFound || state.gateOpen); $('introMemory').textContent = progressed ? 'Une progression du chapitre 2 est enregistrée sur cet appareil.' : 'Ta progression V2 est séparée de la sauvegarde V1.'; $('startButton').textContent = state.complete ? 'REJOUER LE CHAPITRE 2' : progressed ? 'REPRENDRE LE PARCOURS' : 'COMMENCER'; state.paused = true; $('pauseOverlay').classList.remove('active'); $('pauseOverlay').setAttribute('aria-hidden', 'true'); $('introOverlay').classList.add('active'); $('introOverlay').setAttribute('aria-hidden', 'false'); lastFrame = performance.now(); $('startButton').focus(); }
  function enterLevel() { if (state.complete) { requestRestart(); return; } $('introOverlay').classList.remove('active'); $('introOverlay').setAttribute('aria-hidden', 'true'); state.paused = false; $('pauseButton').textContent = 'PAUSE'; $('pauseButton').setAttribute('aria-pressed', 'false'); lastFrame = performance.now(); }
  function requestRestart() { restartWasPaused = state.paused; restartFocusReturn = document.activeElement; if (!state.paused && !state.complete) setPaused(true); $('restartOverlay').classList.add('active'); $('restartOverlay').setAttribute('aria-hidden', 'false'); $('confirmRestart').focus(); }
  function cancelRestart() { $('restartOverlay').classList.remove('active'); $('restartOverlay').setAttribute('aria-hidden', 'true'); if (!state.complete && !restartWasPaused) setPaused(false); else lastFrame = performance.now(); if (restartFocusReturn?.focus) restartFocusReturn.focus(); }
  function confirmRestart() {
    try { localStorage.removeItem(SAVE_KEY); localStorage.removeItem(BACKUP_KEY); } catch {}
    state.player = { ...start }; state.other = { ...otherStart }; state.branch = ''; state.correctSymbol = ''; state.gateOpen = false; state.secretFound = false; state.doorTriggered = false; state.doorUntil = 0; state.complete = false; state.paused = true; state.explored.fill(0); state.events = []; state.frame = 0; state.elapsed = 0; state.lastSave = 0; input = { x: 0, y: 0 }; held.clear(); releaseJoystick(); otherPath = []; pathTarget = ''; pathTimer = 0; drawerOpen = false; drawerWasPaused = false;
    for (const id of ['sideDrawer', 'drawerScrim', 'completeOverlay', 'pauseOverlay']) { $(id).classList.remove('open', 'active'); $(id).setAttribute('aria-hidden', 'true'); } $('menuButton').setAttribute('aria-expanded', 'false'); $('restartOverlay').classList.remove('active'); $('restartOverlay').setAttribute('aria-hidden', 'true'); $('mapToggle').setAttribute('aria-expanded', 'false'); mapCanvas.hidden = true; $('toast').classList.remove('visible'); reveal(); updateHud(); showIntro(); draw();
  }
  function keyDown(e) { const k = e.key.toLowerCase(); if (k === 'escape') { e.preventDefault(); if ($('restartOverlay').classList.contains('active')) cancelRestart(); else if ($('introOverlay').classList.contains('active')) return; else if (drawerOpen) setDrawer(false); else if ($('pauseOverlay').classList.contains('active')) setPaused(false); else if (!state.complete) setPaused(true); return; }
    if (state.paused || drawerOpen || state.complete) return; const keys = { arrowleft: [-1, 0], a: [-1, 0], q: [-1, 0], arrowright: [1, 0], d: [1, 0], arrowup: [0, -1], w: [0, -1], z: [0, -1], arrowdown: [0, 1], s: [0, 1] };
    if (keys[k]) { e.preventDefault(); held.set(k, keys[k]); let x = 0, y = 0; for (const [dx, dy] of held.values()) { x += dx; y += dy; } const m = Math.hypot(x, y) || 1; input = { x: x / m, y: y / m }; }
    else if (k === 'e' || k === 'enter') { e.preventDefault(); interact(); } else if (k === 'p') setPaused(true);
  }
  function keyUp(e) { if (held.delete(e.key.toLowerCase())) { let x = 0, y = 0; for (const [dx, dy] of held.values()) { x += dx; y += dy; } const m = Math.hypot(x, y) || 1; input = held.size ? { x: x / m, y: y / m } : { x: 0, y: 0 }; } }
  function joystickMove(e) { const joy = $('joystick'), r = joy.getBoundingClientRect(), max = r.width * .31; let dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2), d = Math.hypot(dx, dy); if (d > max) { dx *= max / d; dy *= max / d; } const nx = dx / max, ny = dy / max, dead = .12; input = { x: Math.abs(nx) < dead ? 0 : nx, y: Math.abs(ny) < dead ? 0 : ny }; $('stick').style.transform = `translate(${dx}px,${dy}px)`; }
  function releaseJoystick() { pointer = null; input = { x: 0, y: 0 }; $('stick').style.transform = 'translate(0,0)'; if (held.size) { let x = 0, y = 0; for (const [dx, dy] of held.values()) { x += dx; y += dy; } const m = Math.hypot(x, y) || 1; input = { x: x / m, y: y / m }; } }
  function trapFocus(e, overlay) { if (e.key !== 'Tab') return; const items = [...$(overlay).querySelectorAll('button:not([disabled]),a[href]')]; if (!items.length) return; const first = items[0], last = items[items.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } }

  loadCampaign(); loadSave(); reveal(); resize(); updateHud();
  window.addEventListener('resize', resize, { passive: true }); window.visualViewport?.addEventListener('resize', resize, { passive: true }); window.addEventListener('keydown', keyDown); window.addEventListener('keyup', keyUp); window.addEventListener('blur', () => { held.clear(); releaseJoystick(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { held.clear(); releaseJoystick(); save(true); } });
  $('interact').addEventListener('click', interact); $('pauseButton').addEventListener('click', () => { if (!drawerOpen && !state.complete) setPaused(!state.paused); }); $('mapToggle').addEventListener('click', toggleMap);
  $('menuButton').addEventListener('click', () => setDrawer(true)); $('drawerClose').addEventListener('click', () => setDrawer(false)); $('drawerScrim').addEventListener('click', () => setDrawer(false)); $('drawerResume').addEventListener('click', () => { setDrawer(false); setPaused(false); });
  $('drawerMap').addEventListener('click', () => { setDrawer(false); toggleMap(); }); $('drawerPause').addEventListener('click', () => { setDrawer(false); setPaused(true); }); $('drawerRestart').addEventListener('click', requestRestart); $('resumeButton').addEventListener('click', () => setPaused(false)); $('pauseMenuButton').addEventListener('click', () => setDrawer(true));
  $('startButton').addEventListener('click', enterLevel); $('reset').addEventListener('click', requestRestart); $('completeClose').addEventListener('click', requestRestart); $('confirmRestart').addEventListener('click', confirmRestart); $('cancelRestart').addEventListener('click', cancelRestart); $('restartOverlay').addEventListener('click', e => { if (e.target === $('restartOverlay')) cancelRestart(); }); $('restartOverlay').addEventListener('keydown', e => trapFocus(e, 'restartOverlay'));
  $('sideDrawer').addEventListener('keydown', e => trapFocus(e, 'sideDrawer')); const joy = $('joystick'); joy.addEventListener('pointerdown', e => { if (state.paused || drawerOpen || state.complete) return; pointer = e.pointerId; joy.setPointerCapture(e.pointerId); joystickMove(e); }); joy.addEventListener('pointermove', e => { if (e.pointerId === pointer) joystickMove(e); }); joy.addEventListener('pointerup', releaseJoystick); joy.addEventListener('pointercancel', releaseJoystick);
  if (state.complete) { markComplete(); $('completeOverlay').classList.add('active'); $('completeOverlay').setAttribute('aria-hidden', 'false'); }
  showIntro(); if (state.events.length) toast('Progression du chapitre 2 restaurée.');
  function frame(now) { requestAnimationFrame(frame); if (!lastFrame) lastFrame = now; const dt = Math.min(.1, Math.max(0, (now - lastFrame) / 1000)); lastFrame = now; if (!state.paused && !state.complete) { state.frame++; update(dt); } draw(); }
  requestAnimationFrame(frame);
  window.v2Chapter2Snapshot = () => ({ width: W, height: H, player: { ...state.player }, other: { ...state.other }, branch: state.branch, correctSymbol: state.correctSymbol, gateOpen: state.gateOpen, secretFound: state.secretFound, doorTriggered: state.doorTriggered, complete: state.complete, paused: state.paused, explored: state.explored.reduce((a, b) => a + b, 0), eventTypes: state.events.map(e => e.type) });
})();
