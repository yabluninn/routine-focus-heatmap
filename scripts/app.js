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

  const updatedRoutine = {
    id: selectedRoutine.id,
    name: formData.name,
    color: formData.color,
    weeklyGoal: formData.weeklyGoal,
    steps: selectedRoutine.steps,
  };

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

renderApp();
