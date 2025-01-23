<template>
  <div class="popup-form">
    <h2>Create Your Task List</h2>
    <div
      class="category-edit"
      v-for="(category, categoryIndex) in categories"
      :key="categoryIndex"
    >
      <label class="category-edit-label">Category Name</label>
      <input v-model="category.name" placeholder="Category" required />
      <button @click="removeCategory(categoryIndex)" class="delete-btn">
        <img src="@/assets/icons/trash-icon.png" alt="Trash icon" />
      </button>
      <div
        v-for="(task, taskIndex) in category.tasks"
        :key="`task-${categoryIndex}-${taskIndex}`"
        class="task-edit"
      >
        <div class="task-edit-infos">
          <div class="task-name-edit">
            <label>Task Name</label>
            <input v-model="task.name" placeholder="Task Name" required />
          </div>
          <div class="task-xp-edit">
            <label>XP Value</label>
            <input
              v-model.number="task.xp"
              type="number"
              placeholder="XP Value"
              required
            />
          </div>
        </div>
        <button
          @click="removeTask(categoryIndex, taskIndex)"
          class="delete-btn"
        >
          <img src="@/assets/icons/trash-icon.png" alt="Trash icon" />
        </button>
      </div>
      <button @click="addTask(categoryIndex)" class="sub-btn">+ Task</button>
    </div>
    <div class="footer-action-btns">
      <button @click="addCategory" class="sub-btn">+ Category</button>
      <button @click="saveTasks" class="red-btn">Save List</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  initialCategories: { type: Array, default: () => [] },
});

// Define emit for event communication
const emit = defineEmits(["saveTaskList"]);

const categories = ref(
  props.initialCategories.length > 0
    ? props.initialCategories.map(([name, tasks]) => ({ name, tasks }))
    : [{ name: "", tasks: [] }]
);

const addCategory = () => {
  categories.value.push({ name: "", tasks: [{ name: "", xp: 0 }] });
};

const addTask = (categoryIndex) => {
  categories.value[categoryIndex].tasks.push({ name: "", xp: 0 });
};

const removeCategory = (categoryIndex) => {
  categories.value.splice(categoryIndex, 1);
};

const removeTask = (categoryIndex, taskIndex) => {
  categories.value[categoryIndex].tasks.splice(taskIndex, 1);
};

const saveTasks = () => {
  // Filter categories and tasks with valid names and XP values
  const taskData = {
    tasks: categories.value.flatMap(
      (cat) =>
        cat.tasks
          .filter((task) => task.name.trim() !== "" && task.xp > 0) // Validate task
          .map((task) => ({ ...task, category: cat.name.trim() })) // Add category to each task
    ),
  };

  // Ensure valid tasks before saving
  if (taskData.tasks.length > 0) {
    localStorage.setItem("taskData", JSON.stringify(taskData));
    console.log("Tasks saved:", taskData);
    emit("saveTaskList", taskData); // Emit taskData to the parent
  } else {
    alert(
      "Please fill in all category names, task names, and XP values before saving."
    );
  }
};
</script>

<style scoped>
.popup-form {
  padding: 1rem;
  background: rgb(27, 27, 27);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 1%;
  left: 3%;
  overflow-y: scroll;
  width: 87vw;
  max-height: 90vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.popup-form button {
  width: fit-content;
}

.popup-form .category-edit {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border: 1px white solid;
  margin-bottom: 1rem;
  padding: 0.5rem;
}
.popup-form .category-edit .category-edit-label {
  font-size: 1.25rem;
}

.popup-form .task-edit {
  border-top: 0.5px solid white;
  padding: 0.5rem 0;
  display: flex;
  justify-content: space-between;
}

.popup-form .task-edit .task-edit-infos {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: fit-content;
}

.popup-form .task-edit-infos .task-name-edit,
.popup-form .task-edit-infos .task-xp-edit {
  display: flex;
  gap: 0.5rem;
}

.popup-form input[type="text"],
.popup-form input[type="number"] {
  background-color: white;
  font-family: "VT323", serif;
  font-size: 1em;
  border: none;
}
.popup-form input[type="number"] {
  width: 16%;
}

.popup-form .delete-btn {
  border: none;
  background-color: transparent;
  cursor: pointer;
}
.popup-form .delete-btn img {
  width: 1.5rem;
}

.popup-form .footer-action-btns {
  display: flex;
  justify-content: space-between;
}
</style>
