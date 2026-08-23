export const AMBIENT_SWIMMERS = Object.freeze([
  Object.freeze({
    kind: "fish",
    speed: 0.032,
    laneY: 300,
    amplitude: 22,
    waveSpeed: 0.0026,
    phase: 0.4,
    offset: 40,
    direction: 1,
    scale: 0.92,
    alpha: 0.34,
    body: "#5f9f7c",
    fin: "#86b997",
  }),
  Object.freeze({
    kind: "fish",
    speed: 0.023,
    laneY: 610,
    amplitude: 34,
    waveSpeed: 0.0018,
    phase: 2.3,
    offset: 390,
    direction: -1,
    scale: 0.72,
    alpha: 0.28,
    body: "#4f8f91",
    fin: "#7eb6ae",
  }),
  Object.freeze({
    kind: "shrimp",
    speed: 0.018,
    laneY: 820,
    amplitude: 27,
    waveSpeed: 0.0022,
    phase: 4.6,
    offset: 680,
    direction: 1,
    scale: 0.78,
    alpha: 0.3,
    body: "#d58f7d",
    fin: "#edb09c",
  }),
]);

export function swimmerPoseAtTime(swimmer, time, width = 750) {
  const safeTime = Number.isFinite(time) ? Math.max(0, time) : 0;
  const laneLength = width + 220;
  const travel = (safeTime * swimmer.speed + swimmer.offset) % laneLength;
  const x = swimmer.direction > 0
    ? -110 + travel
    : width + 110 - travel;
  const wave = Math.sin(safeTime * swimmer.waveSpeed + swimmer.phase);
  return {
    x,
    y: swimmer.laneY + wave * swimmer.amplitude,
    rotation: wave * 0.06,
    direction: swimmer.direction,
    scale: swimmer.scale,
  };
}
