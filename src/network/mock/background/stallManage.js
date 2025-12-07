import admin from "@/network/mock/background/admin.js"


//档口数据库
let stallDataBase = [
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
//菜品数据库（模拟数据，20 条）
let dishDataBase = [
    { ID: 1, name: '红烧肉', price: 28.5, like: 320, bad: 12, pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg', stallID: 1 },
    { ID: 2, name: '宫保鸡丁', price: 22.0, like: 210, bad: 8, pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg', stallID: 1 },
    { ID: 3, name: '麻辣香锅', price: 36.0, like: 412, bad: 20, pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg', stallID: 1 },
    { ID: 4, name: '辣子鸡', price: 30.0, like: 289, bad: 15, pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg', stallID: 2 },
    { ID: 5, name: '酸辣土豆丝', price: 10.0, like: 95, bad: 3, pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg', stallID: 2 },
    { ID: 6, name: '回锅肉', price: 26.0, like: 180, bad: 9, pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg', stallID: 2 },
    { ID: 7, name: '鱼香茄子', price: 18.5, like: 155, bad: 7, pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg', stallID: 3 },
    { ID: 8, name: '宫廷豆腐', price: 16.0, like: 88, bad: 4, pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg', stallID: 3 },
    { ID: 9, name: '麻婆豆腐', price: 15.0, like: 230, bad: 6, pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg', stallID: 3 },
    { ID: 10, name: '三杯鸡', price: 34.0, like: 142, bad: 5, pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg', stallID: 3 },
    { ID: 11, name: '糖醋里脊', price: 29.0, like: 260, bad: 11, pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg', stallID: 3 },
    { ID: 12, name: '香菇滑鸡', price: 24.0, like: 132, bad: 6, pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg', stallID: 3 },
    { ID: 13, name: '韩式拌饭', price: 20.0, like: 178, bad: 9, pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg', stallID: 3 },
    { ID: 14, name: '牛肉面', price: 26.5, like: 301, bad: 14, pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg', stallID: 3 },
    { ID: 15, name: '葱油拌面', price: 12.0, like: 67, bad: 2, pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg', stallID: 3 },
    { ID: 16, name: '叉烧包', price: 9.0, like: 98, bad: 3, pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg', stallID: 4 },
    { ID: 17, name: '肠粉', price: 11.5, like: 120, bad: 5, pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg', stallID: 5 },
    { ID: 18, name: '生煎包', price: 10.0, like: 210, bad: 6, pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg', stallID: 6 },
    { ID: 19, name: '皮蛋瘦肉粥', price: 13.0, like: 85, bad: 1, pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg', stallID: 7 },
    { ID: 20, name: '烤鱼', price: 48.0, like: 432, bad: 22, pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar2.jpg', stallID: 8 }
]



//获取档口列表
const getStallList = (config)=>{
    const ID = admin.checkToken(config)
    //检查token
    if(!ID){
        return {
            code:997,
            msg:"admin token unvalid"
        }
    }
    //解析查询参数
    const search = admin.parseURLParams(config.url)
    let type = search.type || '全部'
    let canteen = search.canteen || '全部'
    let name = search.name || ''
    let numPerPage = parseInt(search.numPerPage || 5)
    let pageIndex = parseInt(search.pageIndex || 1)

    //查询过滤
    let targetList = stallDataBase;
    if(type!=='全部'){
        targetList = targetList.filter(item=>{return item.type===type})
    }
    if(canteen!=='全部'){
        targetList = targetList.filter(item=>{return item.canteen===canteen})
    }
    if(name!==''){
        targetList = targetList.filter(item=>{return item.name.includes(name)})
    }

    //数量筛选
    let num = numPerPage
    let begin = (pageIndex-1)*numPerPage;
    let totalPageNum = Math.ceil(targetList.length/numPerPage)
    if(begin<0||begin+num>targetList.length){
        //超出时返回回最后一页
        pageIndex=totalPageNum
        begin = (pageIndex-1)*numPerPage;
        num=targetList.length-begin;
    }
    targetList=targetList.slice(begin,begin+num)

    //返回
    return {
        code:200,
        data:{
            stallList:targetList,
            totalPageNum,
            pageIndex,
        }
    }
}
//新增档口
const addStall = (config)=>{
    const ID = admin.checkToken(config)
    if(!ID){
        return {
            code:997,
            msg:"admin token unvalid"
        }
    }
    //前端解析不了二进制文件，意思一下即可
    const newStallInfo = {
        ID: stallDataBase.length+1,
        name: '火炙李健洋',
        rating: 5.0,
        meanPrice: 666.0,
        canteen: '若海食堂',
        signatureDish: '李健洋刺身',
        pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg',
        type: '烧腊',
        introduction: '正宗广式烧腊，酱汁浓郁，肉质鲜嫩。'
    }
    stallDataBase.push(newStallInfo)
    //返回
    return {
        code:200,
        msg:"添加成果"
    }
}
//编辑档口
const editStallInfo = (config)=>{
    const ID = admin.checkToken(config)
    if(!ID){
        return {
            code:997,
            msg:"admin token unvalid"
        }
    }
    //连stallID都拿不到，只能模拟
    console.log("mock 修改档口信息成功")
    return{
        code:200,
        msg:"修改成功"
    }
}
//删除档口
const deleteStall = (config)=>{
    const ID = admin.checkToken(config)
    if(!ID){
        return {
            code:997,
            msg:"admin token unvalid"
        }
    }
    const stallID = JSON.parse(config.body).ID
    stallDataBase = stallDataBase.filter(item=>{return item.ID!==stallID})
    return{
        code:200,
        msg:"删除成功"
    }
    
}



//获取菜品列表
const getDishList = (config)=>{
    const ID = admin.checkToken(config)
    if(!ID){
        return {
            code:997,
            msg:"admin token unvalid"
        }
    }
    const stallID = parseInt(admin.parseURLParams(config.url).stallID)
    const targetList = dishDataBase.filter(item=>{return item.stallID===stallID})
    return {
        code:200,
        data:{
            dishList:targetList
        }
    }
}
//添加菜品
const addDish = (config)=>{
    console.log("aaa")
    const ID = admin.checkToken(config)
    if(!ID){
        return {
            code:997,
            msg:"admin token unvalid"
        }
    }
    //随便添加一个
    const newDishInfo = {
        ID: dishDataBase.length+1,
        name: '红烧李健洋', 
        price: 28.5, 
        like: 0, 
        bad: 999, 
        pictureUrl: '/src/assets/imgs/defaultAvatar/defaultAvatar1.jpg', 
        stallID: 1 
    }
    dishDataBase.push(newDishInfo)
    //返回
    return{
        code:200,
        msg:"添加成功"
    }
}
//编辑菜品
const editDishInfo = (config)=>{
    const ID = admin.checkToken(config)
    if(!ID){
        return {
            code:997,
            msg:"admin token unvalid"
        }
    }
    console.log("编辑菜品成功")
    return {
        code:200,
        msg:"编辑菜品成功"
    }
}
//删除菜品
const deleteDish = (config)=>{
    const ID = admin.checkToken(config)
    if(!ID){
        return {
            code:997,
            msg:"admin token unvalid"
        }
    }
    const search = JSON.parse(config.body)
    const dishID = search.ID
    dishDataBase = dishDataBase.filter(item=>{return item.ID!==dishID})
    return{
        code:200,
        msg:"删除菜品成功"
    }
    
}

export default {getStallList,addStall,editStallInfo,deleteStall,getDishList,addDish,editDishInfo,deleteDish}