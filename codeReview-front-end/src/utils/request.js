import axios from 'axios';
import { ElMessage } from 'element-plus';
// import { useRouter } from 'vue-router';

// const router = useRouter();
import router from '@/router'

// const tokenStore = useTokenStore()

// const baseURL = 'http://localhost:8080'
const baseURL = '/api'

export const instance = axios.create({
  baseURL: baseURL, // 替换为你的后端 API 地址
  timeout: 10000, // 请求超时时间
});
// 请求拦截器，用于在发送请求前对请求进行处理
// instance.interceptors.request.use(
//   config => {
//     //添加token
//     // if (localStorage.getItem('token')) {
//     //   console.log("请求拦截器" + localStorage.getItem('token'));
//     //   config.headers.token = localStorage.getItem('token');
//     // }
//     if (tokenStore.token) {
//       console.log("token请求拦截器" + tokenStore.token);
//       config.headers.token = tokenStore.token;
//     }
//     return config;
//   },
//   error => {
//     // 对请求错误做些什么
//     return Promise.reject(error);
//   }
// );

// 响应拦截器，用于对返回的数据进行处理
// instance.interceptors.response.use(
//   response => {
//     //判断业务状态码是否为200
//     if (response.data.code === 200) {
//       return response.data;
//     } else {
//       //操作失败
//       // alert(response.data.msg ? response.data.msg : '操作失败')
//       ElMessage.error('操作失败')
//       console.log(response.data.msg ? response.data.msg : '操作失败');
//       return Promise.reject(response.data);
//     }
//   },
//   error => {
//     // 对响应错误做些什么
//     //判断响应状态码，如果为401，提示未登录，并跳转到登录页面
//     if (error.response.status === 401) {
//       ElMessage.error('未登录，请先登录')
//       router.push('/')
//     }else{
//       ElMessage.error('服务异常')
//     }
    
//     return Promise.reject(error);
//   }
// );

export default instance;
