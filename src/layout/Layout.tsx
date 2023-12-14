import { useEffect, useRef } from 'react'
import { Main } from './Layout.styled'
import useAuth from '../hooks/useAuth'
import fetchNonce from '../utils/fetchNonce'
import fetchUserData from '../utils/fetchUserData'
import Header from '../components/header'

type LayoutProps = {
  children: React.ReactNode
}

function Layout({ children }: LayoutProps) {
  const isMounted = useRef(true)

  const { setNonce, setAuthUser } = useAuth()
  useEffect(() => {
    const fetchAndSetNonce = async () => {
      try {
        const fetchedNonce = await fetchNonce()
        setNonce(fetchedNonce)
      } catch (error) {
        console.error('Error fetching and setting nonce:', error)
      }
    }
    const fetchAndSetAuthUser = async () => {
      try {
        const fetchedUserData = await fetchUserData()
        setAuthUser(fetchedUserData)
      } catch (error) {
        console.error('Error fetching and setting user data:', error)
        setAuthUser(null)
      }
    }

    if (isMounted.current) {
      isMounted.current = false
      fetchAndSetNonce()
      fetchAndSetAuthUser()
    }
    return () => {
      isMounted.current = false
    }
  }, [])
  return (
    <>
      <Header />
      <Main>{children}</Main>
    </>
  )
}

export default Layout
