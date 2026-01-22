import {
  deleteRoutine,
  getRoutines,
  getSelectedRoutine,
  selectRoutine,
  updateData,
} from "./state.js";
import {
  closeCreateRoutineModal,
  closeEditRoutineModal,
  getCreateRoutineFormData,
  getEditRoutineFormData,
  openCreateRoutineModal,
  openEditRoutineModal,
  renderRoutinesList,
  renderTodayRoutine,
  validateEditInputs,
  validateInputs,
} from "./ui.js";

function renderApp() {
  const selectedRoutine = getSelectedRoutine();
  renderRoutinesList(getRoutines(), selectedRoutine);
  renderTodayRoutine(selectedRoutine);
}

const newRoutineButton = document.querySelector(".header-action-button");

const createModal = document.querySelector("#create-modal");
const editRoutineModal = document.querySelector("#edit-routine-modal");

const createRoutineButton = createModal.querySelector(".create");
const closeCreateModalButton = createModal.querySelector(".cancel");
const openEditModalButton = document.querySelector(
  ".today-routine-edit-button"
);
const closeEditRoutineButton = editRoutineModal.querySelector(".cancel");

const editRoutineButton = editRoutineModal.querySelector(".create");
const deleteRoutineButton = editRoutineModal.querySelector(
  ".delete-routine-button"
);

const routinesList = document.querySelector(".routines-list");

const todayRoutine = document.querySelector(".today-routine");
const todayRoutineStepsList = todayRoutine.querySelector(
  ".today-routine-steps"
);
const todayRoutineStepsListContainer =
  todayRoutineStepsList.querySelector(".trs-list");
const addStepInputWrapper = todayRoutineStepsList.querySelector(
  ".trs-new-step-input-wrapper"
);
const addStepInput = addStepInputWrapper.querySelector(".trs-new-step-input");
const addStepButton = addStepInputWrapper.querySelector(
  ".trs-new-step-add-button"
);

newRoutineButton.addEventListener("click", () => {
  openCreateRoutineModal();
});

closeCreateModalButton.addEventListener("click", () => {
  closeCreateRoutineModal();
});

openEditModalButton.addEventListener("click", () => {
  const selectedRoutine = getSelectedRoutine();
  if (!selectedRoutine) return;

  openEditRoutineModal(selectedRoutine);
});

closeEditRoutineButton.addEventListener("click", () => {
  closeEditRoutineModal();
});

createModal.addEventListener("click", (e) => {
  if (e.target === createModal) {
    closeCreateRoutineModal();
  }
});

editRoutineModal.addEventListener("click", (e) => {
  if (e.target === editRoutineModal) {
    closeEditRoutineModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !createModal.classList.contains("hidden")) {
    closeCreateRoutineModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !editRoutineModal.classList.contains("hidden")) {
    closeEditRoutineModal();
  }
});

createRoutineButton.addEventListener("click", () => {
  if (!validateInputs()) return;

  const formData = getCreateRoutineFormData();

  const routine = {
    id: crypto.randomUUID(),
    name: formData.name,
    color: formData.color,
    weeklyGoal: formData.weeklyGoal,
    steps: [],
  };

  updateData((data) => {
    data.routines.push(routine);
  });

  selectRoutine(routine.id);

  closeCreateRoutineModal();

  renderApp();

  console.log("Routine created successfully: ", routine);
});

routinesList.addEventListener("click", (e) => {
  const itemElement = e.target.closest(".routine-item");
  if (!itemElement) return;

  const id = itemElement.dataset.routineId;
  if (!id) return;

  selectRoutine(id);

  renderApp();
});

editRoutineButton.addEventListener("click", () => {
  if (!validateEditInputs()) return;

  const selectedRoutine = getSelectedRoutine();
  if (!selectedRoutine) return;

  const formData = getEditRoutineFormData();

  updateData((data) => {
    const idx = data.routines.findIndex((r) => r.id === selectedRoutine.id);
    if (idx === -1) return;

    data.routines[idx] = {
      ...data.routines[idx],
      name: formData.name,
      color: formData.color,
      weeklyGoal: formData.weeklyGoal,
    };
  });

  closeEditRoutineModal();
  renderApp();
});

deleteRoutineButton.addEventListener("click", () => {
  const selectedRoutine = getSelectedRoutine();
  if (!selectedRoutine) return;

  const result = window.confirm(
    `Delete selected routine: ${selectedRoutine.name}?`
  );
  if (result) {
    deleteRoutine(selectedRoutine.id);
    closeEditRoutineModal();
    renderApp();
  }
});

addStepButton.addEventListener("click", () => {
  const selectedRoutine = getSelectedRoutine();
  if (!selectedRoutine) return;

  const stepName = addStepInput.value.trim();

  if (stepName !== "") {
    const step = {
      id: crypto.randomUUID(),
      name: stepName,
    };

    updateData((data) => {
      const idx = data.routines.findIndex((r) => r.id === selectedRoutine.id);
      if (idx === -1) return;

      data.routines[idx].steps.push(step);
    });

    renderApp();
  } else return;
});

function deleteRoutineStep(id, selectedRoutine) {
  updateData((data) => {
    const routine = data.routines.find((r) => r.id === selectedRoutine.id);

    if (!routine) return;

    routine.steps = routine.steps.filter((step) => step.id !== id);
  });

  renderApp();
  return;
}

function moveUpRoutineStep(id, selectedRoutine) {
  updateData((data) => {
    const routine = data.routines.find((r) => r.id === selectedRoutine.id);

    if (!routine) return;

    const index = routine.steps.findIndex((s) => s.id === id);
    if (index <= 0) return;

    [routine.steps[index - 1], routine.steps[index]] = [
      routine.steps[index],
      routine.steps[index - 1],
    ];
  });

  renderApp();
  return;
}

function moveDownRoutineStep(id, selectedRoutine) {
  updateData((data) => {
    const routine = data.routines.find((x) => x.id === selectedRoutine.id);
    if (!routine) return;

    const index = routine.steps.findIndex((s) => s.id === id);
    if (index === -1 || index >= routine.steps.length - 1) return;

    [routine.steps[index], routine.steps[index + 1]] = [
      routine.steps[index + 1],
      routine.steps[index],
    ];
  });

  renderApp();
  return;
}

todayRoutineStepsListContainer.addEventListener("click", (e) => {
  const selectedRoutine = getSelectedRoutine();
  if (!selectedRoutine) return;

  const stepElement = e.target.closest(".trs-item");
  if (!stepElement) return;

  const stepId = stepElement.dataset.stepId;
  if (!stepId) return;

  if (e.target.closest(".trs-delete-button")) {
    deleteRoutineStep(stepId, selectedRoutine);
    return;
  }

  if (e.target.closest(".trs-move-up")) {
    moveUpRoutineStep(stepId, selectedRoutine);
    return;
  }

  if (e.target.closest(".trs-move-down")) {
    moveDownRoutineStep(stepId, selectedRoutine);
    return;
  }
});

renderApp();
