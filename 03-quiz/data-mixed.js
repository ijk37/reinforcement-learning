// ============================================================================
//  data-mixed.js — cumulative mixed quizzes (loaded LAST, samples the pools)
//  Each attempt draws a random subset (see QUIZ_CONFIG) from these combined
//  pools, with options reshuffled every render.
// ============================================================================

const _chapterKeys = Object.keys(QUESTIONS).filter((k) => /^\d\d$/.test(k));

// Mixed 1 — Foundations & Tabular (chapters 1–8)
QUESTIONS["mixed-1"] = ["01", "02", "03", "04", "05", "06", "07", "08"]
  .flatMap((id) => QUESTIONS[id] || []);

// Mixed 2 — Approximation & Beyond (chapters 9–17)
QUESTIONS["mixed-2"] = ["09", "10", "11", "12", "13", "14", "15", "16", "17"]
  .flatMap((id) => QUESTIONS[id] || []);

// Mixed 3 — Full Book Review (all chapters)
QUESTIONS["mixed-3"] = _chapterKeys.flatMap((id) => QUESTIONS[id] || []);
