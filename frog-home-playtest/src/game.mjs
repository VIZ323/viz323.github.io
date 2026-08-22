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

const VIEW = { width: 750, height: 1334, baselineY: 1015 };

const LEVEL = [
  { x: 150, y: 170, radius: 87, kind: "start" },
  { x: 392, y: 300, radius: 82, kind: "plain" },
  { x: 228, y: 474, radius: 76, kind: "flower" },
  { x: 517, y: 612, radius: 84, kind: "plain" },
  { x: 326, y: 804, radius: 72, kind: "small" },
  { x: 118, y: 952, radius: 82, kind: "plain" },
  { x: 366, y: 1118, radius: 78, kind: "flower" },
  { x: 610, y: 1265, radius: 72, kind: "small" },
  { x: 390, y: 1443, radius: 84, kind: "plain" },
  { x: 154, y: 1606, radius: 76, kind: "flower" },
  { x: 422, y: 1772, radius: 72, kind: "small" },
  { x: 600, y: 1961, radius: 84, kind: "plain" },
  { x: 340, y: 2112, radius: 96, kind: "home" },
];

export class FrogGame {
  constructor(canvas, ui) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.ui = ui;
    this.audio = new TinyAudio();
    this.state = "ready";
    this.currentIndex = 0;
    this.fireflies = 0;
    this.chargeStartedAt = 0;
    this.charge = 0;
    this.cameraY = 0;
    this.cameraTargetY = 0;
    this.jump = null;
    this.frog = { x: LEVEL[0].x, y: LEVEL[0].y + 26 };
    this.particles = [];
    this.ripples = [];
    this.lastTime = performance.now();
    this.toastTimer = 0;
    this.hasJumped = false;
    this.reviveIndex = 0;
    this.facing = 1;
    this.landingPulse = 0;
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
    this.ui.winOverlay.classList.remove("visible");
    this.audio.ensureContext();
    this.updateUi();
    this.showToast("妈妈，我来啦！");
  }

  reset() {
    this.currentIndex = 0;
    this.reviveIndex = 0;
    this.fireflies = 0;
    this.charge = 0;
    this.jump = null;
    this.cameraY = 0;
    this.cameraTargetY = 0;
    this.hasJumped = false;
    this.facing = Math.sign(LEVEL[1].x - LEVEL[0].x) || 1;
    this.landingPulse = 0;
    this.frog.x = LEVEL[0].x;
    this.frog.y = LEVEL[0].y + 26;
    this.particles.length = 0;
    this.ripples.length = 0;
    this.ui.hint.classList.remove("hidden");
    this.ui.powerWrap.classList.remove("visible");
    this.updateUi();
  }

  restart() {
    this.reset();
    this.state = "idle";
    this.ui.failOverlay.classList.remove("visible");
  }

  revive() {
    this.currentIndex = this.reviveIndex;
    const platform = LEVEL[this.currentIndex];
    this.frog.x = platform.x;
    this.frog.y = platform.y + 26;
    this.cameraTargetY = Math.max(0, platform.y - 500);
    this.jump = null;
    const next = LEVEL[this.currentIndex + 1];
    this.facing = next ? Math.sign(next.x - platform.x) || this.facing : this.facing;
    this.landingPulse = 1;
    this.state = "idle";
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
    const current = LEVEL[this.currentIndex];
    const target = LEVEL[this.currentIndex + 1];
    if (!target) return;
    const start = { x: current.x, y: current.y + 26 };
    const targetPoint = { x: target.x, y: target.y + 26 };
    const direction = directionBetween(start, targetPoint);
    this.facing = Math.sign(direction.x) || this.facing;
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
      this.reviveIndex = this.currentIndex;
      this.frog.x = target.x;
      this.frog.y = target.y + 26;
      const next = LEVEL[this.currentIndex + 1];
      this.facing = next ? Math.sign(next.x - target.x) || this.facing : this.facing;
      this.landingPulse = 1;
      const perfect = error <= Math.max(18, target.radius * 0.24);
      if (perfect) {
        this.fireflies += 1;
        this.showToast("稳稳哒 · 萤火虫 +1");
        this.spawnSparkles(target.x, target.y + 58, "#ffd45c", 10);
      } else {
        this.showToast(error > target.radius * 0.62 ? "脚脚踩到边边啦" : "落稳啦");
      }
      this.spawnRipple(target.x, target.y);
      this.audio.land(perfect);
      this.jump = null;
      this.cameraTargetY = Math.max(0, target.y - 500);
      this.updateUi();
      if (this.currentIndex === LEVEL.length - 1) {
        this.state = "complete";
        window.setTimeout(() => {
          this.audio.win();
          this.ui.finalScore.textContent = `${this.fireflies} / ${LEVEL.length - 1}`;
          this.ui.winOverlay.classList.add("visible");
        }, 600);
      } else {
        this.state = "idle";
      }
      return;
    }

    this.state = "failed";
    this.audio.splash();
    this.spawnSplash(this.frog.x, this.frog.y - 20);
    this.jump = null;
    window.setTimeout(() => this.ui.failOverlay.classList.add("visible"), 480);
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
    this.landingPulse = Math.max(0, this.landingPulse - delta * 3.3);
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
    this.drawPondLife(time);
    this.drawDistantPlants();
    this.drawPathGuide();
    for (let index = 0; index < LEVEL.length; index += 1) this.drawPlatform(LEVEL[index], index, time);
    this.drawRipples();
    this.drawParticles();
    if (this.state !== "failed") this.drawFrog(time);
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

  drawPondLife(time) {
    const ctx = this.ctx;
    const fish = [
      { x: 92, y: 650, scale: 0.8, speed: 0.018, phase: 0.2 },
      { x: 610, y: 875, scale: 1.05, speed: -0.014, phase: 1.7 },
      { x: 265, y: 1120, scale: 0.7, speed: 0.021, phase: 2.8 },
    ];
    ctx.save();
    ctx.globalAlpha = 0.085;
    ctx.fillStyle = "#266e64";
    for (const item of fish) {
      const drift = Math.sin(time * item.speed * 0.01 + item.phase) * 34;
      ctx.save();
      ctx.translate(item.x + drift, item.y - (this.cameraY * 0.08) % 140);
      ctx.scale(Math.sign(item.speed) * item.scale, item.scale);
      ctx.beginPath();
      ctx.ellipse(0, 0, 24, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-20, 0);
      ctx.lineTo(-34, -11);
      ctx.lineTo(-34, 11);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();

    ctx.save();
    for (let index = 0; index < 14; index += 1) {
      const x = 42 + ((index * 137) % 680);
      const y = 175 + ((index * 211) % Math.max(240, VIEW.height - 260));
      const glow = 0.22 + Math.sin(time * 0.0022 + index * 1.7) * 0.16;
      ctx.globalAlpha = Math.max(0.04, glow);
      ctx.fillStyle = index % 4 === 0 ? "#ffe78a" : "#f5fff4";
      ctx.translate(x, y);
      ctx.rotate(Math.PI / 4);
      ctx.fillRect(-2.5, -2.5, 5, 5);
      ctx.rotate(-Math.PI / 4);
      ctx.translate(-x, -y);
    }
    ctx.restore();
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
    if (this.currentIndex >= LEVEL.length - 1) return;
    const from = this.worldToScreen(LEVEL[this.currentIndex].x, LEVEL[this.currentIndex].y + 15);
    const to = this.worldToScreen(LEVEL[this.currentIndex + 1].x, LEVEL[this.currentIndex + 1].y + 15);
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
    const isHome = platform.kind === "home";
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
    leafGradient.addColorStop(0, isHome ? "#77b64c" : "#63b44e");
    leafGradient.addColorStop(1, isHome ? "#397f3d" : "#378841");
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

    if (platform.kind === "flower" || isHome) this.drawLotus(screen.x - radius * 0.5, screen.y - 21, isHome ? 1.2 : 0.82);
    if (isHome) this.drawMother(screen.x + 18, screen.y - 69, time);
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

  frogScreenDirection() {
    if (this.state === "jumping" && this.jump) {
      return { x: this.jump.direction.x, y: -this.jump.direction.y };
    }
    const current = LEVEL[this.currentIndex];
    const target = LEVEL[this.currentIndex + 1];
    if (!target) return { x: this.facing, y: 0 };
    const dx = target.x - current.x;
    const dy = -(target.y - current.y);
    const length = Math.hypot(dx, dy) || 1;
    return { x: dx / length, y: dy / length };
  }

  drawFrog(time) {
    const screen = this.worldToScreen(this.frog.x, this.frog.y);
    const ctx = this.ctx;
    const isAirborne = this.state === "jumping" && this.jump;
    const direction = this.frogScreenDirection();
    const facing = Math.abs(direction.x) > 0.02 ? Math.sign(direction.x) : this.facing;
    const angle = Math.atan2(direction.y * facing, Math.abs(direction.x));
    let flightProgress = 0;
    let shadow = screen;

    if (isAirborne) {
      flightProgress = Math.min(1, Math.max(0, (time - this.jump.startedAt) / this.jump.duration));
      const groundX = this.jump.start.x + this.jump.direction.x * this.jump.distance * flightProgress;
      const groundY = this.jump.start.y + this.jump.direction.y * this.jump.distance * flightProgress;
      shadow = this.worldToScreen(groundX, groundY);
    }

    const lift = isAirborne ? Math.sin(flightProgress * Math.PI) : 0;
    ctx.save();
    ctx.translate(shadow.x, shadow.y + 28);
    ctx.scale(1 - lift * 0.38, 0.34 - lift * 0.08);
    ctx.fillStyle = `rgba(25, 77, 61, ${0.18 - lift * 0.1})`;
    ctx.beginPath();
    ctx.arc(0, 0, isAirborne ? 45 : 49, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const chargeSquash = this.state === "charging" ? this.charge : 0;
    const idleBob = this.state === "idle" ? Math.sin(time * 0.0042) * 1.8 : 0;
    const landingBounce = this.landingPulse > 0 ? Math.sin((1 - this.landingPulse) * Math.PI) : 0;
    const blink = time % 3700 > 3530;

    ctx.save();
    ctx.translate(screen.x, screen.y + idleBob - landingBounce * 7 + chargeSquash * 9);
    ctx.rotate(angle);
    ctx.scale(facing, 1);
    if (chargeSquash > 0) ctx.scale(1 - chargeSquash * 0.13, 1 + chargeSquash * 0.15);
    if (landingBounce > 0) ctx.scale(1 - landingBounce * 0.08, 1 + landingBounce * 0.1);
    if (isAirborne) this.drawJumpingFrog(blink, flightProgress);
    else this.drawGroundedFrog(blink, false);
    ctx.restore();
  }

  drawFrogLimb(startX, startY, endX, endY, color, width = 8, toeScale = 1) {
    const ctx = this.ctx;
    const angle = Math.atan2(endY - startY, endX - startX);
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo((startX + endX) / 2, endY * 1.05, endX, endY);
    ctx.stroke();
    ctx.translate(endX, endY);
    ctx.rotate(angle);
    ctx.lineWidth = Math.max(2.4, width * 0.34);
    for (const spread of [-0.48, 0, 0.48]) {
      ctx.beginPath();
      ctx.moveTo(-1, 0);
      ctx.lineTo(8 * toeScale, spread * 10 * toeScale);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawGroundedFrog(blink, mother = false) {
    const ctx = this.ctx;
    const palette = mother
      ? { limb: "#3f813e", bodyA: "#79bc4f", bodyB: "#4e9443", headA: "#91ca5a", headB: "#61a648" }
      : { limb: "#529c42", bodyA: "#8dce56", bodyB: "#5eaa45", headA: "#a6dd68", headB: "#70b94c" };

    this.drawFrogLimb(-21, -17, -48, -30, palette.limb, mother ? 10 : 9, 1.05);
    this.drawFrogLimb(-21, 17, -48, 30, palette.limb, mother ? 10 : 9, 1.05);
    this.drawFrogLimb(18, -16, 47, -26, palette.limb, mother ? 8 : 7, 0.9);
    this.drawFrogLimb(18, 16, 47, 26, palette.limb, mother ? 8 : 7, 0.9);

    const body = ctx.createLinearGradient(-24, -24, 22, 24);
    body.addColorStop(0, palette.bodyA);
    body.addColorStop(1, palette.bodyB);
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.ellipse(-7, 0, mother ? 38 : 35, mother ? 29 : 27, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(224, 244, 151, 0.34)";
    ctx.beginPath();
    ctx.ellipse(-2, 2, mother ? 22 : 20, mother ? 17 : 15, 0, 0, Math.PI * 2);
    ctx.fill();

    const head = ctx.createLinearGradient(5, -25, 50, 23);
    head.addColorStop(0, palette.headA);
    head.addColorStop(1, palette.headB);
    ctx.fillStyle = head;
    ctx.beginPath();
    ctx.ellipse(24, 0, mother ? 34 : 32, mother ? 30 : 28, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = palette.headA;
    ctx.beginPath();
    ctx.arc(28, -20, mother ? 15 : 14, 0, Math.PI * 2);
    ctx.arc(28, 20, mother ? 15 : 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fffbea";
    if (blink) {
      ctx.strokeStyle = "#234b38";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(25, -21);
      ctx.lineTo(34, -20);
      ctx.moveTo(25, 21);
      ctx.lineTo(34, 20);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.ellipse(30, -20, 9, 10, 0, 0, Math.PI * 2);
      ctx.ellipse(30, 20, 9, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#173a31";
      ctx.beginPath();
      ctx.arc(34, -20, 4.5, 0, Math.PI * 2);
      ctx.arc(34, 20, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(35.5, -22, 1.7, 0, Math.PI * 2);
      ctx.arc(35.5, 18, 1.7, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = mother ? "rgba(239, 127, 133, 0.42)" : "rgba(247, 128, 139, 0.62)";
    ctx.beginPath();
    ctx.ellipse(42, -14, 7, 4.5, -0.12, 0, Math.PI * 2);
    ctx.ellipse(42, 14, 7, 4.5, 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#2c5a3f";
    ctx.lineWidth = 2.8;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(43, -6);
    ctx.quadraticCurveTo(51, 0, 43, 6);
    ctx.stroke();

    ctx.fillStyle = "rgba(66, 131, 55, 0.34)";
    ctx.beginPath();
    ctx.arc(-17, -8, 3.5, 0, Math.PI * 2);
    ctx.arc(-10, 11, 2.8, 0, Math.PI * 2);
    ctx.fill();
  }

  drawJumpingFrog(blink, progress) {
    const ctx = this.ctx;
    const reach = Math.sin(progress * Math.PI);
    this.drawFrogLimb(-22, -13, -66 - reach * 7, -29, "#4c963f", 8, 1);
    this.drawFrogLimb(-22, 13, -66 - reach * 7, 29, "#4c963f", 8, 1);
    this.drawFrogLimb(20, -13, 62 + reach * 7, -20, "#65ad46", 6.5, 0.82);
    this.drawFrogLimb(20, 13, 62 + reach * 7, 20, "#65ad46", 6.5, 0.82);

    const body = ctx.createLinearGradient(-35, -18, 35, 18);
    body.addColorStop(0, "#65ac46");
    body.addColorStop(1, "#91cf57");
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.ellipse(-5, 0, 40 + reach * 4, 21 - reach * 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(226, 246, 158, 0.36)";
    ctx.beginPath();
    ctx.ellipse(0, 2, 24, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    const head = ctx.createLinearGradient(12, -23, 55, 22);
    head.addColorStop(0, "#a8df68");
    head.addColorStop(1, "#71b94d");
    ctx.fillStyle = head;
    ctx.beginPath();
    ctx.ellipse(31, 0, 30, 25, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#a8df68";
    ctx.beginPath();
    ctx.arc(34, -18, 13, 0, Math.PI * 2);
    ctx.arc(34, 18, 13, 0, Math.PI * 2);
    ctx.fill();

    if (blink) {
      ctx.strokeStyle = "#234b38";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(31, -19);
      ctx.lineTo(39, -18);
      ctx.moveTo(31, 19);
      ctx.lineTo(39, 18);
      ctx.stroke();
    } else {
      ctx.fillStyle = "#fffbea";
      ctx.beginPath();
      ctx.ellipse(36, -18, 8.5, 9.5, 0, 0, Math.PI * 2);
      ctx.ellipse(36, 18, 8.5, 9.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#173a31";
      ctx.beginPath();
      ctx.arc(40, -18, 4.2, 0, Math.PI * 2);
      ctx.arc(40, 18, 4.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(41, -20, 1.5, 0, Math.PI * 2);
      ctx.arc(41, 16, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "rgba(247, 128, 139, 0.56)";
    ctx.beginPath();
    ctx.ellipse(48, -12, 6, 4, 0, 0, Math.PI * 2);
    ctx.ellipse(48, 12, 6, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#2c5a3f";
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(49, -5);
    ctx.quadraticCurveTo(56, 0, 49, 5);
    ctx.stroke();
  }

  drawMother(x, y, time) {
    const ctx = this.ctx;
    const bob = Math.sin(time * 0.003) * 1.8;
    ctx.save();
    ctx.translate(x, y + bob);
    ctx.rotate(0.42);
    ctx.scale(1.12, 1.12);
    this.drawGroundedFrog(time % 4100 > 3920, true);
    ctx.fillStyle = "#f7bdca";
    ctx.translate(4, -28);
    for (let index = 0; index < 5; index += 1) {
      ctx.rotate((Math.PI * 2) / 5);
      ctx.beginPath();
      ctx.ellipse(0, -5, 3.5, 6.5, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#f2d568";
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();
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
    const totalJumps = LEVEL.length - 1;
    this.ui.stageText.textContent = this.currentIndex === totalJumps
      ? "到家啦"
      : `回家的第 ${this.currentIndex + 1} 步`;
    this.ui.fireflyText.textContent = String(this.fireflies);
    this.ui.progressFill.style.width = `${Math.round((this.currentIndex / totalJumps) * 100)}%`;
  }
}
