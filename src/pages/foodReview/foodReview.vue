<script setup>
import {ref,getCurrentInstance,onMounted} from "vue"
const {proxy} = getCurrentInstance()


//一开始先隐藏页面，等token验证成功了再显示页面
const isShowBody = ref(false)




//验证token的函数(token不合法且处于非法页面则会跳转到登陆页面)
const tokenVerify = async ()=>{
  try{
    await proxy.$tokenApi.checkToken()
    isShowBody.value = true
  }catch(error){
    console.log(error)
  }
}
onMounted(()=>{
  tokenVerify()
})



</script>

<template>
  <div class="body" v-show="isShowBody">
    <el-button type="primary">美食点评</el-button>
  </div>
</template>

<style scoped>
</style>
