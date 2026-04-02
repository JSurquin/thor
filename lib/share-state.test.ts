import { describe, it, expect } from "vitest";
import {
  buildExerciseShareToken,
  parseExerciseShareToken,
  buildPlaygroundShareToken,
  parsePlaygroundShareToken,
} from "./share-state";

describe("parseExerciseShareToken", () => {
  it("rejette un jeton dont l’id ne correspond pas", async () => {
    const tok = await buildExerciseShareToken(
      "ex-a",
      { "/f.txt": "x" },
      "/f.txt"
    );
    expect(tok).toBeTruthy();
    expect(
      await parseExerciseShareToken(tok!, "ex-b")
    ).toBeNull();
  });

  it("restaure fichiers et fichier actif après encodage", async () => {
    const files = { "/a.js": "console.log(1)", "/b.js": "export {}" };
    const tok = await buildExerciseShareToken("my-ex", files, "/b.js");
    expect(tok).toBeTruthy();
    const restored = await parseExerciseShareToken(tok!, "my-ex");
    expect(restored).toEqual({
      files,
      selectedFile: "/b.js",
    });
  });
});

describe("parsePlaygroundShareToken", () => {
  it("restaure le template et les fichiers", async () => {
    const files = { "/App.js": "export default function App() {}" };
    const tok = await buildPlaygroundShareToken("react", files, "/App.js");
    expect(tok).toBeTruthy();
    const restored = await parsePlaygroundShareToken(tok!);
    expect(restored).toEqual({
      templateId: "react",
      files,
      selectedFile: "/App.js",
    });
  });
});
