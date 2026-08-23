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

test("下沉荷叶和弹力荷花按固定节奏出现，不覆盖休息荷叶", () => {
  assert.equal(specialKindForStep(8), "sinking");
  assert.equal(specialKindForStep(18), "sinking");
  assert.equal(specialKindForStep(15), "spring");
  assert.equal(specialKindForStep(45), "spring");
  assert.equal(specialKindForStep(30), "rest");

  const platforms = generatePlatforms(50, 20260823);
  assert.equal(platforms[8].kind, "sinking");
  assert.equal(platforms[15].kind, "spring");
  assert.equal(platforms[18].kind, "sinking");
  assert.equal(platforms[30].kind, "rest");
});

test("前七十步难度逐段提高，之后按波次安排恢复段", () => {
  assert.ok(difficultyForStep(1).maxDistance < difficultyForStep(21).maxDistance);
  assert.ok(difficultyForStep(1).minRadius > difficultyForStep(21).minRadius);
  assert.ok(difficultyForStep(21).maxDistance < difficultyForStep(41).maxDistance);
  assert.ok(difficultyForStep(21).minRadius > difficultyForStep(41).minRadius);
  assert.ok(difficultyForStep(71).minRadius < difficultyForStep(86).minRadius);
  assert.ok(difficultyForStep(71).minDistance > difficultyForStep(86).minDistance);
});

test("普通荷叶落脚容错逐段收紧，休息荷叶始终宽容", () => {
  assert.ok(landingToleranceFactorForStep(5) > landingToleranceFactorForStep(15));
  assert.ok(landingToleranceFactorForStep(15) > landingToleranceFactorForStep(35));
  assert.ok(landingToleranceFactorForStep(35) > landingToleranceFactorForStep(55));
  assert.ok(landingToleranceFactorForStep(55) > landingToleranceFactorForStep(75));
  assert.equal(landingToleranceFactorForStep(80), 0.9);
  assert.equal(landingToleranceForPlatform({ radius: 100, step: 75 }), 68);
});

test("每十步形成短跳、长跳、缓冲和压轴的固定节奏", () => {
  assert.equal(rhythmForStep(1).name, "起步");
  assert.equal(rhythmForStep(3).name, "伸展");
  assert.equal(rhythmForStep(4).name, "缓一缓");
  assert.equal(rhythmForStep(9).name, "压轴");
  assert.equal(rhythmForStep(10).name, "歇脚");
  assert.equal(rhythmForStep(11).name, "起步");

  const platforms = generatePlatforms(31, 20260823);
  for (let block = 0; block < 3; block += 1) {
    const start = block * 10;
    const distance = (step) => {
      const current = platforms[start + step];
      const previous = platforms[start + step - 1];
      return Math.hypot(current.x - previous.x, current.y - previous.y);
    };
    assert.ok(distance(3) > distance(1));
    assert.ok(distance(9) > distance(6));
  }
});
