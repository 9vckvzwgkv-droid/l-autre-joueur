/* V2 prototype only. The original V1 game.js and its save keys are not used here. */
'use strict';
(() => {
  const W = 88, H = 48, SAVE_KEY = 'otherPlayerMemoryV2Prototype1';
  const CAMPAIGN_KEY = 'otherPlayerCampaignV2_1';
  const BACKUP_KEY = SAVE_KEY + '_backup';
  const campaignChapters = [
    ['TRACE', 'Suivre trois empreintes, rejoindre l’Autre et retrouver ensemble la sortie.'],
    ['HABITUDE', 'Choisir une branche ; l’Autre observe et mémorise le trajet.'],
    ['HÉSITATION', 'Lire une séquence de lumières et choisir la bonne alcôve.'],
    ['ATTENTE', 'Synchroniser deux dalles en observant le rythme des impulsions.'],
    ['MIROIR', 'Faire se rencontrer deux trajets et distinguer les traces du reflet.'],
    ['DISTANCE / ABANDON', 'Activer deux relais ; décider comment rejoindre ou quitter l’Autre.'],
    ['CHOIX', 'Comparer trois branches et choisir le raccourci qui façonnera la suite.'],
    ['BLOCAGE / PUNITION', 'Activer deux leviers, gérer une caisse qui bloque le passage et observer l’Autre choisir un détour protecteur.'],
    ['OBSERVATION', 'Observer trois postes puis reproduire une séquence.'],
    ['MENSONGE', 'Comparer trois indices, choisir de croire l’Autre ou vérifier une indication trompeuse.'],
    ['SOUVENIR', 'Retrouver un repère lié à un choix antérieur, avec indice de secours.'],
    ['CONFIANCE', 'Suivre une route proposée par l’Autre ou vérifier ses balises.'],
    ['TRAHISON', 'Assembler les éléments d’un pont et comprendre une promesse échouée.'],
    ['COOPÉRATION', 'Répartir les rôles pour déplacer une passerelle, ou prendre le détour solo.'],
    ['PRÉDICTION', 'Déjouer une route que l’Autre croit avoir anticipée.'],
    ['REFUS', 'Comprendre une limite exprimée par l’Autre et trouver une voie acceptable.'],
    ['ÉCHO', 'Rejouer un motif observé puis modifier un geste pour rompre la répétition.'],
    ['PROTECTION', 'Guider les deux personnages d’abri en abri à travers un faisceau.'],
    ['RETOUR', 'Revenir au premier lieu en suivant les repères dans l’ordre inverse.'],
    ['SILENCE', 'Résoudre une énigme par les formes, les ombres et les repères visuels.'],
    ['IDENTITÉ', 'Comparer deux moitiés du labyrinthe pour distinguer les marques de chacun.'],
    ['FRACTURE', 'Stabiliser deux points dans l’ordre indiqué par les lignes lumineuses.'],
    ['DEUX SORTIES', 'Comprendre les conséquences de deux issues avant de choisir.'],
    ['SEUIL', 'Retrouver trois marques passées et rejoindre l’Autre au seuil.'],
    ['DISTORSION', 'Comparer les repères persistants à une géométrie déplacée.'],
    ['PORTES', 'Choisir une boucle parmi trois et retrouver le carrefour.'],
    ['FANTÔME', 'Vérifier une présence grâce au regard de l’Autre et aux traces.'],
    ['RETOUR IMPOSSIBLE', 'Reconstruire le chemin quand certaines connexions ont changé.'],
    ['EFFONDREMENT', 'Franchir une zone instable en sécurisant des refuges successifs.'],
    ['LE MONDE CHOISIT', 'Observer comment les décisions passées modifient le labyrinthe.'],
    ['SECRET', 'Trouver une salle facultative à partir d’indices disséminés.'],
    ['DOUBLE', 'Coordonner deux versions du même parcours sans confondre leurs repères.'],
    ['VÉRITÉ', 'Confronter plusieurs souvenirs et vérifier ce que chacun a réellement vu.'],
    ['ABSENCE', 'Traverser un lieu silencieux en suivant les traces laissées par l’Autre.'],
    ['ORIGINE', 'Relier les premiers signes pour comprendre la naissance du labyrinthe.'],
    ['DERNIER CHOIX', 'Prendre une décision finale à partir de l’histoire vécue ensemble.']
  ];
  const canvas = document.getElementById('world');
  const ctx = canvas.getContext('2d', { alpha: false });
  const mapCanvas = document.getElementById('minimap');
  const mapCtx = mapCanvas.getContext('2d', { alpha: false });
  const $ = id => document.getElementById(id);
  const index = (x, y) => y * W + x;
  const grid = new Uint8Array(W * H).fill(1);

  const rooms = [
    { id: 'start', label: 'RENCONTRE', x: 2, y: 17, w: 11, h: 12 },
    { id: 'westNorth', label: 'GALERIE DES TRACES', x: 18, y: 4, w: 13, h: 11 },
    { id: 'westSouth', label: 'RELAIS A', x: 18, y: 32, w: 13, h: 11 },
    { id: 'hub', label: 'CARREFOUR', x: 35, y: 17, w: 13, h: 13 },
    { id: 'eastNorth', label: 'PASSAGE DES ÉCHOS', x: 52, y: 4, w: 13, h: 11 },
    { id: 'eastSouth', label: 'RELAIS B', x: 52, y: 32, w: 13, h: 11 },
    { id: 'exit', label: 'SORTIE', x: 70, y: 16, w: 15, h: 16 }
  ];

  function floor(x, y) {
    if (x < 1 || y < 1 || x >= W - 1 || y >= H - 1) return;
    grid[index(x, y)] = 0;
  }
  function carveRoom(room) {
    for (let y = room.y + 1; y < room.y + room.h - 1; y++)
      for (let x = room.x + 1; x < room.x + room.w - 1; x++) floor(x, y);
  }
  function carveSegment(a, b, radius = 1) {
    let x = a[0], y = a[1];
    const dx = Math.sign(b[0] - x), dy = Math.sign(b[1] - y);
    while (x !== b[0] || y !== b[1]) {
      for (let oy = -radius; oy <= radius; oy++)
        for (let ox = -radius; ox <= radius; ox++) floor(x + ox, y + oy);
      if (x !== b[0]) x += dx;
      else if (y !== b[1]) y += dy;
    }
    for (let oy = -radius; oy <= radius; oy++)
      for (let ox = -radius; ox <= radius; ox++) floor(x + ox, y + oy);
  }
  function carveRoute(points) {
    for (let i = 1; i < points.length; i++) carveSegment(points[i - 1], points[i]);
  }
  rooms.forEach(carveRoom);
  [
    [[12, 19], [15, 19], [15, 8], [18, 8]],
    [[12, 26], [15, 26], [15, 37], [18, 37]],
    [[30, 8], [33, 8], [33, 20], [35, 20]],
    [[30, 37], [33, 37], [33, 26], [35, 26]],
    [[47, 20], [50, 20], [50, 8], [52, 8]],
    [[47, 26], [50, 26], [50, 37], [52, 37]],
    [[64, 8], [67, 8], [67, 20], [70, 20]],
    [[64, 37], [67, 37], [67, 27], [70, 27]],
    [[24, 14], [24, 32]],
    [[58, 14], [58, 32]],
    [[38, 8], [44, 8], [44, 17]],
    [[38, 39], [44, 39], [44, 30]]
  ].forEach(carveRoute);

  // Interior ribs make the routes legible without making the rooms dead ends.
  [[22, 7, 1, 4], [27, 10, 2, 1], [20, 35, 4, 1], [27, 37, 1, 3],
    [38, 19, 1, 4], [43, 23, 2, 1], [55, 7, 1, 4], [61, 10, 2, 1],
    [55, 35, 4, 1], [61, 37, 1, 3]].forEach(([x, y, w, h]) => {
    for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) grid[index(xx, yy)] = 1;
  });

  const playerPlate = { x: 24.5, y: 37.5 };
  const otherPlate = { x: 58.5, y: 37.5 };
  const terminal = { x: 41.5, y: 23.5 };
  const refuge = { x: 41.5, y: 8.5 };
  const exit = { x: 82.5, y: 23.5 };
  const exitBarrier = { x: 78, y1: 17, y2: 30, doorY: 23 };
  const trap = { triggerX: 15.3, triggerY: 19.5, gateX: 14, gateY1: 18, gateY2: 21, seconds: 5.5 };

  const state = {
    player: { x: 7.5, y: 23.5 }, other: { x: 8.5, y: 25.5 },
    command: 'follow', gateOpen: false, trapUntil: 0, trapSeen: false,
    playerRelayB: false, separated: false, separationActive: false, reunited: false,
    refugeFound: false, relayMethod: '', exitOutcome: '', complete: false, paused: false, explored: new Uint8Array(W * H),
    events: [], lastSave: 0, elapsed: 0, frame: 0, toastUntil: 0
  };
  let input = { x: 0, y: 0 }, pointer = null, lastFrame = 0;
  let viewW = 1, viewH = 1, dpr = 1, camera = { x: 0, y: 0 };
  let otherPath = [], pathTarget = '', pathTimer = 0, toastTimer = 0;
  let drawerOpen = false, drawerWasPaused = false, hudTimer = 0, campaignWasPaused = true, campaignFocusReturn = null;
  let restartWasPaused = true, restartFocusReturn = null, selectedCampaignChapter = 0, chapterLaunchFocusReturn = null;
  let completedCampaignChapters = [];

  function loadCampaignProgress() {
    try {
      const data = JSON.parse(localStorage.getItem(CAMPAIGN_KEY) || '{}');
      if (data.version === 1 && Array.isArray(data.completed)) {
        completedCampaignChapters = [...new Set(data.completed.filter(n => Number.isInteger(n) && n >= 1 && n <= 36))];
      }
    } catch { completedCampaignChapters = []; }
  }
  function saveCampaignProgress() {
    try { localStorage.setItem(CAMPAIGN_KEY, JSON.stringify({ version: 1, completed: completedCampaignChapters })); } catch {}
    renderCampaign();
  }
  function markCampaignChapterComplete(chapter) {
    if (!Number.isInteger(chapter) || chapter < 1 || chapter > 36) return false;
    if (!completedCampaignChapters.includes(chapter) && chapter > 1 && !completedCampaignChapters.includes(chapter - 1)) {
      toast(`Chapitre ${chapter} non validé : termine d’abord le chapitre ${chapter - 1}.`);
      return false;
    }
    if (!completedCampaignChapters.includes(chapter)) completedCampaignChapters.push(chapter);
    saveCampaignProgress();
    return true;
  }
  const playableCampaignChapters = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  function chapterUnlocked(number) {
    return number === 1 || completedCampaignChapters.includes(number) || completedCampaignChapters.includes(number - 1);
  }
  function nextCampaignChapter() {
    for (let n = 1; n <= 36; n++) if (!completedCampaignChapters.includes(n)) return n;
    return 36;
  }
  function renderCampaign() {
    const list = $('campaignChapters');
    if (!list) return;
    list.innerHTML = campaignChapters.map(([title, description], i) => {
      const number = i + 1;
      const complete = completedCampaignChapters.includes(number);
      const unlocked = chapterUnlocked(number);
      const playable = playableCampaignChapters.has(number);
      const canLaunch = unlocked && playable;
      const status = complete ? 'Terminé · rejouable' : !playable ? 'Chapitre à intégrer' : unlocked ? 'Disponible' : `Verrouillé · terminer le chapitre ${number - 1}`;
      const classes = ['campaign-chapter', canLaunch ? 'is-playable' : '', complete ? 'is-complete' : '', !unlocked ? 'is-locked' : '', !playable ? 'is-unavailable' : ''].filter(Boolean).join(' ');
      return `<article class="${classes}" data-open-chapter="${number}" role="button" tabindex="0" aria-haspopup="dialog" aria-label="Voir les détails du chapitre ${number} : ${title}${canLaunch ? '' : ', lancement indisponible'}"><span class="chapter-number">${String(number).padStart(2, '0')}</span><strong>${title}</strong><p>${description}</p><small>${status} · VOIR LES DÉTAILS</small></article>`;
    }).join('');
    const count = completedCampaignChapters.length;
    const next = nextCampaignChapter();
    $('campaignProgress').textContent = `36 chapitres prévus · 12 prototypes intégrés · ${count}/36 terminés`;
    $('campaignFinaleReplay').hidden = !campaignFullyComplete();
    $('campaignPlay').textContent = playableCampaignChapters.has(next)
      ? (completedCampaignChapters.includes(next) ? `REJOUER LE CHAPITRE ${next}` : `JOUER LE CHAPITRE ${next}`)
      : `CHAPITRE ${next} · À INTÉGRER`;
    $('campaignPlay').disabled = !playableCampaignChapters.has(next) || !chapterUnlocked(next);
    $('campaignPlay').dataset.chapter = String(next);
  }
  function openCampaign() {
    campaignFocusReturn = document.activeElement;
    campaignWasPaused = state.paused;
    renderCampaign();
    $('campaignOverlay').classList.add('active'); $('campaignOverlay').setAttribute('aria-hidden', 'false');
    if (!state.complete) setPaused(true);
    $('campaignClose').focus();
  }
  function closeCampaign() {
    $('campaignOverlay').classList.remove('active'); $('campaignOverlay').setAttribute('aria-hidden', 'true');
    if (!state.complete && !campaignWasPaused) setPaused(false);
    else lastFrame = performance.now();
    if (campaignFocusReturn?.focus) campaignFocusReturn.focus();
  }
  function openChapterLaunch(number, source = document.activeElement) {
    if (!Number.isInteger(number) || number < 1 || number > 36) return;
    const [title, description] = campaignChapters[number - 1];
    selectedCampaignChapter = number; chapterLaunchFocusReturn = source;
    $('chapterLaunchKicker').textContent = `CHAPITRE ${String(number).padStart(2, '0')} · ${title}`;
    $('chapterLaunchTitle').textContent = title;
    $('chapterLaunchDescription').textContent = description;
    const unlocked = chapterUnlocked(number);
    const playable = playableCampaignChapters.has(number);
    const canLaunch = unlocked && playable;
    $('chapterLaunchPlay').textContent = !playable ? 'CHAPITRE À INTÉGRER' : unlocked ? (completedCampaignChapters.includes(number) ? `REJOUER LE CHAPITRE ${number}` : `JOUER LE CHAPITRE ${number}`) : `VERROUILLÉ · TERMINER LE CHAPITRE ${number - 1}`;
    $('chapterLaunchPlay').disabled = !canLaunch;
    $('chapterLaunchKicker').textContent = `CHAPITRE ${String(number).padStart(2, '0')} · ${canLaunch ? 'DISPONIBLE' : !playable ? 'À INTÉGRER' : 'VERROUILLÉ'}`;
    $('chapterLaunchOverlay').classList.add('active'); $('chapterLaunchOverlay').setAttribute('aria-hidden', 'false');
    $('chapterLaunchClose').focus();
  }
  function closeChapterLaunch() {
    $('chapterLaunchOverlay').classList.remove('active'); $('chapterLaunchOverlay').setAttribute('aria-hidden', 'true');
    selectedCampaignChapter = 0;
    if (chapterLaunchFocusReturn?.focus) chapterLaunchFocusReturn.focus();
  }
  function launchSelectedChapter() {
    const chapter = selectedCampaignChapter;
    const canLaunch = playableCampaignChapters.has(chapter) && chapterUnlocked(chapter);
    closeChapterLaunch();
    if (!canLaunch) { renderCampaign(); return; }
    if (chapter === 1) location.href = 'v2-chapter01.html';
    else if (chapter === 2) location.href = 'v2-chapter02.html';
    else if (chapter === 3) location.href = 'v2-chapter03.html';
    else if (chapter === 4) location.href = 'v2-chapter04.html';
    else if (chapter === 5) location.href = 'v2-chapter05.html';
    else if (chapter === 6) location.href = 'v2-chapter06.html';
    else if (chapter === 7) location.href = 'v2-chapter07.html';
    else if (chapter === 8) location.href = 'v2-chapter08.html';
    else if (chapter === 9) location.href = 'v2-chapter09.html';
    else if (chapter === 10) location.href = 'v2-chapter10.html';
    else if (chapter === 11) location.href = 'v2-chapter11.html';
    else if (chapter === 12) location.href = 'v2-chapter12.html';
  }
  function playCampaignPrototype() {
    const chapter = nextCampaignChapter();
    closeCampaign();
    if (playableCampaignChapters.has(chapter) && chapterUnlocked(chapter)) {
      location.href = `v2-chapter${String(chapter).padStart(2, '0')}.html`;
    } else {
      openChapterLaunch(chapter, $('campaignPlay'));
    }
  }

  const finaleScenes = [
    { title: 'Au-delà du labyrinthe', text: 'Pour la première fois, aucun mur ne vous indique où aller. Devant vous, le monde est vaste — et la route n’est plus écrite d’avance.' },
    { title: 'Toutes les traces', text: 'Les détours, les erreurs, les refus et les gestes de confiance restent avec vous. Rien n’a été effacé : chaque choix a changé la manière dont vous vous regardez.' },
    { title: 'Ce que tu lui as appris', text: 'L’Autre a appris que t’aider ne signifie pas décider à ta place. Il peut proposer une route, attendre ta réponse, et accepter que tu choisisses autrement.' },
    { title: 'Ce qu’il t’a appris', text: 'Tu as découvert qu’une présence peut se tromper, douter, s’éloigner — puis revenir. La confiance n’était pas une porte à ouvrir, mais quelque chose à construire.' },
    { title: 'La suite vous appartient', text: 'Le labyrinthe se tait. L’Autre tourne la tête vers toi, sans ordre ni menace. « Cette fois, où allons-nous ? » La réponse, enfin, n’appartient qu’à vous.' }
  ];
  let finaleIndex = 0, finaleTimer = null, finalePaused = false, finaleFinished = false, finaleSoundOn = false, finaleAudio = null;
  const FINALE_SEEN_KEY = 'otherPlayerCampaignV2_finaleSeen';
  function campaignFullyComplete() {
    return completedCampaignChapters.length === 36 && Array.from({ length: 36 }, (_, i) => i + 1).every(n => completedCampaignChapters.includes(n));
  }
  function finaleBeep() {
    if (!finaleSoundOn) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      finaleAudio ||= new AudioContext();
      if (finaleAudio.state === 'suspended') finaleAudio.resume();
      const osc = finaleAudio.createOscillator(), gain = finaleAudio.createGain();
      osc.type = 'sine'; osc.frequency.value = [220, 277.18, 329.63, 440, 392][finaleIndex] || 330;
      gain.gain.setValueAtTime(.0001, finaleAudio.currentTime);
      gain.gain.exponentialRampToValueAtTime(.045, finaleAudio.currentTime + .12);
      gain.gain.exponentialRampToValueAtTime(.0001, finaleAudio.currentTime + 1.25);
      osc.connect(gain); gain.connect(finaleAudio.destination); osc.start(); osc.stop(finaleAudio.currentTime + 1.3);
    } catch {}
  }
  function stopFinaleTimer() { if (finaleTimer) clearTimeout(finaleTimer); finaleTimer = null; }
  function scheduleFinaleAdvance() {
    stopFinaleTimer();
    if (finalePaused || finaleFinished || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    finaleTimer = setTimeout(() => advanceFinale(), 6500);
  }
  function renderFinaleScene() {
    const scene = finaleScenes[finaleIndex];
    $('finaleScene').textContent = `ÉPILOGUE · ${String(finaleIndex + 1).padStart(2, '0')} / ${String(finaleScenes.length).padStart(2, '0')}`;
    $('finaleTitle').textContent = scene.title;
    $('finaleText').textContent = scene.text;
    $('finaleProgressBar').style.width = `${((finaleIndex + 1) / finaleScenes.length) * 100}%`;
    $('finaleNext').textContent = finaleIndex === finaleScenes.length - 1 ? 'TERMINER' : 'CONTINUER';
    $('finaleSkip').hidden = finaleIndex === finaleScenes.length - 1;
    finaleBeep(); scheduleFinaleAdvance();
  }
  function finishFinale() {
    stopFinaleTimer(); finaleFinished = true; finalePaused = true;
    try { localStorage.setItem(FINALE_SEEN_KEY, '1'); } catch {}
    $('finaleScene').textContent = 'FIN · CAMPAGNE TERMINÉE';
    $('finaleTitle').textContent = 'Le labyrinthe est derrière vous.';
    $('finaleText').textContent = '36 chapitres, une multitude de décisions, et une histoire qui vous appartient. Tu peux revoir cette cinématique à tout moment depuis la campagne.';
    $('finaleProgressBar').style.width = '100%';
    $('finalePause').hidden = true; $('finaleSound').hidden = true; $('finaleNext').hidden = true; $('finaleSkip').hidden = true;
    $('finaleReplay').hidden = false; $('finaleReturn').hidden = false;
    $('finaleReplay').focus();
  }
  function advanceFinale() {
    if (finaleFinished) return;
    if (finaleIndex >= finaleScenes.length - 1) { finishFinale(); return; }
    finaleIndex++; renderFinaleScene();
  }
  function closeCampaignIfOpen() {
    $('campaignOverlay').classList.remove('active'); $('campaignOverlay').setAttribute('aria-hidden', 'true');
    $('chapterLaunchOverlay').classList.remove('active'); $('chapterLaunchOverlay').setAttribute('aria-hidden', 'true');
  }
  function openFinale() {
    if (!campaignFullyComplete()) {
      openCampaign();
      toast('La cinématique finale se débloque après les 36 chapitres.', 3600);
      return;
    }
    closeCampaignIfOpen();
    finaleIndex = 0; finaleFinished = false;
    finalePaused = Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
    $('finalePause').hidden = false; $('finaleSound').hidden = false; $('finaleNext').hidden = false; $('finaleSkip').hidden = false;
    $('finaleReplay').hidden = true; $('finaleReturn').hidden = true;
    $('finalePause').textContent = finalePaused ? 'REPRENDRE' : 'METTRE EN PAUSE';
    $('finaleSound').textContent = finaleSoundOn ? 'SON : ON' : 'SON : OFF';
    $('finaleOverlay').classList.add('active'); $('finaleOverlay').setAttribute('aria-hidden', 'false');
    renderFinaleScene(); $('finaleNext').focus();
  }
  function closeFinaleToCampaign() {
    stopFinaleTimer(); $('finaleOverlay').classList.remove('active'); $('finaleOverlay').setAttribute('aria-hidden', 'true');
    if (location.hash === '#finale') history.replaceState(null, '', location.pathname + location.search);
    openCampaign();
  }

  function checksum(text) {
    let h = 2166136261;
    for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
    return (h >>> 0).toString(16).padStart(8, '0');
  }
  function passable(x, y, at = Date.now()) {
    const cx = Math.floor(x), cy = Math.floor(y);
    if (cx < 1 || cy < 1 || cx >= W - 1 || cy >= H - 1) return false;
    if (cx === exitBarrier.x && cy >= exitBarrier.y1 && cy <= exitBarrier.y2) return state.gateOpen;
    if (state.trapUntil > at && cx === trap.gateX && cy >= trap.gateY1 && cy <= trap.gateY2) return false;
    return grid[index(cx, cy)] === 0;
  }
  function validActorPosition(p) {
    const r = .22;
    return [[0, 0], [-r, 0], [r, 0], [0, -r], [0, r]].every(([dx, dy]) => passable(p.x + dx, p.y + dy));
  }
  function encodeSave() {
    const payload = JSON.stringify({ v: 1, player: state.player, other: state.other, command: state.command,
      gateOpen: state.gateOpen, trapSeen: state.trapSeen, playerRelayB: state.playerRelayB,
      separated: state.separated, separationActive: state.separationActive, reunited: state.reunited,
      refugeFound: state.refugeFound, relayMethod: state.relayMethod, exitOutcome: state.exitOutcome, complete: state.complete,
      explored: Array.from(state.explored), events: state.events.slice(-40) });
    return JSON.stringify({ version: 1, payload, checksum: checksum(payload) });
  }
  function decodeSave(raw) {
    try {
      const box = JSON.parse(raw);
      if (box?.version !== 1 || typeof box.payload !== 'string' || checksum(box.payload) !== box.checksum) return null;
      const data = JSON.parse(box.payload);
      if (data?.v !== 1 || !data.player || !data.other) return null;
      return data;
    } catch { return null; }
  }
  function readLocalSave(key) {
    try { const raw = localStorage.getItem(key); return raw ? decodeSave(raw) : null; } catch { return null; }
  }
  function loadSave() {
    const data = readLocalSave(SAVE_KEY) || readLocalSave(BACKUP_KEY);
    if (!data) return false;
    if (validActorPosition(data.player)) state.player = data.player;
    if (validActorPosition(data.other)) state.other = data.other;
    state.command = data.command === 'holdB' ? 'holdB' : 'follow';
    state.gateOpen = !!data.gateOpen;
    state.trapSeen = !!data.trapSeen;
    state.playerRelayB = !!data.playerRelayB;
    state.separated = !!data.separated;
    state.separationActive = !!data.separationActive;
    state.reunited = !!data.reunited;
    state.refugeFound = !!data.refugeFound;
    state.relayMethod = typeof data.relayMethod === 'string' ? data.relayMethod : '';
    state.exitOutcome = typeof data.exitOutcome === 'string' ? data.exitOutcome : '';
    state.complete = !!data.complete;
    if (Array.isArray(data.explored) && data.explored.length === W * H) state.explored = Uint8Array.from(data.explored, n => n ? 1 : 0);
    state.events = Array.isArray(data.events) ? data.events.slice(-40) : [];
    return true;
  }
  function save(force = false) {
    const now = Date.now();
    if (!force && now - state.lastSave < 1100) return;
    state.lastSave = now;
    try {
      const previous = localStorage.getItem(SAVE_KEY);
      if (previous && decodeSave(previous)) localStorage.setItem(BACKUP_KEY, previous);
      localStorage.setItem(SAVE_KEY, encodeSave());
    } catch { toast('Sauvegarde V2 indisponible dans ce navigateur.'); }
  }
  function remember(type) {
    state.events.push({ type, time: Date.now(), x: Math.round(state.player.x), y: Math.round(state.player.y) });
    if (state.events.length > 40) state.events.shift();
    save(true);
  }
  function toast(message, duration = 2600) {
    const el = $('toast'); el.textContent = message; el.classList.add('visible');
    state.toastUntil = performance.now() + duration;
  }
  function updateDrawer() {
    $('drawerObjective').textContent = state.complete ? 'Les deux relais ont été activés et la sortie a été franchie.' : $('objective').textContent;
    $('drawerObjectiveState').textContent = state.complete ? 'TERMINÉ' : state.gateOpen ? 'OBJECTIF ATTEINT · SORTIE OUVERTE' : 'EN COURS';
    $('drawerOtherStatus').textContent = $('otherStatus').textContent;
    $('drawerGateStatus').textContent = $('gateStatus').textContent;
    $('drawerJourney').textContent = state.complete ? `SORTIE : ${state.exitOutcome}` : state.separationActive ? 'PARCOURS : VOUS ÊTES SÉPARÉS' : state.reunited ? 'PARCOURS : RETROUVAILLES APRÈS LA SÉPARATION' : state.separated ? 'PARCOURS : VOUS AVEZ ÉTÉ SÉPARÉS' : 'PARCOURS : VOUS ÊTES RESTÉS ENSEMBLE';
    const explored = state.explored.reduce((total, cell) => total + cell, 0);
    $('drawerProgress').textContent = `CARTE : ${Math.round(explored / state.explored.length * 100)} % EXPLORÉE`;
  }
  function completionSummary() {
    const exitLine = state.exitOutcome === 'ENSEMBLE' ? 'Vous êtes sortis ensemble.' : 'Tu as franchi la sortie seul.';
    const separationLine = state.separationActive ? 'La dernière séparation est restée sans retrouvailles.' : state.reunited ? 'Vous vous êtes retrouvés après la séparation.' : state.separated ? 'L’Autre se souviendra de cette séparation.' : 'Vous êtes restés proches pendant le parcours.';
    return [exitLine, separationLine, state.refugeFound ? 'Tu as découvert le refuge caché.' : 'Le refuge facultatif reste inexploré.'].join(' ');
  }

  class MinHeap {
    constructor() { this.a = []; }
    push(item) {
      const a = this.a; a.push(item); let i = a.length - 1;
      while (i > 0) { const p = (i - 1) >> 1; if (a[p].f <= item.f) break; a[i] = a[p]; i = p; }
      a[i] = item;
    }
    pop() {
      const a = this.a, root = a[0], end = a.pop();
      if (a.length) { let i = 0; while (true) { let c = i * 2 + 1; if (c >= a.length) break; if (c + 1 < a.length && a[c + 1].f < a[c].f) c++; if (a[c].f >= end.f) break; a[i] = a[c]; i = c; } a[i] = end; }
      return root;
    }
    get length() { return this.a.length; }
  }
  const neighbors = [[1,0],[-1,0],[0,1],[0,-1]];
  function nearestFree(x, y) {
    const sx = Math.floor(x), sy = Math.floor(y);
    if (passable(sx + .5, sy + .5)) return index(sx, sy);
    for (let r = 1; r <= 5; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
      if (Math.abs(dx) !== r && Math.abs(dy) !== r) continue;
      const nx = sx + dx, ny = sy + dy;
      if (passable(nx + .5, ny + .5)) return index(nx, ny);
    }
    return -1;
  }
  function findPath(start, target) {
    const begin = nearestFree(start.x, start.y), goal = nearestFree(target.x, target.y);
    if (begin < 0 || goal < 0 || begin === goal) return [];
    const g = new Float32Array(W * H); g.fill(Infinity);
    const came = new Int32Array(W * H); came.fill(-1);
    const closed = new Uint8Array(W * H), open = new MinHeap();
    const gx = goal % W, gy = Math.floor(goal / W);
    const heuristic = (x, y) => Math.abs(x - gx) + Math.abs(y - gy);
    g[begin] = 0; open.push({ id: begin, f: heuristic(begin % W, Math.floor(begin / W)) });
    while (open.length) {
      const cur = open.pop(), id = cur.id;
      if (closed[id]) continue;
      if (id === goal) break;
      closed[id] = 1;
      const x = id % W, y = Math.floor(id / W);
      for (const [dx, dy] of neighbors) {
        const nx = x + dx, ny = y + dy, ni = index(nx, ny);
        if (!passable(nx + .5, ny + .5) || closed[ni]) continue;
        const score = g[id] + 1;
        if (score < g[ni]) { g[ni] = score; came[ni] = id; open.push({ id: ni, f: score + heuristic(nx, ny) }); }
      }
    }
    if (came[goal] < 0) return [];
    const path = []; for (let id = goal; id !== begin && id >= 0; id = came[id]) path.push({ x: id % W + .5, y: Math.floor(id / W) + .5 });
    path.reverse();
    return path;
  }

  class OtherAgent {
    update(dt) {
      pathTimer -= dt;
      const target = state.command === 'holdB' ? otherPlate : state.player;
      const targetKey = `${state.command}:${Math.floor(target.x)}:${Math.floor(target.y)}`;
      const distance = Math.hypot(target.x - state.other.x, target.y - state.other.y);
      if (state.command === 'holdB' && distance < .48) { otherPath = []; pathTimer = .2; return; }
      if (state.command === 'follow' && distance < 1.45) { otherPath = []; pathTimer = .16; return; }
      if (targetKey !== pathTarget || pathTimer <= 0 || !otherPath.length) {
        otherPath = findPath(state.other, target); pathTarget = targetKey; pathTimer = .55;
      }
      while (otherPath.length && Math.hypot(otherPath[0].x - state.other.x, otherPath[0].y - state.other.y) < .24) otherPath.shift();
      if (!otherPath.length) return;
      moveActor(state.other, otherPath[0].x - state.other.x, otherPath[0].y - state.other.y, 3.55 * dt);
    }
  }
  const otherAgent = new OtherAgent();

  function moveActor(actor, dx, dy, amount) {
    const mag = Math.hypot(dx, dy);
    if (mag > 1) { dx /= mag; dy /= mag; }
    const sx = dx * amount, sy = dy * amount, r = .22;
    const blocked = (x, y) => [[0,0],[-r,0],[r,0],[0,-r],[0,r]].some(([ox, oy]) => !passable(x + ox, y + oy));
    if (!blocked(actor.x + sx, actor.y)) actor.x += sx;
    if (!blocked(actor.x, actor.y + sy)) actor.y += sy;
  }
  function near(a, b, radius) { return Math.hypot(a.x - b.x, a.y - b.y) <= radius; }
  function interact() {
    if (state.paused || state.complete) return;
    if (state.gateOpen && near(state.player, exit, 1.4)) {
      toast('La sortie est ouverte. Tu peux la franchir quand tu le souhaites.');
    } else if (near(state.player, refuge, 1.7)) {
      if (state.separationActive && !state.refugeFound) {
        state.refugeFound = true; remember('found_refuge_during_separation');
        toast('Tu trouves un refuge caché. Une trace de l’Autre y était conservée.');
      } else if (state.refugeFound) toast('Le refuge garde la trace de votre séparation.');
      else toast('La pièce est calme. Le refuge ne se révèle que lorsque vous êtes séparés.');
    } else if (near(state.player, otherPlate, 1.45)) {
      if (state.gateOpen) toast('Le relais B a déjà contribué à ouvrir la sortie.');
      else {
        state.playerRelayB = !state.playerRelayB;
        remember(state.playerRelayB ? 'player_activated_relay_b_alone' : 'player_released_relay_b');
        toast(state.playerRelayB ? 'Relais B activé par toi. Rejoins le relais A pour ouvrir la sortie.' : 'Relais B relâché. Tu peux demander à l’Autre de l’activer.');
      }
    } else if (near(state.player, terminal, 2.15)) {
      if (state.command !== 'holdB') {
        state.command = 'holdB'; otherPath = []; pathTarget = '';
        remember('asked_other_to_hold_relay_b');
        $('otherStatus').textContent = 'L’AUTRE : REJOINT LE RELAIS B';
        toast('L’Autre a compris la demande. Il cherche un chemin vers le relais B.');
      } else {
        state.command = 'follow'; otherPath = []; pathTarget = '';
        remember('recalled_other');
        $('otherStatus').textContent = 'L’AUTRE : REVIENT VERS TOI';
        toast('Tu rappelles l’Autre. Le relais B n’est plus maintenu.');
      }
    } else if (near(state.player, playerPlate, 1.4)) {
      toast(state.playerRelayB ? 'Le relais B est mémorisé. Reste ici pour ouvrir la porte.' : 'Reste ici pendant que l’Autre tient B, ou active B toi-même dans l’aile est.');
    } else {
      toast('Cherche le terminal au carrefour pour confier une tâche à l’Autre.');
    }
  }

  function resize() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    viewW = Math.max(1, r.width); viewH = Math.max(1, r.height);
    const w = Math.round(viewW * dpr), h = Math.round(viewH * dpr);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    mapCanvas.width = Math.round(mapCanvas.clientWidth * dpr);
    mapCanvas.height = Math.round(mapCanvas.clientHeight * dpr);
    mapCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function reveal() {
    const revealFrom = (actor, radius) => {
      const ax = Math.floor(actor.x), ay = Math.floor(actor.y);
      for (let y = ay - radius; y <= ay + radius; y++) for (let x = ax - radius; x <= ax + radius; x++) {
        if (x > 0 && y > 0 && x < W - 1 && y < H - 1 && Math.hypot(x + .5 - actor.x, y + .5 - actor.y) <= radius) state.explored[index(x, y)] = 1;
      }
    };
    revealFrom(state.player, 8); revealFrom(state.other, 5);
  }
  function update(dt) {
    state.elapsed += dt;
    const frameDt = Math.min(dt, .05), steps = Math.max(1, Math.ceil(frameDt / .025));
    for (let i = 0; i < steps; i++) moveActor(state.player, input.x, input.y, 4.8 * frameDt / steps);
    if (!state.trapSeen && state.player.x > trap.triggerX && Math.abs(state.player.y - trap.triggerY) < 2.2) {
      state.trapSeen = true; state.trapUntil = Date.now() + trap.seconds * 1000;
      remember('warning_gate_trap'); toast('La porte se referme derrière toi. Le détour reste ouvert.');
    }
    if (state.trapUntil && state.trapUntil <= Date.now()) { state.trapUntil = 0; toast('La porte s’est rouverte.'); }
    otherAgent.update(frameDt);
    reveal();
    const separationDistance = Math.hypot(state.player.x - state.other.x, state.player.y - state.other.y);
    if (separationDistance > 12 && !state.separationActive) {
      const firstSeparation = !state.separated;
      state.separated = true; state.separationActive = true;
      remember(firstSeparation ? 'separation_started' : 'separation_repeated');
      toast('Vous êtes séparés. Le refuge de la galerie nord peut maintenant se révéler.');
    } else if (state.separationActive && separationDistance < 4) {
      state.separationActive = false; state.reunited = true; remember('reunited_after_separation');
      toast('Vous vous retrouvez. L’Autre a gardé la trace de ton retour.');
    }
    if (state.separationActive && !state.refugeFound && near(state.player, refuge, 1.5)) {
      state.refugeFound = true; remember('found_refuge_during_separation');
      toast('Le refuge se révèle. Une trace de l’Autre y était conservée.');
    }
    const onA = near(state.player, playerPlate, .62);
    const otherOnB = state.command === 'holdB' && near(state.other, otherPlate, .62);
    const onB = otherOnB || state.playerRelayB;
    if (state.playerRelayB && !otherOnB) $('otherStatus').textContent = 'RELAIS B : ACTIVÉ PAR TOI';
    else if (otherOnB) $('otherStatus').textContent = 'L’AUTRE : RELAIS B MAINTENU';
    else if (state.command === 'holdB') $('otherStatus').textContent = 'L’AUTRE : EN ROUTE VERS B';
    else if (near(state.player, state.other, 1.6)) $('otherStatus').textContent = 'L’AUTRE : AVEC TOI';
    else $('otherStatus').textContent = 'L’AUTRE : SÉPARÉ · IL TE CHERCHE';
    if (!state.gateOpen && onA && onB) {
      state.relayMethod = otherOnB ? 'COOPÉRATION' : 'SEUL';
      state.gateOpen = true; state.command = 'follow'; otherPath = []; pathTarget = '';
      remember(otherOnB ? 'cooperative_gate_opened' : 'solo_gate_opened'); $('gateStatus').textContent = 'PORTE : OUVERTE';
      toast(otherOnB ? 'Les deux relais sont actifs. La porte s’ouvre.' : 'Tu as activé les deux relais. La porte s’ouvre.');
    }
    if (state.gateOpen && near(state.player, exit, .8)) {
      state.complete = true; state.exitOutcome = near(state.player, state.other, 2.2) ? 'ENSEMBLE' : 'SEUL';
      remember(state.exitOutcome === 'ENSEMBLE' ? 'exited_together' : 'exited_alone'); remember('chapter6_prototype_complete');
      markCampaignChapterComplete(6);
      $('completeSummary').textContent = completionSummary();
      toast('Le chapitre prototype est terminé. Ton parcours a été mémorisé.', 9000);
      $('objective').textContent = 'CHAPITRE PROTOTYPE TERMINÉ · ENTRAIDE ET SÉPARATION ENREGISTRÉES';
      input = { x: 0, y: 0 }; held.clear();
      $('completeOverlay').classList.add('active'); $('completeOverlay').setAttribute('aria-hidden', 'false');
    }
    const trapActive = state.trapUntil > Date.now();
    $('gateStatus').textContent = state.gateOpen ? 'PORTE : OUVERTE' : trapActive ? 'PORTE : CYCLE ACTIF' : 'PORTE : VERROUILLÉE';
    hudTimer += frameDt;
    if (hudTimer >= .18) { hudTimer = 0; if (drawerOpen) updateDrawer(); }
    if (state.frame % 90 === 0) save();
    if (performance.now() > state.toastUntil) $('toast').classList.remove('visible');
  }

  const colors = { floor: '#11191d', wall: '#35454a', seenFloor: '#0a1013', seenWall: '#202d32' };
  function worldToScreen(x, y) { return { x: x * 22 - camera.x, y: y * 22 - camera.y }; }
  function drawActor(p, color, label, phase) {
    const q = worldToScreen(p.x, p.y), bob = Math.sin(state.elapsed * 3 + phase) * 1.4;
    ctx.beginPath(); ctx.arc(q.x, q.y + bob, 9, 0, Math.PI * 2); ctx.fillStyle = color + '30'; ctx.fill();
    ctx.beginPath(); ctx.arc(q.x, q.y + bob, 5.5, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();
    ctx.font = '600 10px system-ui'; ctx.textAlign = 'center'; ctx.fillStyle = color;
    ctx.fillText(label, q.x, q.y - 11 + bob);
  }
  function drawMap() {
    const cw = mapCanvas.clientWidth, ch = mapCanvas.clientHeight;
    if (!cw || mapCanvas.hidden) return;
    mapCtx.setTransform(dpr, 0, 0, dpr, 0, 0); mapCtx.fillStyle = '#071014'; mapCtx.fillRect(0, 0, cw, ch);
    const cell = Math.min(cw / W, ch / H), ox = (cw - W * cell) / 2, oy = (ch - H * cell) / 2;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (!state.explored[index(x, y)]) continue;
      mapCtx.fillStyle = grid[index(x, y)] ? '#5a6a6f' : '#15252a';
      mapCtx.fillRect(ox + x * cell, oy + y * cell, Math.ceil(cell), Math.ceil(cell));
    }
    for (const [a, color] of [[state.player, '#82edaa'], [state.other, '#ff8996']]) if (state.explored[index(Math.floor(a.x), Math.floor(a.y))]) {
      mapCtx.fillStyle = color; mapCtx.beginPath(); mapCtx.arc(ox + a.x * cell, oy + a.y * cell, Math.max(2, cell * .8), 0, Math.PI * 2); mapCtx.fill();
    }
  }
  function draw() {
    const width = viewW, height = viewH;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.fillStyle = '#05090c'; ctx.fillRect(0, 0, width, height);
    const tile = 22, worldW = W * tile, worldH = H * tile;
    camera.x = Math.max(0, Math.min(worldW - width, state.player.x * tile - width / 2));
    camera.y = Math.max(0, Math.min(worldH - height, state.player.y * tile - height / 2));
    const x0 = Math.max(0, Math.floor(camera.x / tile) - 1), x1 = Math.min(W - 1, Math.ceil((camera.x + width) / tile) + 1);
    const y0 = Math.max(0, Math.floor(camera.y / tile) - 1), y1 = Math.min(H - 1, Math.ceil((camera.y + height) / tile) + 1);
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const seen = state.explored[index(x, y)], pt = worldToScreen(x, y);
      ctx.fillStyle = seen ? (grid[index(x, y)] ? colors.wall : colors.floor) : '#05090c';
      ctx.fillRect(pt.x, pt.y, tile + .4, tile + .4);
      if (seen && !grid[index(x, y)]) { ctx.fillStyle = '#ffffff07'; ctx.fillRect(pt.x, pt.y, tile, 1); }
    }
    const activeTrap = state.trapUntil > Date.now();
    if (activeTrap) for (let y = trap.gateY1; y <= trap.gateY2; y++) {
      const q = worldToScreen(trap.gateX, y); ctx.fillStyle = '#db7f5a'; ctx.fillRect(q.x + 2, q.y + 2, tile - 4, tile - 4);
    }
    for (let y = exitBarrier.y1; y <= exitBarrier.y2; y++) {
      if (state.gateOpen) break;
      if (y === exitBarrier.doorY) continue;
      const q = worldToScreen(exitBarrier.x, y); ctx.fillStyle = '#526166'; ctx.fillRect(q.x, q.y, tile, tile);
    }
    const drawMarker = (p, color, text, radius = 8) => {
      const q = worldToScreen(p.x, p.y); ctx.beginPath(); ctx.arc(q.x, q.y, radius, 0, Math.PI * 2); ctx.fillStyle = color + '40'; ctx.fill();
      ctx.beginPath(); ctx.arc(q.x, q.y, radius * .55, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();
      if (text) { ctx.font = '700 9px system-ui'; ctx.textAlign = 'center'; ctx.fillStyle = color; ctx.fillText(text, q.x, q.y - 13); }
    };
    if (state.explored[index(Math.floor(terminal.x), Math.floor(terminal.y))]) drawMarker(terminal, '#91d8e0', 'E · RELAIS');
    if (state.explored[index(Math.floor(playerPlate.x), Math.floor(playerPlate.y))]) drawMarker(playerPlate, '#f3ce83', 'A');
    if (state.explored[index(Math.floor(otherPlate.x), Math.floor(otherPlate.y))]) drawMarker(otherPlate, '#f3ce83', state.playerRelayB || (state.command === 'holdB' && near(state.other, otherPlate, .62)) ? 'B · ACTIF' : 'B');
    if ((state.separationActive || state.refugeFound) && state.explored[index(Math.floor(refuge.x), Math.floor(refuge.y))]) drawMarker(refuge, '#91d8e0', state.refugeFound ? 'REFUGE · TRACE' : 'REFUGE', 7);
    if (state.explored[index(Math.floor(trap.triggerX), Math.floor(trap.triggerY))]) drawMarker(trap, '#f3aa7c', state.trapSeen ? 'PORTE' : 'ATTENTION', 7);
    if (state.explored[index(Math.floor(exit.x), Math.floor(exit.y))]) {
      const q = worldToScreen(exit.x, exit.y); ctx.strokeStyle = state.gateOpen ? '#82edaa' : '#76858a'; ctx.lineWidth = 3;
      ctx.strokeRect(q.x - 10, q.y - 13, 20, 26); ctx.font = '700 9px system-ui'; ctx.textAlign = 'center'; ctx.fillStyle = '#d5e0e0'; ctx.fillText('SORTIE', q.x, q.y + 24);
    }
    for (const room of rooms) {
      const cx = room.x + room.w / 2, cy = room.y + room.h / 2;
      if (!state.explored[index(Math.floor(cx), Math.floor(cy))]) continue;
      const q = worldToScreen(cx, cy); ctx.font = '600 8px system-ui'; ctx.textAlign = 'center'; ctx.fillStyle = '#aebdc044'; ctx.fillText(room.label, q.x, q.y);
    }
    drawActor(state.other, '#ff8996', 'L’AUTRE', 1); drawActor(state.player, '#82edaa', 'TOI', 0);
    const warning = activeTrap;
    if (warning) { const q = worldToScreen(trap.triggerX, trap.triggerY); ctx.strokeStyle = '#f3aa7c'; ctx.setLineDash([4, 4]); ctx.strokeRect(q.x - 12, q.y - 12, 24, 24); ctx.setLineDash([]); }
    drawMap();
  }

  function keyDown(e) {
    const k = e.key.toLowerCase();
    if (k === 'escape') {
      e.preventDefault();
      if ($('restartOverlay').classList.contains('active')) { cancelRestart(); return; }
      if ($('chapterLaunchOverlay').classList.contains('active')) { closeChapterLaunch(); return; }
      if ($('campaignOverlay').classList.contains('active')) { closeCampaign(); return; }
      if ($('introOverlay').classList.contains('active')) return;
      if (drawerOpen) setDrawer(false);
      else if ($('pauseOverlay').classList.contains('active')) setPaused(false);
      else if (!state.complete) togglePause();
      return;
    }
    if (state.paused || drawerOpen || state.complete) return;
    const keys = { arrowleft: [-1,0], a: [-1,0], q: [-1,0], arrowright: [1,0], d: [1,0],
      arrowup: [0,-1], w: [0,-1], z: [0,-1], arrowdown: [0,1], s: [0,1] };
    if (keys[k]) { e.preventDefault(); held.set(k, keys[k]); refreshInput(); }
    else if (k === 'e' || k === 'enter') { e.preventDefault(); interact(); }
    else if (k === 'p') togglePause();
  }
  const held = new Map();
  function refreshInput() {
    if (pointer !== null || held.size === 0) return;
    let x = 0, y = 0;
    for (const [dx, dy] of held.values()) { x += dx; y += dy; }
    const m = Math.hypot(x, y) || 1; input = { x: x / m, y: y / m };
  }
  function keyUp(e) { if (held.delete(e.key.toLowerCase())) { if (held.size) refreshInput(); else input = { x: 0, y: 0 }; } }
  function setPaused(paused) {
    state.paused = !!paused;
    $('pauseButton').textContent = state.paused ? 'REPRENDRE' : 'PAUSE';
    $('pauseButton').setAttribute('aria-pressed', String(state.paused));
    $('pauseOverlay').classList.toggle('active', state.paused);
    $('pauseOverlay').setAttribute('aria-hidden', String(!state.paused));
    if (state.paused) { held.clear(); releaseJoystick(); }
    lastFrame = performance.now();
  }
  function togglePause() { if (!drawerOpen && !state.complete) setPaused(!state.paused); }
  function setDrawer(open) {
    if (open === drawerOpen) return;
    drawerOpen = open;
    const drawer = $('sideDrawer'), scrim = $('drawerScrim');
    drawer.classList.toggle('open', open); scrim.classList.toggle('open', open);
    drawer.setAttribute('aria-hidden', String(!open)); scrim.setAttribute('aria-hidden', String(!open));
    $('menuButton').setAttribute('aria-expanded', String(open));
    if (open) {
      drawerWasPaused = state.paused;
      if (!state.paused) { state.paused = true; $('pauseButton').textContent = 'REPRENDRE'; $('pauseButton').setAttribute('aria-pressed', 'true'); }
      $('pauseOverlay').classList.remove('active'); $('pauseOverlay').setAttribute('aria-hidden', 'true');
      held.clear(); releaseJoystick(); updateDrawer(); lastFrame = performance.now();
      $('drawerClose').focus();
    } else {
      if (!drawerWasPaused && !state.complete) {
        state.paused = false; $('pauseButton').textContent = 'PAUSE'; $('pauseButton').setAttribute('aria-pressed', 'false');
        $('pauseOverlay').classList.remove('active'); $('pauseOverlay').setAttribute('aria-hidden', 'true');
      } else if (drawerWasPaused) {
        $('pauseOverlay').classList.add('active'); $('pauseOverlay').setAttribute('aria-hidden', 'false');
      }
      lastFrame = performance.now(); $('menuButton').focus();
    }
  }
  function toggleMap() {
    mapCanvas.hidden = !mapCanvas.hidden;
    $('mapToggle').setAttribute('aria-expanded', String(!mapCanvas.hidden));
    resize(); draw();
  }
  function restartPrototype() {
    restartWasPaused = state.paused;
    restartFocusReturn = document.activeElement;
    if (!state.paused && !state.complete) setPaused(true);
    $('restartOverlay').classList.add('active'); $('restartOverlay').setAttribute('aria-hidden', 'false');
    $('confirmRestart').focus();
  }
  function cancelRestart() {
    $('restartOverlay').classList.remove('active'); $('restartOverlay').setAttribute('aria-hidden', 'true');
    if (!state.complete && !restartWasPaused) setPaused(false);
    else lastFrame = performance.now();
    if (restartFocusReturn?.focus) restartFocusReturn.focus();
  }
  function confirmRestart() {
    try { localStorage.removeItem(SAVE_KEY); localStorage.removeItem(BACKUP_KEY); } catch {}
    $('restartOverlay').classList.remove('active'); $('restartOverlay').setAttribute('aria-hidden', 'true');
    state.player = { x: 7.5, y: 23.5 }; state.other = { x: 8.5, y: 25.5 };
    state.command = 'follow'; state.gateOpen = false; state.trapUntil = 0; state.trapSeen = false;
    state.playerRelayB = false; state.separated = false; state.separationActive = false; state.reunited = false;
    state.refugeFound = false; state.relayMethod = ''; state.exitOutcome = ''; state.complete = false;
    state.paused = true; state.explored.fill(0); state.events = []; state.lastSave = 0;
    state.elapsed = 0; state.frame = 0; state.toastUntil = 0;
    input = { x: 0, y: 0 }; held.clear(); releaseJoystick(); otherPath = []; pathTarget = ''; pathTimer = 0;
    drawerOpen = false; drawerWasPaused = false;
    $('sideDrawer').classList.remove('open'); $('sideDrawer').setAttribute('aria-hidden', 'true');
    $('drawerScrim').classList.remove('open'); $('drawerScrim').setAttribute('aria-hidden', 'true');
    $('menuButton').setAttribute('aria-expanded', 'false');
    $('pauseOverlay').classList.remove('active'); $('pauseOverlay').setAttribute('aria-hidden', 'true');
    $('completeOverlay').classList.remove('active'); $('completeOverlay').setAttribute('aria-hidden', 'true');
    $('campaignOverlay').classList.remove('active'); $('campaignOverlay').setAttribute('aria-hidden', 'true');
    $('mapToggle').setAttribute('aria-expanded', 'false'); mapCanvas.hidden = true;
    $('pauseButton').textContent = 'REPRENDRE'; $('pauseButton').setAttribute('aria-pressed', 'true');
    $('objective').textContent = 'Active les relais A et B : demande à l’Autre de tenir B ou active-le toi-même, puis rejoins A. La séparation peut révéler un refuge.';
    $('otherStatus').textContent = 'L’AUTRE : AVEC TOI'; $('gateStatus').textContent = 'PORTE : VERROUILLÉE';
    $('toast').classList.remove('visible');
    reveal(); updateDrawer(); showIntro(); draw();
  }
  function showIntro() {
    const hasProgress = state.events.length > 0 || state.gateOpen || state.complete;
    $('introMemory').textContent = hasProgress ? 'Une progression V2 est enregistrée sur cet appareil. La sauvegarde V1 reste séparée.' : 'Ta progression V2 est séparée de la sauvegarde V1.';
    $('startButton').textContent = state.complete ? 'RECOMMENCER LE PROTOTYPE' : hasProgress ? 'REPRENDRE LE PARCOURS' : 'COMMENCER';
    state.paused = true; $('pauseButton').textContent = 'REPRENDRE'; $('pauseButton').setAttribute('aria-pressed', 'true');
    $('pauseOverlay').classList.remove('active'); $('pauseOverlay').setAttribute('aria-hidden', 'true');
    $('introOverlay').classList.add('active'); $('introOverlay').setAttribute('aria-hidden', 'false');
    lastFrame = performance.now(); $('startButton').focus();
  }
  function enterPrototype() {
    if (!chapterUnlocked(6)) {
      openCampaign();
      toast('Le chapitre 6 est verrouillé : termine les chapitres précédents dans l’ordre.', 3800);
      return;
    }
    if (state.complete) { restartPrototype(); return; }
    $('introOverlay').classList.remove('active'); $('introOverlay').setAttribute('aria-hidden', 'true');
    state.paused = false; $('pauseButton').textContent = 'PAUSE'; $('pauseButton').setAttribute('aria-pressed', 'false');
    lastFrame = performance.now();
  }
  function joystickMove(e) {
    const joy = $('joystick'), r = joy.getBoundingClientRect(), max = r.width * .31;
    let dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2), d = Math.hypot(dx, dy);
    if (d > max) { dx *= max / d; dy *= max / d; }
    const nx = dx / max, ny = dy / max, dead = .12;
    input = { x: Math.abs(nx) < dead ? 0 : nx, y: Math.abs(ny) < dead ? 0 : ny };
    $('stick').style.transform = `translate(${dx}px,${dy}px)`;
  }
  function releaseJoystick() { pointer = null; input = { x: 0, y: 0 }; $('stick').style.transform = 'translate(0,0)'; if (held.size) refreshInput(); }

  loadSave();
  loadCampaignProgress();
  renderCampaign();
  reveal();
  resize();
  window.addEventListener('resize', resize, { passive: true });
  window.visualViewport?.addEventListener('resize', resize, { passive: true });
  window.addEventListener('keydown', keyDown);
  window.addEventListener('keyup', keyUp);
  window.addEventListener('blur', () => { held.clear(); releaseJoystick(); });
  $('interact').addEventListener('click', interact);
  $('pauseButton').addEventListener('click', togglePause);
  $('mapToggle').addEventListener('click', toggleMap);
  $('menuButton').addEventListener('click', () => setDrawer(true));
  $('drawerClose').addEventListener('click', () => setDrawer(false));
  $('drawerScrim').addEventListener('click', () => setDrawer(false));
  $('drawerResume').addEventListener('click', () => { setDrawer(false); setPaused(false); });
  $('drawerMap').addEventListener('click', () => { setDrawer(false); toggleMap(); });
  $('drawerPause').addEventListener('click', () => { setDrawer(false); setPaused(true); });
  $('drawerRestart').addEventListener('click', restartPrototype);
  $('drawerHome').addEventListener('click', () => { setDrawer(false); showIntro(); });
  $('drawerCampaign').addEventListener('click', openCampaign);
  $('resumeButton').addEventListener('click', () => setPaused(false));
  $('pauseMenuButton').addEventListener('click', () => setDrawer(true));
  $('startButton').addEventListener('click', enterPrototype);
  $('introCampaign').addEventListener('click', openCampaign);
  $('campaignFinaleReplay').addEventListener('click', openFinale);
  $('finaleNext').addEventListener('click', advanceFinale);
  $('finaleSkip').addEventListener('click', finishFinale);
  $('finalePause').addEventListener('click', () => {
    if (finaleFinished) return;
    finalePaused = !finalePaused;
    $('finalePause').textContent = finalePaused ? 'REPRENDRE' : 'METTRE EN PAUSE';
    if (finalePaused) stopFinaleTimer(); else scheduleFinaleAdvance();
  });
  $('finaleSound').addEventListener('click', () => {
    finaleSoundOn = !finaleSoundOn;
    $('finaleSound').textContent = finaleSoundOn ? 'SON : ON' : 'SON : OFF';
    $('finaleSound').setAttribute('aria-pressed', String(finaleSoundOn));
    if (finaleSoundOn) finaleBeep();
  });
  $('finaleReplay').addEventListener('click', openFinale);
  $('finaleReturn').addEventListener('click', closeFinaleToCampaign);
  $('finaleOverlay').addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.preventDefault(); if (finaleFinished) closeFinaleToCampaign(); else finishFinale(); }
    if (e.key === 'ArrowRight' && !finaleFinished) advanceFinale();
    if (e.key === ' ') { e.preventDefault(); $('finalePause').click(); }
  });
  $('campaignClose').addEventListener('click', closeCampaign);
  $('campaignBack').addEventListener('click', closeCampaign);
  $('campaignChapters').addEventListener('click', e => {
    const launch = e.target.closest('[data-open-chapter]');
    if (launch) openChapterLaunch(Number(launch.dataset.openChapter), launch);
  });
  $('campaignChapters').addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const launch = e.target.closest('[data-open-chapter]');
    if (!launch) return;
    e.preventDefault(); openChapterLaunch(Number(launch.dataset.openChapter), launch);
  });
  $('campaignPlay').addEventListener('click', () => openChapterLaunch(Number($('campaignPlay').dataset.chapter || 1), $('campaignPlay')));
  $('chapterLaunchPlay').addEventListener('click', launchSelectedChapter);
  $('chapterLaunchClose').addEventListener('click', closeChapterLaunch);
  $('chapterLaunchOverlay').addEventListener('click', e => { if (e.target === $('chapterLaunchOverlay')) closeChapterLaunch(); });
  $('chapterLaunchOverlay').addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const items = [...$('chapterLaunchOverlay').querySelectorAll('button:not([disabled]),a[href]')];
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  $('completeCampaign').addEventListener('click', openCampaign);
  $('campaignOverlay').addEventListener('keydown', e => {
    if ($('chapterLaunchOverlay').classList.contains('active')) return;
    if (e.key !== 'Tab') return;
    const items = [...$('campaignOverlay').querySelectorAll('button:not([disabled]),a[href]')];
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  $('confirmRestart').addEventListener('click', confirmRestart);
  $('cancelRestart').addEventListener('click', cancelRestart);
  $('restartOverlay').addEventListener('click', e => { if (e.target === $('restartOverlay')) cancelRestart(); });
  $('restartOverlay').addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const items = [...$('restartOverlay').querySelectorAll('button:not([disabled]),a[href]')];
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  $('completeClose').addEventListener('click', restartPrototype);
  $('reset').addEventListener('click', restartPrototype);
  $('sideDrawer').addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const items = [...$('sideDrawer').querySelectorAll('button:not([disabled]),a[href]')];
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  const joy = $('joystick');
  joy.addEventListener('pointerdown', e => { if (state.paused || drawerOpen || state.complete) return; pointer = e.pointerId; joy.setPointerCapture(e.pointerId); joystickMove(e); });
  joy.addEventListener('pointermove', e => { if (e.pointerId === pointer) joystickMove(e); });
  joy.addEventListener('pointerup', releaseJoystick);
  joy.addEventListener('pointercancel', releaseJoystick);
  document.addEventListener('visibilitychange', () => { if (document.hidden) { held.clear(); releaseJoystick(); save(true); } });
  if (state.gateOpen) $('gateStatus').textContent = 'PORTE : OUVERTE';
  if (state.complete) {
    $('objective').textContent = 'CHAPITRE PROTOTYPE TERMINÉ · ENTRAIDE ET SÉPARATION ENREGISTRÉES';
    $('completeSummary').textContent = completionSummary();
    $('completeOverlay').classList.add('active'); $('completeOverlay').setAttribute('aria-hidden', 'false');
  }
  if (state.events.length) toast('Progression du prototype restaurée. La sauvegarde V1 est séparée.');
  showIntro();
  if (location.hash === '#campagne') openCampaign();
  if (location.hash === '#finale') { if (campaignFullyComplete()) openFinale(); else { openCampaign(); toast('La cinématique finale reste verrouillée jusqu’à la fin des 36 chapitres.', 4200); } }

  function frame(now) {
    requestAnimationFrame(frame);
    if (!lastFrame) lastFrame = now;
    const dt = Math.min(.1, Math.max(0, (now - lastFrame) / 1000)); lastFrame = now;
    if (!state.paused && !state.complete) { state.frame++; update(dt); }
    draw();
  }
  requestAnimationFrame(frame);

  // Read-only snapshot used for local prototype verification.
  window.v2PrototypeSnapshot = () => ({
    width: W, height: H, player: { ...state.player }, other: { ...state.other },
    command: state.command, gateOpen: state.gateOpen, complete: state.complete,
    playerRelayB: state.playerRelayB, separated: state.separated, reunited: state.reunited,
    refugeFound: state.refugeFound, relayMethod: state.relayMethod, exitOutcome: state.exitOutcome,
    trapSeen: state.trapSeen, completedCampaignChapters: [...completedCampaignChapters],
    explored: state.explored.reduce((a, b) => a + b, 0),
    eventTypes: state.events.map(e => e.type), otherPathLength: otherPath.length
  });
})();
