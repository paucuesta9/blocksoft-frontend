import styles from '@/styles/Forms.module.css'
import React, { useState, useRef, useEffect, useContext } from 'react'
import { Button } from '../components/SimpleComponents'
import InputFiles from '../components/InputFiles'
import Select from '../components/Select'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Placeholder from '../img/code-placeholder.png'
import { auth, getRepositories, getRepositoryFiles } from '../services/api/github'
import PopupSelectRepo from '../components/PopupSelectRepo'
import Context from '../context/UserContext'
import JSZip from 'jszip'
import useBlockchain from '../hooks/useBlockchain'
import useClickedOutside from '../hooks/useClickedOutside'
import { getLanguages } from '../services/api/languages'
import Loading from '../components/Loading'
import Tag from '../components/Tag'
import { useNavigate } from 'react-router-dom'

const CodeForm = () => {
  const inputPhoto = useRef(null)
  const repoPopup = useRef(null)
  const { repositories, setRepositories, hasGithubToken, setHasGithubToken } = useContext(Context)
  const { createNft } = useBlockchain()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [privated, setPrivated] = useState({ value: false, label: 'Public' })
  const [number, setNumber] = useState(1)
  const [language, setLanguage] = useState({ value: '', label: 'Select Language' })
  const [languages, setLanguages] = useState([])
  const [type, setType] = useState({ value: '', label: 'Select Type' })
  const [photo, setPhoto] = useState(Placeholder)
  const [photoForm, setPhotoForm] = useState('')
  const [link, setLink] = useState('')
  const [description, setDescription] = useState('')
  const [files, setFiles] = useState([])
  const [newTag, setNewTag] = useState('')
  const [tags, setTags] = useState([])
  const [selectedRepository, setSelectedRepository] = useState({ value: '', label: 'Select Repository' })

  const [showRepoPopup, setShowRepoPopup] = useState(false)

  useClickedOutside(() => setShowRepoPopup(false), repoPopup)

  const addTag = () => {
    if (newTag !== '') {
      setTags([...tags, newTag])
      setNewTag('')
    }
  }

  const handleKey = (e) => {
    e.preventDefault()
    if (e.key === 'Enter') {
      addTag()
    }
  }

  const removeTag = (index) => {
    const newTags = [...tags]
    newTags.splice(index, 1)
    setTags(newTags)
  }

  const getZipFile = async () => {
    let file = null
    if (selectedRepository.value !== '') {
      const zip = await getRepositoryFiles(selectedRepository.label)
      file = new File([zip.data], selectedRepository.label + '.zip', { type: 'application/zip' })
    } else {
      const zip = new JSZip()
      const arrayFiles = Array.from(files)
      arrayFiles.forEach(file => {
        zip.file(file.name, file)
      })
      const blob = await zip.generateAsync({ type: 'blob' })
      file = new File([blob], 'files.zip', { type: 'application/zip' })
    }
    return file
  }

  const validateForm = () => {
    if (name === '') {
      window.alert('Name is required')
      return false
    }
    if (language.value === '') {
      window.alert('Language is required')
      return false
    }
    if (files.length === 0 && selectedRepository.value === '') {
      window.alert('Files are required')
      return false
    }
    if (description === '') {
      window.alert('Description is required')
      return false
    }
    if (type === '') {
      window.alert('Type is required')
      return false
    }
    if (number === 0 || number < 0) {
      window.alert('Number of stars is required')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    if (validateForm()) {
      try {
        if (selectedRepository.value !== '') {
          const repoTopics = repositories.items.find(repo => repo.id === selectedRepository.value).topics
          setTags([...tags, ...repoTopics])
        }
        const file = await getZipFile()
        const txs = await createNft(name, privated.value, number, language.label, description, tags, photoForm, link, file, type)
        if (txs.length > 1) {
          navigate('/', { state: { message: 'Tokens created successfully' } })
        } else {
          const tokenId = txs[0].events[0].args.tokenId
          navigate(`/code/${tokenId.toNumber()}`)
        }
        setLoading(false)
      } catch (err) {
        console.log(err)
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }

  const handleUploadPhoto = () => {
    inputPhoto.current.click()
  }

  const setPhotoToFigure = () => {
    setPhotoForm(inputPhoto.current.files[0])
    const file = inputPhoto.current.files[0]
    setPhoto(URL.createObjectURL(file))
  }

  const handleGetGithubRepository = async () => {
    if (hasGithubToken === false) {
      const authWindow = window.open('https://github.com/login/oauth/authorize?client_id=86a5bb6a49c71ae0efb5&scope=repo', '_blank', 'popup')
      authWindow.addEventListener('pagehide', async () => {
        const code = window.localStorage.getItem('github_code')
        if (code) {
          try {
            await auth(code)
            setHasGithubToken(true)
            const { data: repos } = await getRepositories()
            setRepositories(repos)
            setShowRepoPopup(true)
          } catch (error) {
            console.log(error)
          }
        }
      })
    } else {
      try {
        const { data: repos } = await getRepositories()
        setRepositories(repos)
        setShowRepoPopup(true)
      } catch (error) {
        console.log(error)
      }
    }
  }

  useEffect(() => {
    getLanguages().then(languages => {
      setLanguages(languages.data.map(language => ({ value: language.id, label: language.name })))
    })
  }, [])

  return (
    <div className={styles.container}>
      {loading && <Loading />}
      {showRepoPopup && <PopupSelectRepo ref={repoPopup} setShowRepoPopup={setShowRepoPopup} selectedRepository={selectedRepository} setSelectedRepository={setSelectedRepository} />}
      <h1>Upload new item</h1>
      <form onSubmit={handleSubmit}>
        <input
          type='file'
          accept='image/*'
          ref={inputPhoto}
          onChange={setPhotoToFigure}
          style={{ display: 'none' }}
        />
        <div className={styles.gridInfo}>
          <div>
            <div className={`${styles.formGroup} ${styles.formGroupColumn}`}>
              <label htmlFor='name'>Name *</label>
              <input type='text' id='name' className={styles.max_width} onChange={(e) => setName(e.target.value)} value={name} autoComplete='off' />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor='visibility'>Visibility</label>
                {/* <Switch id='private' checked={privated} onChange={(e) => setPrivated(e.target.checked)} /> */}
                <Select
                  value={privated}
                  setValue={setPrivated}
                  options={[{ value: false, label: 'Public' }, { value: true, label: 'Private' }]}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor='number'>Number to be minted *</label>
                <input type='number' id='number' min='1' onChange={(e) => setNumber(e.target.value)} value={number} />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={`${styles.formGroup} ${styles.formGroupColumn}`}>
                <label htmlFor='language'>Language *</label>
                <Select
                  maxWidth
                  value={language}
                  setValue={setLanguage}
                  options={languages}
                  type='input'
                />
              </div>
              <div className={`${styles.formGroup} ${styles.formGroupColumn}`}>
                <label htmlFor='type'>Type *</label>
                <Select
                  maxWidth
                  value={type}
                  setValue={setType}
                  options={[{ value: 'code', label: 'Code' }, { value: 'app', label: 'App' }]}
                />
              </div>
            </div>
          </div>
          <figure onClick={() => handleUploadPhoto()}>
            <img src={photo} alt='placeholder' />
          </figure>
        </div>
        {selectedRepository.value === ''
          ? (
            <div className={`${styles.formGroup} ${styles.formGroupColumn}`}>
              <label htmlFor='code'>Upload code</label>
              <div className={styles.codeSection}>
                <InputFiles value={files} setValue={setFiles} />
                or
                <Button type='button' color='green' click={handleGetGithubRepository}>
                  <FontAwesomeIcon icon={faGithub} className={styles.icon} />
                  <span>Upload from Github repository</span>
                </Button>
              </div>
            </div>
            )
          : (
            <div className={`${styles.formGroup} ${styles.formGroupColumn}`}>
              <label htmlFor='code'>Upload code</label>
              <div className={styles.codeSection}>
                <p>Selected GitHub repository to be loaded: <span className={styles.bold}>{selectedRepository.label}</span></p>
                <Button type='button' color='green' click={handleGetGithubRepository}>
                  <FontAwesomeIcon icon={faGithub} className={styles.icon} />
                  <span>Choose other repository</span>
                </Button>
              </div>
            </div>
            )}
        <div className={`${styles.formGroup} ${styles.formGroupColumn}`}>
          <label htmlFor='link'>Link</label>
          <input type='text' id='link' className={styles.max_width} onChange={(e) => setLink(e.target.value)} value={link} autoComplete='off' />
        </div>
        <div className={`${styles.formGroup} ${styles.formGroupColumn}`}>
          <label htmlFor='description'>Description *</label>
          <textarea name='description' id='description' cols='100' rows='3' onChange={(e) => setDescription(e.target.value)} value={description} />
        </div>
        <div className={`${styles.formGroup} ${styles.formGroupColumn}`}>
          <label htmlFor='tags'>Tags</label>
          <div className={styles.tags}>
            <input type='text' id='tags' className={styles.inputTag} onKeyUp={handleKey} onChange={(e) => setNewTag(e.target.value)} value={newTag} autoComplete='off' />
            {tags.map((tag, index) => (
              <Tag key={index} tag={tag} removeTag={removeTag} index={index} />
            ))}
          </div>
        </div>
        <Button color='blue' big type='button' click={handleSubmit}>
          Create
        </Button>
      </form>
    </div>
  )
}

export default CodeForm
