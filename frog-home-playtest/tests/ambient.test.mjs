import test from "node:test";
import assert from "node:assert/strict";
import { AMBIENT_SWIMMERS, swimmerPoseAtTime } from "../src/ambient.mjs";

test("荷塘中会同时出现两条小鱼和一只小虾", () => {
  assert.equal(AMBIENT_SWIMMERS.length, 3);
  assert.equal(AMBIENT_SWIMMERS.filter(({ kind }) => kind === "fish").length, 2);
  assert.equal(AMBIENT_SWIMMERS.filter(({ kind }) => kind === "shrimp").length, 1);
});

test("鱼虾位置只随时间连续变化，不依赖青蛙落地步数", () => {
  for (const swimmer of AMBIENT_SWIMMERS) {
    const before = swimmerPoseAtTime(swimmer, 5000);
    const after = swimmerPoseAtTime(swimmer, 5016);
    assert.ok(Math.abs(after.x - before.x) < 1);
    assert.ok(Math.abs(after.y - before.y) < 2);
    assert.ok(Math.abs(after.rotation - before.rotation) < 0.01);
  }
});

test("三只鱼虾拥有不同泳道、速度和方向", () => {
  assert.equal(new Set(AMBIENT_SWIMMERS.map(({ laneY }) => laneY)).size, 3);
  assert.equal(new Set(AMBIENT_SWIMMERS.map(({ speed }) => speed)).size, 3);
  assert.deepEqual(
    new Set(AMBIENT_SWIMMERS.map(({ direction }) => direction)),
    new Set([1, -1]),
  );
});
