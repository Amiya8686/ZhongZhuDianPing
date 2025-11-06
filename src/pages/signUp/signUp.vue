<script setup>
import {reactive, getCurrentInstance, ref} from "vue"
const {proxy} = getCurrentInstance();

//注册表单引用
const signUpFormRef = ref(null)

//数据
const signUpInfo = reactive({
    userName:"",
    nickName:"",
    password:"",
    confirmPassword:""
})

//自定义验证规则：确认密码
const validateConfirmPassword = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请再次输入密码'))
    } else if (value !== signUpInfo.password) {
        callback(new Error('两次输入的密码不一致'))
    } else {
        callback()
    }
}

//表单验证规则
const signUpRules = reactive({
    userName: [
        { required: true, message: "请输入用户名", trigger: "blur" },
        { min: 3, max: 20, message: "用户名长度应为3-20个字符", trigger: "blur" },
        { pattern: /^[a-zA-Z0-9_]+$/, message: "用户名只能包含字母、数字和下划线", trigger: "blur" }
    ],
    nickName: [
        { required: true, message: "请输入昵称", trigger: "blur" },
        { min: 2, max: 20, message: "昵称长度应为2-20个字符", trigger: "blur" }
    ],
    password: [
        { required: true, message: "请输入密码", trigger: "blur" },
        { min: 6, max: 20, message: "密码长度应为6-20个字符", trigger: "blur" }
    ],
    confirmPassword: [
        { required: true, validator: validateConfirmPassword, trigger: "blur" }
    ]
})

//注册状态
const isLoading = ref(false)

//函数：处理注册
const handleSignUp = ()=>{
    signUpFormRef.value.validate(async (valid)=>{
        if(valid){
            isLoading.value = true
            try{
                // 准备注册数据（不包含 confirmPassword）
                const registerData = {
                    userName: signUpInfo.userName,
                    nickName: signUpInfo.nickName,
                    password: signUpInfo.password
                }
                
                await proxy.$userApi.signUp(registerData);
                ElMessage.success("注册成功！即将跳转到登录页...")
                
                // 1秒后跳转到登录页面
                setTimeout(() => {
                    window.location.href = "/user/login"
                }, 1000)
            }catch(error){
                console.error("注册失败:", error)
                //错误信息已在request.js的响应拦截器中通过ElMessage显示
            }finally{
                isLoading.value = false
            }
        }else{
            ElMessage.warning("请填写完整的注册信息")
        }
    })
}

//函数：跳转到登录页面
const goToLogin = ()=>{
    window.location.href = "/user/login"
}

//函数：取消注册，返回首页
const handleCancel = ()=>{
    window.location.href = "/home"
}

//函数：按Enter键注册
const handleKeyPress = (event)=>{
    if(event.key === 'Enter'){
        handleSignUp()
    }
}

</script>

<template>
  <div class="signUpPage">
    <!-- 左上角 Logo -->
    <div class="pageLogo" @click="() => window.location.href = '/home'">
      <h1>中珠点评</h1>
      <span class="logoSubtitle">校园美食点评平台</span>
    </div>
    
    <div class="signUpWindow">
        <h2 class="signUpTitle">用户注册</h2>
        <el-form
            ref="signUpFormRef"
            :model="signUpInfo"
            :rules="signUpRules"
            label-width="100px"
            @keypress.enter="handleKeyPress"
        >
            <el-form-item label="用户名" prop="userName">
                <el-input 
                    v-model="signUpInfo.userName" 
                    placeholder="请输入用户名（字母、数字、下划线）"
                    clearable
                    :disabled="isLoading"
                ></el-input>
            </el-form-item>
            
            <el-form-item label="昵称" prop="nickName">
                <el-input 
                    v-model="signUpInfo.nickName" 
                    placeholder="请输入昵称"
                    clearable
                    :disabled="isLoading"
                ></el-input>
            </el-form-item>
            
            <el-form-item label="密码" prop="password">
                <el-input 
                    v-model="signUpInfo.password" 
                    type="password"
                    placeholder="请输入密码（6-20位）"
                    show-password
                    clearable
                    :disabled="isLoading"
                ></el-input>
            </el-form-item>
            
            <el-form-item label="确认密码" prop="confirmPassword">
                <el-input 
                    v-model="signUpInfo.confirmPassword" 
                    type="password"
                    placeholder="请再次输入密码"
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
                        @click="handleSignUp"
                        :loading="isLoading"
                    >注册</el-button>
                </div>
            </el-form-item>
            
            <el-form-item>
                <div class="extraLinks">
                    <span class="linkText">已有账号？</span>
                    <el-link 
                        type="primary" 
                        @click="goToLogin"
                        :disabled="isLoading"
                    >立即登录</el-link>
                </div>
            </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<style scoped lang="less">
.signUpPage{
    width: 100vw;
    height: 100vh;
    background: url('/src/assets/imgs/BingWallpaper.jpg') center/cover no-repeat;
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

.signUpWindow{
    width: 450px;
    background-color: white;
    border-radius: 10px;
    padding: 40px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    
    .signUpTitle{
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
