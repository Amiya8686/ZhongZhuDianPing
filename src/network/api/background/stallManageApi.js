import requestConfig from "@/config/requestConfig"
import {request} from "@/network/request"



//获取档口列表
//输入: object  {name,type,canteen,numPerPage,pageIndex}
//输出: promise对象
//成功: resolve(none)
//失败: reject(errorMessage)
const getStallList = (requestInfo)=>{
    const option = {
        baseURL: requestConfig.isMock?requestConfig.mockURL:requestConfig.baseURL,
        url:"/background/food/getStallList",
        method:"get",
        data:requestInfo,
    }
    return request(option)
}

//新增档口
//输入: formdata  {name,type,canteen,introduction,picture}
//输出: promise对象
//成功: resolve(none)
//失败: reject(errorMessage)
const addStall = (stallInfo)=>{
    const option = {
        baseURL: requestConfig.isMock?requestConfig.mockURL:requestConfig.baseURL,
        url:"/background/food/addStall",
        method:"post",
        contentType:"multipart/form-data",
        data:stallInfo,
    }
    return request(option)
}


//编辑档口
//输入: formdata  {ID,name,type,canteen,introduction,picture}
//输出: promise对象
//成功: resolve(none)
//失败: reject(errorMessage)
const editStallInfo = (stallInfo)=>{
    const option = {
        baseURL: requestConfig.isMock?requestConfig.mockURL:requestConfig.baseURL,
        url:"/background/food/editStallInfo",
        method:"post",
        contentType:"multipart/form-data",
        data:stallInfo,
    }
    return request(option)
}


//删除档口
//输入: object {ID,name,type,canteen,introduction,picture}
//输出: promise对象
//成功: resolve(none)
//失败: reject(errorMessage)
const deleteStall = (stallData)=>{
    const option = {
        baseURL: requestConfig.isMock?requestConfig.mockURL:requestConfig.baseURL,
        url:"/background/food/deleteStall",
        method:"post",
        data:stallData,
    }
    return request(option)
}


//获取菜品列表
//输入: object {stallID}
//输出: promise对象
//成功: resolve(none)
//失败: reject(errorMessage)
const getDishList = (stallInfo)=>{
    const option = {
        baseURL: requestConfig.isMock?requestConfig.mockURL:requestConfig.baseURL,
        url:"/background/dish/getDishList",
        method:"get",
        data:stallInfo,
    }
    return request(option)
}

//添加菜品
//输入: formData {stallID,name,price,picture}
//输出: promise对象
//成功: resolve(none)
//失败: reject(errorMessage)
const addDish = (dishInfo)=>{
    const option = {
        baseURL: requestConfig.isMock?requestConfig.mockURL:requestConfig.baseURL,
        url:"/background/dish/addDish",
        method:"post",
        contentType:"multipart/form-data",
        data:dishInfo,
    }
    return request(option)
}

//编辑菜品
//输入: formData {ID,name,price,picture}
//输出: promise对象
//成功: resolve(none)
//失败: reject(errorMessage)
const editDishInfo = (dishInfo)=>{
    const option = {
        baseURL: requestConfig.isMock?requestConfig.mockURL:requestConfig.baseURL,
        url:"/background/dish/editDishInfo",
        method:"post",
        contentType:"multipart/form-data",
        data:dishInfo
    }
    return request(option)
}


const deleteDish = (dishInfo)=>{
    const option = {
        baseURL: requestConfig.isMock?requestConfig.mockURL:requestConfig.baseURL,
        url:"/background/dish/deleteDish",
        method:"post",
        data:dishInfo
    }
    return request(option)
}


export default {getStallList,addStall,editStallInfo,deleteStall,getDishList,addDish,editDishInfo,deleteDish}