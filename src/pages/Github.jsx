import styles from '@/styles/General.module.css'
import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

const Github = () => {
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('code')
    window.localStorage.setItem('github_code', code)
    window.close()
  }, [searchParams])

  return (
    <div className={styles.container}>
      <h1>Success!</h1>
    </div>
  )
}

export default Github
