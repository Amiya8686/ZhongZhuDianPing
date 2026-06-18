<script setup>
import {ref, getCurrentInstance, onMounted} from "vue"
import { ArrowDown } from '@element-plus/icons-vue'
import likeIcon from '@/assets/imgs/icon/like.svg'
import shitIcon from '@/assets/imgs/icon/shit.svg'
const {proxy} = getCurrentInstance()

//一开始先隐藏页面，等token验证成功了再显示页面
const isShowBody = ref(false)

//用户信息
const userInfo = ref({
  username: '',
  nickName: '',
  avatar: ''
})

//档口ID和档口名称
const stallID = ref('')
const stallName = ref('档口名称')

//菜品列表数据
const dishList = ref([])

//排序方式：like, bad, default
const sortBy = ref('default')

//分页相关
const pageIndex = ref(1)
const numPerPage = ref(12)  //每页12个（4x3网格）
const totalPageNum = ref(0)

//验证token
const tokenVerify = async () => {
  try {
    await proxy.$tokenApi.checkToken()
    isShowBody.value = true
  } catch (error) {
    console.log(error)
    isShowBody.value = true 
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

//获取URL参数中的stallID
const getStallIDFromURL = () => {
  const urlParams = new URLSearchParams(window.location.search)
  stallID.value = urlParams.get('stallID') || ''
}

//加载菜品列表
const loadDishList = async () => {
  try {
    console.log("loadDishList")
    const data = await proxy.$foodApi.getStallDishList(stallID.value)
    dishList.value = data.dishList || []
    //根据排序方式排序
    sortDishList()
  } catch (error) {
    console.error('获取菜品列表失败', error)
  }
}

//根据排序方式排序菜品列表
const sortDishList = () => {
  if (sortBy.value === 'like') {
    dishList.value.sort((a, b) => b.like - a.like)
  } else if (sortBy.value === 'bad') {
    dishList.value.sort((a, b) => b.bad - a.bad)
  }
  //计算总页数
  totalPageNum.value = Math.ceil(dishList.value.length / numPerPage.value)
}

//切换排序方式
const handleSortChange = (type) => {
  sortBy.value = type
  pageIndex.value = 1
  sortDishList()
}

//获取当前页的菜品
const getCurrentPageDishes = () => {
  const start = (pageIndex.value - 1) * numPerPage.value
  const end = start + numPerPage.value
  return dishList.value.slice(start, end)
}

//处理菜品评价（点赞/踩）
const handleEvaluate = async (dish, type) => {
  try {
    //如果点击的是当前评价，则取消评价；否则切换评价
    const newEvaluation = dish.evaluation === type ? 'none' : type
    
    await proxy.$foodApi.evaluateDish({
      dishID: dish.ID,
      newEvaluation: newEvaluation
    })
    
    // 重新加载列表以获取最新数据
    loadDishList()
  } catch (error) {
    console.error('评价失败', error)
  }
}

//页码改变事件
const handlePageChange = (page) => {
  pageIndex.value = page
}

//返回档口详情页
const goToStall = () => {
  window.location.href = `/foodReview/stall?stallID=${stallID.value}`
}

//返回美食点评页
const goToFoodReview = () => {
  window.location.href = '/foodReview'
}

//跳转到主页
const goToHome = () => {
  window.location.href = '/home'
}

//跳转到个人中心
const goToPersonalInfo = () => {
  window.open('/user/personalInfo')
}

//跳转到修改密码页
const goToEditPassword = () => {
  window.open('/user/editPassword')
}

//跳转到我的评论页
const goToMyComment = () => {
  window.open('/user/myComment')
}

//跳转到智能评论生成页
const goToSmartComment = (dishID) => {
  window.open(`/magicWorkshop/intelligentCommentGeneration.html?dishID=${dishID}`, '_blank')
}

//退出登录
const handleLogout = () => {
  localStorage.removeItem('token')
  window.location.href = '/user/login'
}

//处理下拉菜单命令
const handleCommand = (command) => {
  switch(command) {
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
  getStallIDFromURL()
  tokenVerify()
  loadUserInfo()
  loadDishList()
})
</script>

<template>
  <div class="body" v-show="isShowBody">
    <!-- 顶部导航栏 -->
    <div class="top-bar">
      <div class="title" @click="goToHome">
        <span class="main-title">中珠点评</span>
        <span class="sub-title">美食点评</span>
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

    <!-- 排序按钮区域 -->
    <div class="sort-section">
      <span class="sort-label">📊 排序方式</span>
      <div class="sort-btns">
        <el-button
          :type="sortBy === 'like' ? 'success' : 'default'"
          round
          @click="handleSortChange('like')"
        >
          <img :src="likeIcon" class="sort-icon" /> 最多赞
        </el-button>
        <el-button
          :type="sortBy === 'bad' ? 'warning' : 'default'"
          round
          @click="handleSortChange('bad')"
        >
          <img :src="shitIcon" class="sort-icon" /> 最多踩
        </el-button>
        <el-button
          :type="sortBy === 'default' ? 'primary' : 'default'"
          round
          @click="handleSortChange('default')"
        >
          默认排序
        </el-button>
      </div>
    </div>

    <!-- 菜品网格 -->
    <div class="dish-grid">
      <div
        class="dish-card"
        v-for="dish in getCurrentPageDishes()"
        :key="dish.ID"
      >
        <!-- 菜品图片 -->
        <div class="dish-image">
          <img :src="dish.pictureUrl" alt="菜品图片" />
          <div class="dish-tag">🍽️</div>
        </div>

        <!-- 菜品内容 -->
        <div class="dish-content">
          <div class="dish-name">{{ dish.name }}</div>
          <div class="dish-price">￥{{ dish.price }}</div>
          
          <!-- 评价按钮 -->
          <div class="dish-actions">
            <button
              class="action-btn action-btn-like"
              :class="{ active: dish.evaluation === 'like' }"
              @click="handleEvaluate(dish, 'like')"
            >
              <img :src="likeIcon" class="icon" />
              <span>{{ dish.like }}</span>
            </button>
            <button
              class="action-btn action-btn-bad"
              :class="{ active: dish.evaluation === 'bad' }"
              @click="handleEvaluate(dish, 'bad')"
            >
              <img :src="shitIcon" class="icon" />
              <span>{{ dish.bad }}</span>
            </button>
          </div>

          <!-- 智能评论生成 -->
          <el-button
            type="warning"
            size="small"
            class="smart-comment-btn"
            @click.stop="goToSmartComment(dish.ID)"
          >
            🪄 智能评论生成
          </el-button>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination-section">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalPageNum * numPerPage"
        :page-size="numPerPage"
        :current-page="pageIndex"
        @current-change="handlePageChange"
        :pager-count="7"
      />
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

/* 排序按钮区域 */
.sort-section {
  max-width: 1200px;
  margin: 30px auto;
  padding: 20px 30px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 20px;
}

.sort-icon {
  width: 18px;
  height: 18px;
  object-fit: contain;
  vertical-align: middle;
  margin-right: 2px;
}

.sort-label {
  font-size: 18px;
  color: #333;
  font-weight: 700;
}

.sort-btns {
  display: flex;
  gap: 15px;
}

/* 菜品网格 */
.dish-grid {
  max-width: 1200px;
  margin: 30px auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

.dish-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
  }
}

/* 菜品图片 */
.dish-image {
  width: 100%;
  height: 220px;
  background: #f0f0f0;
  overflow: hidden;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s;
  }

  &:hover img {
    transform: scale(1.1);
  }
  
  .dish-tag {
    position: absolute;
    top: 15px;
    right: 15px;
    background: rgba(255, 255, 255, 0.9);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

.dish-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 菜品名称 */
.dish-name {
  color: #333;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
}

/* 菜品价格 */
.dish-price {
  color: #ff5e62;
  font-size: 22px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 20px;
}

/* 评价按钮 */
.dish-actions {
  display: flex;
  gap: 10px;
  margin-top: auto;
  margin-bottom: 12px;
}

.action-btn {
  flex: 1;
  padding: 8px 10px;
  border: 2px solid #eee;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: #fafafa;
  color: #999;

  &:hover {
    background: #f5f5f5;
    border-color: #ddd;
  }

  .icon {
    width: 20px;
    height: 20px;
    object-fit: contain;
  }
}

.action-btn-like {
  &.active {
    background: #fff7e6;
    border-color: #ffc069;
    color: #f08c00;
    box-shadow: 0 2px 8px rgba(255, 152, 0, 0.15);
  }
}

.action-btn-bad {
  &.active {
    background: #fff0f0;
    border-color: #ffa39e;
    color: #e03131;
    box-shadow: 0 2px 8px rgba(224, 49, 49, 0.12);
  }
}

/* 智能评论生成按钮 */
.smart-comment-btn {
  width: 100%;
  border-radius: 10px;
  background: linear-gradient(135deg, #ff8e3c, #ff6b6b);
  border: none;
  color: #fff;
  font-weight: 600;

  &:hover {
    background: linear-gradient(135deg, #e07b30, #e55a5a);
    color: #fff;
  }
}

/* 分页区域 */
.pagination-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0 60px;
}

/* 分页样式 */
:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background: #ff8e3c;
  color: white;
  border-radius: 8px;
}

:deep(.el-pagination.is-background .el-pager li) {
  border-radius: 8px;
  &:hover {
    color: #ff8e3c;
  }
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .dish-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .dish-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .dish-grid {
    grid-template-columns: 1fr;
  }
}
</style>
