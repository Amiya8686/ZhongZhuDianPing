<script setup>
import { ref, computed, getCurrentInstance, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowDown, CircleCheck, Refresh, Search, TrendCharts, Warning } from '@element-plus/icons-vue'
import IconImg from '@/assets/imgs/icon/icon.svg'
import StallAnalysisImg from '@/assets/imgs/magicWorkShop/StallIntelligentAnalysis.png'
import MagicWorkShopTime from '@/components/magicWorkShopTime.vue'
import MagicWorkShopSelector from '@/components/magicWorkShopSelector.vue'

const { proxy } = getCurrentInstance()

const isShowBody = ref(false)
const isLoadingStalls = ref(false)
const stallPopoverVisible = ref(false)
const analysisLoading = ref(false)
const analysisError = ref('')
const analysisResult = ref(null)
const lastAnalysisStallID = ref(null)

const userInfo = ref({
  username: '',
  nickName: '',
  avatar: ''
})

const stallList = ref([])
const currentStall = ref(null)

const hasAnalysis = computed(() => Boolean(analysisResult.value))
const isGeneratedAnalysis = computed(() => hasAnalysis.value)

const positiveKeywords = computed(() => analysisResult.value?.positiveKeywords || [])
const negativeKeywords = computed(() => analysisResult.value?.negativeKeywords || [])
const advantages = computed(() => analysisResult.value?.advantages || [])
const disadvantages = computed(() => analysisResult.value?.disadvantages || [])
const summaryComment = computed(() => analysisResult.value?.comment || '')

const emptyAnalysisText = {
  positiveKeywords: ['口味表现', '招牌特色', '用餐体验', '服务态度', '出餐效率', '价格感受', '分量感受', '食材口感', '搭配丰富', '复购意愿', '整体印象', '推荐指数', '校园口碑', '就餐便利'],
  negativeKeywords: ['口味波动', '排队体验', '出餐等待', '饮品状态', '价格争议', '分量争议', '服务细节', '高峰拥挤', '卫生印象', '菜品稳定', '搭配不足', '复购顾虑', '体验落差', '改进空间'],
  advantages: ['当前评论更偏向正面体验，可从口味、分量和服务继续观察'],
  disadvantages: ['当前吐槽点不集中，可重点留意出餐、饮品和服务细节']
}

const lowValueAnalysisPattern = /样本|数据不足|评论不足|更多样本|等待好评|继续观察|待补充|用户反馈少|评分待观察|后续更新|继续收集|可信度有限|分析可信度|口碑积累中|推荐待验证|风险待验证/

const keywordExpansionRules = [
  { test: /汉堡|肉饼|芝士|面包|薯条|套餐/, words: ['汉堡扎实', '肉饼厚实', '芝士香浓', '面包松软', '薯条脆爽', '套餐搭配', '饱腹感强', '快餐友好'] },
  { test: /可乐|饮料|汽水|没气|气泡/, words: ['可乐没气', '饮品状态', '气泡不足', '套餐饮品', '饮料体验', '出品细节', '口感落差', '饮品稳定'] },
  { test: /好吃|口味|味道|香|鲜|辣|咸|甜/, words: ['口味在线', '香气明显', '调味顺口', '入口满足', '风味稳定', '味道讨喜', '下饭友好', '口感丰富'] },
  { test: /态度|服务|老板|阿姨|热情/, words: ['服务态度好', '沟通顺畅', '响应及时', '体验亲切', '服务稳定', '态度加分'] },
  { test: /性价比|价格|便宜|实惠|贵/, words: ['性价比高', '价格友好', '花费可控', '学生友好', '实惠选择', '预算友好'] },
  { test: /分量|份量|饱|足|多|少/, words: ['分量扎实', '饱腹感强', '份量稳定', '吃得满足', '主食充足', '配料实在'] },
  { test: /排队|等待|慢|出餐|高峰/, words: ['高峰等待', '出餐节奏', '排队体验', '效率波动', '等待偏久', '动线拥挤'] }
]

const tokenVerify = async () => {
  try {
    await proxy.$tokenApi.checkToken()
    isShowBody.value = true
    return true
  } catch (error) {
    console.log(error)
    return false
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

const getQueryParam = (name) => {
  const searchParams = new URLSearchParams(globalThis.location.search)
  return searchParams.get(name)
}

const resetAnalysis = () => {
  analysisResult.value = null
  analysisError.value = ''
  lastAnalysisStallID.value = null
}

const clearAnalysis = () => {
  analysisResult.value = null
  analysisError.value = ''
  lastAnalysisStallID.value = null
}

const normalizeStall = (stall) => {
  return {
    stallID: stall.stallID ?? stall.ID ?? stall.id,
    stallName: stall.stallName ?? stall.name ?? '未知档口',
    stallPicture: stall.stallPicture ?? stall.pictureUrl ?? stall.dishPicture ?? StallAnalysisImg,
    canteenName: stall.canteenName ?? stall.canteetName ?? stall.canteent ?? stall.canteen ?? '未知饭堂',
    rating: stall.rating ?? stall.score ?? '',
    meanPrice: stall.meanPrice ?? stall.averagePrice ?? stall.price ?? '',
    type: stall.type ?? ''
  }
}

const loadStallList = async (refresh = false) => {
  isLoadingStalls.value = true
  try {
    const params = {}
    if (!refresh) {
      const stallID = getQueryParam('stallID')
      if (stallID) {
        params.stallID = stallID
      }
    }

    const data = await proxy.$agentApi.getStallList(params)
    const list = data.stallList || data.stalls || []
    stallList.value = list.map(normalizeStall)
    currentStall.value = stallList.value[0] || null
    resetAnalysis()

    if (!currentStall.value) {
      ElMessage.warning('暂无可评析的档口数据')
    }
  } catch (error) {
    console.error('获取档口列表失败:', error)
    ElMessage.error('获取档口列表失败')
  } finally {
    isLoadingStalls.value = false
  }
}

const selectStall = (stall) => {
  currentStall.value = stall
  stallPopoverVisible.value = false
  resetAnalysis()
}

const refreshStallList = () => {
  loadStallList(true)
}

const normalizeTextItem = (item) => {
  if (item === undefined || item === null) return ''
  if (typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean') {
    return String(item).trim()
  }
  if (typeof item === 'object') {
    const directValue = item.text ?? item.word ?? item.keyword ?? item.name ?? item.label
      ?? item.title ?? item.content ?? item.summary ?? item.value
    if (directValue !== undefined && directValue !== null && typeof directValue !== 'object') {
      return String(directValue).trim()
    }
    const scalarValue = Object.values(item).find(
      value => typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
    )
    return scalarValue === undefined ? '' : String(scalarValue).trim()
  }
  return String(item).trim()
}

const isUsefulAnalysisText = (text) => {
  const normalizedText = normalizeTextItem(text)
  return normalizedText && !lowValueAnalysisPattern.test(normalizedText)
}

const cleanSummaryComment = (text) => {
  return normalizeTextItem(text)
    .replace(/由于?样本量?较少[，,、]?\s*分析可信度有限。?/g, '')
    .replace(/样本量?较少[，,、]?\s*分析可信度有限。?/g, '')
    .replace(/由于?评论数量?较少[，,、]?\s*分析可信度有限。?/g, '')
    .replace(/请等待更多用户评价。?/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

const normalizeArray = (value, fallback = []) => {
  if (Array.isArray(value)) {
    const list = value.map(normalizeTextItem).filter(isUsefulAnalysisText)
    return list.length ? list : fallback
  }
  if (typeof value === 'string') {
    const text = value.trim()
    if (!text) return fallback
    if ((text.startsWith('[') && text.endsWith(']')) || (text.startsWith('{') && text.endsWith('}'))) {
      try {
        return normalizeArray(JSON.parse(text), fallback)
      } catch (error) {
        // Dify 有时会返回普通字符串，这里解析失败就按分隔符拆词。
      }
    }
    const list = text.split(/[,，、\n]/).map(item => item.trim()).filter(isUsefulAnalysisText)
    return list.length ? list : fallback
  }
  if (value && typeof value === 'object') {
    const directText = normalizeTextItem(value)
    if (directText) return [directText]
    const list = Object.values(value).flatMap(item => normalizeArray(item, [])).filter(isUsefulAnalysisText)
    return list.length ? list : fallback
  }
  return fallback
}

const ensureList = (list, fallback) => (Array.isArray(list) && list.length ? list : fallback)

const expandKeywordList = (list, fallback, limit = 18) => {
  const seen = new Set()
  const expanded = []
  const append = (items) => {
    normalizeArray(items, []).forEach((item) => {
      const word = normalizeTextItem(item)
      if (isUsefulAnalysisText(word) && !seen.has(word)) {
        seen.add(word)
        expanded.push(word)
      }
    })
  }

  append(list)
  expanded.slice().forEach((word) => {
    keywordExpansionRules.forEach((rule) => {
      if (rule.test.test(word)) {
        append(rule.words)
      }
    })
  })
  if (expanded.length < limit) {
    append(fallback)
  }
  return expanded.slice(0, limit)
}

const pickValue = (data, ...keys) => {
  for (const key of keys) {
    const value = data[key] ?? data[`${key}:`]
    if (value !== undefined && value !== null) {
      return value
    }
  }
  return null
}

const pickWordcloudByPolarity = (wordcloud, polarity) => {
  if (!Array.isArray(wordcloud)) return []
  const pattern = polarity === 'positive'
    ? /positive|good|advantage|like|赞|优|正|种草/
    : /negative|bad|disadvantage|complaint|吐槽|槽|差|负|避雷/
  return normalizeArray(wordcloud.filter((item) => {
    if (!item || typeof item !== 'object') return false
    const tag = String(item.type ?? item.sentiment ?? item.category ?? item.polarity ?? item.group ?? '')
    return pattern.test(tag)
  }), [])
}

const normalizeAnalysisResult = (data) => {
  const wordcloud = pickValue(data, 'wordcloud', 'wordCloud') || {}
  const positiveWordcloud = Array.isArray(wordcloud)
    ? pickWordcloudByPolarity(wordcloud, 'positive')
    : normalizeArray(wordcloud.positive || wordcloud.advantages || wordcloud.good || [], [])
  const negativeWordcloud = Array.isArray(wordcloud)
    ? pickWordcloudByPolarity(wordcloud, 'negative')
    : normalizeArray(wordcloud.negative || wordcloud.disadvantages || wordcloud.bad || [], [])
  const flatWordcloud = Array.isArray(wordcloud) ? normalizeArray(wordcloud, []) : []
  const advantageItems = normalizeArray(pickValue(data, 'advantages', 'pros', 'goodPoints', 'good_points'), [])
  const disadvantageItems = normalizeArray(pickValue(data, 'disadvantages', 'cons', 'badPoints', 'bad_points'), [])

  const positive = ensureList(
    normalizeArray(
      pickValue(data, 'positiveKeywords', 'positive_keywords', 'goodKeywords', 'good_keywords') ?? positiveWordcloud,
      []
    ),
    ensureList(positiveWordcloud, ensureList(advantageItems, ensureList(flatWordcloud, emptyAnalysisText.positiveKeywords)))
  )
  const negative = ensureList(
    normalizeArray(
      pickValue(data, 'negativeKeywords', 'negative_keywords', 'badKeywords', 'bad_keywords') ?? negativeWordcloud,
      []
    ),
    ensureList(negativeWordcloud, ensureList(disadvantageItems, emptyAnalysisText.negativeKeywords))
  )
  const expandedPositive = expandKeywordList(positive, emptyAnalysisText.positiveKeywords)
  const expandedNegative = expandKeywordList(negative, emptyAnalysisText.negativeKeywords)
  const goodPoints = ensureList(advantageItems, ensureList(expandedPositive.slice(0, 3), emptyAnalysisText.advantages))
  const badPoints = ensureList(disadvantageItems, ensureList(expandedNegative.slice(0, 3), emptyAnalysisText.disadvantages))
  const comment = cleanSummaryComment(
    pickValue(data, 'comment', 'summary', 'analysis', 'overall_summary', 'overallSummary')
  )

  return {
    positiveKeywords: expandedPositive,
    negativeKeywords: expandedNegative,
    advantages: goodPoints.slice(0, 4),
    disadvantages: badPoints.slice(0, 4),
    comment: comment || '该店铺暂无用户评论，样本量为0，无法进行有效分析，请等待更多用户评价。'
  }
}

const loadStallEvidence = async () => {
  const stallID = currentStall.value?.stallID
  let detail = {}
  let comments = []

  try {
    detail = await proxy.$foodApi.getStallInfo({ stallID })
  } catch (error) {
    console.warn('获取档口详情失败，将使用当前档口卡片信息:', error)
  }

  try {
    const commentData = await proxy.$foodApi.getStallCommentList({
      stallID,
      numPerPage: 30,
      pageIndex: 1
    })
    comments = commentData.commentList || []
  } catch (error) {
    console.warn('获取档口评论失败，将使用空评论列表:', error)
  }

  const rating = currentStall.value.rating || detail.rating || '暂无评分'
  const normalizedComments = comments.map((comment) => ({
    rating: comment.rating ?? '',
    content: comment.content ?? '',
    like: comment.like ?? 0,
    reviewerName: comment.reviewerName ?? comment.userName ?? '',
    dateTime: comment.dateTime ?? comment.createTime ?? ''
  })).filter(comment => comment.content || comment.rating)

  return {
    stall_name: currentStall.value.stallName,
    rating: String(rating),
    comments_json: JSON.stringify({
      stallID,
      stallName: currentStall.value.stallName,
      canteenName: currentStall.value.canteenName,
      rating: String(rating),
      comments: normalizedComments,
      outputRequirements: {
        style: '像校园美食点评，不要像数据报告',
        avoid: ['样本量较少', '可信度有限', '数据不足', '需要更多样本', '等待更多评价', '无法有效分析'],
        comment: '直接基于已有评论给出自然、具体、有判断力的综合口碑点评。',
        keywords: 'positiveKeywords 和 negativeKeywords 尽量各给 12 到 18 个具体短词。若负向评论少，也围绕真实槽点做同义扩展，不要补统计提示词。',
        jsonOnly: true
      }
    }).slice(0, 19000)
  }
}

const generateAnalysis = async () => {
  if (!currentStall.value) {
    ElMessage.warning('请先选择一个档口')
    return
  }

  analysisLoading.value = true
  analysisError.value = ''
  analysisResult.value = null

  try {
    const payload = {
      stallID: currentStall.value.stallID,
      stallName: currentStall.value.stallName,
      canteenName: currentStall.value.canteenName
    }
    const inputs = await loadStallEvidence()
    const result = await proxy.$difyApi.stallAnalysisService(payload, inputs)
    analysisResult.value = normalizeAnalysisResult(result.data || {})
    lastAnalysisStallID.value = currentStall.value.stallID
    ElMessage.success('档口评析已生成')
  } catch (error) {
    console.error('智能档口评析失败:', error)
    analysisError.value = error?.message || String(error) || '智能档口评析失败'
    ElMessage.error('智能档口评析失败')
  } finally {
    analysisLoading.value = false
  }
}

const keywordSizeClass = (index) => {
  const sizeMap = ['size-xl', 'size-md', 'size-lg', 'size-sm', 'size-md', 'size-lg', 'size-sm', 'size-md']
  return sizeMap[index % sizeMap.length]
}

const keywordToneClass = (index) => `tone-${index % 5}`

const copyAnalysis = async () => {
  if (!analysisResult.value || !isGeneratedAnalysis.value) return
  const text = [
    `档口：${currentStall.value?.stallName || ''}`,
    `优点：${advantages.value.join('、')}`,
    `缺点：${disadvantages.value.join('、')}`,
    `综合点评：${summaryComment.value}`
  ].join('\n')
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('评析内容已复制')
  } catch (error) {
    ElMessage.error('复制失败，请手动选择文本复制')
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

onMounted(async () => {
  const isTokenValid = await tokenVerify()
  if (!isTokenValid) return
  loadUserInfo()
  loadStallList()
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

    <div class="main-content">
      <div class="main-canvas">
        <div class="analysis-panel">
          <div class="stall-selector-bar">
            <div class="current-stall" v-if="currentStall">
              <el-image
                :src="currentStall.stallPicture"
                :preview-src-list="[currentStall.stallPicture]"
                fit="cover"
                class="current-stall-img"
              />
              <div class="current-stall-info">
                <span class="current-stall-name">{{ currentStall.stallName }}</span>
                <span class="current-stall-meta">
                  {{ currentStall.canteenName }}
                  <span v-if="currentStall.type"> · {{ currentStall.type }}</span>
                </span>
                <span class="current-stall-extra" v-if="currentStall.rating || currentStall.meanPrice">
                  <span v-if="currentStall.rating">评分 {{ currentStall.rating }}</span>
                  <span v-if="currentStall.meanPrice">￥{{ currentStall.meanPrice }}/人</span>
                </span>
              </div>
            </div>
            <div class="current-stall-empty" v-else>
              <span>暂无档口数据</span>
            </div>

            <div class="selector-actions">
              <el-popover
                v-model:visible="stallPopoverVisible"
                placement="bottom-end"
                :width="540"
                trigger="click"
              >
                <template #reference>
                  <el-button type="primary" size="large" class="select-stall-btn" :loading="isLoadingStalls">
                    <el-icon v-if="!isLoadingStalls"><Search /></el-icon>
                    选择档口
                  </el-button>
                </template>
                <div class="popover-stall-panel">
                  <div class="popover-stall-header">
                    <span class="popover-stall-title">选择档口</span>
                    <el-button size="small" @click="refreshStallList" class="refresh-btn" :loading="isLoadingStalls">
                      <el-icon v-if="!isLoadingStalls"><Refresh /></el-icon>
                      换一批档口
                    </el-button>
                  </div>
                  <div class="popover-stall-grid">
                    <button
                      v-for="stall in stallList"
                      :key="stall.stallID"
                      class="popover-stall-card"
                      :class="{ active: currentStall && currentStall.stallID === stall.stallID }"
                      @click="selectStall(stall)"
                    >
                      <img :src="stall.stallPicture" class="popover-stall-img" />
                      <span class="popover-stall-name">{{ stall.stallName }}</span>
                      <span class="popover-stall-canteen">{{ stall.canteenName }}</span>
                    </button>
                  </div>
                </div>
              </el-popover>

              <el-button
                v-if="isGeneratedAnalysis"
                type="warning"
                size="large"
                class="analyze-btn"
                :disabled="!currentStall"
                :loading="analysisLoading"
                @click="generateAnalysis"
              >
                <el-icon v-if="!analysisLoading"><TrendCharts /></el-icon>
                重新生成评析
              </el-button>
            </div>
          </div>

          <div class="analysis-content">
            <div class="generate-ready-state" v-if="!isGeneratedAnalysis && !analysisLoading">
              <img :src="StallAnalysisImg" class="empty-img" />
              <h2>食堂探长评析局</h2>
              <div class="generate-center-action" v-if="currentStall">
                <el-button
                  type="warning"
                  size="large"
                  class="center-analyze-btn"
                  @click="generateAnalysis"
                >
                  <el-icon><TrendCharts /></el-icon>
                  生成评析
                </el-button>
                <span>点击生成 AI 口碑评析</span>
              </div>
              <p v-else>先选择一个档口，探长会把评论里的夸赞和吐槽拆成两张关键词云。</p>
            </div>

            <div class="loading-state" v-if="analysisLoading">
              <el-skeleton :rows="8" animated />
              <p>探长正在翻阅评论和菜品线索...</p>
            </div>

            <el-alert
              v-if="analysisError && !analysisLoading"
              class="analysis-alert"
              type="error"
              :title="analysisError"
              show-icon
              :closable="false"
            />

            <div class="result-board" v-if="isGeneratedAnalysis && !analysisLoading">
              <div class="board-header">
                <div>
                  <span class="board-kicker">AI 口碑雷达</span>
                  <h2>{{ currentStall?.stallName }} 档口评析</h2>
                </div>
                <el-tag :type="isGeneratedAnalysis ? 'warning' : 'info'" effect="light">
                  {{ isGeneratedAnalysis ? '已生成' : '待生成' }}
                </el-tag>
              </div>

              <div class="word-cloud-row">
                <section class="word-card negative-card">
                  <div class="word-card-title">
                    <el-icon><Warning /></el-icon>
                    避雷/吐槽热点词云
                    <span>AI 负向总结</span>
                  </div>
                  <div class="word-cloud">
                    <span
                      v-for="(word, index) in negativeKeywords"
                      :key="`negative-${word}-${index}`"
                      class="word-chip negative-word"
                      :class="[keywordSizeClass(index), keywordToneClass(index)]"
                    >
                      {{ word }}
                    </span>
                    <span v-if="!negativeKeywords.length" class="word-chip word-empty">暂无关键词</span>
                  </div>
                </section>

                <div class="vs-badge">
                  <strong>VS</strong>
                  <span>口碑对照</span>
                </div>

                <section class="word-card positive-card">
                  <div class="word-card-title">
                    <el-icon><CircleCheck /></el-icon>
                    点赞/种草优点词云
                    <span>AI 正向总结</span>
                  </div>
                  <div class="word-cloud">
                    <span
                      v-for="(word, index) in positiveKeywords"
                      :key="`positive-${word}-${index}`"
                      class="word-chip positive-word"
                      :class="[keywordSizeClass(index), keywordToneClass(index)]"
                    >
                      {{ word }}
                    </span>
                    <span v-if="!positiveKeywords.length" class="word-chip word-empty">暂无关键词</span>
                  </div>
                </section>
              </div>

              <div class="insight-row">
                <div class="insight-card negative-insight">
                  <h3>主要缺点</h3>
                  <ul>
                    <li v-for="(item, index) in disadvantages" :key="`disadvantage-${index}`">{{ item }}</li>
                  </ul>
                </div>
                <div class="insight-card positive-insight">
                  <h3>主要优点</h3>
                  <ul>
                    <li v-for="(item, index) in advantages" :key="`advantage-${index}`">{{ item }}</li>
                  </ul>
                </div>
              </div>

              <div class="summary-card">
                <div class="summary-title">
                  <span>AI 综合口碑点评</span>
                  <el-button size="small" :disabled="!isGeneratedAnalysis" @click="copyAnalysis">复制评析</el-button>
                </div>
                <p>{{ summaryComment }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="side-panel">
        <MagicWorkShopTime />
        <MagicWorkShopSelector current-page="stallIntelligentAnalysis" />
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

.analysis-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.stall-selector-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  border-bottom: 1px solid #f0f0f0;
  gap: 20px;
  min-height: 116px;
}

.current-stall {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;

  .current-stall-img {
    width: 120px;
    height: 90px;
    border-radius: 12px;
    object-fit: cover;
    flex-shrink: 0;
  }

  .current-stall-info {
    display: flex;
    flex-direction: column;
    gap: 5px;
    min-width: 0;

    .current-stall-name {
      font-size: 22px;
      font-weight: 800;
      color: #333;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .current-stall-meta {
      font-size: 14px;
      color: #999;
    }

    .current-stall-extra {
      display: flex;
      gap: 12px;
      font-size: 15px;
      font-weight: 700;
      color: #ff8e3c;
    }
  }
}

.current-stall-empty {
  color: #aaa;
  font-size: 15px;
}

.selector-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.select-stall-btn,
.analyze-btn {
  border-radius: 10px;
  font-weight: 700;
}

.select-stall-btn {
  background: #ff8e3c;
  border-color: #ff8e3c;

  &:hover {
    background: #e07b30;
    border-color: #e07b30;
  }
}

.popover-stall-panel {
  .popover-stall-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;

    .popover-stall-title {
      font-size: 16px;
      font-weight: 700;
      color: #333;
    }
  }

  .popover-stall-grid {
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

  .popover-stall-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 7px;
    padding: 12px 8px;
    border: 2px solid #f0f0f0;
    border-radius: 12px;
    background: #fff;
    cursor: pointer;
    transition: all 0.3s;
    min-width: 0;

    &:hover {
      border-color: #ffbe76;
      background: #fff8f0;
      transform: translateY(-2px);
    }

    &.active {
      border-color: #ff8e3c;
      background: #fff3e6;
    }

    .popover-stall-img {
      width: 100%;
      height: 86px;
      border-radius: 8px;
      object-fit: cover;
    }

    .popover-stall-name,
    .popover-stall-canteen {
      width: 100%;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .popover-stall-name {
      font-size: 13px;
      font-weight: 700;
      color: #333;
    }

    .popover-stall-canteen {
      font-size: 12px;
      color: #999;
    }
  }
}

.analysis-content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 22px 24px 24px;
  background: #fbfcff;
}

.generate-ready-state {
  height: 100%;
  min-height: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  text-align: center;
  color: #777;

  .empty-img {
    width: 104px;
    height: 104px;
    border-radius: 24px;
    object-fit: cover;
    box-shadow: 0 12px 30px rgba(255, 142, 60, 0.18);
  }

  h2 {
    margin: 10px 0 0;
    color: #333;
    font-size: 26px;
  }

  p {
    max-width: 520px;
    margin: 0;
    font-size: 15px;
    line-height: 1.7;
  }
}

.generate-center-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 10px;

  span {
    color: #ff8e3c;
    font-size: 16px;
    font-weight: 800;
    line-height: 1.2;
  }
}

.center-analyze-btn {
  min-width: 136px;
  height: 44px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 800;
  box-shadow: 0 10px 22px rgba(230, 162, 60, 0.22);
}

.loading-state {
  max-width: 780px;
  margin: 70px auto 0;
  padding: 28px;
  background: white;
  border-radius: 16px;
  border: 1px solid #edf0f5;

  p {
    margin: 18px 0 0;
    color: #999;
    text-align: center;
    font-weight: 600;
  }
}

.analysis-alert {
  max-width: 720px;
  margin: 36px auto 0;
}

.result-board {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.board-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

  .board-kicker {
    display: inline-block;
    color: #ff8e3c;
    font-size: 13px;
    font-weight: 800;
    margin-bottom: 5px;
  }

  h2 {
    margin: 0;
    font-size: 24px;
    color: #222;
  }
}

.word-cloud-row {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 72px minmax(0, 1fr);
  gap: 18px;
  align-items: stretch;
}

.word-card {
  min-height: 300px;
  border-radius: 16px;
  padding: 20px;
  background: white;
  border: 1px solid #edf0f5;
  display: flex;
  flex-direction: column;
}

.negative-card {
  border-color: #ffd9d9;
  background: linear-gradient(180deg, #fff 0%, #fff8f8 100%);
}

.positive-card {
  border-color: #ccefdc;
  background: linear-gradient(180deg, #fff 0%, #f7fff9 100%);
}

.word-card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 800;
  color: #333;

  span {
    margin-left: auto;
    font-size: 12px;
    font-weight: 600;
    color: #aaa;
  }
}

.word-cloud {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: center;
  flex-wrap: wrap;
  gap: 12px 18px;
  padding: 22px 8px 4px;
}

.word-chip {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  font-weight: 800;
  line-height: 1.15;
  white-space: nowrap;
  transform-origin: center;
}

.negative-word {
  color: #f04d4d;
}

.positive-word {
  color: #12a866;
}

.word-empty {
  color: #a6adbb;
  font-size: 16px;
}

.size-xl {
  font-size: 30px;
}

.size-lg {
  font-size: 23px;
}

.size-md {
  font-size: 17px;
}

.size-sm {
  font-size: 13px;
}

.tone-0 {
  opacity: 0.96;
  transform: rotate(-6deg);
}

.tone-1 {
  opacity: 0.88;
  transform: rotate(3deg);
}

.tone-2 {
  opacity: 0.98;
  transform: rotate(0deg);
}

.tone-3 {
  opacity: 0.82;
  transform: rotate(-2deg);
}

.tone-4 {
  opacity: 0.9;
  transform: rotate(5deg);
}

.vs-badge {
  align-self: center;
  justify-self: center;
  width: 66px;
  height: 66px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ce9876, #7bc899);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);

  strong {
    font-size: 22px;
    line-height: 1;
  }

  span {
    font-size: 11px;
    margin-top: 4px;
  }
}

.insight-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.insight-card {
  background: white;
  border: 1px solid #edf0f5;
  border-radius: 14px;
  padding: 18px 20px;

  h3 {
    margin: 0 0 12px;
    font-size: 16px;
    color: #333;
  }

  ul {
    margin: 0;
    padding-left: 18px;
    color: #666;
    line-height: 1.9;
  }
}

.positive-insight {
  border-left: 4px solid #18b56f;
}

.negative-insight {
  border-left: 4px solid #f05d5d;
}

.summary-card {
  background: white;
  border: 1px solid #edf0f5;
  border-radius: 14px;
  padding: 18px 20px 20px;

  .summary-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 10px;

    span {
      font-size: 16px;
      font-weight: 800;
      color: #333;
    }
  }

  p {
    margin: 0;
    color: #4b5563;
    font-size: 15px;
    line-height: 1.9;
    white-space: pre-wrap;
    word-break: break-word;
  }
}

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

@media (max-width: 1100px) {
  .main-content {
    padding: 0 20px;
  }

  .word-cloud-row {
    grid-template-columns: 1fr;
  }

  .vs-badge {
    width: 58px;
    height: 58px;
  }
}

@media (max-width: 860px) {
  .top-bar {
    padding: 0 18px;
  }

  .nav-links {
    display: none;
  }

  .main-content {
    flex-direction: column;
    height: auto;
  }

  .side-panel {
    width: 100%;
  }

  .stall-selector-bar,
  .selector-actions,
  .current-stall {
    align-items: stretch;
    flex-direction: column;
  }

  .current-stall {
    .current-stall-img {
      width: 100%;
      height: 180px;
    }
  }

  .selector-actions {
    width: 100%;

    .el-button {
      width: 100%;
    }
  }

  .generate-center-action {
    flex-direction: column;
    gap: 10px;
  }

  .insight-row {
    grid-template-columns: 1fr;
  }
}
</style>
