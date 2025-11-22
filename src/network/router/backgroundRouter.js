import { createRouter,createWebHashHistory } from "vue-router";



//router的路径配置是hash路径配置
//就是说不是真正的域名，而是当前路径的hash域名
//例子:是'background/#/'而不是'/'



// 制定路由规则
const routes = [
    {
        path: "/",
        name: "main",
        component: () => import("@/views/background/main.vue"),
        redirect: "/home",
        children: [
            {
                path: "home",
                name: "home",
                component: () => import("@/views/background/home.vue")
            },
            {
                path: "userManage",
                name: "userManage",
                component: () => import("@/views/background/userManage.vue")
            },
            {
                path: "stallManage",
                name: "stallManage",
                component: () => import("@/views/background/stallManage.vue")
            },
            {
                path: "adminManage",
                name: "adminManage",
                component: () => import("@/views/background/adminManage.vue")
            },
        ]
    },
    {
        path: "/login",
        name: "login",
        component: () => import("@/views/background/login.vue")
    },
] 


//创建路由实例
//使用哈希路由，http://example.com/#/path，#后面内容不会发送给服务器，我们根据它动态调整本地的状态
const router = createRouter({
    history:createWebHashHistory(),
    routes,
});


// //设置路由守卫（外部传入store）
// const setProtector = (store)=>{
//     router.beforeEach((to, from, next) => {
//         //非登陆状态访问非登陆页面
//         if(store.state.token===""&&to.path!="/login"){   
//             next("/login")
//             return;
//         }
        
//         //访问越权界面
//         if (!to.matched.length) {                  
//             next('/404')
//             return;          
//         }

//         next()
//     })    
// }
export {router};
