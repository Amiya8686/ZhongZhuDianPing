//这里定义涉及美食档口请求的mock的返回函数

// 导入评论数据库
import { commentDataBase } from './comment.js'

//将url查询参数转为JS对象
function parseURLParams(url) {
  const searchParams = new URL(url).searchParams;
  const params = {};
  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }
  return params;
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
    
    // 从commentDataBase中查询该档口的评论，按点赞数排序，取前2条作为热门评论
    const stallComments = commentDataBase
        .filter(comment => comment.stallID === stallID)
        .sort((a, b) => b.like - a.like)
        .slice(0, 2)
    
    // 将评论数据转换为API文档要求的格式
    const commentList = stallComments.map(comment => {
        const likedBy = comment.likedBy || []
        return {
            ID: comment.ID,
            reviewerName: comment.userId, // 使用userId作为reviewerName
            avatarUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg', // 默认头像
            dateTime: comment.dateTime,
            rating: comment.rating,
            like: comment.like,
            evaluation: likedBy.includes(userName) ? 'like' : 'none',
            content: comment.content,
            picture1Url: comment.picture1Url || '',
            picture2Url: comment.picture2Url || '',
            picture3Url: comment.picture3Url || ''
        }
    })
    
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

//获取档口菜品列表
//输入: config对象，查询参数包含{stallID}
//输出: 响应对象
//成功: {code: 200, data: Array}
//失败: {code: 998, msg: "token unvalid"}
const getStallDishList = (config)=>{
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
            code:200,
            data:[]
        }
    }

    // 针对 ID=3 (快乐汉堡) 返回特定的测试数据
    if (stallID === 3) {
        console.log('[getStallDishList] 返回档口3的特殊测试数据')
        return {
            code: 200,
            data: [
                {
                    id: 301,
                    name: '双层芝士牛肉堡',
                    price: 22.0,
                    pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg',
                    recommendCount: 156
                },
                {
                    id: 302,
                    name: '香辣鸡腿堡',
                    price: 18.0,
                    pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg',
                    recommendCount: 120
                },
                {
                    id: 303,
                    name: '大薯条',
                    price: 12.0,
                    pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg',
                    recommendCount: 89
                },
                {
                    id: 304,
                    name: '冰可乐',
                    price: 6.0,
                    pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg',
                    recommendCount: 200
                },
                {
                    id: 305,
                    name: '麦乐鸡块(5块)',
                    price: 14.0,
                    pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg',
                    recommendCount: 65
                }
            ]
        }
    }
    
    //模拟菜品数据
    const dishes = [
        {
            id: stallID * 100 + 1,
            name: stall.signatureDish,
            price: stall.meanPrice,
            pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg',
            recommendCount: 100 + Math.floor(Math.random() * 50)
        },
        {
            id: stallID * 100 + 2,
            name: '招牌套餐A',
            price: stall.meanPrice + 5,
            pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg',
            recommendCount: 80 + Math.floor(Math.random() * 20)
        },
        {
            id: stallID * 100 + 3,
            name: '超值单人餐',
            price: stall.meanPrice - 2,
            pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg',
            recommendCount: 60 + Math.floor(Math.random() * 30)
        },
        {
            id: stallID * 100 + 4,
            name: '特色小吃',
            price: 8,
            pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg',
            recommendCount: 40 + Math.floor(Math.random() * 10)
        },
        {
            id: stallID * 100 + 5,
            name: '清爽饮料',
            price: 5,
            pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg',
            recommendCount: 20 + Math.floor(Math.random() * 5)
        }
    ]
    
    console.log(`[getStallDishList] 档口${stallID}的菜品列表，共${dishes.length}个`)
    
    return {
        code:200,
        data: dishes
    }
}

export default {getStallList, getStallInfo, getStallDishList}
