<script setup lang="ts">
import { ref } from 'vue'
import { uploadService, correctService } from '../api/upload.js' 
const textarea = ref('')
const textarea1 = ref('')
const textarea2 = ref('')

//上传成功的回调
const handleUploadSuccess = (response) => {

    //打印上传结果
    console.log(JSON.stringify(response["Error(s)"], null, 2))
    console.log(JSON.stringify(response["Score(s)"], null, 2));
    


}

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
          <div>
            <el-input class="input" v-model="textarea" style="width: 300px" :rows="30" type="textarea"
              placeholder="Please input" />
            <el-input class="input" v-model="textarea1" style="width: 300px" :rows="30" type="textarea"
              placeholder="Please input" />
            <el-input class="input" v-model="textarea2" style="width: 300px" :rows="30" type="textarea"
              placeholder="Please input" />
          </div>
        </el-row>
        <el-row class="button">
          <div>
          <!-- TODO：样式需要调整一下 -->
            <el-upload 
              class="upload-demo"
              action="/api/upload" 
              multiple 
              :limit="1" 
              :on-change="handleFileChange"
              :before-upload="handleBeforeUpload"
              :on-success="handleUploadSuccess">
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
}

.button {
  margin: 20px;
  /* 居中 */
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
