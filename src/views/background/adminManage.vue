<script setup>
import { ref, computed, getCurrentInstance, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, UserFilled } from '@element-plus/icons-vue'

const { proxy } = getCurrentInstance()

// 搜索条件
const searchForm = ref({
    ID: '',
    name: '',
    permission: '全部'
})

// 管理员列表数据
const adminList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const totalPages = ref(0)

// 加载管理员列表
const loadAdminList = async () => {
    try {
        const params = {
            ID: searchForm.value.ID,
            name: searchForm.value.name,
            permission: searchForm.value.permission,
            pageIndex: currentPage.value,
            numPerPage: pageSize.value
        }

        const data = await proxy.$adminManageApi.getAdminList(params)
        adminList.value = data.adminList
        totalPages.value = data.totalPageNum
        currentPage.value = data.pageIndex || currentPage.value
    } catch (error) {
        ElMessage.error('获取管理员列表失败')
        console.error(error)
    }
}

// 搜索按钮点击
const handleSearch = () => {
    currentPage.value = 1
    loadAdminList()
}

// 重置搜索条件
const handleReset = () => {
    searchForm.value = {
        ID: '',
        name: '',
        permission: '全部'
    }
    currentPage.value = 1
    loadAdminList()
}

// 新增管理员对话框
const addDialogVisible = ref(false)
const addForm = ref({
    name: '',
    password: '',
    permission: '普通管理员'
})
const addFormRules = {
    name: [
        { required: true, message: '请输入姓名', trigger: 'blur' },
        { min: 1, max: 20, message: '姓名长度为1-20个字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度为6-20个字符', trigger: 'blur' }
    ],
    permission: [
        { required: true, message: '请选择权限', trigger: 'change' }
    ]
}
const addFormLoading = ref(false)

// 打开新增对话框
const handleAddAdmin = () => {
    addDialogVisible.value = true
}

// 关闭新增对话框
const closeAddDialog = () => {
    addDialogVisible.value = false
    proxy.$refs['addFormRef'].resetFields()
}

// 取消新增
const handleAddCancel = () => {
    proxy.$refs['addFormRef'].resetFields()
}

// 确认新增
const handleAddConfirm = () => {
    proxy.$refs['addFormRef'].validate(async (valid) => {
        if (valid) {
            addFormLoading.value = true
            try {
                await proxy.$adminManageApi.addAdmin(addForm.value)
                ElMessage.success('新增管理员成功')
                closeAddDialog()
                loadAdminList()
            } catch (error) {
                ElMessage.error(error || '新增管理员失败')
                console.error(error)
            } finally {
                addFormLoading.value = false
            }
        } else {
            ElMessage.warning('请正确填写管理员信息')
        }
    })
}

// 详情对话框
const detailDialogVisible = ref(false)
const detailAdmin = ref(null)

// 打开详情对话框
const handleViewDetail = (row) => {
    detailAdmin.value = { ...row }
    detailDialogVisible.value = true
}

// 关闭详情对话框
const closeDetailDialog = () => {
    detailDialogVisible.value = false
    detailAdmin.value = null
}

// 重置密码
const handleResetPassword = async () => {
    if (!detailAdmin.value) return
    try {
        const res = await proxy.$adminManageApi.resetAdminPassword({ ID: detailAdmin.value.ID })
        ElMessage.success(`已重置管理员「${detailAdmin.value.name}」的密码为：${res.newPassword}`)
        closeDetailDialog()
    } catch (error) {
        ElMessage.error(error || '重置密码失败')
        console.error(error)
    }
}

// 删除管理员
const handleDeleteAdmin = (row) => {
    ElMessageBox.confirm(
        `确定要删除管理员「${row.name}」吗？此操作不可恢复！`,
        '删除提醒',
        {
            type: 'warning',
            confirmButtonText: '确认删除',
            confirmButtonClass: 'el-button--danger',
            cancelButtonText: '取消',
            closeOnClickModal: false
        }
    ).then(async () => {
        try {
            await proxy.$adminManageApi.deleteAdmin({ ID: row.ID })
            ElMessage.success('删除成功')
            loadAdminList()
        } catch (error) {
            ElMessage.error(error || '删除失败')
            console.error(error)
        }
    }).catch(() => {
        // 用户取消删除
    })
}

// 分页改变
const handlePageChange = (page) => {
    currentPage.value = page
    loadAdminList()
}

// 页面加载时获取数据
onMounted(() => {
    loadAdminList()
})
</script>

<template>
    <div class="admin-manage-container">
        <!-- 搜索区域 -->
        <el-card class="search-card" shadow="hover">
            <el-form :model="searchForm" class="search-form">
                <el-form-item label="ID">
                    <el-input
                        v-model="searchForm.ID"
                        placeholder="请输入管理员ID"
                        clearable
                        style="width: 200px"
                    />
                </el-form-item>

                <el-form-item label="姓名">
                    <el-input
                        v-model="searchForm.name"
                        placeholder="请输入姓名"
                        clearable
                        style="width: 200px"
                    />
                </el-form-item>

                <el-form-item label="权限">
                    <el-select v-model="searchForm.permission" placeholder="请选择权限" style="width: 180px">
                        <el-option label="全部" value="全部"></el-option>
                        <el-option label="超级管理员" value="超级管理员">
                            <span style="color: #F56C6C">● 超级管理员</span>
                        </el-option>
                        <el-option label="普通管理员" value="普通管理员">
                            <span style="color: #409EFF">● 普通管理员</span>
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="handleSearch" :icon="Search">搜索</el-button>
                    <el-button @click="handleReset" :icon="Refresh">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <!-- 管理员列表区域 -->
        <el-card class="table-card" shadow="hover">
            <template #header>
                <div class="card-header">
                    <span class="header-title">管理员列表</span>
                    <div class="header-actions">
                        <el-button type="success" @click="handleAddAdmin">新增</el-button>
                        <el-button type="primary" link :icon="Refresh" @click="loadAdminList">刷新</el-button>
                    </div>
                </div>
            </template>
            
            <el-table 
                :data="adminList" 
                stripe 
                style="width: 100%"
                :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }"
            >
                <el-table-column prop="ID" label="ID" width="150" align="center" />
                <el-table-column prop="name" label="姓名" min-width="150" align="center">
                    <template #default="{ row }">
                        <div class="admin-cell">
                            <el-avatar :size="36" :src="row.avatarUrl" class="admin-avatar">
                                <template #error>
                                    <el-icon :size="20"><UserFilled /></el-icon>
                                </template>
                            </el-avatar>
                            <span>{{ row.name }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="permission" label="权限" width="150" align="center">
                    <template #default="{ row }">
                        <el-tag 
                            :type="row.permission === '超级管理员' ? 'danger' : 'primary'"
                            effect="light"
                            round
                        >
                            {{ row.permission }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template #default="{ row }">
                        <el-button
                            type="primary"
                            link
                            size="small"
                            @click="handleViewDetail(row)"
                        >详情</el-button>
                        <el-button
                            type="danger"
                            link
                            size="small"
                            @click="handleDeleteAdmin(row)"
                        >删除</el-button>
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
                        </div>
                    </template>
                </el-pagination>
            </div>
        </el-card>

        <!-- 新增管理员对话框 -->
        <el-dialog
            v-model="addDialogVisible"
            title="新增管理员"
            width="480px"
            :close-on-click-modal="false"
            @close="closeAddDialog"
        >
            <el-form
                ref="addFormRef"
                :model="addForm"
                :rules="addFormRules"
                label-width="80px"
            >
                <el-form-item label="姓名" prop="name">
                    <el-input
                        v-model="addForm.name"
                        placeholder="请输入姓名"
                        :disabled="addFormLoading"
                    />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input
                        v-model="addForm.password"
                        type="password"
                        placeholder="请输入密码"
                        show-password
                        :disabled="addFormLoading"
                    />
                </el-form-item>
                <el-form-item label="权限" prop="permission">
                    <el-select
                        v-model="addForm.permission"
                        placeholder="请选择权限"
                        style="width: 100%"
                        :disabled="addFormLoading"
                    >
                        <el-option label="普通管理员" value="普通管理员" />
                        <el-option label="超级管理员" value="超级管理员" />
                    </el-select>
                </el-form-item>
            </el-form>

            <template #footer>
                <el-button @click="handleAddCancel" :disabled="addFormLoading">取消</el-button>
                <el-button type="primary" @click="handleAddConfirm" :loading="addFormLoading">
                    确定
                </el-button>
            </template>
        </el-dialog>

        <!-- 管理员详情对话框 -->
        <el-dialog
            v-model="detailDialogVisible"
            title="管理员详情"
            width="480px"
            :close-on-click-modal="false"
        >
            <div class="detail-content" v-if="detailAdmin">
                <!-- 管理员头像 -->
                <div class="detail-avatar">
                    <el-avatar :size="120" :src="detailAdmin.avatarUrl">
                        <template #error>
                            <el-icon :size="60"><UserFilled /></el-icon>
                        </template>
                    </el-avatar>
                </div>

                <!-- 管理员信息区域 -->
                <div class="detail-info">
                    <div class="info-item">
                        <el-input
                            v-model="detailAdmin.ID"
                            disabled
                            size="large"
                        >
                            <template #prepend>ID</template>
                        </el-input>
                    </div>
                    <div class="info-item">
                        <el-input
                            v-model="detailAdmin.name"
                            disabled
                            size="large"
                        >
                            <template #prepend>姓名</template>
                        </el-input>
                    </div>
                    <div class="info-item">
                        <el-input
                            v-model="detailAdmin.permission"
                            disabled
                            size="large"
                        >
                            <template #prepend>权限</template>
                        </el-input>
                    </div>
                </div>
            </div>

            <template #footer>
                <div class="detail-footer">
                    <el-button @click="closeDetailDialog" size="large">取消</el-button>
                    <el-button type="primary" @click="handleResetPassword" size="large">重置密码</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<style scoped lang="less">
.admin-manage-container {
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

.header-actions {
    display: flex;
    gap: 12px;
    align-items: center;
}

.admin-cell {
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: center;
}

.admin-avatar {
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
    margin-right: 16px;
    color: #606266;
}

.pagination-total {
    font-size: 14px;
}

/* 详情对话框样式 */
.detail-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
    padding: 20px 0;
}

.detail-avatar {
    display: flex;
    justify-content: center;
    align-items: center;
    
    :deep(.el-avatar) {
        border: 4px solid #f0f2f5;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
}

.detail-info {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    
    .info-item {
        width: 100%;
        
        :deep(.el-input-group__prepend) {
            min-width: 80px;
            background-color: #f5f7fa;
            font-weight: 600;
            color: #606266;
        }
        
        :deep(.el-input__wrapper) {
            background-color: #f9fafb;
        }
    }
}

.detail-footer {
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: 12px;
    
    .el-button {
        flex: 1;
    }
}

:deep(.el-form-item) {
    margin-bottom: 0;
    margin-right: 0;
}

// 新增对话框表单项间距
:deep(.el-dialog) {
    .el-form-item {
        margin-bottom: 24px;
        
        &:last-child {
            margin-bottom: 0;
        }
    }
}

:deep(.el-table) {
    flex: 1;
    
    th.el-table__cell {
        background-color: #f5f7fa !important;
    }
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