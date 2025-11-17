//这个文件用于写和评论有关的业务级别api
import requestConfig from "@/config/requestConfig"
import {request} from "@/network/request"

//获取我的评论列表
//输入: object params {numPerPage: number, pageIndex: number}
//输出: promise对象
//成功: resolve({comments: Array, totalPageNum: number, pageIndex: number})
//失败: reject(errorMessage)
const getMyComments = (params)=>{
    const option = {
        baseURL: requestConfig.isMock?requestConfig.mockURL:requestConfig.baseURL,
        url:"/user/getCommentList",
        method:"get",
        data:params,
    }
    return request(option)
}

//删除评论
//输入: number commentID
//输出: promise对象
//成功: resolve()
//失败: reject(errorMessage)
const deleteComment = (commentID)=>{
    const option = {
        baseURL: requestConfig.isMock?requestConfig.mockURL:requestConfig.baseURL,
        url:"/user/deleteComment",
        method:"post",
        data:{commentID},
    }
    return request(option)
}

export default {getMyComments, deleteComment}
