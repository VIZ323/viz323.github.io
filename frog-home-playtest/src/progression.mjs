export const PROFILE_STORAGE_KEY = "frog-home-profile-v1";

export const SKINS = Object.freeze([
  {
    id: "leaf",
    name: "荷叶绿",
    cost: 0,
    colors: {
      limb: "#4c953d",
      foot: "#72b94b",
      bodyTop: "#91ce55",
      bodyBottom: "#5bab45",
      brow: "#a5dc68",
      mouth: "#28523e",
      blush: "rgba(248, 134, 133, 0.62)",
    },
  },
  {
    id: "berry",
    name: "莓果粉",
    cost: 8,
    colors: {
      limb: "#b95f79",
      foot: "#dc8196",
      bodyTop: "#f2abb8",
      bodyBottom: "#d66f8b",
      brow: "#ffc2ca",
      mouth: "#6f3f52",
      blush: "rgba(255, 224, 164, 0.72)",
    },
  },
  {
    id: "moon",
    name: "月光蓝",
    cost: 20,
    colors: {
      limb: "#3e8990",
      foot: "#66b2b4",
      bodyTop: "#9bd6d2",
      bodyBottom: "#4fa0a8",
      brow: "#b8e8df",
      mouth: "#24555d",
      blush: "rgba(245, 157, 171, 0.62)",
    },
  },
]);

export const MISSIONS = Object.freeze([
  { id: "reach-5", type: "steps", target: 5, reward: 2, label: "前进 5 步" },
  { id: "perfect-2", type: "perfect", target: 2, reward: 3, label: "精准落地 2 次" },
  { id: "reach-10", type: "steps", target: 10, reward: 4, label: "抵达 10 步荷叶" },
]);

export function createDefaultProfile() {
  return {
    version: 1,
    fireflies: 0,
    unlockedSkins: ["leaf"],
    selectedSkin: "leaf",
    missionCursor: 0,
  };
}

export function normalizeProfile(value) {
  const fallback = createDefaultProfile();
  if (!value || typeof value !== "object" || Array.isArray(value)) return fallback;
  const knownSkinIds = new Set(SKINS.map((skin) => skin.id));
  const unlockedSkins = Array.isArray(value.unlockedSkins)
    ? [...new Set(value.unlockedSkins.filter((id) => knownSkinIds.has(id)))]
    : [];
  if (!unlockedSkins.includes("leaf")) unlockedSkins.unshift("leaf");
  const selectedSkin = unlockedSkins.includes(value.selectedSkin)
    ? value.selectedSkin
    : "leaf";
  return {
    version: 1,
    fireflies: Number.isFinite(value.fireflies)
      ? Math.max(0, Math.floor(value.fireflies))
      : 0,
    unlockedSkins,
    selectedSkin,
    missionCursor: Number.isFinite(value.missionCursor)
      ? Math.max(0, Math.floor(value.missionCursor))
      : 0,
  };
}

export function skinById(id) {
  return SKINS.find((skin) => skin.id === id) ?? SKINS[0];
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
