<script setup lang="ts">
import { ref } from 'vue'
const textarea = ref('')
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
              <el-input class="input" v-model="textarea" style="width: 300px" :rows="30" type="textarea"
                placeholder="Please input" />
              <el-input class="input" v-model="textarea" style="width: 300px" :rows="30" type="textarea"
                placeholder="Please input" />
            </div>
          </el-row>
          <el-row class="button">
            <div>
              <el-button type="primary" @click="() => { }">Submit</el-button>
              <el-button type="primary" @click="() => { }">correct</el-button>
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
