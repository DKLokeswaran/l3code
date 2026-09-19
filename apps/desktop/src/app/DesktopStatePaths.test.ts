import { assert, describe, it } from "@effect/vitest";

import { resolveBrandEncryptedStateFilePath } from "./DesktopStatePaths.ts";

const joinPath = (first: string, ...segments: string[]) => [first, ...segments].join("/");

describe("resolveBrandEncryptedStateFilePath", () => {
  it("keeps the stock file name so upstream layouts and installs do not move", () => {
    assert.equal(
      resolveBrandEncryptedStateFilePath({
        stateDir: "/home/alice/.t3/userdata",
        fileName: "connection-catalog.json",
        brandSlug: "t3code",
        joinPath,
      }),
      "/home/alice/.t3/userdata/connection-catalog.json",
    );
  });

  it("gives a fork its own copy beside the stock file", () => {
    assert.equal(
      resolveBrandEncryptedStateFilePath({
        stateDir: "/home/alice/.t3/userdata",
        fileName: "saved-environments.json",
        brandSlug: "l3code",
        joinPath,
      }),
      "/home/alice/.t3/userdata/saved-environments.l3code.json",
    );
  });

  it("appends the brand slug when the file name has no extension", () => {
    assert.equal(
      resolveBrandEncryptedStateFilePath({
        stateDir: "/home/alice/.t3/userdata",
        fileName: "connection-catalog",
        brandSlug: "l3code",
        joinPath,
      }),
      "/home/alice/.t3/userdata/connection-catalog.l3code",
    );
  });
});
