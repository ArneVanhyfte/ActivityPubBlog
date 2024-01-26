import { useAuthStore } from "./../stores/AuthStore";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: () => import("../views/HomeView.vue"),
			meta: {
				requiresAuth: true,
			},
		},
		{
			path: "/add",
			name: "add",
			component: () => import("../views/AddView.vue"),
			meta: {
				requiresAuth: true,
			},
		},
		{
			path: "/login",
			name: "login",
			component: () => import("../views/LoginView.vue"),
		},
		{
			path: "/signup",
			name: "signup",
			component: () => import("../views/SignupView.vue"),
		},
	],
});
router.beforeEach(async (to, from, next) => {
	const store = useAuthStore();
	const currentUser = await store.getCurrentUser();
	if (to.meta.requiresAuth && !currentUser) {
		next("/login");
	} else if (to.path === "/login" && currentUser) {
		next("/");
	} else {
		next();
	}
});
export default router;
