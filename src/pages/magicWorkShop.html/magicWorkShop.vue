<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
// 导入栏目图片
import FoodConsultantImg from '@/assets/imgs/magicWorkShop/FoodConsultant.png'
import IntelligentCommentImg from '@/assets/imgs/magicWorkShop/IntelligentCommentGeneration.png'
import StallAnalysisImg from '@/assets/imgs/magicWorkShop/StallIntelligentAnalysis.png'

const { proxy } = getCurrentInstance()

//一开始先隐藏页面，等token验证成功了再显示页面
const isShowBody = ref(false)

//用户信息
const userInfo = ref({
  username: '',
  nickName: '',
  avatar: ''
})

//验证token
const tokenVerify = async () => {
  try {
    await proxy.$tokenApi.checkToken()
    isShowBody.value = true
  } catch (error) {
    console.log(error)
  }
}

//加载用户信息
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

//跳转到主页
const goToHome = () => {
  window.location.href = '/home'
}

//跳转到美食点评
const goToFoodReview = () => {
  window.location.href = '/foodReview'
}

//跳转到个人中心
const goToPersonalInfo = () => {
  window.location.href = '/user/personalInfo'
}

//跳转到修改密码页
const goToEditPassword = () => {
  window.location.href = '/user/editPassword'
}

//跳转到我的评论页
const goToMyComment = () => {
  window.location.href = '/user/myComment'
}

//退出登录
const handleLogout = () => {
  localStorage.removeItem('token')
  window.location.href = '/user/login'
}

//处理下拉菜单命令
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

//页面挂载时执行
onMounted(() => {
  tokenVerify()
  loadUserInfo()
})

// 栏目数据
const featureCards = ref([
  {
    id: 1,
    image: FoodConsultantImg,
    mainTitle: '美食小顾问',
    subTitle: '智能问答Agent',
    path: '/magicWorkshop/foodConsultant.html'
  },
  {
    id: 2,
    image: IntelligentCommentImg,
    mainTitle: '魔法评论熔炼锅',
    subTitle: '能够帮你生成魔法评论的小锅',
    path: '/magicWorkshop/intelligentCommentGeneration.html'
  },
  {
    id: 3,
    image: StallAnalysisImg,
    mainTitle: '食堂探长评析局',
    subTitle: '唐探长正在评审档口',
    path: '/magicWorkshop/stallIntelligentAnalysis.html'
  }
])

// 跳转到栏目页
const handleCardClick = (card) => {
  window.location.href = card.path
}
</script>


<template>
  <div class="body" v-show="isShowBody">
    <!-- 顶部导航栏 -->
    <div class="top-bar">
      <div class="title" @click="goToHome">
        <span class="main-title">中珠点评</span>
        <span class="sub-title">美食工坊</span>
      </div>
      <div class="nav-links">
        <el-button link class="nav-btn" @click="goToHome">首页</el-button>
        <el-button link class="nav-btn" @click="goToFoodReview">美食点评</el-button>
      </div>
      <div class="right-section">
        <!-- 已登录状态 -->
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

    <!-- 栏目入口 -->
    <div class="feature-grid">
      <el-card
        v-for="card in featureCards"
        :key="card.id"
        class="feature-card"
        shadow="hover"
        @click="handleCardClick(card)"
      >
        <div class="card-image">
          <img :src="card.image" :alt="card.mainTitle" />
        </div>
        <div class="card-info">
          <h3 class="card-main-title">{{ card.mainTitle }}</h3>
          <p class="card-sub-title">{{ card.subTitle }}</p>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped lang="less">
/* 整体布局 */
.body {
  width: 100%;
  min-height: 100vh;
  background-color: #fef6e4;
  background-image: radial-gradient(#f3d2c1 1px, transparent 1px);
  background-size: 20px 20px;
}

/* 顶部导航栏 */
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
  flex-direction: column;
  cursor: pointer;
  transition: opacity 0.3s;
}

.title:hover {
  opacity: 0.8;
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

/* 栏目入口网格 */
.feature-grid {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.feature-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  }

  .card-image {
    width: 100%;
    height: 200px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s;
    }
  }

  &:hover .card-image img {
    transform: scale(1.05);
  }

  .card-info {
    padding: 20px;
    text-align: center;

    .card-main-title {
      font-size: 20px;
      font-weight: 700;
      color: #333;
      margin: 0 0 10px 0;
    }

    .card-sub-title {
      font-size: 14px;
      color: #999;
      margin: 0;
    }
  }
}
</style>
