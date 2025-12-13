import {router} from "@/network/router/backgroundRouter"
import { createApp } from 'vue'
import App from './background.vue'
import adminApi from "@/network/api/background/adminApi"
<<<<<<< HEAD
=======
import userManageApi from "@/network/api/background/userManageApi"
>>>>>>> origin/develop1.1_user
import stallManageApi from "@/network/api/background/stallManageApi"



//引入mock
import "@/network/mock/mock"



const app = createApp(App)
app.config.globalProperties.$adminApi=adminApi
<<<<<<< HEAD
=======
app.config.globalProperties.$userManageApi=userManageApi
>>>>>>> origin/develop1.1_user
app.config.globalProperties.$stallManageApi=stallManageApi
app.use(router)
app.mount('#app')
