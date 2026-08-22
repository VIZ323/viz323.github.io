export const ENDLESS = Object.freeze({
  width: 750,
  edgePadding: 34,
  previewCount: 7,
  restInterval: 10,
});

export function createSeededRandom(seed = Date.now()) {
  let state = Number(seed) >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function difficultyForStep(step) {
  const normalizedStep = Math.max(1, Math.floor(step));
  if (normalizedStep <= 10) {
    return { minDistance: 190, maxDistance: 270, minRadius: 82, maxRadius: 94 };
  }
  if (normalizedStep <= 30) {
    return { minDistance: 220, maxDistance: 310, minRadius: 74, maxRadius: 88 };
  }
  if (normalizedStep <= 60) {
    return { minDistance: 250, maxDistance: 345, minRadius: 66, maxRadius: 82 };
  }
  const wave = (normalizedStep - 61) % 20;
  const recovery = wave >= 15;
  return recovery
    ? { minDistance: 230, maxDistance: 315, minRadius: 72, maxRadius: 86 }
    : { minDistance: 270, maxDistance: 370, minRadius: 60, maxRadius: 78 };
}

const RHYTHM = Object.freeze([
  { name: "起步", minBias: 0.06, maxBias: 0.28, radiusOffset: 5 },
  { name: "顺跳", minBias: 0.28, maxBias: 0.52, radiusOffset: 2 },
  { name: "伸展", minBias: 0.68, maxBias: 0.9, radiusOffset: 0 },
  { name: "缓一缓", minBias: 0.08, maxBias: 0.3, radiusOffset: 6 },
  { name: "踩稳", minBias: 0.42, maxBias: 0.64, radiusOffset: -4 },
  { name: "轻点", minBias: 0.02, maxBias: 0.22, radiusOffset: 4 },
  { name: "远跳", minBias: 0.75, maxBias: 0.96, radiusOffset: -1 },
  { name: "顺跳", minBias: 0.3, maxBias: 0.58, radiusOffset: 1 },
  { name: "压轴", minBias: 0.82, maxBias: 1, radiusOffset: -5 },
  { name: "歇脚", minBias: 0.12, maxBias: 0.42, radiusOffset: 8 },
]);

export function rhythmForStep(step) {
  const normalizedStep = Math.max(1, Math.floor(step));
  return RHYTHM[(normalizedStep - 1) % RHYTHM.length];
}

export function createStartPlatform() {
  return { x: 150, y: 170, radius: 87, kind: "start", step: 0 };
}

function between(random, min, max) {
  return min + (max - min) * random();
}

export class EndlessGenerator {
  constructor(seed = Date.now()) {
    this.random = createSeededRandom(seed);
  }

  next(previous, step) {
    const difficulty = difficultyForStep(step);
    const isRest = step % ENDLESS.restInterval === 0;
    const rhythm = rhythmForStep(step);
    const radius = isRest
      ? between(this.random, 90, 96)
      : between(this.random, difficulty.minRadius, difficulty.maxRadius) + rhythm.radiusOffset;
    const distanceRange = difficulty.maxDistance - difficulty.minDistance;
    const distance = isRest
      ? between(this.random, Math.max(195, difficulty.minDistance - 35), Math.min(295, difficulty.maxDistance))
      : between(
        this.random,
        difficulty.minDistance + distanceRange * rhythm.minBias,
        difficulty.minDistance + distanceRange * rhythm.maxBias,
      );
    const minX = radius + ENDLESS.edgePadding;
    const maxX = ENDLESS.width - radius - ENDLESS.edgePadding;
    const horizontal = between(this.random, distance * 0.34, distance * 0.72);
    let direction = this.random() < 0.5 ? -1 : 1;

    if (previous.x < ENDLESS.width * 0.31) direction = 1;
    if (previous.x > ENDLESS.width * 0.69) direction = -1;

    let x = previous.x + direction * horizontal;
    if (x < minX || x > maxX) x = previous.x - direction * horizontal;
    x = Math.min(maxX, Math.max(minX, x));
    const dx = x - previous.x;
    const yAdvance = Math.sqrt(Math.max(120 * 120, distance * distance - dx * dx));
    const flowerRoll = this.random();
    const kind = isRest
      ? "rest"
      : step % 7 === 0 || flowerRoll < 0.18
        ? "flower"
        : radius < 71
          ? "small"
          : "plain";

    return {
      x: Math.round(x),
      y: Math.round(previous.y + yAdvance),
      radius: Math.round(radius),
      kind,
      step,
      rhythm: rhythm.name,
    };
  }
}

export function generatePlatforms(count, seed = 1) {
  const generator = new EndlessGenerator(seed);
  const platforms = [createStartPlatform()];
  while (platforms.length < count) {
    const previous = platforms[platforms.length - 1];
    platforms.push(generator.next(previous, previous.step + 1));
  }
  return platforms;
}
