<script setup>
import { ref ,reactive,getCurrentInstance,onMounted} from 'vue'
import { ArrowDown} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';
const router = useRouter()
const {proxy} = getCurrentInstance()


const adminInfo = reactive({
    ID:"",
    name:"",
    permission:"",
    avatarUrl:"",
})
//表单
const editPasswordForm = reactive({
    ID:"",
    name:"",
    oldPassword:"",
    newPassword:"",
    confirmPassword:""
})
const editInfoForm = reactive({
    name:"",
    avatarUrl:""
})
const avatarFile = ref(null)
//表单验证规则
const editPasswordRules = reactive({
  oldPassword: [
    { required: true, message: "请输入旧密码", trigger: ["blur"] },
  ],
  newPassword: [
    { required: true, message: "请输入新密码", trigger: ["blur"] },
    { min: 6, max: 20, message: "密码长度应为6-20个字符", trigger: ["blur"] }
  ],
  confirmPassword: [
    { 
      validator: (rule, value, callback) => {
        if(editPasswordForm.newPassword!=""&&value==""){
          callback(new Error('请输入新密码'))
        }else if (value !== editPasswordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        }else {
          callback()
        }
      }, 
      trigger: ["blur"]
    }
  ]
})
const editInfoRules = reactive({
    name: [
        { required: true, message: "请输入姓名", trigger: ["blur"] },
        { min: 1, max: 20, message: "姓名长度应为1-20个字符", trigger: ["blur"] }
    ],
})
//显示对话框
const isShowEditPassword = ref(false)
const isShowEditInfo = ref(false)
const isEditPasswordLoading = ref(false)
const isEditInfoLoading = ref(false)



//获取现在登陆的管理员的信息
const getAdminInfo = async ()=>{
    try{
        const data = await proxy.$adminApi.getAdminInfo()
        adminInfo.ID = data.ID
        adminInfo.name = data.name
        adminInfo.permission = data.permission
        adminInfo.avatarUrl = data.avatarUrl
    }catch(error){
        console.log(error)
        ElMessage.error(error)
    }
}

//退出登陆
const handleLogout = ()=>{
    localStorage.removeItem("token")
    router.push("login")
}

//修改密码
const closeEditPassword = ()=>{
    isShowEditPassword.value=false
    proxy.$refs["passwordForm"].resetFields()
    proxy.$refs["passwordForm"].clearValidate()
}
const cancelEditPassword = ()=>{
    proxy.$refs["passwordForm"].resetFields()
    proxy.$refs["passwordForm"].clearValidate()
    loadEditPassword()
}
const submitEditPassword = ()=>{
    proxy.$refs["passwordForm"].validate(async (valid)=>{
        if(valid){
            isEditPasswordLoading.value = true
            try{
                await proxy.$adminApi.adminEditPassword({
                    password:editPasswordForm.oldPassword,
                    newPassword:editPasswordForm.newPassword
                })
                ElMessage.success("修改密码成功")
                proxy.$refs["passwordForm"].resetFields()
                proxy.$refs["passwordForm"].clearValidate()
                loadEditPassword()
                
            }catch(error){
                ElMessage.error(error)
            }finally{
                isEditPasswordLoading.value=false
            }
        }else{
            ElMessage.warning("请输入正确信息")
        }
    })
}
const loadEditPassword = ()=>{
    editPasswordForm.ID = adminInfo.ID
    editPasswordForm.name = adminInfo.name
    editPasswordForm.oldPassword=""
    editPasswordForm.newPassword=""
    editPasswordForm.confirmPassword=""
}


//修改个人信息
const closeEditInfo = ()=>{
    isShowEditInfo.value=false
    proxy.$refs["infoForm"].resetFields()
    proxy.$refs["infoForm"].clearValidate()
    avatarFile.value=null
}
const cancelEditInfo = ()=>{
    proxy.$refs["infoForm"].resetFields()
    proxy.$refs["infoForm"].clearValidate()
    avatarFile.value=null
    loadEditInfo()
}
const submitEditInfo = ()=>{
    proxy.$refs["infoForm"].validate( async (valid)=>{
      if(valid){
        isEditInfoLoading.value=true
        //生成formData
        const formData = new FormData()
        if(avatarFile.value!=null){
          formData.append('avatar',avatarFile.value)
        }
        formData.append('name',editInfoForm.name)

        //发送请求
        try{
          await proxy.$adminApi.adminEditInfo(formData)
          ElMessage.success("修改成功")
          getAdminInfo()
          loadEditInfo()
        }catch(error){
          console.log(error)
          ElMessage.error(error || "修改失败")
        }finally{
          isEditInfoLoading.value = false
        }
      }else{
        ElMessage.warning("请输入正确的信息")
      }
  })
}
const handleAvatarChange = (uploadFile)=>{
  if(!checkFile(uploadFile.raw)){
    return;
  }
  avatarFile.value = uploadFile.raw;
  editInfoForm.avatarUrl = URL.createObjectURL(avatarFile.value)
}
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
const loadEditInfo = ()=>{
    editInfoForm.name = adminInfo.name
    editInfoForm.avatarUrl = adminInfo.avatarUrl
}




onMounted(()=>{
    getAdminInfo()
})
</script>

<template>
	<header class="topbar">
		<div class="topbar-left">
			<div class="app-title-main">中珠点评</div>
            <div class="app-title-sub">后台管理系统</div>
		</div>

		<div class="topbar-right">
			<el-dropdown trigger="click" class="profile-dropdown">
				<span class="dropdown-trigger">
					<el-avatar :src="adminInfo.avatarUrl" size="default"></el-avatar>
					<span class="username">{{ adminInfo.name }}</span>
					<el-icon class="arrow"><arrow-down/></el-icon>
				</span>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item @click="isShowEditInfo = true">修改个人信息</el-dropdown-item>
						<el-dropdown-item @click="isShowEditPassword = true">修改密码</el-dropdown-item>
						<el-dropdown-item divided @click="handleLogout">退出登陆</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</div>
	</header>

    <!-- 修改密码对话框 -->
    <el-dialog v-model="isShowEditPassword" width="520px" class="edit-password-dialog" @close="closeEditPassword" @open="loadEditPassword">
        <template #title>
            <span>修改密码</span>
        </template>

        <div class="dialog-body">
            <el-form :model="editPasswordForm" label-width="100px" class="edit-password-form" :rules="editPasswordRules" ref="passwordForm">
                <el-form-item label="管理员ID" prop="ID">
                    <el-input v-model="editPasswordForm.ID" disabled></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="editPasswordForm.name" disabled></el-input>
                </el-form-item>

                <el-form-item label="旧密码" prop="oldPassword">
                    <el-input v-model="editPasswordForm.oldPassword" type="password" placeholder="请输入旧密码" show-password :disabled="isEditPasswordLoading"></el-input>
                </el-form-item>

                <el-form-item label="新密码" prop="newPassword">
                    <el-input v-model="editPasswordForm.newPassword" type="password" placeholder="请输入新密码" show-password :disabled="isEditPasswordLoading"></el-input>
                </el-form-item>

                <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input v-model="editPasswordForm.confirmPassword" type="password" placeholder="请再次输入新密码" show-password :disabled="isEditPasswordLoading"></el-input>
                </el-form-item>
            </el-form>
        </div>

        <template #footer>
            <div class="dialog-footer">
                <el-button type="danger" @click="cancelEditPassword">取消</el-button>
                <el-button type="primary" @click="submitEditPassword">确定</el-button>
            </div>
        </template>
    </el-dialog>

    <!-- 修改个人信息对话框 -->
    <el-dialog v-model="isShowEditInfo" width="520px" class="edit-info-dialog" @close="closeEditInfo" @open="loadEditInfo">
        <template #title>
            <span>修改个人信息</span>
        </template>

        <div class="dialog-body">
            <!--头像上传部分-->
            <el-upload
              class="avatarUploader"
              :auto-upload="false"           
              :on-change="handleAvatarChange"  
              :show-file-list="false"
              :disabled="isEditInfoLoading"
            >
              <!-- 预览图/默认图标 -->
            <img :src="editInfoForm.avatarUrl" class="uploadAvatar" />
            </el-upload>       
            <el-form :model="editInfoForm" label-width="100px" class="edit-info-form" :rules="editInfoRules" ref="infoForm">
                <el-form-item label="管理员ID">
                    <el-input v-model="adminInfo.ID" disabled></el-input>
                </el-form-item>
                <el-form-item label="权限">
                    <el-input v-model="adminInfo.permission" disabled></el-input>
                </el-form-item>

                <el-form-item label="姓名" prop="name">
                    <el-input v-model="editInfoForm.name" placeholder="请输入姓名" :disabled="isEditInfoLoading"></el-input>
                </el-form-item>
            </el-form>
        </div>

        <template #footer>
            <div class="dialog-footer">
                <el-button type="danger" @click="cancelEditInfo">取消</el-button>
                <el-button type="primary" @click="submitEditInfo">确定</el-button>
            </div>
        </template>
    </el-dialog>
    

</template>

<style scoped lang="less">
.topbar{
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 20px;
	background: #ffffff;
	border-bottom: 1px solid rgba(0,0,0,0.04);
	box-shadow: 0 4px 12px rgba(20,30,44,0.04);
}

.topbar-left{
    margin-left:10px;
	display: flex;
    flex-direction: column;
	align-items: center;
}



.app-title-main{
	font-size: 20px;
	color: #2f3b45;
	font-weight: 600;
}

.app-title-sub{
	font-size: 16px;
	color: #394a57;
	font-weight: 600;
}

.topbar-right{
	display: flex;
	align-items: center;
}

.icon-btn{
	color: #6b7380;
	margin-right: 12px;
}

.dropdown-trigger{
	display: inline-flex;
	align-items: center;
	cursor: pointer;
}

.dropdown-trigger .username{
	margin: 0 8px;
	font-size: 14px;
	color: #2f3b45;
}

.dropdown-trigger .arrow{
	color: #9aa0a6;
}

/* 头像放大动画：hover 与触控 (active) */
.dropdown-trigger .el-avatar{
	transition: transform 180ms ease, box-shadow 180ms ease;
	will-change: transform;
}

.dropdown-trigger:hover .el-avatar,
.dropdown-trigger:active .el-avatar{
		transform: scale(1.12);
		box-shadow: 0 8px 20px rgba(20,30,44,0.12);
}

@media (hover: none){
	.dropdown-trigger:active .el-avatar{
		transform: scale(1.12);
		box-shadow: 0 8px 20px rgba(20,30,44,0.12);
	}
}

.el-dropdown-menu{
	min-width: 160px;
}

.el-dropdown-item{
	font-size: 14px;
}

/* 对话框样式 */
.edit-password-dialog  .el-dialog__header{
	padding: 16px 20px;
	border-bottom: none;
}

.edit-password-dialog .dialog-body{
	padding: 8px 20px 18px 20px;
}

.edit-password-form .el-form-item{
	margin-bottom: 20px;
}

.edit-password-form .el-input__inner{
	height: 40px;
	padding: 8px 12px;
	border: 1px solid rgba(0,0,0,0.08);
}

.edit-password-dialog .dialog-footer{
	padding: 12px 20px 18px 20px;
	display: flex;
	justify-content: flex-end;
	gap: 12px;
}

@media (max-width: 600px){
	.edit-password-dialog .el-dialog{
		width: calc(100% - 24px) !important;
	}
}




.avatarUploader{
    display: flex;
    justify-content: center;
    margin-bottom: 30px;


    &:hover .uploadAvatar{
    transform: scale(1.3);
    }

    .uploadAvatar{
    width:120px;
    height:120px;
    border-radius: 50%;
    object-fit: cover;
    transition: transform 0.3s ease;
    }
}

</style>