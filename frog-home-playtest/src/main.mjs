import { FrogGame } from "./game.mjs";

const ui = {
  stageText: document.querySelector("#stageText"),
  bestText: document.querySelector("#bestText"),
  fireflyText: document.querySelector("#fireflyText"),
  comboPill: document.querySelector("#comboPill"),
  comboText: document.querySelector("#comboText"),
  progressFill: document.querySelector("#progressFill"),
  hint: document.querySelector("#hint"),
  powerWrap: document.querySelector("#powerWrap"),
  powerFill: document.querySelector("#powerFill"),
  powerTarget: document.querySelector("#powerTarget"),
  toast: document.querySelector("#toast"),
  startOverlay: document.querySelector("#startOverlay"),
  failOverlay: document.querySelector("#failOverlay"),
  failTitle: document.querySelector("#failTitle"),
  failText: document.querySelector("#failText"),
  failSteps: document.querySelector("#failSteps"),
  failBest: document.querySelector("#failBest"),
  failPerfect: document.querySelector("#failPerfect"),
  rescueNote: document.querySelector("#rescueNote"),
  reviveButton: document.querySelector("#reviveButton"),
};

const game = new FrogGame(document.querySelector("#game"), ui);

document.querySelector("#startButton").addEventListener("click", () => game.start());
document.querySelector("#reviveButton").addEventListener("click", () => game.revive());
document.querySelector("#restartButton").addEventListener("click", () => game.restart());
