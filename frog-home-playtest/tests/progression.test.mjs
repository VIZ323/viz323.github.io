import test from "node:test";
import assert from "node:assert/strict";

import {
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
    version: 3,
    fireflies: 20,
    missionCursor: 0,
    seenSinkingTutorial: false,
  });
});

test("新版存档不会重复获得已下线皮肤退款", () => {
  const profile = normalizeProfile({
    version: 3,
    fireflies: 20,
    unlockedSkins: ["berry", "moon"],
    missionCursor: 3,
    seenSinkingTutorial: true,
  });
  assert.deepEqual(profile, {
    version: 3,
    fireflies: 20,
    missionCursor: 3,
    seenSinkingTutorial: true,
  });
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
