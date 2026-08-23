export const SPECIALS = Object.freeze({
  sinkingGraceMs: 1650,
  springJumpMultiplier: 1.16,
  feverTrigger: 3,
  feverJumps: 3,
  feverToleranceMultiplier: 1.18,
});

export function jumpMultiplierForPlatform(platform) {
  return platform?.kind === "spring" ? SPECIALS.springJumpMultiplier : 1;
}

export function landingToleranceWithFever(tolerance, feverActive) {
  const safeTolerance = Number.isFinite(tolerance) ? Math.max(0, tolerance) : 0;
  return feverActive
    ? safeTolerance * SPECIALS.feverToleranceMultiplier
    : safeTolerance;
}

export function sinkingProgress(startedAt, now, graceMs = SPECIALS.sinkingGraceMs) {
  if (!Number.isFinite(startedAt) || startedAt <= 0) return 0;
  if (!Number.isFinite(now) || now <= startedAt) return 0;
  return Math.min(1, Math.max(0, (now - startedAt) / Math.max(1, graceMs)));
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
