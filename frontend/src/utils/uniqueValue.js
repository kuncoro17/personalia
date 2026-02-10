export const uniqById = (arr, id) => {
  const seen = new Set();

  return arr.filter((o) => !seen.has(o[id]) && seen.add(o[id]));
};
