// 这里定义涉及智能体请求的mock的返回函数

// 将url查询参数转为JS对象
function parseURLParams(url) {
  try {
    const urlObj = new URL(url, 'http://localhost')
    const searchParams = urlObj.searchParams
    const params = {}
    for (const [key, value] of searchParams.entries()) {
      params[key] = value
    }
    return params
  } catch (e) {
    console.error('URL解析失败:', e)
    return {}
  }
}

// token验证
const checkToken = (config) => {
  const search = parseURLParams(config.url)
  const token = search.token
  if (token) {
    const userName = token
    return userName
  }
  return undefined
}

// 模拟菜品数据库
const dishDataBase = [
  {
    dishID: 1,
    dishName: '蜜汁叉烧饭',
    dishPicture: '/src/assets/imgs/dish/1.png',
        dishPrice: 18.0,
    stallID: 1,
    stallName: '美味烧腊',
    canteenName: '榕园食堂'
  },
  {
    dishID: 2,
    dishName: '脆皮烧鸭饭',
    dishPicture: '/src/assets/imgs/dish/2.png',
        dishPrice: 16.0,
    stallID: 1,
    stallName: '美味烧腊',
    canteenName: '榕园食堂'
  },
  {
    dishID: 3,
    dishName: '黑椒鸡扒饭',
    dishPicture: '/src/assets/imgs/dish/3.png',
        dishPrice: 15.0,
    stallID: 2,
    stallName: '香煎扒坊',
    canteenName: '槿园食堂'
  },
  {
    dishID: 4,
    dishName: '香煎猪扒饭',
    dishPicture: '/src/assets/imgs/dish/4.png',
        dishPrice: 14.0,
    stallID: 2,
    stallName: '香煎扒坊',
    canteenName: '槿园食堂'
  },
  {
    dishID: 5,
    dishName: '经典牛肉汉堡',
    dishPicture: '/src/assets/imgs/dish/5.png',
        dishPrice: 18.0,
    stallID: 3,
    stallName: '汉堡达人',
    canteenName: '若海食堂'
  },
  {
    dishID: 6,
    dishName: '香辣鸡腿堡',
    dishPicture: '/src/assets/imgs/dish/1.png',
        dishPrice: 16.0,
    stallID: 3,
    stallName: '汉堡达人',
    canteenName: '若海食堂'
  },
  {
    dishID: 7,
    dishName: '番茄鸡蛋面',
    dishPicture: '/src/assets/imgs/dish/2.png',
        dishPrice: 10.0,
    stallID: 4,
    stallName: '粉面世家',
    canteenName: '荔园食堂'
  },
  {
    dishID: 8,
    dishName: '红烧牛肉面',
    dishPicture: '/src/assets/imgs/dish/3.png',
        dishPrice: 15.0,
    stallID: 4,
    stallName: '粉面世家',
    canteenName: '荔园食堂'
  },
  {
    dishID: 9,
    dishName: '自选三菜套餐',
    dishPicture: '/src/assets/imgs/dish/4.png',
        dishPrice: 12.0,
    stallID: 5,
    stallName: '自选工坊',
    canteenName: '榕园食堂'
  },
  {
    dishID: 10,
    dishName: '香菇滑鸡烩饭',
    dishPicture: '/src/assets/imgs/dish/5.png',
        dishPrice: 16.0,
    stallID: 6,
    stallName: '烩饭专家',
    canteenName: '槿园食堂'
  },
  {
    dishID: 11,
    dishName: '咖喱鸡排饭',
    dishPicture: '/src/assets/imgs/dish/1.png',
        dishPrice: 17.0,
    stallID: 7,
    stallName: '咖喱小屋',
    canteenName: '若海食堂'
  },
  {
    dishID: 12,
    dishName: '酸菜鱼套餐',
    dishPicture: '/src/assets/imgs/dish/2.png',
        dishPrice: 20.0,
    stallID: 8,
    stallName: '川味馆',
    canteenName: '荔园食堂'
  },
  {
    dishID: 13,
    dishName: '滑蛋牛肉饭',
    dishPicture: '/src/assets/imgs/dish/3.png',
        dishPrice: 15.0,
    stallID: 9,
    stallName: '港式茶餐',
    canteenName: '榕园食堂'
  },
  {
    dishID: 14,
    dishName: '照烧鸡腿饭',
    dishPicture: '/src/assets/imgs/dish/4.png',
        dishPrice: 18.0,
    stallID: 10,
    stallName: '日式便当',
    canteenName: '槿园食堂'
  }
]

// 获取随机菜品列表
const getDishList = (config) => {
  const userName = checkToken(config)

  if (!userName) {
    return {
      code: 998,
      msg: "token unvalid"
    }
  }

  const search = parseURLParams(config.url)
  const dishID = search.dishID ? parseInt(search.dishID) : null

  // 随机打乱菜品
  const shuffled = [...dishDataBase].sort(() => Math.random() - 0.5)

  let result = shuffled.slice(0, 9)

  // 如果指定了dishID且对应菜品存在，确保它在列表首位
  if (dishID) {
    const targetDish = dishDataBase.find(d => d.dishID === dishID)
    if (targetDish) {
      // 移除已存在的（如果有）
      result = result.filter(d => d.dishID !== dishID)
      // 将目标菜品放在首位，并保持总数不超过9
      result.unshift(targetDish)
      result = result.slice(0, 9)
    }
  }

  return {
    code: 200,
    data: {
      dishList: result
    }
  }
}

// 模拟档口数据库
const stallDataBase = [
  { stallID: 1, stallName: '美味烧腊', stallPicture: '/src/assets/imgs/dish/1.png', canteenName: '榕园食堂' },
  { stallID: 2, stallName: '香煎扒坊', stallPicture: '/src/assets/imgs/dish/3.png', canteenName: '槿园食堂' },
  { stallID: 3, stallName: '汉堡达人', stallPicture: '/src/assets/imgs/dish/5.png', canteenName: '若海食堂' },
  { stallID: 4, stallName: '粉面世家', stallPicture: '/src/assets/imgs/dish/2.png', canteenName: '荔园食堂' },
  { stallID: 5, stallName: '自选工坊', stallPicture: '/src/assets/imgs/dish/4.png', canteenName: '榕园食堂' },
  { stallID: 6, stallName: '烩饭专家', stallPicture: '/src/assets/imgs/dish/1.png', canteenName: '槿园食堂' },
  { stallID: 7, stallName: '咖喱小屋', stallPicture: '/src/assets/imgs/dish/3.png', canteenName: '若海食堂' },
  { stallID: 8, stallName: '川味馆', stallPicture: '/src/assets/imgs/dish/2.png', canteenName: '荔园食堂' },
  { stallID: 9, stallName: '港式茶餐', stallPicture: '/src/assets/imgs/dish/4.png', canteenName: '榕园食堂' },
  { stallID: 10, stallName: '日式便当', stallPicture: '/src/assets/imgs/dish/5.png', canteenName: '槿园食堂' },
]

// 获取随机档口列表
const getStallList = (config) => {
  const userName = checkToken(config)

  if (!userName) {
    return {
      code: 998,
      msg: "token unvalid"
    }
  }

  const search = parseURLParams(config.url)
  const stallID = search.stallID ? parseInt(search.stallID) : null

  const shuffled = [...stallDataBase].sort(() => Math.random() - 0.5)

  let result = shuffled.slice(0, 9)

  if (stallID) {
    const targetStall = stallDataBase.find(s => s.stallID === stallID)
    if (targetStall) {
      result = result.filter(s => s.stallID !== stallID)
      result.unshift(targetStall)
      result = result.slice(0, 9)
    }
  }

  return {
    code: 200,
    data: {
      stallList: result
    }
  }
}

export default { getDishList, getStallList }
