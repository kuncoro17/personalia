export function flattenObject(
  input,
  { sep = ".", arrayIndex = true, trimStrings = true } = {},
) {
  const out = {};

  const walk = (val, path) => {
    if (val === null || typeof val !== "object") {
      const v = trimStrings && typeof val === "string" ? val.trim() : val;

      out[path.join(sep)] = v;

      return;
    }

    if (Array.isArray(val)) {
      if (val.length === 0) {
        out[path.join(sep)] = [];

        return;
      }
      val.forEach((item, i) => {
        const last = path[path.length - 1];
        const key = arrayIndex ? `${last}[${i}]` : last;
        const next = path.slice(0, -1).concat(key);

        walk(item, next);
      });

      return;
    }

    const keys = Object.keys(val);

    if (keys.length === 0) {
      out[path.join(sep)] = {};

      return;
    }
    keys.forEach((k) => walk(val[k], path.concat(k)));
  };

  Object.keys(input || {}).forEach((k) => walk(input[k], [k]));

  return out;
}

export const cloneDeep = (payload) =>
  typeof structuredClone === "function"
    ? structuredClone(payload)
    : JSON.parse(JSON.stringify(payload));

const parsePath = (p) =>
  typeof p === "string"
    ? [...p.matchAll(/([^[.\]]+)|\[(\d+)\]/g)].map((m) => m[1] ?? Number(m[2]))
    : [];

const coerce = (prev, next) =>
  typeof prev === "number" && typeof next === "boolean" ? (next ? 1 : 0) : next;

export const setByPath = (obj, path, val) => {
  if (!obj) return;
  const segs = parsePath(path);

  if (!segs.length) return;

  const keys = obj.data && !(segs[0] in obj) ? ["data", ...segs] : segs;

  let cur = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i],
      nk = keys[i + 1];

    if (typeof k === "number") {
      if (!Array.isArray(cur)) return;
      cur[k] ??= typeof nk === "number" ? [] : {};
      cur = cur[k];
    } else {
      cur[k] ??= typeof nk === "number" ? [] : {};
      cur = cur[k];
    }
  }

  const last = keys[keys.length - 1];

  if (typeof last === "number") {
    if (!Array.isArray(cur)) return;
    cur[last] = coerce(cur[last], val);
  } else {
    cur[last] = coerce(cur[last], val);
  }
};
