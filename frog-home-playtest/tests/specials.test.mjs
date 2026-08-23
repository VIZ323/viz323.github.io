import test from "node:test";
import assert from "node:assert/strict";

import {
  SPECIALS,
  advancePrecisionState,
  departureProgress,
  landingToleranceWithFever,
  sinkingProgress,
} from "../src/specials.mjs";

test("萤火连跳会适度放宽落脚范围", () => {
  assert.equal(landingToleranceWithFever(80, false), 80);
  assert.equal(landingToleranceWithFever(80, true), 80 * SPECIALS.feverToleranceMultiplier);
});

test("下沉荷叶倒计时会稳定限制在零到一", () => {
  assert.equal(sinkingProgress(1000, 900), 0);
  assert.equal(sinkingProgress(1000, 1000 + SPECIALS.sinkingDelayMs), 0);
  assert.equal(
    sinkingProgress(1000, 1000 + (SPECIALS.sinkingDelayMs + SPECIALS.sinkingTotalMs) / 2),
    0.5,
  );
  assert.equal(sinkingProgress(1000, 1000 + SPECIALS.sinkingTotalMs), 1);
});

test("青蛙起跳后下沉荷叶会在短时间内完全消失", () => {
  assert.equal(departureProgress(2000, 2000), 0);
  assert.equal(departureProgress(2000, 2000 + SPECIALS.sinkingDepartFadeMs / 2), 0.5);
  assert.equal(departureProgress(2000, 2000 + SPECIALS.sinkingDepartFadeMs), 1);
});

test("连续三次精准落地会触发三跳萤火连跳", () => {
  const state = advancePrecisionState({ combo: 2, feverJumps: 0, perfect: true, feverAtLaunch: false });
  assert.deepEqual(state, { combo: 0, feverJumps: 3, activated: true });
});

test("萤火连跳每起跳一次消耗一格，普通落地会中断精准计数", () => {
  const state = advancePrecisionState({ combo: 1, feverJumps: 3, perfect: false, feverAtLaunch: true });
  assert.deepEqual(state, { combo: 0, feverJumps: 2, activated: false });
});
