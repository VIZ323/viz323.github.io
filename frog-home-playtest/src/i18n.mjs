import zhHans from "./locales/zh-Hans.mjs";
import zhHant from "./locales/zh-Hant.mjs";
import en from "./locales/en.mjs";
import ja from "./locales/ja.mjs";
import ko from "./locales/ko.mjs";
import es from "./locales/es.mjs";
import ptBR from "./locales/pt-BR.mjs";
import fr from "./locales/fr.mjs";
import de from "./locales/de.mjs";
import it from "./locales/it.mjs";
import nl from "./locales/nl.mjs";
import ru from "./locales/ru.mjs";
import pl from "./locales/pl.mjs";
import tr from "./locales/tr.mjs";
import ar from "./locales/ar.mjs";
import th from "./locales/th.mjs";
import vi from "./locales/vi.mjs";
import id from "./locales/id.mjs";
import hi from "./locales/hi.mjs";

export const DEFAULT_LOCALE = "zh-Hans";
export const FALLBACK_LOCALE = "en";
export const SUPPORTED_LOCALES = Object.freeze([
  { id: "zh-Hans", htmlLang: "zh-CN", label: "简体中文" },
  { id: "zh-Hant", htmlLang: "zh-TW", label: "繁體中文" },
  { id: "en", htmlLang: "en", label: "English" },
  { id: "ja", htmlLang: "ja", label: "日本語" },
  { id: "ko", htmlLang: "ko", label: "한국어" },
  { id: "es", htmlLang: "es", label: "Español" },
  { id: "pt-BR", htmlLang: "pt-BR", label: "Português (Brasil)" },
  { id: "fr", htmlLang: "fr", label: "Français" },
  { id: "de", htmlLang: "de", label: "Deutsch" },
  { id: "it", htmlLang: "it", label: "Italiano" },
  { id: "nl", htmlLang: "nl", label: "Nederlands" },
  { id: "ru", htmlLang: "ru", label: "Русский" },
  { id: "pl", htmlLang: "pl", label: "Polski" },
  { id: "tr", htmlLang: "tr", label: "Türkçe" },
  { id: "ar", htmlLang: "ar", label: "العربية", direction: "rtl" },
  { id: "th", htmlLang: "th", label: "ไทย" },
  { id: "vi", htmlLang: "vi", label: "Tiếng Việt" },
  { id: "id", htmlLang: "id", label: "Bahasa Indonesia" },
  { id: "hi", htmlLang: "hi", label: "हिन्दी" },
]);

export const LOCALE_DICTIONARIES = Object.freeze({
  "zh-Hans": zhHans,
  "zh-Hant": zhHant,
  en,
  ja,
  ko,
  es,
  "pt-BR": ptBR,
  fr,
  de,
  it,
  nl,
  ru,
  pl,
  tr,
  ar,
  th,
  vi,
  id,
  hi,
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
  if (normalized.startsWith("es")) return "es";
  if (normalized.startsWith("pt")) return "pt-BR";
  if (normalized.startsWith("fr")) return "fr";
  if (normalized.startsWith("de")) return "de";
  if (normalized.startsWith("it")) return "it";
  if (normalized.startsWith("nl")) return "nl";
  if (normalized.startsWith("ru")) return "ru";
  if (normalized.startsWith("pl")) return "pl";
  if (normalized.startsWith("tr")) return "tr";
  if (normalized.startsWith("ar")) return "ar";
  if (normalized.startsWith("th")) return "th";
  if (normalized.startsWith("vi")) return "vi";
  if (normalized === "in" || normalized.startsWith("in-") || normalized.startsWith("id")) return "id";
  if (normalized.startsWith("hi")) return "hi";
  return null;
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
  : detectLocale();
let languageChangeBound = false;

function interpolate(template, params) {
  return String(template).replace(/\{(\w+)\}/g, (match, key) => (
    Object.hasOwn(params, key) ? String(params[key]) : match
  ));
}

export function translate(key, params = {}, locale = currentLocale) {
  const resolvedLocale = matchLocale(locale) ?? FALLBACK_LOCALE;
  const template = LOCALE_DICTIONARIES[resolvedLocale]?.[key]
    ?? LOCALE_DICTIONARIES[FALLBACK_LOCALE]?.[key]
    ?? LOCALE_DICTIONARIES[DEFAULT_LOCALE]?.[key]
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
  document.documentElement.dir = localeInfo?.direction ?? "ltr";
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
}

export function syncLocaleFromSystem(languageValues) {
  const detected = detectLocale(languageValues);
  if (detected === currentLocale) return currentLocale;
  currentLocale = detected;
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
  if (!languageChangeBound) {
    window.addEventListener("languagechange", () => syncLocaleFromSystem());
    languageChangeBound = true;
  }
  return currentLocale;
}
