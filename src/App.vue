<script setup>
import { RouterLink, RouterView } from "vue-router";
import { ref, onMounted } from "vue";
import TaskCreationForm from "./components/TaskCreationForm.vue";

const taskDataAvailable = ref(false); // Flag to determine if tasks are available
const showTaskCreationForm = ref(false); // Controls popup visibility

const handleSaveTaskList = () => {
  showTaskCreationForm.value = false;
  taskDataAvailable.value = true;
};

onMounted(() => {
  const savedData = localStorage.getItem("taskData");
  if (!savedData) {
    showTaskCreationForm.value = true;
  } else {
    taskDataAvailable.value = true; // Data exists, show the game
  }
});
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/" class="link" active-class="active"
          >Player</RouterLink
        >
        <RouterLink to="/game" class="link" active-class="active"
          >Dungeon</RouterLink
        >
      </nav>
    </div>
  </header>

  <div>
    <div v-if="showTaskCreationForm">
      <TaskCreationForm @saveTaskList="handleSaveTaskList" />
    </div>
    <div v-else>
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
header {
  width: 100%;
  position: fixed;
}
header .wrapper {
  display: flex;
  justify-content: end;
  padding: 4%;
}
header .wrapper nav {
  width: fit-content;
  display: flex;
  gap: 1rem;
  background-color: #1f1f1f;
  border-radius: 0.25rem;
  padding: 0.25rem;
}
header .wrapper nav a {
  padding: 0.5rem 0.25rem;
  color: white;
  text-decoration: unset;
  font-size: 0.75rem;
  cursor: pointer;
}
header .wrapper nav a.active {
  background-color: white;
  color: black;
  border-radius: 0.25rem;
}
</style>
