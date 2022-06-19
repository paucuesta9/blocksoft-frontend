const API_URL = import.meta.env.VITE_API_URL

const getImageUserURL = (publicAddress) => {
  return `${API_URL}/users/${publicAddress}/image`
}

export default getImageUserURL
