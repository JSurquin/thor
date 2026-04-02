import { describe, it, expect } from "vitest";
import {
  getLanguage,
  filesToSandpackFormat,
  getSandpackTemplate,
  buildHtmlPreview,
  SANDPACK_TEMPLATE_MAP,
  templateSupportsSandpackPreview,
} from "./playground";
import type { TemplateId } from "./templates";

describe("getLanguage", () => {
  it("returns javascript for .jsx and .tsx", () => {
    expect(getLanguage("/App.jsx")).toBe("javascript");
    expect(getLanguage("/App.tsx")).toBe("javascript");
  });
  it("returns typescript for .ts", () => {
    expect(getLanguage("/index.ts")).toBe("typescript");
  });
  it("returns correct language for common extensions", () => {
    expect(getLanguage("/file.css")).toBe("css");
    expect(getLanguage("/file.html")).toBe("html");
    expect(getLanguage("/file.py")).toBe("python");
    expect(getLanguage("/file.rb")).toBe("ruby");
    expect(getLanguage("/file.json")).toBe("json");
    expect(getLanguage("/file.md")).toBe("markdown");
    expect(getLanguage("/file.yaml")).toBe("yaml");
  });
  it("returns plaintext for unknown", () => {
    expect(getLanguage("/file.xyz")).toBe("plaintext");
  });
  it("returns html for .vue (SFC)", () => {
    expect(getLanguage("/src/App.vue")).toBe("html");
  });
});

describe("filesToSandpackFormat", () => {
  it("strips leading slash from paths", () => {
    const files = { "/App.js": "content" };
    expect(filesToSandpackFormat(files)).toEqual({ "App.js": "content" });
  });
  it("keeps paths without leading slash", () => {
    const files = { "App.js": "content" };
    expect(filesToSandpackFormat(files)).toEqual({ "App.js": "content" });
  });
});

describe("getSandpackTemplate", () => {
  it("returns react for react template", () => {
    expect(getSandpackTemplate("react")).toBe("react");
  });
  it("returns react for next (App Router simulé) and vue for vue", () => {
    expect(getSandpackTemplate("next")).toBe("react");
    expect(getSandpackTemplate("vue")).toBe("vue");
  });
  it("returns vanilla for non-react templates", () => {
    expect(getSandpackTemplate("html")).toBe("vanilla");
    expect(getSandpackTemplate("docker")).toBe("vanilla");
  });
  it("covers all TemplateIds in SANDPACK_TEMPLATE_MAP", () => {
    const ids: TemplateId[] = [
      "react",
      "next",
      "vue",
      "docker",
      "rails",
      "ansible",
      "python",
      "git",
      "bash",
      "go",
      "node",
      "terraform",
      "kubernetes",
      "sql",
      "nginx",
      "makefile",
      "html",
      "rust",
      "typescript",
      "php",
    ];
    for (const id of ids) {
      expect(SANDPACK_TEMPLATE_MAP[id]).toBeDefined();
      expect(getSandpackTemplate(id)).toBe(SANDPACK_TEMPLATE_MAP[id]);
    }
  });
});

describe("templateSupportsSandpackPreview", () => {
  it("is true for react, next, vue", () => {
    expect(templateSupportsSandpackPreview("react")).toBe(true);
    expect(templateSupportsSandpackPreview("next")).toBe(true);
    expect(templateSupportsSandpackPreview("vue")).toBe(true);
  });
  it("is false for html and docker", () => {
    expect(templateSupportsSandpackPreview("html")).toBe(false);
    expect(templateSupportsSandpackPreview("docker")).toBe(false);
  });
});

describe("buildHtmlPreview", () => {
  it("returns fallback when no index.html", () => {
    expect(buildHtmlPreview({})).toContain("Aucun index.html");
  });
  it("inlines style.css when present", () => {
    const files = {
      "/index.html": '<html><head><link rel="stylesheet" href="style.css" /></head><body></body></html>',
      "/style.css": "body { margin: 0; }",
    };
    const result = buildHtmlPreview(files);
    expect(result).toContain("<style>body { margin: 0; }</style>");
    expect(result).not.toContain("href=\"style.css\"");
  });
  it("accepts paths without leading slash", () => {
    const files = {
      "index.html": "<!DOCTYPE html><html><body>Hi</body></html>",
    };
    expect(buildHtmlPreview(files)).toContain("Hi");
  });
  it("injects CSS in head when link tag is missing", () => {
    const files = {
      "/index.html":
        "<!DOCTYPE html><html><head></head><body></body></html>",
      "/style.css": "body { color: red; }",
    };
    const result = buildHtmlPreview(files);
    expect(result).toContain("<style>body { color: red; }</style>");
  });
});
