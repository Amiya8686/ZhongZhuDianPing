import { createApp } from 'vue'
import App from './foodConsultant.vue'
//引入mock
import "@/network/mock/mock.js"
//导入api
import userApi from "@/network/api/userApi.js"
import tokenApi from '@/network/api/tokenApi.js'
import foodApi from "@/network/api/foodApi.js"
import difyApi from "@/network/api/difyApi.js"
const app = createApp(App)
app.config.globalProperties.$userApi=userApi;
app.config.globalProperties.$tokenApi=tokenApi;
app.config.globalProperties.$foodApi=foodApi;
app.config.globalProperties.$difyApi=difyApi;
app.mount("#app")
