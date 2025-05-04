import { promises } from 'fs';
import { join } from 'path';
import { V, Q, l, j, L } from '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'vinxi/lib/invariant';
import 'vinxi/lib/path';
import 'node:url';
import 'node:async_hooks';
import 'react/jsx-runtime';
import '@tanstack/react-router';
import '@tanstack/react-router-devtools';
import 'node:stream';
import 'react-dom/server';
import 'node:stream/web';
import 'node:fs';
import 'node:path';
import 'node:crypto';

function _(e) {
  if (Array.isArray(e)) return e.flatMap((u) => _(u));
  if (typeof e != "string") return [];
  const r = [];
  let t = 0, n, s, o, i, a;
  const c = () => {
    for (; t < e.length && /\s/.test(e.charAt(t)); ) t += 1;
    return t < e.length;
  }, l = () => (s = e.charAt(t), s !== "=" && s !== ";" && s !== ",");
  for (; t < e.length; ) {
    for (n = t, a = false; c(); ) if (s = e.charAt(t), s === ",") {
      for (o = t, t += 1, c(), i = t; t < e.length && l(); ) t += 1;
      t < e.length && e.charAt(t) === "=" ? (a = true, t = i, r.push(e.slice(n, o)), n = t) : t = o + 1;
    } else t += 1;
    (!a || t >= e.length) && r.push(e.slice(n, e.length));
  }
  return r;
}
function T(e) {
  return e instanceof Headers ? new Headers(e) : Array.isArray(e) ? new Headers(e) : typeof e == "object" ? new Headers(e) : new Headers();
}
function M(...e) {
  return e.reduce((r, t) => {
    const n = T(t);
    for (const [s, o] of n.entries()) s === "set-cookie" ? _(o).forEach((a) => r.append("set-cookie", a)) : r.set(s, o);
    return r;
  }, new Headers());
}
function p(e, r) {
  const t = r || e || {};
  return typeof t.method > "u" && (t.method = "GET"), { options: t, middleware: (n) => p(void 0, Object.assign(t, { middleware: n })), validator: (n) => p(void 0, Object.assign(t, { validator: n })), type: (n) => p(void 0, Object.assign(t, { type: n })), handler: (...n) => {
    const [s, o] = n;
    Object.assign(t, { ...s, extractedFn: s, serverFn: o });
    const i = [...t.middleware || [], H(t)];
    return Object.assign(async (a) => g(i, "client", { ...s, ...t, data: a == null ? void 0 : a.data, headers: a == null ? void 0 : a.headers, signal: a == null ? void 0 : a.signal, context: {} }).then((c) => {
      if (t.response === "full") return c;
      if (c.error) throw c.error;
      return c.result;
    }), { ...s, __executeServer: async (a, c) => {
      const l = a instanceof FormData ? I(a) : a;
      l.type = typeof t.type == "function" ? t.type(l) : t.type;
      const u = { ...s, ...l, signal: c }, h = () => g(i, "server", u).then((d) => ({ result: d.result, error: d.error, context: d.sendContext }));
      if (u.type === "static") {
        let d;
        if ((f == null ? void 0 : f.getItem) && (d = await f.getItem(u)), d || (d = await h().then((v) => ({ ctx: v, error: null })).catch((v) => ({ ctx: void 0, error: v })), (f == null ? void 0 : f.setItem) && await f.setItem(u, d)), V(d), d.error) throw d.error;
        return d.ctx;
      }
      return h();
    } });
  } };
}
async function g(e, r, t) {
  const n = N([...Q, ...e]), s = async (o) => {
    const i = n.shift();
    if (!i) return o;
    i.options.validator && (r !== "client" || i.options.validateClient) && (o.data = await x(i.options.validator, o.data));
    const a = r === "client" ? i.options.client : i.options.server;
    return a ? R(a, o, async (c) => s(c).catch((l) => {
      if (j(l) || L(l)) return { ...c, error: l };
      throw l;
    })) : s(o);
  };
  return s({ ...t, headers: t.headers || {}, sendContext: t.sendContext || {}, context: t.context || {} });
}
let f;
function A(e) {
  const r = f;
  return f = typeof e == "function" ? e() : e, () => {
    f = r;
  };
}
A(() => {
  const e = (n, s) => `/__tsr/staticServerFnCache/${n.functionId}__${s}.json`, r = (n) => JSON.stringify(n != null ? n : "", (i, a) => a && typeof a == "object" && !Array.isArray(a) ? Object.keys(a).sort().reduce((c, l) => (c[l] = a[l], c), {}) : a).replace(/[/\\?%*:|"<>]/g, "-").replace(/\s+/g, "_"), t = typeof document < "u" ? /* @__PURE__ */ new Map() : null;
  return { getItem: async (n) => {
    if (typeof document > "u") {
      const s = r(n.data), o = e(n, s), i = "/Users/martinrodriguez/personal/guesser-game/dist", { promises: a } = await import('node:fs'), l$1 = (await import('node:path')).join(i, o), [u, h] = await a.readFile(l$1, "utf-8").then((d) => [l.parse(d), null]).catch((d) => [null, d]);
      if (h && h.code !== "ENOENT") throw h;
      return u;
    }
  }, setItem: async (n, s) => {
    const { promises: o } = await import('node:fs'), i = await import('node:path'), a = r(n.data), c = e(n, a), u = i.join("/Users/martinrodriguez/personal/guesser-game/dist", c);
    await o.mkdir(i.dirname(u), { recursive: true }), await o.writeFile(u, l.stringify(s));
  }, fetchItem: async (n) => {
    const s = r(n.data), o = e(n, s);
    let i = t == null ? void 0 : t.get(o);
    return i || (i = await fetch(o, { method: "GET" }).then((a) => a.text()).then((a) => l.parse(a)), t == null ? void 0 : t.set(o, i)), i;
  } };
});
function I(e) {
  const r = e.get("__TSR_CONTEXT");
  if (e.delete("__TSR_CONTEXT"), typeof r != "string") return { context: {}, data: e };
  try {
    return { context: l.parse(r), data: e };
  } catch {
    return { data: e };
  }
}
function N(e) {
  const r = /* @__PURE__ */ new Set(), t = [], n = (s) => {
    s.forEach((o) => {
      o.options.middleware && n(o.options.middleware), r.has(o) || (r.add(o), t.push(o));
    });
  };
  return n(e), t;
}
const R = async (e, r, t) => e({ ...r, next: async (n = {}) => {
  var _a, _b;
  return t({ ...r, ...n, context: { ...r.context, ...n.context }, sendContext: { ...r.sendContext, ...(_a = n.sendContext) != null ? _a : {} }, headers: M(r.headers, n.headers), result: n.result !== void 0 ? n.result : r.response === "raw" ? n : r.result, error: (_b = n.error) != null ? _b : r.error });
} });
function x(e, r) {
  if (e == null) return {};
  if ("~standard" in e) {
    const t = e["~standard"].validate(r);
    if (t instanceof Promise) throw new Error("Async validation not supported");
    if (t.issues) throw new Error(JSON.stringify(t.issues, void 0, 2));
    return t.value;
  }
  if ("parse" in e) return e.parse(r);
  if (typeof e == "function") return e(r);
  throw new Error("Invalid validator type!");
}
function H(e) {
  return { _types: void 0, options: { validator: e.validator, validateClient: e.validateClient, client: async ({ next: r, sendContext: t, ...n }) => {
    var s;
    const o = { ...n, context: t, type: typeof n.type == "function" ? n.type(n) : n.type };
    if (n.type === "static" && typeof document < "u") {
      V(f);
      const a = await f.fetchItem(o);
      if (a) {
        if (a.error) throw a.error;
        return r(a.ctx);
      }
      `${o.functionId}${JSON.stringify(o.data)}`;
    }
    const i = await ((s = e.extractedFn) == null ? void 0 : s.call(e, o));
    return r(i);
  }, server: async ({ next: r, ...t }) => {
    var n;
    const s = await ((n = e.serverFn) == null ? void 0 : n.call(e, t));
    return r({ ...t, result: s });
  } } };
}
function $(e) {
  return e.replace(/^\/|\/$/g, "");
}
const C = (e, r, t) => {
  V(t);
  const n = `/${$(r)}/${e}`;
  return Object.assign(t, { url: n, functionId: e });
};
let w = null;
async function F() {
  if (w) return w;
  try {
    if ("undefined" < "u") ; else {
      const e = join(process.cwd(), "public", "characters.json"), r = await promises.readFile(e, "utf-8"), t = JSON.parse(r);
      return w = t, t;
    }
  } catch (e) {
    return console.error("Error loading characters:", e), [];
  }
}
const U = C("src_api_characters_ts--getCharacters_createServerFn_handler", "/_server", (e, r) => G.__executeServer(e, r)), z = C("src_api_characters_ts--getRandomCharacter_createServerFn_handler", "/_server", (e, r) => J.__executeServer(e, r)), G = p({ method: "GET" }).handler(U, async () => F()), J = p({ method: "GET" }).handler(z, async () => {
  const e = await F();
  return e.length === 0 ? null : e[Math.floor(Math.random() * e.length)];
});

export { U as getCharacters_createServerFn_handler, z as getRandomCharacter_createServerFn_handler };
//# sourceMappingURL=characters-DIEoQwIW.mjs.map
