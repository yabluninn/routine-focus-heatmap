# Routine Tracker (Vanilla JS) — Heatmap + Streak Stats

A lightweight productivity tracker built with **Vanilla JavaScript**, focused on habit/routine execution with a **GitHub-like heatmap**, **streak analytics**, and a clean UI.  
The goal of this project is to practice real product logic: state management, date algorithms, and UI rendering **without frameworks**.

---

## Demo

- Live: https://yabluninn.github.io/routine-focus-heatmap/

---

## Features

### ✅ Routines
- Create / edit / delete routines
- Weekly goal (1–7) with validation
- Select active routine
- Truncated long routine titles in the sidebar (with full title tooltip)

### ✅ Steps inside routines
- Add / reorder (up/down) / delete steps
- Mark steps as done (checkbox)
- Inline rename step (click on name → edit)

### ✅ Today progress + completion
- Progress percent based on done steps
- “Complete routine” button enabled only when all steps are done
- Completion state is stored and affects analytics

### ✅ Heatmap calendar (WOW part)
- Last **28 days** grid (7 columns × 4 rows)
- Each cell has intensity level (0..5) depending on completed routines count
- Tooltip shows: date + completed routines count
- Updates dynamically from stored history

### ✅ Stats (analytics)
- **Current streak** (consecutive days with 1+ completed routines)
- **Best streak**
- **Weekly completion rate** (last 7 days)

### ✅ Persistence
- All data stored in **LocalStorage**
- History saved by date key (`YYYY-MM-DD`) and routine id

---

## Tech Stack

- **HTML**
- **CSS**
- **Vanilla JavaScript (ES Modules)**
- **LocalStorage** for persistence
- **Font Awesome and HugeIcons** for icons 
