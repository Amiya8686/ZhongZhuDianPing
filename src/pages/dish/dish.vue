w'w'w'w<script setup>
import {ref, getCurrentInstance, onMounted} from "vue"
import { ArrowDown } from '@element-plus/icons-vue'
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
const numPerPage = ref(9)  //每页9个（3x3网格）
const totalPageNum = ref(0)

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

//获取URL参数中的stallID
const getStallIDFromURL = () => {
  const urlParams = new URLSearchParams(window.location.search)
  stallID.value = urlParams.get('stallID') || ''
}

//加载菜品列表
const loadDishList = async () => {
  try {
    const data = await proxy.$foodApi.getStallDishList(stallID.value)
    dishList.value = data.dishList || []
    //根据排序方式排序
    sortDishList()
  } catch (error) {
    console.error('获取菜品列表失败', error)
    ElMessage.error('获取菜品列表失败')
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
    
    //更新本地数据
    if (dish.evaluation === 'like') {
      dish.like--
    } else if (dish.evaluation === 'bad') {
      dish.bad--
    }
    
    dish.evaluation = newEvaluation
    
    if (newEvaluation === 'like') {
      dish.like++
    } else if (newEvaluation === 'bad') {
      dish.bad++
    }
    
    ElMessage.success('操作成功')
  } catch (error) {
    console.error('评价失败', error)
    ElMessage.error('操作失败')
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

    <!-- 面包屑导航 -->
    <div class="breadcrumb-section">
      <span class="breadcrumb-item" @click="goToFoodReview">美食点评</span>
      <span class="breadcrumb-separator">→</span>
      <span class="breadcrumb-item" @click="goToStall">档口详情</span>
      <span class="breadcrumb-separator">→</span>
      <span class="breadcrumb-current">全部菜品</span>
    </div>

    <!-- 排序按钮区域 -->
    <div class="sort-section">
      <span class="sort-label">排序方式</span>
      <el-button
        :type="sortBy === 'like' ? 'success' : 'warning'"
        @click="handleSortChange('like')"
      >
        赞
      </el-button>
      <el-button
        :type="sortBy === 'bad' ? 'success' : 'warning'"
        @click="handleSortChange('bad')"
      >
        踩
      </el-button>
      <el-button
        :type="sortBy === 'default' ? 'success' : 'warning'"
        @click="handleSortChange('default')"
      >
        默认
      </el-button>
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
        </div>

        <!-- 菜品名称 -->
        <div class="dish-name">{{ dish.name }}</div>

        <!-- 菜品价格 -->
        <div class="dish-price">￥{{ dish.price }}</div>

        <!-- 评价按钮 -->
        <div class="dish-actions">
          <button
            class="action-btn踩"
            :class="{ active: dish.evaluation === 'bad' }"
            @click="handleEvaluate(dish, 'bad')"
          >
            踩 {{ dish.bad }}
          </button>
          <button
            class="action-btn赞"
            :class="{ active: dish.evaluation === 'like' }"
            @click="handleEvaluate(dish, 'like')"
          >
            赞 {{ dish.like }}
          </button>
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
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* 顶部导航栏 */
.top-bar {
  width: 100%;
  height: 70px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
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
    transition: background-color 0.3s;
    outline: none;
    border: none;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
    
    .user-name {
      font-size: 14px;
      color: white;
      font-weight: 500;
    }
    
    .el-icon {
      color: white;
    }
  }
}

/* 面包屑导航 */
.breadcrumb-section {
  max-width: 1400px;
  margin: 20px auto;
  padding: 15px 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  font-size: 16px;
  color: #666;
}

.breadcrumb-item {
  cursor: pointer;
  color: #667eea;
  transition: color 0.3s;
  
  &:hover {
    color: #5568d3;
    text-decoration: underline;
  }
}

.breadcrumb-separator {
  margin: 0 8px;
  color: #999;
}

.breadcrumb-current {
  color: #333;
  font-weight: 600;
}

/* 排序按钮区域 */
.sort-section {
  max-width: 1400px;
  margin: 20px auto;
  padding: 15px 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 15px;
}

.sort-label {
  font-size: 16px;
  color: #333;
  font-weight: 600;
}

/* 菜品网格 */
.dish-grid {
  max-width: 1400px;
  margin: 30px auto;
  padding: 0 40px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.dish-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  }
}

/* 菜品图片 */
.dish-image {
  width: 100%;
  height: 200px;
  background: #f5c842;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

/* 菜品名称 */
.dish-name {
  background: #f5c842;
  color: #333;
  font-size: 18px;
  font-weight: bold;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 10px;
}

/* 菜品价格 */
.dish-price {
  background: #f5c842;
  color: #e74c3c;
  font-size: 20px;
  font-weight: bold;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 15px;
}

/* 评价按钮 */
.dish-actions {
  display: flex;
  gap: 10px;
}

.action-btn踩,
.action-btn赞 {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn踩 {
  background: #e67e22;
  color: white;
  
  &:hover {
    background: #d35400;
    transform: translateY(-2px);
  }
  
  &.active {
    background: #d35400;
    box-shadow: 0 4px 8px rgba(211, 84, 0, 0.4);
  }
}

.action-btn赞 {
  background: #27ae60;
  color: white;
  
  &:hover {
    background: #229954;
    transform: translateY(-2px);
  }
  
  &.active {
    background: #229954;
    box-shadow: 0 4px 8px rgba(34, 153, 84, 0.4);
  }
}

/* 分页区域 */
.pagination-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0 60px;
  margin-top: 20px;
}

/* Element Plus 按钮样式覆盖 */
:deep(.el-button) {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s;
}

:deep(.el-button--warning) {
  background: #e0e0e0;
  border: 1px solid #ccc;
  color: #666;
}

:deep(.el-button--warning:hover) {
  background: #d0d0d0;
  border-color: #bbb;
}

:deep(.el-button--success) {
  background: #667eea;
  border: none;
  color: white;
}

:deep(.el-button--success:hover) {
  background: #5568d3;
  transform: translateY(-1px);
}

/* 分页样式 */
:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

:deep(.el-pagination.is-background .el-pager li:hover) {
  color: #667eea;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .dish-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .dish-grid {
    grid-template-columns: 1fr;
  }
}
</style>
