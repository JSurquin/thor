import { describe, it, expect } from "vitest";
import JSZip from "jszip";
import {
  buildZipBlob,
  buildPlaygroundZipBlob,
  playgroundZipFilename,
  exerciseZipFilename,
  canShareFiles,
} from "./export-zip";

describe("playgroundZipFilename", () => {
  it("includes template id and timestamp", () => {
    expect(playgroundZipFilename("react", 42)).toBe("thor-playground-react-42.zip");
  });
  it("sanitizes special characters in template id", () => {
    expect(playgroundZipFilename("a/b:c", 1)).toBe("thor-playground-a_b_c-1.zip");
  });
});

describe("exerciseZipFilename", () => {
  it("includes exercise id and timestamp", () => {
    expect(exerciseZipFilename("vue-ref", 7)).toBe("thor-exercise-vue-ref-7.zip");
  });
});

describe("buildZipBlob / buildPlaygroundZipBlob", () => {
  it("buildZipBlob matches legacy alias", async () => {
    const a = await buildZipBlob({ "/x.txt": "1" });
    const b = await buildPlaygroundZipBlob({ "/x.txt": "1" });
    expect(a.size).toBe(b.size);
  });
  it("includes files with or without leading slash", async () => {
    const blob = await buildZipBlob({
      "/a.txt": "hello",
      "b.txt": "x",
    });
    const zip = await JSZip.loadAsync(blob);
    expect(await zip.file("a.txt")?.async("string")).toBe("hello");
    expect(await zip.file("b.txt")?.async("string")).toBe("x");
  });
  it("uses empty string for undefined-like content keys still present", async () => {
    const blob = await buildZipBlob({ "/c.txt": "" });
    const zip = await JSZip.loadAsync(blob);
    expect(await zip.file("c.txt")?.async("string")).toBe("");
  });
  it("skips unsafe paths", async () => {
    const blob = await buildZipBlob({
      "../evil": "no",
      "safe/../x": "no",
      "ok.txt": "yes",
    });
    const zip = await JSZip.loadAsync(blob);
    const fileKeys = Object.keys(zip.files).filter(
      (k) => !zip.files[k]?.dir && k !== "ok.txt"
    );
    expect(fileKeys).toEqual([]);
    expect(await zip.file("ok.txt")?.async("string")).toBe("yes");
  });
});

describe("canShareFiles", () => {
  it("is false when navigator.canShare is unavailable", () => {
    expect(canShareFiles([new File([""], "t.zip")])).toBe(false);
  });
});
