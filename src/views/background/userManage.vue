<script setup>
import { ref, computed, getCurrentInstance, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh, Lock, User, Postcard } from '@element-plus/icons-vue'

const { proxy } = getCurrentInstance()

// 搜索条件
const searchForm = ref ({
    status: '全部',
    userName: "",
    nickName: ''
})

// 用户列表数据
const userList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const totalPages = ref(0)
const jumpPage = ref(1)

// 加载用户列表
const loadUserList = async () => {
    try {
        const params = {
            status: searchForm.value.status,
            userName: searchForm.value.userName,
            nickName: searchForm.value.nickName,
            pageIndex: currentPage.value,
            numPerPage: pageSize.value
        }

        const data = await proxy.$userManageApi.getUserList(params)
        userList.value = data.userList
        totalPages.value = data.totalPageNum
        jumpPage.value = currentPage.value
    } catch (error) {
        ElMessage.error('获取用户列表失败')
        console.error(error)
    }
}

// 搜索按钮点击
const handleSearch = () => {
    currentPage.value = 1
    loadUserList()
}

// 重置搜索条件
const handleReset = () => {
    searchForm.value = {
        status: '全部',
        userName: '',
        nickName: ''
    }
    currentPage.value = 1
    loadUserList()
}

const confirmDialogVisible = ref(false)
const confirmDialogType = ref('freeze')
const confirmLoading = ref(false)
const pendingUser = ref(null)

const confirmDialogTitle = computed(() => confirmDialogType.value === 'freeze' ? '冻结账号' : '解冻账号')
const confirmDialogMessage = computed(() => {
    if (!pendingUser.value) return ''
    const actionText = confirmDialogType.value === 'freeze' ? '冻结' : '解冻'
    return `确定要${actionText}用户「${pendingUser.value.nickName}」吗？`
})

const openConfirmDialog = (type, row) => {
    pendingUser.value = row
    confirmDialogType.value = type
    confirmDialogVisible.value = true
}

// 冻结用户账号
const handleFreezeAccount = (row) => {
    if (row.status === '冻结') {
        ElMessage.warning('该用户已处于冻结状态')
        return
    }
    openConfirmDialog('freeze', row)
}

// 解冻用户账号
const handleDefrostAccount = (row) => {
    if (row.status === '启用') {
        ElMessage.warning('该用户已处于启用状态')
        return
    }
    openConfirmDialog('defrost', row)
}

const closeConfirmDialog = () => {
    if (confirmLoading.value) return
    confirmDialogVisible.value = false
    pendingUser.value = null
}

const handleConfirmAction = async () => {
    if (!pendingUser.value) return
    confirmLoading.value = true
    try {
        if (confirmDialogType.value === 'freeze') {
            await proxy.$userManageApi.freezeAccount(pendingUser.value.userName)
            pendingUser.value.status = '冻结'
            ElMessage.success('冻结成功')
        } else {
            await proxy.$userManageApi.defrostAccount(pendingUser.value.userName)
            pendingUser.value.status = '启用'
            ElMessage.success('解冻成功')
        }
        closeConfirmDialog()
    } catch (error) {
        ElMessage.error('操作失败')
        console.error(error)
    } finally {
        confirmLoading.value = false
    }
}

// 分页改变
const handlePageChange = (page) => {
    currentPage.value = page
    jumpPage.value = page
    loadUserList()
}

const handleJumpToPage = () => {
    if (totalPages.value === 0) return
    let target = Number(jumpPage.value)
    if (!target || target < 1) target = 1
    if (target > totalPages.value) target = totalPages.value
    if (target === currentPage.value) {
        jumpPage.value = target
        return
    }
    currentPage.value = target
    jumpPage.value = target
    loadUserList()
}

// 页面加载时获取数据
onMounted(() => {
    loadUserList()
})
</script>


<template>
    <div class="user-manage-container">
        <!-- 搜索区域 -->
        <el-card class="search-card" shadow="hover">
            <el-form :model="searchForm" class="search-form">
                <el-form-item label="状态">
                    <el-select v-model="searchForm.status" placeholder="请选择状态" style="width: 140px">
                        <el-option label="全部" value="全部"></el-option>
                        <el-option label="启用" value="启用">
                            <span style="color: #67C23A">● 启用</span>
                        </el-option>
                        <el-option label="冻结" value="冻结">
                            <span style="color: #F56C6C">● 冻结</span>
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="用户名">
                    <el-input
                        v-model="searchForm.userName"
                        placeholder="请输入用户名"
                        clearable
                        :prefix-icon="User"
                        style="width: 220px"
                    />
                </el-form-item>

                <el-form-item label="昵称">
                    <el-input
                        v-model="searchForm.nickName"
                        placeholder="请输入昵称"
                        clearable
                        :prefix-icon="Postcard"
                        style="width: 220px"
                    />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="handleSearch" :icon="Search">搜索</el-button>
                    <el-button @click="handleReset" :icon="Refresh">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <!-- 用户列表区域 -->
        <el-card class="table-card" shadow="hover">
            <template #header>
                <div class="card-header">
                    <span class="header-title">用户列表</span>
                    <el-button type="primary" link :icon="Refresh" @click="loadUserList">刷新</el-button>
                </div>
            </template>
            
            <el-table 
                :data="userList" 
                stripe 
                style="width: 100%"
                :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }"
            >
                <el-table-column prop="userName" label="用户名" min-width="150">
                    <template #default="{ row }">
                        <div class="user-cell">
                            <el-avatar :size="36" :src="row.avatarUrl" class="user-avatar">
                                <template #error>
                                    <el-icon :size="20"><User /></el-icon>
                                </template>
                            </el-avatar>
                            <span>{{ row.userName }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="nickName" label="昵称" min-width="150"/>
                <el-table-column prop="status" label="状态" width="120" align="center">
                    <template #default="{ row }">
                        <el-tag 
                            :type="row.status === '启用' ? 'success' : 'danger'"
                            effect="light"
                            round
                        >
                            {{  row.status }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="160" align="center">
                    <template #default="{ row }">
                        <el-button
                            v-if="row.status === '启用'"
                            type="danger"
                            link
                            size="small"
                            :icon="Lock"
                            @click="handleFreezeAccount(row)"
                        >冻结</el-button>

                        <el-button
                            v-else
                            type="primary"
                            link
                            size="small"
                            @click="handleDefrostAccount(row)"
                        >解冻</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <div class="pagination-container">
                <el-pagination
                    background
                    layout="slot, prev, pager, next"
                    :total="totalPages * pageSize"
                    :page-size="pageSize"
                    :current-page="currentPage"
                    @current-change="handlePageChange"
                    :pager-count="5"
                >
                    <template #default>
                        <div class="pagination-extra">
                            <span class="pagination-total">共 {{ totalPages || 0 }} 页</span>
                            <div class="pagination-jump" v-if="totalPages > 0">
                                <span>跳转到</span>
                                <el-input-number
                                    v-model="jumpPage"
                                    :min="1"
                                    :max="totalPages"
                                    :disabled="totalPages === 0"
                                    size="small"
                                />
                                <span>页</span>
                                <el-button size="small" type="primary" @click="handleJumpToPage" :disabled="totalPages === 0">确定</el-button>
                            </div>
                        </div>
                    </template>
                </el-pagination>
            </div>
        </el-card>

        <!-- 操作确认弹窗 -->
        <el-dialog
            v-model="confirmDialogVisible"
            :title="confirmDialogTitle"
            width="420px"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
        >
            <div class="confirm-content">{{ confirmDialogMessage }}</div>
            <template #footer>
                <el-button @click="closeConfirmDialog" :disabled="confirmLoading">取消</el-button>
                <el-button
                    type="primary"
                    @click="handleConfirmAction"
                    :loading="confirmLoading"
                >
                    {{ confirmDialogType === 'freeze' ? '确认' : '确认' }}
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>


<style scoped lang="less">
.user-manage-container {
    flex: 1;
    padding: 20px;
    background-color: #f5f7fa;
    min-height: 100vh;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow-x: hidden;
}

.search-card {
    border-radius: 8px;
    border: none;
    
    :deep(.el-card__body) {
        padding: 20px 30px;
    }
}

.search-form {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
}

.search-form .el-form-item {
    margin-bottom: 0;
}

.table-card {
    flex: 1;
    border-radius: 8px;
    border: none;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    :deep(.el-card__body) {
        padding: 0;
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow-x: auto;
    }

    :deep(.el-table) {
        min-width: 720px;
        width: 100%;
        table-layout: auto;
    }

    /* 表格单元格允许换行，避免横向滚动 */
    :deep(.el-table .cell) {
        white-space: normal;
        word-break: break-word;
        line-height: 1.4;
    }
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 0;
}

.header-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    position: relative;
    padding-left: 12px;
    
    &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 16px;
        background-color: #409EFF;
        border-radius: 2px;
    }
}

.user-cell {
    display: flex;
    align-items: center;
    gap: 10px;
}

.user-avatar-small {
    background-color: #409EFF;
}

.pagination-container {
    display: flex;
    justify-content: center;
    padding: 20px 24px;
    background-color: #fff;
    border-top: 1px solid #ebeef5;
}

.pagination-extra {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
    margin-right: 16px;
    color: #606266;
}

.pagination-total {
    font-size: 14px;
}

.pagination-jump {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
}

.confirm-content {
    font-size: 16px;
    color: #303133;
    padding: 10px 0;
}

:deep(.el-form-item) {
    margin-bottom: 0;
    margin-right: 0;
}

:deep(.el-table) {
    flex: 1;
    
    th.el-table__cell {
        background-color: #f5f7fa !important;
    }
}

/* Dialog Styles */
:deep(.desc-label) {
    background-color: #f5f7fa !important;
    width: 120px;
    font-weight: 600;
    color: #606266;
}

:deep(.el-dialog__header) {
    margin-right: 0;
    border-bottom: 1px solid #ebeef5;
    padding: 20px 24px;
}

:deep(.el-dialog__body) {
    padding: 24px;
}

:deep(.el-dialog__footer) {
    border-top: 1px solid #ebeef5;
    padding: 16px 24px;
}
</style>

