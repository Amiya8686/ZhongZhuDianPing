import { request } from "@/network/request"
import requestConfig from "@/config/requestConfig"

// 获取随机菜品列表
const getDishList = (params) => {
  const option = {
    baseURL: requestConfig.isMock ? requestConfig.mockURL : requestConfig.baseURL,
    url: "/agent/intelligentCommentGeneration/getDishList",
    method: "get",
    data: params,
  }
  return request(option)
}

// 获取随机档口列表
const getStallList = (params) => {
  const option = {
    baseURL: requestConfig.isMock ? requestConfig.mockURL : requestConfig.baseURL,
    url: "/agent/stallIntelligentAnalysis/getStallList",
    method: "get",
    data: params,
  }
  return request(option)
}

export default { getDishList, getStallList }
