/** Partage d’état via URL (gzip + base64url si disponible, sinon JSON brut). */

import type { TemplateId } from "./templates";
import { TEMPLATE_IDS } from "./templates";

export const SHARE_URL_MAX_CHARS = 7500;

function isTemplateId(s: string): s is TemplateId {
  return (TEMPLATE_IDS as readonly string[]).includes(s);
}

export type PlaygroundShareHydrate = {
  templateId: TemplateId;
  files: Record<string, string>;
  selectedFile: string;
};

export type PlaygroundSharePayload = {
  v: 1;
  k: "pg";
  t: string;
  f: Record<string, string>;
  a: string;
};

export type ExerciseSharePayload = {
  v: 1;
  k: "ex";
  id: string;
  f: Record<string, string>;
  a: string;
};

const PREFIX_GZIP = "g1.";
const PREFIX_RAW = "u1.";

function concatUint8(chunks: Uint8Array[]): Uint8Array {
  const n = chunks.reduce((acc, c) => acc + c.length, 0);
  const out = new Uint8Array(n);
  let o = 0;
  for (const c of chunks) {
    out.set(c, o);
    o += c.length;
  }
  return out;
}

export function toBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]!);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function fromBase64Url(s: string): Uint8Array {
  let b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function gzipBytes(text: string): Promise<Uint8Array> {
  const input = new TextEncoder().encode(text);
  const cs = new CompressionStream("gzip");
  const w = cs.writable.getWriter();
  const r = cs.readable.getReader();
  void w.write(input);
  void w.close();
  const chunks: Uint8Array[] = [];
  for (;;) {
    const { done, value } = await r.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  return concatUint8(chunks);
}

async function gunzipBytes(buf: Uint8Array): Promise<string> {
  const ds = new DecompressionStream("gzip");
  const w = ds.writable.getWriter();
  const r = ds.readable.getReader();
  const copy = new Uint8Array(buf);
  void w.write(copy);
  void w.close();
  const chunks: Uint8Array[] = [];
  for (;;) {
    const { done, value } = await r.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  return new TextDecoder().decode(concatUint8(chunks));
}

export async function encodeSharePayload(obj: unknown): Promise<string | null> {
  const json = JSON.stringify(obj);
  try {
    if (typeof CompressionStream !== "undefined") {
      const gz = await gzipBytes(json);
      return PREFIX_GZIP + toBase64Url(gz);
    }
  } catch {
    /* fallback raw */
  }
  return PREFIX_RAW + toBase64Url(new TextEncoder().encode(json));
}

export async function decodeSharePayload<T>(raw: string): Promise<T | null> {
  const s = raw.trim();
  if (!s) return null;
  try {
    if (s.startsWith(PREFIX_GZIP)) {
      const buf = fromBase64Url(s.slice(PREFIX_GZIP.length));
      const text = await gunzipBytes(buf);
      return JSON.parse(text) as T;
    }
    if (s.startsWith(PREFIX_RAW)) {
      const text = new TextDecoder().decode(
        fromBase64Url(s.slice(PREFIX_RAW.length))
      );
      return JSON.parse(text) as T;
    }
    const text = new TextDecoder().decode(fromBase64Url(s));
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export function buildShareUrl(pathWithQueryBase: string, token: string): string {
  if (typeof window === "undefined")
    return pathWithQueryBase + `?s=${encodeURIComponent(token)}`;
  const u = new URL(pathWithQueryBase, window.location.origin);
  u.searchParams.set("s", token);
  return u.toString();
}

export async function parsePlaygroundShareToken(
  token: string
): Promise<PlaygroundShareHydrate | null> {
  const p = await decodeSharePayload<PlaygroundSharePayload>(token);
  if (!p || p.v !== 1 || p.k !== "pg") return null;
  if (!isTemplateId(p.t)) return null;
  if (!p.f || typeof p.f !== "object") return null;
  if (typeof p.a !== "string") return null;
  return { templateId: p.t, files: p.f, selectedFile: p.a };
}

export async function parseExerciseShareToken(
  token: string,
  exerciseId: string
): Promise<{ files: Record<string, string>; selectedFile: string } | null> {
  const p = await decodeSharePayload<ExerciseSharePayload>(token);
  if (!p || p.v !== 1 || p.k !== "ex") return null;
  if (p.id !== exerciseId) return null;
  if (!p.f || typeof p.f !== "object") return null;
  if (typeof p.a !== "string") return null;
  return { files: p.f, selectedFile: p.a };
}

export async function buildPlaygroundShareToken(
  templateId: TemplateId,
  files: Record<string, string>,
  activeFile: string
): Promise<string | null> {
  const payload: PlaygroundSharePayload = {
    v: 1,
    k: "pg",
    t: templateId,
    f: files,
    a: activeFile,
  };
  const enc = await encodeSharePayload(payload);
  if (enc && enc.length > SHARE_URL_MAX_CHARS) return null;
  return enc;
}

export async function buildExerciseShareToken(
  exerciseId: string,
  files: Record<string, string>,
  activeFile: string
): Promise<string | null> {
  const payload: ExerciseSharePayload = {
    v: 1,
    k: "ex",
    id: exerciseId,
    f: files,
    a: activeFile,
  };
  const enc = await encodeSharePayload(payload);
  if (enc && enc.length > SHARE_URL_MAX_CHARS) return null;
  return enc;
}
