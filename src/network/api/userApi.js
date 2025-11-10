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

//注册
//输入: object userInfo {userName: string, nickName: string, password: string}
//输出: promise对象
//成功: resolve()
//失败: reject(errorMessage)
const signUp = (userInfo)=>{
    const option = {
        baseURL: requestConfig.isMock?requestConfig.mockURL:requestConfig.baseURL,
        url:"/user/signUp",
        method:"post",
        data:userInfo,
    }
    return request(option)
}

//获取用户信息
//输入: 无（通过token识别）
//输出: promise对象
//成功: resolve({userName: string, nickName: string, avatarUrl: string})
//失败: reject(errorMessage)
const getUserInfo = ()=>{
    const option = {
        baseURL: requestConfig.isMock?requestConfig.mockURL:requestConfig.baseURL,
        url:"/user/getInfo",
        method:"get",
    }
    return request(option)    
}

//修改用户信息
//输入：userInfo的formData对象，里面有新的nickName和avatar文件
//输出：promise对象
//成功: resolve()
//失败: reject(errorMessage)
const editUserInfo = (userInfo)=>{
    const option = {
        baseURL: requestConfig.isMock?requestConfig.mockURL:requestConfig.baseURL,
        url:"/user/editInfo",
        method:"post",
        data:userInfo,
        contentType:"multipart/form-data"      //以formData格式传数据
    }
    return request(option) 
}




export default {login, signUp, getUserInfo, editUserInfo}

