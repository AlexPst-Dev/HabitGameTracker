<template>
  <main>
    <h1>Advancement</h1>
    <div class="welcome-message">
      <span>Hi {{ playerName }} ! 👋 </span>
      <br />
      <span>What have you done today ?</span>
    </div>
    <List :tasks="tasks" :initialXp="playerXp" />
  </main>
</template>

<script setup>
import List from "@/components/List.vue";
import saveData from "@/data/save.json";
import tasksData from "@/data/data.json";
import "@/assets/style.css";

const tasks = tasksData.tasks.map((task) => {
  const savedTask = saveData.tasks?.find((t) => t.name === task.name);
  return { ...task, completed: savedTask ? savedTask.completed : false };
});

const playerName = saveData.progress.player.playerName;
const playerXp = saveData.progress.player.playerXp;
</script>
