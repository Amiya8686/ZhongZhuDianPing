//这里配置一下有哪些页面是特殊的


//客户端非登陆状态下可以访问的页面
const clientSpecialPages = [
    {
        name:"home",
        url:"/home"
    },
    {
        name:"login",
        url:"/user/login",
    },
    {
        name:"signUp",
        url:"/user/signUp"
    }
]

//访问非法页面时跳转的页面
const clientPageToGo = {
    name:"login",
    url:"/user/login"
}
const serverPageToGo = {
    name:"adminLogin",
    url:"/background/#/login"
}



//获取要跳转到的页面
const getClientPageToGo = (url)=>{
    for(const item of clientSpecialPages){
        //处于合法页面，无需跳转
        if(item.url===url){
            return url;
        }
    }
    //处于非法页面，需要跳转
    return clientPageToGo.url;
}
const getServerPageToGo = (url)=>{
    return serverPageToGo.url;
}



export {getClientPageToGo,getServerPageToGo}
