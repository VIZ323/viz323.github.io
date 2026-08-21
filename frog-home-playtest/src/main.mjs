import { FrogGame } from "./game.mjs";

const ui = {
  stageText: document.querySelector("#stageText"),
  fireflyText: document.querySelector("#fireflyText"),
  progressFill: document.querySelector("#progressFill"),
  hint: document.querySelector("#hint"),
  powerWrap: document.querySelector("#powerWrap"),
  powerFill: document.querySelector("#powerFill"),
  toast: document.querySelector("#toast"),
  startOverlay: document.querySelector("#startOverlay"),
  failOverlay: document.querySelector("#failOverlay"),
  winOverlay: document.querySelector("#winOverlay"),
  finalScore: document.querySelector("#finalScore"),
};

const game = new FrogGame(document.querySelector("#game"), ui);

document.querySelector("#startButton").addEventListener("click", () => game.start());
document.querySelector("#reviveButton").addEventListener("click", () => game.revive());
document.querySelector("#restartButton").addEventListener("click", () => game.restart());
document.querySelector("#againButton").addEventListener("click", () => game.start());
