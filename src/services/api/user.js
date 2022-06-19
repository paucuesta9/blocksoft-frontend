import instance from '../../components/axios'

export const getUser = (publicAddress) => {
  return instance.get(`/users/${publicAddress}`)
}

export const searchUsers = (query) => {
  return instance.get(`/users?query=${query}`)
}

export const updateUser = (publicAddress, data) => {
  const form = new FormData()
  form.append('name', data.name)
  form.append('email', data.email)
  form.append('username', data.username)
  form.append('image', data.image)
  form.append('description', data.description)
  form.append('github', data.github)
  form.append('twitter', data.twitter)
  form.append('linkedin', data.linkedin)
  form.append('website', data.website)
  return instance.put(`/users/${publicAddress}`, form, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
