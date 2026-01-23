import {
  completeRoutine,
  deleteRoutine,
  ensureHistory,
  getRoutines,
  getRoutineTodayState,
  getSelectedRoutine,
  getTodayHistoryMap,
  getTodayKey,
  selectRoutine,
  toggleStepDone,
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

let editingStep = null;

function renderApp() {
  const selectedRoutine = getSelectedRoutine();

  const todayState = selectedRoutine
    ? getRoutineTodayState(selectedRoutine.id)
    : null;

  const todayHistoryMap = getTodayHistoryMap();

  renderRoutinesList(getRoutines(), selectedRoutine, todayHistoryMap);
  renderTodayRoutine(selectedRoutine, todayState);
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
const todayRoutineCompleteButton = todayRoutine.querySelector(
  ".today-routine-complete-button"
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

  const selectedRoutine = getSelectedRoutine();
  if (selectedRoutine) {
    ensureHistory(getTodayKey(), selectedRoutine.id);
  }

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

function startEditingStep(stepElement, selectedRoutine) {
  const labelElement = stepElement.querySelector(".trs-step-label");
  const inputElement = stepElement.querySelector(".trs-item-step-name-input");
  if (!labelElement || !inputElement) return;

  const stepId = stepElement.dataset.stepId;
  const currentName = labelElement.textContent.trim();

  if (editingStep) {
    finishStepEditing({ save: true });
  }

  labelElement.classList.add("hidden");
  inputElement.classList.remove("hidden");

  inputElement.value = currentName;
  inputElement.focus();
  inputElement.select();

  editingStep = {
    routineId: selectedRoutine.id,
    stepId,
    inputElement,
    labelElement,
    startValue: currentName,
  };
}

function closeStepEditingUI() {
  if (!editingStep) return;
  editingStep.inputElement.classList.add("hidden");
  editingStep.labelElement.classList.remove("hidden");
  editingStep = null;
}

function finishStepEditing({ save }) {
  if (!editingStep) return;

  const newName = editingStep.inputElement.value.trim();
  const oldName = editingStep.startValue;

  if (newName === "") {
    closeStepEditingUI();
    return;
  }

  if (newName === oldName) {
    closeStepEditingUI();
    return;
  }

  if (save) {
    updateData((data) => {
      const routine = data.routines.find((r) => r.id === editingStep.routineId);
      if (!routine) return;

      const step = routine.steps.find((s) => s.id === editingStep.stepId);
      if (!step) return;

      step.name = newName;
    });

    closeStepEditingUI();
    renderApp();
    return;
  }

  closeStepEditingUI();
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

  if (e.target.closest(".trs-step-label")) {
    startEditingStep(stepElement, selectedRoutine);
    return;
  }

  const clickedCheckbox =
    e.target.matches("input.trs-input") ||
    e.target.closest(".checkbox-wrapper-30") ||
    e.target.closest(".checkbox");

  if (clickedCheckbox) {
    toggleStepDone(selectedRoutine.id, stepId);
    renderApp();
    return;
  }
});

document.addEventListener("mousedown", (e) => {
  if (!editingStep) return;

  if (e.target === editingStep.inputElement) return;

  finishStepEditing({ save: true });
});

document.addEventListener("keydown", (e) => {
  if (!editingStep) return;

  if (e.key === "Enter") {
    e.preventDefault();
    finishStepEditing({ save: true });
  }

  if (e.key === "Escape") {
    e.preventDefault();
    finishStepEditing({ save: false });
  }
});

todayRoutineCompleteButton.addEventListener("click", () => {
  const selectedRoutine = getSelectedRoutine();
  if (!selectedRoutine) return;

  completeRoutine(selectedRoutine.id);

  renderApp();
});

renderApp();
