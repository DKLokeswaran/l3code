import { assert, describe, it } from "@effect/vitest";

import { resolveDesktopBrandNames } from "./DesktopBrand.ts";

describe("resolveDesktopBrandNames", () => {
  it("resolves stock upstream identity", () => {
    assert.deepStrictEqual(resolveDesktopBrandNames("t3code"), {
      slug: "t3code",
      displayBaseName: "T3 Code",
      userDataDirName: "t3code",
      appUserModelId: "com.t3tools.t3code",
      linuxWmClass: "t3code",
      linuxDesktopEntryName: "com.t3tools.T3Code.desktop",
    });
  });

  it("falls back to stock identity for blank slugs", () => {
    assert.deepStrictEqual(resolveDesktopBrandNames("   ").slug, "t3code");
  });

  it("derives fully generic names for a fork slug", () => {
    assert.deepStrictEqual(resolveDesktopBrandNames("l3code"), {
      slug: "l3code",
      displayBaseName: "l3code",
      userDataDirName: "l3code",
      appUserModelId: "com.l3code.desktop",
      linuxWmClass: "l3code",
      linuxDesktopEntryName: "l3code.desktop",
    });
  });
});
