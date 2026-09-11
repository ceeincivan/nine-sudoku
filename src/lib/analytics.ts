declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    // Android WebInterface or Capacitor/Cordova native bridges if present
    AndroidNative?: {
      isNativeApk?: () => boolean;
      getAppVersion?: () => string;
    };
    Capacitor?: {
      isNativePlatform?: () => boolean;
    };
  }
}

export const GA_MEASUREMENT_ID =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_GA_MEASUREMENT_ID) ||
  (typeof process !== "undefined" && process.env?.VITE_GA_MEASUREMENT_ID) ||
  "G-MEASUREMENT_ID";

/**
 * Initialize Google Analytics dataLayer and gtag function on window if not already present.
 */
export function initGA(measurementId: string = GA_MEASUREMENT_ID): void {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag(...args: any[]) {
      window.dataLayer?.push(args);
    };
  }

  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    send_page_view: true,
  });

  // Track APK / Standalone app installation mode or native environment
  trackAppEnvironment();
}

/**
 * Checks if the application is running in standalone mode (PWA / Installed APK / Webview / Native Container).
 */
export function isNativeOrInstalledApp(): boolean {
  if (typeof window === "undefined") return false;

  const isStandalone =
    (typeof window.matchMedia === "function" && window.matchMedia("(display-mode: standalone)")?.matches) ||
    Boolean((window.navigator as any)?.standalone);

  const isAndroidWebview =
    typeof window.AndroidNative !== "undefined" ||
    (typeof window.Capacitor !== "undefined" && Boolean(window.Capacitor.isNativePlatform?.()));

  const userAgent = typeof window.navigator?.userAgent === "string" ? window.navigator.userAgent : "";
  const isApkWebview = /wv|Android.*Version\/[\d.]+/i.test(userAgent);

  return Boolean(isStandalone || isAndroidWebview || isApkWebview);
}

/**
 * Track app environment, detecting full native APK installs / standalone mode.
 */
export function trackAppEnvironment(): void {
  const isNative = isNativeOrInstalledApp();
  const displayMode =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(display-mode: standalone)")?.matches
      ? "standalone"
      : "browser";

  trackEvent("app_environment", {
    is_native_apk: isNative,
    display_mode: displayMode,
    user_agent: typeof window !== "undefined" && typeof window.navigator?.userAgent === "string" ? window.navigator.userAgent : "",
  });

  if (isNative) {
    trackEvent("native_apk_install_launch", {
      event_category: "App Install",
      event_label: "Native APK Full Install Launch",
    });
  }
}

/**
 * Helper to safely record a Google Analytics custom event.
 */
export function trackEvent(
  action: string,
  params?: Record<string, any>
): void {
  if (typeof window === "undefined") return;

  if (typeof window.gtag === "function") {
    window.gtag("event", action, params);
  } else {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(["event", action, params]);
  }
}

/**
 * Helper to track pageviews.
 */
export function trackPageView(pagePath: string, pageTitle?: string): void {
  trackEvent("page_view", {
    page_path: pagePath,
    page_title: pageTitle || (typeof document !== "undefined" ? document.title : ""),
  });
}

// Automatically install & initialize GA on load if client window exists
if (typeof window !== "undefined") {
  initGA(GA_MEASUREMENT_ID);
}
