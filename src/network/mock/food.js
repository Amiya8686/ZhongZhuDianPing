//这里定义涉及美食档口请求的mock的返回函数

// 导入评论数据库
import { commentDataBase } from './comment.js'

//将url查询参数转为JS对象
function parseURLParams(url) {
  try {
    // 兼容相对路径和绝对路径
    const urlObj = new URL(url, 'http://localhost');
    const searchParams = urlObj.searchParams;
    const params = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    return params;
  } catch (e) {
    console.error('URL解析失败:', e);
    return {};
  }
}

//模拟档口数据库
const stallDataBase = [
  {
    ID: 1,
    name: '美味烧腊',
    rating: 4.8,
    meanPrice: 25.0,
    canteen: '榕园食堂',
    signatureDish: '烧鸭饭',
    pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg',
    type: '烧腊',
    introduction: '正宗广式烧腊，酱汁浓郁，肉质鲜嫩。'
  },
  {
    ID: 2,
    name: '老坛麻辣烫',
    rating: 4.6,
    meanPrice: 18.0,
    canteen: '荔园食堂',
    signatureDish: '招牌麻辣烫',
    pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg',
    type: '粉面',
    introduction: '选料丰富，汤底香浓，辣度可调。'
  },
  {
    ID: 3,
    name: '快乐汉堡',
    rating: 4.9,
    meanPrice: 22.0,
    canteen: '槿园食堂',
    signatureDish: '双层芝士牛肉堡',
    pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg',
    type: '汉堡',
    introduction: '新鲜牛肉饼，芝士浓郁，超大份量。'
  },
  {
    ID: 4,
    name: '手工拉面',
    rating: 4.7,
    meanPrice: 15.0,
    canteen: '若海食堂',
    signatureDish: '兰州拉面',
    pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg',
    type: '粉面',
    introduction: '现拉现煮，劲道十足，汤头鲜美。'
  },
  {
    ID: 5,
    name: '黄焖鸡米饭',
    rating: 4.5,
    meanPrice: 20.0,
    canteen: '榕园食堂',
    signatureDish: '黄焖鸡',
    pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg',
    type: '烩饭',
    introduction: '鸡肉嫩滑，酱汁入味，配菜丰富。'
  },
  {
    ID: 6,
    name: '鲜榨果汁',
    rating: 4.8,
    meanPrice: 12.0,
    canteen: '荔园食堂',
    signatureDish: '芒果汁',
    pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg',
    type: '自选',
    introduction: '新鲜水果现榨，无添加，健康美味。'
  },
  {
    ID: 7,
    name: '铁板烧',
    rating: 4.7,
    meanPrice: 28.0,
    canteen: '槿园食堂',
    signatureDish: '铁板牛肉',
    pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg',
    type: '烧腊',
    introduction: '现场制作，香气四溢，口感极佳。'
  },
  {
    ID: 8,
    name: '自选快餐',
    rating: 4.4,
    meanPrice: 16.0,
    canteen: '若海食堂',
    signatureDish: '三菜一饭',
    pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg',
    type: '自选',
    introduction: '菜品多样，自由搭配，经济实惠。'
  },
  {
    ID: 9,
    name: '石锅拌饭',
    rating: 4.6,
    meanPrice: 19.0,
    canteen: '榕园食堂',
    signatureDish: '韩式石锅拌饭',
    pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg',
    type: '烩饭',
    introduction: '正宗韩式风味，锅巴香脆，营养均衡。'
  },
  {
    ID: 10,
    name: '砂锅粥',
    rating: 4.5,
    meanPrice: 14.0,
    canteen: '荔园食堂',
    signatureDish: '皮蛋瘦肉粥',
    pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg',
    type: '粉面',
    introduction: '熬制3小时，米粒绵软，营养丰富。'
  },
  {
    ID: 11,
    name: '炸鸡汉堡',
    rating: 4.7,
    meanPrice: 23.0,
    canteen: '槿园食堂',
    signatureDish: '香辣鸡腿堡',
    pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg',
    type: '汉堡',
    introduction: '外酥里嫩，香辣可口，配薯条更佳。'
  },
  {
    ID: 12,
    name: '烤肉饭',
    rating: 4.8,
    meanPrice: 26.0,
    canteen: '若海食堂',
    signatureDish: '照烧鸡排饭',
    pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg',
    type: '烩饭',
    introduction: '日式风味，酱汁香甜，肉质软嫩。'
  }
]

//输入：报文
//输出:
//成功：从token中解析得到的用户名
//失败：undefined
//验证token（给需要验证token的函数用）
const checkToken = (config)=>{
    const search = parseURLParams(config.url)
    const token = search.token;

    if(token){
        //解析token
        const userName = token
        //简单验证（实际应该验证token有效性）
        return userName;
    }
    return undefined
}

//获取档口列表
//输入: config对象，查询参数包含{type, canteen, orderBy, collation, numPerPage, pageIndex}
//输出: 响应对象
//成功: {code: 200, data: {stalls: Array, totalPageNum: number, pageIndex: number}}
//失败: {code: 998, msg: "token unvalid"}
const getStallList = (config)=>{
    const userName = checkToken(config)
    
    //token验证失败
    if(!userName){
        return {
            code:998,
            msg:"token unvalid",
        }
    }
    
    //获取查询参数
    const search = parseURLParams(config.url)
    const type = search.type || '全部'
    const canteen = search.canteen || '全部'
    const orderBy = search.orderBy || 'default'
    const collation = search.collation || 'default'
    const numPerPage = parseInt(search.numPerPage) || 10
    const pageIndex = parseInt(search.pageIndex) || 1
    
    //筛选档口
    let filteredStalls = [...stallDataBase]
    
    //按类型筛选
    if(type !== 'default' && type !== '全部'){
        filteredStalls = filteredStalls.filter(item => item.type === type)
    }
    
    //按饭堂筛选
    if(canteen !== 'default' && canteen !== '全部'){
        filteredStalls = filteredStalls.filter(item => item.canteen === canteen)
    }
    
    //排序
    if(collation !== 'default' && orderBy !== 'default'){
        if(orderBy === 'rating'){
            //按评分排序
            if(collation === 'ascend'){
                filteredStalls.sort((a, b) => a.rating - b.rating)
            }else if(collation === 'descend'){
                filteredStalls.sort((a, b) => b.rating - a.rating)
            }
        }else if(orderBy === 'price'){
            //按价格排序
            if(collation === 'ascend'){
                filteredStalls.sort((a, b) => a.meanPrice - b.meanPrice)
            }else if(collation === 'descend'){
                filteredStalls.sort((a, b) => b.meanPrice - a.meanPrice)
            }
        }
    }
    
    //计算分页
    const total = filteredStalls.length
    const totalPageNum = Math.ceil(total / numPerPage)
    const startIndex = (pageIndex - 1) * numPerPage
    const endIndex = startIndex + numPerPage
    const stalls = filteredStalls.slice(startIndex, endIndex)
    
    console.log(`[getStallList] 档口列表，总数${total}个，第${pageIndex}页，共${totalPageNum}页`)
    
    return {
        code:200,
        data:{
            stalls: stalls,
            totalPageNum: totalPageNum,
            pageIndex: pageIndex
        }
    }
}

//获取档口详细信息
const getStallInfo = (config)=>{
    const userName = checkToken(config)
    
    if(!userName){
        return {
            code:998,
            msg:"token unvalid",
        }
    }
    
    const search = parseURLParams(config.url)
    const stallID = parseInt(search.stallID)
    
    const stall = stallDataBase.find(item => item.ID === stallID)
    
    if(!stall){
        return {
            code:999,
            msg:"档口不存在"
        }
    }
    
    console.log(`[getStallInfo] 获取档口${stallID}的详细信息`)
    
    // 推荐菜品列表
    const dishList = [
        {
            ID: stallID * 100 + 1,
            name: stall.signatureDish,
            price: stall.meanPrice,
            rating: Number(stall.rating.toFixed(1)),
            pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg'
        },
        {
            ID: stallID * 100 + 2,
            name: '招牌套餐',
            price: stall.meanPrice + 5,
            rating: Number((stall.rating - 0.1).toFixed(1)),
            pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg'
        },
        {
            ID: stallID * 100 + 3,
            name: '超值单人餐',
            price: stall.meanPrice - 2,
            rating: Number((stall.rating - 0.2).toFixed(1)),
            pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg'
        },
        {
            ID: stallID * 100 + 4,
            name: '特色小吃',
            price: 8,
            rating: Number((stall.rating - 0.3).toFixed(1)),
            pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg'
        },
        {
            ID: stallID * 100 + 5,
            name: '饮料',
            price: 5,
            rating: Number((stall.rating - 0.5).toFixed(1)),
            pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg'
        }
    ]
    
    //模拟热门评论列表
    const commentList = [
        {
            ID: 1,
            reviewerName: 'NiNa',
            avatarUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg',
            dateTime: '2025-11-15 12:30:45',
            rating: 5.0,
            like: 23,
            evaluation: 'none',
            content: '非常好吃，强烈推荐！',
            picture1Url: '',
            picture2Url: '',
            picture3Url: ''
        }
    ]
    
    return {
        code:200,
        data:{
            ID: stall.ID,
            name: stall.name,
            rating: stall.rating,
            meanPrice: stall.meanPrice,
            introduction: stall.introduction,
            canteent: stall.canteen,
            signatureDish: stall.signatureDish,
            pictureUrl: stall.pictureUrl,
            dishList: dishList,
            commentList: commentList
        }
    }
}

//模拟菜品数据库（用于记录用户评价状态）
let dishDatabase = {}

//初始化菜品数据库
const initDishDatabase = () => {
    const dishes = [
        { ID: 1, name: '烧鸭饭', price: 25, like: 128, bad: 5, pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg' },
        { ID: 2, name: '烧肉饭', price: 23, like: 95, bad: 8, pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg' },
        { ID: 3, name: '烧鹅饭', price: 28, like: 156, bad: 3, pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg' },
        { ID: 4, name: '叉烧饭', price: 22, like: 88, bad: 6, pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg' },
        { ID: 5, name: '白切鸡饭', price: 24, like: 102, bad: 4, pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg' },
        { ID: 6, name: '双拼饭', price: 26, like: 145, bad: 7, pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg' },
        { ID: 7, name: '三拼饭', price: 30, like: 178, bad: 2, pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg' },
        { ID: 8, name: '烧腊拼盘', price: 35, like: 203, bad: 1, pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg' },
        { ID: 9, name: '油鸡饭', price: 23, like: 76, bad: 9, pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg' },
        { ID: 10, name: '卤水拼盘', price: 32, like: 134, bad: 5, pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg' },
        { ID: 11, name: '咸鱼鸡粒炒饭', price: 20, like: 67, bad: 12, pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg' },
        { ID: 12, name: '腊味煲仔饭', price: 28, like: 189, bad: 4, pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg' },
    ]
    
    dishes.forEach(dish => {
        dishDatabase[dish.ID] = { ...dish, evaluation: 'none' }
    })
}

//初始化
initDishDatabase()

//获取档口的全部菜品列表
//输入: config对象，查询参数包含{stallID}
//输出: 响应对象
//成功: {code: 200, data: {dishList: Array}}
//失败: {code: 998, msg: "token unvalid"}
const getStallDishList = (config) => {
    const userName = checkToken(config)
    
    if(!userName){
        return {
            code:998,
            msg:"token unvalid",
        }
    }
    
    const search = parseURLParams(config.url)
    const stallID = search.stallID
    
    console.log(`[getStallDishList] 获取档口${stallID}的菜品列表`)
    
    //返回所有菜品（实际应该根据stallID筛选）
    const dishList = Object.values(dishDatabase)
    
    return {
        code: 200,
        data: {
            dishList: dishList,
            token: userName
        }
    }
}

//更新菜品的评价状态
//输入: config对象，body包含{dishID, newEvaluation}
//输出: 响应对象
//成功: {code: 200}
//失败: {code: 998, msg: "token unvalid"}
const evaluateDish = (config) => {
    //从params获取token（mock环境）
    const search = parseURLParams(config.url)
    const token = search.token
    
    if(!token){
        return {
            code: 998,
            msg: "token unvalid"
        }
    }
    
    const userName = token
    const body = JSON.parse(config.body)
    const dishID = body.dishID
    const newEvaluation = body.newEvaluation
    
    console.log(`[evaluateDish] 用户${userName}对菜品${dishID}评价为${newEvaluation}`)
    
    //更新菜品评价状态和计数
    if(dishDatabase[dishID]){
        const dish = dishDatabase[dishID]
        const oldEvaluation = dish.evaluation
        
        // 更新计数
        // 先移除旧评价的影响
        if (oldEvaluation === 'like') {
            dish.like = Math.max(0, dish.like - 1)
        } else if (oldEvaluation === 'bad') {
            dish.bad = Math.max(0, dish.bad - 1)
        }
        
        // 添加新评价的影响
        if (newEvaluation === 'like') {
            dish.like++
        } else if (newEvaluation === 'bad') {
            dish.bad++
        }
        
        // 更新状态
        dish.evaluation = newEvaluation
    }
    
    return {
        code: 200,
        data: {
            token: userName
        }
    }
}

//模拟评论数据库
let commentDatabase = {}

//初始化评论数据库
const initCommentDatabase = () => {
    const comments = [
        {
            ID: 1,
            reviewerName: 'NiNa',
            avatarUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg',
            dateTime: '2025-11-27 12:30:45',
            rating: 5.0,
            like: 128,
            evaluation: 'none',
            content: '非常好吃，强烈推荐！服务态度也很好，环境干净整洁，下次还会再来的。',
            picture1Url: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg',
            picture2Url: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg',
            picture3Url: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg'
        },
        {
            ID: 2,
            reviewerName: '小明',
            avatarUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg',
            dateTime: '2025-11-26 18:45:20',
            rating: 4.5,
            like: 89,
            evaluation: 'none',
            content: '味道不错，份量足够，性价比很高。就是人有点多，需要排队。',
            picture1Url: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg',
            picture2Url: '',
            picture3Url: ''
        },
        {
            ID: 3,
            reviewerName: '美食家小王',
            avatarUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg',
            dateTime: '2025-11-25 13:15:30',
            rating: 4.8,
            like: 156,
            evaluation: 'none',
            content: '这家的招牌菜真的很赞！每次来都要点，从来没有失望过。老板人也很好，经常有优惠活动。',
            picture1Url: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg',
            picture2Url: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg',
            picture3Url: ''
        },
        {
            ID: 4,
            reviewerName: '吃货大叔',
            avatarUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg',
            dateTime: '2025-11-24 19:20:15',
            rating: 4.2,
            like: 67,
            evaluation: 'none',
            content: '整体还可以，但是有些菜品略咸，建议可以改进一下。不过其他方面都挺满意的。',
            picture1Url: '',
            picture2Url: '',
            picture3Url: ''
        },
        {
            ID: 5,
            reviewerName: '李小姐',
            avatarUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg',
            dateTime: '2025-11-23 12:00:00',
            rating: 5.0,
            like: 203,
            evaluation: 'none',
            content: '超级好吃！特别是他们家的酱料，太有特色了！环境也很温馨，适合和朋友一起来聚餐。',
            picture1Url: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg',
            picture2Url: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg',
            picture3Url: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg'
        },
        {
            ID: 6,
            reviewerName: '张三',
            avatarUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg',
            dateTime: '2025-11-22 14:30:25',
            rating: 4.6,
            like: 98,
            evaluation: 'none',
            content: '价格实惠，味道也不错，是学生党的好选择。推荐给大家！',
            picture1Url: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg',
            picture2Url: '',
            picture3Url: ''
        },
        {
            ID: 7,
            reviewerName: '美食探索者',
            avatarUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg',
            dateTime: '2025-11-21 11:45:50',
            rating: 4.9,
            like: 187,
            evaluation: 'none',
            content: '惊艳！没想到食堂也能做出这么好吃的菜。食材新鲜，烹饪技术也很专业。',
            picture1Url: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg',
            picture2Url: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg',
            picture3Url: ''
        },
        {
            ID: 8,
            reviewerName: '王大锤',
            avatarUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg',
            dateTime: '2025-11-20 17:30:10',
            rating: 4.3,
            like: 76,
            evaluation: 'none',
            content: '还行吧，偶尔来吃一次挺好的。不过高峰期要早点来，不然没位置。',
            picture1Url: '',
            picture2Url: '',
            picture3Url: ''
        },
        {
            ID: 9,
            reviewerName: '小红',
            avatarUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg',
            dateTime: '2025-11-19 13:20:35',
            rating: 4.7,
            like: 134,
            evaluation: 'none',
            content: '很喜欢这里的氛围，菜品也很合我口味。而且老板很热情，每次都会推荐新菜品。',
            picture1Url: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg',
            picture2Url: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg',
            picture3Url: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg'
        },
        {
            ID: 10,
            reviewerName: '刘同学',
            avatarUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg',
            dateTime: '2025-11-18 12:15:20',
            rating: 4.4,
            like: 92,
            evaluation: 'none',
            content: '性价比高，味道也可以。就是希望能多一些菜品选择就更好了。',
            picture1Url: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg',
            picture2Url: '',
            picture3Url: ''
        },
        {
            ID: 11,
            reviewerName: '美味猎人',
            avatarUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg',
            dateTime: '2025-11-17 18:50:45',
            rating: 4.8,
            like: 165,
            evaluation: 'none',
            content: '真的很不错！尤其是他们的特色菜，必点！强烈安利给大家。',
            picture1Url: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg',
            picture2Url: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg',
            picture3Url: ''
        },
        {
            ID: 12,
            reviewerName: '陈先生',
            avatarUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg',
            dateTime: '2025-11-16 11:30:15',
            rating: 4.1,
            like: 58,
            evaluation: 'none',
            content: '中规中矩吧，没有特别惊艳，但也不难吃。价格合理，偶尔换换口味可以来。',
            picture1Url: '',
            picture2Url: '',
            picture3Url: ''
        }
    ]
    
    comments.forEach(comment => {
        commentDatabase[comment.ID] = { ...comment }
    })
}

//初始化
initCommentDatabase()

//获取档口的全部评论列表
//输入: config对象，查询参数包含{stallID, numPerPage, pageIndex}
//输出: 响应对象
//成功: {code: 200, data: {commentList: Array, totalPageNum: number, pageIndex: number}}
//失败: {code: 998, msg: "token unvalid"}
const getStallCommentList = (config) => {
    console.log('[Mock] getStallCommentList request:', config.url);
    const userName = checkToken(config)
    
    if(!userName){
        return {
            code: 998,
            msg: "token unvalid"
        }
    }
    
    const search = parseURLParams(config.url)
    const stallID = search.stallID
    const numPerPage = parseInt(search.numPerPage) || 10
    const pageIndex = parseInt(search.pageIndex) || 1
    
    console.log(`[getStallCommentList] 获取档口${stallID}的评论列表，第${pageIndex}页，每页${numPerPage}条`)
    
    // 确保 commentDatabase 有数据，如果没有则重新初始化
    if (Object.keys(commentDatabase).length === 0) {
        console.warn('[getStallCommentList] commentDatabase 为空，重新初始化')
        initCommentDatabase()
    }
    
    //返回所有评论（实际应该根据stallID筛选）
    const allComments = Object.values(commentDatabase)
    
    // 如果还是空，强制添加一些测试数据
    if (allComments.length === 0) {
        console.warn('[getStallCommentList] 依然为空，使用强制数据')
        allComments.push({
            ID: 999,
            reviewerName: '测试用户',
            avatarUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg',
            dateTime: '2025-12-12 12:00:00',
            rating: 5.0,
            like: 10,
            evaluation: 'none',
            content: '这是一条强制显示的测试评论，如果你看到这条消息，说明Mock数据初始化有问题。',
            picture1Url: '',
            picture2Url: '',
            picture3Url: ''
        })
    }
    
    //计算分页
    const total = allComments.length
    const totalPageNum = Math.ceil(total / numPerPage)
    const startIndex = (pageIndex - 1) * numPerPage
    const endIndex = startIndex + numPerPage
    const commentList = allComments.slice(startIndex, endIndex)
    
    console.log(`[getStallCommentList] 返回 ${commentList.length} 条评论`)
    
    return {
        code: 200,
        data: {
            commentList: commentList,
            totalPageNum: totalPageNum,
            pageIndex: pageIndex,
            token: userName
        }
    }
}

//对评论进行评价（点赞）
//输入: config对象，body包含{commentID, newEvaluation}
//输出: 响应对象
//成功: {code: 200}
//失败: {code: 998, msg: "token unvalid"}
const evaluationComment = (config) => {
    //从params获取token（mock环境）
    const search = parseURLParams(config.url)
    const token = search.token
    
    if(!token){
        return {
            code: 998,
            msg: "token unvalid"
        }
    }
    
    const userName = token
    const body = JSON.parse(config.body)
    const commentID = body.commentID
    const newEvaluation = body.newEvaluation
    
    console.log(`[evaluationComment] 用户${userName}对评论${commentID}评价为${newEvaluation}`)
    
    //更新评论评价状态和计数
    if(commentDatabase[commentID]){
        const comment = commentDatabase[commentID]
        const oldEvaluation = comment.evaluation
        
        // 更新计数
        // 先移除旧评价的影响
        if (oldEvaluation === 'like') {
            comment.like = Math.max(0, comment.like - 1)
        }
        
        // 添加新评价的影响
        if (newEvaluation === 'like') {
            comment.like++
        }
        
        // 更新状态
        comment.evaluation = newEvaluation
    }
    
    return {
        code: 200,
        data: {
            token: userName
        }
    }
}


//获取推荐档口列表（用于home页面）
//输入: 无
//输出: 响应对象
//成功: {code: 200, data: {recommendedStallList: Array}}
const getRecommendedStall = ()=>{
    // 按评分排序，取前6个档口作为推荐
    const recommendedStalls = [...stallDataBase]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6)
        .map(stall => ({
            ID: stall.ID,
            name: stall.name,
            type: stall.type,
            rating: stall.rating,
            signatureDish: stall.signatureDish,
            dishPrice: stall.meanPrice,
            dishPictureUrl: stall.pictureUrl
        }))
    
    console.log(`[getRecommendedStall] 返回${recommendedStalls.length}个推荐档口`)    
    return {
        code: 200,
        data: {
            recommendedStallList: recommendedStalls
        }
    }
}

export default {getStallList, getStallInfo, getStallDishList, evaluateDish, getStallCommentList, evaluationComment,getRecommendedStall}
