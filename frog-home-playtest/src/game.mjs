import {
  PHYSICS,
  chargeFromDuration,
  didLand,
  directionBetween,
  jumpDistanceFromCharge,
  jumpDurationFromDistance,
  landingError,
  pointOnJump,
} from "./physics.mjs";
import { TinyAudio } from "./audio.mjs";
import {
  ENDLESS,
  EndlessGenerator,
  createStartPlatform,
} from "./endless.mjs";

const VIEW = { width: 750, height: 1334, baselineY: 1015 };

export class FrogGame {
  constructor(canvas, ui) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.ui = ui;
    this.audio = new TinyAudio();
    this.state = "ready";
    this.bestScore = this.loadBestScore();
    this.recordToBeat = this.bestScore;
    this.platforms = [];
    this.generator = null;
    this.currentIndex = 0;
    this.steps = 0;
    this.fireflies = 0;
    this.combo = 0;
    this.bestCombo = 0;
    this.perfectCount = 0;
    this.reviveUsed = false;
    this.chargeStartedAt = 0;
    this.charge = 0;
    this.cameraY = 0;
    this.cameraTargetY = 0;
    this.jump = null;
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
    this.reset();
    this.state = "idle";
    this.ui.startOverlay.classList.remove("visible");
    this.ui.failOverlay.classList.remove("visible");
    this.audio.ensureContext();
    this.updateUi();
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
    this.fireflies = 0;
    this.combo = 0;
    this.bestCombo = 0;
    this.perfectCount = 0;
    this.reviveUsed = false;
    this.charge = 0;
    this.jump = null;
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
    this.ui.reviveButton.hidden = false;
    this.ui.reviveButton.disabled = false;
    this.updateUi();
  }

  restart() {
    this.reset();
    this.state = "idle";
    this.ui.failOverlay.classList.remove("visible");
  }

  revive() {
    if (this.reviveUsed) return;
    this.reviveUsed = true;
    const platform = this.currentPlatform();
    this.frog.x = platform.x;
    this.frog.y = platform.y + 26;
    this.cameraTargetY = Math.max(0, platform.y - 500);
    this.jump = null;
    this.state = "idle";
    for (let offset = 1; offset <= 2; offset += 1) {
      const rescuePlatform = this.platforms[this.currentIndex + offset];
      if (rescuePlatform) rescuePlatform.radius = Math.max(rescuePlatform.radius, 84 - offset * 3);
    }
    this.ui.failOverlay.classList.remove("visible");
    this.showToast("蜻蜓把你送回来了");
    this.spawnSparkles(platform.x, platform.y + 48, "#f7cc4d", 12);
    this.updateUi();
  }

  beginCharge() {
    this.state = "charging";
    this.chargeStartedAt = performance.now();
    this.charge = 0;
    this.ui.powerWrap.classList.add("visible");
    this.ui.hint.classList.add("hidden");
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
    const distance = jumpDistanceFromCharge(this.charge);
    const current = this.currentPlatform();
    const target = this.targetPlatform();
    if (!target) return;
    const start = { x: current.x, y: current.y + 26 };
    const targetPoint = { x: target.x, y: target.y + 26 };
    const direction = directionBetween(start, targetPoint);
    this.jump = {
      startedAt: performance.now(),
      duration: jumpDurationFromDistance(distance),
      distance,
      direction,
      start,
      target,
      arcHeight: 116 + distance * 0.25,
      angle: Math.atan2(direction.y, direction.x),
    };
    this.state = "jumping";
    this.hasJumped = true;
    this.ui.powerWrap.classList.remove("visible");
    this.ui.powerFill.style.width = "0%";
    this.audio.jump();
    this.spawnDust(current.x, current.y + 10);
  }

  resolveJump() {
    const { target } = this.jump;
    const endpoint = { x: this.frog.x, y: this.frog.y - 26 };
    const hit = didLand(endpoint, target);
    const error = landingError(endpoint, target);
    if (hit) {
      this.currentIndex += 1;
      this.steps += 1;
      this.frog.x = target.x;
      this.frog.y = target.y + 26;
      const perfect = error <= Math.max(18, target.radius * 0.24);
      if (perfect) {
        this.combo += 1;
        this.bestCombo = Math.max(this.bestCombo, this.combo);
        this.perfectCount += 1;
        this.fireflies += 1;
        this.showToast(this.combo >= 3
          ? `稳稳连击 ×${this.combo} · 萤火虫 +1`
          : "稳稳落下 · 萤火虫 +1");
        this.spawnSparkles(target.x, target.y + 58, "#ffd45c", 10);
      } else {
        this.combo = 0;
        this.showToast(error > target.radius * 0.62 ? "好险，踩到边边啦" : "落稳了");
      }
      if (this.steps > this.bestScore) {
        this.bestScore = this.steps;
        this.saveBestScore();
        if (this.recordToBeat >= 5 && this.steps === this.recordToBeat + 1) {
          this.showToast(`新纪录 · ${this.steps} 步！`);
          this.spawnSparkles(target.x, target.y + 64, "#fff09a", 16);
        }
      }
      this.spawnRipple(target.x, target.y);
      this.audio.land(perfect);
      this.jump = null;
      this.cameraTargetY = Math.max(0, target.y - 500);
      this.prunePlatforms();
      this.ensurePlatforms();
      this.updateUi();
      this.state = "idle";
      return;
    }

    this.state = "failed";
    this.audio.splash();
    this.spawnSplash(this.frog.x, this.frog.y - 20);
    this.jump = null;
    this.updateFailUi();
    window.setTimeout(() => this.ui.failOverlay.classList.add("visible"), 480);
  }

  updateFailUi() {
    this.ui.failSteps.textContent = `${this.steps} 步`;
    this.ui.failBest.textContent = `${this.bestScore} 步`;
    this.ui.failPerfect.textContent = `${this.perfectCount} 次`;
    this.ui.reviveButton.hidden = this.reviveUsed;
    this.ui.reviveButton.disabled = this.reviveUsed;
    this.ui.failTitle.textContent = this.reviveUsed ? "这次走到了这里" : "哎呀，掉进水里了";
    this.ui.failText.textContent = this.reviveUsed
      ? "休息一下，再向更远的荷塘出发吧。"
      : "蜻蜓可以把小蛙送回上一片荷叶。";
    this.ui.rescueNote.textContent = this.reviveUsed
      ? "本局的蜻蜓救援已经使用过啦"
      : "每局可以使用一次蜻蜓救援";
  }

  update(time, delta) {
    if (this.state === "charging") {
      this.charge = chargeFromDuration(time - this.chargeStartedAt);
      this.ui.powerFill.style.width = `${Math.round(this.charge * 100)}%`;
    }

    if (this.state === "jumping" && this.jump) {
      const progress = (time - this.jump.startedAt) / this.jump.duration;
      const point = pointOnJump(
        this.jump.start,
        this.jump.direction,
        this.jump.distance,
        progress,
        this.jump.arcHeight,
      );
      this.frog.x = point.x;
      this.frog.y = point.y;
      if (progress >= 1) this.resolveJump();
    }

    this.cameraY += (this.cameraTargetY - this.cameraY) * Math.min(1, delta * 4.2);
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
    return { x, y: VIEW.baselineY - (y - this.cameraY) };
  }

  draw(time) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, VIEW.width, VIEW.height);
    this.drawBackground(time);
    this.drawDistantPlants();
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
    const gradient = ctx.createLinearGradient(0, 0, 0, VIEW.height);
    gradient.addColorStop(0, "#dff4da");
    gradient.addColorStop(0.3, "#c4e9d9");
    gradient.addColorStop(1, "#80c9bd");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, VIEW.width, VIEW.height);

    ctx.fillStyle = "rgba(255, 250, 204, 0.7)";
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
    ctx.save();
    ctx.globalAlpha = 0.32;
    ctx.fillStyle = "#5c9870";
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
    if (screen.y < -130 || screen.y > VIEW.height + 130) return;
    const ctx = this.ctx;
    const isTarget = index === this.currentIndex + 1 && ["idle", "charging", "jumping"].includes(this.state);
    const isRest = platform.kind === "rest";
    const radius = platform.radius;

    if (isTarget) {
      const pulse = 1 + Math.sin(time * 0.004) * 0.06;
      ctx.save();
      ctx.translate(screen.x, screen.y);
      ctx.scale(pulse, pulse * 0.38);
      ctx.strokeStyle = "rgba(255, 238, 130, 0.7)";
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(0, 0, radius + 13, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    ctx.save();
    ctx.translate(screen.x, screen.y + 8);
    ctx.scale(1, 0.34);
    ctx.fillStyle = "rgba(26, 91, 76, 0.15)";
    ctx.beginPath();
    ctx.arc(0, 0, radius + 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const leafGradient = ctx.createLinearGradient(screen.x, screen.y - 22, screen.x, screen.y + 30);
    leafGradient.addColorStop(0, isRest ? "#77b64c" : "#63b44e");
    leafGradient.addColorStop(1, isRest ? "#397f3d" : "#378841");
    ctx.save();
    ctx.translate(screen.x, screen.y);
    ctx.scale(1, 0.36);
    ctx.fillStyle = leafGradient;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0.16, Math.PI * 2 - 0.22);
    ctx.lineTo(3, 0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(29, 112, 54, 0.72)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-radius * 0.76, radius * 0.12);
    ctx.stroke();
    ctx.restore();

    if (platform.kind === "flower" || isRest) {
      this.drawLotus(screen.x - radius * 0.5, screen.y - 21, isRest ? 1.05 : 0.82);
    }
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
    const ctx = this.ctx;
    let squash = 0;
    if (this.state === "charging") squash = this.charge * 0.24;
    const bob = this.state === "idle" ? Math.sin(time * 0.004) * 2.5 : 0;
    const rotation = this.state === "jumping" && this.jump ? 0.14 * Math.sin(((time - this.jump.startedAt) / this.jump.duration) * Math.PI) : 0;

    ctx.save();
    ctx.translate(screen.x, screen.y + bob + squash * 35);
    ctx.rotate(rotation);
    ctx.scale(1 + squash * 0.18, 1 - squash);

    ctx.fillStyle = "rgba(31, 82, 57, 0.15)";
    ctx.beginPath();
    ctx.ellipse(0, 28, 45, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#4c953d";
    ctx.beginPath();
    ctx.ellipse(-29, 20, 26, 14, -0.25, 0, Math.PI * 2);
    ctx.ellipse(29, 20, 26, 14, 0.25, 0, Math.PI * 2);
    ctx.fill();

    const bodyGradient = ctx.createLinearGradient(0, -38, 0, 32);
    bodyGradient.addColorStop(0, "#91ce55");
    bodyGradient.addColorStop(1, "#5bab45");
    ctx.fillStyle = bodyGradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, 42, 39, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#a5dc68";
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
    ctx.arc(-23, -31, 5, 0, Math.PI * 2);
    ctx.arc(23, -31, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(248, 134, 133, 0.62)";
    ctx.beginPath();
    ctx.arc(-30, 2, 8, 0, Math.PI * 2);
    ctx.arc(30, 2, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#28523e";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(0, 3, 10, 0.12, Math.PI - 0.12);
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

  updateUi() {
    this.ui.stageText.textContent = this.steps === 0 ? "准备出发" : `已经前进 ${this.steps} 步`;
    this.ui.bestText.textContent = String(this.bestScore);
    this.ui.fireflyText.textContent = String(this.fireflies);
    const milestoneProgress = this.steps === 0 ? 0 : (((this.steps - 1) % 10) + 1) * 10;
    this.ui.progressFill.style.width = `${milestoneProgress}%`;
    this.ui.comboPill.hidden = this.combo < 2;
    this.ui.comboText.textContent = `×${this.combo}`;
  }
}
