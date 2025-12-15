//此文件: 管理员管理相关的接口
import requestConfig from "@/config/requestConfig"
import {request} from "@/network/request"

//获取管理员列表
//输入: object params {ID: string, name: string, permission: string, pageIndex: number, numPerPage: number}
//输出: promise对象
//成功: resolve({adminList: array, pageIndex: number, totalPageNum: number})
//失败: reject(errorMessage)
const getAdminList = (params) => {
    const option = {
        baseURL: requestConfig.isMock ? requestConfig.mockURL : requestConfig.baseURL,
        url: "/background/adminManage/getAdminList",
        method: "get",
        data: params,
    }
    return request(option)
}

//新增管理员
//输入: object params {name: string, permission: string}
//输出: promise对象
//成功: resolve({ID: string, password: string})
//失败: reject(errorMessage)
const addAdmin = (params) => {
    const option = {
        baseURL: requestConfig.isMock ? requestConfig.mockURL : requestConfig.baseURL,
        url: "/background/adminManage/addAdmin",
        method: "post",
        data: params,
    }
    return request(option)
}

//删除管理员
//输入: object params {ID: string}
//输出: promise对象
//成功: resolve(none)
//失败: reject(errorMessage)
const deleteAdmin = (params) => {
    const option = {
        baseURL: requestConfig.isMock ? requestConfig.mockURL : requestConfig.baseURL,
        url: "/background/adminManage/deleteAdmin",
        method: "post",
        data: params,
    }
    return request(option)
}

//重置管理员密码
//输入: object params {ID: string}
//输出: promise对象
//成功: resolve({newPassword: string})
//失败: reject(errorMessage)
const resetAdminPassword = (params) => {
    const option = {
        baseURL: requestConfig.isMock ? requestConfig.mockURL : requestConfig.baseURL,
        url: "/background/adminManage/resetPassword",
        method: "post",
        data: params,
    }
    return request(option)
}

export default {
    getAdminList,
    addAdmin,
    deleteAdmin,
    resetAdminPassword
}
