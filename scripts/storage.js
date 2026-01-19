const STORAGE_KEY = "focus_heatmap:v1";

const DEFAULT_DATA = {
  routines: [],
  history: {},
};

function normalizeData(data) {
  if (!data || typeof data !== "object") {
    return { ...DEFAULT_DATA };
  }

  const routines = Array.isArray(data.routines) ? data.routines : [];
  const history =
    data.history &&
    typeof data.history === "object" &&
    Array.isArray(data.history) === false
      ? data.history
      : {};

  return { routines, history };
}

function load() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) return { ...DEFAULT_DATA };

  try {
    const parsedData = JSON.parse(raw);
    return normalizeData(parsedData);
  } catch {
    return { ...DEFAULT_DATA };
  }
}

function save(data) {
  const safeData = normalizeData(data);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(safeData));
}

export { load, save };
