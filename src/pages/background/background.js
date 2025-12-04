import {router} from "@/network/router/backgroundRouter"
import { createApp } from 'vue'
import App from './background.vue'
import adminApi from "@/network/api/background/adminApi"
import stallManageApi from "@/network/api/background/stallManageApi"



//引入mock
import "@/network/mock/mock"



const app = createApp(App)
app.config.globalProperties.$adminApi=adminApi
app.config.globalProperties.$stallManageApi=stallManageApi
app.use(router)
app.mount('#app')
