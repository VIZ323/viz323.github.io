export const CAMERA = Object.freeze({
  frogAnchorRatio: 0.52,
  idleFollowSpeed: 6.2,
  jumpFollowSpeed: 8.6,
});

export function cameraTargetForWorldY(
  worldY,
  viewHeight,
  baselineY,
  anchorRatio = CAMERA.frogAnchorRatio,
) {
  const anchorY = viewHeight * anchorRatio;
  const worldDepthAtAnchor = baselineY - anchorY;
  return Math.max(0, worldY - worldDepthAtAnchor);
}

export function cameraFollowSpeedForState(state) {
  return state === "jumping" ? CAMERA.jumpFollowSpeed : CAMERA.idleFollowSpeed;
}
