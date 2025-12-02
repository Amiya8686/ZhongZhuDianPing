//用户管理 Mock 数据
//将查询参数转换为JS对象
function parseURLParams(url) {
    const params = {};
    const queryString = url.split('?')[1];
    if (!queryString) return params;
    
    const pairs = queryString.split('&');
    for (const pair of pairs) {
        const [key, value] = pair.split('=');
        params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    }
    return params;
}

//默认密码常量
const DEFAULT_PASSWORD = "123456";

//模拟用户数据库
const userDataBase = [
    {
        userName: "zhangsan",
        nickName: "张三",
        password: "zhangsan123",
        status: "启用",
        avatarUrl: "/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg"
    },
    {
        userName: "lisi",
        nickName: "李四",
        password: "lisi123",
        status: "冻结",
        avatarUrl: "/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg"
    },
    {
        userName: "wangwu",
        nickName: "王五",
        password: "wangwu123",
        status: "启用",
        avatarUrl: "/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg"
    },
    {
        userName: "zhaoliu",
        nickName: "赵六",
        password: "zhaoliu123",
        status: "启用",
        avatarUrl: "/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg"
    },
    {
        userName: "sunqi",
        nickName: "孙七",
        password: "sunqi123",
        status: "冻结",
        avatarUrl: "/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg"
    },
    {
        userName: "zhouba",
        nickName: "周八",
        password: "zhouba123",
        status: "启用",
        avatarUrl: "/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg"
    },
    {
        userName: "wujiu",
        nickName: "吴九",
        password: "wujiu123",
        status: "启用",
        avatarUrl: "/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg"
    },
    {
        userName: "zhengshi",
        nickName: "郑十",
        password: "zhengshi123",
        status: "冻结",
        avatarUrl: "/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg"
    }
];

//获取用户列表（支持筛选和分页）
const getUserList = (config) => {
    const params = parseURLParams(config.url);
    const status = params.status || "全部";
    const userName = params.userName || "";
    const nickName = params.nickName || "";
    const pageIndex = parseInt(params.pageIndex) || 1;
    const numPerPage = parseInt(params.numPerPage) || 10;

    // 筛选用户
    let filteredUsers = [...userDataBase];

    if (status !== "全部") {
        filteredUsers = filteredUsers.filter(user => user.status === status);
    }

    if (userName) {
        filteredUsers = filteredUsers.filter(user =>
            user.userName.toLowerCase().includes(userName.toLowerCase())
        );
    }

    if (nickName) {
        filteredUsers = filteredUsers.filter(user =>
            user.nickName.includes(nickName)
        );
    }

    // 计算分页
    const totalCount = filteredUsers.length;
    const totalPageNum = Math.ceil(totalCount / numPerPage);
    const startIndex = (pageIndex - 1) * numPerPage;
    const endIndex = startIndex + numPerPage;
    const userList = filteredUsers.slice(startIndex, endIndex);

    return {
        code: 200,
        data: {
            userList,
            pageIndex,
            totalPageNum
        }
    };
};

//冻结用户账号
const freezeAccount = (config) => {
    const { userName } = JSON.parse(config.body);

    const userIndex = userDataBase.findIndex(user => user.userName === userName);

    if(userIndex === -1) {
        return {
            code: 999,
            msg: "用户不存在"
        };
    }

    // 冻结账号
    userDataBase[userIndex].status = "冻结";
        
    return {
        code: 200
    };
};

// 解冻用户账号
const defrostAccount = (config) => {
    const { userName } = JSON.parse(config.body);

    const userIndex = userDataBase.findIndex(user => user.userName === userName);

    if (userIndex === -1) {
        return {
            code: 999,
            msg: "用户不存在"
        };
    }

    // 解冻账号
    userDataBase[userIndex].status = "启用";

    return {
        code: 200
    };
};

// 重置用户密码
const resetPassword = (config) => {
    const { userName } = JSON.parse(config.body);

    const userIndex = userDataBase.findIndex(user => user.userName === userName);

    if (userIndex === -1) {
        return {
            code: 999,
            msg: "用户不存在"
        };
    }

    // 重置密码为默认密码
    const oldPassword = userDataBase[userIndex].password;
    userDataBase[userIndex].password = DEFAULT_PASSWORD;
    
    console.log(`[resetPassword] 用户 ${userName} 的密码已从 "${oldPassword}" 重置为默认密码 "${DEFAULT_PASSWORD}"`);

    return {
        code: 200,
        data: {
            newPassword: DEFAULT_PASSWORD
        }
    };
};

export default { getUserList, freezeAccount, defrostAccount, resetPassword };