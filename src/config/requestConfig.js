//网络请求相关的配置
//配置环境和相应的基地址
const env = "development";            //当前环境
const isMock = true;                  //是否启动mock

const envConfig = {
    development:{
        baseURL:"/api",
        mockURL:"https:/sbljy/api"
    },
    test:{
        baseURL:"/api",
        mockURL:"/api"
    },
    production:{
        baseURL:"/api",
        mockURL:"/api"
    }
}

export default{
    ...envConfig[env],
    isMock
}

