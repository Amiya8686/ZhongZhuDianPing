//这个文件用于写和美食档口相关的业务级别api
import requestConfig from "@/config/requestConfig"
import {request} from "@/network/request"

//============= 档口信息相关的接口 =============

//获取档口列表
//输入: object params {type, canteen, collation, numPerPage, pageIndex}
//输出: promise对象
//成功: resolve({stalls: Array, totalPageNum: number, pageIndex: number})
//失败: reject(errorMessage)
const getStallList = (params)=>{
    const option = {
        baseURL: requestConfig.isMock?requestConfig.mockURL:requestConfig.baseURL,
        url:"/food/getStallList",
        method:"get",
        data:params,
    }
    return request(option)
}

//获取档口的详细信息
//输入: object params {stallID}
//输出: promise对象
//成功: resolve({档口详细信息, dishList, commentList})
//失败: reject(errorMessage)
const getStallInfo = (params)=>{
    const option = {
        baseURL: requestConfig.isMock?requestConfig.mockURL:requestConfig.baseURL,
        url:"/food/getStallInfo",
        method:"get",
        data:params,
    }
    return request(option)
}

//============= 档口评论相关的接口 =============

//获取档口的全部评论
//输入: object params {stallID, numPerPage, pageIndex}
//输出: promise对象
//成功: resolve({commentList: Array, totalPageNum: number, pageIndex: number})
//失败: reject(errorMessage)
const getStallCommentList = (params)=>{
    const option = {
        baseURL: requestConfig.isMock?requestConfig.mockURL:requestConfig.baseURL,
        url:"/food/getStallCommentList",
        method:"get",
        data:params,
    }
    return request(option)
}

//发表对档口的评论
//输入: FormData commentData (包含 stallID, rating, content, files)
//输出: promise对象
//成功: resolve()
//失败: reject(errorMessage)
const createStallComment = (commentData)=>{
    const option = {
        baseURL: requestConfig.isMock?requestConfig.mockURL:requestConfig.baseURL,
        url:"/food/createStallComment",
        method:"post",
        data:commentData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }
    return request(option)
}

//对评论进行评价（点赞/取消）
//输入: object params {commentID, newEvaluation}
//输出: promise对象
//成功: resolve()
//失败: reject(errorMessage)
const evaluationComment = (params)=>{
    const option = {
        baseURL: requestConfig.isMock?requestConfig.mockURL:requestConfig.baseURL,
        url:"/food/evaluationComment",
        method:"post",
        data:params,
    }
    return request(option)
}

//============= 档口菜品相关的接口 =============

//获取全部菜品列表
//输入: object params {stallID}
//输出: promise对象
//成功: resolve(Array) - 直接返回菜品数组
//失败: reject(errorMessage)
const getStallDishList = (stallID)=>{
    const option = {
        baseURL: requestConfig.isMock?requestConfig.mockURL:requestConfig.baseURL,
        url:"/food/getStallDishList",
        method:"get",
        data:{stallID},
    }
    return request(option)
}

//更新菜品的评价状态（点赞/踩/取消）
//输入: object params {dishID, newEvaluation}
//输出: promise对象
//成功: resolve()
//失败: reject(errorMessage)
const evaluateDish = (params)=>{
    const option = {
        baseURL: requestConfig.isMock?requestConfig.mockURL:requestConfig.baseURL,
        url:"/food/evaluateDish",
        method:"post",
        data:params,
    }
    return request(option)
}

export default {
    getStallList,
    getStallInfo,
    getStallCommentList,
    createStallComment,
    evaluationComment,
    getStallDishList,
    evaluateDish
}
