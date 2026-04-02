import { describe, it, expect } from "vitest";
import { TEMPLATES, TEMPLATE_IDS, type TemplateId } from "./templates";

describe("TEMPLATES", () => {
  it("exports all template ids", () => {
    expect(TEMPLATE_IDS.length).toBeGreaterThan(0);
    expect(TEMPLATE_IDS).toContain("react");
    expect(TEMPLATE_IDS).toContain("html");
  });

  it("every TEMPLATE_IDS key exists in TEMPLATES", () => {
    for (const id of TEMPLATE_IDS) {
      expect(TEMPLATES[id as TemplateId]).toBeDefined();
    }
  });

  it("each template has required shape", () => {
    for (const id of TEMPLATE_IDS) {
      const t = TEMPLATES[id as TemplateId];
      expect(t).toHaveProperty("id", id);
      expect(t).toHaveProperty("name");
      expect(t).toHaveProperty("description");
      expect(t).toHaveProperty("icon");
      expect(t).toHaveProperty("files");
      expect(t).toHaveProperty("entryFile");
      expect(typeof t.files).toBe("object");
      expect(t.entryFile).toBeTruthy();
      expect(t.files[t.entryFile]).toBeDefined();
    }
  });

  it("react template has expected files", () => {
    const react = TEMPLATES.react;
    expect(react.files["/App.js"]).toBeDefined();
    expect(react.files["/index.js"]).toBeDefined();
    expect(react.files["/index.html"]).toBeDefined();
    expect(react.entryFile).toBe("/App.js");
  });

  it("next template uses App Router paths", () => {
    const next = TEMPLATES.next;
    expect(next.entryFile).toBe("/app/page.jsx");
    expect(next.files["/app/page.jsx"]).toBeDefined();
    expect(next.files["/app/layout.jsx"]).toContain("globals.css");
    expect(next.files["/index.js"]).toContain("Page");
  });

  it("vue template has SFC and entry", () => {
    const vue = TEMPLATES.vue;
    expect(vue.entryFile).toBe("/src/App.vue");
    expect(vue.files["/src/App.vue"]).toContain("<template>");
    expect(vue.files["/src/main.js"]).toContain("createApp");
  });

  it("html template has index.html and style.css", () => {
    const html = TEMPLATES.html;
    expect(html.files["/index.html"]).toContain("<!DOCTYPE html>");
    expect(html.files["/style.css"]).toBeDefined();
  });
});
