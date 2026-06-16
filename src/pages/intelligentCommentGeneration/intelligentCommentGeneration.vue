<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import IconImg from '@/assets/imgs/icon/icon.svg'
import MagicWorkShopTime from '@/components/magicWorkShopTime.vue'
import MagicWorkShopSelector from '@/components/magicWorkShopSelector.vue'

const { proxy } = getCurrentInstance()

const isShowBody = ref(false)

const userInfo = ref({
  username: '',
  nickName: '',
  avatar: ''
})

const tokenVerify = async () => {
  try {
    await proxy.$tokenApi.checkToken()
    isShowBody.value = true
  } catch (error) {
    console.log(error)
  }
}

const loadUserInfo = async () => {
  try {
    const data = await proxy.$userApi.getUserInfo()
    userInfo.value.username = data.userName
    userInfo.value.nickName = data.nickName
    userInfo.value.avatar = data.avatarUrl
  } catch (error) {
    console.error('加载用户信息失败', error)
  }
}

const goToHome = () => {
  window.location.href = '/home'
}

const goToFoodReview = () => {
  window.location.href = '/foodReview'
}

const goToPersonalInfo = () => {
  window.location.href = '/user/personalInfo'
}

const goToEditPassword = () => {
  window.location.href = '/user/editPassword'
}

const goToMyComment = () => {
  window.location.href = '/user/myComment'
}

const handleLogout = () => {
  localStorage.removeItem('token')
  window.location.href = '/user/login'
}

const handleCommand = (command) => {
  switch (command) {
    case 'personalInfo':
      goToPersonalInfo()
      break
    case 'editPassword':
      goToEditPassword()
      break
    case 'myComment':
      goToMyComment()
      break
    case 'logout':
      handleLogout()
      break
  }
}

onMounted(() => {
  tokenVerify()
  loadUserInfo()
})
</script>


<template>
  <div class="body" v-show="isShowBody">
    <div class="top-bar">
      <div class="title" @click="goToHome">
        <img :src="IconImg" class="title-icon" />
        <div class="title-text">
          <span class="main-title">中珠点评</span>
          <span class="sub-title">美食工坊</span>
        </div>
      </div>
      <div class="nav-links">
        <el-button link class="nav-btn" @click="goToHome">首页</el-button>
        <el-button link class="nav-btn" @click="goToFoodReview">美食点评</el-button>
      </div>
      <div class="right-section">
        <div v-if="userInfo.username" class="user-info">
          <el-dropdown @command="handleCommand">
            <span class="user-dropdown">
              <el-avatar :src="userInfo.avatar" :size="40"></el-avatar>
              <span class="user-name">{{ userInfo.nickName }}</span>
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="personalInfo">个人信息</el-dropdown-item>
                <el-dropdown-item command="editPassword">修改密码</el-dropdown-item>
                <el-dropdown-item command="myComment">我的评论</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <div class="main-canvas">
        <div class="canvas-placeholder">
          <span class="placeholder-icon">🖼️</span>
          <span class="placeholder-text">画布区域</span>
        </div>
      </div>

      <div class="side-panel">
        <MagicWorkShopTime />
        <MagicWorkShopSelector current-page="intelligentCommentGeneration" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.body {
  width: 100%;
  min-height: 100vh;
  background-color: #fef6e4;
  background-image: radial-gradient(#f3d2c1 1px, transparent 1px);
  background-size: 20px 20px;
}

.top-bar {
  width: 100%;
  height: 70px;
  background: #ff8e3c;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  box-shadow: 0 4px 12px rgba(255, 142, 60, 0.3);
  box-sizing: border-box;
}

.title {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.title:hover {
  opacity: 0.8;
}

.title-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  flex-shrink: 0;
}

.title-text {
  display: flex;
  flex-direction: column;
}

.main-title {
  font-size: 24px;
  color: white;
  font-weight: 800;
  text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.1);
  letter-spacing: 2px;
}

.sub-title {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 2px;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-right: auto;
  margin-left: 40px;

  .nav-btn {
    color: rgba(255, 255, 255, 0.9);
    font-size: 16px;
    font-weight: 700;
    padding: 8px 22px;
    border-radius: 20px;
    transition: all 0.3s;

    &:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.2);
    }
  }
}

.user-info {
  .user-dropdown {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    padding: 5px 15px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.2);
    transition: all 0.3s;
    outline: none;
    border: none;

    &:hover {
      background-color: rgba(255, 255, 255, 0.3);
      transform: scale(1.02);
    }

    .user-name {
      font-size: 14px;
      color: white;
      font-weight: 600;
    }

    .el-icon {
      color: white;
    }
  }
}

/* 主内容区 */
.main-content {
  display: flex;
  gap: 24px;
  max-width: 1400px;
  margin: 24px auto;
  padding: 0 40px;
  height: calc(100vh - 118px);
}

.main-canvas {
  flex: 1;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;

  .canvas-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    color: #ccc;

    .placeholder-icon {
      font-size: 64px;
    }

    .placeholder-text {
      font-size: 18px;
      font-weight: 600;
      color: #ddd;
    }
  }
}

.side-panel {
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex-shrink: 0;
  height: 100%;

  > :first-child {
    flex-shrink: 0;
  }

  > :last-child {
    flex: 1;
    min-height: 0;
  }
}
</style>
