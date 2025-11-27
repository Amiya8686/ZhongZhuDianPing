import axios from "axios"
import { getClientPageToGo,getServerPageToGo } from "@/config/specialPageConfig";
import requestConfig from "@/config/requestConfig"

//配置axios实例
const httpInstance = axios.create()


//响应拦截器，处理错误请求
httpInstance.interceptors.response.use(res=>{
    const {code,msg,data} = res.data;
    if(code==200){
        //请求成功
        if(data){
            if(data.token){
                const token = data.token;
                localStorage.setItem("token",JSON.stringify(token));
            }
        }
        return data;
    }else if(code==998){
        //客户端token验证失败，清除本地的token,准备跳转页面
        localStorage.removeItem("token")
        const path = window.location.pathname
        const newPath = getClientPageToGo(path)
        if(path!==newPath){
            window.location.href=newPath;
        }
        return Promise.reject("客户端token验证失败")
    }else if(code==997){
        //服务端token验证失败,直接跳到服务端的登陆页面
        localStorage.removeItem("token")
        const path = window.location.pathname
        const newPath = getServerPageToGo(path)
        window.location.href=newPath
        return Promise.reject("服务端token验证失败")
    }else{
        //普通失败，不显示错误信息，由调用者决定是否提示
        const networkError = "网络错误..."
        // ElMessage.error(msg||networkError);
        return Promise.reject(msg||networkError);
    }
})


//封装axios，灵活配置
const request = (config)=>{
    if(!config.contentType){
        config.contentType = "application/json"
    }


    //配置基地址和资源路径和资源类型
    const option = {
        baseURL:config.baseURL,
        url:config.url,
        method: config.method.toLowerCase(),
        timeout:10000,
        headers:{
            'Content-Type' : config.contentType,
        }
    }

    //获取token
    let token = localStorage.getItem('token');
    if(token){
        token = JSON.parse(token)
    }
    //附加token到头部
    if(token){
        option.headers['Authorization']= "Bearer " + token
    }

    //---------------------------------------------------
    //mockJS捕获不了token，开发阶段我们将token放在查询参数中
    if(requestConfig.isMock){
        if(config.method.toLowerCase() === "get"&&token){
            if(config.data){
                config.data.token=token;
            }else{
                config.data = {token:token}
            }
        }
        if(config.method.toLowerCase() === "post"&&token){
            option.params = {token:token}
        } 
    }



    //配置get选项
    if(config.method.toLowerCase() === "get"){
        //查询参数
        if(config.data){
            option.params = config.data;
        }
    }

    //配置post选项
    if(config.method.toLowerCase() === "post"){
        //上传数据
        if(config.data){
            option.data = config.data;
        }
    }

    //发送请求
    return httpInstance(option);
}



//request函数说明
//作用：灵活配置axios请求
//输入：config对象
//conifg{
//  baseURL,(请求的基地址，比如"https://ljy.api/")
//  url,    (请求api地址,比如/user/login)
//  method, (请求方法:get，post)
//  contentType (data的编码方式: 默认为application/json,multipart/form-data)
//  data,   (请求内容:get请求为查询参数,post请求为上传的数据)
//}
//输出: promise对象
//成功 promise的result为返回的数据
//失败 promise的error为错误的信息
export{request};



