<script setup>
import { ElMessage } from "element-plus";
import {reactive, getCurrentInstance, ref} from "vue"
const {proxy} = getCurrentInstance();

//登录表单引用
const loginFormRef = ref(null)

//数据
const loginInfo = reactive({
    userName:"",
    password:""
})

//表单验证规则
const loginRules = reactive({
    userName: [
        { required: true, message: "请输入用户名", trigger: "blur" },
        { min: 3, max: 20, message: "用户名长度应为3-20个字符", trigger: "blur" }
    ],
    password: [
        { required: true, message: "请输入密码", trigger: "blur" },
        { min: 6, max: 20, message: "密码长度应为6-20个字符", trigger: "blur" }
    ]
})

//登录状态
const isLoading = ref(false)

//函数：处理登录
const handleLogin = ()=>{
    loginFormRef.value.validate(async (valid)=>{
        if(valid){
            isLoading.value = true
            try{
                const data = await proxy.$userApi.login(loginInfo);
                ElMessage.success("登录成功！")
                //存储token到本地存储
                localStorage.setItem("token", JSON.stringify(data.token))
                //延迟跳转，让用户看到成功提示
                // setTimeout(()=>{
                //     window.location.href = "/home"
                // }, 500)
                window.location.href = "/home"
            }catch(error){
                console.error("登录失败:", error)
                ElMessage.error("登陆失败:",error)
                //错误信息已在request.js的响应拦截器中通过ElMessage显示
            }finally{
                isLoading.value = false
            }
        }else{
            ElMessage.warning("请填写完整的登录信息")
        }
    })
}

//函数：跳转到注册页面
const goToSignUp = ()=>{
    window.location.href = "/user/signUp"
}

//函数：取消登录，返回首页
const handleCancel = ()=>{
    window.location.href = "/home"
}

//函数：按Enter键登录
const handleKeyPress = (event)=>{
    if(event.key === 'Enter'){
        handleLogin()
    }
}

//函数: 按logo跳转到home页面
const handleClickLogo = ()=>{
    window.location.href = "/home"
}
</script>


<template>
  <div class="loginPage">
    <!-- 左上角 Logo -->
    <div class="pageLogo" @click="handleClickLogo">
      <h1>中珠点评</h1>
      <span class="logoSubtitle">校园美食点评平台</span>
    </div>
    
    <div class="loginWindow">
        <h2 class="loginTitle">用户登录</h2>
        <el-form
            ref="loginFormRef"
            :model="loginInfo"
            :rules="loginRules"
            label-width="80px"
            @keypress.enter="handleKeyPress"
        >
            <el-form-item label="用户名" prop="userName">
                <el-input 
                    v-model="loginInfo.userName" 
                    placeholder="请输入用户名"
                    clearable
                    :disabled="isLoading"
                ></el-input>
            </el-form-item>
            
            <el-form-item label="密码" prop="password">
                <el-input 
                    v-model="loginInfo.password" 
                    type="password"
                    placeholder="请输入密码"
                    show-password
                    clearable
                    :disabled="isLoading"
                ></el-input>
            </el-form-item>
            
            <el-form-item>
                <div class="buttonGroup">
                    <el-button 
                        type="danger" 
                        @click="handleCancel"
                        :disabled="isLoading"
                    >取消</el-button>
                    <el-button 
                        type="primary" 
                        @click="handleLogin"
                        :loading="isLoading"
                    >登录</el-button>
                </div>
            </el-form-item>
            
            <el-form-item>
                <div class="extraLinks">
                    <span class="linkText">还没有账号？</span>
                    <el-link 
                        type="primary" 
                        @click="goToSignUp"
                        :disabled="isLoading"
                    >立即注册</el-link>
                </div>
            </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<style scoped lang="less">
.loginPage{
    width: 100vw;
    height: 100vh;
    background: url('/src/assets/imgs/background/BingWallpaper.jpg') center/cover no-repeat;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}

.pageLogo{
    position: absolute;
    top: 30px;
    left: 40px;
    cursor: pointer;
    transition: opacity 0.3s;
    
    &:hover{
        opacity: 0.8;
    }
    
    h1{
        margin: 0;
        font-size: 28px;
        font-weight: 700;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .logoSubtitle{
        display: block;
        font-size: 13px;
        color: white;
        margin-top: 4px;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
    }
}

.loginWindow{
    width: 400px;
    background-color: white;
    border-radius: 10px;
    padding: 40px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    
    .loginTitle{
        text-align: center;
        margin-bottom: 30px;
        font-size: 24px;
        font-weight: 600;
        color: #333;
    }

    .el-form{
        .el-form-item{
            margin-bottom: 20px;
        }
        
        .buttonGroup{
            width: 100%;
            display: flex;
            justify-content: space-evenly;
            gap: 20px;
            
            .el-button{
                flex: 1;
            }
        }
        
        .extraLinks{
            width: 100%;
            text-align: center;
            margin-top: 10px;
            
            .linkText{
                color: #666;
                font-size: 14px;
                margin-right: 8px;
            }
        }
    }
}

</style>
