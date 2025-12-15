import admin from "./admin.js"

// 模拟管理员数据库（使用 admin.js 中的数据，但需要导入）
// 注意：这里我们从 admin.js 导入 checkToken 函数
const { checkToken } = admin

// 将查询参数转换为JS对象
function parseURLParams(url) {
    try {
        const fullURL = url.startsWith('http') ? url : `http://localhost${url}`
        const searchParams = new URL(fullURL).searchParams
        const params = {}
        for (const [key, value] of searchParams.entries()) {
            params[key] = value
        }
        return params
    } catch (error) {
        console.error('parseURLParams error:', error)
        return {}
    }
}

// 模拟管理员数据库（和 admin.js 中的数据保持同步）
let adminDatabase = [
    {
        ID: "00000001",
        password: "123456",
        permission: "超级管理员",
        name: "ISeRi_NiNa",
        avatarUrl: "/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg",
    },
    {
        ID: "00000002",
        password: "654321",
        permission: "普通管理员",
        name: "AWa_SuBaRu",
        avatarUrl: "/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg",
    },
    {
        ID: "00000003",
        password: "13579",
        permission: "普通管理员",
        name: "WaGuRi_KaORuKo",
        avatarUrl: "/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg",
    },
    {
        ID: "00000004",
        password: "111111",
        permission: "普通管理员",
        name: "TeSuTa_MaKoTo",
        avatarUrl: "/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg",
    },
    {
        ID: "00000005",
        password: "222222",
        permission: "超级管理员",
        name: "YuKi_MoMo",
        avatarUrl: "/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg",
    }
]

// 生成新的管理员ID
const generateAdminID = () => {
    const maxID = Math.max(...adminDatabase.map(admin => parseInt(admin.ID)))
    return String(maxID + 1).padStart(8, '0')
}

// 获取管理员列表
const getAdminList = (config) => {
    const adminID = checkToken(config)
    if (!adminID) {
        return {
            code: 997,
            msg: "管理员token验证失败"
        }
    }

    const params = parseURLParams(config.url)
    const { ID = '', name = '', permission = '全部', pageIndex = 1, numPerPage = 10 } = params

    // 过滤管理员列表
    let filteredList = adminDatabase.filter(admin => {
        const matchID = ID === '' || admin.ID.includes(ID)
        const matchName = name === '' || admin.name.includes(name)
        const matchPermission = permission === '全部' || admin.permission === permission
        return matchID && matchName && matchPermission
    })

    // 计算分页
    const currentPage = parseInt(pageIndex) || 1
    const perPage = parseInt(numPerPage) || 10
    const totalPageNum = Math.ceil(filteredList.length / perPage)
    const startIndex = (currentPage - 1) * perPage
    const endIndex = startIndex + perPage

    const paginatedList = filteredList.slice(startIndex, endIndex).map(admin => ({
        ID: admin.ID,
        name: admin.name,
        permission: admin.permission,
        avatarUrl: admin.avatarUrl
    }))

    return {
        code: 200,
        data: {
            adminList: paginatedList,
            pageIndex: currentPage,
            totalPageNum: totalPageNum
        }
    }
}

// 新增管理员
const addAdmin = (config) => {
    const adminID = checkToken(config)
    if (!adminID) {
        return {
            code: 997,
            msg: "管理员token验证失败"
        }
    }

    // 检查当前管理员权限
    const currentAdmin = adminDatabase.find(admin => admin.ID === adminID)
    if (currentAdmin.permission !== "超级管理员") {
        return {
            code: 999,
            msg: "无权限执行此操作，仅超级管理员可以新增管理员"
        }
    }

    const { name, permission } = JSON.parse(config.body)

    // 验证必填字段
    if (!name || !permission) {
        return {
            code: 999,
            msg: "姓名和权限不能为空"
        }
    }

    // 生成新ID
    const newID = generateAdminID()
    
    // 生成初始密码（6位随机数字）
    const initialPassword = String(Math.floor(100000 + Math.random() * 900000))

    // 创建新管理员
    const newAdmin = {
        ID: newID,
        password: initialPassword,
        permission: permission,
        name: name,
        avatarUrl: "/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg"
    }

    adminDatabase.push(newAdmin)

    console.log(`[新增管理员] ID: ${newID}, 姓名: ${name}, 权限: ${permission}, 初始密码: ${initialPassword}`)

    return {
        code: 200,
        data: {
            ID: newID,
            password: initialPassword
        }
    }
}

// 删除管理员
const deleteAdmin = (config) => {
    const adminID = checkToken(config)
    if (!adminID) {
        return {
            code: 997,
            msg: "管理员token验证失败"
        }
    }

    // 检查当前管理员权限
    const currentAdmin = adminDatabase.find(admin => admin.ID === adminID)
    if (currentAdmin.permission !== "超级管理员") {
        return {
            code: 999,
            msg: "无权限执行此操作，仅超级管理员可以删除管理员"
        }
    }

    const { ID } = JSON.parse(config.body)

    // 不能删除自己
    if (ID === adminID) {
        return {
            code: 999,
            msg: "不能删除自己的账号"
        }
    }

    // 查找要删除的管理员
    const index = adminDatabase.findIndex(admin => admin.ID === ID)
    if (index === -1) {
        return {
            code: 999,
            msg: "管理员不存在"
        }
    }

    const deletedAdmin = adminDatabase[index]
    adminDatabase.splice(index, 1)

    console.log(`[删除管理员] ID: ${ID}, 姓名: ${deletedAdmin.name}`)

    return {
        code: 200
    }
}

// 重置管理员密码
const resetAdminPassword = (config) => {
    const adminID = checkToken(config)
    if (!adminID) {
        return {
            code: 997,
            msg: "管理员token验证失败"
        }
    }

    // 检查当前管理员权限
    const currentAdmin = adminDatabase.find(admin => admin.ID === adminID)
    if (currentAdmin.permission !== "超级管理员") {
        return {
            code: 999,
            msg: "无权限执行此操作，仅超级管理员可以重置密码"
        }
    }

    const { ID } = JSON.parse(config.body)

    // 查找管理员
    const targetAdmin = adminDatabase.find(admin => admin.ID === ID)
    if (!targetAdmin) {
        return {
            code: 999,
            msg: "管理员不存在"
        }
    }

    // 生成新密码（6位随机数字）
    const newPassword = String(Math.floor(100000 + Math.random() * 900000))
    targetAdmin.password = newPassword

    console.log(`[重置密码] ID: ${ID}, 姓名: ${targetAdmin.name}, 新密码: ${newPassword}`)

    return {
        code: 200,
        data: {
            newPassword: newPassword
        }
    }
}

export default {
    getAdminList,
    addAdmin,
    deleteAdmin,
    resetAdminPassword
}

