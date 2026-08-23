import {
  chargeWindowForLanding,
  chargeFromDuration,
  didLand,
  directionBetween,
  jumpDistanceFromCharge,
  jumpDurationFromDistance,
  landingError,
  pointOnJump,
} from "./physics.mjs";
import { TinyAudio } from "./audio.mjs";
import { cameraFollowSpeedForState, cameraTargetForWorldY } from "./camera.mjs";
import { track } from "./analytics.mjs";
import {
  ENDLESS,
  EndlessGenerator,
  createStartPlatform,
  landingToleranceForPlatform,
} from "./endless.mjs";
import {
  PROFILE_STORAGE_KEY,
  feedbackForMiss,
  milestoneRewardForStep,
  missionForCursor,
  normalizeProfile,
  progressForMission,
} from "./progression.mjs";
import {
  SPECIALS,
  advancePrecisionState,
  departureProgress,
  landingToleranceWithFever,
  sinkingProgress,
} from "./specials.mjs";

const VIEW = { width: 750, height: 1334, baselineY: 1015 };
const FROG_COLORS = Object.freeze({
  limb: "#4c953d",
  foot: "#72b94b",
  bodyTop: "#91ce55",
  bodyBottom: "#5bab45",
  brow: "#a5dc68",
  mouth: "#28523e",
  blush: "rgba(248, 134, 133, 0.62)",
});

const SCENES = Object.freeze([
  {
    name: "晨雾荷塘",
    top: "#dff4da",
    middle: "#c4e9d9",
    bottom: "#80c9bd",
    glow: "rgba(255, 250, 204, 0.7)",
    plant: "#5c9870",
  },
  {
    name: "晴光水湾",
    top: "#d8f1dd",
    middle: "#aee0d2",
    bottom: "#65bcb5",
    glow: "rgba(255, 239, 167, 0.78)",
    plant: "#4c916c",
  },
  {
    name: "晚霞芦荡",
    top: "#fae3bd",
    middle: "#d6dcb9",
    bottom: "#79b8ad",
    glow: "rgba(255, 209, 132, 0.7)",
    plant: "#638f67",
  },
  {
    name: "月光荷塘",
    top: "#a9c8c7",
    middle: "#82b6b3",
    bottom: "#4f9694",
    glow: "rgba(255, 249, 211, 0.72)",
    plant: "#477b68",
  },
]);

function sceneForSteps(steps) {
  return SCENES[Math.floor(Math.max(0, steps) / 15) % SCENES.length];
}

const DIFFICULTY_NOTICES = Object.freeze({
  10: "热身结束 · 后面的荷叶会更远",
  20: "提示结束 · 接下来要靠手感啦",
  40: "进入深水区 · 落脚位置更小",
  70: "高手水域 · 每一跳都要踩稳",
});

function powerGuideOpacityForStep(step) {
  if (step <= 8) return 1;
  if (step <= 12) return 0.78;
  if (step <= 16) return 0.52;
  if (step <= 20) return 0.28;
  return 0;
}

export class FrogGame {
  constructor(canvas, ui) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.ui = ui;
    this.audio = new TinyAudio();
    this.state = "ready";
    this.bestScore = this.loadBestScore();
    this.profile = this.loadProfile();
    this.recordToBeat = this.bestScore;
    this.platforms = [];
    this.generator = null;
    this.currentIndex = 0;
    this.steps = 0;
    this.runFireflies = 0;
    this.combo = 0;
    this.bestCombo = 0;
    this.perfectCount = 0;
    this.feverJumps = 0;
    this.sinkingStartedAt = 0;
    this.sinkingArmed = false;
    this.reviveUsed = false;
    this.mission = null;
    this.lastMissFeedback = null;
    this.runStartedAt = 0;
    this.chargeStartedAt = 0;
    this.charge = 0;
    this.cameraY = 0;
    this.cameraTargetY = 0;
    this.jump = null;
    this.landing = null;
    this.cameraKick = 0;
    this.resetPlatforms();
    const start = this.platforms[0];
    this.frog = { x: start.x, y: start.y + 26 };
    this.particles = [];
    this.ripples = [];
    this.lastTime = performance.now();
    this.toastTimer = 0;
    this.hasJumped = false;
    this.resizeCanvas();
    this.bindInput();
    this.updateCollectionUi();
    this.updateUi();
    window.addEventListener("resize", () => this.resizeCanvas());
    requestAnimationFrame((time) => this.loop(time));
  }

  resizeCanvas() {
    const bounds = this.canvas.getBoundingClientRect();
    const aspectHeight = bounds.width > 0
      ? Math.round(VIEW.width * (bounds.height / bounds.width))
      : 1334;
    VIEW.height = Math.max(1180, aspectHeight);
    VIEW.baselineY = Math.round(VIEW.height * 0.76);
    this.canvas.width = VIEW.width;
    this.canvas.height = VIEW.height;
    if (this.frog) this.updateCameraTarget();
  }

  updateCameraTarget(worldY = this.frog.y) {
    this.cameraTargetY = cameraTargetForWorldY(
      worldY,
      VIEW.height,
      VIEW.baselineY,
    );
  }

  bindInput() {
    this.canvas.addEventListener("pointerdown", (event) => {
      if (this.state !== "idle") return;
      event.preventDefault();
      this.canvas.setPointerCapture?.(event.pointerId);
      this.beginCharge();
    });
    this.canvas.addEventListener("pointerup", (event) => {
      if (this.state !== "charging") return;
      event.preventDefault();
      this.releaseJump();
    });
    this.canvas.addEventListener("pointercancel", () => {
      if (this.state === "charging") this.cancelCharge();
    });
    window.addEventListener("blur", () => {
      if (this.state === "charging") this.cancelCharge();
    });
  }

  start() {
    this.clearToast();
    this.reset();
    this.assignMission();
    this.state = "idle";
    this.runStartedAt = performance.now();
    this.ui.startOverlay.classList.remove("visible");
    this.ui.failOverlay.classList.remove("visible");
    this.audio.ensureContext();
    this.updateUi();
    track("game_start", {
      bestScore: this.bestScore,
      fireflies: this.profile.fireflies,
      missionId: this.mission.id,
    });
  }

  loadBestScore() {
    try {
      const stored = Number(window.localStorage.getItem("frog-home-endless-best"));
      return Number.isFinite(stored) && stored > 0 ? Math.floor(stored) : 0;
    } catch {
      return 0;
    }
  }

  saveBestScore() {
    try {
      window.localStorage.setItem("frog-home-endless-best", String(this.bestScore));
    } catch {
      // 隐私模式或小游戏适配环境可能不提供 localStorage，忽略即可继续游戏。
    }
  }

  loadProfile() {
    try {
      const stored = JSON.parse(window.localStorage.getItem(PROFILE_STORAGE_KEY));
      return normalizeProfile(stored);
    } catch {
      return normalizeProfile(null);
    }
  }

  saveProfile() {
    try {
      window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(this.profile));
    } catch {
      // 隐私模式或小游戏适配环境可能不提供 localStorage，忽略即可继续游戏。
    }
  }

  assignMission() {
    const template = missionForCursor(this.profile.missionCursor);
    this.profile.missionCursor += 1;
    this.mission = { ...template, progress: 0, completed: false };
    this.saveProfile();
    this.updateCollectionUi();
    this.updateUi();
  }

  awardFireflies(amount, source) {
    const reward = Math.max(0, Math.floor(amount));
    if (reward === 0) return;
    this.profile.fireflies += reward;
    this.runFireflies += reward;
    this.saveProfile();
    this.updateCollectionUi();
    track("fireflies_earned", {
      amount: reward,
      source,
      steps: this.steps,
      balance: this.profile.fireflies,
    });
  }

  updateMissionProgress() {
    if (!this.mission || this.mission.completed) return 0;
    this.mission.progress = progressForMission(this.mission, {
      steps: this.steps,
      perfectCount: this.perfectCount,
    });
    if (this.mission.progress < this.mission.target) return 0;
    this.mission.completed = true;
    this.awardFireflies(this.mission.reward, "mission");
    track("mission_complete", {
      missionId: this.mission.id,
      reward: this.mission.reward,
      steps: this.steps,
    });
    return this.mission.reward;
  }

  updateCollectionUi() {
    const previewMission = this.mission ?? missionForCursor(this.profile.missionCursor);
    this.ui.startFireflyText.textContent = String(this.profile.fireflies);
    this.ui.fireflyText.textContent = String(this.profile.fireflies);
    this.ui.missionPreview.textContent = `本局目标：${previewMission.label} · 奖励 ${previewMission.reward} ✦`;
  }

  resetPlatforms() {
    const seed = (Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0;
    this.generator = new EndlessGenerator(seed);
    this.platforms = [createStartPlatform()];
    this.currentIndex = 0;
    this.ensurePlatforms();
  }

  ensurePlatforms() {
    while (this.platforms.length - this.currentIndex <= ENDLESS.previewCount) {
      const previous = this.platforms[this.platforms.length - 1];
      this.platforms.push(this.generator.next(previous, previous.step + 1));
    }
  }

  prunePlatforms() {
    const removeCount = Math.max(0, this.currentIndex - 3);
    if (removeCount === 0) return;
    this.platforms.splice(0, removeCount);
    this.currentIndex -= removeCount;
  }

  currentPlatform() {
    return this.platforms[this.currentIndex];
  }

  targetPlatform() {
    return this.platforms[this.currentIndex + 1];
  }

  reset() {
    this.resetPlatforms();
    this.steps = 0;
    this.recordToBeat = this.bestScore;
    this.runFireflies = 0;
    this.combo = 0;
    this.bestCombo = 0;
    this.perfectCount = 0;
    this.feverJumps = 0;
    this.sinkingStartedAt = 0;
    this.sinkingArmed = false;
    this.reviveUsed = false;
    this.mission = null;
    this.lastMissFeedback = null;
    this.charge = 0;
    this.jump = null;
    this.landing = null;
    this.cameraKick = 0;
    this.cameraY = 0;
    this.cameraTargetY = 0;
    this.hasJumped = false;
    const start = this.currentPlatform();
    this.frog.x = start.x;
    this.frog.y = start.y + 26;
    this.particles.length = 0;
    this.ripples.length = 0;
    this.ui.hint.classList.remove("hidden");
    this.ui.powerWrap.classList.remove("visible");
    this.ui.sinkingTutorial.classList.remove("visible");
    this.ui.reviveButton.hidden = false;
    this.ui.reviveButton.disabled = false;
    this.updateUi();
  }

  restart() {
    track("restart", {
      previousSteps: this.steps,
      revived: this.reviveUsed,
      runFireflies: this.runFireflies,
    });
    this.clearToast();
    this.reset();
    this.assignMission();
    this.state = "idle";
    this.runStartedAt = performance.now();
    this.ui.failOverlay.classList.remove("visible");
    track("game_start", {
      bestScore: this.bestScore,
      fireflies: this.profile.fireflies,
      missionId: this.mission.id,
      source: "restart",
    });
  }

  revive() {
    if (this.reviveUsed || this.steps < 3) return;
    track("revive_click", { steps: this.steps });
    this.reviveUsed = true;
    const platform = this.currentPlatform();
    this.frog.x = platform.x;
    this.frog.y = platform.y + 26;
    this.updateCameraTarget();
    this.jump = null;
    this.state = "idle";
    this.sinkingArmed = platform.kind === "sinking";
    this.sinkingStartedAt = this.sinkingArmed ? performance.now() : 0;
    if (this.sinkingArmed) {
      platform.sinkingStartedAt = this.sinkingStartedAt;
      platform.sinkingDepartedAt = 0;
    }
    for (let offset = 1; offset <= 2; offset += 1) {
      const rescuePlatform = this.platforms[this.currentIndex + offset];
      if (rescuePlatform) rescuePlatform.radius = Math.max(rescuePlatform.radius, 84 - offset * 3);
    }
    this.ui.failOverlay.classList.remove("visible");
    this.showToast("蜻蜓把你送回来了");
    this.spawnSparkles(platform.x, platform.y + 48, "#f7cc4d", 12);
    this.updateUi();
    track("revive_complete", { steps: this.steps });
  }

  goHome() {
    track("return_home", {
      previousSteps: this.steps,
      runFireflies: this.runFireflies,
    });
    this.clearToast();
    this.reset();
    this.state = "ready";
    this.ui.failOverlay.classList.remove("visible");
    this.ui.sinkingTutorial.classList.remove("visible");
    this.ui.startOverlay.classList.add("visible");
    this.updateCollectionUi();
    this.updateUi();
  }

  beginCharge() {
    this.state = "charging";
    this.chargeStartedAt = performance.now();
    this.charge = 0;
    this.ui.powerWrap.classList.add("visible");
    this.ui.hint.classList.add("hidden");
    this.updatePowerTarget();
  }

  updatePowerTarget() {
    const current = this.currentPlatform();
    const target = this.targetPlatform();
    if (!current || !target || !this.ui.powerTarget) return;
    const distance = Math.hypot(target.x - current.x, target.y - current.y);
    const landingTolerance = landingToleranceWithFever(
      landingToleranceForPlatform(target),
      this.feverJumps > 0,
    );
    const guideScale = target.step <= 10 ? 0.82 : 0.66;
    const window = chargeWindowForLanding(distance, landingTolerance * guideScale);
    const left = Math.round(window.min * 1000) / 10;
    const width = Math.max(2.5, Math.round((window.max - window.min) * 1000) / 10);
    this.ui.powerTarget.style.left = `${left}%`;
    this.ui.powerTarget.style.width = `${width}%`;
    this.ui.powerTarget.style.opacity = String(powerGuideOpacityForStep(target.step));
  }

  cancelCharge() {
    this.state = "idle";
    this.charge = 0;
    this.ui.powerWrap.classList.remove("visible");
    this.ui.powerFill.style.width = "0%";
  }

  releaseJump() {
    const heldFor = performance.now() - this.chargeStartedAt;
    this.charge = chargeFromDuration(heldFor);
    const current = this.currentPlatform();
    const target = this.targetPlatform();
    if (!target) return;
    const distance = jumpDistanceFromCharge(this.charge);
    const start = { x: current.x, y: current.y + 26 };
    const targetPoint = { x: target.x, y: target.y + 26 };
    const direction = directionBetween(start, targetPoint);
    const startedAt = performance.now();
    if (
      current.kind === "sinking"
      && sinkingProgress(current.sinkingStartedAt, startedAt) >= 1
    ) {
      this.failFromSinking();
      return;
    }
    if (current.kind === "sinking") {
      current.sinkingDepartedAt = startedAt;
      this.sinkingArmed = false;
      this.sinkingStartedAt = 0;
    }
    this.jump = {
      startedAt,
      duration: jumpDurationFromDistance(distance),
      distance,
      direction,
      start,
      target,
      arcHeight: 116 + distance * 0.25,
      angle: Math.atan2(direction.y, direction.x),
      progress: 0,
      fever: this.feverJumps > 0,
    };
    this.landing = null;
    this.state = "jumping";
    this.hasJumped = true;
    this.ui.powerWrap.classList.remove("visible");
    this.ui.powerFill.style.width = "0%";
    this.audio.jump();
    this.spawnDust(current.x, current.y + 10);
  }

  resolveJump() {
    const activeJump = this.jump;
    const { target } = activeJump;
    const jumpDistance = activeJump.distance;
    const targetDistance = Math.hypot(
      target.x - activeJump.start.x,
      target.y + 26 - activeJump.start.y,
    );
    const endpoint = { x: this.frog.x, y: this.frog.y - 26 };
    const landingTolerance = landingToleranceWithFever(
      landingToleranceForPlatform(target),
      activeJump.fever,
    );
    const hit = didLand(endpoint, target, landingTolerance);
    const error = landingError(endpoint, target);
    if (hit) {
      const landingSide = Math.sign(endpoint.x - target.x) || 1;
      this.currentIndex += 1;
      this.steps += 1;
      this.frog.x = target.x;
      this.frog.y = target.y + 26;
      this.updateCameraTarget();
      const perfect = error <= Math.max(18, target.radius * 0.24);
      const edgeLanding = !perfect && error > target.radius * 0.62;
      this.landing = {
        startedAt: performance.now(),
        duration: edgeLanding ? 460 : 300,
        kind: perfect ? "perfect" : edgeLanding ? "edge" : "safe",
        side: landingSide,
        platformStep: target.step,
      };
      this.cameraKick = 0;
      const rawCombo = perfect ? this.combo + 1 : 0;
      const precisionState = advancePrecisionState({
        combo: this.combo,
        feverJumps: this.feverJumps,
        perfect,
        feverAtLaunch: activeJump.fever,
      });
      this.bestCombo = Math.max(this.bestCombo, rawCombo);
      this.combo = precisionState.combo;
      this.feverJumps = precisionState.feverJumps;
      if (perfect) {
        this.perfectCount += 1;
        this.awardFireflies(1, "perfect_landing");
        this.spawnSparkles(target.x, target.y + 58, "#ffd45c", 10);
      } else {
        if (edgeLanding) this.spawnEdgeDrops(target.x, target.y, landingSide);
      }
      if (precisionState.activated) {
        this.spawnSparkles(target.x, target.y + 62, "#fff28b", 24);
        track("precision_fever_start", { step: this.steps, perfectCount: this.perfectCount });
      } else if (activeJump.fever) {
        track("precision_fever_jump", {
          step: this.steps,
          outcome: perfect ? "perfect" : edgeLanding ? "edge" : "safe",
          remaining: this.feverJumps,
        });
      }
      let newRecord = false;
      if (this.steps > this.bestScore) {
        this.bestScore = this.steps;
        this.saveBestScore();
        if (this.recordToBeat >= 5 && this.steps === this.recordToBeat + 1) {
          newRecord = true;
          this.spawnSparkles(target.x, target.y + 64, "#fff09a", 16);
        }
      }
      const missionReward = this.updateMissionProgress();
      const milestoneReward = milestoneRewardForStep(this.steps);
      if (milestoneReward > 0) {
        this.awardFireflies(milestoneReward, "milestone");
        track("milestone_reward", {
          step: this.steps,
          reward: milestoneReward,
        });
      }
      track("jump_result", {
        outcome: perfect ? "perfect" : edgeLanding ? "edge" : "safe",
        step: this.steps,
        error: Math.round(error),
        jumpDistance: Math.round(jumpDistance),
        targetDistance: Math.round(targetDistance),
        combo: this.combo,
        fever: activeJump.fever,
      });
      this.spawnRipple(target.x, target.y);
      this.audio.land(perfect);
      this.haptic(precisionState.activated
        ? [18, 24, 18]
        : perfect
          ? 18
          : edgeLanding
            ? [12, 22, 14]
            : 9);
      this.jump = null;
      this.sinkingArmed = target.kind === "sinking";
      this.sinkingStartedAt = this.sinkingArmed ? performance.now() : 0;
      if (this.sinkingArmed) {
        target.sinkingStartedAt = this.sinkingStartedAt;
        target.sinkingDepartedAt = 0;
      }
      this.prunePlatforms();
      this.ensurePlatforms();
      this.updateUi();
      const difficultyNotice = DIFFICULTY_NOTICES[this.steps];
      const rewardTotal = missionReward + milestoneReward;
      if (target.kind === "sinking") {
        this.showToast("下沉荷叶 · 2.3秒内完成下一跳！");
        track("sinking_leaf_landed", {
          step: this.steps,
          delayMs: SPECIALS.sinkingDelayMs,
          totalMs: SPECIALS.sinkingTotalMs,
        });
      } else if (precisionState.activated) {
        this.showToast(`萤火连跳 · 接下来 ${SPECIALS.feverJumps} 跳更稳！`);
      } else if (activeJump.fever && this.feverJumps > 0) {
        this.showToast(`萤火连跳 · 还剩 ${this.feverJumps} 跳`);
      } else if (activeJump.fever) {
        this.showToast("萤火连跳结束 · 继续踩稳吧");
      } else if (rewardTotal > 0) {
        const prefix = milestoneReward > 0 && difficultyNotice
          ? difficultyNotice.split(" · ")[0]
          : missionReward > 0 && milestoneReward > 0
            ? "目标与阶段完成"
            : missionReward > 0
              ? "本局目标完成"
              : "抵达奖励荷叶";
        this.showToast(`${prefix} · 萤火虫 +${rewardTotal}`);
      } else if (newRecord) {
        this.showToast(`新纪录 · ${this.steps} 步！`);
      } else if (difficultyNotice) {
        this.showToast(difficultyNotice);
      } else if (this.steps > 0 && this.steps % 15 === 0) {
        this.showToast(`前方 · ${sceneForSteps(this.steps).name}`);
      } else if (this.steps > 0 && this.steps % 10 === 0) {
        this.showToast(`${this.steps} 步 · 在大荷叶上歇一歇`);
      }
      this.state = "idle";
      this.maybeShowSinkingTutorial();
      return;
    }

    this.lastMissFeedback = feedbackForMiss(jumpDistance, targetDistance);
    track("jump_result", {
      outcome: "miss",
      step: this.steps + 1,
      missKind: this.lastMissFeedback.kind,
      error: Math.round(error),
      jumpDistance: Math.round(jumpDistance),
      targetDistance: Math.round(targetDistance),
      fever: activeJump.fever,
    });
    this.failRun(this.lastMissFeedback, "jump_miss");
  }

  failFromSinking() {
    const platform = this.currentPlatform();
    this.frog.y = platform.y - 12;
    const feedback = {
      kind: "sinking",
      title: "荷叶完全沉没了",
      message: "下沉荷叶只能停留2.3秒，要更早完成蓄力并跳走。",
    };
    track("jump_result", {
      outcome: "sinking_timeout",
      step: this.steps,
      platformStep: platform.step,
    });
    this.failRun(feedback, "sinking_timeout");
  }

  failRun(feedback, reason) {
    this.lastMissFeedback = feedback;
    this.state = "failed";
    this.sinkingArmed = false;
    this.sinkingStartedAt = 0;
    this.audio.splash();
    this.haptic([18, 35, 24]);
    this.cameraKick = 10;
    this.spawnSplash(this.frog.x, this.frog.y - 20);
    this.jump = null;
    this.ui.powerWrap.classList.remove("visible");
    this.ui.powerFill.style.width = "0%";
    this.updateFailUi();
    track("game_fail", {
      steps: this.steps,
      missKind: this.lastMissFeedback.kind,
      reason,
      revived: this.reviveUsed,
      runFireflies: this.runFireflies,
      durationMs: Math.max(0, Math.round(performance.now() - this.runStartedAt)),
    });
    window.setTimeout(() => this.ui.failOverlay.classList.add("visible"), 480);
  }

  maybeShowSinkingTutorial() {
    if (this.profile.seenSinkingTutorial || this.targetPlatform()?.kind !== "sinking") return false;
    this.state = "tutorial";
    this.ui.sinkingTutorial.classList.add("visible");
    track("sinking_tutorial_shown", { nextStep: this.targetPlatform().step });
    return true;
  }

  dismissSinkingTutorial() {
    if (!this.ui.sinkingTutorial.classList.contains("visible")) return;
    this.profile.seenSinkingTutorial = true;
    this.saveProfile();
    this.ui.sinkingTutorial.classList.remove("visible");
    this.state = "idle";
    this.showToast("枯黄裂纹荷叶会下沉 · 落稳后尽快跳走");
    track("sinking_tutorial_dismissed", { nextStep: this.targetPlatform()?.step });
  }

  haptic(pattern) {
    try {
      window.navigator?.vibrate?.(pattern);
    } catch {
      // 浏览器或小游戏运行环境不支持震动时直接忽略。
    }
  }

  updateFailUi() {
    this.ui.failSteps.textContent = `${this.steps} 步`;
    this.ui.failBest.textContent = `${this.bestScore} 步`;
    this.ui.failPerfect.textContent = `${this.perfectCount} 次`;
    this.ui.failFireflies.textContent = `+${this.runFireflies} ✦`;
    const canRevive = !this.reviveUsed && this.steps >= 3;
    this.ui.reviveButton.hidden = !canRevive;
    this.ui.reviveButton.disabled = !canRevive;
    this.ui.restartButton.className = canRevive
      ? "text-button"
      : "primary-button restart-primary";
    this.ui.restartButton.textContent = canRevive ? "重新挑战" : "立即重来";
    this.ui.failTitle.textContent = this.lastMissFeedback?.title ?? "这次走到了这里";
    this.ui.failText.textContent = this.lastMissFeedback?.message
      ?? "休息一下，再向更远的荷塘出发吧。";
    this.ui.rescueNote.textContent = canRevive
      ? "观看一次激励广告，回到上一片荷叶"
      : this.reviveUsed
        ? "本局的蜻蜓救援已经使用过啦"
        : "先熟悉手感，立即重来会更快";
    if (canRevive) track("revive_offer_shown", { steps: this.steps });
  }

  update(time, delta) {
    if (
      ["idle", "charging"].includes(this.state)
      && this.sinkingArmed
      && this.currentPlatform()?.kind === "sinking"
      && sinkingProgress(this.sinkingStartedAt, time) >= 1
    ) {
      this.failFromSinking();
    }

    if (this.state === "charging") {
      this.charge = chargeFromDuration(time - this.chargeStartedAt);
      this.ui.powerFill.style.width = `${Math.round(this.charge * 100)}%`;
    }

    if (this.state === "jumping" && this.jump) {
      const progress = (time - this.jump.startedAt) / this.jump.duration;
      this.jump.progress = Math.min(1, Math.max(0, progress));
      const point = pointOnJump(
        this.jump.start,
        this.jump.direction,
        this.jump.distance,
        progress,
        this.jump.arcHeight,
      );
      this.frog.x = point.x;
      this.frog.y = point.y;
      const routeY = this.jump.start.y
        + this.jump.direction.y * this.jump.distance * this.jump.progress;
      this.updateCameraTarget(routeY);
      if (progress >= 1) this.resolveJump();
    }

    if (this.landing && time - this.landing.startedAt >= this.landing.duration) {
      this.landing = null;
    }

    const cameraFollowSpeed = cameraFollowSpeedForState(this.state);
    this.cameraY += (this.cameraTargetY - this.cameraY) * Math.min(1, delta * cameraFollowSpeed);
    this.cameraKick *= Math.pow(0.018, delta);
    this.updateParticles(delta);
  }

  updateParticles(delta) {
    for (const particle of this.particles) {
      particle.life -= delta;
      particle.x += particle.vx * delta;
      particle.y += particle.vy * delta;
      particle.vy -= 330 * delta;
    }
    this.particles = this.particles.filter((particle) => particle.life > 0);
    for (const ripple of this.ripples) {
      ripple.life -= delta;
      ripple.size += 78 * delta;
    }
    this.ripples = this.ripples.filter((ripple) => ripple.life > 0);
  }

  loop(time) {
    const delta = Math.min(0.04, (time - this.lastTime) / 1000 || 0);
    this.lastTime = time;
    this.update(time, delta);
    this.draw(time);
    requestAnimationFrame((nextTime) => this.loop(nextTime));
  }

  worldToScreen(x, y) {
    const kick = this.cameraKick > 0.2 ? Math.sin(performance.now() * 0.07) * this.cameraKick : 0;
    return { x: x + kick * 0.35, y: VIEW.baselineY - (y - this.cameraY) + kick };
  }

  draw(time) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, VIEW.width, VIEW.height);
    this.drawBackground(time);
    this.drawDistantPlants();
    this.drawAmbientEvents(time);
    this.drawPathGuide();
    for (let index = 0; index < this.platforms.length; index += 1) {
      this.drawPlatform(this.platforms[index], index, time);
    }
    this.drawRipples();
    this.drawParticles();
    if (this.state !== "failed" || this.particles.length === 0) this.drawFrog(time);
    this.drawForeground();
  }

  drawBackground(time) {
    const ctx = this.ctx;
    const scene = sceneForSteps(this.steps);
    const gradient = ctx.createLinearGradient(0, 0, 0, VIEW.height);
    gradient.addColorStop(0, scene.top);
    gradient.addColorStop(0.3, scene.middle);
    gradient.addColorStop(1, scene.bottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, VIEW.width, VIEW.height);

    ctx.fillStyle = scene.glow;
    ctx.beginPath();
    ctx.arc(625, 185, 72, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.45)";
    this.roundedCloud(128 + Math.sin(time * 0.00012) * 20, 170, 1.05);
    this.roundedCloud(565 + Math.sin(time * 0.00009) * 24, 365, 0.7);

    const waveOffset = (time * 0.018) % 150;
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    for (let row = 0; row < 9; row += 1) {
      const y = 555 + row * 96;
      for (let x = -120; x < VIEW.width + 120; x += 150) {
        ctx.beginPath();
        ctx.moveTo(x + waveOffset, y);
        ctx.quadraticCurveTo(x + 35 + waveOffset, y - 8, x + 72 + waveOffset, y);
        ctx.stroke();
      }
    }
  }

  roundedCloud(x, y, scale) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.arc(x, y, 27 * scale, Math.PI * 0.6, Math.PI * 1.9);
    ctx.arc(x + 36 * scale, y - 16 * scale, 35 * scale, Math.PI, Math.PI * 1.95);
    ctx.arc(x + 78 * scale, y, 29 * scale, Math.PI * 1.2, Math.PI * 2.25);
    ctx.closePath();
    ctx.fill();
  }

  drawDistantPlants() {
    const ctx = this.ctx;
    const scene = sceneForSteps(this.steps);
    ctx.save();
    ctx.globalAlpha = 0.32;
    ctx.fillStyle = scene.plant;
    for (let x = 18; x < VIEW.width; x += 52) {
      const height = 55 + ((x * 17) % 70);
      ctx.save();
      ctx.translate(x, VIEW.height - 70);
      ctx.rotate(Math.sin(x) * 0.08);
      ctx.fillRect(-3, -height, 6, height + 70);
      ctx.beginPath();
      ctx.ellipse(10, -height * 0.65, 16, 5, -0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  drawAmbientEvents(time) {
    const ctx = this.ctx;
    const sceneIndex = Math.floor(this.steps / 15) % SCENES.length;
    const travel = (time * (0.035 + sceneIndex * 0.004) + this.steps * 91) % 960;
    const x = -100 + travel;
    const y = 255 + Math.sin(time * 0.004 + this.steps) * 22;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.sin(time * 0.006) * 0.08);
    ctx.globalAlpha = 0.48;
    ctx.strokeStyle = sceneIndex === 3 ? "#f5e990" : "#416f59";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-18, 0);
    ctx.lineTo(17, 0);
    ctx.stroke();
    ctx.fillStyle = sceneIndex === 3 ? "rgba(255,244,151,0.72)" : "rgba(243,255,236,0.62)";
    ctx.beginPath();
    ctx.ellipse(-8, -8, 15, 6, -0.38, 0, Math.PI * 2);
    ctx.ellipse(-8, 8, 15, 6, 0.38, 0, Math.PI * 2);
    ctx.ellipse(8, -7, 14, 5, 0.35, 0, Math.PI * 2);
    ctx.ellipse(8, 7, 14, 5, -0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (sceneIndex === 3) {
      ctx.save();
      for (let index = 0; index < 9; index += 1) {
        const fireflyX = (index * 103 + 57) % VIEW.width;
        const fireflyY = 330 + ((index * 71) % 430) + Math.sin(time * 0.0025 + index) * 18;
        ctx.globalAlpha = 0.38 + Math.sin(time * 0.006 + index) * 0.18;
        ctx.fillStyle = "#fff3a0";
        ctx.shadowColor = "#fff17a";
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(fireflyX, fireflyY, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  drawPathGuide() {
    const current = this.currentPlatform();
    const target = this.targetPlatform();
    if (!current || !target) return;
    const from = this.worldToScreen(current.x, current.y + 15);
    const to = this.worldToScreen(target.x, target.y + 15);
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,226,0.54)";
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 15]);
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.quadraticCurveTo((from.x + to.x) / 2, Math.min(from.y, to.y) - 115, to.x, to.y);
    ctx.stroke();
    ctx.restore();
  }

  drawPlatform(platform, index, time) {
    const screen = this.worldToScreen(platform.x, platform.y);
    const timedSinkAmount = platform.kind === "sinking"
      ? sinkingProgress(platform.sinkingStartedAt, time)
      : 0;
    const departedSinkAmount = platform.kind === "sinking"
      ? departureProgress(platform.sinkingDepartedAt, time)
      : 0;
    const sinkAmount = Math.max(timedSinkAmount, departedSinkAmount);
    const submergedOpacity = 1 - Math.min(1, Math.max(0, (timedSinkAmount - 0.55) / 0.45));
    const departureOpacity = 1 - Math.pow(departedSinkAmount, 1.15);
    screen.y += sinkAmount * 72;
    if (screen.y < -130 || screen.y > VIEW.height + 130) return;
    const ctx = this.ctx;
    const isTarget = index === this.currentIndex + 1
      && ["idle", "charging", "jumping", "tutorial"].includes(this.state);
    const isRest = platform.kind === "rest";
    const isSinking = platform.kind === "sinking";
    const isFeverTarget = isTarget && this.feverJumps > 0;
    const radius = platform.radius;
    ctx.save();
    ctx.globalAlpha = Math.min(submergedOpacity, departureOpacity);
    let impact = 0;
    let tilt = 0;
    if (this.landing?.platformStep === platform.step) {
      const progress = Math.min(1, Math.max(0, (time - this.landing.startedAt) / this.landing.duration));
      impact = Math.sin(progress * Math.PI) * (this.landing.kind === "edge" ? 1 : 0.72);
      if (this.landing.kind === "edge") {
        tilt = this.landing.side * 0.09 * Math.sin(progress * Math.PI) * (1 - progress * 0.45);
      }
    }

    if (isTarget) {
      const pulse = 1 + Math.sin(time * 0.004) * 0.06;
      ctx.save();
      ctx.translate(screen.x, screen.y);
      ctx.scale(pulse, pulse * 0.38);
      ctx.strokeStyle = isSinking
        ? "rgba(150, 119, 48, 0.96)"
        : isFeverTarget
        ? "rgba(255, 232, 77, 0.94)"
        : "rgba(255, 238, 130, 0.7)";
      ctx.shadowColor = isSinking ? "#f2d879" : isFeverTarget ? "#fff06f" : "transparent";
      ctx.shadowBlur = isSinking || isFeverTarget ? 24 : 0;
      ctx.lineWidth = isSinking || isFeverTarget ? 13 : 10;
      if (isSinking) ctx.setLineDash([18, 10]);
      ctx.beginPath();
      ctx.arc(0, 0, radius + 13, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    ctx.save();
    ctx.translate(screen.x, screen.y + 8 + impact * 7);
    ctx.rotate(tilt * 0.35);
    ctx.scale(1, 0.34);
    ctx.fillStyle = "rgba(26, 91, 76, 0.15)";
    ctx.beginPath();
    ctx.arc(0, 0, radius + 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const leafGradient = ctx.createLinearGradient(screen.x, screen.y - 22, screen.x, screen.y + 30);
    leafGradient.addColorStop(0,
      isSinking ? "#b6aa52" : isRest ? "#77b64c" : "#63b44e");
    leafGradient.addColorStop(1,
      isSinking ? "#69643b" : isRest ? "#397f3d" : "#378841");
    ctx.save();
    ctx.translate(screen.x, screen.y + impact * 5);
    ctx.rotate(tilt);
    ctx.scale(1 + impact * 0.035 - sinkAmount * 0.08, 0.36 - impact * 0.045 - sinkAmount * 0.08);
    ctx.fillStyle = leafGradient;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0.16, Math.PI * 2 - 0.22);
    ctx.lineTo(3, 0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = isSinking ? "rgba(239, 218, 139, 0.82)" : "rgba(29, 112, 54, 0.72)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-radius * 0.76, radius * 0.12);
    ctx.stroke();
    if (isSinking) this.drawSinkingCracks(radius);
    ctx.restore();

    if (isSinking) {
      this.drawSinkingMarks(screen.x, screen.y, radius, time, sinkAmount);
    }

    if (platform.kind === "flower" || isRest) {
      this.drawLotus(
        screen.x - radius * 0.5,
        screen.y - 21 + impact * 4,
        isRest ? 1.05 : 0.82,
      );
    }

    if (isTarget && isSinking) {
      this.drawSpecialBadge(
        screen.x + radius * 0.45,
        screen.y - 42,
        "↓ 下沉",
        "#80642f",
      );
    }
    ctx.restore();
  }

  drawSpecialBadge(x, y, label, color) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "rgba(255, 253, 232, 0.94)";
    ctx.shadowColor = "rgba(25, 78, 59, 0.16)";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.roundRect(-38, -15, 76, 30, 15);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = color;
    ctx.font = "900 14px 'PingFang SC', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, 0, 1);
    ctx.restore();
  }

  drawSinkingMarks(x, y, radius, time, sinkAmount) {
    const ctx = this.ctx;
    const pulse = 0.65 + Math.sin(time * 0.009) * 0.18;
    ctx.save();
    ctx.globalAlpha *= Math.max(0.2, pulse - sinkAmount * 0.35);
    ctx.strokeStyle = "#fff1b0";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    for (const offset of [-14, 14]) {
      ctx.beginPath();
      ctx.moveTo(x + offset - 7, y - 4);
      ctx.lineTo(x + offset, y + 4);
      ctx.lineTo(x + offset + 7, y - 4);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(255, 245, 190, 0.88)";
    for (let index = 0; index < 3; index += 1) {
      const angle = time * 0.0012 + index * 2.15;
      ctx.beginPath();
      ctx.arc(
        x + Math.cos(angle) * radius * 0.72,
        y - 9 + Math.sin(angle) * 8,
        4 + index * 1.5,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
    ctx.restore();
  }

  drawSinkingCracks(radius) {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = "rgba(85, 65, 35, 0.88)";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const crack = (points) => {
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      for (let index = 1; index < points.length; index += 1) {
        ctx.lineTo(points[index][0], points[index][1]);
      }
      ctx.stroke();
    };

    crack([[-3, 0], [12, -13], [22, 3], [37, -7], [radius * 0.74, -2]]);
    crack([[12, -13], [6, -27], [-3, -35]]);
    crack([[22, 3], [17, 18], [28, 30]]);
    crack([[-7, 1], [-23, -10], [-37, 2], [-radius * 0.7, -7]]);
    crack([[-23, -10], [-20, -27], [-29, -35]]);
    ctx.restore();
  }

  drawLotus(x, y, scale) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = "#f7b7c6";
    for (let i = 0; i < 6; i += 1) {
      ctx.rotate(Math.PI / 3);
      ctx.beginPath();
      ctx.ellipse(0, -9, 7, 13, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#f3d66b";
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawFrog(time) {
    const screen = this.worldToScreen(this.frog.x, this.frog.y);
    const current = this.currentPlatform();
    const rideSinkAmount = ["idle", "charging"].includes(this.state)
      && current?.kind === "sinking"
      ? sinkingProgress(current.sinkingStartedAt, time)
      : 0;
    screen.y += rideSinkAmount * 72;
    const ctx = this.ctx;
    const colors = FROG_COLORS;
    const jumpProgress = this.jump?.progress ?? 0;
    const flight = this.state === "jumping" ? Math.sin(jumpProgress * Math.PI) : 0;
    const jumpArc = this.state === "jumping" && this.jump
      ? 4 * this.jump.arcHeight * jumpProgress * (1 - jumpProgress)
      : 0;
    const chargeSquash = this.state === "charging" ? this.charge * 0.26 : 0;
    let landingSquash = 0;
    let landingWobble = 0;
    if (this.landing) {
      const progress = Math.min(1, Math.max(0, (time - this.landing.startedAt) / this.landing.duration));
      landingSquash = Math.sin(progress * Math.PI) * (this.landing.kind === "edge" ? 0.18 : 0.13);
      if (this.landing.kind === "edge") {
        landingWobble = this.landing.side
          * Math.sin(progress * Math.PI * 5)
          * (1 - progress)
          * 0.12;
      }
    }
    const squash = Math.max(chargeSquash, landingSquash);
    const bob = this.state === "idle" && !this.landing ? Math.sin(time * 0.004) * 2.5 : 0;
    const lookDirection = this.jump
      ? Math.sign(this.jump.direction.x)
      : Math.sign((this.targetPlatform()?.x ?? this.frog.x) - this.frog.x);
    const rotation = (this.jump ? this.jump.direction.x * 0.17 * flight : 0) + landingWobble;

    if (this.jump?.fever) {
      const glow = 0.72 + Math.sin(time * 0.012) * 0.18;
      ctx.save();
      ctx.globalAlpha = glow;
      ctx.strokeStyle = "rgba(255, 239, 111, 0.74)";
      ctx.lineWidth = 10;
      ctx.lineCap = "round";
      ctx.shadowColor = "#fff076";
      ctx.shadowBlur = 24;
      ctx.beginPath();
      ctx.moveTo(
        screen.x - this.jump.direction.x * (48 + flight * 34),
        screen.y + this.jump.direction.y * 18,
      );
      ctx.lineTo(screen.x, screen.y);
      ctx.stroke();
      ctx.fillStyle = "rgba(255, 247, 152, 0.34)";
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, 58 + flight * 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.save();
    ctx.globalAlpha = 0.15 * (1 - flight * 0.48);
    ctx.fillStyle = "#1f5239";
    ctx.beginPath();
    ctx.ellipse(
      screen.x,
      screen.y + 28 + jumpArc,
      45 - flight * 12,
      10 - flight * 2,
      0,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(screen.x, screen.y + bob + squash * 35);
    ctx.rotate(rotation);
    ctx.scale(1 + squash * 0.18 - flight * 0.045, 1 - squash + flight * 0.14);

    ctx.fillStyle = colors.limb;
    ctx.beginPath();
    ctx.ellipse(-29 - flight * 7, 20 + flight * 7, 26, 14 - flight * 2, -0.25 - flight * 0.18, 0, Math.PI * 2);
    ctx.ellipse(29 + flight * 7, 20 + flight * 7, 26, 14 - flight * 2, 0.25 + flight * 0.18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = colors.foot;
    ctx.beginPath();
    ctx.ellipse(-22 - flight * 5, 25 + flight * 8, 13, 8, -0.14 - flight * 0.2, 0, Math.PI * 2);
    ctx.ellipse(22 + flight * 5, 25 + flight * 8, 13, 8, 0.14 + flight * 0.2, 0, Math.PI * 2);
    ctx.fill();

    const bodyGradient = ctx.createLinearGradient(0, -38, 0, 32);
    bodyGradient.addColorStop(0, colors.bodyTop);
    bodyGradient.addColorStop(1, colors.bodyBottom);
    ctx.fillStyle = bodyGradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, 42, 39, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = colors.brow;
    ctx.beginPath();
    ctx.arc(-25, -29, 19, 0, Math.PI * 2);
    ctx.arc(25, -29, 19, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fffbe9";
    ctx.beginPath();
    ctx.arc(-25, -31, 12, 0, Math.PI * 2);
    ctx.arc(25, -31, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#173a31";
    ctx.beginPath();
    ctx.arc(-23 + lookDirection * 2.6, -31, 5, 0, Math.PI * 2);
    ctx.arc(23 + lookDirection * 2.6, -31, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = colors.blush;
    ctx.beginPath();
    ctx.arc(-30, 2, 8, 0, Math.PI * 2);
    ctx.arc(30, 2, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = colors.mouth;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    if (flight > 0.76) {
      ctx.arc(0, 8, 5, 0, Math.PI * 2);
    } else {
      ctx.arc(0, 3, 10, 0.12, Math.PI - 0.12);
    }
    ctx.stroke();
    ctx.restore();
  }

  drawMother(x, y, time) {
    const ctx = this.ctx;
    const bob = Math.sin(time * 0.003) * 2;
    ctx.save();
    ctx.translate(x, y + bob);
    ctx.fillStyle = "#437e3b";
    ctx.beginPath();
    ctx.ellipse(0, 12, 43, 33, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#76b64d";
    ctx.beginPath();
    ctx.arc(-24, -12, 18, 0, Math.PI * 2);
    ctx.arc(24, -12, 18, 0, Math.PI * 2);
    ctx.ellipse(0, 2, 40, 35, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff8dd";
    ctx.beginPath();
    ctx.arc(-23, -14, 10, 0, Math.PI * 2);
    ctx.arc(23, -14, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#173a31";
    ctx.beginPath();
    ctx.arc(-22, -14, 4, 0, Math.PI * 2);
    ctx.arc(22, -14, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#244f3a";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 3, 11, 0.2, Math.PI - 0.2);
    ctx.stroke();
    ctx.restore();
  }

  drawRipples() {
    const ctx = this.ctx;
    for (const ripple of this.ripples) {
      const screen = this.worldToScreen(ripple.x, ripple.y);
      ctx.save();
      ctx.globalAlpha = Math.max(0, ripple.life / ripple.maxLife) * 0.46;
      ctx.strokeStyle = "#ecfff9";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(screen.x, screen.y + 15, ripple.size, ripple.size * 0.25, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  drawParticles() {
    const ctx = this.ctx;
    for (const particle of this.particles) {
      const screen = this.worldToScreen(particle.x, particle.y);
      ctx.save();
      ctx.globalAlpha = Math.max(0, particle.life / particle.maxLife);
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  drawForeground() {
    const ctx = this.ctx;
    const vignette = ctx.createRadialGradient(375, 610, 370, 375, 650, 790);
    vignette.addColorStop(0, "rgba(22,67,55,0)");
    vignette.addColorStop(1, "rgba(22,67,55,0.14)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, VIEW.width, VIEW.height);
  }

  spawnDust(x, y) {
    for (let i = 0; i < 7; i += 1) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 45,
        y,
        vx: (Math.random() - 0.5) * 70,
        vy: 35 + Math.random() * 45,
        size: 3 + Math.random() * 4,
        color: "#d9efb7",
        life: 0.42,
        maxLife: 0.42,
      });
    }
  }

  spawnSparkles(x, y, color, count) {
    for (let i = 0; i < count; i += 1) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 180,
        vy: 80 + Math.random() * 125,
        size: 3 + Math.random() * 5,
        color,
        life: 0.7 + Math.random() * 0.25,
        maxLife: 0.95,
      });
    }
  }

  spawnEdgeDrops(x, y, side) {
    for (let index = 0; index < 9; index += 1) {
      this.particles.push({
        x: x + side * (35 + Math.random() * 28),
        y: y + 5,
        vx: side * (45 + Math.random() * 105),
        vy: 55 + Math.random() * 115,
        size: 3 + Math.random() * 4,
        color: "#e8fff8",
        life: 0.5 + Math.random() * 0.25,
        maxLife: 0.75,
      });
    }
  }

  spawnSplash(x, y) {
    for (let i = 0; i < 16; i += 1) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 230,
        vy: 90 + Math.random() * 170,
        size: 4 + Math.random() * 7,
        color: "#e3fff8",
        life: 0.68 + Math.random() * 0.28,
        maxLife: 0.96,
      });
    }
    this.spawnRipple(x, y);
  }

  spawnRipple(x, y) {
    this.ripples.push({ x, y, size: 30, life: 0.78, maxLife: 0.78 });
  }

  showToast(message) {
    window.clearTimeout(this.toastTimer);
    this.ui.toast.textContent = message;
    this.ui.toast.classList.add("visible");
    this.toastTimer = window.setTimeout(() => this.ui.toast.classList.remove("visible"), 1100);
  }

  clearToast() {
    window.clearTimeout(this.toastTimer);
    this.ui.toast.classList.remove("visible");
    this.ui.toast.textContent = "";
  }

  updateUi() {
    const recordGap = this.recordToBeat - this.steps;
    if (this.steps === 0) {
      this.ui.stageText.textContent = "准备出发";
    } else if (this.recordToBeat >= 5 && recordGap > 0 && recordGap <= 3) {
      this.ui.stageText.textContent = `再跳 ${recordGap} 步追平最佳`;
    } else if (this.recordToBeat >= 5 && recordGap === 0) {
      this.ui.stageText.textContent = "下一跳就是新纪录";
    } else {
      this.ui.stageText.textContent = `已经前进 ${this.steps} 步`;
    }
    this.ui.bestText.textContent = String(this.bestScore);
    this.ui.fireflyText.textContent = String(this.profile.fireflies);
    const milestoneProgress = this.steps === 0 ? 0 : (((this.steps - 1) % 10) + 1) * 10;
    const milestoneCount = this.steps === 0 ? 0 : ((this.steps - 1) % 10) + 1;
    this.ui.progressFill.style.width = `${milestoneProgress}%`;
    this.ui.milestoneText.textContent = `奖励荷叶 ${milestoneCount}/10 · +3✦`;
    if (!this.mission) {
      this.ui.missionText.textContent = "本局目标 · 准备出发";
    } else if (this.mission.completed) {
      this.ui.missionText.textContent = `目标完成 · +${this.mission.reward}✦`;
    } else {
      const progress = progressForMission(this.mission, {
        steps: this.steps,
        perfectCount: this.perfectCount,
      });
      this.mission.progress = progress;
      this.ui.missionText.textContent = `${this.mission.label} ${progress}/${this.mission.target}`;
    }
    this.ui.feverPill.hidden = this.feverJumps <= 0;
    this.ui.feverText.textContent = `${this.feverJumps}跳`;
    this.ui.comboPill.hidden = this.feverJumps > 0 || this.combo < 2;
    this.ui.comboText.textContent = `×${this.combo}`;
  }
}
