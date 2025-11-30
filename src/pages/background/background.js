import {router} from "@/network/router/backgroundRouter"
import { createApp } from 'vue'
import App from './background.vue'
import adminApi from "@/network/api/background/adminApi"
import userManageApi from "@/network/api/background/userManageApi"



//引入mock
import "@/network/mock/mock"



const app = createApp(App)
app.config.globalProperties.$adminApi=adminApi
app.config.globalProperties.$userManageApi=userManageApi
app.use(router)
app.mount('#app')
