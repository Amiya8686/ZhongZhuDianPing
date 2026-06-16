<script setup>
import {ref,getCurrentInstance,onMounted} from "vue"
import { ArrowDown, StarFilled } from '@element-plus/icons-vue'
import IconImg from '@/assets/imgs/icon/icon.svg'
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
  window.open(`/foodReview/stall.html?stallID=${stallID}`, '_blank');
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
        <img :src="IconImg" class="title-icon" />
        <div class="title-text">
          <span class="main-title">中珠点评</span>
          <span class="sub-title">美食点评</span>
        </div>
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
            :type="selectedCategory === category ? 'primary' : ''"
            :plain="selectedCategory !== category"
            @click="handleCategoryClick(category)"
            round
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
            :type="selectedLocation === location ? 'primary' : ''"
            :plain="selectedLocation !== location"
            @click="handleLocationClick(location)"
            round
          >
            {{ location }}
          </el-button>
        </div>
      </div>
    </div>

    <!-- 排序区域 -->
    <div class="sort-section">
      <div class="sort-left">
        <span class="sort-label">排序方式：</span>
        <el-button-group>
          <el-button
            :type="sortBy === 'rating' ? 'primary' : ''"
            :plain="sortBy !== 'rating'"
            @click="handleSortByChange('rating')"
          >
            评分优先
          </el-button>
          <el-button
            :type="sortBy === 'price' ? 'primary' : ''"
            :plain="sortBy !== 'price'"
            @click="handleSortByChange('price')"
          >
            价格优先
          </el-button>
        </el-button-group>
      </div>
      
      <div class="sort-right">
        <el-select
          v-model="collation"
          placeholder="排序规则"
          @change="handleCollationChange"
          class="sort-select"
          size="large"
        >
          <el-option label="从高到低" value="descend"></el-option>
          <el-option label="从低到高" value="ascend"></el-option>
        </el-select>
      </div>
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
          <!-- 高分推荐标签(标准可修改) -->
          <div class="stall-tag" v-if="stall.rating >= 4.5">高分推荐</div>
        </div>

        <!-- 右侧信息 -->
        <div class="stall-info">
          <!-- 头部：名称与评分 -->
          <div class="info-header">
            <div class="stall-name">{{ stall.name }}</div>
            <div class="stall-rating">
              <el-icon color="#ff9800" size="20"><StarFilled /></el-icon>
              <span class="rating-score">{{ stall.rating }}</span>
            </div>
          </div>

          <!-- 中部：标签与价格 -->
          <div class="info-body">
            <div class="stall-tags">
              <el-tag size="small" effect="plain" type="info">{{ stall.canteen }}</el-tag>
              <el-tag size="small" effect="light" type="warning">招牌: {{ stall.signatureDish }}</el-tag>
            </div>
            <div class="stall-price">
              <span class="price-label">人均</span>
              <span class="price-value">￥{{ stall.meanPrice }}</span>
            </div>
          </div>

          <!-- 底部：操作或描述（预留，目前可以放简单的描述或空着） -->
          <div class="info-footer">
             <el-button type="primary" link @click.stop="goToStall(stall.ID)">查看详情 ></el-button>
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
  background-color: #f5f7fa;
  padding-bottom: 40px;
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
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  position: sticky;
  top: 0;
  z-index: 100;
}

.title {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.title:hover {
  opacity: 0.9;
}

.title-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  flex-shrink: 0;
}

.title-text {
  display: flex;
  flex-direction: column;
}

.main-title {
  font-size: 24px;
  color: white;
  font-weight: bold;
  letter-spacing: 1px;
}

.sub-title {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
  margin-top: 2px;
}

.right-section {
  display: flex;
  align-items: center;
}

.user-info {
  .user-dropdown {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    padding: 6px 12px;
    border-radius: 20px;
    transition: background-color 0.3s;
    outline: none;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.15);
    }

    &:focus, &:focus-visible {
      outline: none;
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

/* 筛选区域 */
.filter-section {
  background: white;
  padding: 25px 40px;
  margin: 20px auto;
  max-width: 1200px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
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
  min-width: 60px;
  font-size: 15px;
  color: #606266;
  font-weight: 600;
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
  padding: 15px 40px;
  margin: 20px auto;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
}

.sort-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.sort-label {
  font-size: 14px;
  color: #606266;
}

.sort-select {
  width: 140px;
}

/* 档口列表 */
.stall-list {
  max-width: 1200px;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stall-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  gap: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #ebeef5;
}

.stall-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: #dcdfe6;
}

/* 左侧图片 */
.stall-image {
  width: 240px;
  height: 180px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
}

.stall-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.stall-card:hover .stall-image img {
  transform: scale(1.05);
}

.stall-tag {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(255, 152, 0, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

/* 右侧信息 */
.stall-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.stall-name {
  font-size: 22px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 8px;
}

.stall-rating {
  display: flex;
  align-items: center;
  gap: 5px;
  background: #fff7e6;
  padding: 4px 8px;
  border-radius: 4px;
}

.rating-score {
  font-size: 18px;
  font-weight: bold;
  color: #ff9800;
}

.info-body {
  margin-top: 10px;
  flex: 1;
}

.stall-tags {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.stall-price {
  display: flex;
  align-items: baseline;
  gap: 5px;
}

.price-label {
  font-size: 13px;
  color: #909399;
}

.price-value {
  font-size: 20px;
  font-weight: 600;
  color: #f56c6c;
}

.info-footer {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #f0f2f5;
  padding-top: 15px;
  margin-top: 10px;
}

/* 分页区域 */
.pagination-section {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}

/* Element Plus 样式覆盖 */
:deep(.el-button--primary) {
  --el-button-bg-color: #667eea;
  --el-button-border-color: #667eea;
  --el-button-hover-bg-color: #5a6fd6;
  --el-button-hover-border-color: #5a6fd6;
}

:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background-color: #667eea;
}
</style>
