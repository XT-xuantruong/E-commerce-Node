import { createRouter, createWebHistory } from "vue-router";
import { adminRoutes } from "./routerAdmin";
import { publicRoutes } from "./routerGuest";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...adminRoutes, ...publicRoutes],
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 };
  },
});

export default router;
