export const PROFILE_STORAGE_KEY = "frog-home-profile-v1";

const RETIRED_SKIN_REFUNDS = Object.freeze({ berry: 8, moon: 20 });

export const MISSIONS = Object.freeze([
  { id: "reach-5", type: "steps", target: 5, reward: 2, label: "前进 5 步" },
  { id: "perfect-2", type: "perfect", target: 2, reward: 3, label: "精准落地 2 次" },
  { id: "reach-10", type: "steps", target: 10, reward: 4, label: "抵达 10 步荷叶" },
]);

export function createDefaultProfile() {
  return {
    version: 2,
    fireflies: 0,
    missionCursor: 0,
  };
}

export function normalizeProfile(value) {
  const fallback = createDefaultProfile();
  if (!value || typeof value !== "object" || Array.isArray(value)) return fallback;
  const legacyRefund = value.version === 1 && Array.isArray(value.unlockedSkins)
    ? [...new Set(value.unlockedSkins)].reduce(
      (total, id) => total + (RETIRED_SKIN_REFUNDS[id] ?? 0),
      0,
    )
    : 0;
  return {
    version: 2,
    fireflies: (Number.isFinite(value.fireflies)
      ? Math.max(0, Math.floor(value.fireflies))
      : 0) + legacyRefund,
    missionCursor: Number.isFinite(value.missionCursor)
      ? Math.max(0, Math.floor(value.missionCursor))
      : 0,
  };
}

export function missionForCursor(cursor) {
  const normalizedCursor = Number.isFinite(cursor) ? Math.max(0, Math.floor(cursor)) : 0;
  return MISSIONS[normalizedCursor % MISSIONS.length];
}

export function progressForMission(mission, stats) {
  if (!mission) return 0;
  const value = mission.type === "perfect" ? stats.perfectCount : stats.steps;
  return Math.min(mission.target, Math.max(0, Math.floor(value || 0)));
}

export function milestoneRewardForStep(step) {
  return step > 0 && step % 10 === 0 ? 3 : 0;
}

export function feedbackForMiss(jumpDistance, targetDistance) {
  if (jumpDistance < targetDistance) {
    return {
      kind: "short",
      title: "力度偏小",
      message: "下次再多按一会儿，就能踩到荷叶啦。",
    };
  }
  return {
    kind: "long",
    title: "力度偏大",
    message: "下次早一点松开，会更容易踩稳。",
  };
}
