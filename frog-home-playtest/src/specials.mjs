export const SPECIALS = Object.freeze({
  sinkingDelayMs: 500,
  sinkingTotalMs: 2300,
  sinkingDepartFadeMs: 480,
  feverTrigger: 3,
  feverJumps: 3,
  feverToleranceMultiplier: 1.18,
});

export function landingToleranceWithFever(tolerance, feverActive) {
  const safeTolerance = Number.isFinite(tolerance) ? Math.max(0, tolerance) : 0;
  return feverActive
    ? safeTolerance * SPECIALS.feverToleranceMultiplier
    : safeTolerance;
}

export function sinkingProgress(
  startedAt,
  now,
  delayMs = SPECIALS.sinkingDelayMs,
  totalMs = SPECIALS.sinkingTotalMs,
) {
  if (!Number.isFinite(startedAt) || startedAt <= 0) return 0;
  if (!Number.isFinite(now) || now <= startedAt + delayMs) return 0;
  const sinkingDuration = Math.max(1, totalMs - delayMs);
  return Math.min(1, Math.max(0, (now - startedAt - delayMs) / sinkingDuration));
}

export function departureProgress(departedAt, now, durationMs = SPECIALS.sinkingDepartFadeMs) {
  if (!Number.isFinite(departedAt) || departedAt <= 0) return 0;
  if (!Number.isFinite(now) || now <= departedAt) return 0;
  return Math.min(1, Math.max(0, (now - departedAt) / Math.max(1, durationMs)));
}

export function advancePrecisionState({ combo, feverJumps, perfect, feverAtLaunch }) {
  let nextCombo = perfect ? Math.max(0, combo) + 1 : 0;
  let nextFeverJumps = Math.max(0, feverJumps) - (feverAtLaunch ? 1 : 0);
  nextFeverJumps = Math.max(0, nextFeverJumps);
  let activated = false;

  if (perfect && nextCombo >= SPECIALS.feverTrigger && nextFeverJumps === 0) {
    nextCombo = 0;
    nextFeverJumps = SPECIALS.feverJumps;
    activated = true;
  }

  return {
    combo: nextCombo,
    feverJumps: nextFeverJumps,
    activated,
  };
}
