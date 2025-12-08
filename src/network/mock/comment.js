//这里定义涉及评论请求的mock的返回函数

//将url查询参数转为JS对象
function parseURLParams(url) {
  const searchParams = new URL(url).searchParams;
  const params = {};
  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }
  return params;
}

//模拟评论数据库
const commentDataBase = [
  {
    ID: 1,
    userId: 'ISeRi_NiNa',
    stallID: 1,
    stallName: '美味烧腊',
    canteen: '榕园食堂',
    dateTime: '2025-11-10 12:30:45',
    rating: 5.0,
    like: 23,
    content: '这家店的菜品真的很不错，味道很正宗，服务态度也很好，环境优雅，价格合理，非常推荐大家来尝试！',
    picture1Url: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg',
    picture2Url: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg',
    picture3Url: ''
  },
  {
    ID: 2,
    userId: 'ISeRi_NiNa',
    stallID: 2,
    stallName: '老坛麻辣烫',
    canteen: '榕园食堂',
    dateTime: '2025-11-09 18:20:30',
    rating: 4.0,
    like: 15,
    content: '麻辣烫的味道还可以，选择挺多的，就是人有点多需要排队。',
    picture1Url: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg',
    picture2Url: '',
    picture3Url: ''
  },
  {
    ID: 3,
    userId: 'ISeRi_NiNa',
    stallID: 3,
    stallName: '快乐汉堡',
    canteen: '榕园食堂',
    dateTime: '2025-11-08 13:15:20',
    rating: 5.0,
    like: 30,
    content: '汉堡超级好吃！肉饼很厚实，配菜新鲜，薯条也很脆，性价比很高！',
    picture1Url: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg',
    picture2Url: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg',
    picture3Url: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg'
  },
  // 快乐汉堡的额外测试评论
  {
    ID: 301,
    userId: 'BurgerKing',
    stallID: 3,
    stallName: '快乐汉堡',
    canteen: '槿园食堂',
    dateTime: '2025-11-20 12:00:00',
    rating: 5.0,
    like: 88,
    content: '这家的汉堡真的是我在学校吃过最好吃的！肉汁丰富，面包松软。',
    picture1Url: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg',
    picture2Url: '',
    picture3Url: ''
  },
  {
    ID: 302,
    userId: 'Foodie_John',
    stallID: 3,
    stallName: '快乐汉堡',
    canteen: '槿园食堂',
    dateTime: '2025-11-19 18:30:00',
    rating: 4.5,
    like: 45,
    content: '薯条很脆，但是可乐有点没气了，总体好评。',
    picture1Url: '',
    picture2Url: '',
    picture3Url: ''
  },
  {
    ID: 303,
    userId: 'Alice_Wonder',
    stallID: 3,
    stallName: '快乐汉堡',
    canteen: '槿园食堂',
    dateTime: '2025-11-18 11:45:00',
    rating: 5.0,
    like: 32,
    content: '双层芝士牛肉堡简直是热量炸弹，但是太快乐了！',
    picture1Url: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg',
    picture2Url: '',
    picture3Url: ''
  },
  {
    ID: 4,
    userId: 'ISeRi_NiNa',
    stallID: 4,
    stallName: '手工拉面',
    canteen: '槿园食堂',
    dateTime: '2025-11-07 19:45:10',
    rating: 3.0,
    like: 8,
    content: '面条味道一般，汤头有点咸，不过价格便宜。',
    picture1Url: '',
    picture2Url: '',
    picture3Url: ''
  },
  {
    ID: 5,
    userId: 'ISeRi_NiNa',
    stallID: 5,
    stallName: '黄焖鸡米饭',
    canteen: '槿园食堂',
    dateTime: '2025-11-06 12:00:00',
    rating: 4.0,
    like: 18,
    content: '黄焖鸡做得不错，鸡肉很嫩，酱汁入味，配菜丰富，值得一试。',
    picture1Url: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg',
    picture2Url: '',
    picture3Url: ''
  },
  {
    ID: 6,
    userId: 'AWa_SuBaRu',
    stallID: 1,
    stallName: '美味烧腊',
    canteen: '荔园食堂',
    dateTime: '2025-11-05 11:30:00',
    rating: 5.0,
    like: 42,
    content: '非常棒的体验！',
    picture1Url: '',
    picture2Url: '',
    picture3Url: ''
  },
  {
    ID: 7,
    userId: 'ISeRi_NiNa',
    stallID: 6,
    stallName: '鲜榨果汁',
    canteen: '荔园食堂',
    dateTime: '2025-11-04 14:20:00',
    rating: 4.0,
    like: 12,
    content: '性价比不错，下次还会来。',
    picture1Url: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg',
    picture2Url: '',
    picture3Url: ''
  },
  {
    ID: 8,
    userId: 'ISeRi_NiNa',
    stallID: 2,
    stallName: '老坛麻辣烫',
    canteen: '荔园食堂',
    dateTime: '2025-11-03 17:30:00',
    rating: 5.0,
    like: 35,
    content: '超级满意！强烈推荐给大家，环境卫生，服务周到，价格实惠。',
    picture1Url: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg',
    picture2Url: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg',
    picture3Url: ''
  },
  {
    ID: 9,
    userId: 'ISeRi_NiNa',
    stallID: 4,
    stallName: '手工拉面',
    canteen: '槿园食堂',
    dateTime: '2025-11-02 12:45:00',
    rating: 3.0,
    like: 5,
    content: '一般般吧，没有特别出彩的地方。',
    picture1Url: '',
    picture2Url: '',
    picture3Url: ''
  },
  {
    ID: 10,
    userId: 'ISeRi_NiNa',
    stallID: 5,
    stallName: '黄焖鸡米饭',
    canteen: '槿园食堂',
    dateTime: '2025-11-01 13:00:00',
    rating: 4.0,
    like: 20,
    content: '味道还不错，就是等待时间有点长。',
    picture1Url: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg',
    picture2Url: '',
    picture3Url: ''
  },
  {
    ID: 11,
    userId: 'ISeRi_NiNa',
    stallID: 3,
    stallName: '快乐汉堡',
    canteen: '槿园食堂',
    dateTime: '2025-10-31 18:00:00',
    rating: 5.0,
    like: 28,
    content: '太好吃了！每次来都很满意，店家态度很好。',
    picture1Url: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg',
    picture2Url: '',
    picture3Url: ''
  },
  {
    ID: 12,
    userId: 'ISeRi_NiNa',
    stallID: 6,
    stallName: '鲜榨果汁',
    canteen: '荔园食堂',
    dateTime: '2025-10-30 15:30:00',
    rating: 4.0,
    like: 16,
    content: '口味适中，分量足，值得一试。',
    picture1Url: '',
    picture2Url: '',
    picture3Url: ''
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

//获取我的评论列表
//输入: config对象，查询参数包含{numPerPage, pageIndex}
//输出: 响应对象
//成功: {code: 200, data: {comments: Array, totalPageNum: number, pageIndex: number}}
//失败: {code: 998, msg: "token unvalid"}
const getMyComments = (config)=>{
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
    const numPerPage = parseInt(search.numPerPage) || 5
    const pageIndex = parseInt(search.pageIndex) || 1
    
    //筛选当前用户的评论
    const userComments = commentDataBase.filter(item => item.userId === userName)
    
    //计算分页
    const totalComments = userComments.length
    const totalPageNum = Math.ceil(totalComments / numPerPage)
    const startIndex = (pageIndex - 1) * numPerPage
    const endIndex = startIndex + numPerPage
    const comments = userComments.slice(startIndex, endIndex)
    
    console.log(`[getMyComments] 用户${userName}的评论，总数${totalComments}条，第${pageIndex}页，共${totalPageNum}页`)
    
    return {
        code:200,
        data:{
            comments: comments,
            totalPageNum: totalPageNum,
            pageIndex: pageIndex
        }
    }
}

//删除评论
//输入: config对象，body中包含{commentID}
//输出: 响应对象
//成功: {code: 200, msg: "删除成功"}
//失败: {code: 998, msg: "token unvalid"} 或 {code: 999, msg: "评论不存在或无权限删除"}
const deleteComment = (config)=>{
    const userName = checkToken(config)
    
    //token验证失败
    if(!userName){
        return {
            code:998,
            msg:"token unvalid",
        }
    }
    
    //获取评论ID
    const search = parseURLParams(config.url)
    const {commentID} = JSON.parse(config.body)
    
    //查找评论
    const commentIndex = commentDataBase.findIndex(item => 
        item.ID === commentID && item.userId === userName
    )
    
    if(commentIndex === -1){
        console.log(`[deleteComment] 评论不存在或无权限删除: commentID=${commentID}`)
        return {
            code:999,
            msg:"评论不存在或无权限删除"
        }
    }
    
    //删除评论
    commentDataBase.splice(commentIndex, 1)
    
    console.log(`[deleteComment] 删除成功: commentID=${commentID}`)
    
    return {
        code:200,
        msg:"删除成功"
    }
}

//获取档口的评论列表
//输入: config对象，查询参数包含{stallID, numPerPage, pageIndex}
//输出: 响应对象
//成功: {code: 200, data: {comments: Array, totalPageNum: number, pageIndex: number}}
//失败: {code: 998, msg: "token unvalid"}
const getStallCommentList = (config)=>{
    const userName = checkToken(config)
    
    if(!userName){
        return {
            code:998,
            msg:"token unvalid",
        }
    }
    
    //获取查询参数
    const search = parseURLParams(config.url)
    const stallID = parseInt(search.stallID)
    const numPerPage = parseInt(search.numPerPage) || 5
    const pageIndex = parseInt(search.pageIndex) || 1
    
    //筛选当前档口的评论
    const stallComments = commentDataBase.filter(item => item.stallID === stallID)
    
    //计算分页
    const totalComments = stallComments.length
    const totalPageNum = Math.ceil(totalComments / numPerPage)
    const startIndex = (pageIndex - 1) * numPerPage
    const endIndex = startIndex + numPerPage
    // 映射评论数据，添加 evaluation 字段
    const comments = stallComments.slice(startIndex, endIndex).map(comment => {
        const likedBy = comment.likedBy || []
        return {
            ...comment,
            evaluation: likedBy.includes(userName) ? 'like' : 'none'
        }
    })
    
    console.log(`[getStallCommentList] 档口${stallID}的评论，总数${totalComments}条，第${pageIndex}页，共${totalPageNum}页`)
    
    return {
        code:200,
        data:{
            comments: comments,
            totalPageNum: totalPageNum,
            pageIndex: pageIndex
        }
    }
}

//创建档口评论
//输入: config对象，body中包含{stallID, rating, content, picture1, picture2, picture3}
//输出: 响应对象
//成功: {code: 200, msg: "评论成功"}
//失败: {code: 998, msg: "token unvalid"}
const createStallComment = (config)=>{
    const userName = checkToken(config)
    
    if(!userName){
        return {
            code:998,
            msg:"token unvalid",
        }
    }
    
    //获取请求体
    let commentData = {}
    if (config.body instanceof FormData) {
        commentData.stallID = config.body.get('stallID')
        commentData.rating = Number(config.body.get('rating'))
        commentData.content = config.body.get('content')
        // 模拟图片上传，如果有文件则生成模拟URL
        const files = config.body.getAll('files')
        if (files.length > 0) commentData.picture1Url = '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg'
        if (files.length > 1) commentData.picture2Url = '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg'
        if (files.length > 2) commentData.picture3Url = '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg'
    } else {
        try {
            commentData = JSON.parse(config.body)
        } catch (e) {
            console.error('解析评论数据失败', e)
            // 兼容处理，如果不是JSON也不是FormData，可能需要其他处理，这里暂且忽略
        }
    }
    
    //生成新评论
    const newComment = {
        ID: commentDataBase.length + 1,
        userId: userName,
        stallID: commentData.stallID,
        stallName: '档口名称', // 实际应从档口数据库查询
        canteen: '食堂名称',
        dateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        rating: commentData.rating,
        like: 0,
        content: commentData.content,
        picture1Url: commentData.picture1Url || '',
        picture2Url: commentData.picture2Url || '',
        picture3Url: commentData.picture3Url || ''
    }
    
    //添加到数据库
    commentDataBase.unshift(newComment)
    
    console.log(`[createStallComment] 用户${userName}对档口${commentData.stallID}进行了评论`)
    
    return {
        code:200,
        msg:"评论成功"
    }
}

//评价评论（点赞/取消）
//输入: config对象，body中包含{commentID, newEvaluation}
//输出: 响应对象
//成功: {code: 200, data: {like: number}}
//失败: {code: 998, msg: "token unvalid"}
const evaluationComment = (config)=>{
    const userName = checkToken(config)
    
    if(!userName){
        return {
            code:998,
            msg:"token unvalid",
        }
    }
    
    //获取请求体
    const {commentID, newEvaluation} = JSON.parse(config.body)
    
    //查找评论
    const comment = commentDataBase.find(item => item.ID === commentID)
    
    if(!comment){
        return {
            code:999,
            msg:"评论不存在"
        }
    }
    
    // 初始化likedBy
    if (!comment.likedBy) {
        comment.likedBy = []
    }
    
    //处理点赞逻辑
    if(newEvaluation === 'like'){
        if (!comment.likedBy.includes(userName)) {
            comment.like += 1
            comment.likedBy.push(userName)
            console.log(`[evaluationComment] 用户${userName}点赞了评论${commentID}，当前点赞数: ${comment.like}`)
        } else {
            console.log(`[evaluationComment] 用户${userName}重复点赞评论${commentID}，忽略`)
        }
    }else if(newEvaluation === 'none' || newEvaluation === 'unlike'){
        if (comment.likedBy.includes(userName)) {
            comment.like = Math.max(0, comment.like - 1)
            comment.likedBy = comment.likedBy.filter(u => u !== userName)
            console.log(`[evaluationComment] 用户${userName}取消点赞评论${commentID}，当前点赞数: ${comment.like}`)
        } else {
            console.log(`[evaluationComment] 用户${userName}重复取消点赞评论${commentID}，忽略`)
        }
    }
    
    return {
        code:200,
        data:{
            like: comment.like
        }
    }
}

export default {getMyComments, deleteComment, getStallCommentList, createStallComment, evaluationComment}

// 导出评论数据库供其他模块使用
export {commentDataBase}
