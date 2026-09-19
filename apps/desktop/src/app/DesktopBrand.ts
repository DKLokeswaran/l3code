// Fork brand for the packaged desktop app. The build bakes a brand slug in
// through the __T3CODE_DESKTOP_BRAND_SLUG__ define (see
// apps/desktop/vite.config.ts); empty or absent means stock upstream
// identity, so dev runs and upstream builds behave exactly as before.
// A fork sets the slug in its release workflow (see
// .github/workflows/release-fork.yml) and gets separate install identity,
// user-data directory, taskbar id, and Linux desktop entry.

declare const __T3CODE_DESKTOP_BRAND_SLUG__: string | undefined;

export const DESKTOP_BRAND_SLUG: string = (() => {
  if (typeof __T3CODE_DESKTOP_BRAND_SLUG__ !== "string") return "t3code";
  const trimmed = __T3CODE_DESKTOP_BRAND_SLUG__.trim();
  return trimmed === "" ? "t3code" : trimmed;
})();

export interface DesktopBrandNames {
  readonly slug: string;
  // Human-visible base name used for the window title, About panel, etc.
  readonly displayBaseName: string;
  // Packaged user-data directory name (dev keeps its own legacy name).
  readonly userDataDirName: string;
  // Windows taskbar / notification identity default.
  readonly appUserModelId: string;
  // Linux window-manager class and .desktop entry name.
  readonly linuxWmClass: string;
  readonly linuxDesktopEntryName: string;
}

// Pure mapping so the fork identity stays visible and unit-testable. Any
// non-stock slug gets fully generic derived names; keep the release
// workflow's T3CODE_DESKTOP_APP_ID consistent with appUserModelId here.
export function resolveDesktopBrandNames(slug: string): DesktopBrandNames {
  const normalized = slug.trim() === "" ? "t3code" : slug.trim();
  if (normalized === "t3code") {
    return {
      slug: "t3code",
      displayBaseName: "T3 Code",
      userDataDirName: "t3code",
      appUserModelId: "com.t3tools.t3code",
      linuxWmClass: "t3code",
      linuxDesktopEntryName: "com.t3tools.T3Code.desktop",
    };
  }
  return {
    slug: normalized,
    displayBaseName: normalized,
    userDataDirName: normalized,
    appUserModelId: `com.${normalized}.desktop`,
    linuxWmClass: normalized,
    linuxDesktopEntryName: `${normalized}.desktop`,
  };
}

export const DESKTOP_BRAND_NAMES: DesktopBrandNames = resolveDesktopBrandNames(DESKTOP_BRAND_SLUG);
