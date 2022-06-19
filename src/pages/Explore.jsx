import styles from '@/styles/Explore.module.css'
import React from 'react'
import { useParams } from 'react-router-dom'
import ExploreCodeTabs from '../components/ExploreCodeTabs'

const Explore = () => {
  const { tab } = useParams()

  return (
    <main className={styles.container}>
      <h1>Explore</h1>
      <ExploreCodeTabs selectedTab={tab} />
    </main>
  )
}

export default Explore
