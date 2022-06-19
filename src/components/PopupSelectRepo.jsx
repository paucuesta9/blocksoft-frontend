import styles from '@/styles/LoginPopup.module.css'
import Select from './Select'
import { Button } from './SimpleComponents'
import React, { useEffect } from 'react'
import useUser from '..//hooks/useUser'

const PopupSelectRepo = ({ setShowRepoPopup, selectedRepository, setSelectedRepository }) => {
  const { repositories } = useUser()

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  })

  return (
    <div className={styles.popup}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2>Choose a repository to load</h2>
        </div>
        <div className={styles.body}>
          <Select
            options={repositories.items.map((repo) => {
              return {
                value: repo.id,
                label: repo.name
              }
            })}
            setValue={setSelectedRepository}
            value={selectedRepository}
          />
          <div className={styles.footer}>
            <Button color='blue' click={() => setShowRepoPopup(false)}>Accept</Button>
            <Button color='red' click={() => setShowRepoPopup(false)}>Cancel</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PopupSelectRepo
