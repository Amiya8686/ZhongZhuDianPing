<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const hourAngle = ref(0)
const minuteAngle = ref(0)
const secondAngle = ref(0)

let timer = null

const updateClock = () => {
  const now = new Date()
  const hours = now.getHours() % 12
  const minutes = now.getMinutes()
  const seconds = now.getSeconds()

  // 每秒 6°（360/60），时针叠加分钟偏移
  secondAngle.value = seconds * 6
  minuteAngle.value = minutes * 6 + seconds * 0.1
  hourAngle.value = hours * 30 + minutes * 0.5
}

onMounted(() => {
  updateClock()
  timer = setInterval(updateClock, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="clock-wrapper">
    <svg class="clock" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <!-- 表盘外圈 -->
      <circle cx="100" cy="100" r="95" fill="#fff" stroke="#ff8e3c" stroke-width="6" />

      <!-- 刻度 -->
      <g v-for="i in 12" :key="i">
        <line
          :x1="100 + 78 * Math.cos((i * 30 - 90) * Math.PI / 180)"
          :y1="100 + 78 * Math.sin((i * 30 - 90) * Math.PI / 180)"
          :x2="100 + 88 * Math.cos((i * 30 - 90) * Math.PI / 180)"
          :y2="100 + 88 * Math.sin((i * 30 - 90) * Math.PI / 180)"
          stroke="#ff8e3c"
          stroke-width="3"
          stroke-linecap="round"
        />
      </g>

      <!-- 数字 -->
      <g v-for="i in 12" :key="'num' + i">
        <text
          :x="100 + 68 * Math.cos((i * 30 - 90) * Math.PI / 180)"
          :y="100 + 68 * Math.sin((i * 30 - 90) * Math.PI / 180)"
          text-anchor="middle"
          dominant-baseline="central"
          fill="#5c3d2e"
          font-size="14"
          font-weight="700"
        >{{ i }}</text>
      </g>

      <!-- 时针 -->
      <line
        x1="100" y1="100"
        :x2="100 + 48 * Math.cos((hourAngle - 90) * Math.PI / 180)"
        :y2="100 + 48 * Math.sin((hourAngle - 90) * Math.PI / 180)"
        stroke="#5c3d2e"
        stroke-width="6"
        stroke-linecap="round"
      />

      <!-- 分针 -->
      <line
        x1="100" y1="100"
        :x2="100 + 65 * Math.cos((minuteAngle - 90) * Math.PI / 180)"
        :y2="100 + 65 * Math.sin((minuteAngle - 90) * Math.PI / 180)"
        stroke="#5c3d2e"
        stroke-width="4"
        stroke-linecap="round"
      />

      <!-- 秒针 -->
      <line
        x1="100" y1="100"
        :x2="100 + 75 * Math.cos((secondAngle - 90) * Math.PI / 180)"
        :y2="100 + 75 * Math.sin((secondAngle - 90) * Math.PI / 180)"
        stroke="#ff6b6b"
        stroke-width="2"
        stroke-linecap="round"
      />

      <!-- 中心圆点 -->
      <circle cx="100" cy="100" r="5" fill="#ff8e3c" />
    </svg>
  </div>
</template>

<style scoped lang="less">
.clock-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.clock {
  width: 200px;
  height: 200px;
  filter: drop-shadow(0 4px 12px rgba(255, 142, 60, 0.25));
  transition: filter 0.3s;

  &:hover {
    filter: drop-shadow(0 6px 18px rgba(255, 142, 60, 0.4));
  }
}
</style>
