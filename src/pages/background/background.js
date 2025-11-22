import {router} from "@/network/router/backgroundRouter"
import { createApp } from 'vue'
import App from './background.vue'
import adminApi from "@/network/api/background/adminApi"



//引入mock
import "@/network/mock/mock"



const app = createApp(App)
app.config.globalProperties.$adminApi=adminApi
app.use(router)
app.mount('#app')
