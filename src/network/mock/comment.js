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
    stallName: '美味烧腊',
    canteent: '榕园食堂',
    dateTime: '2025-11-10 12:30:45',
    rating: 5.0,
    like: 23,
    content: '这家店的菜品真的很不错，味道很正宗，服务态度也很好，环境优雅，价格合理，非常推荐大家来尝试！',
    pictrue1Url: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg',
    picture2Url: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg',
    picture3Url: ''
  },
  {
    ID: 2,
    userId: 'ISeRi_NiNa',
    stallName: '老坛麻辣烫',
    canteent: '榕园食堂',
    dateTime: '2025-11-09 18:20:30',
    rating: 4.0,
    like: 15,
    content: '麻辣烫的味道还可以，选择挺多的，就是人有点多需要排队。',
    pictrue1Url: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg',
    picture2Url: '',
    picture3Url: ''
  },
  {
    ID: 3,
    userId: 'ISeRi_NiNa',
    stallName: '快乐汉堡',
    canteent: '榕园食堂',
    dateTime: '2025-11-08 13:15:20',
    rating: 5.0,
    like: 30,
    content: '汉堡超级好吃！肉饼很厚实，配菜新鲜，薯条也很脆，性价比很高！',
    pictrue1Url: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg',
    picture2Url: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg',
    picture3Url: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg'
  },
  {
    ID: 4,
    userId: 'ISeRi_NiNa',
    stallName: '手工拉面',
    canteent: '槿园食堂',
    dateTime: '2025-11-07 19:45:10',
    rating: 3.0,
    like: 8,
    content: '面条味道一般，汤头有点咸，不过价格便宜。',
    pictrue1Url: '',
    picture2Url: '',
    picture3Url: ''
  },
  {
    ID: 5,
    userId: 'ISeRi_NiNa',
    stallName: '黄焖鸡米饭',
    canteent: '槿园食堂',
    dateTime: '2025-11-06 12:00:00',
    rating: 4.0,
    like: 18,
    content: '黄焖鸡做得不错，鸡肉很嫩，酱汁入味，配菜丰富，值得一试。',
    pictrue1Url: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg',
    picture2Url: '',
    picture3Url: ''
  },
  {
    ID: 6,
    userId: 'AWa_SuBaRu',
    stallName: '美味烧腊',
    canteent: '荔园食堂',
    dateTime: '2025-11-05 11:30:00',
    rating: 5.0,
    like: 42,
    content: '非常棒的体验！',
    pictrue1Url: '',
    picture2Url: '',
    picture3Url: ''
  },
  {
    ID: 7,
    userId: 'ISeRi_NiNa',
    stallName: '鲜榨果汁',
    canteent: '荔园食堂',
    dateTime: '2025-11-04 14:20:00',
    rating: 4.0,
    like: 12,
    content: '性价比不错，下次还会来。',
    pictrue1Url: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg',
    picture2Url: '',
    picture3Url: ''
  },
  {
    ID: 8,
    userId: 'ISeRi_NiNa',
    stallName: '老坛麻辣烫',
    canteent: '荔园食堂',
    dateTime: '2025-11-03 17:30:00',
    rating: 5.0,
    like: 35,
    content: '超级满意！强烈推荐给大家，环境卫生，服务周到，价格实惠。',
    pictrue1Url: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg',
    picture2Url: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg',
    picture3Url: ''
  },
  {
    ID: 9,
    userId: 'ISeRi_NiNa',
    stallName: '手工拉面',
    canteent: '槿园食堂',
    dateTime: '2025-11-02 12:45:00',
    rating: 3.0,
    like: 5,
    content: '一般般吧，没有特别出彩的地方。',
    pictrue1Url: '',
    picture2Url: '',
    picture3Url: ''
  },
  {
    ID: 10,
    userId: 'ISeRi_NiNa',
    stallName: '黄焖鸡米饭',
    canteent: '槿园食堂',
    dateTime: '2025-11-01 13:00:00',
    rating: 4.0,
    like: 20,
    content: '味道还不错，就是等待时间有点长。',
    pictrue1Url: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg',
    picture2Url: '',
    picture3Url: ''
  },
  {
    ID: 11,
    userId: 'ISeRi_NiNa',
    stallName: '快乐汉堡',
    canteent: '槿园食堂',
    dateTime: '2025-10-31 18:00:00',
    rating: 5.0,
    like: 28,
    content: '太好吃了！每次来都很满意，店家态度很好。',
    pictrue1Url: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg',
    picture2Url: '',
    picture3Url: ''
  },
  {
    ID: 12,
    userId: 'ISeRi_NiNa',
    stallName: '鲜榨果汁',
    canteent: '荔园食堂',
    dateTime: '2025-10-30 15:30:00',
    rating: 4.0,
    like: 16,
    content: '口味适中，分量足，值得一试。',
    pictrue1Url: '',
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

export default {getMyComments, deleteComment}
