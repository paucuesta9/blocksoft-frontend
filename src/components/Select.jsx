import React, { useState, useRef } from 'react'
import styles from '@/styles/Select.module.css'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useClickedOutside from '../hooks/useClickedOutside'

const Select = ({ options, setValue, value, type = 'label', maxWidth, admitTypedValue, handleInputChanged }) => {
  const selectRef = useRef(null)
  const [isOpened, setIsOpened] = useState(false)
  const [inputValue, setInputValue] = useState(value[type])
  const [newOptions, setNewOptions] = useState(options)

  useClickedOutside(() => setIsOpened(false), selectRef)

  const handleChange = (newValue) => {
    const newOption = options.find((option) => option.value === newValue)
    setValue(newOption)
    setInputValue(newOption.label)
    setIsOpened(false)
  }

  const handleInputChange = (e) => {
    setIsOpened(true)
    setInputValue(e.target.value)
    setValue({ value: '', label: '' })
    if (handleInputChanged) {
      handleInputChanged(e.target.value)
      setNewOptions(options)
    } else {
      if (admitTypedValue) {
        setNewOptions(options.filter((option) => option.label.toLowerCase().includes(e.target.value.toLowerCase())).push({ value: e.target.value, label: e.target.value }))
      } else {
        setNewOptions(options.filter((option) => option.label.toLowerCase().includes(e.target.value.toLowerCase())))
      }
    }
  }

  return (
    <div ref={selectRef} className={`${styles.select} ${maxWidth ? styles.max_width : ''}`}>
      {type === 'input'
        ? (
          <div className={styles.selected_input}>
            <input
              type='text'
              value={inputValue}
              onChange={(e) => handleInputChange(e)}
              placeholder={value.label}
              className={styles.input}
            />
            {isOpened ? <FontAwesomeIcon className={styles.iconOpenClose} onClick={() => setIsOpened(!isOpened)} icon={faAngleUp} /> : <FontAwesomeIcon className={styles.iconOpenClose} onClick={() => setIsOpened(!isOpened)} icon={faAngleDown} />}
          </div>
          )
        : (
          <div className={styles.selected} onClick={() => setIsOpened(!isOpened)}>
            {value.image && <img src={value.image} alt={value.label} className={styles.imgOption} />}
            {value.label}
            {isOpened ? <FontAwesomeIcon icon={faAngleUp} /> : <FontAwesomeIcon icon={faAngleDown} />}
          </div>
          )}
      {isOpened && (
        <div className={styles.options}>
          {newOptions.length > 0
            ? newOptions.map(option => (
              <div className={styles.options_item} key={option.value} onClick={() => handleChange(option.value)}>
                {option.image && <img src={option.image} alt={option.label} className={styles.imgOption} />}
                {option.label}
              </div>
              ))
            : (
              <div className={styles.options_item}>
                No options
              </div>
              )}
        </div>
      )}
    </div>
  )
}

export default Select
