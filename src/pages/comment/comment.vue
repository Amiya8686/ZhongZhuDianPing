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

//加载评论列表
const loadCommentList = async () => {
  try {
    console.log('开始加载评论列表，stallID:', stallID.value)
    const params = {
      stallID: stallID.value,
      numPerPage: numPerPage.value,
      pageIndex: pageIndex.value
    }
    const data = await proxy.$foodApi.getStallCommentList(params)
    console.log('获取到的评论数据:', data)
    commentList.value = data.commentList || []
    totalPageNum.value = data.totalPageNum || 0
  } catch (error) {
    console.error('获取评论列表失败', error)
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
    
    // 重新加载列表以获取最新数据
    loadCommentList()
  } catch (error) {
    console.error('点赞失败', error)
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

    <!-- 评论列表标题 -->
    <div class="page-header">
      <span class="header-icon">💬</span>
      <h2>全部评论</h2>
    </div>

    <!-- 评论列表 -->
    <div class="comment-list">
      <div
        class="comment-card"
        v-for="comment in commentList"
        :key="comment.ID"
      >
        <!-- 头像 -->
        <div class="comment-avatar-wrapper">
          <el-avatar :src="comment.avatarUrl" :size="60" class="comment-avatar"></el-avatar>
        </div>

        <!-- 评论信息区域 -->
        <div class="comment-info-section">
          <!-- 顶部信息栏 -->
          <div class="comment-header">
            <div class="reviewer-name">{{ comment.reviewerName }}</div>
            <div class="rating-badge">⭐ {{ comment.rating }}分</div>
            <div class="comment-time">{{ comment.dateTime }}</div>
          </div>

          <!-- 评论内容 -->
          <div class="comment-content-bubble">
            {{ comment.content }}
          </div>

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
              <span class="icon">👍</span>
              <span>点赞 ({{ comment.like }})</span>
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

/* 页面标题 */
.page-header {
  max-width: 1000px;
  margin: 30px auto 10px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  
  .header-icon {
    font-size: 28px;
  }
  
  h2 {
    color: #333;
    font-size: 24px;
    margin: 0;
    font-weight: 700;
  }
}

/* 评论列表 */
.comment-list {
  max-width: 1000px;
  margin: 20px auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.comment-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 25px;
  position: relative;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
    border-color: #ff8e3c;
  }
}

/* 头像 */
.comment-avatar-wrapper {
  flex-shrink: 0;
  position: relative;
  
  .comment-avatar {
    border: 3px solid #fff;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
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
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.reviewer-name {
  font-size: 18px;
  font-weight: 700;
  color: #333;
}

.rating-badge {
  background: #fff4e6;
  color: #ff8e3c;
  font-size: 14px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 12px;
}

.comment-time {
  color: #999;
  font-size: 14px;
  margin-left: auto;
}

/* 评论内容气泡 */
.comment-content-bubble {
  background: #f8f9fa;
  color: #555;
  font-size: 16px;
  line-height: 1.6;
  padding: 20px;
  border-radius: 0 16px 16px 16px;
  position: relative;
  border: 1px solid #e9ecef;
}

/* 评论图片 */
.comment-images {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.image-item {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    border-color: #ff8e3c;
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
  margin-top: 10px;
}

.like-btn {
  background: transparent;
  color: #868e96;
  font-size: 15px;
  font-weight: 600;
  padding: 8px 16px;
  border: 1px solid #dee2e6;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 6px;
  
  .icon {
    font-size: 18px;
  }
  
  &:hover {
    background: #fff4e6;
    color: #ff8e3c;
    border-color: #ff8e3c;
  }
  
  &.active {
    background: #ff8e3c;
    color: white;
    border-color: #ff8e3c;
    
    &:hover {
      background: #fd7e14;
      border-color: #fd7e14;
    }
    
    .icon {
      transform: scale(1.2);
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

/* 图片预览对话框样式 */
:deep(.el-dialog) {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

:deep(.el-dialog__header) {
  background: #ff8e3c;
  color: white;
  padding: 20px;
  margin-right: 0;
}

:deep(.el-dialog__title) {
  color: white;
  font-weight: 700;
}

:deep(.el-dialog__close) {
  color: white;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .comment-card {
    flex-direction: column;
  }
  
  .comment-avatar-wrapper {
    align-self: flex-start;
  }
}

@media (max-width: 768px) {
  .comment-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .comment-time {
    margin-left: 0;
  }
  
  .image-item {
    width: 100px;
    height: 100px;
  }
}
</style>
