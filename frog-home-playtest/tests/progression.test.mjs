import test from "node:test";
import assert from "node:assert/strict";

import {
  FIREFLY_RESCUE_COST,
  canSpendFireflies,
  NEW_PLAYER_ENCOURAGEMENT_COUNT,
  RECORD_ENCOURAGEMENT_COUNT,
  feedbackForMiss,
  milestoneRewardForStep,
  missionForCursor,
  normalizeProfile,
  progressForMission,
  recordChallengeForBest,
} from "../src/progression.mjs";

test("移除皮肤后，旧存档会退回已解锁皮肤消耗的萤火虫", () => {
  const profile = normalizeProfile({
    version: 1,
    fireflies: 12.8,
    unlockedSkins: ["berry", "unknown", "berry"],
    selectedSkin: "unknown",
    missionCursor: -3,
  });
  assert.deepEqual(profile, {
    version: 4,
    fireflies: 20,
    missionCursor: 0,
    seenSinkingTutorial: false,
    settings: { sound: true, haptics: true },
  });
});

test("新版存档不会重复获得已下线皮肤退款", () => {
  const profile = normalizeProfile({
    version: 4,
    fireflies: 20,
    unlockedSkins: ["berry", "moon"],
    missionCursor: 3,
    seenSinkingTutorial: true,
    settings: { sound: true, haptics: true },
  });
  assert.deepEqual(profile, {
    version: 4,
    fireflies: 20,
    missionCursor: 3,
    seenSinkingTutorial: true,
    settings: { sound: true, haptics: true },
  });
});

test("旧存档默认开启音效和触感，设置关闭后可以保留", () => {
  assert.deepEqual(normalizeProfile({ version: 3 }).settings, {
    sound: true,
    haptics: true,
  });
  assert.deepEqual(normalizeProfile({
    version: 4,
    settings: { sound: false, haptics: false },
  }).settings, {
    sound: false,
    haptics: false,
  });
});

test("萤火虫余额必须达到救援费用才能使用", () => {
  assert.equal(FIREFLY_RESCUE_COST, 8);
  assert.equal(canSpendFireflies(7, FIREFLY_RESCUE_COST), false);
  assert.equal(canSpendFireflies(8, FIREFLY_RESCUE_COST), true);
  assert.equal(canSpendFireflies(20, FIREFLY_RESCUE_COST), true);
});

test("三种局内目标会循环出现并正确计算进度", () => {
  assert.equal(missionForCursor(0).id, "reach-5");
  assert.equal(missionForCursor(3).id, "reach-5");
  assert.equal(progressForMission(missionForCursor(0), { steps: 3, perfectCount: 0 }), 3);
  assert.equal(progressForMission(missionForCursor(1), { steps: 8, perfectCount: 4 }), 2);
});

test("首页目标会结合历史最佳鼓励玩家突破纪录", () => {
  assert.equal(
    recordChallengeForBest(0),
    "还没有历史纪录 · 本局先到 5 步，留下你的第一项纪录！",
  );
  assert.equal(
    recordChallengeForBest(25),
    "历史最佳 25 步 · 本局冲击 26 步，超越昨天的自己！",
  );
  assert.equal(
    recordChallengeForBest(8.9),
    "历史最佳 8 步 · 本局冲击 9 步，超越昨天的自己！",
  );
  const newPlayerCopies = Array.from(
    { length: NEW_PLAYER_ENCOURAGEMENT_COUNT },
    (_, index) => recordChallengeForBest(0, index),
  );
  const recordCopies = Array.from(
    { length: RECORD_ENCOURAGEMENT_COUNT },
    (_, index) => recordChallengeForBest(25, index),
  );
  assert.equal(new Set(newPlayerCopies).size, 3);
  assert.equal(new Set(recordCopies).size, 6);
  assert.ok(recordCopies.every((copy) => copy.includes("历史最佳 25 步 · 本局冲击 26 步")));
  assert.equal(
    recordChallengeForBest(25, RECORD_ENCOURAGEMENT_COUNT),
    recordChallengeForBest(25, 0),
  );
});

test("每十步发放阶段奖励，普通步数不发放", () => {
  assert.equal(milestoneRewardForStep(9), 0);
  assert.equal(milestoneRewardForStep(10), 3);
  assert.equal(milestoneRewardForStep(20), 3);
});

test("落水反馈能区分力度偏小和偏大", () => {
  assert.equal(feedbackForMiss(180, 240).kind, "short");
  assert.equal(feedbackForMiss(310, 240).kind, "long");
});
