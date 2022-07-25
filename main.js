import {
	createSSRApp
} from "vue";
import usePinia from "./store";

import App from "./App.vue";
export function createApp() {
	const app = createSSRApp(App);
	app.use(usePinia);
	
	return {
		app
	};
}
