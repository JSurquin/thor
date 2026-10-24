"use client";

import Editor, { loader } from "@monaco-editor/react";

// Assets are prepared by predev/prebuild; browser editing needs no external CDN.
loader.config({ paths: { vs: "/vendor/monaco/vs" } });

export default Editor;
