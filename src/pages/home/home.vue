<script setup>
import {reactive,getCurrentInstance,onMounted} from "vue"
import {defaultUserInfo} from "@/config/defaultUserInfo"
const {proxy} = getCurrentInstance()
const userInfo = reactive({
  userName: defaultUserInfo.userName,
  nickName: defaultUserInfo.nickName,
  avatarUrl:defaultUserInfo.avatarUrl
})


const getUserInfo = async () =>{
  try{
    
    let newUserInfo = await proxy.$userApi.getUserInfo()
    userInfo.userName = newUserInfo.userName
    userInfo.nickName = newUserInfo.userName
    userInfo.avatarUrl = newUserInfo.avatarUrl
  }catch(error){
    console.log(error)
  }
}



onMounted(()=>{
  getUserInfo();
})

</script>
<template>
  <div class="mainWindow">
    <el-button type="primary">首页</el-button>
    <img :src=userInfo.avatarUrl></img>
  </div>
</template>

<style scoped lan="less">
.mainWindow{
  width:98vw;
  img{
    height:100%;
    width:100%;
    overflow: hidden;
    object-fit: cover;
  }
}



</style>
