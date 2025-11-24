//此文件:写管理员信息相关的接口(登陆，个人信息修改等)
import requestConfig from "@/config/requestConfig"
import {request} from "@/network/request"



//什么都不做，单纯检查下token是否合法的api。用于在访问非法页面时跳转
const backgroundCheckToken = ()=>{
    const option = {
        baseURL: requestConfig.isMock?requestConfig.mockURL:requestConfig.baseURL,
        url:"/background/checkToken",
        method:"post"
    }
    return request(option)
}


//管理员登陆
//输入: object loginInfo {ID: string, password: string}
//输出: promise对象
//成功: resolve(none)
//失败: reject(errorMessage)
const adminLogin = (loginInfo)=>{
    const option = {
        baseURL: requestConfig.isMock?requestConfig.mockURL:requestConfig.baseURL,
        url:"/background/admin/login",
        method:"post",
        data:loginInfo,
    }
    return request(option)
}

//获取当前登陆的管理员的信息
const getAdminInfo = ()=>{
    const option = {
        baseURL: requestConfig.isMock?requestConfig.mockURL:requestConfig.baseURL,
        url:"/background/admin/getInfo",
        method:"get",
    }
    return request(option)
}
//管理员修改密码
//输入: object params {password:string, newPassword: string}
//输出: promise对象
//成功: resolve(none)
//失败: reject(errorMessage)
const adminEditPassword = (params)=>{
    const option = {
        baseURL: requestConfig.isMock?requestConfig.mockURL:requestConfig.baseURL,
        url:"/background/admin/editPassword",
        method:"post",
        data:params,
    }
    return request(option)
}


//管理员修改个人信息
//输入: formdata adminInfo {name,avatar}
//输出: promise对象
//成功: resolve(none)
//失败: reject(errorMessage)
const adminEditInfo = (adminInfo)=>{
    const option = {
        baseURL: requestConfig.isMock?requestConfig.mockURL:requestConfig.baseURL,
        url:"/background/admin/editInfo",
        method:"post",
        data:adminInfo,
        contentType:"multipart/form-data"
    }
    return request(option) 
}



export default{adminLogin,backgroundCheckToken,getAdminInfo,adminEditPassword,adminEditInfo}

