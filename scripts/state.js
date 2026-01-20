import { load, save } from "./storage.js";

function formatDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
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

export {
  getRoutines,
  getSelectedRoutine,
  selectRoutine,
  getTodayKey,
  updateData,
};
