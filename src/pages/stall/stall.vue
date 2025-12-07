<script setup>
import {ref, onMounted, getCurrentInstance } from 'vue'
import { ArrowLeft, ArrowRight, Star, Location, Picture, Trophy, Back, Plus } from '@element-plus/icons-vue'

const { proxy } = getCurrentInstance()

// 定义数据状态
const stallID = ref(null)
const stallInfo = ref({}) // 档口详情数据
const dishList = ref([]) // 推荐菜列表
const commentList = ref([]) // 评论列表
const pageIndex = ref(1)  // 当前评论页码
const loading = ref(true) // 加载状态
const isShowBody = ref(false) // 是否显示页面内容

// 写评论相关
const dialogVisible = ref(false)
const commentForm = ref({
  rating: 5,
  content: ''
})
const fileList = ref([])
const uploadRef = ref(null)

// 上传图片前的校验
const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    alert('只能上传图片文件（jpg、png、gif等格式）！')
    return false
  }
  if (!isLt5M) {
    alert('图片大小不能超过 5MB！')
    return false
  }
  return true
}

// 处理图片超出限制
const handleExceed = () => {
  alert('最多只能上传 3 张图片！')
}

// 获取 URL 参数
const getQueryParam = (name) => {
  const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
  const r = globalThis.location.search.substr(1).match(reg)
  if (r != null) return decodeURIComponent(r[2])
  return null
}

// 验证 token
const tokenVerify = async () => {
  try {
    await proxy.$tokenApi.checkToken()
    isShowBody.value = true
  } catch (error) {
    console.error('Token验证失败:', error)
    // 拦截器会自动跳转到登录页
  }
}

// 加载数据
const loadData = async () => {
  if(!stallID.value) return
  loading.value = true

  try {
    // 调用getStallInfo获取档口详情（包含推荐菜和热门评论）
    const res = await proxy.$foodApi.getStallInfo({ stallID: stallID.value })
    
    stallInfo.value = res || {}
    // API返回的推荐菜列表（至多5个）
    dishList.value = res.dishList || []
    // API返回的热门评论列表（至多2个）
    commentList.value = res.commentList || []
  } catch (error) {
    console.error("加载档口数据失败:", error)
  } finally {
    loading.value = false
  }
}

// 提交评论
const submitComment = async () => {
  if(!commentForm.value.content.trim()) {
    alert('请输入评论内容')
    return
  }
  
  try {
    const formData = new FormData()
    formData.append('stallID', stallID.value)
    formData.append('rating', commentForm.value.rating)
    formData.append('content', commentForm.value.content)
    
    // 按照接口规定添加图片文件：picture1, picture2, picture3
    if (fileList.value.length > 0) formData.append('picture1', fileList.value[0].raw)
    if (fileList.value.length > 1) formData.append('picture2', fileList.value[1].raw)
    if (fileList.value.length > 2) formData.append('picture3', fileList.value[2].raw)

    await proxy.$foodApi.createStallComment(formData)
    alert('评论成功！')
    dialogVisible.value = false
    commentForm.value = {
      rating: 5,
      content: ''
    }
    fileList.value = [] // 清空文件列表
    pageIndex.value = 1
    await loadData() // 刷新档口数据（包含评论）
  } catch (error) {
    console.error('评论失败:', error)
    alert('评论失败，请重试')
  }
}

// 返回首页
const goBack = () => {
  globalThis.location.href = '/foodReview.html'
}

// 查看更多推荐菜
const viewMoreDishes = () => {
  globalThis.open(`./stall/dish.html?stallID=${stallID.value}`, '_blank')
}

// 查看全部评论
const viewAllComments = () => {
  globalThis.open(`./stall/comment.html?stallID=${stallID.value}`, '_blank')
}

// 查看全景图
const viewPanorama = () => {
  alert('全景图功能开发中，敬请期待！')
  // TODO: 打开全景图查看器
}

// 点赞评论
const likeComment = async (comment) => {
  try {
    // 根据评论自身的 evaluation 字段判断是否已点赞
    const isLiked = comment.evaluation === 'like'
    const newEvaluation = isLiked ? 'none' : 'like'
    
    console.log('[点赞] 请求参数:', { commentID: comment.ID, newEvaluation })
    
    // 调用点赞API
    await proxy.$foodApi.evaluationComment({ 
      commentID: comment.ID, 
      newEvaluation: newEvaluation 
    })
    
    // 更新本地状态（仅标记 evaluation，点赞数通过刷新获取）
    comment.evaluation = newEvaluation
    
    console.log(`${isLiked ? '取消点赞' : '点赞'}成功`)
    
    // 重新加载档口数据以获取最新点赞数
    await loadData()
  } catch (error) {
    console.error('点赞失败，详细错误:', error)
    alert(`点赞失败: ${error}`)
  }
}

// 检查评论是否已点赞
const isCommentLiked = (commentID) => {
  const target = commentList.value.find(item => item.ID === commentID)
  return target?.evaluation === 'like'
}

// 页面挂载时执行
onMounted(async () => {
  stallID.value = getQueryParam('stallID')
  if (!stallID.value) {
    alert('缺少档口ID参数')
    goBack()
    return
  }
  
  await tokenVerify()
  await loadData()
})

// 交互逻辑
const scrollContainer = ref(null)
const scrollLeft = () => {
  if(scrollContainer.value) scrollContainer.value.scrollLeft -= 300
}
const scrollRight = () => {
  if(scrollContainer.value) scrollContainer.value.scrollLeft += 300
}
</script>

<template>
  <div class="stall-page" v-show="isShowBody">
    <!-- 顶部导航 -->
    <div class="nav-bar">
      <el-button link @click="goBack">
        <el-icon><Back /></el-icon> 返回美食点评
      </el-button>
    </div>

    <!-- 骨架屏加载状态 -->
    <el-skeleton :loading="loading" animated>
      <template #template>
        <div class="stall-header card-shadow" style="height: 300px;">
          <el-skeleton-item variant="image" style="width: 360px; height: 270px;" />
          <div style="flex: 1; margin-left: 30px;">
            <el-skeleton-item variant="h1" style="width: 50%; margin-bottom: 20px;" />
            <el-skeleton-item variant="text" style="margin-bottom: 10px;" />
            <el-skeleton-item variant="text" style="margin-bottom: 10px;" />
            <el-skeleton-item variant="text" style="width: 80%;" />
          </div>
        </div>
      </template>

      <template #default>
        <!-- 档口详情头部 -->
        <div class="stall-header card-shadow">
          <!-- 左侧大图 -->
          <div class="header-img">
            <img :src="stallInfo.pictureUrl" alt="档口图片" />
          </div>

          <!-- 右侧信息 -->
          <div class="header-info">
            <div class="info-top">
              <h1 class="stall-name">{{ stallInfo.name }}</h1>
              <div class="stall-stats">
                <el-rate v-model="stallInfo.rating" disabled show-score text-color="#ff9900" score-template="{value}分"/>
                <span class="price">￥{{ stallInfo.meanPrice }}/人</span>
              </div>
            </div>

            <div class="info-detail">
              <p><el-icon><Location /></el-icon> <strong>地点：</strong>{{ stallInfo.canteent || stallInfo.canteen }}</p>
              <p><el-icon><Trophy /></el-icon> <strong>招牌菜：</strong>{{ stallInfo.signatureDish }}</p>
              <p class="intro"><strong>简介：</strong>{{ stallInfo.introduction }}</p>
            </div>
            <div class="header-actions">
              <el-button type="primary" size="large" round @click="viewPanorama">
                <el-icon><Picture /></el-icon> 查看全景图
              </el-button>
            </div>
          </div>
        </div>

        <!-- 推荐菜列表 -->
        <div class="section-container card-shadow">
          <div class="section-header">
            <h2 class="section-title">推荐菜</h2>
            <el-button link @click="viewMoreDishes">查看更多 <el-icon><ArrowRight /></el-icon></el-button>
          </div>

          <div class="dish-scroll-wrapper">
            <!-- 左箭头 -->
            <div class="scroll-btn left" @click="scrollLeft"><el-icon><ArrowLeft /></el-icon></div>

            <!-- 滚动容器 -->
            <div class="dish-list" ref="scrollContainer">
              <div class="dish-card" v-for="dish in dishList" :key="dish.ID">
                <div class="dish-img">
                  <img :src="dish.pictureUrl || dish.pictureUrl" alt="菜品图片" />
                  <span class="recommend-tag">推荐 {{ dish.rating || 4.5 }}分</span>
                </div>
                <div class="dish-info">
                  <div class="dish-name">{{ dish.name }}</div>
                  <div class="dish-price">¥{{ dish.price }}</div>
                </div>
              </div>
            </div>

            <!-- 右箭头 -->
            <div class="scroll-btn right" @click="scrollRight"><el-icon><ArrowRight /></el-icon></div>
          </div>
        </div>

        <!-- 热评列表 -->
        <div class="section-container card-shadow">
          <div class="section-header">
            <h2 class="section-title">热门评论</h2>
            <el-button link @click="viewAllComments">查看全部 <el-icon><ArrowRight /></el-icon></el-button>
          </div>

          <div class="comment-list">
            <div class="comment-item" v-for="comment in commentList" :key="comment.ID">
              <!-- 头像 -->
              <el-avatar :size="50" :src="comment.avatarUrl || comment.avatar || '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg'" class="comment-avatar"></el-avatar>
              
              <!-- 内容主体 -->
              <div class="comment-content">
                <div class="comment-user">
                  <span class="username">{{ comment.reviewerName || comment.userId }}</span>
                  <el-rate v-model="comment.rating" disabled size="small" />
                </div>
                <div class="comment-time">{{ comment.dateTime }}</div>
                <div class="comment-text">{{ comment.content }}</div>

                <!-- 评论图片 -->
                <div class="comment-imgs" v-if="comment.picture1Url">
                  <el-image
                    v-if="comment.picture1Url"
                    :src="comment.picture1Url"
                    :preview-src-list="[comment.picture1Url, comment.picture2Url, comment.picture3Url].filter(Boolean)"
                    :initial-index="0"
                    fit="cover"
                    class="c-img"
                  />
                  <el-image 
                    v-if="comment.picture2Url" 
                    :src="comment.picture2Url" 
                    :preview-src-list="[comment.picture1Url, comment.picture2Url, comment.picture3Url].filter(Boolean)"
                    :initial-index="1"
                    fit="cover" 
                    class="c-img"
                  />
                  <el-image 
                    v-if="comment.picture3Url" 
                    :src="comment.picture3Url" 
                    :preview-src-list="[comment.picture1Url, comment.picture2Url, comment.picture3Url].filter(Boolean)"
                    :initial-index="2"
                    fit="cover" 
                    class="c-img"
                  />
                </div>

                <!-- 点赞 -->
                <div class="comment-action">
                  <el-button 
                    size="small" 
                    circle 
                    :type="isCommentLiked(comment.ID) ? 'warning' : 'default'"
                    @click="likeComment(comment)"
                  >
                    <el-icon><Star /></el-icon>
                  </el-button>
                  <span class="like-count">{{ comment.like }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 分页与操作 -->
          <div class="pagination-wrapper">
            <!-- 首页不显示分页，只显示写评论按钮 -->
            <div style="flex: 1;"></div>
            <el-button type="primary" size="large" class="write-btn" @click="dialogVisible = true">写评论</el-button>
          </div>
        </div>
      </template>
    </el-skeleton>

    <!-- 写评论弹窗 -->
    <el-dialog v-model="dialogVisible" title="写评论" width="500px">
      <el-form :model="commentForm">
        <el-form-item label="评分">
          <el-rate 
            v-model="commentForm.rating" 
            show-text 
            :texts="['极差', '失望', '一般', '不错', '满意']"
          />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="commentForm.content" type="textarea" rows="4" placeholder="分享你的用餐体验..." />
        </el-form-item>
        <el-form-item label="图片">
          <el-upload 
            ref="uploadRef"
            v-model:file-list="fileList"
            action="#" 
            list-type="picture-card" 
            :auto-upload="false"
            :limit="3"
            accept="image/*"
            :before-upload="beforeUpload"
            :on-exceed="handleExceed"
          >
            <el-icon><Plus /></el-icon>
            <template #tip>
              <div class="el-upload__tip">
                只能上传 jpg/png/gif 格式的图片，且单张不超过 5MB，最多 3 张
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitComment">发布</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="less">
.stall-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.nav-bar {
  margin-bottom: 20px;
}

.card-shadow {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.05);
  padding: 30px;
  margin-bottom: 24px;
  transition: transform 0.3s ease;
  
  &:hover {
    box-shadow: 0 12px 32px rgba(0,0,0,0.08);
  }
}

/* 头部样式 */
.stall-header {
  display: flex;
  gap: 40px;

  .header-img {
    width: 400px;
    height: 300px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
    &:hover img { transform: scale(1.05); }
  }

  .header-info {
    flex: 1;
    display: flex;
    flex-direction:column;
    justify-content: space-between;

    .info-top {
      border-bottom: 1px solid #eee;
      padding-bottom: 20px;
      margin-bottom: 20px;
    }

    .stall-name {
      font-size: 32px; 
      margin: 0 0 15px 0; 
      color: #333; 
      font-weight: 800;
    }
    
    .stall-stats {
      display: flex; 
      align-items: center; 
      gap: 20px;
      .price { font-size: 20px; color: #f56c6c; font-weight: bold; }
      .tag { font-weight: bold; }
    }

    .info-detail {
      color: #555;
      flex: 1;
      p { 
        margin: 12px 0; 
        display: flex; 
        align-items: center; 
        gap: 10px; 
        font-size: 15px;
        line-height: 1.6;
      }
      .intro { color: #666; align-items: flex-start; }
    }
    
    .header-actions {
      display: flex;
      gap: 15px;
      margin-top: 20px;
    }
  }
}

/* 通用标题 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  .section-title { 
    font-size: 22px; 
    font-weight: 700; 
    color: #333;
    position: relative;
    padding-left: 16px;
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 6px;
      height: 24px;
      background: linear-gradient(to bottom, #ff9900, #ff5500);
      border-radius: 3px;
    }
  }
}

/* 推荐菜滚动 */
.dish-scroll-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 10px;

  .scroll-btn {
    width: 48px; height: 48px; border-radius: 50%; 
    background: white;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    display: flex; align-items: center; justify-content: center; 
    cursor: pointer;
    z-index: 2;
    transition: all 0.3s;
    color: #666;
    
    &:hover { 
      background: #ff9900; 
      color: white;
      transform: scale(1.1);
    }
    &.left  { margin-right: 15px; }
    &.right { margin-left: 15px; }
  }

  .dish-list {
    flex: 1;
    display: flex;
    gap: 25px;
    overflow-x: auto;
    scroll-behavior: smooth;
    padding: 10px 5px 20px 5px;
    &::-webkit-scrollbar { display: none;} 

    .dish-card {
      min-width: 220px;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      transition: all 0.3s;
      cursor: pointer;
      
      &:hover { 
        transform: translateY(-8px); 
        box-shadow: 0 12px 24px rgba(0,0,0,0.12); 
      }

      .dish-img {
        height: 160px; position: relative;
        img { width: 100%; height: 100%; object-fit: cover; }
        .recommend-tag {
          position: absolute; top: 10px; left: 10px; 
          background: linear-gradient(45deg, #ff6b6b, #ff4757); 
          color: white;
          font-size: 12px; padding: 4px 8px; border-radius: 20px;
          font-weight: bold;
          box-shadow: 0 2px 6px rgba(255, 71, 87, 0.4);
        }
      }
      .dish-info {
        padding: 15px;
        .dish-name { font-size: 16px; font-weight: bold; margin-bottom: 8px; color: #333; }
        .dish-price { font-size: 18px; color: #f56c6c; font-weight: bold; }
      }
    }
  }
}

/* 评论列表 */
.comment-list {
  .comment-item {
    display: flex;
    gap: 25px;
    padding: 30px 0;
    border-bottom: 1px solid #f0f0f0;
    
    &:last-child { border-bottom: none; }

    .comment-avatar {
      border: 2px solid #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .comment-content {
      flex: 1;
      .comment-user { 
        display: flex; align-items: center; gap: 15px; margin-bottom: 8px;
        .username { font-size: 16px; font-weight: bold; color: #333; }
      }
      .comment-time { font-size: 13px; color: #999; margin-bottom: 12px; }
      .comment-text { 
        font-size: 15px; 
        line-height: 1.8; 
        color: #444; 
        margin-bottom: 15px; 
        background: #f9f9f9;
        padding: 15px;
        border-radius: 8px;
      }

      .comment-imgs {
        display: flex; gap: 12px; margin-bottom: 15px;
        .c-img { 
          width: 110px; height: 110px; 
          border-radius: 8px; 
          cursor: pointer; 
          transition: opacity 0.3s;
          &:hover { opacity: 0.9; }
        }
      }

      .comment-action {
        display: flex; align-items: center; gap: 8px; color: #666;
        .like-count { font-size: 14px; }
      }
    }
  }
}

.pagination-wrapper {
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #eee;
}
</style>
