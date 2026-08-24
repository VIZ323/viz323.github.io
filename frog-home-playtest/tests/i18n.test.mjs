import test from "node:test";
import assert from "node:assert/strict";

import {
  LOCALE_DICTIONARIES,
  SUPPORTED_LOCALES,
  detectLocale,
  formatCount,
  getLocale,
  matchLocale,
  syncLocaleFromSystem,
  translate,
} from "../src/i18n.mjs";
test("系统语言会映射到十九种受支持语言", () => {
  assert.equal(matchLocale("zh-CN"), "zh-Hans");
  assert.equal(matchLocale("zh-HK"), "zh-Hant");
  assert.equal(matchLocale("en-US"), "en");
  assert.equal(matchLocale("ja-JP"), "ja");
  assert.equal(matchLocale("ko-KR"), "ko");
  assert.equal(matchLocale("es-MX"), "es");
  assert.equal(matchLocale("pt-PT"), "pt-BR");
  assert.equal(matchLocale("fr-CA"), "fr");
  assert.equal(matchLocale("de-AT"), "de");
  assert.equal(matchLocale("it-IT"), "it");
  assert.equal(matchLocale("nl-BE"), "nl");
  assert.equal(matchLocale("ru-RU"), "ru");
  assert.equal(matchLocale("pl-PL"), "pl");
  assert.equal(matchLocale("tr-TR"), "tr");
  assert.equal(matchLocale("ar-SA"), "ar");
  assert.equal(matchLocale("th-TH"), "th");
  assert.equal(matchLocale("vi-VN"), "vi");
  assert.equal(matchLocale("id-ID"), "id");
  assert.equal(matchLocale("hi-IN"), "hi");
  assert.equal(detectLocale(["fr-FR", "en-GB"]), "fr");
  assert.equal(detectLocale(["sv-SE", "en-GB"]), "en");
  assert.equal(detectLocale(["sv-SE"]), "en");
  assert.equal(SUPPORTED_LOCALES.length, 19);
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

test("十九份语言资源拥有完全相同的键", () => {
  const expected = Object.keys(LOCALE_DICTIONARIES.en).sort();
  for (const dictionary of Object.values(LOCALE_DICTIONARIES)) {
    assert.deepEqual(Object.keys(dictionary).sort(), expected);
  }
});

test("系统语言变化会更新计数单位并可恢复原语言", () => {
  const initial = getLocale();
  syncLocaleFromSystem(["en-US"]);
  assert.equal(formatCount("step", 1), "1 step");
  assert.equal(formatCount("step", 2), "2 steps");
  syncLocaleFromSystem(["ja-JP"]);
  assert.equal(formatCount("step", 2), "2歩");
  syncLocaleFromSystem([initial]);
});
