import Task from "./task";

export default class TaskManager {
  constructor() {
    this.addTaskForm = document.querySelector(".tasks_widget_form");
    this.onSubmitTask = this.onSubmitTask.bind(this);
    this.addTaskForm.addEventListener("submit", this.onSubmitTask);

    this.inputValue = document.querySelector(".tasks_input");
    this.onInputValue = this.onInputValue.bind(this);
    this.inputValue.addEventListener("input", this.onInputValue);

    this.error_message = document.querySelector(".tasks_error");
    this.not_found = document.querySelector(".not_found");
    this.no_pinned = document.querySelector(".tasks_no_pinned");

    this.containerAll = document
      .querySelector(".tasks_all")
      .querySelector(".tasks_items");
    this.onClickContainerAll = this.onClickContainerAll.bind(this);
    this.containerAll.addEventListener("click", this.onClickContainerAll);

    this.containerPinned = document
      .querySelector(".tasks_pinned")
      .querySelector(".tasks_items");
    this.onClickContainerPinned = this.onClickContainerPinned.bind(this);
    this.containerPinned.addEventListener("click", this.onClickContainerPinned);

    this.storage = [];
  }

  filterTasks(search) {
    const result = this.storage.filter(
      (item) =>
        item.task.toLowerCase().includes(search) && item.isPinned === false
    );
    return result;
  }

  addToStorage(task) {
    this.storage.push(task);
  }

  renderTask(task) {
    return `
        <div class="tasks_item">
            <div class="tasks_text">
                ${task}
            </div>
            <div class="tasks_chosen">
                <div class="tasks_check">v</div>
            </div>
        </div>`;
  }

  renderTasks(tasks) {
    this.clear();

    this.setMessageVisibility(tasks, this.not_found);

    tasks.forEach((task) => {
      const taskHtml = this.renderTask(task.task);
      this.containerAll.insertAdjacentHTML("beforeend", taskHtml);
    });
  }

  setMessageVisibility(container, element) {
    if (container.length > 0) {
      element.style.display = "none";
    } else {
      element.style.display = "block";
    }
  }

  onSubmitTask(e) {
    e.preventDefault();
    let task = this.inputValue.value;
    if (task.trim() === "") {
      this.error_message.style.display = "block";
    } else {
      this.error_message.style.display = "none";
      let taskForStorage = new Task(task.trim());
      this.containerAll.insertAdjacentHTML("beforeend", this.renderTask(task));
      this.addToStorage(taskForStorage);
      let tasksForRender = this.getNotPinned();
      this.renderTasks(tasksForRender);
      this.inputValue.value = "";
    }
  }

  getNotPinned() {
    return this.storage.filter((item) => item.isPinned === false);
  }

  onInputValue() {
    const text = this.inputValue.value;
    if (text) {
      let tasksForRender = this.filterTasks(text);
      this.renderTasks(tasksForRender);
    } else if (text === "") {
      let tasksForRender = this.getNotPinned();
      this.renderTasks(tasksForRender);
    }
  }

  clear() {
    for (let child of [...this.containerAll.querySelectorAll(".tasks_item")]) {
      child.remove();
    }
  }

  handleTaskOnClick(
    e,
    containerCheck,
    classListAction,
    isPinned,
    containerForInsertion
  ) {
    let taskTarget;
    if (
      [...containerCheck.querySelectorAll(".tasks_item")].includes(e.target)
    ) {
      taskTarget = e.target;
    } else {
      taskTarget = e.target.closest(".tasks_item");
    }
    let checkElement = taskTarget.querySelector(".tasks_check");
    let taskTextContent = taskTarget
      .querySelector(".tasks_text")
      .textContent.trim();
    checkElement.classList[classListAction]("tasks_check_active");
    let searchItem = this.storage.find((item) => item.task === taskTextContent);
    searchItem.isPinned = isPinned;
    containerForInsertion.insertAdjacentElement("beforeend", taskTarget);
    this.setMessageVisibility(
      [...this.containerPinned.querySelectorAll(".tasks_item")],
      this.no_pinned
    );
    this.setMessageVisibility(
      [...this.containerAll.querySelectorAll(".tasks_item")],
      this.not_found
    );
  }

  onClickContainerPinned(e) {
    this.handleTaskOnClick(
      e,
      this.containerPinned,
      "remove",
      false,
      this.containerAll
    );
  }

  onClickContainerAll(e) {
    this.handleTaskOnClick(
      e,
      this.containerAll,
      "add",
      true,
      this.containerPinned
    );
  }
}
