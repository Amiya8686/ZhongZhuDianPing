<script setup>
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

//档口ID
const stallID = ref('')

//评论列表数据
const commentList = ref([])

//分页相关
const pageIndex = ref(1)
const numPerPage = ref(10)
const totalPageNum = ref(0)

//图片预览
const previewVisible = ref(false)
const previewImageUrl = ref('')

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

//加载评论列表
const loadCommentList = async () => {
  try {
    const params = {
      stallID: stallID.value,
      numPerPage: numPerPage.value,
      pageIndex: pageIndex.value
    }
    const data = await proxy.$foodApi.getStallCommentList(params)
    commentList.value = data.commentList || []
    totalPageNum.value = data.totalPageNum || 0
  } catch (error) {
    console.error('获取评论列表失败', error)
    ElMessage.error('获取评论列表失败')
  }
}

//处理评论点赞
const handleLikeComment = async (comment) => {
  try {
    //如果已经点赞，则取消点赞；否则点赞
    const newEvaluation = comment.evaluation === 'like' ? 'none' : 'like'
    
    await proxy.$foodApi.evaluationComment({
      commentID: comment.ID,
      newEvaluation: newEvaluation
    })
    
    //更新本地数据
    if (comment.evaluation === 'like') {
      comment.like--
    } else {
      comment.like++
    }
    comment.evaluation = newEvaluation
    
    ElMessage.success('操作成功')
  } catch (error) {
    console.error('点赞失败', error)
    ElMessage.error('操作失败')
  }
}

//图片预览
const handlePreviewImage = (imageUrl) => {
  if (imageUrl) {
    previewImageUrl.value = imageUrl
    previewVisible.value = true
  }
}

//页码改变事件
const handlePageChange = (page) => {
  pageIndex.value = page
  loadCommentList()
  //滚动到页面顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
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
  loadCommentList()
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
      <span class="breadcrumb-current">全部评论</span>
    </div>

    <!-- 评论列表 -->
    <div class="comment-list">
      <div
        class="comment-card"
        v-for="comment in commentList"
        :key="comment.ID"
      >
        <!-- 头像 -->
        <div class="comment-avatar">
          <el-avatar :src="comment.avatarUrl" :size="60"></el-avatar>
        </div>

        <!-- 评论信息区域 -->
        <div class="comment-info-section">
          <!-- 顶部信息栏 -->
          <div class="comment-header">
            <div class="header-item">{{ comment.reviewerName }}</div>
            <div class="header-item">评分：{{ comment.rating }}</div>
            <div class="header-item">{{ comment.dateTime }}</div>
          </div>

          <!-- 评论内容 -->
          <div class="comment-content">{{ comment.content }}</div>

          <!-- 评论图片 -->
          <div class="comment-images">
            <div 
              class="image-item" 
              v-if="comment.pictrue1Url"
              @click="handlePreviewImage(comment.pictrue1Url)"
            >
              <img :src="comment.pictrue1Url" alt="评论图片" />
            </div>
            <div 
              class="image-item" 
              v-if="comment.picture2Url"
              @click="handlePreviewImage(comment.picture2Url)"
            >
              <img :src="comment.picture2Url" alt="评论图片" />
            </div>
            <div 
              class="image-item" 
              v-if="comment.picture3Url"
              @click="handlePreviewImage(comment.picture3Url)"
            >
              <img :src="comment.picture3Url" alt="评论图片" />
            </div>
          </div>

          <!-- 点赞按钮 -->
          <div class="comment-actions">
            <button
              class="like-btn"
              :class="{ active: comment.evaluation === 'like' }"
              @click="handleLikeComment(comment)"
            >
              点赞，点赞数 {{ comment.like }}
            </button>
          </div>
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

    <!-- 图片预览对话框 -->
    <el-dialog
      v-model="previewVisible"
      title="图片预览"
      width="60%"
      center
    >
      <img :src="previewImageUrl" style="width: 100%; height: auto;" />
    </el-dialog>
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

/* 评论列表 */
.comment-list {
  max-width: 1400px;
  margin: 30px auto;
  padding: 0 40px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.comment-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  gap: 20px;
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  }
}

/* 头像 */
.comment-avatar {
  flex-shrink: 0;
}

/* 评论信息区域 */
.comment-info-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 顶部信息栏 */
.comment-header {
  display: flex;
  gap: 15px;
}

.header-item {
  background: #f5c842;
  color: #333;
  font-size: 16px;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 8px;
  white-space: nowrap;
}

/* 评论内容 */
.comment-content {
  background: #f5c842;
  color: #333;
  font-size: 15px;
  line-height: 1.8;
  padding: 20px;
  border-radius: 8px;
  min-height: 80px;
}

/* 评论图片 */
.comment-images {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.image-item {
  width: 280px;
  height: 180px;
  background: #f5c842;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

/* 点赞按钮 */
.comment-actions {
  display: flex;
  justify-content: flex-end;
}

.like-btn {
  background: #e67e22;
  color: white;
  font-size: 16px;
  font-weight: bold;
  padding: 12px 30px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: #d35400;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(211, 84, 0, 0.4);
  }
  
  &.active {
    background: #27ae60;
    
    &:hover {
      background: #229954;
    }
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

/* Element Plus 分页样式 */
:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

:deep(.el-pagination.is-background .el-pager li:hover) {
  color: #667eea;
}

/* 图片预览对话框样式 */
:deep(.el-dialog) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
}

:deep(.el-dialog__title) {
  color: white;
  font-weight: 600;
}

:deep(.el-dialog__close) {
  color: white;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .comment-card {
    flex-direction: column;
  }
  
  .comment-avatar {
    align-self: flex-start;
  }
  
  .image-item {
    width: 220px;
    height: 150px;
  }
}

@media (max-width: 768px) {
  .comment-header {
    flex-direction: column;
    gap: 10px;
  }
  
  .image-item {
    width: 100%;
    height: 200px;
  }
}
</style>
