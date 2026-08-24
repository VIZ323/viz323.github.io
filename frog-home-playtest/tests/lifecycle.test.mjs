import test from "node:test";
import assert from "node:assert/strict";
import { pauseDurationBetween, shiftPauseSensitiveTimers } from "../src/lifecycle.mjs";

test("后台停留时间只计算有效的正向时间", () => {
  assert.equal(pauseDurationBetween(1000, 4600), 3600);
  assert.equal(pauseDurationBetween(4600, 1000), 0);
  assert.equal(pauseDurationBetween(Number.NaN, 1000), 0);
});

test("恢复前台时所有游戏计时锚点一起顺延", () => {
  const game = {
    runStartedAt: 100,
    chargeStartedAt: 0,
    sinkingStartedAt: 220,
    jump: { startedAt: 300 },
    landing: { startedAt: 400 },
    platforms: [
      { sinkingStartedAt: 500, sinkingDepartedAt: 0 },
      { sinkingStartedAt: 0, sinkingDepartedAt: 650 },
    ],
  };

  assert.equal(shiftPauseSensitiveTimers(game, 2000), 2000);
  assert.equal(game.runStartedAt, 2100);
  assert.equal(game.chargeStartedAt, 0);
  assert.equal(game.sinkingStartedAt, 2220);
  assert.equal(game.jump.startedAt, 2300);
  assert.equal(game.landing.startedAt, 2400);
  assert.equal(game.platforms[0].sinkingStartedAt, 2500);
  assert.equal(game.platforms[1].sinkingDepartedAt, 2650);
});

test("重复暂停事件不会在零时长时改变计时", () => {
  const game = { runStartedAt: 100, platforms: [] };
  assert.equal(shiftPauseSensitiveTimers(game, 0), 0);
  assert.equal(game.runStartedAt, 100);
});
