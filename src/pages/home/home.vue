<script setup>
import {reactive, getCurrentInstance, onMounted, ref, computed} from "vue"
import {defaultUserInfo} from "@/config/defaultUserInfo"
import { ArrowDown } from '@element-plus/icons-vue' // <-- 添加这一行
import IconImg from '@/assets/imgs/icon/icon.svg'
import foodReviewImg from '@/assets/imgs/home/foodReview.png'
import foodMapImg from '@/assets/imgs/home/foodMap.png'
import foodWorkShopImg from '@/assets/imgs/home/foodWorkShop.png'
const {proxy} = getCurrentInstance()

//用户信息
const userInfo = reactive({
  userName: defaultUserInfo.userName,
  nickName: defaultUserInfo.nickName,
  avatarUrl:defaultUserInfo.avatarUrl
})

//是否已登录
const isLoggedIn = ref(false)

//推荐档口列表
const recommendedStallList = ref([])

//计算属性：将推荐列表分组，每组3个
const recommendedGroups = computed(() => {
  const groups = []
  for (let i = 0; i < recommendedStallList.value.length; i += 3) {
    groups.push(recommendedStallList.value.slice(i, i + 3))
  }
  return groups
})

//获取推荐档口
const getRecommendedStalls = async () => {
  try {
    const res = await proxy.$foodApi.getRecommendedStall()
    recommendedStallList.value = res.recommendedStallList || []
  } catch (error) {
    console.error('获取推荐档口失败:', error)
  }
}

//获取用户信息
const getUserInfo = async () => {
  try{
    //检查是否有token
    const token = localStorage.getItem('token')
    if(!token){
      isLoggedIn.value = false
      return
    }
    
    //验证token并获取用户信息
    await proxy.$tokenApi.checkToken()
    let newUserInfo = await proxy.$userApi.getUserInfo()
    userInfo.userName = newUserInfo.userName
    userInfo.nickName = newUserInfo.nickName
    userInfo.avatarUrl = newUserInfo.avatarUrl
    isLoggedIn.value = true
  }catch(error){
    //token验证失败或获取用户信息失败
    isLoggedIn.value = false
    localStorage.removeItem('token')
  }
}

//跳转到登录页
const goToLogin = () => {
  window.location.href = "/user/login"
}

//跳转到注册页
const goToSignUp = () => {
  window.location.href = "/user/signUp"
}

//跳转到美食点评页
const goToFoodReview = () => {
  window.location.href = "/foodReview"
}

//处理美食地图点击（功能待开发）
const handleFoodMap = () => {
  ElMessage.info('美食地图功能正在开发中，敬请期待～')
}

//跳转到美食工坊页
const goToMagicWorkShop = () => {
  window.location.href = '/magicWorkShop.html'
}

//跳转到个人信息页
const goToPersonalInfo = () =>{
  window.open("/user/personalInfo")
}

//跳转到修改密码页
const goToEditPassword = () => {
  window.open("/user/editPassword")
}

//跳转到我的评论页
const goToMyComment = () => {
  window.open("/user/myComment")
}

//退出登录
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    localStorage.removeItem('token')
    isLoggedIn.value = false
    userInfo.userName = defaultUserInfo.userName
    userInfo.nickName = defaultUserInfo.nickName
    userInfo.avatarUrl = defaultUserInfo.avatarUrl
    ElMessage.success('已退出登录')
  }).catch(() => {})
}

//处理下拉菜单命令
const handleCommand = (command) => {
  switch(command){
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
  getUserInfo();
  getRecommendedStalls();
})

</script>
<template>
  <div class="homePage">
    <!-- 导航栏 -->
    <header class="navbar">
      <div class="navContent">
        <div class="logo" @click="() => window.location.href = '/home'">
          <img :src="IconImg" class="logo-icon" />
          <div class="logo-text">
            <h1>中珠点评</h1>
            <span class="logoSubtitle">校园美食点评平台</span>
          </div>
        </div>
        
        <div class="userSection">
          <!-- 未登录状态 -->
          <div v-if="!isLoggedIn" class="authButtons">
            <el-button @click="goToLogin">登录</el-button>
            <el-button type="primary" @click="goToSignUp">注册</el-button>
          </div>
          
          <!-- 已登录状态 -->
          <div v-else class="userInfo">
            <el-dropdown @command="handleCommand">
              <span class="userDropdown">
                <el-avatar :src="userInfo.avatarUrl" :size="40"></el-avatar>
                <span class="userName">{{ userInfo.nickName }}</span>
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
    </header>
    
    <!-- 主内容区 -->
    <main class="mainContent">
      <!-- 推荐店铺横幅 -->
      <section class="recommendSection">
        <div class="container">
          <h2 class="sectionTitle">🔥 热门推荐</h2>
          <el-carousel height="320px" :interval="4000" arrow="always" indicator-position="outside">
            <el-carousel-item v-for="(group, groupIndex) in recommendedGroups" :key="groupIndex">
              <div class="stallCarouselItem">
                <el-card 
                  v-for="stall in group" 
                  :key="stall.ID" 
                  class="stallCard" 
                  shadow="hover"
                  @click="() => window.location.href = `/foodReview/stall?stallID=${stall.ID}`"
                >
                  <!-- 菜品图片区域（类别标签在图片内部右上角） -->
                  <div class="dishImage">
                    <img :src="stall.dishPictureUrl" :alt="stall.signatureDish">
                    <span class="typeTag">{{ stall.type }}</span>
                  </div>
                  
                  <!-- 图片下方区域：菜品信息 -->
                  <div class="dishInfo">
                    <h3 class="dishName">{{ stall.signatureDish }}</h3>
                    <div class="dishMeta">
                      <span class="rating">⭐ {{ stall.rating }}</span>
                      <span class="price">¥{{ stall.dishPrice }}</span>
                    </div>
                    <p class="stallName">{{ stall.name }}</p>
                  </div>
                </el-card>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
      </section>
      
      <!-- 功能卡片 -->
      <section class="featureSection">
        <div class="container">
          <h2 class="sectionTitle">平台功能</h2>
          <div class="featureCards">
            <el-card class="featureCard" shadow="hover" @click="goToFoodReview">
              <div class="cardCover" :style="{backgroundImage: `url(${foodReviewImg})`}"></div>
              <div class="cardOverlay">
                <h3>美食点评</h3>
                <p>浏览档口列表，查看详细信息和用户评价</p>
              </div>
            </el-card>

            <el-card class="featureCard" shadow="hover" @click="handleFoodMap">
              <div class="cardCover" :style="{backgroundImage: `url(${foodMapImg})`}"></div>
              <div class="cardOverlay">
                <h3>美食地图</h3>
                <p>地图导航，快速找到心仪的美食位置</p>
              </div>
            </el-card>

            <el-card class="featureCard" shadow="hover" @click="goToMagicWorkShop">
              <div class="cardCover" :style="{backgroundImage: `url(${foodWorkShopImg})`}"></div>
              <div class="cardOverlay">
                <h3>美食工访</h3>
                <p>和美食魔法师们开启一段奇妙的冒险</p>
              </div>
            </el-card>
          </div>
        </div>
      </section>
    </main>
    
    <!-- 页脚 -->
    <footer class="footer">
      <p>&copy; 2025 中珠点评</p>
    </footer>
  </div>
</template>

<style scoped lang="less">
.homePage{
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fef6e4;
  background-image: radial-gradient(#f3d2c1 1px, transparent 1px);
  background-size: 20px 20px;
}

/* 导航栏 */
.navbar{
  background: #ff8e3c;
  box-shadow: 0 4px 12px rgba(255, 142, 60, 0.3);
  position: sticky;
  top: 0;
  z-index: 1000;
  
  .navContent{
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .logo{
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 14px;
      cursor: pointer;
      transition: opacity 0.3s;

      &:hover{
        opacity: 0.8;
      }

      .logo-icon {
        width: 42px;
        height: 42px;
        border-radius: 10px;
        flex-shrink: 0;
      }

      .logo-text {
        display: flex;
        flex-direction: column;
      }

      h1{
        margin: 0;
        font-size: 24px;
        font-weight: 800;
        color: white;
        text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.1);
        letter-spacing: 2px;
      }

      .logoSubtitle{
        display: block;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.9);
        margin-top: 2px;
      }
    }
    
    .userSection{
      .authButtons{
        display: flex;
        gap: 10px;
      }
      
      .userInfo{
        .userDropdown{
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          padding: 5px 15px;
          border-radius: 20px;
          outline: none;
          border: none;
          background: rgba(255, 255, 255, 0.2);
          transition: all 0.3s;

          &:hover{
            background-color: rgba(255, 255, 255, 0.3);
            transform: scale(1.02);
          }

          .userName{
            font-size: 14px;
            color: white;
            font-weight: 600;
          }

          .el-icon {
            color: white;
          }
        }
      }
    }
  }
}

/* 主内容区 */
.mainContent{
  flex: 1;
}

/* 推荐店铺横幅 */
.recommendSection{
  padding: 40px 20px;
  background: rgba(0, 0, 0, 0.08);
  
  .container{
    max-width: 1200px;
    margin: 0 auto;
    
    .sectionTitle{
      text-align: center;
      font-size: 32px;
      font-weight: 600;
      margin: 0 0 30px 0;
      color: #333;
    }

    .stallCarouselItem{
      display: flex;
      gap: 30px;
      padding: 0 50px;
      height: 100%;
      align-items: center;
      
      .stallCard{
        flex: 1;
        cursor: pointer;
        transition: all 0.3s ease;
        border-radius: 12px;
        overflow: hidden;
        
        &:hover{
          transform: translateY(-5px);
          filter: brightness(1.05);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }
        
        // 菜品图片区域（类别标签在图片内部右上角）
        .dishImage{
          position: relative;
          width: 100%;
          height: 160px;
          overflow: hidden;
          
          img{
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }
          
          .typeTag{
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.6);
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
            z-index: 1;
          }
        }
        
        &:hover .dishImage img{
          transform: scale(1.1);
        }
        
        // 菜品信息区域
        .dishInfo{
          padding: 15px;
          
          .dishName{
            font-size: 18px;
            font-weight: 600;
            margin: 0 0 8px 0;
            color: #333;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          
          .dishMeta{
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 14px;
            
            .rating{
              color: #ff9800;
              font-weight: 500;
            }
            
            .price{
              color: #e74c3c;
              font-weight: 600;
            }
          }
          
          .stallName{
            font-size: 13px;
            color: #666;
            margin: 8px 0 0 0;
            line-height: 1.4;
          }
        }
      }
    }
  }
  
  // 自定义走马灯箭头
  :deep(.el-carousel__arrow){
    width: 44px;
    height: 44px;
    background-color: rgba(255, 255, 255, 0.95);
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
    font-size: 18px;
    color: #ff8e3c;

    &:hover{
      background-color: #ff8e3c;
      color: #fff;
    }

    i {
      font-size: 20px;
      font-weight: bold;
    }
  }
  
  // 自定义走马灯指示器
  :deep(.el-carousel__indicator){
    .el-carousel__button{
      background-color: rgba(255, 255, 255, 0.5);
    }
    
    &.is-active .el-carousel__button{
      background-color: white;
    }
  }
}

/* 功能区域 */
.featureSection{
  padding: 60px 20px;
  
  .container{
    max-width: 1200px;
    margin: 0 auto;
    
    .sectionTitle{
      text-align: center;
      font-size: 32px;
      font-weight: 600;
      margin: 0 0 40px 0;
      color: #333;
    }
    
    .featureCards{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
      
      .featureCard{
        cursor: pointer;
        transition: transform 0.3s;
        position: relative;
        overflow: hidden;
        border-radius: 12px;

        :deep(.el-card__body) {
          padding: 0;
        }

        &:hover{
          transform: translateY(-10px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.12);
        }

        .cardCover{
          width: 100%;
          height: 240px;
          background-size: cover;
          background-position: center;
        }

        .cardOverlay{
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 20px 16px;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
        }

        h3{
          font-size: 20px;
          font-weight: 700;
          margin: 0 0 6px 0;
          color: #fff;
        }

        p{
          font-size: 13px;
          color: rgba(255, 255, 255, 0.85);
          line-height: 1.6;
          margin: 0;
        }
      }
    }
  }
}

/* 页脚 */
.footer{
  background-color: #333;
  color: white;
  text-align: center;
  padding: 20px;
  
  p{
    margin: 0;
    font-size: 14px;
  }
}

/* Element Plus 橙色主题覆盖 */
:deep(.el-button--primary) {
  --el-button-bg-color: #ff8e3c;
  --el-button-border-color: #ff8e3c;
  --el-button-hover-bg-color: #e07b30;
  --el-button-hover-border-color: #e07b30;
}

:deep(.el-button--default) {
  --el-button-text-color: #ff8e3c;
  --el-button-border-color: #ff8e3c;
  --el-button-hover-text-color: #e07b30;
  --el-button-hover-border-color: #e07b30;
}

</style>
