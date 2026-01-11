<script setup>
import {reactive, getCurrentInstance, onMounted, ref} from "vue"
import {defaultUserInfo} from "@/config/defaultUserInfo"
const {proxy} = getCurrentInstance()

//用户信息和密码数据
const formData = reactive({
  userName: defaultUserInfo.userName,
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const isLoading = ref(false)
const showPassword = ref(false)

//验证规则
const editRule = reactive({
  oldPassword: [
    { required: true, message: "请输入旧密码", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度应为6-20个字符", trigger: "blur" }
  ],
  newPassword: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度应为6-20个字符", trigger: "blur" }
  ],
  confirmPassword: [
    { 
      validator: (rule, value, callback) => {
        if(formData.newPassword!=""&&value==""){
          callback(new Error('请再次输入新密码'))
        }else if (value !== formData.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        }else {
          callback()
        }
      }, 
      trigger: "blur" 
    }
  ]
})

//函数：加载用户的个人信息
const loadUserInfo = async ()=>{
  try{
    const info = await proxy.$userApi.getUserInfo()
    formData.userName = info.userName
  }catch(error){
    ElMessage.error("加载用户信息失败")
    console.log(error)
  }
}

//函数: 按logo跳转到home页面
const handleClickLogo = ()=>{
    window.location.href = "/home"
}

//函数：切换密码显示状态
const togglePasswordVisibility = ()=>{
  showPassword.value = !showPassword.value
}

//函数：重置表单
const handleCancel = ()=>{
  formData.oldPassword = ''
  formData.newPassword = ''
  formData.confirmPassword = ''
}

//函数: 提交表单
const submitForm = async ()=>{
  proxy.$refs["editForm"].validate(async (valid)=>{
        if(valid){
            isLoading.value = true
            try{
                // 准备注册数据（不包含 confirmPassword）
                const editInfo = {
                    password:formData.oldPassword,
                    newPassword:formData.newPassword
                }
                
                await proxy.$userApi.editPassword(editInfo);
                ElMessage.success("密码修改成功")    
            }catch(error){
              ElMessage.error("修改密码失败:"+error)
            }finally{
                isLoading.value = false
            }
        }else{
            ElMessage.warning("请正确填写信息")
        }
    })
}

//验证token
const isShowPage = ref(false);
const tokenVerify = async ()=>{
  try{
    await proxy.$tokenApi.checkToken();
    isShowPage.value = true;
  }catch(error){
    console.log(error);
  }
}
onMounted(()=>{
  tokenVerify();
  loadUserInfo();
})

</script>

<template>
  <div class="page" v-show="isShowPage">
    <!-- 左上角 Logo -->
    <div class="pageLogo" @click="handleClickLogo">
      <h1>中珠点评</h1>
      <span class="logoSubtitle">校园美食点评平台</span>
    </div>
    <div class="editBox">
        <el-form
            ref="editForm"
            :model="formData"
            :rules="editRule"
            label-width="0px"
        >   
            <!-- 用户名（只读） -->
            <el-form-item prop="userName">
                <el-input 
                    v-model="formData.userName" 
                    placeholder="用户名"
                    :disabled="true"
                ></el-input>
            </el-form-item>

            <!-- 旧密码 -->
            <el-form-item prop="oldPassword">
                <el-input 
                    v-model="formData.oldPassword" 
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="旧密码"
                    clearable
                    :disabled="isLoading"
                ></el-input>
            </el-form-item>

            <!-- 新密码 -->
            <el-form-item prop="newPassword">
                <el-input 
                    v-model="formData.newPassword" 
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="新密码"
                    clearable
                    :disabled="isLoading"
                ></el-input>
            </el-form-item>      
            <!-- 确认密码 -->
            <el-form-item prop="confirmPassword">
                <el-input 
                    v-model="formData.confirmPassword" 
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="确认密码"
                    clearable
                    :disabled="isLoading"
                ></el-input>
            </el-form-item>
            <!-- 按钮组 -->
            <div class="showPasswordBox">
              <el-button 
                @click="togglePasswordVisibility"
                :disabled="isLoading"
                class = "showPasswordButton"
              >
                {{ showPassword ? '隐藏密码' : '显示密码' }}
              </el-button>
            </div>
            <div class="buttonGroup">
                <el-button
                    type="danger" 
                    @click="handleCancel"
                    :disabled="isLoading"
                >
                  取消
                </el-button>
                <el-button 
                    type="primary" 
                    :loading="isLoading"
                    @click="submitForm"
                >
                  确认
                </el-button>
            </div>
        </el-form>
    </div>
  </div>
</template>

<style scoped lang="less">
.page{
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

.editBox{
    width: 350px;
    background-color: white;
    border-radius: 10px;
    padding: 40px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    
    .el-form{
        .el-form-item{
            margin-bottom: 20px;
            justify-content: flex-start;
        }

        .showPasswordBox{
          display: flex;
          justify-content: flex-end;
          margin-bottom: 10px;
        }

        .buttonGroup{
            margin-left: 50px;
            margin-right: 50px;
            display: flex;
            justify-content: space-between;
            gap: 20px;
            
            .el-button{
                flex: 1;
            }
        }
    }
}
</style>
