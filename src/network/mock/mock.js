//这里配置mock中，每个路径与其调用的函数
//打包时可能会引入mock，打包时，最好把这段代码注释掉
import Mock from "mockjs"
import user from "./user.js"
import comment from "./comment.js"
import requestConfig from "@/config/requestConfig.js";
if(requestConfig.isMock){
    Mock.mock(/\/api\/user\/login/,"post",options=>{return user.login(options)});
    Mock.mock(/\/api\/user\/signUp/,"post",options=>{return user.signUp(options)});
    Mock.mock(/\/api\/user\/getInfo/,"get",options=>{return user.getUserInfo(options)});
    Mock.mock(/\/api\/checkToken/,"get",options=>{return user.checkTokenApi(options)});
    Mock.mock(/\/api\/user\/editInfo/,"post",options=>{return user.editUserInfo(options)});
    Mock.mock(/\/api\/user\/getCommentList/,"get",options=>{return comment.getMyComments(options)});
    Mock.mock(/\/api\/user\/deleteComment/,"post",options=>{return comment.deleteComment(options)});
}





