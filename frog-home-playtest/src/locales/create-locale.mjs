import en from "./en.mjs";

export function createLocale(overrides) {
  return Object.freeze({ ...en, ...overrides });
}
