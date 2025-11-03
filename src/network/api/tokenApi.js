import requestConfig from "@/config/requestConfig"
import {request} from "@/network/request"


//token验证，就是单纯在页面加载时，验证一下token，若token有问题且在非法页面，就会跳转到登陆页面
const checkToken = ()=>{
    const option = {
        baseURL: requestConfig.isMock?requestConfig.mockURL:requestConfig.baseURL,
        url:"/checkToken",
        method:"get",
    }
    return request(option)    
}

export default {checkToken}