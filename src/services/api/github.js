import instance from '../../components/axios'

export const auth = (code) => {
  return instance.post('/github/githubAccessToken', {
    code: code
  })
}

export const getRepositories = () => {
  return instance.get('/github/githubUserRepos')
}

export const getRepositoryFiles = (repo) => {
  return instance.get(`/github/githubRepoFiles/${repo}`, {
    responseType: 'blob'
  })
}

export const createRepository = (repoName, description, privated, code) => {
  const formData = new FormData()
  formData.append('repoName', repoName)
  formData.append('description', description)
  formData.append('private', privated)
  formData.append('code', code)
  return instance.post('/github/createRepo', formData)
}
