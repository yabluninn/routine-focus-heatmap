import { addDays, countCompletedForDate, formatDateKey } from "./state.js";

function getStreak(maxDays = 28) {
  let streak = 0;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  for (let i = 0; i < maxDays; i++) {
    const dateKey = formatDateKey(addDays(today, -i));

    const completed = countCompletedForDate(dateKey);

    if (completed > 0) {
      streak++;
    } else {
      break;
    }

    return streak;
  }
}
