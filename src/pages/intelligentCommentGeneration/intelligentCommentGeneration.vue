<script setup>
import { ref, getCurrentInstance, onMounted, computed } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import IconImg from '@/assets/imgs/icon/icon.svg'
import MagicWorkShopTime from '@/components/magicWorkShopTime.vue'
import MagicWorkShopSelector from '@/components/magicWorkShopSelector.vue'
import potNormalImg from '@/assets/imgs/magicWorkShop/IntelligentCommentGeneration/xiaoguo/normal.png'
import potThinkingImg from '@/assets/imgs/magicWorkShop/IntelligentCommentGeneration/xiaoguo/thinking.png'
import potCookingImg from '@/assets/imgs/magicWorkShop/IntelligentCommentGeneration/xiaoguo/cooking.png'

const { proxy } = getCurrentInstance()

const isShowBody = ref(false)

const userInfo = ref({
  username: '',
  nickName: '',
  avatar: ''
})

const tokenVerify = async () => {
  try {
    await proxy.$tokenApi.checkToken()
    isShowBody.value = true
  } catch (error) {
    console.log(error)
  }
}

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

const goToHome = () => {
  window.location.href = '/home'
}

const goToFoodReview = () => {
  window.location.href = '/foodReview'
}

const goToPersonalInfo = () => {
  window.location.href = '/user/personalInfo'
}

const goToEditPassword = () => {
  window.location.href = '/user/editPassword'
}

const goToMyComment = () => {
  window.location.href = '/user/myComment'
}

const handleLogout = () => {
  localStorage.removeItem('token')
  window.location.href = '/user/login'
}

const handleCommand = (command) => {
  switch (command) {
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

// 菜品展示相关
const dishList = ref([])
const currentDish = ref(null)
const dishPopoverVisible = ref(false)

// 获取 URL 参数
const getQueryParam = (name) => {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  const r = globalThis.location.search.substr(1).match(reg)
  if (r != null) return decodeURIComponent(r[2])
  return null
}

// 加载菜品列表
const loadDishList = async (refresh = false) => {
  try {
    const params = {}
    if (!refresh) {
      const dishID = getQueryParam('dishID')
      if (dishID) params.dishID = dishID
    }
    const res = await proxy.$agentApi.getDishList(params)
    dishList.value = res.dishList || []
    if (dishList.value.length > 0) {
      currentDish.value = dishList.value[0]
    }
  } catch (error) {
    console.error('获取菜品列表失败:', error)
  }
}

// 选择菜品
const selectDish = (dish) => {
  currentDish.value = dish
  dishPopoverVisible.value = false
}

// 换一批菜品
const refreshDishList = () => {
  loadDishList(true)
}

// 魔法小锅相关
const potState = ref('normal') // 'normal' | 'thinking' | 'cooking'
const conversationID = ref('')
const currentQuestion = ref('')
const currentChoices = ref([])
const currentRound = ref(0)
const totalRounds = ref(0)
const generatedComment = ref('')
const resultDialogVisible = ref(false)
const foodCategory = ref('')
const foodIcons = ref([])

const potImgSrc = computed(() => {
  if (potState.value === 'thinking') return potThinkingImg
  if (potState.value === 'cooking') return potCookingImg
  return potNormalImg
})

const foodCategories = ['dessert', 'fruit', 'meat', 'seafood', 'trash', 'vegetable']

const getRandomFoodCategory = () => {
  const cat = foodCategories[Math.floor(Math.random() * foodCategories.length)]
  // 从该类别随机挑出足够数量的图标（打乱后取前N个）
  const indices = Array.from({ length: 7 }, (_, i) => i + 1)
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]]
  }
  return { category: cat, indices }
}

const getChoiceIcon = (index) => {
  if (!foodCategory.value || !foodIcons.value.length) return ''
  const iconIndex = foodIcons.value[index] || 1
  return `/src/assets/imgs/magicWorkShop/IntelligentCommentGeneration/selectionIcon/${foodCategory.value}/${iconIndex}.svg`
}

// 调用魔法小锅API
const handleInteraction = async (messages) => {
  potState.value = 'thinking'
  try {
    const result = await proxy.$difyApi.magicPotInteractService(messages, conversationID.value)
    conversationID.value = result.conversationID || conversationID.value
    processResponse(result.data)
  } catch (error) {
    console.error('魔法小锅交互失败:', error)
    potState.value = 'normal'
  }
}

// 处理Agent响应（兼容Dify返回的key可能带冒号后缀）
const processResponse = (data) => {
  // 规范化 key：去掉末尾冒号
  const getVal = (key) => data[key] ?? data[key + ':'] ?? null

  if (getVal('isFinished')) {
    generatedComment.value = getVal('comment') || ''
    potState.value = 'cooking'
    setTimeout(() => {
      resultDialogVisible.value = true
    }, 2000)
  } else {
    currentQuestion.value = getVal('question') || ''
    currentChoices.value = getVal('choice') || []
    currentRound.value = getVal('currNumber') || 1
    totalRounds.value = getVal('totalNumber') || 3
    const { category, indices } = getRandomFoodCategory()
    foodCategory.value = category
    foodIcons.value = indices
    potState.value = 'normal'
  }
}

// 开始炼制
const startCooking = () => {
  if (!currentDish.value) return
  handleInteraction({
    dishID: currentDish.value.dishID,
    dishName: currentDish.value.dishName
  })
}

// 食材飞锅动画
const flyingIcon = ref('')
const isFlying = ref(false)

const selectAnswer = (answer, iconIndex) => {
  flyingIcon.value = getChoiceIcon(iconIndex)
  isFlying.value = true
  setTimeout(() => {
    isFlying.value = false
    handleInteraction({ answer })
  }, 600)
}

// 复制评论
const copyComment = () => {
  if (generatedComment.value) {
    navigator.clipboard.writeText(generatedComment.value)
  }
}

// 继续炼制（重置）
const continueCooking = () => {
  resultDialogVisible.value = false
  potState.value = 'normal'
  conversationID.value = ''
  currentQuestion.value = ''
  currentChoices.value = []
  generatedComment.value = ''
  foodCategory.value = ''
  foodIcons.value = []
}

onMounted(() => {
  tokenVerify()
  loadUserInfo()
  loadDishList()
})
</script>


<template>
  <div class="body" v-show="isShowBody">
    <div class="top-bar">
      <div class="title" @click="goToHome">
        <img :src="IconImg" class="title-icon" />
        <div class="title-text">
          <span class="main-title">中珠点评</span>
          <span class="sub-title">美食工坊</span>
        </div>
      </div>
      <div class="nav-links">
        <el-button link class="nav-btn" @click="goToHome">首页</el-button>
        <el-button link class="nav-btn" @click="goToFoodReview">美食点评</el-button>
      </div>
      <div class="right-section">
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

    <!-- 主内容区 -->
    <div class="main-content">
      <div class="main-canvas">
        <div class="dish-panel">
          <!-- 顶部：当前菜品 + 选择按钮 -->
          <div class="dish-selector-bar">
            <div class="current-dish" v-if="currentDish">
              <el-image
                :src="currentDish.dishPicture"
                :preview-src-list="[currentDish.dishPicture]"
                fit="cover"
                class="current-dish-img"
              />
              <div class="current-dish-info">
                <span class="current-dish-name">{{ currentDish.dishName }}</span>
                <span class="current-dish-meta">{{ currentDish.canteenName }} · {{ currentDish.stallName }}</span>
                <span class="current-dish-price">¥{{ currentDish.dishPrice }}</span>
              </div>
            </div>
            <div class="current-dish-empty" v-else>
              <span>暂无菜品数据</span>
            </div>

            <el-popover
              v-model:visible="dishPopoverVisible"
              placement="bottom-end"
              :width="520"
              trigger="click"
            >
              <template #reference>
                <el-button type="primary" size="large" class="select-dish-btn">
                  选择菜品
                </el-button>
              </template>
              <div class="popover-dish-panel">
                <div class="popover-dish-header">
                  <span class="popover-dish-title">选择菜品</span>
                  <el-button size="small" @click="refreshDishList" class="refresh-btn">
                    换一批菜品
                  </el-button>
                </div>
                <div class="popover-dish-grid">
                  <div
                    v-for="dish in dishList"
                    :key="dish.dishID"
                    class="popover-dish-card"
                    :class="{ active: currentDish && currentDish.dishID === dish.dishID }"
                    @click="selectDish(dish)"
                  >
                    <img :src="dish.dishPicture" class="popover-dish-img" />
                    <span class="popover-dish-name">{{ dish.dishName }}</span>
                  </div>
                </div>
              </div>
            </el-popover>
          </div>

          <!-- 下半部分：魔法小锅 -->
          <div class="pot-content-area">
            <!-- 小锅图片 -->
            <div class="pot-area">
              <template v-if="potState === 'thinking'">
                <span class="think-q q1">？</span>
                <span class="think-q q2">？</span>
                <span class="think-q q3">？</span>
                <span class="think-q q4">？</span>
                <span class="think-q q5">？</span>
                <span class="think-q q6">？</span>
              </template>
              <img :src="potImgSrc" class="pot-img" :class="potState" />
              <img v-if="isFlying" :src="flyingIcon" class="flying-food" />
              <p class="pot-hint" v-if="potState === 'thinking'">小锅思考中...</p>
              <p class="pot-hint" v-if="potState === 'cooking'">魔法评论炼制中...</p>
            </div>

            <!-- 初始状态 -->
            <div class="pot-action" v-if="potState === 'normal' && !currentQuestion">
              <p class="pot-intro">✨ 你好！我是魔法小锅，把食材扔进来，我帮你炼制一条魔法评论～</p>
              <el-button type="primary" size="large" class="start-btn" @click="startCooking">
                🔮 开始炼制魔法评论
              </el-button>
            </div>

            <!-- 问题文字 -->
            <div class="question-area" v-if="currentQuestion && potState !== 'cooking'">
              <p class="question-round">第 {{ currentRound }}/{{ totalRounds }} 轮</p>
              <p class="question-text">{{ currentQuestion }}</p>
            </div>

            <!-- 选择按钮 -->
            <div class="choices-area" v-if="currentChoices.length > 0 && potState === 'normal'">
              <button
                v-for="(choice, index) in currentChoices"
                :key="index"
                class="choice-btn"
                @click="selectAnswer(choice, index)"
              >
                <img :src="getChoiceIcon(index)" class="choice-icon" />
                <span>{{ choice }}</span>
              </button>
            </div>
          </div>

          <!-- 结果弹窗 -->
          <el-dialog
            v-model="resultDialogVisible"
            title="✨ 魔法评论出炉！"
            width="520px"
            :close-on-click-modal="false"
            class="result-dialog"
            @closed="continueCooking"
          >
            <div class="result-comment">{{ generatedComment }}</div>
            <template #footer>
              <el-button type="primary" @click="copyComment">📋 复制</el-button>
              <el-button type="warning" @click="continueCooking">🪄 继续炼制</el-button>
            </template>
          </el-dialog>
        </div>
      </div>

      <div class="side-panel">
        <MagicWorkShopTime />
        <MagicWorkShopSelector current-page="intelligentCommentGeneration" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.body {
  width: 100%;
  min-height: 100vh;
  background-color: #fef6e4;
  background-image: radial-gradient(#f3d2c1 1px, transparent 1px);
  background-size: 20px 20px;
}

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
  flex-direction: row;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.title:hover {
  opacity: 0.8;
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

.nav-links {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-right: auto;
  margin-left: 40px;

  .nav-btn {
    color: rgba(255, 255, 255, 0.9);
    font-size: 16px;
    font-weight: 700;
    padding: 8px 22px;
    border-radius: 20px;
    transition: all 0.3s;

    &:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.2);
    }
  }
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

/* 主内容区 */
.main-content {
  display: flex;
  gap: 24px;
  max-width: 1400px;
  margin: 16px auto;
  padding: 0 40px;
  height: calc(100vh - 102px);
}

.main-canvas {
  flex: 1;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  min-width: 0;
}

/* 菜品面板 */
.dish-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* 顶部选择栏 */
.dish-selector-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  border-bottom: 1px solid #f0f0f0;
  gap: 20px;
}

.current-dish {
  display: flex;
  align-items: center;
  gap: 16px;

  .current-dish-img {
    width: 120px;
    height: 90px;
    border-radius: 12px;
    object-fit: cover;
    flex-shrink: 0;
  }

  .current-dish-info {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .current-dish-name {
      font-size: 20px;
      font-weight: 700;
      color: #333;
    }

    .current-dish-meta {
      font-size: 13px;
      color: #999;
    }

    .current-dish-price {
      font-size: 18px;
      font-weight: 700;
      color: #ff8e3c;
    }
  }
}

.current-dish-empty {
  color: #ccc;
  font-size: 15px;
}

.select-dish-btn {
  background: #ff8e3c;
  border-color: #ff8e3c;
  flex-shrink: 0;

  &:hover {
    background: #e07b30;
    border-color: #e07b30;
  }
}

/* 弹窗菜品面板 */
.popover-dish-panel {
  .popover-dish-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;

    .popover-dish-title {
      font-size: 16px;
      font-weight: 700;
      color: #333;
    }
  }

  .popover-dish-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    max-height: 360px;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background: #ddd;
      border-radius: 2px;
    }
  }

  .popover-dish-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 12px 8px;
    border: 2px solid #f0f0f0;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      border-color: #ffbe76;
      background: #fff8f0;
    }

    &.active {
      border-color: #ff8e3c;
      background: #fff3e6;
    }

    .popover-dish-img {
      width: 100%;
      height: 90px;
      border-radius: 8px;
      object-fit: cover;
    }

    .popover-dish-name {
      font-size: 13px;
      font-weight: 600;
      color: #333;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
    }
  }
}

/* 下半部分：魔法小锅 */
.pot-content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
  padding: 10px 20px 20px;
  overflow-y: auto;
}

.pot-area {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  .pot-img {
    width: 380px;
    height: 230px;
    object-position: top;
    object-fit: contain;
    transition: all 0.3s;

    &.cooking {
      animation: pot-shake 0.3s ease-in-out infinite;
    }
  }

  .flying-food {
    position: absolute;
    width: 72px;
    height: 72px;
    object-fit: contain;
    animation: fly-to-pot 0.6s ease-in forwards;
    pointer-events: none;
  }

  .think-q {
    position: absolute;
    font-weight: 900;
    color: #ff8e3c;
    pointer-events: none;
    animation: question-wobble 0.6s ease-in-out infinite;

    &.q1 { top: -10px; left: 45%; font-size: 36px; animation-delay: 0s; }
    &.q2 { top: 10px; left: 25%; font-size: 24px; animation-delay: 0.15s; opacity: 0.7; }
    &.q3 { top: 0px; left: 62%; font-size: 28px; animation-delay: 0.3s; opacity: 0.8; }
    &.q4 { top: -5px; left: 35%; font-size: 20px; animation-delay: 0.1s; opacity: 0.6; }
    &.q5 { top: 8px; left: 55%; font-size: 32px; animation-delay: 0.2s; opacity: 0.75; }
    &.q6 { top: -2px; left: 73%; font-size: 22px; animation-delay: 0.35s; opacity: 0.65; }
  }

  .pot-hint {
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 14px;
    color: #999;
    margin: 0;
    white-space: nowrap;
  }
}

@keyframes pot-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px) rotate(-2deg); }
  75% { transform: translateX(4px) rotate(2deg); }
}

@keyframes question-wobble {
  0%, 100% { transform: translateX(-50%) rotate(0deg); }
  25% { transform: translateX(-50%) rotate(-15deg); }
  75% { transform: translateX(-50%) rotate(15deg); }
}

@keyframes fly-to-pot {
  0% {
    opacity: 1;
    transform: translateY(-120px) scale(1);
  }
  70% {
    opacity: 1;
    transform: translateY(0) scale(0.5);
  }
  100% {
    opacity: 0;
    transform: translateY(20px) scale(0.2);
  }
}

.pot-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.pot-intro {
  font-size: 15px;
  color: #888;
  margin: 0;
  text-align: center;
  max-width: 360px;
  line-height: 1.6;
}

.start-btn {
  font-size: 18px;
  padding: 16px 36px;
  border-radius: 24px;
  background: #ff8e3c;
  border-color: #ff8e3c;

  &:hover {
    background: #e07b30;
    border-color: #e07b30;
  }
}

.question-area {
  text-align: center;
  max-width: 500px;

  .question-round {
    font-size: 13px;
    color: #ff8e3c;
    font-weight: 600;
    margin: 0 0 8px 0;
  }

  .question-text {
    font-size: 18px;
    font-weight: 700;
    color: #333;
    margin: 0;
    line-height: 1.6;
  }
}

.choices-area {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  gap: 12px;
  max-width: 600px;
}

.choice-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: 2px solid #f0f0f0;
  border-radius: 14px;
  background: #fff;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  color: #333;
  transition: all 0.3s;

  &:hover {
    border-color: #ff8e3c;
    background: #fff7f0;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 142, 60, 0.15);
  }

  .choice-icon {
    width: 28px;
    height: 28px;
    object-fit: contain;
  }
}

.result-dialog {
  .result-comment {
    font-size: 16px;
    line-height: 1.8;
    color: #333;
    padding: 16px;
    background: #fafafa;
    border-radius: 12px;
    white-space: pre-wrap;
    word-break: break-word;
  }
}

/* el-image 预览关闭按钮移到底部 */
:deep(.el-image-viewer__close) {
  top: auto;
  bottom: 80px;
  right: 50%;
  transform: translateX(50%);
  color: #fff;
  font-size: 32px;
  width: auto;
  height: auto;
}

.side-panel {
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex-shrink: 0;
  height: 100%;

  > :first-child {
    flex-shrink: 0;
  }

  > :last-child {
    flex: 1;
    min-height: 0;
  }
}
</style>
