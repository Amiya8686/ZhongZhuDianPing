<script setup>
import { reactive, getCurrentInstance, onMounted } from 'vue'
import { User, TrendCharts, Edit, Shop } from '@element-plus/icons-vue'

const { proxy } = getCurrentInstance()

// 管理员信息
const adminInfo = reactive({
    ID: "",
    name: "",
    permission: "",
    avatarUrl: "",
})

// 获取当前登录的管理员信息
const getAdminInfo = async () => {
    try {
        const data = await proxy.$adminApi.getAdminInfo()
        adminInfo.ID = data.ID
        adminInfo.name = data.name
        adminInfo.permission = data.permission
        adminInfo.avatarUrl = data.avatarUrl
    } catch (error) {
        console.error(error)
        ElMessage.error('获取管理员信息失败')
    }
}

onMounted(() => {
    getAdminInfo()
})
</script>

<template>
    <div class="home-container">
        <!-- 管理员信息卡片 -->
        <div class="admin-card-wrapper">
            <el-card class="admin-card" shadow="hover">
                <div class="admin-info">
                    <div class="avatar-wrapper">
                        <div class="avatar-glow"></div>
                        <el-avatar :src="adminInfo.avatarUrl" :size="140" class="admin-avatar">
                            <template #error>
                                <el-icon :size="70"><User /></el-icon>
                            </template>
                        </el-avatar>
                    </div>
                    <div class="welcome-text">欢迎回来</div>
                    <div class="admin-name">{{ adminInfo.name }}</div>
                    <div class="info-grid">
                        <div class="info-box">
                            <div class="info-label">管理员 ID</div>
                            <div class="info-value">{{ adminInfo.ID }}</div>
                        </div>
                        <div class="info-box">
                            <div class="info-label">权限等级</div>
                            <el-tag 
                                :type="adminInfo.permission === '超级管理员' ? 'danger' : 'primary'"
                                effect="dark"
                                size="large"
                                class="permission-tag"
                            >
                                {{ adminInfo.permission }}
                            </el-tag>
                        </div>
                    </div>
                </div>
            </el-card>
        </div>

        <!-- 功能卡片区域 -->
        <div class="feature-cards">
            <!-- 用户日活查看卡片 -->
            <el-card class="feature-card user-card" shadow="hover">
                <div class="feature-content">
                    <div class="feature-icon">
                        <el-icon :size="60"><TrendCharts /></el-icon>
                    </div>
                    <h3 class="feature-title">用户日活查看</h3>
                    <div class="feature-stats">
                        <div class="stat-item">
                            <div class="stat-value">---</div>
                            <div class="stat-label">今日活跃</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">---</div>
                            <div class="stat-label">总用户数</div>
                        </div>
                    </div>
                </div>
            </el-card>

            <!-- 编辑老唐严选卡片 -->
            <el-card class="feature-card edit-card" shadow="hover">
                <div class="feature-content">
                    <div class="feature-icon">
                        <el-icon :size="60"><Edit /></el-icon>
                    </div>
                    <h3 class="feature-title">编辑老唐严选</h3>
                    <div class="feature-desc">
                        <p>管理精选推荐</p>
                        <p>打造优质内容</p>
                    </div>
                </div>
            </el-card>

            <!-- 档口信息查看卡片 -->
            <el-card class="feature-card stall-card" shadow="hover">
                <div class="feature-content">
                    <div class="feature-icon">
                        <el-icon :size="60"><Shop /></el-icon>
                    </div>
                    <h3 class="feature-title">档口信息查看</h3>
                    <div class="feature-stats">
                        <div class="stat-item">
                            <div class="stat-value">---</div>
                            <div class="stat-label">档口总数</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">---</div>
                            <div class="stat-label">菜品总数</div>
                        </div>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<style scoped lang="less">
.home-container {
    flex: 1;
    padding: 24px;
    background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
    box-sizing: border-box;
    display: flex;
    gap: 24px;
    overflow: hidden;
    height: calc(100vh - 60px);
}

// 管理员信息卡片区域
.admin-card-wrapper {
    width: 420px;
    flex-shrink: 0;
}

.admin-card {
    border-radius: 16px;
    border: none;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    height: 100%;
    overflow: visible;
    position: relative;

    &::before {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: linear-gradient(135deg, #667eea, #764ba2, #f093fb);
        border-radius: 16px;
        z-index: -1;
        opacity: 0;
        transition: opacity 0.3s;
    }

    &:hover::before {
        opacity: 0.7;
        animation: glow 2s ease-in-out infinite;
    }

    :deep(.el-card__body) {
        padding: 48px 32px;
        height: 100%;
    }
}

@keyframes glow {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
}

.admin-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
}

.avatar-wrapper {
    position: relative;
    margin-bottom: 8px;
}

.avatar-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 180px;
    height: 180px;
    background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
    border-radius: 50%;
    animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
    50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.8; }
}

.admin-avatar {
    position: relative;
    z-index: 1;
    border: 5px solid rgba(255, 255, 255, 0.4);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
    transition: all 0.3s;

    &:hover {
        transform: scale(1.05);
        box-shadow: 0 16px 50px rgba(0, 0, 0, 0.3);
    }
}

.welcome-text {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 400;
    letter-spacing: 1px;
}

.admin-name {
    font-size: 32px;
    font-weight: 700;
    color: white;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    margin-bottom: 8px;
}

.info-grid {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 8px;
}

.info-box {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px);
    padding: 20px 24px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    transition: all 0.3s;
    border: 1px solid rgba(255, 255, 255, 0.2);

    &:hover {
        background: rgba(255, 255, 255, 0.25);
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }
}

.info-label {
    font-size: 13px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.85);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.info-value {
    font-size: 20px;
    font-weight: 600;
    color: white;
}

.permission-tag {
    font-size: 16px;
    padding: 8px 16px;
    font-weight: 600;
}

// 功能卡片区域
.feature-cards {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
    min-height: 0;
}

.feature-card {
    flex: 1;
    border-radius: 16px;
    border: none;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
    min-height: 0;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0;
        transition: opacity 0.3s;
    }

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);

        &::before {
            opacity: 1;
        }

        .feature-icon {
            transform: scale(1.1) rotate(5deg);
        }
    }

    :deep(.el-card__body) {
        padding: 40px;
        height: 100%;
        position: relative;
        z-index: 1;
    }
}

// 用户日活卡片
.user-card {
    background: linear-gradient(135deg, #48c6ef 0%, #6f86d6 100%);

    &::before {
        background: linear-gradient(135deg, rgba(72, 198, 239, 0.3), rgba(111, 134, 214, 0.3));
    }
}

// 编辑卡片
.edit-card {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);

    &::before {
        background: linear-gradient(135deg, rgba(240, 147, 251, 0.3), rgba(245, 87, 108, 0.3));
    }
}

// 档口卡片
.stall-card {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);

    &::before {
        background: linear-gradient(135deg, rgba(79, 172, 254, 0.3), rgba(0, 242, 254, 0.3));
    }
}

.feature-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: white;
}

.feature-icon {
    margin-bottom: 20px;
    color: white;
    opacity: 0.95;
    transition: all 0.3s;
}

.feature-title {
    font-size: 28px;
    font-weight: 700;
    margin: 0 0 24px 0;
    color: white;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.feature-desc {
    text-align: center;
    
    p {
        font-size: 16px;
        color: rgba(255, 255, 255, 0.9);
        margin: 8px 0;
        font-weight: 500;
    }
}

.feature-stats {
    display: flex;
    gap: 40px;
    margin-top: 8px;
}

.stat-item {
    text-align: center;
}

.stat-value {
    font-size: 36px;
    font-weight: 700;
    color: white;
    margin-bottom: 8px;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.stat-label {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.85);
    font-weight: 500;
}

// 响应式设计
@media (max-width: 1400px) {
    .home-container {
        flex-direction: column;
    }

    .admin-card-wrapper {
        width: 100%;
    }

    .admin-card {
        :deep(.el-card__body) {
            padding: 40px 32px;
        }
    }

    .admin-info {
        flex-direction: row;
        justify-content: space-around;
        flex-wrap: wrap;
    }

    .info-grid {
        width: auto;
        flex-direction: row;
        gap: 20px;
    }
}

@media (max-width: 768px) {
    .home-container {
        padding: 16px;
        gap: 16px;
    }

    .admin-card {
        :deep(.el-card__body) {
            padding: 32px 24px;
        }
    }

    .admin-info {
        flex-direction: column;
    }

    .info-grid {
        flex-direction: column;
        width: 100%;
    }

    .feature-cards {
        gap: 16px;
    }

    .feature-card {
        :deep(.el-card__body) {
            padding: 32px 24px;
        }
    }

    .feature-title {
        font-size: 24px;
    }

    .stat-value {
        font-size: 28px;
    }

    .feature-stats {
        gap: 24px;
    }
}
</style>