<script setup>
import { reactive, ref, onMounted, getCurrentInstance } from 'vue'
import { Delete } from '@element-plus/icons-vue'

const { proxy } = getCurrentInstance()

// 评论列表数据
const commentList = ref([])
// 分页信息
const pagination = reactive({
  currentPage: 1,
  numPerPage: 5,
  totalPageNum: 0
})
// 加载状态
const loading = ref(false)
// 图片预览
const previewVisible = ref(false)
const previewImageUrl = ref('')

// 获取我的评论列表
const getMyComments = async () => {
  loading.value = true
  try {
    const data = await proxy.$commentApi.getMyComments({
      numPerPage: pagination.numPerPage,
      pageIndex: pagination.currentPage
    })
    
    commentList.value = data.comments
    pagination.totalPageNum = data.totalPageNum
    pagination.currentPage = data.pageIndex
  } catch (error) {
    ElMessage.error('获取评论列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 删除评论
const handleDeleteComment = (commentID) => {
  ElMessageBox.confirm('确定要删除这条评论吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await proxy.$commentApi.deleteComment(commentID)
      ElMessage.success('删除成功')
      
      // 删除成功后重新加载数据
      // 如果当前页已经没有数据且不是第一页，则跳转到上一页
      if (commentList.value.length === 1 && pagination.currentPage > 1) {
        pagination.currentPage--
      }
      await getMyComments()
    } catch (error) {
      ElMessage.error(error || '删除失败')
      console.error(error)
    }
  }).catch(() => {})
}

// 图片预览
const handlePreviewImage = (url) => {
  previewImageUrl.value = url
  previewVisible.value = true
}

// 关闭图片预览
const closePreview = () => {
  previewVisible.value = false
  previewImageUrl.value = ''
}

// 分页改变
const handlePageChange = (page) => {
  pagination.currentPage = page
  getMyComments()
}

// 生成星星评分
const getStars = (rating) => {
  return '⭐'.repeat(rating)
}

onMounted(() => {
  getMyComments()
})
</script>

<template>
  <div class="myCommentPage">
    <div class="pageContainer">
      <h1 class="pageTitle">我的评论</h1>
      
      <!-- 评论列表 -->
      <div v-loading="loading" class="commentList">
        <el-empty v-if="!loading && commentList.length === 0" description="暂无评论" />
        
        <div 
          v-for="comment in commentList" 
          :key="comment.ID" 
          class="commentItem"
        >
          <!-- 顶部信息栏 -->
          <div class="commentHeader">
            <div class="headerLeft">
              <div class="ratingBox">
                <span class="label">评分：</span>
                <span class="stars">{{ getStars(comment.rating) }}</span>
                <span class="ratingNum">{{ comment.rating.toFixed(1) }}</span>
              </div>
              
              <div class="likesBox">
                <span class="label">点赞数：</span>
                <span class="likesNum">{{ comment.like }}</span>
              </div>
              
              <div class="dateBox">
                <span class="label">日期：</span>
                <span class="dateText">{{ comment.dateTime }}</span>
              </div>
            </div>
            
            <div class="stallInfo">
              <div class="stallName">{{ comment.stallName }}</div>
              <div class="canteenName">{{ comment.canteen }}</div>
            </div>
          </div>
          
          <!-- 评论内容 -->
          <div class="commentContent">
            {{ comment.content }}
          </div>
          
          <!-- 图片区域 -->
          <div v-if="comment.pictrue1Url || comment.picture2Url || comment.picture3Url" class="imageArea">
            <div 
              v-if="comment.pictrue1Url"
              class="imageItem"
              @click="handlePreviewImage(comment.pictrue1Url)"
            >
              <img :src="comment.pictrue1Url" alt="图片1">
            </div>
            <div 
              v-if="comment.picture2Url"
              class="imageItem"
              @click="handlePreviewImage(comment.picture2Url)"
            >
              <img :src="comment.picture2Url" alt="图片2">
            </div>
            <div 
              v-if="comment.picture3Url"
              class="imageItem"
              @click="handlePreviewImage(comment.picture3Url)"
            >
              <img :src="comment.picture3Url" alt="图片3">
            </div>
          </div>
          
          <!-- 删除按钮 -->
          <div class="commentFooter">
            <el-button 
              type="danger" 
              :icon="Delete"
              @click="handleDeleteComment(comment.ID)"
            >
              删除评论
            </el-button>
          </div>
        </div>
      </div>
      
      <!-- 分页 -->
      <div v-if="pagination.totalPageNum > 0" class="paginationBox">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          :page-size="pagination.numPerPage"
          :total="pagination.totalPageNum * pagination.numPerPage"
          layout="prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </div>
    
    <!-- 图片预览对话框 -->
    <el-dialog 
      v-model="previewVisible" 
      title="图片预览" 
      width="60%"
      @close="closePreview"
    >
      <div class="previewContainer">
        <img :src="previewImageUrl" alt="预览图片" class="previewImage">
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="less">
.myCommentPage {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
  
  .pageContainer {
    max-width: 1000px;
    margin: 0 auto;
    
    .pageTitle {
      font-size: 28px;
      font-weight: 600;
      color: #333;
      margin: 0 0 30px 0;
      text-align: center;
    }
    
    .commentList {
      min-height: 400px;
      
      .commentItem {
        background: white;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: all 0.3s;
        
        &:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }
        
        .commentHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 15px;
          border-bottom: 1px solid #e0e0e0;
          margin-bottom: 15px;
          
          .headerLeft {
            display: flex;
            gap: 30px;
            align-items: center;
            flex-wrap: wrap;
            
            .ratingBox, .likesBox, .dateBox {
              display: flex;
              align-items: center;
              gap: 5px;
              
              .label {
                font-size: 14px;
                color: #666;
              }
              
              .stars {
                font-size: 16px;
              }
              
              .ratingNum {
                font-size: 14px;
                font-weight: 600;
                color: #ff9800;
              }
              
              .likesNum {
                font-size: 14px;
                font-weight: 600;
                color: #e74c3c;
              }
              
              .dateText {
                font-size: 14px;
                color: #999;
              }
            }
          }
          
          .stallInfo {
            text-align: right;
            
            .stallName {
              font-size: 16px;
              font-weight: 600;
              color: #667eea;
              margin-bottom: 4px;
            }
            
            .canteenName {
              font-size: 13px;
              color: #999;
            }
          }
        }
        
        .commentContent {
          font-size: 15px;
          line-height: 1.8;
          color: #333;
          margin-bottom: 15px;
          word-wrap: break-word;
        }
        
        .imageArea {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
          flex-wrap: wrap;
          
          .imageItem {
            width: 120px;
            height: 120px;
            border-radius: 8px;
            overflow: hidden;
            cursor: pointer;
            transition: all 0.3s;
            
            &:hover {
              transform: scale(1.05);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            }
            
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
        }
        
        .commentFooter {
          display: flex;
          justify-content: flex-end;
          padding-top: 10px;
        }
      }
    }
    
    .paginationBox {
      display: flex;
      justify-content: center;
      margin-top: 30px;
      padding: 20px 0;
    }
  }
}

.previewContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  
  .previewImage {
    max-width: 100%;
    max-height: 70vh;
    object-fit: contain;
  }
}
</style>
