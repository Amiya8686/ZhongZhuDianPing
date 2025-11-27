<script setup>
import {ref,getCurrentInstance,onMounted} from "vue"
import { ArrowDown } from '@element-plus/icons-vue'
const {proxy} = getCurrentInstance()


//一开始先隐藏页面，等token验证成功了再显示页面
const isShowBody = ref(false)

//用户信息
const userInfo = ref({
  username:'',
  nickName:'',
  avatar:''
})


//筛选条件
//分类选项
const categories = ref(['全部','烧腊','汉堡','粉面','自选','烩饭'])
const selectedCategory = ref('全部')

//地点选项
const locations = ref(['全部','榕园食堂','槿园食堂','若海食堂','荔园食堂'])
const selectedLocation = ref('全部')

//排序条件
const collation = ref('descend')  //排序规则: ascend/descend
const sortBy = ref('rating')      //排序字段: price或rating

//档口列表数据
const stallList = ref([])         //档口列表
const pageIndex = ref(1)          //当前页码，API使用pageIndex
const numPerPage = ref(10)        //每页显示数量，API使用numPerPage
const totalPageNum = ref(0)       //总页数，API返回totalPageNum

//验证token并加载用户信息
const tokenVerify = async ()=>{
  try{
    //直接加载用户信息，如果token不合法，axios响应拦截器会自动跳转到登录页
    await  proxy.$tokenApi.checkToken()
    //加载成功后显示页面
    isShowBody.value = true
  }catch(error){
    //getUserInfo失败会由拦截器自动跳转，这里不需要处理
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

//加载档口列表
const loadStallList = async () => {
  try {
    const params = {
      pageIndex: pageIndex.value,
      numPerPage: numPerPage.value,
      type: selectedCategory.value,
      canteen: selectedLocation.value,
      collation: collation.value,
      orderBy: sortBy.value  //price 或 rating
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

//排序方式切换（点击评分或价格按钮）
const handleSortByChange = (type) => {
  sortBy.value = type
  loadStallList()
}

//页码改变事件
const handlePageChange = (page) => {
  pageIndex.value = page
  loadStallList()
}

//跳转到档口详情页
const goToStall = (stallID) => {
  window.location.href = `/foodReview/stall?stallID=${stallID}`
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

//页面挂载时执行
onMounted(()=>{
  tokenVerify()
  loadUserInfo()
  loadStallList()
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
        <el-option label="降序" value="descend"></el-option>
        <el-option label="升序" value="ascend"></el-option>
      </el-select>

      <el-button
        :type="sortBy === 'rating' ? 'primary' : 'warning'"
        @click="handleSortByChange('rating')"
      >
        评分
      </el-button>

      <el-button
        :type="sortBy === 'price' ? 'primary' : 'warning'"
        @click="handleSortByChange('price')"
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
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalPageNum * numPerPage"
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
