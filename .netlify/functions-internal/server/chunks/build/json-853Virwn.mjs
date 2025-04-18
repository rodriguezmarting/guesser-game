function f(e) {
  if (Array.isArray(e)) return e.flatMap((d) => f(d));
  if (typeof e != "string") return [];
  const r = [];
  let t = 0, n, s, a, h, l;
  const u = () => {
    for (; t < e.length && /\s/.test(e.charAt(t)); ) t += 1;
    return t < e.length;
  }, p = () => (s = e.charAt(t), s !== "=" && s !== ";" && s !== ",");
  for (; t < e.length; ) {
    for (n = t, l = false; u(); ) if (s = e.charAt(t), s === ",") {
      for (a = t, t += 1, u(), h = t; t < e.length && p(); ) t += 1;
      t < e.length && e.charAt(t) === "=" ? (l = true, t = h, r.push(e.slice(n, a)), n = t) : t = a + 1;
    } else t += 1;
    (!l || t >= e.length) && r.push(e.slice(n, e.length));
  }
  return r;
}
function o(e) {
  return e instanceof Headers ? new Headers(e) : Array.isArray(e) ? new Headers(e) : typeof e == "object" ? new Headers(e) : new Headers();
}
function c(...e) {
  return e.reduce((r, t) => {
    const n = o(t);
    for (const [s, a] of n.entries()) s === "set-cookie" ? f(a).forEach((l) => r.append("set-cookie", l)) : r.set(s, a);
    return r;
  }, new Headers());
}
function w(e, r) {
  return new Response(JSON.stringify(e), { ...r, headers: c({ "content-type": "application/json" }, r == null ? void 0 : r.headers) });
}

export { w };
//# sourceMappingURL=json-853Virwn.mjs.map
