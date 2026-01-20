import {
  closeCreateRoutineModal,
  openCreateRoutineModal,
  validateInputs,
} from "./ui.js";

const newRoutineButton = document.querySelector(".header-action-button");

const createModal = document.querySelector("#create-modal");

const createRoutineButton = createModal.querySelector(".create");
const closeCreateModal = createModal.querySelector(".cancel");

newRoutineButton.addEventListener("click", () => {
  openCreateRoutineModal();
});

closeCreateModal.addEventListener("click", () => {
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
  validateInputs();
});
