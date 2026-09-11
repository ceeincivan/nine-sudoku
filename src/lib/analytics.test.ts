import test from "node:test";
import assert from "node:assert/strict";
import {
  initGA,
  isNativeOrInstalledApp,
  trackAppEnvironment,
  trackEvent,
  trackPageView,
} from "./analytics.ts";

test("trackEvent pushes to window.dataLayer when window.gtag is not a function", () => {
  const originalWindow = globalThis.window;
  const mockWindow: any = {
    dataLayer: [],
  };
  (globalThis as any).window = mockWindow;

  trackEvent("test_event", { foo: "bar" });

  assert.equal(mockWindow.dataLayer.length, 1);
  assert.deepEqual(mockWindow.dataLayer[0], ["event", "test_event", { foo: "bar" }]);

  (globalThis as any).window = originalWindow;
});

test("trackEvent calls window.gtag when defined", () => {
  const originalWindow = globalThis.window;
  const calls: any[] = [];
  const mockWindow: any = {
    gtag: (...args: any[]) => {
      calls.push(args);
    },
  };
  (globalThis as any).window = mockWindow;

  trackEvent("test_gtag_event", { score: 100 });

  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0], ["event", "test_gtag_event", { score: 100 }]);

  (globalThis as any).window = originalWindow;
});

test("initGA sets up gtag function and dataLayer on window", () => {
  const originalWindow = globalThis.window;
  const mockWindow: any = {
    matchMedia: () => ({ matches: false }),
    navigator: { userAgent: "Mozilla/5.0" },
  };
  (globalThis as any).window = mockWindow;

  initGA("G-TEST12345");

  assert.ok(Array.isArray(mockWindow.dataLayer));
  assert.equal(typeof mockWindow.gtag, "function");

  (globalThis as any).window = originalWindow;
});

test("isNativeOrInstalledApp detects native or installed app environment correctly", () => {
  const originalWindow = globalThis.window;

  // 1. Browser mode (not standalone)
  (globalThis as any).window = {
    matchMedia: (query: string) => ({ matches: query === "(display-mode: standalone)" ? false : false }),
    navigator: { userAgent: "Mozilla/5.0 (Linux; Android 10) Chrome/100.0.0.0" },
  };
  assert.equal(isNativeOrInstalledApp(), false);

  // 2. Standalone display mode
  (globalThis as any).window = {
    matchMedia: (query: string) => ({ matches: query === "(display-mode: standalone)" }),
    navigator: { userAgent: "Mozilla/5.0" },
  };
  assert.equal(isNativeOrInstalledApp(), true);

  // 3. Android Native / WebView bridge
  (globalThis as any).window = {
    matchMedia: () => ({ matches: false }),
    AndroidNative: { isNativeApk: () => true },
    navigator: { userAgent: "Mozilla/5.0" },
  };
  assert.equal(isNativeOrInstalledApp(), true);

  (globalThis as any).window = originalWindow;
});

test("trackAppEnvironment fires native_apk_install_launch event when native app detected", () => {
  const originalWindow = globalThis.window;

  const events: any[] = [];
  (globalThis as any).window = {
    matchMedia: () => ({ matches: true }),
    navigator: { userAgent: "Mozilla/5.0 Android" },
    gtag: (type: string, name: string, params?: any) => {
      events.push({ type, name, params });
    },
  };

  trackAppEnvironment();

  assert.ok(events.some((e) => e.name === "app_environment" && e.params.is_native_apk === true));
  assert.ok(events.some((e) => e.name === "native_apk_install_launch"));

  (globalThis as any).window = originalWindow;
});

test("trackPageView logs page_view event with correct params", () => {
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;

  const events: any[] = [];
  (globalThis as any).window = {
    gtag: (type: string, name: string, params?: any) => {
      events.push({ type, name, params });
    },
  };
  (globalThis as any).document = { title: "NINE - Sudoku" };

  trackPageView("/game", "NINE Game Screen");

  assert.equal(events.length, 1);
  assert.equal(events[0].name, "page_view");
  assert.deepEqual(events[0].params, {
    page_path: "/game",
    page_title: "NINE Game Screen",
  });

  (globalThis as any).window = originalWindow;
  (globalThis as any).document = originalDocument;
});
