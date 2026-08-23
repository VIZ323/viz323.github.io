import test from "node:test";
import assert from "node:assert/strict";

import { track } from "../src/analytics.mjs";

test("没有第三方统计环境时事件接口仍可安全调用", () => {
  const payload = track("game_start", { source: "test" });
  assert.equal(payload.event, "game_start");
  assert.equal(payload.properties.source, "test");
  assert.ok(payload.timestamp);
});
