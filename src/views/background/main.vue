<script setup>
import backgroundAside from '@/components/backgroundAside.vue';
import backgroundHead from "@/components/backgroundHead.vue"
import { ElMessage } from 'element-plus';
import { getCurrentInstance, onMounted, ref } from 'vue';

const {proxy} = getCurrentInstance()
const isShowPage = ref(false)



//检查页面是否合法
const checkPage = async ()=>{
    try{
        await proxy.$adminApi.backgroundCheckToken()
        isShowPage.value = true;
    }catch(error){
        ElMessage.error("身份验证失败,即将跳转到登陆页面")
        setTimeout(() => {window.location.href="/background/#/login"}, 2000);
    }
}


onMounted(()=>{
    checkPage()
})



</script>

<template>
    <div class="commont-layout">
        <!-- 页面已通过验证，正常渲染应用布局 -->
        <div v-if="isShowPage">
            <el-container class="layout-container">
                <!--顶部栏-->
                <el-header class="el-header">
                    <background-head></background-head>
                </el-header>
                <el-container>
                    <el-main class="right-main">
                        <background-aside />
                        <router-view></router-view>
                    </el-main>
                </el-container>
            </el-container>
        </div>

        <!-- 验证期间的等待占位页 -->
        <div v-else class="auth-wait">
            <div class="auth-card">
                <div class="spinner" aria-hidden="true"></div>
                <p class="auth-text">正在验证身份，请稍等</p>
            </div>
        </div>
    </div>
</template>




<style scoped lang="less">
.commont-layout,.layout-container{
    height:100%;
    width:100%;
}
.el-header{
    background-color: #333;
    padding:0;
}
.right-main{
    display: flex;
    padding: 0;
    flex: 1;
    overflow-x: hidden;
}

/* 验证等待样式 */
.auth-wait{
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(180deg, #fbfcfd 0%, #f6f7f9 100%);
}

.auth-card{
    width: 360px;
    max-width: calc(100% - 40px);
    background: #ffffff;
    border-radius: 12px;
    padding: 36px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 12px 30px rgba(20,30,44,0.08);
}

.spinner{
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: 4px solid rgba(100,116,139,0.12);
    border-top-color: #409EFF; /* 主题蓝 */
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
}

.auth-text{
    margin: 0;
    color: #345;
    font-size: 15px;
    font-weight: 500;
}

@keyframes spin{
    from{transform: rotate(0deg)}
    to{transform: rotate(360deg)}
}

</style>