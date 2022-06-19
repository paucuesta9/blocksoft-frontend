import instance from '../../components/axios'

export const fetchUser = (publicAddress) => {
  return instance.get(`/users/auth?publicAddress=${publicAddress}`)
}

export const authUser = (publicAddress, signature) => {
  return instance.post('/users/auth', {
    publicAddress,
    signature
  })
}
