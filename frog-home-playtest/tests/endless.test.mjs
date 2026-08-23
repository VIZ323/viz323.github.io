import test from "node:test";
import assert from "node:assert/strict";
import {
  ENDLESS,
  difficultyForStep,
  generatePlatforms,
  landingToleranceFactorForStep,
  landingToleranceForPlatform,
  rhythmForStep,
  specialKindForStep,
} from "../src/endless.mjs";

test("相同种子会生成完全相同的无尽荷塘", () => {
  assert.deepEqual(generatePlatforms(80, 20260822), generatePlatforms(80, 20260822));
});

test("连续生成两千片荷叶仍然可达且不会越过屏幕边缘", () => {
  const platforms = generatePlatforms(2000, 666);
  for (let index = 1; index < platforms.length; index += 1) {
    const previous = platforms[index - 1];
    const current = platforms[index];
    const distance = Math.hypot(current.x - previous.x, current.y - previous.y);
    assert.ok(distance >= 150, `第 ${index} 跳距离过短：${distance}`);
    assert.ok(distance <= 417, `第 ${index} 跳距离过远：${distance}`);
    assert.ok(current.y > previous.y, `第 ${index} 片荷叶没有向前推进`);
    assert.ok(current.x >= current.radius + ENDLESS.edgePadding);
    assert.ok(current.x <= ENDLESS.width - current.radius - ENDLESS.edgePadding);
  }
});

test("每十步都会出现一片更宽容的休息荷叶", () => {
  const platforms = generatePlatforms(101, 42);
  for (let step = 10; step <= 100; step += 10) {
    assert.equal(platforms[step].kind, "rest");
    assert.ok(platforms[step].radius >= 90);
  }
});

test("下沉荷叶按固定节奏出现，不覆盖休息荷叶", () => {
  assert.equal(specialKindForStep(8), "sinking");
  assert.equal(specialKindForStep(18), "sinking");
  assert.equal(specialKindForStep(30), "rest");

  const platforms = generatePlatforms(50, 20260823);
  assert.equal(platforms[8].kind, "sinking");
  assert.equal(platforms[18].kind, "sinking");
  assert.equal(platforms[30].kind, "rest");
});

test("前七十步难度平滑提高，之后按波次安排恢复段", () => {
  const checkpoints = [1, 5, 10, 20, 40, 70].map(difficultyForStep);
  for (let index = 1; index < checkpoints.length; index += 1) {
    assert.ok(checkpoints[index].minDistance > checkpoints[index - 1].minDistance);
    assert.ok(checkpoints[index].maxDistance > checkpoints[index - 1].maxDistance);
    assert.ok(checkpoints[index].minRadius < checkpoints[index - 1].minRadius);
    assert.ok(checkpoints[index].maxRadius < checkpoints[index - 1].maxRadius);
  }
  assert.ok(difficultyForStep(71).minRadius < difficultyForStep(86).minRadius);
  assert.ok(difficultyForStep(71).minDistance > difficultyForStep(86).minDistance);
});

test("普通荷叶落脚容错平滑收紧，休息荷叶始终宽容", () => {
  assert.ok(landingToleranceFactorForStep(5) > landingToleranceFactorForStep(15));
  assert.ok(landingToleranceFactorForStep(15) > landingToleranceFactorForStep(35));
  assert.ok(landingToleranceFactorForStep(35) > landingToleranceFactorForStep(55));
  assert.ok(landingToleranceFactorForStep(55) > landingToleranceFactorForStep(75));
  assert.equal(landingToleranceFactorForStep(80), 0.9);
  assert.equal(landingToleranceForPlatform({ radius: 100, step: 75 }), 68);
});

test("开局保留短跳、长跳和缓冲节奏，之后逐渐增加随机性", () => {
  assert.equal(rhythmForStep(1).name, "起步");
  assert.equal(rhythmForStep(3).name, "伸展");
  assert.equal(rhythmForStep(4).name, "缓一缓");
  assert.equal(rhythmForStep(9).name, "压轴");
  assert.equal(rhythmForStep(10).name, "歇脚");
  assert.equal(rhythmForStep(11).name, "起步");

  const platforms = generatePlatforms(71, 20260823);
  const distance = (step) => {
    const current = platforms[step];
    const previous = platforms[step - 1];
    return Math.hypot(current.x - previous.x, current.y - previous.y);
  };
  assert.ok(distance(3) > distance(1));
  assert.ok(distance(9) > distance(6));

  const rankPattern = (start) => Array.from({ length: 9 }, (_, index) => index + 1)
    .sort((left, right) => distance(start + left) - distance(start + right));
  assert.notDeepEqual(rankPattern(10), rankPattern(30));
  assert.notDeepEqual(rankPattern(30), rankPattern(50));
});

test("前期平均间距更近，后期平均间距和变化幅度都会增加", () => {
  const samples = Array.from({ length: 30 }, (_, seed) => generatePlatforms(71, seed + 1));
  const distancesForRange = (start, end) => samples.flatMap((platforms) => {
    const values = [];
    for (let step = start; step <= end; step += 1) {
      if (step % ENDLESS.restInterval === 0) continue;
      const current = platforms[step];
      const previous = platforms[step - 1];
      values.push(Math.hypot(current.x - previous.x, current.y - previous.y));
    }
    return values;
  });
  const stats = (values) => {
    const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
    const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
    return { mean, deviation: Math.sqrt(variance) };
  };
  const early = stats(distancesForRange(1, 10));
  const middle = stats(distancesForRange(31, 40));
  const late = stats(distancesForRange(61, 70));

  assert.ok(early.mean < middle.mean);
  assert.ok(middle.mean < late.mean);
  assert.ok(early.deviation < middle.deviation);
  assert.ok(middle.deviation < late.deviation);
});
