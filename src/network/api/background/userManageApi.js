import requestConfig from "@/config/requestConfig"
import {request} from "@/network/request"

//获取用户列表
//输入: object params {status: string, userName: string, nickName: string, pageIndex: number, numPerPage: number}
//输出: promise对象
//成功: resolve({userList: array, pageIndex: number, totalPageNum: number})
//失败: reject(errorMessage)
const getUserList = (params) => {
    const option = {
        baseURL: requestConfig.isMock ? requestConfig.mockURL : requestConfig.baseURL,
        url: "/background/user/getUserList",
        method: "get",
        data: params,
    }
    return request(option)
}

//冻结用户账号
//输入: string userName
//输出: promise对象
//成功: resolve()
//失败: reject(errorMessage)
const freezeAccount = (userName) => {
    const option = {
        baseURL: requestConfig.isMock ? requestConfig.mockURL : requestConfig.baseURL,
        url: "/background/user/freezeAccount",
        method: "post",
        data: { userName },
    }
    return request(option)
}

// 解冻用户账号
// 输入: string userName
// 输出: promise对象
// 成功: resolve()
// 失败: reject(errorMessage)
const defrostAccount = (userName) => {
    const option = {
        baseURL: requestConfig.isMock ? requestConfig.mockURL : requestConfig.baseURL,
        url: "/background/user/defrostAccount",
        method: "post",
        data: { userName },
    }
    return request(option)
}

// 重置用户密码
// 输入: string userName
// 输出: promise对象
// 成功: resolve({newPassword: string})
// 失败: reject(errorMessage)
const resetPassword = (userName) => {
    const option = {
        baseURL: requestConfig.isMock ? requestConfig.mockURL : requestConfig.baseURL,
        url: "/background/user/resetPassword",
        method: "post",
        data: { userName },
    }
    return request(option)
}

export default { getUserList, freezeAccount, defrostAccount, resetPassword }