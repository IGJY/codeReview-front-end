<script setup lang="ts">
import { ref } from 'vue'
import { uploadService, correctService } from '../api/upload.js'
const textarea = ref('')
const textarea1 = ref('')
const textarea2 = ref('')
const errorInfo = ref([]) // 存储错误信息

//上传成功的回调
const handleUploadSuccess = (response) => {

  //打印上传结果
  // console.log(JSON.stringify(response));

  console.log(JSON.stringify(response["Error(s)"], null, 2))
  // 更新错误信息
  errorInfo.value = response["Error(s)"];

  console.log(JSON.stringify(response["Score(s)"], null, 2));

  // 如果上传的结果没有错误，显示成功消息
  if (response["Error(s)"].length === 0) {
    ElMessage.success('代码没有错误')
  }


}

// 计算高亮错误行的内容
const highlightedErrors = computed(() => {
  const lines = textarea.value.split('\n');
  return lines.map((line, index) => {
    const errorLine = errorInfo.value.find(error => error.error_line === index + 1);
    // 如果是错误行，返回带样式的字符串
    return errorLine ? `<span style="color: red; background-color: #ffe6e6;">${line}</span>` : line;
  }).join('<br/>'); // 用 <br/> 来换行
});


//上传前的钩子函数，用来重命名上传之后的文件
const handleBeforeUpload = (file) => {
  // 重命名文件名为 "uploaded_code.py"
  return new File([file], 'uploaded_code.py')
}

// 文件选择后读取文件内容并显示到 textarea
const handleFileChange = (file) => {
  const reader = new FileReader()
  reader.onload = (event) => {
    textarea.value = event.target.result as string
  }
  reader.readAsText(file.raw)  // 读取文件内容
}

// 将 Python 代码内容打包为文件并上传
const handleFileUpload = async () => {
  if (!textarea.value.trim()) {
    alert("请输入 Python 代码")
    return
  }

  // 创建 Blob 对象，并将 textarea 内容作为文件内容
  const fileContent = new Blob([textarea.value], { type: 'text/plain' })
  const file = new File([fileContent], 'uploaded_code.py')

  // 读取文件内容
  //  const reader = new FileReader();
  // reader.onload = (event) => {
  //   console.log("即将要传过去的文件内容:", event.target.result); // 打印文件内容
  // };
  // reader.readAsText(file); // 读取文件内容
  // console.log("文件内容:", textarea.value);

  try {
    // 使用 uploadService 上传文件
    const response = await uploadService(file)
    handleUploadSuccess(response.data)
  } catch (error) {
    console.error("上传失败", error)
    alert("上传失败")
  }
}

//访问后端代码修正接口
const handleCorrect = async () => {

  try {
    // 使用 correctService 上传修正请求
    const response = await correctService()
    console.log(JSON.stringify(response.data.improved_items))

  } catch (error) {
    console.error("修正失败", error)
    alert("修正失败")
  }

}

</script>

<template>
  <el-container class="container">
    <el-header>Header</el-header>
    <el-main>
      <div>
        <el-row>
          <el-col span="8">
            <el-input class="input" v-model="textarea" style="width: 300px" :rows="30" type="textarea"
              placeholder="Please input" />
          </el-col>
          <el-col span="8">
            <div class="input highlighted-area" style="overflow-y: auto;">
              <!-- 其他内容，比如提示 -->
              <!-- <div>错误高亮显示区域：</div> -->
              <div v-html="highlightedErrors"></div>
            </div>
          </el-col>
          <el-col span="8">
            <el-input class="input" v-model="textarea2" style="width: 300px" :rows="30" type="textarea"
              placeholder="Please input" />
          </el-col>
            
            <!-- <el-input class="input" v-model="textarea1" style="width: 300px" :rows="30" type="textarea"
              placeholder="Please input" >
              <template #default>
                <div v-html="highlightedErrors" style="width: 300px; height: 300px; border: 1px solid #dcdfe6; overflow-y: auto; padding: 10px; white-space: pre-wrap;"></div>
              </template>
</el-input> -->
            <!-- <el-input class="input" style="width: 300px; height: 300px; overflow-y: auto;"
              placeholder="Errors will display here" readonly>
              <template #default>
                <div v-html="highlightedErrors" style="white-space: pre-wrap;"></div>
              </template>
            </el-input> -->
            <!-- <div 
              class="highlighted-errors" 
              v-html="highlightedErrors" 
              style="width: 300px; height: 300px; overflow-y: auto; border: 1px solid #dcdfe6; padding: 10px; border-radius: 4px;"
            ></div> -->
            <!-- 显示高亮错误行的区域 -->
            
            
          
        </el-row>
        <el-row class="button">
          <div>
            <!-- TODO：样式需要调整一下 -->
            <el-upload class="upload-demo" action="/api/upload" multiple :limit="1" :on-change="handleFileChange"
              :before-upload="handleBeforeUpload" :on-success="handleUploadSuccess">
              <el-button type="primary">Click to upload</el-button>
            </el-upload>
            <el-button type="primary" @click="handleFileUpload">Submit</el-button>
            <el-button type="primary" @click="handleCorrect">correct</el-button>
          </div>
        </el-row>
      </div>
    </el-main>
  </el-container>
</template>

<style scoped>
.container {
  height: 100vh;
  width: 100vw;
  /* 居中 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.input {
  margin: 20px;
  width: 300px;
  border: 1px solid #dcdfe6; /* 与 el-input 保持一致 */
  border-radius: 4px; /* 与 el-input 保持一致 */
  background-color: #f9f9f9; /* 与 el-input 保持一致 */
  padding: 10px; /*内边距*/
}

.button {
  margin: 20px;
  /* 居中 */
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 高亮错误行区域样式 */
.highlighted-area {
  height: 600px; /* 设置一个固定高度 */
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* 确保内容从顶部开始 */
}


</style>
