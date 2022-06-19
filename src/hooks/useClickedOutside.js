import { useEffect } from 'react'

const useClickedOutside = (action, element) => {
  useEffect(() => {
    function handleClickOutside (event) {
      if (element.current && !element.current.contains(event.target)) {
        action()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [element])
}

export default useClickedOutside
