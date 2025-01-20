import DungeonPage from "./pages/DungeonPage.vue";
import HomePage from "./pages/HomePage.vue";

export const routes = [
  {
    path: "/",
    component: HomePage,
  },
  {
    path: "/game",
    component: DungeonPage,
  },
];
