<script setup>
import { ref ,getCurrentInstance} from 'vue'
import { House, User, Shop, UserFilled } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const {proxy} = getCurrentInstance()



// 处理选项点击
const goToPath = (path) => {
    router.push(path)
}
</script>

<template>
    <el-aside width="220px" class="sidebar">
        <el-menu class="menu" :default-active="'1'" :router="false" background-color="#ffffff" text-color="#606266" active-text-color="#409EFF">
            <el-menu-item index="1" class="menu-item" @click="goToPath('home')">
                <el-icon class="icon"><house /></el-icon>
                <span class="label">首页</span>
            </el-menu-item>

            <el-menu-item index="2" class="menu-item" @click="goToPath('userManage')">
                <el-icon class="icon"><user /></el-icon>
                <span class="label">用户管理</span>
            </el-menu-item>

            <el-menu-item index="3" class="menu-item" @click="goToPath('stallManage')">
                <el-icon class="icon"><shop /></el-icon>
                <span class="label">档口管理</span>
            </el-menu-item>

            <el-menu-item index="4" class="menu-item" @click="goToPath('adminManage')">
                <el-icon class="icon"><user-filled /></el-icon>
                <span class="label">管理员管理</span>
            </el-menu-item>
        </el-menu>
    </el-aside>
</template>

<style scoped lang="less">
.sidebar{
    height: 100vh;
    background: #f7f8fa; /* 白灰基底 */
    margin-right: 1px;
    margin-top:0;
    box-shadow: 0 8px 22px rgba(20, 30, 44, 0.06);
    border-right: 1px solid rgba(0,0,0,0.04);
    display: flex;
    flex-direction: column;

    .menu{
        background: transparent;
        padding-top: 12px;
    }

    .menu-item{
        height: 56px;
        display: flex !important;
        align-items: center;
        padding: 0 18px !important;
        color: #2f3b45;
        border-radius: 8px;
        margin: 8px 12px;
        transition: all 0.16s ease;

        &:hover{
            background: rgba(64,158,255,0.06);
            transform: translateY(-1px);
            box-shadow: 0 6px 12px rgba(45, 70, 100, 0.04);
        }

        .icon{
            width: 22px;
            height: 22px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
            color: #6b7380;
            flex-shrink: 0;
        }

        .label{
            font-size: 14px;
            color: #2f3b45;
        }
    }
}
</style>