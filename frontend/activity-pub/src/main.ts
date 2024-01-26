import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { VueFire } from "vuefire";
import { firebaseApp } from "./firebase.ts";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router).use(VueFire, {
	// imported above but could also just be created here
	firebaseApp,
});

app.mount("#app");
