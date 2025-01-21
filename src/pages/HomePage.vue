<template>
  <main>
    <h1>Advancement</h1>
    <div class="welcome-message">
      <span>Hi {{ playerName }}! 👋</span>
      <br />
      <span>What have you done today?</span>
    </div>
    <List :tasks="tasks" :initialXp="playerXp" :initialLevel="playerLevel" />
  </main>
</template>

<script setup>
import { ref } from "vue";
import List from "@/components/List.vue";
import saveData from "@/data/save.json";
import "@/assets/style.css";

const savedTaskData = JSON.parse(localStorage.getItem("taskData"));
const tasks = ref(savedTaskData ? savedTaskData.tasks : []);
const playerName = saveData.progress.player.playerName;
const playerXp = saveData.progress.player.playerXp;
const playerLevel = saveData.progress.player.playerLevel; // Add player level
</script>
