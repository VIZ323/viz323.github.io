import zhHans from "./locales/zh-Hans.mjs";
import zhHant from "./locales/zh-Hant.mjs";
import en from "./locales/en.mjs";
import ja from "./locales/ja.mjs";
import ko from "./locales/ko.mjs";

export const DEFAULT_LOCALE = "zh-Hans";
export const FALLBACK_LOCALE = "en";
export const LOCALE_STORAGE_KEY = "frog-home-locale";
export const SUPPORTED_LOCALES = Object.freeze([
  { id: "zh-Hans", htmlLang: "zh-CN", label: "简体中文" },
  { id: "zh-Hant", htmlLang: "zh-TW", label: "繁體中文" },
  { id: "en", htmlLang: "en", label: "English" },
  { id: "ja", htmlLang: "ja", label: "日本語" },
  { id: "ko", htmlLang: "ko", label: "한국어" },
]);

const DICTIONARIES = Object.freeze({
  "zh-Hans": zhHans,
  "zh-Hant": zhHant,
  en,
  ja,
  ko,
});

const listeners = new Set();

export function matchLocale(value) {
  const normalized = String(value ?? "").trim().replaceAll("_", "-").toLowerCase();
  if (!normalized) return null;
  if (normalized.startsWith("zh")) {
    if (
      normalized.includes("hant")
      || normalized.includes("tw")
      || normalized.includes("hk")
      || normalized.includes("mo")
    ) return "zh-Hant";
    return "zh-Hans";
  }
  if (normalized.startsWith("ja")) return "ja";
  if (normalized.startsWith("ko")) return "ko";
  if (normalized.startsWith("en")) return "en";
  return null;
}

function storedLocale() {
  try {
    return matchLocale(window.localStorage.getItem(LOCALE_STORAGE_KEY));
  } catch {
    return null;
  }
}

function queryLocale() {
  try {
    return matchLocale(new URLSearchParams(window.location.search).get("lang"));
  } catch {
    return null;
  }
}

export function detectLocale(languageValues) {
  const values = Array.isArray(languageValues)
    ? languageValues
    : typeof navigator !== "undefined"
      ? [navigator.language, ...(navigator.languages ?? [])]
      : [];
  for (const value of values) {
    const matched = matchLocale(value);
    if (matched) return matched;
  }
  return FALLBACK_LOCALE;
}

let currentLocale = typeof document === "undefined"
  ? DEFAULT_LOCALE
  : queryLocale() ?? storedLocale() ?? detectLocale();

function interpolate(template, params) {
  return String(template).replace(/\{(\w+)\}/g, (match, key) => (
    Object.hasOwn(params, key) ? String(params[key]) : match
  ));
}

export function translate(key, params = {}, locale = currentLocale) {
  const resolvedLocale = matchLocale(locale) ?? FALLBACK_LOCALE;
  const template = DICTIONARIES[resolvedLocale]?.[key]
    ?? DICTIONARIES[FALLBACK_LOCALE]?.[key]
    ?? DICTIONARIES[DEFAULT_LOCALE]?.[key]
    ?? key;
  return interpolate(template, params);
}

export function t(key, params = {}) {
  return translate(key, params, currentLocale);
}

export function formatCount(unit, count) {
  const form = Number(count) === 1 ? "one" : "other";
  return t(`unit.${unit}.${form}`, { count });
}

export function getLocale() {
  return currentLocale;
}

export function applyDocumentTranslations(
  root = typeof document !== "undefined" ? document : null,
) {
  if (!root || typeof document === "undefined") return;
  const localeInfo = SUPPORTED_LOCALES.find(({ id }) => id === currentLocale);
  document.documentElement.lang = localeInfo?.htmlLang ?? "en";
  document.body.dataset.locale = currentLocale;
  document.title = t("meta.title");
  root.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  root.querySelectorAll("[data-i18n-html]").forEach((element) => {
    element.innerHTML = t(element.dataset.i18nHtml);
  });
  root.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAria));
  });
  const selector = root.querySelector("#languageSelect");
  if (selector) selector.value = currentLocale;
}

export function setLocale(locale, { persist = true } = {}) {
  const matched = matchLocale(locale);
  if (!matched || matched === currentLocale) return currentLocale;
  currentLocale = matched;
  if (persist) {
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, currentLocale);
    } catch {
      // 本地存储不可用时，本次语言切换仍然有效。
    }
  }
  applyDocumentTranslations();
  listeners.forEach((listener) => listener(currentLocale));
  return currentLocale;
}

export function onLocaleChange(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function initI18n() {
  applyDocumentTranslations();
  const selector = document.querySelector("#languageSelect");
  selector?.addEventListener("change", (event) => setLocale(event.currentTarget.value));
  return currentLocale;
}
