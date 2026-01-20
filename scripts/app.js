import { selectRoutine, updateData } from "./state.js";
import {
  closeCreateRoutineModal,
  getCreateRoutineFormData,
  openCreateRoutineModal,
  renderRoutinesList,
  renderTodayRoutine,
  validateInputs,
} from "./ui.js";

const newRoutineButton = document.querySelector(".header-action-button");

const createModal = document.querySelector("#create-modal");

const createRoutineButton = createModal.querySelector(".create");
const closeCreateModalButton = createModal.querySelector(".cancel");

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

  renderRoutinesList();
  renderTodayRoutine();

  console.log("Routine created successfully: ", routine);
});
