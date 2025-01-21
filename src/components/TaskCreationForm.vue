<template>
  <div class="popup-form">
    <h2>Create Your Task List</h2>
    <div v-for="(category, categoryIndex) in categories" :key="categoryIndex">
      <label>Category Name</label>
      <input v-model="category.name" placeholder="Category" required />
      <button @click="removeCategory(categoryIndex)">Delete Category</button>
      <div
        v-for="(task, taskIndex) in category.tasks"
        :key="`task-${categoryIndex}-${taskIndex}`"
      >
        <label>Task Name</label>
        <input v-model="task.name" placeholder="Task Name" required />
        <label>XP Value</label>
        <input
          v-model.number="task.xp"
          type="number"
          placeholder="XP Value"
          required
        />
        <button @click="removeTask(categoryIndex, taskIndex)">
          Delete Task
        </button>
      </div>
      <button @click="addTask(categoryIndex)">Add Task</button>
    </div>
    <button @click="addCategory">Add Category</button>
    <button @click="saveTasks">Save Task List</button>
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
  background: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 0;
  left: 0;
}
</style>
