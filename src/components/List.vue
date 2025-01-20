<template>
  <div>
    <div class="player-progression">
      Level: {{ currentLevel }} | {{ totalExperience }}xp /
      {{ xpForNextLevel }}xp
    </div>
    <div class="task-list">
      <div
        v-for="(tasksByCategory, category) in categorizedTasks"
        :key="category"
      >
        <h2>{{ category }}</h2>
        <ul>
          <li v-for="(task, index) in tasksByCategory" :key="index">
            <label>
              <input
                type="checkbox"
                v-model="task.completed"
                @change="() => handleTaskToggle(task)"
              />
              <span :class="{ 'completed-task': task.completed }">
                {{ task.name }} ({{ task.xp }}xp)
              </span>
            </label>
          </li>
        </ul>
      </div>
    </div>
    <button @click="saveProgress">Save Progress</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

// Props passed from the parent
const props = defineProps({
  tasks: Array,
  initialXp: Number,
  initialLevel: Number,
});

// Reactive state for experience and level
const totalExperience = ref(props.initialXp || 0);
const currentLevel = ref(props.initialLevel || 1);
const categorizedTasks = ref({});

// Categorize tasks on initialization
const categorizeTasks = () => {
  categorizedTasks.value = props.tasks.reduce((acc, task) => {
    acc[task.category] = acc[task.category] || [];
    acc[task.category].push(task);
    return acc;
  }, {});
};

// XP formula for next level
const xpForNextLevel = computed(() =>
  Math.floor(24 * Math.pow(currentLevel.value / 2 + 1, 2))
);

// Level-up logic
const handleLevelUp = () => {
  while (totalExperience.value >= xpForNextLevel.value) {
    totalExperience.value -= xpForNextLevel.value;
    currentLevel.value += 1;
    console.log(`Congratulations! You reached Level ${currentLevel.value}`);
  }
};

// Toggle task completion
const handleTaskToggle = (task) => {
  totalExperience.value += task.completed ? task.xp : -task.xp;
  handleLevelUp();
};

// Save progress to localStorage
const saveProgress = () => {
  const completedTasks = props.tasks.filter((task) => task.completed);
  const saveData = {
    progress: {
      playerXp: totalExperience.value,
      playerLevel: currentLevel.value,
      completedTasks,
      lastUpdate: new Date().toISOString(),
    },
  };
  localStorage.setItem("saveData", JSON.stringify(saveData));
  console.log("Progress saved:", saveData);
};

// Reset tasks daily while keeping player data
const resetDailyTasks = () => {
  const savedData = JSON.parse(localStorage.getItem("saveData"));
  if (savedData?.progress) {
    const lastUpdateDate = new Date(
      savedData.progress.lastUpdate
    ).toDateString();
    const today = new Date().toDateString();
    if (lastUpdateDate !== today) {
      props.tasks.forEach((task) => (task.completed = false)); // Reset only task completion
      console.log("Daily tasks reset!");
    }
  }
};

// Load saved progress on mount and reset if needed
onMounted(() => {
  const savedData = JSON.parse(localStorage.getItem("saveData"));
  if (savedData?.progress) {
    totalExperience.value = savedData.progress.playerXp || 0;
    currentLevel.value = savedData.progress.playerLevel || 1;
    const savedTasks = new Set(
      savedData.progress.completedTasks.map((task) => task.name)
    );
    props.tasks.forEach((task) => (task.completed = savedTasks.has(task.name)));
  }
  categorizeTasks();
  resetDailyTasks(); // Check and reset tasks on load
});
</script>

<style scoped>
.task-list {
  padding: 1rem;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin-bottom: 0.5rem;
}
.completed-task {
  text-decoration: line-through;
  color: #888;
}
</style>
