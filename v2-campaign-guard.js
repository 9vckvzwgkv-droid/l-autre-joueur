/* V2 campaign progression guard. V1 files and save keys are untouched. */
(() => {
  'use strict';
  const KEY = 'otherPlayerCampaignV2_1';
  function readCompleted() {
    try {
      const data = JSON.parse(localStorage.getItem(KEY) || '{}');
      if (data.version === 1 && Array.isArray(data.completed)) {
        return [...new Set(data.completed.filter(n => Number.isInteger(n) && n >= 1 && n <= 36))];
      }
    } catch {}
    return [];
  }
  function writeCompleted(completed) {
    try { localStorage.setItem(KEY, JSON.stringify({ version: 1, completed: [...new Set(completed)].sort((a, b) => a - b) })); }
    catch { return false; }
    return true;
  }
  /* Shared by chapter completion handlers. A chapter cannot be recorded out of order. */
  window.v2MarkCampaignChapterComplete = function (chapter) {
    if (!Number.isInteger(chapter) || chapter < 1 || chapter > 36) return false;
    const completed = readCompleted();
    if (completed.includes(chapter)) return true;
    if (chapter > 1 && !completed.includes(chapter - 1)) return false;
    completed.push(chapter);
    if (!writeCompleted(completed)) return false;
    if (completed.length === 36 && Array.from({ length: 36 }, (_, i) => i + 1).every(n => completed.includes(n))) {
      location.replace('v2-prototype.html#finale');
    }
    return true;
  };

  const match = location.pathname.match(/v2-chapter(\d{2})\.html$/i);
  if (!match) return;
  const chapter = Number(match[1]);
  if (!Number.isInteger(chapter) || chapter < 1 || chapter > 36) return;
  const completed = readCompleted();
  const unlocked = chapter === 1 || completed.includes(chapter) || completed.includes(chapter - 1);
  if (!unlocked) location.replace('v2-prototype.html#campagne');
})();
