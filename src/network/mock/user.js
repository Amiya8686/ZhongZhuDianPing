//这里定义涉及用户请求的mock的返回函数


//将url查询参数转为JS对象
function parseURLParams(url) {
  const searchParams = new URL(url).searchParams;
  const params = {};
  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }
  return params;
}





//模拟用户数据库
const userDataBase = [
    {
        userName:"ISeRi_NiNa",
        password:"123456",
        nickName:"NiNa",
        avatarUrl:"/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg",
    },
    {
        userName:"AWa_SuBaRu",
        password:"654321",
        nickName:"486",
        avatarUrl:"/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg",
    },
    {
        userName:"WaGuRi_KaORuKo",
        password:"13579",
        nickName:"KaORuGo",
        avatarUrl:"/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg",
    }
]


//输入：报文
//输出:
//成功：从token中解析得到的用户名
//失败：undefined
//验证token（给需要验证token的函数用）
const checkToken = (config)=>{
    const search = parseURLParams(config.url)
    const token = search.token;

    if(token){
        //解析token
        const userName = token
        //验证token
        const validUser = userDataBase.filter(item=>{
            return item.userName===userName;
        })
        if(validUser.length!=0){
            return userName;
        }
    }
    return undefined
}

//验证token的网络api
const checkTokenApi = (config)=>{
    if(checkToken(config)){
        return {
            code:200,
            msg:"token valid"
        }
    }else{
        return {
            code:998,
            msg:"token umvalid"
        }
    }
}


//登陆验证
//输入: config对象, body中包含{userName,password}
//输出: 响应对象
//成功: {code:200}
//失败：{code, msg:"登陆验证失败"}
const login = (config)=>{
    const {userName,password} = JSON.parse(config.body)
    const validUser = userDataBase.filter((item)=>{
        return item.userName==userName;
    })
    if(validUser.length===0){
        return{
            code:999,
            msg:"用户名不存在"
        }
    }else if(validUser[0].password!==password){
        return{
            code:999,
            msg:"密码错误"
        }
    }else{
        return{
            code:200,
            data:{
                token:userName,      //前端模拟阶段，我们就让token与用户名一致，方便模拟解析
            }
        }
    }
}

//注册
//输入: config对象，body中包含{userName, nickName, password}
//输出: 响应对象
//成功: {code: 200, msg: "注册成功"}
//失败: {code: 999, msg: "用户名已存在"}
const signUp = (config)=>{
    const {userName, nickName, password} = JSON.parse(config.body)
    
    //检查用户名是否已存在
    const existingUser = userDataBase.filter((item)=>{
        return item.userName === userName;
    })
    
    if(existingUser.length > 0){
        console.log("[signUp] 用户名已存在:", userName)
        return{
            code:999,
            msg:"用户名已存在"
        }
    }
    
    //创建新用户并添加到数据库
    const newUser = {
        userName: userName,
        password: password,
        nickName: nickName,
        avatarUrl: "/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg",
    }
    userDataBase.push(newUser)
    
    console.log("[signUp] 注册成功，新用户:", newUser)
    console.log("[signUp] 当前用户总数:", userDataBase.length)

    return{
        code:200,
        msg:"注册成功"
    }
}

//请求用户信息
//输入: config对象,(测试阶段,token在查询参数中)
//输出: 响应对象
//成功: {code:200,data:{userName,nickName,avatarUrl}}
//失败: {code:999,msg:对应错误信息}
//token验证失败： {code:998,msg:"token验证失败"}
const getUserInfo = (config)=>{
    const userName = checkToken(config)
    //token验证成功
    if(userName){
        const validUser = userDataBase.filter(item=>{
            return item.userName===userName;
        })
        if(validUser.length!==0){
            return {
                code:200,
                data:{
                    userName:validUser[0].userName,
                    nickName:validUser[0].nickName,
                    avatarUrl:validUser[0].avatarUrl,
                }
            }
        }
    }
    //token验证失败
    return {
        code:998,
        msg:"token unvalid",
    }
}

//修改用户信息
//输入: config对象,(body部分为用formData格式编码的用户信息,nickName和avatar文件)
//输出: 响应对象
//成功：{code:200}
//失败: {code:999 msg:对应错误信息}
//token验证失败： {code:998,msg:"token验证失败"}
const editUserInfo = (config)=>{
    const userName = checkToken(config)
    if(!userName){
        return {
            code:998,
            msg:"token 验证失败"
        }
    }
    //JS中没有解析formData格式的接口，就在控制台输出一下检测一下就行了
    console.log("mockjs 修改用户信息成功")

    return{
        code:200
    }
}

//修改用户密码
//输入: config对象,(body部分为用formData格式编码的新密码)
//输出: 响应对象
//成功：{code:200}
//失败: {code:999 msg:对应错误信息}
//token验证失败： {code:998,msg:"token验证失败"}
const editPassword = (config)=>{
    const userName = checkToken(config)
    if(!userName){
        return {
            code:998,
            msg:"token 验证失败"
        }
    }
    
    //找到用户并更新密码（实际中formData需要后端解析，这里只模拟成功）
    const user = userDataBase.find(item => item.userName === userName)
    if(user){
        //JS中没有解析formData格式的接口，模拟环境下直接标记成功
        console.log("mockjs 修改密码成功，用户:", userName)
        return{
            code:200,
            msg:"密码修改成功"
        }
    }
    
    return{
        code:999,
        msg:"用户不存在"
    }
}


export default{checkToken, checkTokenApi, login, signUp, getUserInfo, editUserInfo, editPassword}