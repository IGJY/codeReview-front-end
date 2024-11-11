<script setup lang="ts">
import { ref, computed } from 'vue'
import { uploadService, correctService } from '../api/upload.js'

const textarea = ref('')  // 初始代码
const textarea1 = ref('')
const textarea2 = ref('') // 最终修正的代码
const errorInfo = ref([]) // 存储错误信息
const correctedCode = ref('') // 存储修正后的代码

// 上传成功的回调
const handleUploadSuccess = (response) => {
  console.log(JSON.stringify(response["Error(s)"], null, 2))
  errorInfo.value = response["Error(s)"];

  console.log(JSON.stringify(response["Score(s)"], null, 2));

  if (response["Error(s)"].length === 0) {
    ElMessage.success('代码没有错误')
  }
}

// 计算高亮错误行的内容
const highlightedErrors = computed(() => {
  const lines = textarea.value.split('\n');
  return lines.map((line, index) => {
    const errorLine = errorInfo.value.find(error => error.error_line === index + 1);
    return errorLine ? `<span style="color: red; background-color: #ffe6e6;">${line}</span>` : line;
  }).join('<br/>');
});

// 上传前的钩子函数，用来重命名上传之后的文件
const handleBeforeUpload = (file) => {
  return new File([file], 'uploaded_code.py')
}

// 文件选择后读取文件内容并显示到 textarea
const handleFileChange = (file) => {
  const reader = new FileReader()
  reader.onload = (event) => {
    textarea.value = event.target.result as string
  }
  reader.readAsText(file.raw)
}

// 将 Python 代码内容打包为文件并上传
const handleFileUpload = async () => {
  if (!textarea.value.trim()) {
    alert("请输入 Python 代码")
    return
  }

  const fileContent = new Blob([textarea.value], { type: 'text/plain' })
  const file = new File([fileContent], 'uploaded_code.py')

  try {
    const response = await uploadService(file)
    handleUploadSuccess(response.data)
  } catch (error) {
    console.error("上传失败", error)
    alert("上传失败")
  }
}

// 访问后端代码修正接口
const handleCorrect = async () => {
  try {
    const response = await correctService()
    const improvedItems = response.data.improved_items;

    // 将原代码按行拆分成数组
    const lines = textarea.value.split('\n');

    // 根据 improved_items 中的信息更新对应的行
    improvedItems.forEach(item => {
      lines[item.error_line - 1] = item.improved_result;
    });

    // 将修正后的代码合并回字符串
    correctedCode.value = lines.join('\n');
    textarea2.value = correctedCode.value; // 更新第三个框的内容

  } catch (error) {
    console.error("修正失败", error)
    alert("修正失败")
  }
}

</script>

<template>
  <el-container class="container">
    <el-header>ezIDEA</el-header>
    <el-main>
      <div>
        <el-row>
          <el-col span="8">
            <el-input class="input" v-model="textarea" style="width: 300px" :rows="30" type="textarea"
              placeholder="Please input" />
          </el-col>
          <el-col span="8">
            <div class="input highlighted-area" style="overflow-y: auto;">
              <div v-html="highlightedErrors"></div>
            </div>
          </el-col>
          <el-col span="8">
            <el-input class="input" v-model="textarea2" style="width: 300px" :rows="30" type="textarea"
              placeholder="Corrected code will display here" />
          </el-col>
        </el-row>
        <el-row class="button">
          <div>
            <el-upload class="upload-demo" action="/api/upload" multiple :limit="1" :on-change="handleFileChange"
              :before-upload="handleBeforeUpload" :on-success="handleUploadSuccess">
              <el-button type="primary">Click to upload</el-button>
            </el-upload>
            <el-button type="primary" @click="handleFileUpload">Submit</el-button>
            <el-button type="primary" @click="handleCorrect">Correct</el-button>
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
  display: flex;
  justify-content: center;
  align-items: center;
}

.input {
  margin: 20px;
  width: 300px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #f9f9f9;
  padding: 10px;
}

.button {
  margin: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.highlighted-area {
  height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
</style>
