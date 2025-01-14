<template>
  <div>
    <div class="player-progression">{{ totalExperience }}xp</div>
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
                @change="() => toggleTask(task)"
              />
              <span :class="{ 'completed-task': task.completed }">
                {{ task.name }} ({{ task.xp + "xp" }})
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
import { ref } from "vue";

const props = defineProps({
  tasks: Array,
  initialXp: Number,
});

const totalExperience = ref(props.initialXp);
const categorizedTasks = props.tasks.reduce((acc, task) => {
  if (!acc[task.category]) {
    acc[task.category] = [];
  }
  acc[task.category].push(task);
  return acc;
}, {});

const toggleTask = (task) => {
  if (task.completed) {
    totalExperience.value += task.xp;
  } else {
    totalExperience.value -= task.xp;
  }
  console.log(
    `Task ${task.name} status:`,
    task.completed,
    `has a value of: ${task.xp}xp`
  );
};

const saveProgress = () => {
  const completedTasks = props.tasks.filter((task) => task.completed);

  const saveData = {
    progress: {
      player: {
        playerXp: totalExperience.value,
      },
      completedTasks: completedTasks,
      lastUpdate: new Date().toISOString(),
    },
  };

  localStorage.setItem("saveData", JSON.stringify(saveData));
  console.log("Progress saved:", saveData);
};
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
