<script setup>
import { ElMessage } from "element-plus"
import {ref,reactive,getCurrentInstance,onMounted} from "vue"
const {proxy} = getCurrentInstance()


//档口列表部分
const pagination = reactive({
  pageIndex:1,
  numPerPage: 10,
  totalPageNum: 0
})
const searchForm = reactive({
    name:"",
    type:"全部",
    canteen:"全部"
})
const canteenList = ref([
  "全部","榕园食堂","荔园食堂","槿园食堂","若海食堂"
])
const typeList = ref([
  "全部","烧腊","汉堡","粉面","自选","烩饭"
])
const stallList = ref([])

const initPagination = ()=>{
  pagination.pageIndex=1;
  pagination.numPerPage=10;
  pagination.totalPageNum=0;
}
const clearSearchForm = ()=>{
  searchForm.name="";
  searchForm.type="全部";
  searchForm.canteen="全部"
}
const getStallList = async ()=>{
  try{
    const {totalPageNum,...tempPagination} = pagination  //剔除totalPageNum字段
    const search = {
      ...searchForm,
      ...tempPagination
    }
    const data = await proxy.$stallManageApi.getStallList(search)
    stallList.value = data.stallList
    pagination.pageIndex = data.pageIndex
    pagination.totalPageNum = data.totalPageNum
  }catch(error){
    console.log(error)
    ElMessage.error("加载档口列表失败")
  }
}
const handleReset = ()=>{
  clearSearchForm()
  initPagination()
  getStallList()
}

//档口添加和编辑
const stallInfoForm = reactive({
  ID:0,
  name:"",
  canteen:"",
  type:"",
  introduction:"",
  pictureUrl:""
})
const stallPictureFile = ref(null)
const stallInfoFormRules = reactive({
  name: [
    { required: true, message: "请输入档口名", trigger: ["blur"] },
    { max: 15, message:"档口名字最长15字", trigger:["blur","change"]}
  ],
  introduction: [
    { required:true,message:"请输入档口简介",trigger:["blur"]},
    { max: 100, message: "档口简介最多输入100个字", trigger: ["blur", "change"] }
  ]
})
const stallInfoStatus = ref("新增")
const isShowStallInfoDialogue = ref(false)
const currentRow =ref(null)
const isStallFormLoading = ref(false)

const showStallInfoDialogue = (status)=>{
  stallInfoStatus.value=status;
  isShowStallInfoDialogue.value=true;
}
const clearStallInfoForm = ()=>{
  stallInfoForm.ID=0
  stallInfoForm.name=""
  stallInfoForm.canteen="全部"
  stallInfoForm.type="全部"
  stallInfoForm.introduction=""
  stallInfoForm.pictureUrl=""
  stallPictureFile.value=null
  proxy.$refs["stallFormInstance"].clearValidate()
}
const loadStallInfoForm = ()=>{
  stallInfoForm.ID = currentRow.value.ID || 0
  stallInfoForm.name=currentRow.value.name || ""
  stallInfoForm.canteen=currentRow.value.canteen || ""
  stallInfoForm.type=currentRow.value.type || ""
  stallInfoForm.introduction=currentRow.value.introduction || ""
  stallInfoForm.pictureUrl=currentRow.value.pictureUrl || ""
  stallPictureFile.value=null
}
const checkPictureFile = (rawFile) => {
  const allowedTypes = ['image/jpeg', 'image/png']; 
  const allowedExtensions = ['.jpg', '.jpeg', '.png'];
  const fileExtension = rawFile.name.slice(rawFile.name.lastIndexOf('.')).toLowerCase(); 

  
  //校验类型
  if (!allowedTypes.includes(rawFile.type) && !allowedExtensions.includes(fileExtension)) {
    ElMessage.error(`仅支持上传 ${allowedExtensions.join('、')} 格式的图片！`);
    return false;
  }

  //大小限制3MB
  const maxSize = 3 * 1024 * 1024; // 2MB 对应的字节数
  if (rawFile.size > maxSize) {
    ElMessage.error(`图片大小不能超过 ${maxSize / 1024 / 1024}MB`);
    return false; 
  }

  //所有校验通过
  return true;
};
const handleEditStall = (row)=>{
  currentRow.value=row
  loadStallInfoForm()
  showStallInfoDialogue("编辑")
}
const handleAddStall = ()=>{
  clearSearchForm()
  showStallInfoDialogue("新增")
}
const handleStallCancel= ()=>{
  if(stallInfoStatus.value==="编辑"){
    loadStallInfoForm()
  }else{
    clearStallInfoForm()
  }
}
const handleStallConfirm = ()=>{
  proxy.$refs["stallFormInstance"].validate(async (valid)=>{
    if(valid){
      //生成formData
      const formData = new FormData()
      if(stallInfoStatus.value==="编辑"){
        formData.append('ID',stallInfoForm.ID)
      }
      formData.append('name',stallInfoForm.name)
      formData.append('type',stallInfoForm.type)
      formData.append('canteen',stallInfoForm.canteen)
      formData.append('introduction',stallInfoForm.introduction)
      if(stallPictureFile.value!==null){
        formData.append('picture',stallPictureFile.value)
      }

      //调用远程接口
      if(stallInfoStatus.value==="新增"){
        try{
          isStallFormLoading.value=true
          await proxy.$stallManageApi.addStall(formData)
          ElMessage.success("添加成功")
          clearStallInfoForm()
          getStallList()
        }catch(error){
          console.log(error)
          ElMessage.error("添加失败")
        }finally{
          isStallFormLoading.value=false
        }
      }else{
        isStallFormLoading.value=true
        try{
          await proxy.$stallManageApi.editStallInfo(formData)
          ElMessage.success("修改成功")
          getStallList()
        }catch(error){
          console.log(error)
          ElMessage.error("编辑失败")
        }finally{
          isStallFormLoading.value=false
        }
      }
    }else{
      ElMessage.warning("请正确输入信息")
    }
  })
}
const handleFileChange = (uploadFile)=>{
  if(!checkPictureFile(uploadFile.raw)){
    return;
  }
  stallPictureFile.value = uploadFile.raw
  stallInfoForm.pictureUrl = URL.createObjectURL(stallPictureFile.value)
}
const handleDeleteStall = async (row)=>{
  ElMessageBox.confirm(
    `确定删除档口:${row.name}?`,
    "删除提醒",
    {
      type:"warning",
      confirmButtonText:"确认删除",
      confirmButtonClass: "el-button--danger",
      cancelButtonText:"取消",
      closeOnClickModal: false
    }
  ).then(async ()=>{
    try{
      await proxy.$stallManageApi.deleteStall({ID:row.ID})
      ElMessage.success("删除档口："+row.name + " 成功!")
      getStallList()
    }catch(error){
      console.log(error)
      ElMessage.error("删除失败")
    }
  }).catch(error=>{
    console.log(error)
  })
}

//菜品对话框弹出
const dishList = ref([])
const dishForm = reactive({
  stallID:0,
  stallName:"",
  canteen:"",
  ID:0,
  name:"",
  like:0,
  bad:0,
  price:0,
  pictureUrl:""
})
const dishFormRules = reactive({
  name : [
    { required: true, message: "请输入旧密码", trigger: ["blur"] },
    { max: 15, message: "菜品名不能超过15字", trigger: ["blur"] }
  ],
  price: [
    { required: true, message: "请输入菜品价格", trigger: ["blur"] },
    { 
      validator: (rule,value,callback)=>{
        if(value==="" || value===null || isNaN(value) || Number(value)<=0 || Number(value)>1000){
          callback(new Error("价格只能为不大于1000的正数"))
        }
        callback()
      },
      trigger: 'blur'
     }
  ]
})
const dishPictureFile = ref(null)
const dishFormStatus = ref("新增")
const isShowDishDialogue = ref(false)
const isDishFormLoading = ref(false)

const showDishForm = ()=>{
  isShowDishDialogue.value=true
}
const loadDishList = async ()=>{
  try{
    isDishFormLoading.value=true
    const data = await proxy.$stallManageApi.getDishList({stallID:dishForm.stallID})
    dishList.value=data.dishList
  }catch(error){
    console.log(error)
    ElMessage.error("获取菜品列表失败")
  }finally{
    isDishFormLoading.value=false
  }
}
const clearDishForm = ()=>{
  dishForm.ID=null
  dishForm.name=""
  dishForm.like=0
  dishForm.bad=0
  dishForm.price=0
  dishForm.pictureUrl=""
  dishPictureFile.value=null
  proxy.$refs["dishFormInstance"].clearValidate()
}
const handleEditDish = (row)=>{
  dishForm.stallID=row.ID
  dishForm.stallName=row.name
  dishForm.canteen=row.canteen
  dishFormStatus.value="新增"
  loadDishList()
  showDishForm()
}
const handleDishClick = (dish)=>{
  dishForm.ID=dish.ID
  dishForm.name=dish.name
  dishForm.like=dish.like
  dishForm.bad=dish.bad
  dishForm.price=dish.price
  dishForm.pictureUrl=dish.pictureUrl
  dishPictureFile.value=null
  proxy.$refs["dishFormInstance"].clearValidate()
  dishFormStatus.value="编辑"
}
const handleDishCancel = ()=>{
  clearDishForm()
  dishFormStatus.value="新增"
}
const handleDishFileChange = (uploadFile)=>{
  if(!checkPictureFile(uploadFile.raw)){
    return;
  }
  dishPictureFile.value=uploadFile.raw
  dishForm.pictureUrl = URL.createObjectURL(dishPictureFile.value)
}
const handleDishClose = ()=>{
  clearDishForm()
  dishFormStatus.value="新增"
}
const handleDishConfirm = ()=>{
  proxy.$refs["dishFormInstance"].validate(async (valid)=>{
    if(valid){
      //生成formdata
      const formData = new FormData()
      if(dishFormStatus.value==="编辑"){
        formData.append('ID',dishForm.ID)
      }
      if(dishFormStatus.value==="新增"){
        formData.append('stallID',dishForm.stallID)
      }
      formData.append('name',dishForm.name)
      formData.append('price',dishForm.price)
      if(dishPictureFile.value!==null){
        formData.append('picture',dishPictureFile.value)
      }

      if(dishFormStatus.value==="新增"){
        try{
          await proxy.$stallManageApi.addDish(formData)
          ElMessage.success("添加菜品: "+dishForm.name+" 成功")
          clearDishForm()
          loadDishList()
        }catch(error){
          ElMessage.error("添加菜品失败")
        }
      }else{
        try{
          await proxy.$stallManageApi.editDishInfo(formData)
          ElMessage.success("修改菜品信息成功")
          clearDishForm()
          loadDishList()
        }catch(error){
          ElMessage.error("修改菜品失败")
        }
      }
    }else{
      ElMessage.error("请输入正确的菜品信息")
    }
  })
}
const handleDeleteDish = ()=>{
  if(dishForm.ID!==null){
    ElMessageBox.confirm(
      `确定删除菜品:${dishForm.name}?`,
      "删除提醒",
      {
        type:"warning",
        confirmButtonText:"确认删除",
        confirmButtonClass: "el-button--danger",
        cancelButtonText:"取消",
        closeOnClickModal: false
      }
    ).then( async ()=>{
      try{
        await proxy.$stallManageApi.deleteDish({ID:dishForm.ID})
        ElMessage.success(`删除菜品:${dishForm.name} 成功!`) 
        clearDishForm()
        loadDishList()
      }catch(error){
        ElMessage.error("删除菜品失败")
      }
    }).catch(error=>{})

  }else{
    ElMessage.warning("请先选择一个待删除的菜品")
  }
}



onMounted(()=>{
  getStallList()
})



</script>


<template>
  <div class="stall-manage-root">
    <div class="stall-manage-page">
      <div class="page-header">
        <div class="header-left">
          <el-button type="primary" style="width:80px" @click="handleAddStall">新增档口</el-button>
        </div>

        <div class="header-right">
          <el-form :model="searchForm" inline class="search-form">
            <el-form-item label="地点" class="form-item">
              <el-select v-model="searchForm.canteen" placeholder="请选择">
                <!-- options 填充由逻辑层负责 -->
                <el-option
                  v-for="(name,index) in canteenList"
                  :key="index"
                  :label="name"
                  :value="name"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="类别" class="form-item">
              <el-select v-model="searchForm.type" placeholder="请选择">
                <el-option
                  v-for="(type, index) in typeList"
                  :key="index"
                  :label="type"
                  :value="type"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="名字" class="form-item" >
              <el-input v-model="searchForm.name" placeholder="档口名称" clearable style="width:200px"></el-input>
            </el-form-item>

            <el-form-item class="form-item">
              <el-button type="primary" @click="getStallList">搜索</el-button>
            </el-form-item>
            <el-form-item class="form-item">
              <el-button type="danger" @click="handleReset">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div class="page-body">
        <el-table :data="stallList" stripe style="width: 100%" class="stall-table">
          <el-table-column prop="name" label="名字" width="200" align="center" />
          <el-table-column prop="canteen" label="地点" width="150" align="center" />
          <el-table-column prop="type" label="类别" width="150" align="center" />
          <el-table-column prop="rating" label="评分" width="150" align="center" />
          <el-table-column prop="meanPrice" label="人均价格(元)" width="150" align="center" />

          <el-table-column label="操作" align="center"  >
            <template #default="{ row }">
              <el-button type="primary" plain size="small" class="op-btn" @click="handleEditStall(row)">编辑档口</el-button>
              <el-button type="danger" plain size="small" class="op-btn" @click="handleDeleteStall(row)">删除</el-button>
              <el-button type="info" plain size="small" class="op-btn" @click="handleEditDish(row)">编辑菜品</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="page-footer">
        <el-pagination
          background
          layout="prev, pager, next"
          v-model:current-page="pagination.pageIndex"
          :page-size="pagination.numPerPage"
          :total="pagination.totalPageNum * pagination.numPerPage"
          class="pagination"
          @current-change="getStallList"
        />
      </div>
    </div>

    <!-- 新增/编辑档口对话框（与 .stall-manage-page 平行） -->
    <el-dialog
      :title="stallInfoStatus + '档口'"
      v-model="isShowStallInfoDialogue"
      width="720px"
      custom-class="stall-info-dialog"
      :destroy-on-close="true"
      @close="clearStallInfoForm"
    >
      <div class="stall-dialog-body">
        <div class="left-col">
          <el-form :model="stallInfoForm" label-width="80px" label-position="right" ref="stallFormInstance" :rules="stallInfoFormRules">
            <el-form-item label="档口名" prop="name">
              <el-input v-model="stallInfoForm.name" placeholder="请输入档口名称" :disable="isStallFormLoading"></el-input>
            </el-form-item>

            <el-form-item label="地点" prop="canteen">
              <el-select v-model="stallInfoForm.canteen" placeholder="请选择地点" :disable="isStallFormLoading">
                <template v-for="(canteen, index) in canteenList" :key="index">
                  <el-option
                    v-if="index!==0"
                    :label="canteen"
                    :value="canteen"
                  />
                </template>
              </el-select>
            </el-form-item>

            <el-form-item label="类型" prop="type">
              <el-select v-model="stallInfoForm.type" placeholder="请选择类型" :disable="isStallFormLoading">
                <template v-for="(type, index) in typeList" :key="index">
                  <el-option
                    v-if="index!==0"
                    :label="type"
                    :value="type"
                  />
                </template>
              </el-select>
            </el-form-item>

            <el-form-item label="简介" prop="introduction">
              <el-input type="textarea" v-model="stallInfoForm.introduction" placeholder="档口介绍(限制100字)" :rows="4" :disable="isStallFormLoading"/>
            </el-form-item>
          </el-form>
        </div>

        <div class="right-col">
          <div class="upload-preview">
            <div class="preview-box">
              <img v-if="stallInfoForm.pictureUrl" :src="stallInfoForm.pictureUrl" alt="预览" />
              <div v-else class="preview-empty">预览图片</div>
            </div>

            <el-upload
              class="upload-area"
              :show-file-list="false"
              :auto-upload="false" 
              :disable="isStallFormLoading"
              :on-change="handleFileChange"
            >
              <el-button size="small">上传图片</el-button>
              <div class="upload-hint">支持 jpg/png，大小小于3MB</div>
            </el-upload>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer-actions">
          <el-button @click="handleStallCancel" :disable="isStallFormLoading">取消</el-button>
          <el-button @click="handleStallConfirm" type="primary" :disable="isStallFormLoading" >确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 编辑菜品信息对话框（与 .stall-manage-page 平行） -->
    <el-dialog
      :title="`编辑 - ${dishForm.stallName} - 菜品信息`"
      v-model="isShowDishDialogue"
      width="900px"
      custom-class="dish-info-dialog"
      @close="handleDishClose"
    >
      <div class="dish-dialog-body">
        <div class="dish-left-col">
          <div class="dish-list-wrapper">
            <template v-if="isDishFormLoading">
              <div class="dish-list-loading">
                <div class="dish-loading-box">正在加载菜品信息...</div>
              </div>
            </template>
            <template v-else>
              <div class="dish-list-container">
                <template v-if="!dishList || dishList.length === 0">
                  <div class="dish-empty-state">
                    <div class="empty-box">当前档口暂无菜品</div>
                  </div>
                </template>
                <template v-else>
                  <div class="dish-grid">
                    <div
                      v-for="dish in dishList"
                      :key="dish.ID"
                      class="dish-item"
                      @click="handleDishClick(dish)"
                    >
                      <div class="dish-item-image">
                        <img :src="dish.pictureUrl" :alt="dish.name" />
                      </div>
                      <div class="dish-item-name">{{ dish.name }}</div>
                    </div>
                  </div>
                </template>
              </div>
            </template>
            <el-button type="danger" size="small" class="delete-dish-btn" @click="handleDeleteDish">删除</el-button>
          </div>
        </div>

        <div class="dish-right-col">
          <div class="dish-upload-preview">
            <div class="dish-preview-box">
              <img v-if="dishForm.pictureUrl" :src="dishForm.pictureUrl" alt="菜品预览" />
              <div v-else class="dish-preview-empty">上传图片</div>
            </div>

            <el-upload
              class="dish-upload-area"
              :show-file-list="false"
              :auto-upload="false"
              :disabled="isDishFormLoading"
              :on-change="handleDishFileChange"
            >
              <el-button size="small">选择图片</el-button>
              <div class="upload-hint">支持 jpg/png，大小小于3MB</div>
            </el-upload>
          </div>

          <el-form :model="dishForm" label-width="60px" label-position="right" ref="dishFormInstance" :rules="dishFormRules">
            <el-form-item label="名字" prop="name">
              <el-input v-model="dishForm.name" placeholder="菜品名称" :disabled="isDishFormLoading"></el-input>
            </el-form-item>

            <el-form-item label="点赞数" prop="like">
              <el-input v-model.number="dishForm.like" type="number" placeholder="点赞数" disabled></el-input>
            </el-form-item>

            <el-form-item label="踩数" prop="bad">
              <el-input v-model.number="dishForm.bad" type="number" placeholder="踩数" disabled></el-input>
            </el-form-item>

            <el-form-item label="价格" prop="price">
              <el-input v-model.number="dishForm.price" type="number" placeholder="请输入价格" :disabled="isDishFormLoading"></el-input>
            </el-form-item>

              <div class="mode-display">当前模式：{{ dishFormStatus }}</div>
          </el-form>

          <div class="dish-form-actions">
            <el-button @click="handleDishCancel" :disabled="isDishFormLoading">取消</el-button>
            <el-button @click="handleDishConfirm" type="primary" :disabled="isDishFormLoading">确定</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>


<style scoped lang="less">
.stall-manage-root{
  background: #f7f7f8;
  width:100%;
}

.stall-manage-page{
  padding: 18px;
  background: #f7f7f8;
  margin:0;

  .page-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;
  }

  .header-left{
    display: flex;
    align-items: center;
  }

  .header-right{
    display: flex;
    align-items: center;
  }

  .search-form{
    background: transparent;
    display: flex;
    gap:10px;
    .el-select{
        width:150px;
    }
  }

  .form-item{
    margin-right: 0px;
  }

  .page-body{
    background: transparent;
    min-height: 480px;
  }

  .stall-table{
    background: #ffffff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 6px 20px rgba(20,30,44,0.04);
  }

  .op-btn{
    margin-right: 8px;
  }

  .page-footer{
    display: flex;
    justify-content: center;
    padding-top: 16px;
  }
}

/* 对话框样式 */
.stall-info-dialog .el-dialog__body{
  padding: 18px 24px;
}
.stall-dialog-body{
  display: flex;
  gap: 18px;
}
.stall-dialog-body .left-col{
  flex: 1 1 60%;
}
.stall-dialog-body .right-col{
  width: 260px;
  display: flex;
  align-items: flex-start;
}
.upload-preview{
  display:flex;
  flex-direction:column;
  gap:12px;
  width:100%;
}
.preview-box{
  width:100%;
  height:160px;
  background:#fff;
  border:1px dashed #e9e9e9;
  border-radius:6px;
  display:flex;
  align-items:center;
  justify-content:center;
  overflow:hidden;
}
.preview-box img{
  max-width:100%;
  max-height:100%;
  object-fit:cover;
}
.preview-empty{
  color:#999;
}
.upload-area{
  display:flex;
  flex-direction:column;
  gap:6px
}
.upload-hint{
  font-size:12px;
  color:#999;
  margin-left:10px;
}
.dialog-footer-actions{
  display:flex;
  justify-content:flex-end;
  gap:8px
}

/* 编辑菜品对话框样式 */
.dish-info-dialog .el-dialog__body{
  padding: 18px 24px;
}
.dish-dialog-body{
  display: flex;
  gap: 18px;
  padding: 15px;
}
.dish-left-col{
  flex: 1 1 55%;
}
.dish-list-wrapper{
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.dish-list-container{
  flex: 1;
  width:100%;
  height: 400px;
  background:#fff;
  border-radius:6px;
  padding:12px;
  border:1px solid #e9e9e9;
}
/* 加载状态样式 */
.dish-list-loading{
  flex: 1;
  display:flex;
  align-items:center;
  justify-content:center;
  height:400px;
}
.dish-loading-box{
  background:#fff;
  padding:16px 20px;
  border-radius:6px;
  box-shadow: 0 6px 20px rgba(20,30,44,0.04);
  color:#666;
}
.dish-empty-state{
  height: 100%;
  display:flex;
  align-items:center;
  justify-content:center;
}
.empty-box{
  background:#fff;
  padding:18px 22px;
  border-radius:6px;
  color:#999;
  box-shadow: 0 6px 20px rgba(20,30,44,0.04);
}
.delete-dish-btn{
  flex-shrink: 0;
  height: fit-content;
  margin-top: 0;
}
.dish-grid{
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
}
.dish-item{
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.3s;
  
  &:hover{
    background: #f5f5f5;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }
}
.dish-item-image{
  width: 100%;
  height: 100px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dish-item-image img{
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.dish-item-name{
  text-align: center;
  font-size: 12px;
  color: #333;
  word-break: break-word;
  line-height: 1.3;
  max-height: 2.6em;
  overflow: hidden;
}
.dish-right-col{
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.dish-upload-preview{
  display:flex;
  flex-direction:column;
  gap:12px;
  width:100%;
}
.dish-preview-box{
  width:100%;
  height:180px;
  background:#fff;
  border:1px dashed #e9e9e9;
  border-radius:6px;
  display:flex;
  align-items:center;
  justify-content:center;
  overflow:hidden;
}
.dish-preview-box img{
  max-width:100%;
  max-height:100%;
  object-fit:cover;
}
.dish-preview-empty{
  color:#999;
  font-size:14px;
}
.dish-upload-area{
  display:flex;
  flex-direction:column;
  gap:6px
}
.upload-hint{
  font-size:12px;
  color:#999;
  margin-left:10px;
}
.mode-display{
  color: #666;
  font-size: 14px;
  padding: 8px 0;
  display: flex;
  justify-content: flex-end;
}
.dish-form-actions{
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
}

/* 小屏适配 */
@media (max-width: 800px){
  .stall-manage-page .page-header{
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  .stall-manage-page .header-right .el-form{justify-content: flex-start}

  .stall-dialog-body{flex-direction:column}
  .stall-dialog-body .right-col{width:100%}

  .dish-dialog-body{flex-direction:column}
  .dish-right-col{width:100%}
  .dish-grid{grid-template-columns: repeat(3, 1fr)}
}
</style>