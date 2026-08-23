import { FrogGame } from "./game.mjs";

const ui = {
  stageText: document.querySelector("#stageText"),
  bestText: document.querySelector("#bestText"),
  fireflyText: document.querySelector("#fireflyText"),
  comboPill: document.querySelector("#comboPill"),
  comboText: document.querySelector("#comboText"),
  progressFill: document.querySelector("#progressFill"),
  missionText: document.querySelector("#missionText"),
  milestoneText: document.querySelector("#milestoneText"),
  hint: document.querySelector("#hint"),
  powerWrap: document.querySelector("#powerWrap"),
  powerFill: document.querySelector("#powerFill"),
  powerTarget: document.querySelector("#powerTarget"),
  toast: document.querySelector("#toast"),
  startOverlay: document.querySelector("#startOverlay"),
  missionPreview: document.querySelector("#missionPreview"),
  startFireflyText: document.querySelector("#startFireflyText"),
  failOverlay: document.querySelector("#failOverlay"),
  failTitle: document.querySelector("#failTitle"),
  failText: document.querySelector("#failText"),
  failSteps: document.querySelector("#failSteps"),
  failBest: document.querySelector("#failBest"),
  failPerfect: document.querySelector("#failPerfect"),
  failFireflies: document.querySelector("#failFireflies"),
  rescueNote: document.querySelector("#rescueNote"),
  reviveButton: document.querySelector("#reviveButton"),
  restartButton: document.querySelector("#restartButton"),
  homeButton: document.querySelector("#homeButton"),
};

const game = new FrogGame(document.querySelector("#game"), ui);

document.querySelector("#startButton").addEventListener("click", () => game.start());
document.querySelector("#reviveButton").addEventListener("click", () => game.revive());
document.querySelector("#restartButton").addEventListener("click", () => game.restart());
document.querySelector("#homeButton").addEventListener("click", () => game.goHome());
