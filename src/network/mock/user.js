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
    // {
    //     userName:"ISeRi_NiNa",
    //     password:"123456",
    //     nickName:"NiNa",
    //     avatarUrl:"/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg",
    // },
    // {
    //     userName:"AWa_SuBaRu",
    //     password:"654321",
    //     nickName:"486",
    //     avatarUrl:"/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg",
    // },
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
    console.log(config.url)
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
//请求用户信息
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




export default{checkToken,checkTokenApi,login,getUserInfo}