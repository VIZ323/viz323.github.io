function shiftedTimestamp(value, pauseDuration) {
  return Number.isFinite(value) && value > 0 ? value + pauseDuration : value;
}

export function pauseDurationBetween(pausedAt, resumedAt) {
  if (!Number.isFinite(pausedAt) || !Number.isFinite(resumedAt)) return 0;
  return Math.max(0, resumedAt - pausedAt);
}

export function shiftPauseSensitiveTimers(game, pauseDuration) {
  const duration = Number.isFinite(pauseDuration) ? Math.max(0, pauseDuration) : 0;
  if (!game || duration === 0) return 0;

  for (const key of ["runStartedAt", "chargeStartedAt", "sinkingStartedAt"]) {
    game[key] = shiftedTimestamp(game[key], duration);
  }
  if (game.jump) game.jump.startedAt = shiftedTimestamp(game.jump.startedAt, duration);
  if (game.landing) game.landing.startedAt = shiftedTimestamp(game.landing.startedAt, duration);
  for (const platform of game.platforms ?? []) {
    platform.sinkingStartedAt = shiftedTimestamp(platform.sinkingStartedAt, duration);
    platform.sinkingDepartedAt = shiftedTimestamp(platform.sinkingDepartedAt, duration);
  }
  return duration;
}
