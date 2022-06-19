import styles from '@/styles/LoginPopup.module.css'
import Select from './Select'
import { Button } from './SimpleComponents'
import React, { useEffect, useState } from 'react'
import { searchUsers } from '../services/api/user'
import useBlockchain from '../hooks/useBlockchain'

const TransferPopup = ({ setShowTransferPopup, tokenId, setLoading }) => {
  const { transferCode } = useBlockchain()
  const [users, setUsers] = useState([])
  const [selectedTo, setSelectedTo] = useState('')

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  })

  const handleMakeTransfer = async () => {
    if (selectedTo.value === '') window.alert('Please select a user to transfer code')
    setLoading(true)
    try {
      const result = await transferCode(tokenId, selectedTo.value)
      setLoading(false)
      if (result) {
        window.alert('Trasfer successful')
        setShowTransferPopup(false)
      } else {
        window.alert('Transfer failed. Please, try again later')
      }
    } catch (e) {
      setLoading(false)
      window.alert('Transfer failed. Please, try again later')
    }
  }

  const handleInputChanged = async (newValue) => {
    try {
      const { data: newUsers } = await searchUsers(newValue)
      setUsers(newUsers.map((user) => {
        return {
          value: user.hash,
          label: user.username || user.hash
        }
      }))
    } catch (e) {
      console.log('Error while getting users')
    }
  }

  return (
    <div className={styles.popup}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2>Select or type address of user to send</h2>
        </div>
        <div className={styles.body}>
          <Select
            options={users}
            setValue={setSelectedTo}
            value={{ value: 'a', label: 'Select or type address' }}
            admitTypedValue
            type='input'
            handleInputChanged={handleInputChanged}
          />
          <div className={styles.footer}>
            <Button color='blue' click={handleMakeTransfer}>Accept</Button>
            <Button color='red' click={() => setShowTransferPopup(false)}>Cancel</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransferPopup
