import React, { useEffect, useRef } from 'react'
import { faCloudArrowUp, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import File from '../img/file-1.svg'
import styles from '@/styles/Forms.module.css'

const InputFiles = ({ value, setValue }) => {
  const inputRef = useRef(null)
  const inputBox = useRef(null)

  useEffect(() => {
    inputBox.current.addEventListener('dragover', handleDragOver)
    inputBox.current.addEventListener('drop', handleDrop)

    return () => {
      inputBox.current.removeEventListener('dragover')
      inputBox.current.removeEventListener('drop')
    }
  }, [])

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()

    const { files } = e.dataTransfer

    if (files && files.length) {
      const newFiles = new DataTransfer()

      for (let i = 0; i < value.length; i++) {
        newFiles.items.add(value[i])
      }

      for (let i = 0; i < files.length; i++) {
        newFiles.items.add(files[i])
      }

      setValue(newFiles.items)
    }
  }

  const removeFileFromFileList = (index) => {
    const dt = new DataTransfer()

    for (let i = 0; i < value.length; i++) {
      const file = value[i]
      if (index !== i) dt.items.add(file)
    }

    setValue(dt.files)
  }

  const handleChange = (e) => {
    const files = e.target.files
    setValue(files)
  }

  const handleClick = () => {
    inputRef.current.click()
  }

  return (
    <div className={styles.codeBox}>
      <input
        type='file'
        ref={inputRef}
        onChange={handleChange}
        style={{ display: 'none' }}
        multiple
        directory=''
      />
      <div ref={inputBox} className={value.length > 0 ? styles.codeItems : styles.codeEmpty}>
        {value.length > 0
          ? Array.from(value).map((file, index) => (
            <div className={styles.codeItem} key={index}>
              <button className={styles.btnDelete} type='button' onClick={() => removeFileFromFileList(index)}><FontAwesomeIcon icon={faTimes} /></button>
              <img src={File} alt={file.name} />
              <span>{file.name}</span>
            </div>
            ))
          : <div className={styles.noCode} onClick={handleClick}>
            <FontAwesomeIcon icon={faCloudArrowUp} className={styles.iconNoCode} />
            <span>Click or drag your code here...</span>
          </div>}
      </div>
    </div>
  )
}

export default InputFiles
