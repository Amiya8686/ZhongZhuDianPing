<script setup>
import {reactive, getCurrentInstance, ref} from "vue"
import {useRouter} from "vue-router"
const {proxy} = getCurrentInstance()
const router = useRouter()



//表单数据与验证规则
const loginInfo = reactive({
    ID:"",
    password:"",
})
const loginRules = reactive({
    ID: [
        { required: true, message: "请输入管理员ID", trigger: "blur" },
    ],
    password: [
        { required: true, message: "请输入密码", trigger: "blur" },
    ]
})

//登录状态
const isLoading = ref(false)

//函数：登录
const handleLogin = ()=>{
    proxy.$refs["loginForm"].validate(async (valid)=>{
        if(valid){
            isLoading.value = true
            try{
                const data = await proxy.$adminApi.adminLogin(loginInfo);
                ElMessage.success("登录成功！")
                //存储token到本地存储
                localStorage.setItem("token", JSON.stringify(data.token))
                //跳转页面
                router.push("home")
            }catch(error){
                ElMessage.error(error)
            }finally{
                isLoading.value = false
            }
        }else{
            ElMessage.warning("请正确填写登录信息")
        }
    })
}

//函数：取消登录，返回首页
const handleCancel = ()=>{
    loginInfo.ID=""
    loginInfo.password=""
}
</script>


<template>
  <div class="loginPage">
    <!-- 左上角 Logo -->
    <div class="pageLogo" @click="handleClickLogo">
      <h1>中珠点评后台管理系统</h1>
      <span class="logoSubtitle">校园美食点评平台</span>
    </div>
    
    <div class="loginWindow">
        <h2 class="loginTitle">管理员登录</h2>
        <el-form
            ref="loginForm"
            :model="loginInfo"
            :rules="loginRules"
            label-width="80px"
        >
            <el-form-item label="管理员ID" prop="ID">
                <el-input 
                    v-model="loginInfo.ID" 
                    placeholder="请输入管理员ID"
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
        </el-form>
    </div>
  </div>
</template>

<style scoped lang="less">
.loginPage{
    width: 100%;
    height: 100%;
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
    transition: opacity 0.3s;    
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
    }
}
</style>
