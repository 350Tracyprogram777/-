import App from './App'
import store from './store'
import {
	superData,
	superTools
} from '@/common/ss-superModules/superConfig.js'

// #ifdef VUE3
import {
	createSSRApp
} from 'vue';
export function createApp() {
	const app = createSSRApp(App)
	app.config.globalProperties.superData = superData
	app.config.globalProperties.superTools = superTools
	app.use(store)
	return {
		app
	}
}
// #endif
