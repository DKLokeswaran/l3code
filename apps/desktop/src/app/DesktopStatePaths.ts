import * as Option from "effect/Option";

export type JoinPath = (first: string, ...segments: string[]) => string;

function normalizeConfiguredBaseDir(t3Home: Option.Option<string>): Option.Option<string> {
  if (Option.isNone(t3Home)) {
    return Option.none();
  }
  const trimmed = t3Home.value.trim();
  return trimmed.length > 0 ? Option.some(trimmed) : Option.none();
}

export function resolveDesktopBaseDir(input: {
  readonly homeDirectory: string;
  readonly joinPath: JoinPath;
  readonly t3Home: Option.Option<string>;
}): string {
  return Option.getOrElse(normalizeConfiguredBaseDir(input.t3Home), () =>
    input.joinPath(input.homeDirectory, ".t3"),
  );
}

export function resolveDesktopStateDir(input: {
  readonly baseDir: string;
  readonly isDevelopment: boolean;
  readonly joinPath: JoinPath;
  readonly t3Home: Option.Option<string>;
}): string {
  const useDevSubdir =
    input.isDevelopment && Option.isNone(normalizeConfiguredBaseDir(input.t3Home));
  return input.joinPath(input.baseDir, useDevSubdir ? "dev" : "userdata");
}

/**
 * Electron's safeStorage key belongs to the app that created it: it lives in
 * that install's own user-data directory, so a file one desktop build encrypts
 * is unreadable to another build that shares the same T3 home. Give every
 * non-stock brand its own copy of those files so a fork and upstream cannot
 * invalidate each other's state, while both keep sharing the plaintext state
 * (projects, threads, settings) that lives beside them. Stock keeps the bare
 * file name so upstream layouts and existing installs never move.
 */
export function resolveBrandEncryptedStateFilePath(input: {
  readonly stateDir: string;
  readonly fileName: string;
  readonly brandSlug: string;
  readonly joinPath: JoinPath;
}): string {
  const { stateDir, fileName, brandSlug, joinPath } = input;
  if (brandSlug === "t3code") {
    return joinPath(stateDir, fileName);
  }
  const extensionIndex = fileName.lastIndexOf(".");
  if (extensionIndex <= 0) {
    return joinPath(stateDir, `${fileName}.${brandSlug}`);
  }
  return joinPath(
    stateDir,
    `${fileName.slice(0, extensionIndex)}.${brandSlug}${fileName.slice(extensionIndex)}`,
  );
}
