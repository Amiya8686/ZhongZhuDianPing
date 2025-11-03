//这里配置一下有哪些页面是特殊的


//非登陆状态下可以访问的页面
const specialPages = [
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
const pageToGo = {
    name:"login",
    url:"/user/login"
}

//获取要跳转到的页面
const getPageToGo = (url)=>{
    for(const item of specialPages){
        //处于合法页面，无需跳转
        if(item.url===url){
            return url;
        }
    }
    //处于非法页面，需要跳转
    return pageToGo.url;
}


export {getPageToGo}
