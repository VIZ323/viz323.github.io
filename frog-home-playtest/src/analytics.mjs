export function track(event, properties = {}) {
  const payload = {
    event,
    properties,
    timestamp: new Date().toISOString(),
  };
  try {
    globalThis.window?.__frogAnalytics?.track?.(event, properties);
  } catch {
    // 第三方统计不可用时不影响游戏。
  }
  try {
    globalThis.window?.dispatchEvent?.(new CustomEvent("frog-home:analytics", {
      detail: payload,
    }));
  } catch {
    // 小游戏平台可能不支持 CustomEvent，忽略即可。
  }
  return payload;
}
