import test from "node:test";
import assert from "node:assert/strict";
import {
  PHYSICS,
  chargeFromJumpDistance,
  chargeFromDuration,
  chargeWindowForLanding,
  didLand,
  directionBetween,
  jumpDistanceFromCharge,
  pointOnJump,
} from "../src/physics.mjs";

test("蓄力时间会被限制在 0 到 1", () => {
  assert.equal(chargeFromDuration(-5), 0);
  assert.equal(chargeFromDuration(0), 0);
  assert.equal(chargeFromDuration(PHYSICS.maxChargeMs), 1);
  assert.equal(chargeFromDuration(PHYSICS.maxChargeMs * 2), 1);
});

test("蓄力越久，跳跃距离越远", () => {
  const short = jumpDistanceFromCharge(0.2);
  const medium = jumpDistanceFromCharge(0.5);
  const long = jumpDistanceFromCharge(0.9);
  assert.ok(short < medium);
  assert.ok(medium < long);
});

test("距离可以换算回对应的蓄力比例", () => {
  for (const charge of [0, 0.15, 0.42, 0.76, 1]) {
    const distance = jumpDistanceFromCharge(charge);
    assert.ok(Math.abs(chargeFromJumpDistance(distance) - charge) < 0.000001);
  }
});

test("落点蓄力提示区间会覆盖目标中心", () => {
  const targetDistance = 280;
  const window = chargeWindowForLanding(targetDistance, 60);
  const center = chargeFromJumpDistance(targetDistance);
  assert.ok(window.min < center);
  assert.ok(window.max > center);
  assert.ok(window.min >= 0);
  assert.ok(window.max <= 1);
});

test("跳跃方向自动指向下一片荷叶", () => {
  const direction = directionBetween({ x: 0, y: 0 }, { x: 3, y: 4 });
  assert.equal(direction.x, 0.6);
  assert.equal(direction.y, 0.8);
});

test("抛物线起点终点准确，中途高于直线路径", () => {
  const start = { x: 10, y: 20 };
  const direction = { x: 1, y: 0 };
  assert.deepEqual(pointOnJump(start, direction, 100, 0, 50), start);
  assert.deepEqual(pointOnJump(start, direction, 100, 1, 50), { x: 110, y: 20 });
  assert.ok(pointOnJump(start, direction, 100, 0.5, 50).y > 20);
});

test("只有落点进入荷叶容错范围才算成功", () => {
  const platform = { x: 100, y: 100, radius: 50 };
  assert.equal(didLand({ x: 100, y: 100 }, platform), true);
  assert.equal(didLand({ x: 140, y: 100 }, platform), true);
  assert.equal(didLand({ x: 150, y: 100 }, platform), false);
});
