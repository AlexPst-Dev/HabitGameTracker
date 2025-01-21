<template>
  <div class="daily-task-list-component">
    <div class="player-progression">
      <div class="xp-bar">
        <span>
          Level: {{ currentLevel }} | {{ totalExperience }}xp /
          {{ xpForNextLevel }}xp
        </span>
        <div
          class="xp-bar-fill"
          :style="{ width: progressBarWidth + '%' }"
        ></div>
      </div>
    </div>
    <div class="task-list">
      <div
        v-for="(tasksByCategory, category) in categorizedTasks"
        :key="category"
        class="task-category"
      >
        <h2 class="task-category-name">{{ category }}</h2>
        <ul>
          <li v-for="(task, index) in tasksByCategory" :key="index">
            <label class="list-control">
              <input
                type="checkbox"
                v-model="task.completed"
                @change="() => handleTaskToggle(task)"
                :disabled="task.saved"
              />
              <span :class="{ 'completed-task': task.completed }">
                {{ task.name }} ({{ task.xp }}xp)
              </span>
            </label>
          </li>
        </ul>
      </div>
    </div>
    <button class="ml-auto" @click="saveProgress">Save</button>
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
const savedExperience = ref(props.initialXp || 0); // State for progress bar
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

// Progress bar width based on XP
const progressBarWidth = computed(() => {
  return Math.min((savedExperience.value / xpForNextLevel.value) * 100, 100);
});

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
  if (task.completed) {
    totalExperience.value += task.xp;
  } else {
    totalExperience.value = Math.max(0, totalExperience.value - task.xp); // Prevent negative XP
  }
  handleLevelUp();
};

// Save progress to localStorage
const saveProgress = () => {
  savedExperience.value = totalExperience.value; // Update progress bar XP on save
  props.tasks.forEach((task) => {
    if (task.completed) {
      task.saved = true; // Mark the task as saved
    }
  });

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

  categorizeTasks();
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
    savedExperience.value = savedData.progress.playerXp || 0; // Initialize bar with saved XP
    const savedTasks = new Set(
      savedData.progress.completedTasks.map((task) => task.name)
    );
    props.tasks.forEach((task) => {
      task.completed = savedTasks.has(task.name);
      task.saved = savedTasks.has(task.name); // Set the saved flag
    });
  }
  categorizeTasks();
  resetDailyTasks(); // Check and reset tasks on load
});
</script>

<style scoped>
.daily-task-list-component {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.daily-task-list-component .task-list {
  padding: 0.5rem;
  background-color: #525252;
  box-shadow: 4px 4px 5px black;
}
.daily-task-list-component .task-list h2 {
  font-family: "VT323", serif;
  font-size: 2.25rem;
  margin: 0;
  width: fit-content;
}
.daily-task-list-component .task-list ul {
  list-style-type: none;
  padding: 0;
}
.daily-task-list-component .task-list ul li {
  margin-bottom: 0.5rem;
}
.daily-task-list-component .task-list ul li .list-control {
  display: grid;
  grid-template-columns: 1rem auto;
  gap: 0.5em;
}
.daily-task-list-component .task-list ul li .list-control input {
  margin: 0;
  padding: 0;
  border: none;
}

.daily-task-list-component .task-list .completed-task {
  text-decoration: line-through;
  color: #888;
}

.player-progression {
  margin-bottom: 1rem;
}
.xp-bar {
  height: 1.5rem;
  background-color: #ccc;
  border-radius: 0.2rem;
  overflow: hidden;
  position: relative;
}
.xp-bar span {
  color: black;
  position: absolute;
  top: 0;
  left: 0;
  padding: 0 0.5rem;
}
.xp-bar-fill {
  height: 100%;
  background: linear-gradient(to right, #1e90ff, #00ffff);
  transition: width 0.25s ease-in-out;
}
</style>
