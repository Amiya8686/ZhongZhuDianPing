
//将查询参数转换为JS对象
function parseURLParams(url) {
  const searchParams = new URL(url).searchParams;
  const params = {};
  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }
  return params;
}
//模拟管理员数据库
const adminDataBase = [
    {
        ID:"00000001",
        password:"123456",
        permission:"超级管理员",
        name:"ISeRi_NiNa",
        avatarUrl:"/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg",
    },
    {
        ID:"00000002",
        password:"654321",
        permission:"普通管理员",
        name:"AWa_SuBaRu",
        avatarUrl:"/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg",
    },
    {
        ID:"00000003",
        password:"13579",
        permission:"普通管理员",
        name:"WaGuRi_KaORuKo",
        avatarUrl:"/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg",
    }
]
//检查token是否合法:（输入:报文;合法输出:管理员ID;非法输出:undefined）
const checkToken = (config)=>{
    const search = parseURLParams(config.url)
    const token = search.token;
    if(token){
        const ID = token
        const index = adminDataBase.find(item=>{return item.ID===ID})
        if(index){
            return ID
        }
    }
    return undefined
}
//单纯校验token的api
const checkTokenApi = (config)=>{
    const ID = checkToken(config)
    if(ID){
        return {
            code:200
        }
    }else{
        return {
            code: 997,
            msg: "服务端token验证失败"
        }
    }
}
//管理员登陆
const adminLogin = (config)=>{
    const {ID,password} = JSON.parse(config.body);
    const index = adminDataBase.findIndex(item=>{return item.ID===ID})
    if(index===-1){
        return {
            code:999,
            msg:"账号不存在"
        }
    }
    if(adminDataBase[index].password!==password){
        return {
            code:999,
            msg:"密码错误"
        }
    }
    if(adminDataBase[index].password===password){
        return {
            code:200,
            data:{
                token:ID
            }
        }
    }
}
//返回管理员的信息
const getAdminInfo = (config)=>{
    const ID =  checkToken(config);
    if(!ID){
        return {
            code:997,
            msg:"管理员token验证失败"
        }
    }
    const index = adminDataBase.findIndex(item=>{return item.ID === ID})
    return {
        code:200,
        data:{
            ID:adminDataBase[index].ID,
            name:adminDataBase[index].name,
            permission:adminDataBase[index].permission,
            avatarUrl:adminDataBase[index].avatarUrl
        }
    }
}
//管理员修改密码
const adminEditPassword = (config)=>{
    const ID =  checkToken(config);
    if(!ID){
        return {
            code:997,
            msg:"管理员token验证失败"
        }
    }

    const {password,newPassword} = JSON.parse(config.body)
    const index = adminDataBase.findIndex(item=>{return item.ID===ID})
    if(adminDataBase[index].password!=password){
        return{
            code:999,
            msg:"旧密码错误"
        }
    }else{
        adminDataBase[index].password=newPassword
        return{
            code:200,
        }
    }
}
//管理员修改个人信息
const adminEditInfo = (config)=>{
    const ID = checkToken(config)
    if(!ID){
        return {
            code:997,
            msg:"管理员token验证失败"
        }
    }
    console.log("ID:"+ID+" 个人信息修改成功")
    return{
        code:200
    }
}


export default {adminLogin,checkTokenApi,getAdminInfo,adminEditPassword,adminEditInfo}
