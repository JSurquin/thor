import { describe, it, expect } from "vitest";
import { normalizePlaygroundPath } from "./playground-paths";

describe("normalizePlaygroundPath", () => {
  it("ajoute le slash initial et normalise les séparateurs", () => {
    expect(normalizePlaygroundPath("src/foo.js")).toBe("/src/foo.js");
    expect(normalizePlaygroundPath("/src/foo.js")).toBe("/src/foo.js");
    expect(normalizePlaygroundPath("src\\bar\\baz.ts")).toBe("/src/bar/baz.ts");
  });
  it("refuse .. et chaîne vide", () => {
    expect(normalizePlaygroundPath("../x")).toBeNull();
    expect(normalizePlaygroundPath("")).toBeNull();
  });
  it("compacte les doubles slashes en segments", () => {
    expect(normalizePlaygroundPath("a//b/c")).toBe("/a/b/c");
  });
});
