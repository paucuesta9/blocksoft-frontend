import instance from '../../components/axios'

export const getLanguages = () => {
  return instance.get('/languages')
}
