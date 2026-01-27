import { countCompletedForDate } from "./state.js";

const INPUT_ERROR_COOLDOWN = 3000;
const TRUNCATE_LONG_STRINGS_MAX = 10;

const createModal = document.querySelector("#create-modal");
const editRoutineModal = document.querySelector("#edit-routine-modal");

const routineNameInput = createModal.querySelector("#routine-name");
const routineColorInput = createModal.querySelector("#routine-color");
const routineGoalInput = createModal.querySelector("#routine-goal");
const editRoutineNameInput =
  editRoutineModal.querySelector("#edit-routine-name");
const editRoutineColorInput = editRoutineModal.querySelector(
  "#edit-routine-color"
);
const editRoutineGoalInput =
  editRoutineModal.querySelector("#edit-routine-goal");

const nameInputErrorHint = createModal.querySelector(".name-input-error-hint");
const editNameInputErrorHint = editRoutineModal.querySelector(
  ".name-input-error-hint"
);

const routinesList = document.querySelector(".routines-list");
const emptyRoutinesListState = document.querySelector(".routines-empty-state");

const todayRoutine = document.querySelector(".today-routine");
const emptyTodayRoutineState = document.querySelector(".today-empty-state");

const todayRoutineStepsList = todayRoutine.querySelector(
  ".today-routine-steps"
);
const todayRoutineStepsListContainer =
  todayRoutineStepsList.querySelector(".trs-list");
const routineStepsEmptyState =
  todayRoutineStepsList.querySelector(".trs-empty-state");
const addStepsButton = todayRoutineStepsList.querySelector(
  ".trs-new-step-button"
);
const todayRoutineProgressLabel = todayRoutine.querySelector(
  ".today-routine-progress"
);
const todayRoutineCompleteButton = todayRoutine.querySelector(
  ".today-routine-complete-button"
);

const addStepInputWrapper = todayRoutineStepsList.querySelector(
  ".trs-new-step-input-wrapper"
);
const addStepInput = addStepInputWrapper.querySelector(".trs-new-step-input");

const cancelAddingStepButton = addStepInputWrapper.querySelector(
  ".trs-new-step-cancel-button"
);

const heatmapContainer = document.querySelector(".heatmap-container");

let validateInputTimeout = null;
let validateEditInputTimeout = null;

function truncateLongString(str) {
  return str.slice(0, TRUNCATE_LONG_STRINGS_MAX) + "...";
}

function resetRoutineForm() {
  routineNameInput.value = "";
  routineColorInput.value = "#000000";
  routineGoalInput.value = "";

  clearTimeout(validateInputTimeout);

  routineNameInput.classList.remove("input-error");
  nameInputErrorHint.classList.add("hidden");
}

function openCreateRoutineModal() {
  createModal.classList.remove("hidden");
  routineNameInput.focus();
}

function closeCreateRoutineModal() {
  createModal.classList.add("hidden");
  resetRoutineForm();
}

function openEditRoutineModal(selectedRoutine) {
  editRoutineModal.classList.remove("hidden");
  editRoutineNameInput.focus();

  editRoutineNameInput.value = selectedRoutine.name;
  editRoutineColorInput.value = selectedRoutine.color;
  editRoutineGoalInput.value = selectedRoutine.weeklyGoal;
}

function closeEditRoutineModal() {
  editRoutineModal.classList.add("hidden");
}

function validateInputs() {
  if (routineNameInput.value.trim() === "") {
    routineNameInput.classList.add("input-error");
    nameInputErrorHint.classList.remove("hidden");

    clearTimeout(validateInputTimeout);

    validateInputTimeout = setTimeout(() => {
      routineNameInput.classList.remove("input-error");
      nameInputErrorHint.classList.add("hidden");
    }, INPUT_ERROR_COOLDOWN);

    return false;
  } else return true;
}

function validateEditInputs() {
  if (editRoutineNameInput.value.trim() === "") {
    editRoutineNameInput.classList.add("input-error");
    editNameInputErrorHint.classList.remove("hidden");

    clearTimeout(validateEditInputTimeout);

    validateEditInputTimeout = setTimeout(() => {
      editRoutineNameInput.classList.remove("input-error");
      editNameInputErrorHint.classList.add("hidden");
    }, INPUT_ERROR_COOLDOWN);

    return false;
  } else return true;
}

function getCreateRoutineFormData() {
  const name = routineNameInput.value.trim();
  const color = routineColorInput.value;
  const rawGoal = routineGoalInput.value.trim();

  let weeklyGoal = 0;

  if (rawGoal === "") weeklyGoal = 5;
  else {
    weeklyGoal = Number(rawGoal);

    if (weeklyGoal <= 0) weeklyGoal = 1;
    if (weeklyGoal > 7) weeklyGoal = 7;
  }
  return { name, color, weeklyGoal };
}

function getEditRoutineFormData() {
  const name = editRoutineNameInput.value.trim();
  const color = editRoutineColorInput.value;
  const rawGoal = editRoutineGoalInput.value.trim();

  let weeklyGoal = 0;

  if (rawGoal === "") weeklyGoal = 5;
  else {
    weeklyGoal = Number(rawGoal);

    if (weeklyGoal <= 0) weeklyGoal = 1;
    if (weeklyGoal > 7) weeklyGoal = 7;
  }
  return { name, color, weeklyGoal };
}

function renderRoutinesList(routines, selectedRoutine, todayHistoryMap) {
  if (routines.length === 0) {
    emptyRoutinesListState.classList.remove("hidden");

    routinesList
      .querySelectorAll(".routine-item")
      .forEach((item) => item.remove());

    return;
  } else if (routines.length > 0) {
    emptyRoutinesListState.classList.add("hidden");

    routinesList
      .querySelectorAll(".routine-item")
      .forEach((item) => item.remove());

    routines.forEach((routine) => {
      const totalSteps = routine.steps.length;

      const routineToday = todayHistoryMap?.[routine.id] ?? {
        completedStepIds: [],
      };

      const existingStepIds = new Set(routine.steps.map((s) => s.id));
      const doneSteps = routineToday.completedStepIds.filter((id) =>
        existingStepIds.has(id)
      ).length;

      const progress =
        totalSteps === 0 ? 0 : Math.round((doneSteps / totalSteps) * 100);

      let selectedRoutineId = -1;

      if (selectedRoutine != null) {
        selectedRoutineId = selectedRoutine.id;
      }

      const routineName = truncateLongString(routine.name);

      routinesList.insertAdjacentHTML(
        "beforeend",
        `   <article class="routine-item ${
          routine.id === selectedRoutineId ? "active" : ""
        }" data-routine-id="${routine.id}" title="${routine.name}">
                <div class="routine-item-meta">
                    <div class="routine-color" style="background: ${
                      routine.color
                    };"></div>
                    <p class="routine-name">${routineName}</p>
                </div>
                <p class="routine-progress">${progress}%</p>
            </article>`
      );
    });
  }
}

function renderRoutineSteps(routine, todayState) {
  todayRoutineStepsListContainer
    .querySelectorAll(".trs-item")
    .forEach((item) => item.remove());

  if (routine.steps.length === 0) {
    routineStepsEmptyState.classList.remove("hidden");

    return;
  } else if (routine.steps.length > 0) {
    routineStepsEmptyState.classList.add("hidden");

    routine.steps.forEach((step) => {
      const done = todayState.completedStepIds.includes(step.id);
      todayRoutineStepsListContainer.insertAdjacentHTML(
        "beforeend",
        `
              <div class="trs-item" data-step-id="${step.id}">
                <div class="trs-item-meta">
                  <div class="checkbox-wrapper-30">
                    <span class="checkbox">
                      <input
                        type="checkbox"
                        name="inpId"
                        id="step-${step.id}"
                        class="trs-input"
                        ${done ? "checked" : ""}
                      />
                      <svg>
                        <use xlink:href="#checkbox-30" class="checkbox"></use>
                      </svg>
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      style="display: none"
                    >
                      <symbol id="checkbox-30" viewBox="0 0 22 22">
                        <path
                          fill="none"
                          stroke="currentColor"
                          d="M5.5,11.3L9,14.8L20.2,3.3l0,0c-0.5-1-1.5-1.8-2.7-1.8h-13c-1.7,0-3,1.3-3,3v13c0,1.7,1.3,3,3,3h13 c1.7,0,3-1.3,3-3v-13c0-0.4-0.1-0.8-0.3-1.2"
                        />
                      </symbol>
                    </svg>
                  </div>
                  <p class="trs-step-label ${done ? "done" : ""}">${
          step.name
        }</p>
                  <input type="text" class="trs-item-step-name-input hidden" />
                </div>
                <div class="trs-item-action-buttons">
                  <button class="trs-move-up" type="button" title="Move up">
                    <i class="fa-solid fa-arrow-up"></i>
                  </button>
                  <button class="trs-move-down" type="button" title="Move down">
                    <i class="fa-solid fa-arrow-down"></i>
                  </button>
                  <button class="trs-delete-button" type="button" title="Delete">
                    <i class="fa-regular fa-trash-can"></i>
                  </button>
                </div>
              </div>`
      );
    });
  }
}

function renderTodayRoutine(routine, todayState) {
  if (routine === null) {
    todayRoutine.classList.add("hidden");
    emptyTodayRoutineState.classList.remove("hidden");
    return;
  } else {
    todayRoutine.classList.remove("hidden");
    emptyTodayRoutineState.classList.add("hidden");

    const todayRoutineName = todayRoutine.querySelector(".today-routine-name");
    todayRoutineName.textContent = routine.name;

    if (!todayState) {
      todayState = { completedStepIds: [], isCompleted: false };
    }

    const totalSteps = routine.steps.length;
    const existingStepIds = new Set(routine.steps.map((s) => s.id));
    const doneSteps = todayState.completedStepIds.filter((id) =>
      existingStepIds.has(id)
    ).length;

    const progress =
      totalSteps === 0 ? 0 : Math.round((doneSteps / totalSteps) * 100);

    todayRoutineProgressLabel.textContent = `Progress: ${progress}%`;

    const canComplete = totalSteps > 0 && doneSteps === totalSteps;
    const isBlocked = !canComplete || todayState.isCompleted;

    todayRoutineCompleteButton.classList.toggle("disabled-complete", isBlocked);
    todayRoutineCompleteButton.disabled = isBlocked;
    todayRoutineCompleteButton.textContent = todayState.isCompleted
      ? "Completed"
      : "Complete";

    renderRoutineSteps(routine, todayState);
  }
}

addStepsButton.addEventListener("click", () => {
  addStepsButton.classList.add("hidden");
  addStepInputWrapper.classList.remove("hidden");
  addStepInput.focus();
});

cancelAddingStepButton.addEventListener("click", () => {
  addStepsButton.classList.remove("hidden");
  addStepInputWrapper.classList.add("hidden");
});

function renderHeatmapGrid({
  container,
  getCompletedCountForDay,
  endDate = new Date(),
  days = 28,
  weekStartsOn = 1,
} = {}) {
  if (!container) return;
  if (typeof getCompletedCountForDay !== "function") return;

  const startOfDay = (date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const addDays = (date, n) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate() + n);

  const formatDateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const startOfWeek = (date, weekStartsOn = 1) => {
    const d = startOfDay(date);
    const dow = d.getDay();
    const diff = (dow - weekStartsOn + 7) % 7;
    return addDays(d, -diff);
  };

  const rangeEnd = startOfDay(endDate);
  const rangeStart = addDays(rangeEnd, -(days - 1));

  const gridStart = addDays(startOfWeek(rangeEnd, weekStartsOn), -21);

  const getLevel = (completedCount) => {
    if (completedCount <= 0) return 0;
    if (completedCount === 1) return 1;
    if (completedCount === 2) return 2;
    if (completedCount === 3) return 3;
    if (completedCount === 4) return 4;
    return 5;
  };

  for (let i = 0; i < 28; i++) {
    const date = addDays(gridStart, i);
    const key = formatDateKey(date);

    const inRange = date >= rangeStart && date <= rangeEnd;

    const completedCount = inRange ? getCompletedCountForDay(key) : 0;
    const lvl = getLevel(completedCount);

    const cell = document.createElement("div");
    cell.className = `heatmap-item heatmap-item-lvl-${lvl}${
      inRange ? "" : " out-of-range"
    }`;
    cell.dataset.dateKey = key;
    cell.dataset.count = String(completedCount);

    cell.title = `${key} — completed routines: ${completedCount}`;

    container.appendChild(cell);
  }
}

renderHeatmapGrid({
  container: heatmapContainer,
  getCompletedCountForDay: countCompletedForDate,
});

export {
  openCreateRoutineModal,
  closeCreateRoutineModal,
  openEditRoutineModal,
  closeEditRoutineModal,
  validateInputs,
  validateEditInputs,
  getCreateRoutineFormData,
  getEditRoutineFormData,
  renderRoutinesList,
  renderTodayRoutine,
};
