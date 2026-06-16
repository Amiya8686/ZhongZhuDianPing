<script setup>
import { computed } from 'vue'
import FoodConsultantImg from '@/assets/imgs/magicWorkShop/FoodConsultant.svg'
import IntelligentCommentImg from '@/assets/imgs/magicWorkShop/IntelligentCommentGeneration.svg'
import StallAnalysisImg from '@/assets/imgs/magicWorkShop/StallIntelligentAnalysis.svg'

const props = defineProps({
  currentPage: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['select'])

const items = [
  {
    key: 'foodConsultant',
    label: '美食小顾问',
    image: FoodConsultantImg,
    desc: '智能问答Agent',
    path: '/magicWorkshop/foodConsultant.html'
  },
  {
    key: 'intelligentCommentGeneration',
    label: '魔法评论熔炼锅',
    image: IntelligentCommentImg,
    desc: '生成魔法评论的小锅',
    path: '/magicWorkshop/intelligentCommentGeneration.html'
  },
  {
    key: 'stallIntelligentAnalysis',
    label: '食堂探长评析局',
    image: StallAnalysisImg,
    desc: '探长正在评审档口',
    path: '/magicWorkshop/stallIntelligentAnalysis.html'
  }
]

const handleClick = (item) => {
  if (item.key === props.currentPage) return
  window.location.href = item.path
}
</script>

<template>
  <div class="selector-panel">
    <h3 class="selector-title">✨ 其它美食魔法师</h3>
    <div class="selector-list">
      <button
        v-for="item in items"
        :key="item.key"
        class="selector-btn"
        :class="{ active: currentPage === item.key }"
        @click="handleClick(item)"
      >
        <img :src="item.image" class="btn-image" />
        <span class="btn-content">
          <span class="btn-label">{{ item.label }}</span>
          <span class="btn-desc">{{ item.desc }}</span>
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped lang="less">
.selector-panel {
  background: white;
  border-radius: 20px;
  padding: 24px 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.selector-title {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin: 0 0 20px 0;
  text-align: center;
}

.selector-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.selector-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #f0f0f0;
  border-radius: 14px;
  background: #fafafa;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
  text-align: left;

  &:hover {
    border-color: #ff8e3c;
    background: #fff7f0;
    transform: translateX(4px);
  }

  &.active {
    border-color: #ff8e3c;
    background: linear-gradient(135deg, #fff3e6 0%, #ffe8d6 100%);
    cursor: default;
    box-shadow: 0 2px 8px rgba(255, 142, 60, 0.15);

    .btn-label {
      color: #e07b30;
    }
  }

  .btn-image {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    object-fit: cover;
    flex-shrink: 0;
  }

  .btn-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;

    .btn-label {
      font-size: 15px;
      font-weight: 700;
      color: #333;
    }

    .btn-desc {
      font-size: 12px;
      color: #999;
    }
  }
}
</style>
