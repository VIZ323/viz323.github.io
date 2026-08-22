import test from "node:test";
import assert from "node:assert/strict";
import {
  ENDLESS,
  difficultyForStep,
  generatePlatforms,
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
    assert.ok(distance <= 372, `第 ${index} 跳距离过远：${distance}`);
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

test("前六十步难度逐段提高，之后按波次安排恢复段", () => {
  assert.ok(difficultyForStep(1).maxDistance < difficultyForStep(31).maxDistance);
  assert.ok(difficultyForStep(1).minRadius > difficultyForStep(31).minRadius);
  assert.ok(difficultyForStep(61).minRadius < difficultyForStep(76).minRadius);
  assert.ok(difficultyForStep(61).minDistance > difficultyForStep(76).minDistance);
});
