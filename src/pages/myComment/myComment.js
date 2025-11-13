import { createApp } from 'vue'
import App from './myComment.vue'
import userApi from "@/network/api/userApi"
import tokenApi from "@/network/api/tokenApi"
import commentApi from "@/network/api/commentApi"

//引入mock
import "@/network/mock/mock"

const app = createApp(App)

//挂载api到全局
app.config.globalProperties.$userApi = userApi
app.config.globalProperties.$tokenApi = tokenApi
app.config.globalProperties.$commentApi = commentApi

app.mount('#app')
