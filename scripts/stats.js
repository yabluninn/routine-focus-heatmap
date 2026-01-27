import { addDays, countCompletedForDate, formatDateKey } from "./state.js";

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

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

function getBestStreak(maxDays = 28) {
  let best = 0;
  let current = 0;

  const today = startOfDay(new Date());

  for (let i = 0; i < maxDays; i++) {
    const dateKey = formatDateKey(addDays(today, -i));

    const completed = countCompletedForDate(dateKey);

    if (completed > 0) {
      current++;
      if (current > best) {
        best = current;
      }
    } else {
      current = 0;
    }
  }

  return best;
}

export { getStreak, getBestStreak };
