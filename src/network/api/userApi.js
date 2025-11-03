//这个文件用于写和用户有关的业务级别api
import requestConfig from "@/config/requestConfig"
import {request} from "@/network/request"


//登陆验证
//输入: string userName, password
//输出: promise对象
//里面的data为:token
const login = (userInfo)=>{
    const option = {
        baseURL: requestConfig.isMock?requestConfig.mockURL:requestConfig.baseURL,
        url:"/user/login",
        method:"post",
        data:userInfo,
    }
    return request(option)
}

//获取用户信息
const getUserInfo = ()=>{
    const option = {
        baseURL: requestConfig.isMock?requestConfig.mockURL:requestConfig.baseURL,
        url:"/user/getInfo",
        method:"get",
    }
    return request(option)    
}


export default {login,getUserInfo}
