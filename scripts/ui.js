const INPUT_ERROR_COOLDOWN = 3000;

const createModal = document.querySelector("#create-modal");

const routineNameInput = createModal.querySelector("#routine-name");
const routineColorInput = createModal.querySelector("#routine-color");
const routineGoalInput = createModal.querySelector("#routine-goal");

const nameInputErrorHint = createModal.querySelector(".name-input-error-hint");

let validateInputTimeout = null;

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

function renderRoutinesList() {}

function renderTodayRoutine() {}

export {
  openCreateRoutineModal,
  closeCreateRoutineModal,
  validateInputs,
  getCreateRoutineFormData,
  renderRoutinesList,
  renderTodayRoutine,
};
