import useUserStore from '@/store/modules/user.js'
import useSystemStore from '@/store/modules/system.js'
import useContantStore from '@/store/modules/contant.js'
// import useShopStore from '@/store/modules/cart.js'

import piniaPersist from 'pinia-plugin-persist-uni'

import {
	createPinia
} from 'pinia';

const pinia = createPinia();
pinia.use(piniaPersist);

export {
	useUserStore,
	useSystemStore,
	useContantStore
	// useShopStore
};
export default pinia;
