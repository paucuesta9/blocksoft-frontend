import axios from 'axios'

export const uploadFile = (file) => {
  const data = new window.FormData()
  data.append('file', file)
  return axios.post('http://127.0.0.1:5001/api/v0/add', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const getCodeFile = (address) => {
  return axios.get(address, {
    responseType: 'blob'
  })
}

export const getCodeFilePrivate = (address) => {
  return axios.get(address)
}
