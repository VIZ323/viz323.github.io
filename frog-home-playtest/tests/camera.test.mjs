import test from "node:test";
import assert from "node:assert/strict";

import {
  CAMERA,
  cameraFollowSpeedForState,
  cameraTargetForWorldY,
} from "../src/camera.mjs";

test("镜头启动后会把青蛙稳定在画面中央略偏下", () => {
  const viewHeight = 1623;
  const baselineY = Math.round(viewHeight * 0.76);

  for (const worldY of [500, 900, 1500, 3000, 8000]) {
    const cameraY = cameraTargetForWorldY(worldY, viewHeight, baselineY);
    const frogScreenY = baselineY - (worldY - cameraY);
    assert.equal(frogScreenY, viewHeight * CAMERA.frogAnchorRatio);
  }
});

test("开局镜头不会向下越过荷塘起点", () => {
  assert.equal(cameraTargetForWorldY(196, 1623, 1233), 0);
});

test("腾空时镜头跟随速度高于落地后的整理速度", () => {
  assert.ok(cameraFollowSpeedForState("jumping") > cameraFollowSpeedForState("idle"));
});
