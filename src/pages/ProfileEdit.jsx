import styles from '@/styles/Forms.module.css'
import React, { useState, useRef, useEffect } from 'react'
import { Button } from '../components/SimpleComponents'
import useUser from '../hooks/useUser'
import { getUser, updateUser } from '../services/api/user'
import useBlockchain from '../hooks/useBlockchain'
import getImageUserURL from '../utils/getImageUserURL'

const ProfileEdit = () => {
  const inputPhoto = useRef(null)
  const { isLogged, setUserImage, userImage } = useUser()
  const { currentAccount } = useBlockchain()

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    username: '',
    image: '',
    description: '',
    github: '',
    twitter: '',
    linkedin: '',
    website: ''
  })

  const [image, setImage] = useState(userImage)

  useEffect(() => {
    const getInfo = async () => {
      if (isLogged) {
        const { data: user } = await getUser(currentAccount)
        setProfile({
          name: user.name,
          email: user.email,
          username: user.username,
          image: user.image,
          description: user.description,
          github: user.github,
          twitter: user.twitter,
          linkedin: user.linkedin,
          website: user.website
        })
      }
    }
    getInfo()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await updateUser(currentAccount, profile)
    if (result.status === 200) {
      window.alert('Profile updated successfully')
      setUserImage('')
      const newImage = getImageUserURL(currentAccount)
      setUserImage(newImage)
    } else {
      window.alert('Error updating profile')
    }
  }

  const handleUploadPhoto = () => {
    inputPhoto.current.click()
  }

  const setPhotoToFigure = () => {
    const file = inputPhoto.current.files[0]
    setProfile({ ...profile, image: file })
    setImage(URL.createObjectURL(file))
  }

  return (
    <div className={styles.container}>
      <h1>Edit profile</h1>
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
              <label htmlFor='name'>Name</label>
              <input type='text' id='name' className={styles.max_width} onChange={(e) => setProfile({ ...profile, name: e.target.value })} value={profile.name} autoComplete='off' />
            </div>
            <div className={`${styles.formGroup} ${styles.formGroupColumn}`}>
              <label htmlFor='username'>Username</label>
              <input type='text' id='username' className={styles.max_width} onChange={(e) => setProfile({ ...profile, username: e.target.value })} value={profile.username} autoComplete='off' />
            </div>
            <div className={`${styles.formGroup} ${styles.formGroupColumn}`}>
              <label htmlFor='email'>Email</label>
              <input type='text' id='email' className={styles.max_width} onChange={(e) => setProfile({ ...profile, email: e.target.value })} value={profile.email} autoComplete='off' />
            </div>
            <div className={`${styles.formGroup} ${styles.formGroupColumn}`}>
              <label htmlFor='github'>Github</label>
              <input type='text' id='github' className={styles.max_width} onChange={(e) => setProfile({ ...profile, github: e.target.value })} value={profile.github} autoComplete='off' />
            </div>
            <div className={`${styles.formGroup} ${styles.formGroupColumn}`}>
              <label htmlFor='twitter'>Twitter</label>
              <input type='text' id='twitter' className={styles.max_width} onChange={(e) => setProfile({ ...profile, twitter: e.target.value })} value={profile.twitter} autoComplete='off' />
            </div>
            <div className={`${styles.formGroup} ${styles.formGroupColumn}`}>
              <label htmlFor='linkedin'>LinkedIn</label>
              <input type='text' id='linkedin' className={styles.max_width} onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })} value={profile.linkedin} autoComplete='off' />
            </div>
            <div className={`${styles.formGroup} ${styles.formGroupColumn}`}>
              <label htmlFor='website'>Website</label>
              <input type='text' id='website' className={styles.max_width} onChange={(e) => setProfile({ ...profile, website: e.target.value })} value={profile.website} autoComplete='off' />
            </div>
            <div className={`${styles.formGroup} ${styles.formGroupColumn}`}>
              <label htmlFor='description'>Description</label>
              <textarea type='text' id='description' className={styles.max_width} onChange={(e) => setProfile({ ...profile, description: e.target.value })} value={profile.description} />
            </div>
          </div>
          <figure className={styles.figureRound} onClick={() => handleUploadPhoto()}>
            <img src={image} alt='avatar' />
          </figure>
        </div>
        <Button color='blue' big>
          Save
        </Button>
      </form>
    </div>
  )
}

export default ProfileEdit
