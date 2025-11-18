<script setup>
import {ref,getCurrentInstance,onMounted} from "vue"
const {proxy} = getCurrentInstance()


//一开始先隐藏页面，等token验证成功了再显示页面
const isShowBody = ref(false)

//用户信息
const userInfo = ref({
  username:'',
  avatar:''
})


//筛选条件
//分类选项
const categories = ref(['全部','烧腊','汉堡','粉面','自选','烩饭'])
const selectedCategory = ref('全部')

//地点选项
const locations = ref(['全部','榕园','槿园','若海','荔园'])
const selectedLocation = ref('全部')

//排序条件
const collation = ref('default')  //API中使用collation: ascend/descend/default
const sortBy = ref('rating')      //API中使用rating或meanPrice

//档口列表数据
const stallList = ref([])         //档口列表
const pageIndex = ref(1)          //当前页码，API使用pageIndex
const numPerPage = ref(10)        //每页显示数量，API使用numPerPage
const totalPageNum = ref(0)       //总页数，API返回totalPageNum

//验证token并加载用户信息
const tokenVerify = async ()=>{
  try{
    //检查是否有token
    const token = localStorage.getItem('token')
    if(token){
      //验证token并获取用户信息
      await proxy.$tokenApi.checkToken()
      await loadUserInfo()
    }
    //无论是否登录都显示页面和档口列表
    isShowBody.value = true
    loadStallList()
  }catch(error){
    //token验证失败，清除token
    console.log(error)
    localStorage.removeItem('token')
    //仍然显示页面，只是显示登录按钮
    isShowBody.value = true
    loadStallList()
  }
}

//加载用户信息
const loadUserInfo = async () => {
  try {
    const data = await proxy.$userApi.getUserInfo()
    userInfo.value.username = data.userName
    userInfo.value.avatar = data.avatarUrl
  } catch (error) {
    console.error('获取用户信息失败', error)
    userInfo.value.username = ''
    userInfo.value.avatar = ''
  }
}

//加载档口列表
const loadStallList = async () => {
  try {
    const params = {
      pageIndex: pageIndex.value,
      numPerPage: numPerPage.value
    }
    
    //添加分类筛选(API字段为type)
    if(selectedCategory.value !== '全部'){
      params.type = selectedCategory.value
    }
    
    //添加地点筛选(API字段为canteen)
    if(selectedLocation.value !== '全部'){
      params.canteen = selectedLocation.value
    }
    
    //添加排序条件(API字段为collation)
    if(collation.value !== 'default'){
      params.collation = collation.value
      params.colIndex = sortBy.value  //rating 或 meanPrice
    }
    
    const data = await proxy.$foodApi.getStallList(params)
    stallList.value = data.stalls || []
    totalPageNum.value = data.totalPageNum || 0
  } catch (error) {
    console.error('获取档口列表失败', error)
  }
}

//分类点击事件
const handleCategoryClick = (category) => {
  //如果点击的是已选中的分类，则取消选择回到"全部"
  if(selectedCategory.value === category && category !== '全部'){
    selectedCategory.value = '全部'
  }else{
    selectedCategory.value = category
  }
  pageIndex.value = 1
  loadStallList()
}

//地点点击事件
const handleLocationClick = (location) => {
  //如果点击的是已选中的地点，则取消选择回到"全部"
  if(selectedLocation.value === location && location !== '全部'){
    selectedLocation.value = '全部'
  }else{
    selectedLocation.value = location
  }
  pageIndex.value = 1
  loadStallList()
}

//排序规则切换
const handleCollationChange = () => {
  loadStallList()
}

//排序方式切换
const handleSortByChange = (type) => {
  sortBy.value = type
  //如果之前是default，切换排序字段时改为倒序
  if(collation.value === 'default'){
    collation.value = 'descend'
  }
  loadStallList()
}

//页码改变事件
const handlePageChange = (page) => {
  pageIndex.value = page
  loadStallList()
}

//跳转到档口详情页
const goToStall = (stallID) => {
  window.location.href = `/foodReview/stall.html?stallID=${stallID}`
}

//跳转到登录页
const goToLogin = () => {
  window.location.href = '/user/login.html'
}

//跳转到个人中心
const goToPersonalInfo = () => {
  window.location.href = '/user/personalInfo.html'
}

//页面挂载时执行
onMounted(()=>{
  tokenVerify()
})



</script>

<template>
  <div class="body" v-show="isShowBody">
    <!-- 顶部导航栏 -->
     <div class="top-bar">
      <div class="title">美食点评</div>
      <div class="right-section">
        <el-button
          type="warning"
          @click="goToLogin"
          v-if="!userInfo.username"
        >
          登录
        </el-button>
        <el-avatar
          :src="userInfo.avatar"
          @click="goToPersonalInfo"
          v-if="userInfo.username"
          class="avatar"
        >
          {{ userInfo.username }}
        </el-avatar>
      </div>
     </div>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <!-- 分类筛选 -->
      <div class="filter-row">
        <div class="filter-label">分类</div>
        <div class="filter-buttons">
          <el-button
            v-for="category in categories"
            :key="category"
            :type="selectedCategory === category ? 'success' : 'warning'"
            @click="handleCategoryClick(category)"
            size="default"
          >
            {{ category }}
          </el-button>
        </div>
      </div>

      <!-- 地点筛选 -->
      <div class="filter-row">
        <div class="filter-label">地点</div>
        <div class="filter-buttons">
          <el-button
            v-for="location in locations"
            :key="location"
            :type="selectedLocation === location ? 'success' : 'warning'"
            @click="handleLocationClick(location)"
            size="default"
          >
            {{ location }}
          </el-button>
        </div>
      </div>
    </div>

    <!-- 排序区域 -->
    <div class="sort-section">
      <el-select
        v-model="collation"
        placeholder="排序规则"
        @change="handleCollationChange"
        class="sort-select"
      >
        <el-option label="默认" value="default"></el-option>
        <el-option label="倒序" value="descend"></el-option>
        <el-option label="升序" value="ascend"></el-option>
      </el-select>

      <el-button
        :type="sortBy === 'rating' ? 'warning' : 'primary'"
        @click="handleSortByChange('rating')"
      >
        评分
      </el-button>

      <el-button
        :type="sortBy === 'meanPrice' ? 'warning' : 'primary'"
        @click="handleSortByChange('meanPrice')"
      >
        价格
      </el-button>
    </div>

    <!-- 档口列表 -->
    <div class="stall-list">
      <div
        class="stall-card"
        v-for="stall in stallList"
        :key="stall.ID"
        @click="goToStall(stall.ID)"
      >
        <!-- 左侧图片 -->
        <div class="stall-image">
          <img :src="stall.pictureUrl" alt="档口图片" />
        </div>

        <!-- 右侧信息 -->
        <div class="stall-info">
          <!-- 档口名 -->
          <div class="stall-name">{{ stall.name }}</div>

          <!-- 评分与价格 -->
          <div class="stall-stats">
            <span>评分：{{ stall.rating }}</span>
            <span style="margin-left: 20px;">人均价格：￥{{ stall.meanPrice }}</span>
          </div>

          <!-- 地点和招牌菜 -->
          <div class="stall-details">
            <div class="detail-item">地点：{{ stall.canteen }}</div>
            <div class="detail-item">招牌菜：{{ stall.signatureDish }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination-section">
      <div class="pagination-info">
        可以最多显示{{ Math.min(totalPageNum, 50) }}页
      </div>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="Math.min(totalPageNum, 50) * numPerPage"
        :page-size="numPerPage"
        :current-page="pageIndex"
        @current-change="handlePageChange"
        :pager-count="5"
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
  font-size: 28px;
  color: white;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  letter-spacing: 2px;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.avatar {
  cursor: pointer;
  background-color: #ff9800;
  transition: transform 0.3s;
}

.avatar:hover {
  transform: scale(1.1);
}

/* 筛选区域 */
.filter-section {
  background: white;
  padding: 25px 40px;
  margin: 20px auto;
  max-width: 1400px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
}

.filter-row {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.filter-row:last-child {
  margin-bottom: 0;
}

.filter-label {
  min-width: 80px;
  font-size: 16px;
  color: #333;
  font-weight: 600;
  text-align: left;
  margin-right: 20px;
}

.filter-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* 排序区域 */
.sort-section {
  background: white;
  padding: 20px 40px;
  margin: 20px auto;
  max-width: 1400px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
}

.sort-select {
  width: 150px;
}

/* 档口列表 */
.stall-list {
  max-width: 1400px;
  margin: 30px auto;
  padding: 0 40px;
}

.stall-card {
  background: white;
  border-radius: 12px;
  padding: 0;
  margin-bottom: 20px;
  margin-left: auto;
  margin-right: auto;
  max-width: 950px;
  display: flex;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.stall-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

/* 左侧图片 */
.stall-image {
  width: 220px;
  height: 220px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  flex-shrink: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.stall-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.stall-card:hover .stall-image img {
  transform: scale(1.1);
}

/* 右侧信息 */
.stall-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 25px;
  max-width: 600px;
}

.stall-name {
  background: #667eea;
  color: white;
  font-size: 22px;
  font-weight: bold;
  padding: 12px 20px;
  border-radius: 8px;
  margin-bottom: 15px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.stall-stats {
  background: white;
  color: #333;
  font-size: 16px;
  font-weight: 500;
  padding: 12px 20px;
  border-radius: 8px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #e0e0e0;
}

.stall-stats span:first-child {
  font-size: 18px;
  font-weight: 600;
  color: #ff9800;
}

.stall-stats span:last-child {
  color: #e74c3c;
  font-weight: 600;
}

.stall-details {
  display: flex;
  gap: 15px;
}

.detail-item {
  background: white;
  color: #555;
  font-size: 15px;
  font-weight: 500;
  padding: 12px 20px;
  border-radius: 8px;
  flex: 1;
  text-align: center;
  border: 1px solid #e0e0e0;
}

/* 分页区域 */
.pagination-section {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  padding: 40px 0 60px;
  margin-top: 20px;
}

.pagination-info {
  font-size: 16px;
  color: #666;
  font-weight: 500;
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

:deep(.el-button--primary) {
  background: #667eea;
  border: none;
  color: white;
}

:deep(.el-button--primary:hover) {
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

</style>
