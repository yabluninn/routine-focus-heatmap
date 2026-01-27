import { load, save } from "./storage.js";

function formatDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function addDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

const state = {
  todayKey: formatDateKey(),
  selectedRoutineId: null,
  data: load(),
};

function getRoutines() {
  return state.data.routines;
}

function getRoutineById(id) {
  const routine = state.data.routines.find((routine) => routine.id === id);
  if (routine === undefined) return null;
  else return routine;
}

function getSelectedRoutine() {
  const routine = state.data.routines.find(
    (routine) => routine.id === state.selectedRoutineId
  );
  if (routine === undefined) return null;
  else return routine;
}

function selectRoutine(id) {
  if (!getRoutineById(id)) {
    state.selectedRoutineId = null;
  } else {
    state.selectedRoutineId = id;
  }

  console.log("Selected RoutineId: ", state.selectedRoutineId);
}

function getTodayKey() {
  return state.todayKey;
}

function updateData(updater) {
  if (typeof updater !== "function") return;

  updater(state.data);
  save(state.data);
}

function deleteRoutine(id) {
  state.data.routines = state.data.routines.filter(
    (routine) => routine.id !== id
  );

  if (id === state.selectedRoutineId) {
    state.selectedRoutineId = null;
  }

  save(state.data);
}

function ensureHistory(todayKey, routineId) {
  let changed = false;

  if (!state.data.history) {
    state.data.history = {};
    changed = true;
  }

  if (!state.data.history[todayKey]) {
    state.data.history[todayKey] = {};
    changed = true;
  }

  if (!state.data.history[todayKey][routineId]) {
    state.data.history[todayKey][routineId] = {
      completedStepIds: [],
      isCompleted: false,
    };
    changed = true;
  }

  if (changed) save(state.data);
}

function getRoutineTodayState(routineId) {
  const todayKey = state.todayKey;
  ensureHistory(todayKey, routineId);

  const todayState = state.data.history[todayKey][routineId];

  return todayState;
}

function getTodayHistoryMap() {
  const todayKey = state.todayKey;
  if (!state.data.history || !state.data.history[todayKey]) return {};
  return state.data.history[todayKey];
}

function toggleStepDone(routineId, stepId) {
  const todayState = getRoutineTodayState(routineId);

  const existsId = todayState.completedStepIds.includes(stepId);

  if (existsId) {
    todayState.completedStepIds = todayState.completedStepIds.filter(
      (id) => id !== stepId
    );
    todayState.isCompleted = false;
  } else {
    todayState.completedStepIds.push(stepId);
  }

  save(state.data);
}

function completeRoutine(routineId) {
  const routine = state.data.routines.find((r) => r.id === routineId);
  if (!routine) return false;

  if (routine.steps.length === 0) return false;

  const todayState = getRoutineTodayState(routineId);

  const allDone = routine.steps.every((step) =>
    todayState.completedStepIds.includes(step.id)
  );

  if (!allDone) return false;

  todayState.isCompleted = true;

  save(state.data);
  return true;
}

function getHistoryDayMap(dateKey) {
  if (!state.data.history || !state.data.history[dateKey]) return {};
  return state.data.history[dateKey];
}

function countCompletedForDate(dateKey) {
  if (!state.data.history || !state.data.history[dateKey]) return 0;

  const dayMap = getHistoryDayMap(dateKey);

  return Object.values(dayMap).filter((r) => r.isCompleted).length;
}

export {
  getRoutines,
  getSelectedRoutine,
  selectRoutine,
  getTodayKey,
  updateData,
  deleteRoutine,
  ensureHistory,
  getRoutineTodayState,
  toggleStepDone,
  completeRoutine,
  getTodayHistoryMap,
  countCompletedForDate,
  formatDateKey,
  addDays,
};
