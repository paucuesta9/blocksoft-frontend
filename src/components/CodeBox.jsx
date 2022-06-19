import { faChevronLeft, faDownload } from '@fortawesome/free-solid-svg-icons'
import { faFolder, faFile } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { acceptedFiles } from '../utils/acceptedFiles'
import styles from '../styles/Codebox.module.css'
import Loading from './Loading'

const CodeBox = ({ files, download }) => {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState({})
  const [parentFolders, setParentFolders] = useState([])
  const [currentFiles, setCurrentFiles] = useState(files)

  const handleFolderOpen = (folder) => {
    setCurrentFiles(folder.content)
    const newParentFolders = [...parentFolders]
    newParentFolders.push(currentFiles)
    setParentFolders(newParentFolders)
    setOpen(false)
  }

  const handleFileOpen = (file) => {
    setLoading(true)
    const newParentFolders = [...parentFolders]
    newParentFolders.push(currentFiles)
    setParentFolders(newParentFolders)
    setOpen(true)
    if (acceptedFiles.some(ext => file.name.endsWith(ext))) {
      file.content.then(fileText => {
        file.fileContent = fileText
        setFile(file)
        setLoading(false)
      })
    } else {
      setLoading(false)
      console.log('not supported')
      file.fileContent = 'Not supported'
      setFile(file)
    }
  }

  const goUpFolder = () => {
    const newParentFolders = [...parentFolders]
    if (newParentFolders.length > 0) { setCurrentFiles(newParentFolders[newParentFolders.length - 1]); setOpen(false) } else { setCurrentFiles(files); setOpen(false) }
    newParentFolders.pop()
    setParentFolders(newParentFolders)
  }

  const downloadFiles = () => {
    window.open(download, '_blank')
  }

  return (
    <div className={styles.codebox}>
      {loading && <Loading />}
      <div className={styles.header}>
        <div>
          {parentFolders.length > 0 && <FontAwesomeIcon className='icon-go-up' onClick={() => goUpFolder()} icon={faChevronLeft} />}
          <h3>{open ? file.name : 'Files'}</h3>
        </div>
        <FontAwesomeIcon onClick={downloadFiles} icon={faDownload} />
      </div>
      <div className={styles.content}>
        {open
          ? <div className={styles.file}>
            <pre>{file.fileContent?.split('\n').map(line => <code>{line}</code>)}</pre>
          </div>
          : currentFiles.length > 0
            ? (currentFiles.map((file, index) => {
                if (file.dir) {
                  return (
                    <div key={index} className={styles.codeItem} onClick={() => handleFolderOpen(file)}>
                      <div className='code-box-content-item-icon code-box-content-item-folder'>
                        <FontAwesomeIcon icon={faFolder} />
                      </div>
                      <div className='code-box-content-item-name'>
                        {file.name}
                      </div>
                    </div>
                  )
                } else {
                  return (
                    <div key={index} className={styles.codeItem} onClick={() => handleFileOpen(file)}>
                      <div className='code-box-content-item-icon code-box-content-item-file'>
                        <FontAwesomeIcon icon={faFile} />
                      </div>
                      <div className='code-box-content-item-name'>
                        {file.name}
                      </div>
                    </div>
                  )
                }
              }))
            : <div className={styles.codeItem}>No existing files</div>}
      </div>
    </div>
  )
}

export default CodeBox
