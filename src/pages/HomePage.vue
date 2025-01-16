<template>
  <h1>Home</h1>
  <div>
    <p>Welcome, {{ playerName }}!</p>
  </div>
  <List :tasks="tasks" :initialXp="playerXp" />
</template>

<script setup>
import List from "@/components/List.vue";
import saveData from "@/data/save.json";
import tasksData from "@/data/data.json";

const tasks = tasksData.tasks.map((task) => {
  const savedTask = saveData.tasks?.find((t) => t.name === task.name);
  return { ...task, completed: savedTask ? savedTask.completed : false };
});

const playerName = saveData.progress.player.playerName;
const playerXp = saveData.progress.player.playerXp;
</script>
