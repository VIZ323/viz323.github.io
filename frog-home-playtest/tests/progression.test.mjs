import test from "node:test";
import assert from "node:assert/strict";

import {
  feedbackForMiss,
  milestoneRewardForStep,
  missionForCursor,
  normalizeProfile,
  progressForMission,
} from "../src/progression.mjs";

test("移除皮肤后，旧存档会退回已解锁皮肤消耗的萤火虫", () => {
  const profile = normalizeProfile({
    version: 1,
    fireflies: 12.8,
    unlockedSkins: ["berry", "unknown", "berry"],
    selectedSkin: "unknown",
    missionCursor: -3,
  });
  assert.deepEqual(profile, { version: 2, fireflies: 20, missionCursor: 0 });
});

test("新版存档不会重复获得已下线皮肤退款", () => {
  const profile = normalizeProfile({
    version: 2,
    fireflies: 20,
    unlockedSkins: ["berry", "moon"],
    missionCursor: 3,
  });
  assert.deepEqual(profile, { version: 2, fireflies: 20, missionCursor: 3 });
});

test("三种局内目标会循环出现并正确计算进度", () => {
  assert.equal(missionForCursor(0).id, "reach-5");
  assert.equal(missionForCursor(3).id, "reach-5");
  assert.equal(progressForMission(missionForCursor(0), { steps: 3, perfectCount: 0 }), 3);
  assert.equal(progressForMission(missionForCursor(1), { steps: 8, perfectCount: 4 }), 2);
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
