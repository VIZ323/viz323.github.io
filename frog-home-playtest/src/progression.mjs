import { t } from "./i18n.mjs";

export const PROFILE_STORAGE_KEY = "frog-home-profile-v1";

const RETIRED_SKIN_REFUNDS = Object.freeze({ berry: 8, moon: 20 });
const NEW_PLAYER_ENCOURAGEMENT_KEYS = Object.freeze([
  "record.new.0",
  "record.new.1",
  "record.new.2",
]);
const RECORD_ENCOURAGEMENT_KEYS = Object.freeze([
  "record.encouragement.0",
  "record.encouragement.1",
  "record.encouragement.2",
  "record.encouragement.3",
  "record.encouragement.4",
  "record.encouragement.5",
]);

export const NEW_PLAYER_ENCOURAGEMENT_COUNT = NEW_PLAYER_ENCOURAGEMENT_KEYS.length;
export const RECORD_ENCOURAGEMENT_COUNT = RECORD_ENCOURAGEMENT_KEYS.length;

export const MISSIONS = Object.freeze([
  { id: "reach-5", type: "steps", target: 5, reward: 2, labelKey: "mission.reach5" },
  { id: "perfect-2", type: "perfect", target: 2, reward: 3, labelKey: "mission.perfect2" },
  { id: "reach-10", type: "steps", target: 10, reward: 4, labelKey: "mission.reach10" },
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
    return t(NEW_PLAYER_ENCOURAGEMENT_KEYS[variant % NEW_PLAYER_ENCOURAGEMENT_COUNT]);
  }
  const encouragement = t(RECORD_ENCOURAGEMENT_KEYS[variant % RECORD_ENCOURAGEMENT_COUNT]);
  return t("record.challenge", { best, target: best + 1, encouragement });
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
      title: t("feedback.shortTitle"),
      message: t("feedback.shortMessage"),
    };
  }
  return {
    kind: "long",
    title: t("feedback.longTitle"),
    message: t("feedback.longMessage"),
  };
}
