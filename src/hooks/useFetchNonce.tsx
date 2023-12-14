import { useEffect, useRef, useState } from 'react'
import fetchNonce from '../utils/fetchNonce'

function useFetchNonce() {
  const isMounted = useRef(true)
  const [nonce, setNonce] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedNonce = await fetchNonce()
        setNonce(fetchedNonce)
      } catch (error) {
        console.error('Error fetching nonce:', error)
      }
    }

    if (isMounted.current) {
      isMounted.current = false
      fetchData()
    }

    return () => {
      isMounted.current = false
    }
  }, [])

  return { nonce }
}

export default useFetchNonce
