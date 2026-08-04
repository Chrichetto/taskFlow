const API_BASE_URL = "https://taskflow-backend-b0ip.onrender.com";

const API = {
  tasks: `${API_BASE_URL}/tasks`,
  categories: `${API_BASE_URL}/tasks/categorie`,
  createTask: `${API_BASE_URL}/tasks/tasks`,
  createCategory: `${API_BASE_URL}/tasks/categorie`,
  updateTask: `${API_BASE_URL}/tasks/tasks`,
  updateCategory: `${API_BASE_URL}/tasks/categorie`,
  taskById: id => `${API_BASE_URL}/tasks/id/${id}`,
  categoryById: id => `${API_BASE_URL}/tasks/categorie/id/${id}`,
  deleteTask: `${API_BASE_URL}/tasks/tasks`,
  deleteCategory: `${API_BASE_URL}/tasks/categorie`,
};

const state = {
  tasks: [],
  filteredTasks: [],
  view: "grid",
  editingTaskId: null,
  editingCategoryId: null,
  categoryNames: {},
  page: "dashboard",
  calendarDate: new Date(),
  datePickerTarget: null,
  datePickerDate: new Date(),
};

const elements = {
  tasksContainer: document.querySelector("#tasksContainer"),
  loadingState: document.querySelector("#loadingState"), errorState: document.querySelector("#errorState"),
  emptyState: document.querySelector("#emptyState"), errorMessage: document.querySelector("#errorMessage"),
  searchInput: document.querySelector("#searchInput"), priorityFilter: document.querySelector("#priorityFilter"),
  statusFilter: document.querySelector("#statusFilter"), categoryFilter: document.querySelector("#categoryFilter"),
  startDateFilter: document.querySelector("#startDateFilter"), endDateFilter: document.querySelector("#endDateFilter"),
  clearFiltersButton: document.querySelector("#clearFiltersButton"), activeFilter: document.querySelector("#activeFilter"),
  activeFilterText: document.querySelector("#activeFilterText"), refreshButton: document.querySelector("#refreshButton"),
  retryButton: document.querySelector("#retryButton"), showAllButton: document.querySelector("#showAllButton"),
  showCompletedButton: document.querySelector("#showCompletedButton"), gridViewButton: document.querySelector("#gridViewButton"),
  listViewButton: document.querySelector("#listViewButton"), menuButton: document.querySelector("#menuButton"),
  sidebar: document.querySelector(".sidebar"), currentDate: document.querySelector("#currentDate"),
  totalTasks: document.querySelector("#totalTasks"), completedTasks: document.querySelector("#completedTasks"),
  highPriorityTasks: document.querySelector("#highPriorityTasks"), progressPercentage: document.querySelector("#progressPercentage"),
  toast: document.querySelector("#toast"),
  openTaskModalButton: document.querySelector("#openTaskModalButton"), openTaskTopButton: document.querySelector("#openTaskTopButton"),
  openCategoryModalButton: document.querySelector("#openCategoryModalButton"), taskModal: document.querySelector("#taskModal"),
  categoryModal: document.querySelector("#categoryModal"), taskForm: document.querySelector("#taskForm"),
  categoryForm: document.querySelector("#categoryForm"), taskFormError: document.querySelector("#taskFormError"),
  categoryFormError: document.querySelector("#categoryFormError"), submitTaskButton: document.querySelector("#submitTaskButton"),
  submitCategoryButton: document.querySelector("#submitCategoryButton"), taskCategory: document.querySelector("#taskCategory"),
  taskStartDate: document.querySelector("#taskStartDate"), taskEndDate: document.querySelector("#taskEndDate"),
  taskName: document.querySelector("#taskName"), taskPriority: document.querySelector("#taskPriority"),
  taskCompleted: document.querySelector("#taskCompleted"), taskModalTitle: document.querySelector("#taskModalTitle"),
  categoryModalTitle: document.querySelector("#categoryModalTitle"), categoryName: document.querySelector("#categoryName"),
  categoryId: document.querySelector("#categoryId"), categoryIdField: document.querySelector("#categoryIdField"),
  openEditCategoryModalButton: document.querySelector("#openEditCategoryModalButton"),
  dashboardButton: document.querySelector("#dashboardButton"), calendarButton: document.querySelector("#calendarButton"),
  dashboardView: document.querySelector("#dashboardView"), calendarView: document.querySelector("#calendarView"),
  previousMonthButton: document.querySelector("#previousMonthButton"), nextMonthButton: document.querySelector("#nextMonthButton"),
  todayCalendarButton: document.querySelector("#todayCalendarButton"), calendarMonthTitle: document.querySelector("#calendarMonthTitle"),
  calendarGrid: document.querySelector("#calendarGrid"), datePicker: document.querySelector("#datePicker"),
  datePickerTitle: document.querySelector("#datePickerTitle"), datePickerDays: document.querySelector("#datePickerDays"),
  datePickerPrevious: document.querySelector("#datePickerPrevious"), datePickerNext: document.querySelector("#datePickerNext"),
  datePickerToday: document.querySelector("#datePickerToday"), datePickerClear: document.querySelector("#datePickerClear"),
};

document.addEventListener("DOMContentLoaded", () => { setCurrentDate(); setDefaultDates(); bindEvents(); initializeDatePickers(); loadTasks(); });

function bindEvents() {
  [elements.searchInput, elements.priorityFilter, elements.statusFilter, elements.categoryFilter,
   elements.startDateFilter, elements.endDateFilter].forEach(el => {
    el.addEventListener(el.type === "search" ? "input" : "change", applyFilters);
  });
  elements.clearFiltersButton.addEventListener("click", clearFilters);
  elements.refreshButton.addEventListener("click", () => loadTasks(true));
  elements.retryButton.addEventListener("click", () => loadTasks(true));
  elements.showAllButton.addEventListener("click", () => { clearFilters(); showPage("dashboard"); });
  elements.showCompletedButton.addEventListener("click", () => { elements.statusFilter.value = "true"; applyFilters(); showPage("dashboard"); });
  elements.gridViewButton.addEventListener("click", () => setView("grid"));
  elements.listViewButton.addEventListener("click", () => setView("list"));
  elements.dashboardButton.addEventListener("click", () => showPage("dashboard"));
  elements.calendarButton.addEventListener("click", () => showPage("calendar"));
  elements.previousMonthButton.addEventListener("click", () => changeCalendarMonth(-1));
  elements.nextMonthButton.addEventListener("click", () => changeCalendarMonth(1));
  elements.todayCalendarButton.addEventListener("click", () => { state.calendarDate = new Date(); renderCalendar(); });
  elements.calendarGrid.addEventListener("click", event => {
    const taskButton = event.target.closest("[data-calendar-task]");
    if (taskButton) openEditTaskModal(Number(taskButton.dataset.calendarTask));
  });
  elements.menuButton.addEventListener("click", () => elements.sidebar.classList.toggle("sidebar--open"));
  elements.openTaskModalButton.addEventListener("click", openCreateTaskModal);
  elements.openTaskTopButton.addEventListener("click", openCreateTaskModal);
  elements.openCategoryModalButton.addEventListener("click", openCreateCategoryModal);
  elements.openEditCategoryModalButton.addEventListener("click", openEditCategoryModal);
  elements.taskForm.addEventListener("submit", saveTask);
  elements.categoryForm.addEventListener("submit", saveCategory);
  elements.categoryId.addEventListener("change", fillSelectedCategoryName);
  elements.tasksContainer.addEventListener("click", event => {
    const editButton = event.target.closest("[data-edit-task]");
    if (editButton) {
      openEditTaskModal(Number(editButton.dataset.editTask));
      return;
    }

    const deleteButton = event.target.closest("[data-delete-task]");
    if (deleteButton) deleteTask(Number(deleteButton.dataset.deleteTask));
  });

  ensureDeleteCategoryButton();
  document.querySelectorAll("[data-close-modal]").forEach(button => button.addEventListener("click", () => closeModal(document.querySelector(`#${button.dataset.closeModal}`))));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") { closeAllModals(); closeDatePicker(); }
  });
  document.addEventListener("click", e => {
    if (!elements.sidebar.contains(e.target) && !elements.menuButton.contains(e.target)) closeMobileMenu();
    if (!elements.datePicker.hidden && !elements.datePicker.contains(e.target) && !e.target.closest("[data-date-target]")) closeDatePicker();
  });
}

async function loadTasks(showSuccess = false) {
  setLoading(true);
  hideError();

  try {
    const [tasksData, categoriesData] = await Promise.all([
      requestJson(API.tasks),
      requestJson(API.categories),
    ]);

    if (!Array.isArray(tasksData)) {
      throw new Error("Il server non ha restituito un array di task.");
    }

    if (!Array.isArray(categoriesData)) {
      throw new Error("Il server non ha restituito un array di categorie.");
    }

    state.tasks = tasksData.map(normalizeTask);
    state.categoryNames = Object.fromEntries(
      categoriesData.map(categoria => [String(categoria.id), categoria.nome])
    );

    populateCategories();
    updateStats();
    applyFilters();
    renderCalendar();

    if (showSuccess) showToast("Dati aggiornati con successo ✨");
  } catch (error) {
    console.error(error);
    showError(`${error.message} Controlla backend e CORS.`);
  } finally {
    setLoading(false);
  }
}

function openCreateTaskModal() {
  state.editingTaskId = null;
  elements.taskForm.reset();
  setDefaultDates();
  elements.taskModalTitle.textContent = "Crea una task ✨";
  elements.submitTaskButton.textContent = "Crea task";
  hideFormError(elements.taskFormError);
  openModal(elements.taskModal);
}

async function openEditTaskModal(id) {
  state.editingTaskId = id;
  hideFormError(elements.taskFormError);
  elements.taskModalTitle.textContent = `Modifica task #${id} ✏️`;
  elements.submitTaskButton.textContent = "Salva modifiche";
  openModal(elements.taskModal);
  setButtonLoading(elements.submitTaskButton, true, "Caricamento...");

  try {
    const response = await requestJson(API.taskById(id));
    const rawTask = Array.isArray(response) ? response[0] : response;
    if (!rawTask) throw new Error("Task non trovata.");

    const task = normalizeTask(rawTask);
    elements.taskName.value = task.nome;
    setDateInputValue(elements.taskStartDate, task.dataInizio ?? "");
    setDateInputValue(elements.taskEndDate, task.dataFine ?? "");
    elements.taskPriority.value = String(task.priorita);
    elements.taskCategory.value = String(task.categoria);
    elements.taskCompleted.checked = task.completata;
  } catch (error) {
    showFormError(elements.taskFormError, error.message);
  } finally {
    setButtonLoading(elements.submitTaskButton, false, "Salva modifiche");
  }
}

async function saveTask(event) {
  event.preventDefault();
  hideFormError(elements.taskFormError);

  const dataInizio = elements.taskStartDate.value;
  const dataFine = elements.taskEndDate.value;
  if (dataFine < dataInizio) {
    return showFormError(elements.taskFormError, "La data fine non può precedere la data inizio.");
  }

  const payload = {
    nome: elements.taskName.value.trim(),
    dataInizio,
    dataFine,
    priorita: Number(elements.taskPriority.value),
    iDcategoria: Number(elements.taskCategory.value),
    completata: elements.taskCompleted.checked,
  };

  if (!payload.nome || !payload.iDcategoria) {
    return showFormError(elements.taskFormError, "Compila tutti i campi obbligatori.");
  }

  const editing = state.editingTaskId !== null;
  if (editing) payload.idVecchiaTask = state.editingTaskId;

  setButtonLoading(elements.submitTaskButton, true, editing ? "Salvataggio..." : "Creazione...");

  try {
    await requestJson(editing ? API.updateTask : API.createTask, {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    closeModal(elements.taskModal);
    elements.taskForm.reset();
    state.editingTaskId = null;
    setDefaultDates();
    await loadTasks();
    showToast(editing ? "Task aggiornata con successo ✏️" : "Task creata con successo 🚀");
  } catch (error) {
    showFormError(elements.taskFormError, error.message);
  } finally {
    setButtonLoading(elements.submitTaskButton, false, editing ? "Salva modifiche" : "Crea task");
  }
}

function openCreateCategoryModal() {
  state.editingCategoryId = null;
  elements.categoryForm.reset();
  elements.categoryIdField.hidden = true;
  elements.categoryId.required = false;
  elements.categoryModalTitle.textContent = "Nuova categoria 🏷️";
  elements.submitCategoryButton.textContent = "Crea categoria";
  toggleDeleteCategoryButton(false);
  hideFormError(elements.categoryFormError);
  openModal(elements.categoryModal);
}

function openEditCategoryModal() {
  state.editingCategoryId = null;
  elements.categoryForm.reset();
  populateCategoryEditSelect();
  elements.categoryIdField.hidden = false;
  elements.categoryId.required = true;
  elements.categoryModalTitle.textContent = "Modifica categoria ✏️";
  elements.submitCategoryButton.textContent = "Salva modifiche";
  toggleDeleteCategoryButton(false);
  hideFormError(elements.categoryFormError);
  openModal(elements.categoryModal);
}

async function fillSelectedCategoryName() {
  const id = Number(elements.categoryId.value);
  state.editingCategoryId = id || null;
  elements.categoryName.value = "";
  toggleDeleteCategoryButton(Boolean(id));
  hideFormError(elements.categoryFormError);

  if (!id) return;

  try {
    const response = await requestJson(API.categoryById(id));
    const categoria = Array.isArray(response) ? response[0] : response;

    if (!categoria) throw new Error("Categoria non trovata.");

    elements.categoryName.value = categoria.nome ?? "";
    state.categoryNames[String(id)] = categoria.nome ?? getCategoryLabel(id);
  } catch (error) {
    toggleDeleteCategoryButton(false);
    showFormError(elements.categoryFormError, error.message);
  }
}

async function saveCategory(event) {
  event.preventDefault();
  hideFormError(elements.categoryFormError);

  const nome = elements.categoryName.value.trim();
  const editing = !elements.categoryIdField.hidden;
  const idVecchiaCategoria = Number(elements.categoryId.value);

  if (!nome) return showFormError(elements.categoryFormError, "Inserisci il nome della categoria.");
  if (editing && !idVecchiaCategoria) return showFormError(elements.categoryFormError, "Seleziona una categoria.");

  const payload = editing ? { nome, idVecchiaCategoria } : { nome };
  setButtonLoading(elements.submitCategoryButton, true, editing ? "Salvataggio..." : "Creazione...");

  try {
    const result = await requestJson(editing ? API.updateCategory : API.createCategory, {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (editing) state.categoryNames[String(idVecchiaCategoria)] = nome;
    if (!editing && (result?.id || result?.insertId)) {
      const newId = String(result.id ?? result.insertId);
      state.categoryNames[newId] = nome;
      addCategoryOption(newId, nome);
    }

    closeModal(elements.categoryModal);
    elements.categoryForm.reset();
    await loadTasks();
    showToast(editing ? "Categoria aggiornata con successo ✏️" : "Categoria creata con successo 🏷️");
  } catch (error) {
    showFormError(elements.categoryFormError, error.message);
  } finally {
    setButtonLoading(elements.submitCategoryButton, false, editing ? "Salva modifiche" : "Crea categoria");
  }
}


async function deleteTask(id) {
  const task = state.tasks.find(item => item.id === id);
  const label = task?.nome ? `“${task.nome}”` : `#${id}`;

  if (!window.confirm(`Vuoi davvero eliminare la task ${label}?`)) return;

  try {
    await requestJson(API.deleteTask, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    await loadTasks();
    showToast("Task eliminata con successo 🗑️");
  } catch (error) {
    showToast(error.message);
  }
}

function ensureDeleteCategoryButton() {
  if (document.querySelector("#deleteCategoryButton")) return;

  const actions = elements.categoryForm.querySelector(".form-actions");
  if (!actions) return;

  const button = document.createElement("button");
  button.id = "deleteCategoryButton";
  button.type = "button";
  button.className = "secondary-button";
  button.textContent = "Elimina categoria";
  button.hidden = true;
  button.addEventListener("click", deleteSelectedCategory);
  actions.prepend(button);
}

function toggleDeleteCategoryButton(visible) {
  const button = document.querySelector("#deleteCategoryButton");
  if (button) button.hidden = !visible;
}

async function deleteSelectedCategory() {
  const id = Number(elements.categoryId.value);
  if (!id) {
    return showFormError(elements.categoryFormError, "Seleziona una categoria da eliminare.");
  }

  const nome = elements.categoryName.value.trim() || getCategoryLabel(id);
  if (!window.confirm(`Vuoi davvero eliminare la categoria “${nome}”?`)) return;

  const button = document.querySelector("#deleteCategoryButton");
  setButtonLoading(button, true, "Eliminazione...");
  hideFormError(elements.categoryFormError);

  try {
    await requestJson(API.deleteCategory, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    delete state.categoryNames[String(id)];
    closeModal(elements.categoryModal);
    elements.categoryForm.reset();
    state.editingCategoryId = null;
    await loadTasks();
    showToast("Categoria eliminata con successo 🗑️");
  } catch (error) {
    showFormError(elements.categoryFormError, error.message);
  } finally {
    setButtonLoading(button, false, "Elimina categoria");
  }
}


function showPage(page) {
  state.page = page;
  const calendarOpen = page === "calendar";
  elements.dashboardView.hidden = calendarOpen;
  elements.calendarView.hidden = !calendarOpen;
  elements.dashboardButton.classList.toggle("nav-item--active", !calendarOpen);
  elements.calendarButton.classList.toggle("nav-item--active", calendarOpen);
  closeMobileMenu();
  if (calendarOpen) renderCalendar();
}

function changeCalendarMonth(amount) {
  state.calendarDate = new Date(state.calendarDate.getFullYear(), state.calendarDate.getMonth() + amount, 1);
  renderCalendar();
}

function renderCalendar() {
  if (!elements.calendarGrid) return;
  const year = state.calendarDate.getFullYear();
  const month = state.calendarDate.getMonth();
  elements.calendarMonthTitle.textContent = new Intl.DateTimeFormat("it-IT", { month: "long", year: "numeric" }).format(new Date(year, month, 1));
  elements.calendarGrid.replaceChildren();

  const firstDay = new Date(year, month, 1);
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  const gridStart = new Date(year, month, 1 - mondayOffset);
  const today = toISODate(new Date());
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < 42; index += 1) {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    const iso = toISODate(date);
    const cell = document.createElement("article");
    cell.className = "calendar-day";
    if (date.getMonth() !== month) cell.classList.add("calendar-day--outside");
    if (iso === today) cell.classList.add("calendar-day--today");

    const tasks = state.tasks
      .filter(task => isDateInsideTask(iso, task))
      .sort((a, b) => b.priorita - a.priorita || a.nome.localeCompare(b.nome, "it"));

    const visible = tasks.slice(0, 3);
    cell.innerHTML = `<div class="calendar-day__number"><span>${date.getDate()}</span>${iso === today ? "<small>Oggi</small>" : ""}</div><div class="calendar-day__tasks">${visible.map(task => createCalendarTask(task, iso)).join("")}${tasks.length > 3 ? `<span class="calendar-day__more">+${tasks.length - 3} altre</span>` : ""}</div>`;
    fragment.append(cell);
  }
  elements.calendarGrid.append(fragment);
}

function createCalendarTask(task, iso) {
  const isStart = task.dataInizio === iso;
  const isEnd = task.dataFine === iso;
  const marker = isStart && isEnd ? "◆" : isStart ? "▶" : isEnd ? "■" : "•";
  return `<button class="calendar-task ${task.completata ? "calendar-task--completed" : ""}" type="button" data-calendar-task="${task.id}" style="--task-accent:${getPriorityAccent(task.priorita)}" title="${escapeHtml(task.nome)}">${marker} ${escapeHtml(task.nome)}</button>`;
}

function isDateInsideTask(iso, task) {
  if (!task.dataInizio && !task.dataFine) return false;
  const start = task.dataInizio || task.dataFine;
  const end = task.dataFine || task.dataInizio;
  return iso >= start && iso <= end;
}

function initializeDatePickers() {
  document.querySelectorAll("[data-date-target]").forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();
      openDatePicker(button.dataset.dateTarget, button);
    });
  });
  elements.datePickerPrevious.addEventListener("click", () => {
    state.datePickerDate = new Date(state.datePickerDate.getFullYear(), state.datePickerDate.getMonth() - 1, 1);
    renderDatePicker();
  });
  elements.datePickerNext.addEventListener("click", () => {
    state.datePickerDate = new Date(state.datePickerDate.getFullYear(), state.datePickerDate.getMonth() + 1, 1);
    renderDatePicker();
  });
  elements.datePickerToday.addEventListener("click", () => selectDate(toISODate(new Date())));
  elements.datePickerClear.addEventListener("click", () => selectDate(""));
  elements.datePickerDays.addEventListener("click", event => {
    const button = event.target.closest("[data-picker-date]");
    if (button) selectDate(button.dataset.pickerDate);
  });
  [elements.taskStartDate, elements.taskEndDate, elements.startDateFilter, elements.endDateFilter].forEach(input => updateDateLabel(input));
}

function openDatePicker(targetId, anchor) {
  const input = document.getElementById(targetId);
  if (!input) return;
  state.datePickerTarget = input;
  state.datePickerDate = input.value ? fromISODate(input.value) : new Date();
  renderDatePicker();
  elements.datePicker.hidden = false;

  const rect = anchor.getBoundingClientRect();
  const pickerWidth = 330;
  let left = Math.min(rect.left, window.innerWidth - pickerWidth - 14);
  left = Math.max(14, left);
  let top = rect.bottom + 10;
  if (top + 390 > window.innerHeight) top = Math.max(14, rect.top - 370);
  elements.datePicker.style.left = `${left}px`;
  elements.datePicker.style.top = `${top}px`;
}

function closeDatePicker() {
  elements.datePicker.hidden = true;
  state.datePickerTarget = null;
}

function renderDatePicker() {
  const year = state.datePickerDate.getFullYear();
  const month = state.datePickerDate.getMonth();
  elements.datePickerTitle.textContent = new Intl.DateTimeFormat("it-IT", { month: "long", year: "numeric" }).format(new Date(year, month, 1));
  elements.datePickerDays.replaceChildren();
  const firstDay = new Date(year, month, 1);
  const offset = (firstDay.getDay() + 6) % 7;
  const start = new Date(year, month, 1 - offset);
  const selected = state.datePickerTarget?.value || "";
  const today = toISODate(new Date());
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < 42; index += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const iso = toISODate(date);
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.pickerDate = iso;
    button.textContent = date.getDate();
    button.className = "date-picker__day";
    if (date.getMonth() !== month) button.classList.add("date-picker__day--outside");
    if (iso === today) button.classList.add("date-picker__day--today");
    if (iso === selected) button.classList.add("date-picker__day--selected");
    fragment.append(button);
  }
  elements.datePickerDays.append(fragment);
}

function selectDate(value) {
  if (!state.datePickerTarget) return;
  setDateInputValue(state.datePickerTarget, value);
  state.datePickerTarget.dispatchEvent(new Event("change", { bubbles: true }));
  closeDatePicker();
}

function setDateInputValue(input, value) {
  input.value = value || "";
  updateDateLabel(input);
}

function updateDateLabel(input) {
  const label = document.querySelector(`[data-date-label="${input.id}"]`);
  if (!label) return;
  const emptyText = input.id.includes("Filter") ? "Qualsiasi" : "Scegli una data";
  label.textContent = input.value ? formatDateLong(input.value) : emptyText;
}

function formatDateLong(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("it-IT", { weekday: "short", day: "2-digit", month: "long", year: "numeric" }).format(fromISODate(value));
}

function toISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromISODate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const body = await safelyReadJson(response);
  if (!response.ok) throw new Error(body?.errore || body?.messaggio || `Errore HTTP ${response.status}`);
  return body;
}

function normalizeTask(task) {
  return { id: Number(task.id), nome: task.nome || "Task senza nome", dataInizio: normalizeDate(task.dataInizio),
    dataFine: normalizeDate(task.dataFine), priorita: Number(task.priorita) || 0,
    categoria: task.categoria ?? task.iDcategoria ?? task.idCategoria ?? "Nessuna",
    completata: [true,1,"1","true"].includes(task.completata) };
}
function normalizeDate(value) { return value ? String(value).slice(0,10) : null; }

function applyFilters() {
  const q = elements.searchInput.value.trim().toLowerCase();
  const priority = elements.priorityFilter.value, status = elements.statusFilter.value, category = elements.categoryFilter.value;
  const start = elements.startDateFilter.value, end = elements.endDateFilter.value;
  state.filteredTasks = state.tasks.filter(task =>
    (!q || task.nome.toLowerCase().includes(q) || String(task.id).includes(q)) &&
    (!priority || task.priorita === Number(priority)) &&
    (!status || task.completata === (status === "true")) &&
    (!category || String(task.categoria) === category) &&
    (!start || task.dataInizio === start) && (!end || task.dataFine === end)
  );
  renderTasks(); updateActiveFilterInfo();
}

function renderTasks() {
  elements.tasksContainer.replaceChildren();
  if (!state.filteredTasks.length) { elements.emptyState.hidden = false; return; }
  elements.emptyState.hidden = true;
  const fragment = document.createDocumentFragment();
  state.filteredTasks.forEach(task => fragment.append(createTaskCard(task)));
  elements.tasksContainer.append(fragment);
}

function createTaskCard(task) {
  const article = document.createElement("article"); article.className = `task-card ${task.completata ? "task-card--completed" : ""}`;
  article.style.setProperty("--card-accent", getPriorityAccent(task.priorita));
  article.innerHTML = `<div><div class="task-card__top"><div class="task-card__category"><span>${getCategoryEmoji(task.categoria)}</span><span>${escapeHtml(getCategoryLabel(task.categoria))}</span></div><span class="status-badge ${task.completata ? "status-badge--completed" : "status-badge--pending"}">${task.completata ? "Completata" : "In corso"}</span></div><h3 class="task-card__title">${escapeHtml(task.nome)}</h3><p class="task-card__id">Task #${task.id}</p></div><div class="task-card__details"><div class="task-detail"><span class="task-detail__icon">🗓</span><span>Inizio: ${formatDate(task.dataInizio)}</span></div><div class="task-detail"><span class="task-detail__icon">🏁</span><span>Scadenza: ${formatDate(task.dataFine)}</span></div><div class="priority-line"><span>${getPriorityLabel(task.priorita)}</span><div class="priority-dots">${createPriorityDots(task.priorita)}</div></div><div class="task-card__actions"><button class="task-card__edit" type="button" data-edit-task="${task.id}">✏️ Modifica</button><button class="secondary-button" type="button" data-delete-task="${task.id}">🗑️ Elimina</button></div></div>`;
  return article;
}

function populateCategories() {
  const categories = Object.entries(state.categoryNames)
    .sort((a, b) => a[1].localeCompare(b[1], "it"));

  elements.categoryFilter.innerHTML = '<option value="">Tutte</option>';
  elements.taskCategory.innerHTML = '<option value="">Seleziona...</option>';

  categories.forEach(([id, nome]) => addCategoryOption(id, nome));
}
function addCategoryOption(id, label) {
  if (![...elements.categoryFilter.options].some(o => o.value === id)) elements.categoryFilter.add(new Option(label,id));
  if (![...elements.taskCategory.options].some(o => o.value === id)) elements.taskCategory.add(new Option(label,id));
}

function populateCategoryEditSelect() {
  const categories = Object.entries(state.categoryNames)
    .sort((a, b) => a[1].localeCompare(b[1], "it"));

  elements.categoryId.innerHTML = '<option value="">Seleziona...</option>';
  categories.forEach(([id, nome]) => elements.categoryId.add(new Option(nome, id)));
}

function clearFilters() {
  [elements.searchInput,elements.priorityFilter,elements.statusFilter,elements.categoryFilter].forEach(el => el.value="");
  setDateInputValue(elements.startDateFilter, "");
  setDateInputValue(elements.endDateFilter, "");
  applyFilters();
}
function updateActiveFilterInfo() {
  const parts=[]; if(elements.searchInput.value) parts.push(`ricerca “${elements.searchInput.value}”`);
  if(elements.priorityFilter.value) parts.push(getPriorityLabel(Number(elements.priorityFilter.value)).toLowerCase());
  if(elements.statusFilter.value) parts.push(elements.statusFilter.value === "true" ? "solo completate" : "solo da completare");
  if(elements.categoryFilter.value) parts.push(getCategoryLabel(elements.categoryFilter.value));
  if(elements.startDateFilter.value) parts.push(`inizio ${formatDate(elements.startDateFilter.value)}`);
  if(elements.endDateFilter.value) parts.push(`fine ${formatDate(elements.endDateFilter.value)}`);
  elements.activeFilter.hidden=!parts.length; elements.activeFilterText.textContent=parts.length ? `${state.filteredTasks.length} risultati · ${parts.join(" · ")}` : "";
}
function updateStats() { const total=state.tasks.length, completed=state.tasks.filter(t=>t.completata).length, high=state.tasks.filter(t=>t.priorita>=4).length; elements.totalTasks.textContent=total; elements.completedTasks.textContent=completed; elements.highPriorityTasks.textContent=high; elements.progressPercentage.textContent=`${total ? Math.round(completed/total*100) : 0}%`; }
function setView(view) { const list=view==="list"; elements.tasksContainer.classList.toggle("tasks-grid--list",list); elements.gridViewButton.classList.toggle("view-button--active",!list); elements.listViewButton.classList.toggle("view-button--active",list); }
function setLoading(value) { elements.loadingState.hidden=!value; elements.refreshButton.classList.toggle("is-loading",value); elements.refreshButton.disabled=value; elements.tasksContainer.hidden=value; if(value) elements.emptyState.hidden=true; }
function showError(message) { elements.errorMessage.textContent=message; elements.errorState.hidden=false; elements.tasksContainer.hidden=true; elements.emptyState.hidden=true; }
function hideError() { elements.errorState.hidden=true; }
function openModal(modal) { modal.hidden=false; document.body.classList.add("modal-open"); closeMobileMenu(); setTimeout(()=>modal.querySelector("input,select")?.focus(),50); }
function closeModal(modal) { modal.hidden=true; if(elements.taskModal.hidden && elements.categoryModal.hidden) document.body.classList.remove("modal-open"); }
function closeAllModals() { closeModal(elements.taskModal); closeModal(elements.categoryModal); }
function closeMobileMenu() { elements.sidebar.classList.remove("sidebar--open"); }
function setDefaultDates() {
  const today = toISODate(new Date());
  setDateInputValue(elements.taskStartDate, today);
  setDateInputValue(elements.taskEndDate, today);
}
function setButtonLoading(button, loading, text) { button.disabled=loading; button.textContent=text; }
function showFormError(element,message) { element.textContent=message; element.hidden=false; }
function hideFormError(element) { element.hidden=true; element.textContent=""; }
function showToast(message) { elements.toast.textContent=message; elements.toast.classList.add("toast--visible"); clearTimeout(showToast.id); showToast.id=setTimeout(()=>elements.toast.classList.remove("toast--visible"),2600); }
function setCurrentDate() { elements.currentDate.textContent=new Intl.DateTimeFormat("it-IT",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(new Date()); }
function formatDate(value) { if(!value) return "Non indicata"; const [y,m,d]=String(value).slice(0,10).split("-"); return new Intl.DateTimeFormat("it-IT",{day:"2-digit",month:"short",year:"numeric"}).format(new Date(+y,+m-1,+d)); }
function getPriorityLabel(p) { return ({0:"Nessuna priorità",1:"Priorità bassa",2:"Priorità media",3:"Priorità alta",4:"Priorità molto alta",5:"Priorità urgente"})[p] || "Priorità non definita"; }
function getPriorityAccent(p) { return p>=5?"#f15b75":p===4?"#ff7b54":p===3?"#ffad45":p===2?"#4f9df8":p===1?"#30c789":"#9b95af"; }
function createPriorityDots(p) { return Array.from({length:5},(_,i)=>`<span class="priority-dot ${i<Math.max(0,Math.min(5,p))?"priority-dot--active":""}"></span>`).join(""); }
function getCategoryLabel(c) {
  const key = String(c);
  return state.categoryNames[key] || ({1:"Studio",2:"Lavoro",3:"Personale",4:"Sport",5:"Progetti"})[key] || `Categoria ${key}`;
}
function getCategoryEmoji(c) { return ({1:"📚",2:"💼",3:"🌿",4:"🏋️",5:"💡"})[c] || "🏷️"; }
async function safelyReadJson(response) { try{return await response.json();}catch{return null;} }
function escapeHtml(v) { return String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;"); }
