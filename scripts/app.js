import {
  getRoutines,
  getSelectedRoutine,
  selectRoutine,
  updateData,
} from "./state.js";
import {
  closeCreateRoutineModal,
  getCreateRoutineFormData,
  openCreateRoutineModal,
  renderRoutinesList,
  renderTodayRoutine,
  validateInputs,
} from "./ui.js";

function renderApp() {
  const selectedRoutine = getSelectedRoutine();
  renderRoutinesList(getRoutines(), selectedRoutine);
  renderTodayRoutine(selectedRoutine);
}

const newRoutineButton = document.querySelector(".header-action-button");

const createModal = document.querySelector("#create-modal");

const createRoutineButton = createModal.querySelector(".create");
const closeCreateModalButton = createModal.querySelector(".cancel");

const routinesList = document.querySelector(".routines-list");

newRoutineButton.addEventListener("click", () => {
  openCreateRoutineModal();
});

closeCreateModalButton.addEventListener("click", () => {
  closeCreateRoutineModal();
});

createModal.addEventListener("click", (e) => {
  if (e.target === createModal) {
    closeCreateRoutineModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !createModal.classList.contains("hidden")) {
    closeCreateRoutineModal();
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

renderApp();
