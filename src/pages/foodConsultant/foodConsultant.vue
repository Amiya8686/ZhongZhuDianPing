<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import MagicWorkShopTime from '@/components/magicWorkShopTime.vue'
import MagicWorkShopSelector from '@/components/magicWorkShopSelector.vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import FoodConsultantImg from '@/assets/imgs/magicWorkShop/FoodConsultant.svg'

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

// 聊天相关
const conversationId = ref('')
const messages = ref([])
const inputText = ref('')
const isStreaming = ref(false)
const chatContainer = ref(null)

// Markdown 渲染
const renderMarkdown = (content) => {
  if (!content) return ''
  const rawHtml = marked.parse(content)
  return DOMPurify.sanitize(rawHtml)
}

const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

const sendMessage = async () => {
  const text = inputText.value.trim()
  if (!text || isStreaming.value) return

  inputText.value = ''
  messages.value.push({ role: 'user', content: text })
  messages.value.push({ role: 'bot', content: '' })
  isStreaming.value = true
  scrollToBottom()

  try {
    const result = await proxy.$difyApi.chatServiceStream(
      text,
      conversationId.value,
      (chunk) => {
        // 流式追加到当前bot消息
        const lastMsg = messages.value[messages.value.length - 1]
        if (lastMsg && lastMsg.role === 'bot') {
          lastMsg.content += chunk
        }
        scrollToBottom()
      }
    )
    conversationId.value = result.conversation_id || conversationId.value
  } catch (error) {
    const lastMsg = messages.value[messages.value.length - 1]
    if (lastMsg && lastMsg.role === 'bot') {
      lastMsg.content = '抱歉，请求失败，请稍后重试。'
    }
    console.error('聊天请求失败:', error)
  } finally {
    isStreaming.value = false
    scrollToBottom()
  }
}

const handleKeydown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

onMounted(() => {
  tokenVerify()
  loadUserInfo()
})
</script>


<template>
  <div class="body" v-show="isShowBody">
    <div class="top-bar">
      <div class="title" @click="goToHome">
        <span class="main-title">中珠点评</span>
        <span class="sub-title">美食工坊</span>
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
      <!-- 左侧主画布 -->
      <div class="main-canvas">
        <div class="chat-panel">
          <!-- 消息区域 -->
          <div class="chat-messages" ref="chatContainer">
            <div v-if="messages.length === 0" class="chat-empty">
              <img :src="FoodConsultantImg" class="empty-icon" />
              <span class="empty-text">你好！我是美食小顾问，有什么可以帮你的？</span>
            </div>
            <div
              v-for="(msg, index) in messages"
              :key="index"
              class="chat-message"
              :class="msg.role"
            >
              <div class="msg-avatar" v-if="msg.role === 'bot'">
                <img :src="FoodConsultantImg" class="bot-icon" />
              </div>
              <div class="msg-bubble" :class="msg.role">
                <template v-if="msg.role === 'bot'">
                  <span v-html="renderMarkdown(msg.content)"></span>
                  <span v-if="isStreaming && index === messages.length - 1" class="cursor-blink">|</span>
                </template>
                <template v-else>
                  {{ msg.content }}
                </template>
              </div>
              <div class="msg-avatar" v-if="msg.role === 'user'">
                <el-avatar :src="userInfo.avatar" :size="42"></el-avatar>
              </div>
            </div>
          </div>

          <!-- 输入区域 -->
          <div class="chat-input-area">
            <el-input
              v-model="inputText"
              placeholder="输入你的问题..."
              :disabled="isStreaming"
              @keydown="handleKeydown"
              class="chat-input"
              size="large"
            />
            <el-button
              type="primary"
              :disabled="isStreaming || !inputText.trim()"
              @click="sendMessage"
              class="send-btn"
              size="large"
            >
              发送
            </el-button>
          </div>
        </div>
      </div>

      <!-- 右侧面板 -->
      <div class="side-panel">
        <MagicWorkShopTime />
        <MagicWorkShopSelector current-page="foodConsultant" />
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
  margin: 24px auto;
  padding: 0 40px;
  height: calc(100vh - 118px);
}

/* 左侧主画布 */
.main-canvas {
  flex: 1;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  min-width: 0;
}

/* 聊天面板 */
.chat-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 3px;
  }
}

.chat-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;

  .empty-icon {
    width: 72px;
    height: 72px;
    border-radius: 50%;
  }
  .empty-text {
    font-size: 16px;
    color: #aaa;
  }
}

.chat-message {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  max-width: 80%;

  &.bot {
    align-self: flex-start;
  }
  &.user {
    align-self: flex-end;
  }

  .msg-avatar {
    flex-shrink: 0;

    .bot-icon {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      object-fit: cover;
    }
  }

  .msg-bubble {
    padding: 12px 18px;
    border-radius: 16px;
    font-size: 14px;
    line-height: 1.7;
    word-break: break-word;

    &.bot {
      background: #f5f5f5;
      color: #333;
      border-top-left-radius: 4px;

      :deep(p) {
        margin: 0 0 8px 0;
        &:last-child { margin-bottom: 0; }
      }
      :deep(code) {
        background: #e8e8e8;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 13px;
      }
      :deep(pre) {
        background: #2d2d2d;
        color: #f8f8f2;
        padding: 12px 16px;
        border-radius: 8px;
        overflow-x: auto;
        margin: 8px 0;
        code { background: none; padding: 0; color: inherit; }
      }
      :deep(ul), :deep(ol) {
        padding-left: 20px;
        margin: 4px 0;
      }
      :deep(li) {
        margin: 2px 0;
      }
      :deep(strong) {
        font-weight: 700;
      }
      :deep(em) {
        font-style: italic;
      }
      :deep(h1), :deep(h2), :deep(h3), :deep(h4) {
        margin: 12px 0 6px 0;
        font-weight: 700;
      }
      :deep(h1) { font-size: 18px; }
      :deep(h2) { font-size: 16px; }
      :deep(h3) { font-size: 15px; }
      :deep(blockquote) {
        border-left: 3px solid #ff8e3c;
        padding-left: 12px;
        margin: 8px 0;
        color: #666;
      }
      :deep(table) {
        border-collapse: collapse;
        margin: 8px 0;
        th, td {
          border: 1px solid #ddd;
          padding: 6px 12px;
          text-align: left;
        }
        th {
          background: #f0f0f0;
          font-weight: 700;
        }
      }
      :deep(a) {
        color: #ff8e3c;
      }
      :deep(hr) {
        border: none;
        border-top: 1px solid #ddd;
        margin: 12px 0;
      }
    }
    &.user {
      background: #ff8e3c;
      color: #fff;
      border-top-right-radius: 4px;
    }

    .cursor-blink {
      animation: blink 0.8s infinite;
      font-weight: bold;
      color: #ff8e3c;
    }
  }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* 输入区域 */
.chat-input-area {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;

  .chat-input {
    flex: 1;
  }

  .send-btn {
    background: #ff8e3c;
    border-color: #ff8e3c;

    &:hover {
      background: #e07b30;
      border-color: #e07b30;
    }
  }
}

/* 右侧面板 */
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
