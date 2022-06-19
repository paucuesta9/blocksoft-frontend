import React, { useEffect, useState } from 'react'
import styles from '@/styles/CodeScreen.module.css'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Address from '../components/Address'
import Avatar from '../components/Avatar'
import { faArrowRightArrowLeft, faLink, faTerminal } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CodeBox from '../components/CodeBox'
import History from '../components/History'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import getImageUserURL from '../utils/getImageUserURL'
import { contractAddress } from '../utils/constants'
import useBlockchain from '../hooks/useBlockchain'
import { getCodeFile, getCodeFilePrivate } from '../services/blockchain/ipfs'
import JSZip from 'jszip'
import { getUser } from '../services/api/user'
import Loading from '../components/Loading'
import TransferPopup from '../components/TransferPopup'
import Tag from '../components/Tag'
import { auth, createRepository } from '../services/api/github'
import useUser from '../hooks/useUser'
import { codeViewed } from '../services/api/codes'
import { decryptFile } from '../utils/encrypt'

const CodeScreen = () => {
  const [loading, setLoading] = useState(true)
  const [showTransferPopup, setShowTransferPopup] = useState(false)
  const [code, setCode] = useState({})
  const { tokenId } = useParams()
  const { getCodeByTokenId, getHistoryFromTokenId } = useBlockchain()
  const { isLogged, hasGithubToken, setHasGithubToken, signAndLogin } = useUser()
  const navigate = useNavigate()

  function findFolderAndReturn (files, folder) {
    const found = files.find(file => file.name === folder)
    if (found) {
      return found
    }
    for (const file of files) {
      if (file.dir) {
        const found = findFolderAndReturn(file.content, folder)
        if (found) {
          return found
        }
      }
    }
  }

  function sortFiles (files) {
    files.sort((a, b) => {
      if (a.dir && !b.dir) {
        return -1
      } else if (!a.dir && b.dir) {
        return 1
      } else if (a.name < b.name) {
        return -1
      }
      return 1
    })
    for (const file of files) {
      if (file.dir) {
        sortFiles(file.content)
      }
    }
  }

  useEffect(() => {
    const fetchCode = async () => {
      try {
        codeViewed(tokenId)
        const response = await getCodeByTokenId(tokenId)
        const { data: user } = await getUser(response.owner)
        response.ownerName = user.username
        let zipFile = ''
        console.log(response)
        if (response.isPrivate) {
          const { data: codeFiles } = await getCodeFilePrivate(response.code)
          zipFile = await decryptFile(codeFiles)
          zipFile = await getCodeFile(zipFile)
          zipFile = zipFile.data
        } else {
          console.log(response.code)
          zipFile = await getCodeFile(response.code)
          zipFile = zipFile.data
          console.log(zipFile)
        }
        const history = await getHistoryFromTokenId(tokenId)
        response.history = history
        const newZip = new JSZip()

        newZip.loadAsync(zipFile)
          .then(function (zip) {
            const filesCode = []
            zip.forEach(function (relativePath, file) {
              if (file.dir) {
                const folder = findFolderAndReturn(filesCode, relativePath.split('/')[relativePath.split('/').length - 3])
                if (folder !== undefined) {
                  folder.content.push({
                    name: relativePath.split('/')[relativePath.split('/').length - 2],
                    dir: file.dir,
                    content: []
                  })
                } else {
                  filesCode.push({
                    name: relativePath.split('/')[relativePath.split('/').length - 2],
                    dir: file.dir,
                    content: []
                  })
                }
              } else {
                const folder = findFolderAndReturn(filesCode, relativePath.split('/')[relativePath.split('/').length - 2])
                if (folder !== undefined) {
                  folder.content.push({
                    name: relativePath.split('/')[relativePath.split('/').length - 1],
                    dir: false,
                    content: file.async('string')
                  })
                } else {
                  filesCode.push({
                    name: relativePath.split('/')[relativePath.split('/').length - 1],
                    dir: false,
                    content: file.async('string')
                  })
                }
              }
            })
            sortFiles(filesCode)
            response.codeZip = zipFile
            response.codeLink = response.code
            response.code = filesCode
            setCode(response)
            setLoading(false)
          })
      } catch (error) {
        if (error.reason === 'ERC721URIStorage: URI query for nonexistent token') navigate('/', { state: { message: 'NFT not found' } })
        if (error.reason === 'Not found or private') navigate('/', { state: { message: 'NFT is private' } })
        console.log(error)
        setLoading(false)
      }
    }
    fetchCode()
  }, [tokenId])

  const handleCreateRepo = async () => {
    setLoading(true)
    if (isLogged) {
      await createRepo()
    } else {
      await signAndLogin({
        callback: createRepo
      })
    }
  }

  const createRepo = async (type) => {
    if (hasGithubToken === false) {
      const authWindow = window.open('https://github.com/login/oauth/authorize?client_id=86a5bb6a49c71ae0efb5&scope=repo', '_blank', 'popup')
      authWindow.addEventListener('pagehide', async () => {
        const code = window.localStorage.getItem('github_code')
        if (code) {
          try {
            await auth(code)
            setHasGithubToken(true)
            const { data: result } = await createRepository(code.title, code.description, code.private, code.codeZip)
            setLoading(false)
            window.open(result.url, '_blank')
          } catch (error) {
            setLoading(false)
            console.log(error)
          }
        }
      })
    } else {
      try {
        const { data: result } = await createRepository(code.title, code.description, code.private, code.codeZip)
        setLoading(false)
        if (type === 'editor') {
          window.open(result.url.replace('github.com', 'github.dev'), '_blank')
        } else { window.open(result.url, '_blank') }
      } catch (error) {
        setLoading(false)
        window.alert('You already have a repository with the same name as this code.')
        console.log(error)
      }
    }
  }

  const openVsCode = async () => {
    setLoading(true)
    if (isLogged) {
      await createRepo('editor')
    } else {
      await signAndLogin({
        callback: createRepo,
        param: 'editor'
      })
    }
  }

  return (
    <div className={styles.container}>
      {loading && <Loading />}
      {showTransferPopup && <TransferPopup setLoading={setLoading} setShowTransferPopup={setShowTransferPopup} tokenId={code.id} />}
      <div className={styles.codeInfo}>
        <div className={styles.infoActions}>
          <div>
            <div className={styles.codeTitleAddress}>
              <h1>{code.title}</h1>
              <Address address={contractAddress} />
            </div>
            <Link to={`/profile/${code.owner}`} className={styles.codeTitleAddress}>
              <Avatar src={getImageUserURL(code.owner)} alt='avatar' small />
              {code.ownerName || 'undefined'}
            </Link>
          </div>
          <Actions owner={code.owner} setShowTransferPopup={setShowTransferPopup} createRepo={handleCreateRepo} openVsCode={openVsCode} />
        </div>
        <p>{code.description}</p>
        {code.link && (
          <div className={styles.socialLink}>
            <FontAwesomeIcon icon={faLink} />
            <a href={code.link} target='_blank' rel='noopener noreferrer'>{code.link}</a>
          </div>
        )}
        {code.tags && code.tags.length > 0 && (
          <div className={styles.tags}>
            {code.tags.map(tag => (
              <Tag key={tag} tag={tag} />
            ))}
          </div>
        )}
      </div>
      {code.code &&
        <CodeBox files={code.code} download={code.codeLink} />}
      {code.history && (
        <>
          <h2>History</h2>
          <History history={code.history} />
        </>)}
    </div>
  )
}

const Actions = ({ owner, setShowTransferPopup, createRepo, openVsCode }) => {
  const { currentAccount } = useBlockchain()

  return (
    <div className={styles.actions}>
      <div className={styles.acciones}>
        <button className={`${styles.action} ${styles.blue}`} onClick={openVsCode}>
          <span><FontAwesomeIcon icon={faTerminal} /> Open in VSCode</span>
        </button>
        {
          owner && owner.toLowerCase() === currentAccount.toLowerCase() &&
            <button className={`${styles.action} ${styles.green}`} onClick={() => setShowTransferPopup(true)}>
              <span><FontAwesomeIcon icon={faArrowRightArrowLeft} /> Transfer</span>
            </button>
        }
        <button className={`${styles.action} ${styles.orange}`} onClick={createRepo}>
          <span><FontAwesomeIcon icon={faGithub} /> Create repository on GitHub</span>
        </button>
      </div>
    </div>
  )
}

export default CodeScreen
