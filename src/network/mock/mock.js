//这里配置mock中，每个路径与其调用的函数
//打包时可能会引入mock，打包时，最好把这段代码注释掉
//客户端mock引入
import Mock from "mockjs"
import user from "./user.js"
import comment from "./comment.js"
import food from "./food.js"
import stallManage from "@/network/mock/background/stallManage.js"
import requestConfig from "@/config/requestConfig.js";


//后台管理mock引入
import admin from "@/network/mock/background/admin"
import userManage from "@/network/mock/background/userManage"
if(requestConfig.isMock){
    //客户端mock
    Mock.mock(/\/api\/user\/login/,"post",options=>{return user.login(options)});
    Mock.mock(/\/api\/user\/signUp/,"post",options=>{return user.signUp(options)});
    Mock.mock(/\/api\/user\/getInfo/,"get",options=>{return user.getUserInfo(options)});
    Mock.mock(/\/api\/checkToken/,"get",options=>{return user.checkTokenApi(options)});
    Mock.mock(/\/api\/user\/editInfo/,"post",options=>{return user.editUserInfo(options)});
    Mock.mock(/\/api\/user\/editPassword/,"post",options=>{return user.editPassword(options)});
    Mock.mock(/\/api\/user\/getCommentList/,"get",options=>{return comment.getMyComments(options)});
    Mock.mock(/\/api\/user\/deleteComment/,"post",options=>{return comment.deleteComment(options)});
    Mock.mock(/\/api\/food\/getStallList/,"get",options=>{return food.getStallList(options)});
    Mock.mock(/\/api\/food\/getStallInfo/,"get",options=>{return food.getStallInfo(options)});
    //后台管理mock
    Mock.mock(/\/api\/background\/checkToken/,"post",options=>{return admin.checkTokenApi(options)});
    Mock.mock(/\/api\/background\/admin\/login/,"post",options=>{return admin.adminLogin(options)});
    Mock.mock(/\/api\/background\/admin\/getInfo/,"get",options=>{return admin.getAdminInfo(options)});
    Mock.mock(/\/api\/background\/admin\/editPassword/,"post",options=>{return admin.adminEditPassword(options)});
    Mock.mock(/\/api\/background\/admin\/editInfo/,"post",options=>{return admin.adminEditInfo(options)});
<<<<<<< HEAD
=======
    Mock.mock(/\/api\/food\/getStallDishList/,"get",options=>{return food.getStallDishList(options)});
    Mock.mock(/\/api\/food\/getStallCommentList/,"get",options=>{return comment.getStallCommentList(options)});
    Mock.mock(/\/api\/food\/createStallComment/,"post",options=>{return comment.createStallComment(options)});
    Mock.mock(/\/api\/food\/evaluationComment/,"post",options=>{return comment.evaluationComment(options)});
    //用户管理mock
    Mock.mock(/\/api\/background\/user\/getUserList/,"get",options=>{return userManage.getUserList(options)});
    Mock.mock(/\/api\/background\/user\/freezeAccount/,"post",options=>{return userManage.freezeAccount(options)});
    Mock.mock(/\/api\/background\/user\/defrostAccount/,"post",options=>{return userManage.defrostAccount(options)});
    Mock.mock(/\/api\/background\/user\/retSetPassword/,"post",options=>{return userManage.resetPassword(options)});
>>>>>>> origin/develop1.1_user
    Mock.mock(/\/api\/background\/food\/getStallList/,"get",options=>{return stallManage.getStallList(options)});
    Mock.mock(/\/api\/background\/food\/addStall/,"post",options=>{return stallManage.addStall(options)});
    Mock.mock(/\/api\/background\/food\/editStallInfo/,"post",options=>{return stallManage.editStallInfo(options)});
    Mock.mock(/\/api\/background\/food\/deleteStall/,"post",options=>{return stallManage.deleteStall(options)});
    Mock.mock(/\/api\/background\/dish\/getDishList/,"get",options=>{return stallManage.getDishList(options)});
    Mock.mock(/\/api\/background\/dish\/addDish/,"post",options=>{return stallManage.addDish(options)});
    Mock.mock(/\/api\/background\/dish\/editDishInfo/,"post",options=>{return stallManage.editDishInfo(options)});
    Mock.mock(/\/api\/background\/dish\/deleteDish/,"post",options=>{return stallManage.deleteDish(options)});
}








