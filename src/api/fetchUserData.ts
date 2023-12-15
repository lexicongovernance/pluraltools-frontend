import { AuthUser } from '../types/AuthUserType'

async function fetchUserData(): Promise<AuthUser | null> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/users`,
      {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

export default fetchUserData
