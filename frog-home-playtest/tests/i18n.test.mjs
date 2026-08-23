import test from "node:test";
import assert from "node:assert/strict";

import {
  SUPPORTED_LOCALES,
  detectLocale,
  formatCount,
  getLocale,
  matchLocale,
  setLocale,
  translate,
} from "../src/i18n.mjs";
import zhHans from "../src/locales/zh-Hans.mjs";
import zhHant from "../src/locales/zh-Hant.mjs";
import en from "../src/locales/en.mjs";
import ja from "../src/locales/ja.mjs";
import ko from "../src/locales/ko.mjs";

test("系统语言会映射到五种受支持语言", () => {
  assert.equal(matchLocale("zh-CN"), "zh-Hans");
  assert.equal(matchLocale("zh-HK"), "zh-Hant");
  assert.equal(matchLocale("en-US"), "en");
  assert.equal(matchLocale("ja-JP"), "ja");
  assert.equal(matchLocale("ko-KR"), "ko");
  assert.equal(detectLocale(["fr-FR", "en-GB"]), "en");
  assert.equal(detectLocale(["fr-FR"]), "en");
  assert.equal(SUPPORTED_LOCALES.length, 5);
});

test("所有语言都能格式化动态纪录文案", () => {
  for (const { id } of SUPPORTED_LOCALES) {
    const copy = translate(
      "record.challenge",
      { best: 12, target: 13, encouragement: "✓" },
      id,
    );
    assert.ok(copy.includes("12"));
    assert.ok(copy.includes("13"));
    assert.ok(copy.includes("✓"));
  }
});

test("五份语言资源拥有完全相同的键", () => {
  const expected = Object.keys(zhHans).sort();
  for (const dictionary of [zhHant, en, ja, ko]) {
    assert.deepEqual(Object.keys(dictionary).sort(), expected);
  }
});

test("语言切换会更新计数单位并可恢复默认语言", () => {
  const initial = getLocale();
  setLocale("en", { persist: false });
  assert.equal(formatCount("step", 1), "1 step");
  assert.equal(formatCount("step", 2), "2 steps");
  setLocale("ja", { persist: false });
  assert.equal(formatCount("step", 2), "2歩");
  setLocale(initial, { persist: false });
});
