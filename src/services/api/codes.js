import instance from '../../components/axios'

export const codeViewed = (codeId) => {
  return instance.get('/codes/' + codeId)
}

export const getMostViewed = () => {
  return instance.get('/codes?sort=viewed')
}

export const getMostRated = () => {
  return instance.get('/codes?sort=liked')
}
