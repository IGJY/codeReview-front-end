import instance from '../utils/request'

export const uploadService = (file) => {

    const formData = new FormData();
    formData.append('file', file);

    return instance.post('/upload', formData)
}