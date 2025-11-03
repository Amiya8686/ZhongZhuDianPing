<script setup>
import {reactive,getCurrentInstance} from "vue"
const {proxy} = getCurrentInstance();


//数据
const loginInfo = reactive({
    userName:"",
    password:""
})
const loginRules = reactive({
    userName: [{ required: true, message: "用户名为空", trigger: "blur" }],
    password: [{required:true,message:"密码为空",trigger:"blur"}]
})



//函数
const handleLogin = ()=>{
    proxy.$refs["loginBox"].validate(async (valid)=>{
        if(valid){
            try{
                const {token} = await proxy.$userApi.login(loginInfo);
                ElMessage.success("登陆成功")
                //存储token
                localStorage.setItem("token",JSON.stringify(token))
                window.location.href="/home"
            }catch(error){
                console.log(error)
            }
        }
    })
}



</script>

<template>
  <div class="loginWindow">
    <el-form
        ref="loginBox"
        :model="loginInfo"
        :rules="loginRules"
        label-width="auto"
    >
        <el-row>
            <el-form-item label="userName" prop="userName">
                <el-input v-model="loginInfo.userName" placeholder="请输入用户名"></el-input>
            </el-form-item>
        </el-row>
        <el-row>
            <el-form-item label="password" prop="password">
                <el-input v-model="loginInfo.password" placeholder="请输入密码"></el-input>
            </el-form-item>
        </el-row>
        <el-row style="justify-content: space-evenly;">
            <el-button type="danger">取消</el-button>
            <el-button type="primary" @click="handleLogin">登陆</el-button>
        </el-row>
        
    </el-form>
  </div>
</template>

<style scoped lang="less">
.loginWindow{
    position:fixed;
    left:50%;
    top:50%;
    transform:translate(-50%,-50%);
    
    background-color: white;
    border: 1px solid black;
    padding:50px;
    padding-bottom: 30px;
    border-radius:3px;

    .el-form{
        z-index: 6;
    }
    .el-form-item{
        display: flex;
        justify-content: space-between;
    }

}

</style>
