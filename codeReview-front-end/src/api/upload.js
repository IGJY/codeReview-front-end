import instance from '../utils/request'

//上传代码文件
export const uploadService = (file) => {

    const formData = new FormData();
    formData.append('file', file);

    return instance.post('/upload', formData)
}

//修正代码
export const correctService = () => {
    //用json的格式向后端发送filename
    const data = {
        "filename": "uploaded_code.py"
    }
    return instance.post('/improve', data)
}