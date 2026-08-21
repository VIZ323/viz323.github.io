export const PHYSICS = Object.freeze({
  maxChargeMs: 1250,
  minJumpDistance: 86,
  maxJumpDistance: 455,
  minJumpDurationMs: 520,
  maxJumpDurationMs: 790,
});

export function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export function chargeFromDuration(durationMs, maxChargeMs = PHYSICS.maxChargeMs) {
  if (!Number.isFinite(durationMs) || durationMs <= 0) return 0;
  return clamp(durationMs / maxChargeMs);
}

export function jumpDistanceFromCharge(charge) {
  const normalized = clamp(charge);
  const responsiveCurve = Math.pow(normalized, 0.84);
  return PHYSICS.minJumpDistance
    + (PHYSICS.maxJumpDistance - PHYSICS.minJumpDistance) * responsiveCurve;
}

export function jumpDurationFromDistance(distance) {
  const normalized = clamp(
    (distance - PHYSICS.minJumpDistance)
      / (PHYSICS.maxJumpDistance - PHYSICS.minJumpDistance),
  );
  return PHYSICS.minJumpDurationMs
    + (PHYSICS.maxJumpDurationMs - PHYSICS.minJumpDurationMs) * normalized;
}

export function directionBetween(from, to) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy) || 1;
  return { x: dx / length, y: dy / length };
}

export function pointOnJump(start, direction, distance, progress, arcHeight) {
  const t = clamp(progress);
  const arc = 4 * arcHeight * t * (1 - t);
  return {
    x: start.x + direction.x * distance * t,
    y: start.y + direction.y * distance * t + arc,
  };
}

export function landingError(point, platform) {
  return Math.hypot(point.x - platform.x, point.y - platform.y);
}

export function didLand(point, platform, tolerance = platform.radius * 0.86) {
  return landingError(point, platform) <= tolerance;
}
