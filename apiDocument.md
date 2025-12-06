# 网络请求接口文档

## 页面路径组织

### 客户端

**域名：** ljy.nb.cn

| 主页面           | /home                                     |
| ---------------- | ----------------------------------------- |
| **登录**         | **/user/login**                           |
| **注册**         | **/user/signUp**                          |
| **用户个人信息** | **/user/personalInfo**                    |
| **修改密码**     | **/user/editPassword**                    |
| **我的评论**     | **/user/myComment**                       |
| **美食点评**     | **/foodReview**                           |
| **档口详情**     | **/foodReview/stall?stallID=123**         |
| **档口完整菜单** | **/foodReview/stall/dish?stallID=123**    |
| **档口全部评论** | **/foodReview/stall/comment?stallID=123** |

### 服务端(后台管理)

| 登陆         | /background/#/login |
| ------------ | ---- |
| **首页**     | **/background/#/home** |
| **用户管理** | **/background/#/userManage** |
| **档口管理** | **/background/#/stallManage** |
| **管理员管理** | **/background/#/adminManage** |





## 客户端接口说明

### 基本请求格式(只是大概，具体以下面详细说明为准)

- **get请求格式:**

​	**查询参数写到url查询字符串里面**

​	**(查询字符串的字段只能为字符串类型，解析成JSON是字段类型为string)**

​	**比如查询某个档口的信息：api/food/stall/getInfo?stallId=123**



- **post请求格式:**

	**以JSON的格式，将数据放在body字段里面**




- **响应格式：**

​	**int code(200:成功，999:失败，998: 客户端token验证失败，997：服务端token验证失败)**

​	**string msg(一些说明，比如失败时的具体信息)** 

​	**class data(传具体的数据)**

**PS:code必须有，msg和data视具有业务决定是否添加**

​	**没特殊说明，body部分用json编码**



### toke验证逻辑

- **除了某些特殊请求，大部分的请求都需要token验证**
- **token附在请求报文的authorization字段**
- **需要token的接口：** 若token有问题，则在code字段返回998
- **不需要token的接口：** 正常返回即可
- **所有的需要token的接口，都会在请求成功后的data字段中加上token字段，以更新token**



### 特殊的接口

#### 登陆状态验证

- **路径：/api/checkToken**

- **说明：** 就是单纯验证一下当前用户是否登陆，非登陆状态访问非法页面，就跳到登陆页面

- **是否需要token：是**

- **类型：get**

- **请求格式：**

	空

- **响应格式（成功）：**

​	int code:200,

- **响应格式（失败）：**

​	int code:998,



### 主页面宣传图相关的接口

**现阶段我们先强制写死在静态资源中，以后再考虑要不要加上让用户自由更改的功能**





### 用户信息相关的接口

#### 登陆验证

- **路径：/api/user/login**

- **是否需要token：否**

- **类型：post**

- **请求格式：**

	string userName,

	string password

- **响应格式（成功）：**

​	int code:200,

​	class data:

​		string token

- **响应格式（失败）：**

​	int code:999,

​	msg:”用户不存在”|“密码错误”



#### 注册

- **路径：/api/user/signUp**

- **是否需要token：否**

- **类型：post**

- **请求格式：**

	string userName,

	string nickName,

	string password

- **响应格式（成功）：**

​	int code:200,

- **响应格式（失败）：**

​	int code:999,

​	msg:"用户名已存在"(后端可自由决定，甚至可以没有)



#### 用户信息修改

- **路径：/api/user/editInfo**

- **是否需要token：是**

- **类型：post**

- **请求格式（使用mutipart/formdata格式来传）：**

	string nickName,

	avatar(传图片,限制jpg和png格式，3MB一张图片),

- **响应格式（成功）：**

​	int code:200,

- **响应格式（失败）：**

​	int code:999,

​	msg:(后端可自由决定，甚至可以没有)



#### 用户密码修改

- **路径：/api/user/editPassword**

- **是否需要token：是**

- **类型：post**

- **请求格式：**

  string password

  string newPassword

- **响应格式（成功）：**

​	int code:200,

- **响应格式（失败）：**

​	int code:999,

​	msg:(后端可自由决定，甚至可以没有)



#### 获取用户信息

- **路径：/api/user/getInfo**

- **是否需要token：是**

- **类型:get**

- **请求格式：**空（用token来标识用户即可）

- **响应格式（成功）：**

​	int code:200,

​	class data:

​		string userName,

​		string nickName,

​		string avatarUrl: (头像图片的url),

- **响应格式（失败）：**

​	int code:999,

​	msg:(后端可自由决定，甚至可以没有)





### 用户“我的评论”相关的接口

#### 获取“我的评论”

- **路径：/api/user/getCommentList**

- **是否需要token：是**

- **类型:get**

- **请求格式(写在查询字符串里面,解析成json时字段类型为string)：**

	numPerPage(一页多少条),

	pageIndex(第几页，从1开始数)

	

- **响应格式（成功）：**

​	int code:200,

​	class data:

​		comments:[(评论信息的列表)

​			int ID(评论的ID)，

​			string stallName,

​			string canteen(所属饭堂),

​			string dateTime(sql字符串形式),

​			float rating(评论对店铺的评分),

​			int like(该评论的点赞数)，

​			string content(评论的内容)，

​			string picture1Url,

​			string picture2Url,

​			string picture3Url,				

​		]

​		int totalPageNum(一共有页)

​		int pageIndex(具体是哪一页)

- **响应格式（失败）：**

​	int code:999,

​	msg:(后端可自由决定，甚至可以没有)



#### 删除“我的评论”

- **路径：/api/user/deleteComment**

- **是否需要token：是**

- **类型:post**

- **请求格式(写在查询字符串里面,解析成json时字段类型为string)：**

	commentID(评论的ID)

	

- **响应格式（成功）：**

​	int code:200,

- **响应格式（失败）：**

​	int code:999,

​	msg:(后端可自由决定，甚至可以没有)





### 档口信息相关的接口

#### 获取档口列表

- **路径：/api/food/getStallList**
- **是否需要token：是**
- **类型:get**
- **请求格式(写在查询字符串里面,解析成json时字段类型为string)：**

**type详细说明(用中文传输)：**

烧腊,汉堡,粉面,自选,烩饭，全部

**canteen详细说明**

榕园食堂，荔园食堂，槿园食堂，若海食堂,全部





​	type(类型：烧腊、汉堡， 默认为"全部")

​	canteen(饭堂，默认为 "全部")

​	orderBy(按照哪个进行排序:price,rating,default)

​	collation(排序规则默认按照评分:"ascend","descend","default")

​	numPerPage(每页多少个)

​	pageIndex(第几页)

- **响应格式（成功）：**

​	int code:200,

​	class data:

​		stalls:[

​			int ID(档口的ID),

​			string name,

​			float rating(评分),

​			float meanPrice(人均价格),

​			string canteent(所属饭堂的名字)，

​			string signatureDish(招牌菜的名字)，

​			string pictureUrl(档口图片的url)

​		]

​		int totalPageNum(一共有多少页)

​		int pageIndex(具体是哪一页)

- **响应格式（失败）：**

​	int code:999,

​	msg:(后端可自由决定，甚至可以没有)





#### 获取档口的详细信息

- **路径：/api/food/getStallInfo**
- **是否需要token：是**
- **类型:get**
- **请求格式(写在查询字符串里面,解析成json时字段类型为string)：**

​	stallID(档口ID)

- **响应格式（成功）：**

​	int code:200,

​	class data:

​		int ID(档口的ID),

​		string name,

​		float rating(评分),

​		float meanPrice(人均价格),

​		string introduction(简介),

​		string canteent(所属饭堂的名字)，

​		string signatureDish(招牌菜的名字)，

​		string pictureUrl(档口图片的url)

​		dishList:[(推荐菜品的列表，排序规则待定)(至多5个)

​			int ID,

​			string name,

​			float price,

​			float rating,

​			pictureUrl,

​		]

​		commentList:[(热门评论列表)（至多2个）

​			int ID(评论的ID)，

​			string reviewerName(评论人的昵称),

​			string avatarUrl(评论人头像)

​			string dateTime(sql字符串形式),

​			float rating(评论对店铺的评分),

​			int like(该评论的点赞数)，

​			string evaluation:("like"，"none")(当前用户对该评论的评价状态)

​			string content(评论的内容)，

​			string picture1Url,

​			string picture2Url,

​			string picture3Url,	

​		]



- **响应格式（失败）：**

​	int code:999,

​	msg:(后端可自由决定，甚至可以没有)



### 档口评论相关的接口

#### 获取档口的全部评论

- **路径：/api/food/getStallCommentList**
- **是否需要token：是**
- **类型:get**
- **请求格式(写在查询字符串里面,解析成json时字段类型为string)：**

​	stallID(档口ID)

​	numPerPage(一页多少个),

​	pageIndex（返回第几页）

- **响应格式（成功）：**

​	int code:200,

​	class data:

​		commentList:

​			int ID(评论的ID)，

​			string reviewerName(评论人的昵称),

​			string avatarUrl(评论人头像)

​			string dateTime(sql字符串形式),

​			float rating(评论对店铺的评分),

​			int like(该评论的点赞数)，

​			string evaluation:("like"，"none")(当前用户对该评论的评价状态)

​			string content(评论的内容)，

​			string picture1Url,

​			string picture2Url,

​			string picture3Url,	

​		]，

​		int totalPageNum(一共有多少页),

​		int pageIndex（返回的是第几页）

- **响应格式（失败）：**

​	int code:999,

​	msg:(后端可自由决定，甚至可以没有)



#### 发表对档口的评论

- **路径：/api/food/createStallComment**

- **是否需要token：是**

- **类型:post（使用formdata格式）**

- **请求格式：**

​		int stallID,

​		int rating(评论对店铺的评分(1到5)),

​		string content(评论的内容)，

​		picture1,

​		picture2,

​		picture3,	

- **响应格式（成功）：**

​	int code:200,



- **响应格式（失败）：**

​	int code:999,

​	msg:(后端可自由决定，甚至可以没有)





#### 对评论进行评价

- **路径：/api/food/evaluationComment**

- **是否需要token：是**

- **类型:post**

- **请求格式：**

​	int commentID,

​	string newEvaluation:("like","none")

- **响应格式（成功）：**

​	int code:200,



- **响应格式（失败）：**

​	int code:999,

​	msg:(后端可自由决定，甚至可以没有)



### 档口菜品相关的接口

#### 获取全部菜品列表

- **路径：/api/food/getStallDishList**

- **是否需要token：是**

- **类型:get**

- **请求格式：**

​	stallID

- **响应格式（成功）：**

​	int code:200,

​	class data:

​		dishList:[(菜品信息的列表)

​			int ID,

​			string name,

​			float price,

​			int like(点赞数),

​			int bad(踩数)，

​			string pictureUrl,

​			string evaluation:("like","bad","none")(当前用户对该菜品的评价状态)

​		]

- **响应格式（失败）：**

​	int code:999,

​	msg:(后端可自由决定，甚至可以没有)



#### 更新菜品的评价状态

- **路径：/api/food/evaluateDish**

- **是否需要token：是**

- **类型:post**

- **请求格式：**

​	int dishID,

​	string newEvaluation:("like","bad","none")

- **响应格式（成功）：**

​	int code:200,

- **响应格式（失败）：**

​	int code:999,

​	msg:(后端可自由决定，甚至可以没有)



## 服务端接口说明

**后台管理和客户端的请求响应规则一样，只是服务端的token验证失效返回997**

**管理员ID数据库中用int，网络传输用string**

### 登陆状态验证接口

#### token验证

- **路径：/api/background/checkToken**

- **说明：** 用于后台管理系统的token验证

- **是否需要token：是**

- **类型：get**

- **请求格式：**

	空

- **响应格式（成功）：**

​	int code:200,

- **响应格式（失败）：**

​	int code:997,







### 管理员信息相关接口

#### 管理员登陆

- **路径：/api/background/admin/login**

- **是否需要token：否**

- **类型：post**

- **请求格式：**

	string ID,

	string password

- **响应格式（成功）：**

	int code:200,

	class data:

	​	string token

- **响应格式（失败）：**

	int code:999,

	msg:”用户不存在”|“密码错误”



#### 管理员个人信息修改

- **路径：/api/background/admin/editInfo**

- **是否需要token：是**

- **类型：post**

- **请求格式（使用mutipart/formdata格式来传）：**

	string name,

	avatar(传图片,限制jpg和png格式，3MB一张图片),

- **响应格式（成功）：**

​	int code:200,

- **响应格式（失败）：**

​	int code:999,

​	msg:(后端可自由决定，甚至可以没有)





#### 管理员修改密码

- **路径：/api/background/admin/editPassword**

- **是否需要token：是**

- **类型：post**

- **请求格式：**

	string password

	string newPassword

- **响应格式（成功）：**

​	int code:200,

- **响应格式（失败）：**

​	int code:999,

​	msg:(后端可自由决定，甚至可以没有)





#### 获取管理员信息

- **路径：/api/background/admin/getInfo**

- **是否需要token：是**

- **类型：get**

- **请求格式：(不需要，直接token验证信息)**

	**响应格式（成功）：**


​	int code:200,

​	class data:

​		string ID,

​		string name,

​		string permission,

​		string avatarUrl,

- **响应格式（失败）：**

​	int code:999,

​	msg:(后端可自由决定，甚至可以没有)







### 用户管理相关接口

#### 获取用户信息

- **路径：/api/background/user/getUserList**

- **是否需要token：是**

- **类型：get**

- **请求格式：**

	(userName和nickName采用模糊查询，比如userName="李健",就返回userName中有“李健”的)

	string userName,（为空字符串则说明不做限制）

	string nickName,（为空字符串则说明不做限制）
	
	string status，("启用",“冻结”,"全部")

​	int numPerPage

​	int pageIndex

- **响应格式（成功）：**

​	int code:200,

​	class data:

​		userList:[

​			string userName,

​			string nickName,

​			string status(冻结，启用),

​			string avatarUrl(用户的头像的url)

​		]

​		int totalPageNum(一共有多少页)

​		int pageIndex(具体是哪一页)

- **响应格式（失败）：**

	int code:999





#### 重置用户密码

- **路径：/api/background/user/resetPassword**

- **是否需要token：是**

- **类型：post**

- **请求格式：**

	string userName

- **响应格式（成功）：**

​	int code:200,

​	data:

​		string newPassword;

- **响应格式（失败）：**

​	int code:999,

​	msg:(后端可自由决定，甚至可以没有)



#### 冻结用户账号

- **路径：/api/background/user/freezeAccount**

- **是否需要token：是**

- **类型：post**

- **请求格式：**

	string userName

- **响应格式（成功）：**

​	int code:200,

- **响应格式（失败）：**

​	int code:999,

​	msg:(后端可自由决定，甚至可以没有)





#### 解冻用户账号

- **路径：/api/background/user/defrostAccount**

- **是否需要token：是**

- **类型：post**

- **请求格式：**

	string userName

- **响应格式（成功）：**

​	int code:200,

- **响应格式（失败）：**

​	int code:999,

​	msg:(后端可自由决定，甚至可以没有)





### 档口信息相关接口

#### 获取档口列表

- **路径：/api/background/food/getStallList**
- **是否需要token：是**
- **类型:get**
- **请求格式(写在查询字符串里面,解析成json时字段类型为string)：**

**type详细说明(用中文传输)：**

烧腊,汉堡,粉面,自选,烩饭,全部

**canteen详细说明**

榕园食堂，荔园食堂，槿园食堂，若海食堂,全部

​	

​	(name改为模糊查询)

​	name（为空字符串则不做限制）

​	type(类型：烧腊、汉堡， 默认为"全部")

​	canteen(饭堂，默认为 "全部")

​	numPerPage(每页多少个)

​	pageIndex(第几页)

- **响应格式（成功）：**

​	int code:200,

​	class data:

​		stallList:[

​			int ID(档口的ID),

​			string name,

​			float rating(评分),

​			float meanPrice(人均价格),

​			string type(类型)，

​			string canteent(所属饭堂的名字)，

​			string signatureDish(招牌菜的名字)，

​			string pictureUrl(档口图片的url)

​			string introduction(介绍)

​		]

​		int totalPageNum(一共有多少页)

​		int pageIndex(具体是哪一页)

- **响应格式（失败）：**

​	int code:999,

​	msg:(后端可自由决定，甚至可以没有)



#### 新增档口

- **路径：/api/background/food/addStall**
- **是否需要token：是**
- **类型:post**
- **请求格式(使用mutipart/formdata格式来传)：**

**type详细说明(用中文传输)：**

烧腊,汉堡,粉面,自选,烩饭,default

**canteen详细说明**

榕园食堂，荔园食堂，槿园食堂，若海食堂,default



​	string name

​	string type(类型：烧腊、汉堡， 默认为"全部")

​	string canteen(饭堂，默认为 "全部")

​	string introduction（简介）

​	picture（图片）

- **响应格式（成功）：**

​	int code:200

- **响应格式（失败）：**

​	int code:999,

​	msg:(后端可自由决定，甚至可以没有)



#### 修改档口信息

- **路径：/api/background/food/editStallInfo**
- **是否需要token：是**
- **类型:post**
- **请求格式(使用mutipart/formdata格式来传)：**

**type详细说明(用中文传输)：**

烧腊,汉堡,粉面,自选,烩饭,default

**canteen详细说明**

榕园食堂，荔园食堂，槿园食堂，若海食堂,default

​	int ID（档口的id）

​	string name

​	string type(类型：烧腊、汉堡， 默认为"全部")

​	string canteen(饭堂，默认为 "全部")

​	string introduction（简介）

​	picture（图片）

- **响应格式（成功）：**

​	int code:200

- **响应格式（失败）：**

​	int code:999,

​	msg:(后端可自由决定，甚至可以没有)



#### 删除档口

- **路径：/api/background/food/deleteStall**
- **是否需要token：是**
- **类型:post**
- **请求格式：**

​	int ID(档口ID)

- **响应格式（成功）：**

​	int code:200

- **响应格式（失败）：**

​	int code:999,

​	msg:(后端可自由决定，甚至可以没有)



### 菜品信息相关接口

#### 获取全部菜品列表

- **路径：/api/background/dish/getDishList**

- **是否需要token：是**

- **类型:get**

- **请求格式：**

​	stallID

- **响应格式（成功）：**

​	int code:200,

​	class data:

​		dishList:[(菜品信息的列表)

​			int ID,

​			string name,

​			float price,

​			int like(点赞数),

​			int bad(踩数)，

​			string pictureUrl

​		]

- **响应格式（失败）：**

​	int code:999,

​	msg:(后端可自由决定，甚至可以没有) 



#### 新增菜品

- **路径：/api/background/dish/addDish**

- **是否需要token：是**

- **类型:post**

- **请求格式（使用mutipart/formdata格式来传）：**

​	int stallID,

​	string name,

​	string price,

​	picture

- **响应格式（成功）：**

​	int code:200,

- **响应格式（失败）：**

​	int code:999,

​	msg:(后端可自由决定，甚至可以没有) 





#### 编辑菜品

- **路径：/api/background/dish/editDishInfo**
- **是否需要token：是**
- **类型:post**
- **请求格式（使用mutipart/formdata格式来传）：**

​	int ID(菜品的ID)

​	string name,

​	string price,

​	picture

- **响应格式（成功）：**

​	int code:200,

- **响应格式（失败）：**

​	int code:999,

​	msg:(后端可自由决定，甚至可以没有) 





#### 删除菜品

- **路径：/api/background/dish/deleteDish**
- **是否需要token：是**
- **类型:post**
- **请求格式：**

​	int ID(菜品的ID)

- **响应格式（成功）：**

​	int code:200,

- **响应格式（失败）：**

​	int code:999,

​	msg:(后端可自由决定，甚至可以没有) 





### 管理员管理相关接口

#### 获取管理员列表

- **路径：/api/background/adminManage/getAdminList**
- **是否需要token：是**
- **类型：get**
- **请求格式：**

​	adminID（为空则表示不做限制）

​	name（为空则表示不做限制）

​	permission（权限:"普通管理员","超级管理员"，为空则表示不做限制）

​	numPerPage(每页多少个)

​	pageIndex(第几页)

- **响应格式（成功）：**

​	int code:200,

​	class data:

​		adminList:[

​			string ID,

​			string name,

​			string permission,

​			string avatarUrl

​		]

​		int totalPageNum(一共有多少页)

​		int pageIndex(具体是哪一页)

- **响应格式（失败）：**

​	int code:999,

​	msg:(后端可自由决定，甚至可以没有) 







#### 重置管理员密码

- **路径：/api/background/adminManage/resetPassword**
- **是否需要token：是**
- **类型：post**
- **请求格式：**

​	string ID

- **响应格式（成功）：**

​	int code:200,

​		class data:

​			string newPassword

- **响应格式（失败）：**

​	int code:999,

​	msg:(后端可自由决定，甚至可以没有) 





#### 删除管理员

- **路径：/api/background/adminManage/deleteAdmin**
- **是否需要token：是**
- **类型：post**
- **请求格式：**

​	string ID

- **响应格式（成功）：**

​	int code:200

- **响应格式（失败）：**

​	int code:999,

​	msg:(后端可自由决定，甚至可以没有) 





#### 新增管理员(只能新增普通管理员)

- **路径：/api/background/adminManage/addAdmin**
- **是否需要token：是**
- **类型：post**
- **请求格式：**

​	string name

- **响应格式（成功）：**

​	int code:200

​		class data:

​			string ID（新增管理员的ID）

​			string password（新增管理员的初始密码）

- **响应格式（失败）：**

​	int code:999,

​	msg:(后端可自由决定，甚至可以没有) 



