export const PROFILE_STORAGE_KEY = "frog-home-profile-v1";

const RETIRED_SKIN_REFUNDS = Object.freeze({ berry: 8, moon: 20 });
const NEW_PLAYER_ENCOURAGEMENTS = Object.freeze([
  "还没有历史纪录 · 本局先到 5 步，留下你的第一项纪录！",
  "第一次挑战 · 先稳稳跳过 5 步，你会越跳越顺！",
  "新的荷塘正在等你 · 从 5 步开始写下自己的纪录！",
]);
const RECORD_ENCOURAGEMENTS = Object.freeze([
  "超越昨天的自己！",
  "再向前一步，就是新的纪录！",
  "稳住节奏，这次一定能更远！",
  "每一跳都算数，向新纪录出发！",
  "比上次多一步，就是一次胜利！",
  "保持手感，把极限再推远一点！",
]);

export const NEW_PLAYER_ENCOURAGEMENT_COUNT = NEW_PLAYER_ENCOURAGEMENTS.length;
export const RECORD_ENCOURAGEMENT_COUNT = RECORD_ENCOURAGEMENTS.length;

export const MISSIONS = Object.freeze([
  { id: "reach-5", type: "steps", target: 5, reward: 2, label: "前进 5 步" },
  { id: "perfect-2", type: "perfect", target: 2, reward: 3, label: "精准落地 2 次" },
  { id: "reach-10", type: "steps", target: 10, reward: 4, label: "抵达 10 步荷叶" },
]);

export function createDefaultProfile() {
  return {
    version: 3,
    fireflies: 0,
    missionCursor: 0,
    seenSinkingTutorial: false,
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
    version: 3,
    fireflies: (Number.isFinite(value.fireflies)
      ? Math.max(0, Math.floor(value.fireflies))
      : 0) + legacyRefund,
    missionCursor: Number.isFinite(value.missionCursor)
      ? Math.max(0, Math.floor(value.missionCursor))
      : 0,
    seenSinkingTutorial: value.seenSinkingTutorial === true,
  };
}

export function missionForCursor(cursor) {
  const normalizedCursor = Number.isFinite(cursor) ? Math.max(0, Math.floor(cursor)) : 0;
  return MISSIONS[normalizedCursor % MISSIONS.length];
}

export function recordChallengeForBest(bestScore, variantIndex = 0) {
  const best = Number.isFinite(bestScore) ? Math.max(0, Math.floor(bestScore)) : 0;
  const variant = Number.isFinite(variantIndex) ? Math.max(0, Math.floor(variantIndex)) : 0;
  if (best === 0) {
    return NEW_PLAYER_ENCOURAGEMENTS[variant % NEW_PLAYER_ENCOURAGEMENT_COUNT];
  }
  const encouragement = RECORD_ENCOURAGEMENTS[variant % RECORD_ENCOURAGEMENT_COUNT];
  return `历史最佳 ${best} 步 · 本局冲击 ${best + 1} 步，${encouragement}`;
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
