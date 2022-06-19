import instance from '../../components/axios'

export const like = (tokenId) => {
  return instance.post('/codes/like/' + tokenId)
}

export const unlike = (tokenId) => {
  return instance.delete('/codes/like/' + tokenId)
}

export const getLikes = (tokenId) => {
  return instance.get('/codes/like/' + tokenId)
}
