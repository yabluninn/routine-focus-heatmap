const INPUT_ERROR_COOLDOWN = 3000;

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

let validateInputTimeout = null;
let validateEditInputTimeout = null;

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

function renderRoutinesList(routines, selectedRoutine) {
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
      let progress = 0; // temporary

      let selectedRoutineId = -1;

      if (selectedRoutine != null) {
        selectedRoutineId = selectedRoutine.id;
      }

      routinesList.insertAdjacentHTML(
        "beforeend",
        `   <article class="routine-item ${
          routine.id === selectedRoutineId ? "active" : ""
        }" data-routine-id="${routine.id}">
                <div class="routine-item-meta">
                    <div class="routine-color" style="background: ${
                      routine.color
                    };"></div>
                    <p class="routine-name">${routine.name}</p>
                </div>
                <p class="routine-progress">${progress}%</p>
            </article>`
      );
    });
  }
}

function renderRoutineSteps(routine) {
  const todayRoutineStepsList = todayRoutine.querySelector(
    ".today-routine-steps"
  );

  todayRoutineStepsList
    .querySelectorAll(".trs-item")
    .forEach((item) => item.remove());

  if (routine.steps.length > 0) {
  }
}

function renderTodayRoutine(routine) {
  if (routine === null) {
    todayRoutine.classList.add("hidden");
    emptyTodayRoutineState.classList.remove("hidden");
    return;
  } else {
    todayRoutine.classList.remove("hidden");
    emptyTodayRoutineState.classList.add("hidden");

    const todayRoutineName = todayRoutine.querySelector(".today-routine-name");
    todayRoutineName.textContent = routine.name;
  }
}

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
