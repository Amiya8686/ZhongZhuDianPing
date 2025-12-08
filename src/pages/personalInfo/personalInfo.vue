<script setup>
import {reactive, getCurrentInstance, onMounted, ref} from "vue"
import {defaultUserInfo} from "@/config/defaultUserInfo"
const {proxy} = getCurrentInstance()

//用户信息
const userInfo = reactive({
  userName: defaultUserInfo.userName,
  nickName: defaultUserInfo.nickName,
  avatarUrl:defaultUserInfo.avatarUrl
})
const avatarFile = ref(null)
const isLoading = ref(false)


//验证规则
const editRule = reactive({
  nickName: [
        { required: true, message: "请输入昵称", trigger: "change" },
        { min: 2, max: 20, message: "昵称长度应为2-20个字符", trigger: "change" }
  ] ,
})

//函数：加载用户的个人信息
const loadUserInfo = async ()=>{
  try{
    const info = await proxy.$userApi.getUserInfo()
    userInfo.userName = info.userName
    userInfo.nickName = info.nickName
    userInfo.avatarUrl = info.avatarUrl
  }catch(error){
    ElMessage.error("加载用户信息失败")
    console.log(error)
  }
}
//函数: 按logo跳转到home页面
const handleClickLogo = ()=>{
    window.location.href = "/home"
}
//函数：在文件暂存之前检查它是否符合要求
const checkFile = (rawFile) => {
  const allowedTypes = ['image/jpeg', 'image/png']; 
  const allowedExtensions = ['.jpg', '.jpeg', '.png'];
  const fileExtension = rawFile.name.slice(rawFile.name.lastIndexOf('.')).toLowerCase(); 

  
  //校验类型
  if (!allowedTypes.includes(rawFile.type) && !allowedExtensions.includes(fileExtension)) {
    ElMessage.error(`仅支持上传 ${allowedExtensions.join('、')} 格式的图片！`);
    return false;
  }

  //大小限制3MB
  const maxSize = 3 * 1024 * 1024; // 2MB 对应的字节数
  if (rawFile.size > maxSize) {
    ElMessage.error(`图片大小不能超过 ${maxSize / 1024 / 1024}MB`);
    return false; 
  }

  //所有校验通过
  return true;
};
//函数: 处理选择头像的改变
const handleAvatarChange = (uploadFile)=>{
  if(!checkFile(uploadFile.raw)){
    return;
  }
  avatarFile.value = uploadFile.raw;
  userInfo.avatarUrl = URL.createObjectURL(avatarFile.value)
}
//函数：处理取消按钮，重新加载信息
const handleCancel = ()=>{
  loadUserInfo()
  avatarFile.value = null
}
//函数: 提交表单
const submitForm = async ()=>{
    proxy.$refs["editForm"].validate( async (valid)=>{
      if(valid){
        isLoading.value=true
        //生成formData
        const formData = new FormData()
        if(avatarFile.value!=null){
          formData.append('avatar',avatarFile.value)
        }
        formData.append('nickName',userInfo.nickName)

        //发送请求
        try{
          await proxy.$userApi.editUserInfo(formData)
          ElMessage.success("修改成功")
          loadUserInfo()
        }catch(error){
          console.log(error)
          ElMessage.error(error || "修改失败")
        }finally{
          isLoading.value = false
        }
      }else{
        ElMessage.error("请输入正确的信息")
      }
  })
}



onMounted(()=>{
  loadUserInfo();
})

</script>

<template>
  <div class="page">
    <!-- 左上角 Logo -->
    <div class="pageLogo" @click="handleClickLogo">
      <h1>中珠点评</h1>
      <span class="logoSubtitle">校园美食点评平台</span>
    </div>
    <div class="editBox">
        <el-form
            ref="editForm"
            :model="userInfo"
            :rules="editRule"
            label-width="75px"
            label-position="right"
        >   
            <!--头像上传部分-->
            <el-upload
              class="avatarUploader"
              :auto-upload="false"           
              :on-change="handleAvatarChange"  
              :show-file-list="false"
            >

              <!-- 预览图/默认图标 -->
            <img :src="userInfo.avatarUrl" class="avatar" />
            </el-upload>       

            <el-form-item label="用户名" prop="userName" >
                <el-input 
                    v-model="userInfo.userName" 
                    placeholder = "用户名"
                    :disabled="true"
                ></el-input>
            </el-form-item>
            <el-form-item label="昵称" prop="nickName" >
                <el-input 
                    v-model="userInfo.nickName" 
                    placeholder = "昵称"
                    clearable
                    :disabled="isLoading"
                ></el-input>
            </el-form-item>      
            <div class="buttonGroup">
                <el-button 
                    type="danger" 
                    :disabled="isLoading"
                    @click="handleCancel"
                >取消</el-button>
                <el-button 
                    type="primary" 
                    :loading="isLoading"
                    @click="submitForm"
                >修改</el-button>
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
        
        .avatarUploader{
          display: flex;
          justify-content: center;
          margin-bottom: 30px;


          &:hover .avatar{
            transform: scale(1.3);
          }

          .avatar{
            width:120px;
            height:120px;
            border-radius: 50%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }
          
        }

        .buttonGroup{
            margin-left:50px;
            margin-right:50px;
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